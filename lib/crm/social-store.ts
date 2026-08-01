import { normalizeSocialClient } from "@/lib/crm/migrate"
import { DEFAULT_SOCIAL_CLIENTS } from "@/lib/crm/social-seed"
import { rowToSocial, socialToRow, type SocialRow } from "@/lib/crm/supabase-map"
import type { SocialClient, SocialClientsStore } from "@/lib/crm/social-types"
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "crm")
const DATA_FILE = path.join(DATA_DIR, "social-clients.json")

async function ensureFileStore(): Promise<SocialClientsStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as SocialClientsStore
    if (!parsed?.clients || !Array.isArray(parsed.clients)) {
      return seedAndSaveFile()
    }
    return { clients: parsed.clients.map(normalizeSocialClient) }
  } catch {
    return seedAndSaveFile()
  }
}

async function seedAndSaveFile(): Promise<SocialClientsStore> {
  const store: SocialClientsStore = { clients: DEFAULT_SOCIAL_CLIENTS }
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
  return store
}

async function saveFileStore(store: SocialClientsStore) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
}

function sortClients(clients: SocialClient[]): SocialClient[] {
  return clients.sort((a, b) => {
    const order = { activo: 0, onboarding: 1, pausa: 2 }
    const diff = order[a.status] - order[b.status]
    if (diff !== 0) return diff
    return a.brand.localeCompare(b.brand, "es")
  })
}

export async function listSocialClients(): Promise<SocialClient[]> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data, error } = await sb.from("crm_social_clients").select("*")
    if (error) throw error
    const clients = ((data ?? []) as SocialRow[]).map((r) => normalizeSocialClient(rowToSocial(r)))
    if (clients.length === 0) {
      for (const c of DEFAULT_SOCIAL_CLIENTS) {
        await upsertSocialClient(c)
      }
      return sortClients([...DEFAULT_SOCIAL_CLIENTS])
    }
    return sortClients(clients)
  }

  const store = await ensureFileStore()
  return sortClients(store.clients)
}

export async function upsertSocialClient(client: SocialClient): Promise<SocialClient> {
  const normalized = normalizeSocialClient(client)

  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { error } = await sb.from("crm_social_clients").upsert(socialToRow(normalized), {
      onConflict: "id",
    })
    if (error) throw error
    return normalized
  }

  const store = await ensureFileStore()
  const idx = store.clients.findIndex((c) => c.id === normalized.id)
  if (idx >= 0) store.clients[idx] = normalized
  else store.clients.push(normalized)
  await saveFileStore(store)
  return normalized
}

export async function updateSocialClient(
  id: string,
  patch: Partial<
    Pick<
      SocialClient,
      | "status"
      | "notes"
      | "postsDelivered"
      | "tags"
      | "editorial"
      | "metrics"
    >
  > & { nextDelivery?: string | null },
): Promise<SocialClient | null> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data: existing, error: readErr } = await sb
      .from("crm_social_clients")
      .select("*")
      .eq("id", id)
      .maybeSingle()
    if (readErr) throw readErr
    if (!existing) return null

    const current = normalizeSocialClient(rowToSocial(existing as SocialRow))
    const next = normalizeSocialClient({
      ...current,
      ...patch,
      nextDelivery: patch.nextDelivery === null ? undefined : (patch.nextDelivery ?? current.nextDelivery),
      updatedAt: new Date().toISOString(),
    })
    return upsertSocialClient(next)
  }

  const store = await ensureFileStore()
  const client = store.clients.find((c) => c.id === id)
  if (!client) return null
  Object.assign(client, patch, {
    nextDelivery: patch.nextDelivery === null ? undefined : patch.nextDelivery ?? client.nextDelivery,
    updatedAt: new Date().toISOString(),
  })
  await saveFileStore(store)
  return client
}

export async function deleteSocialClient(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data, error } = await sb.from("crm_social_clients").delete().eq("id", id).select("id")
    if (error) throw error
    return (data?.length ?? 0) > 0
  }

  const store = await ensureFileStore()
  const before = store.clients.length
  store.clients = store.clients.filter((c) => c.id !== id)
  if (store.clients.length === before) return false
  await saveFileStore(store)
  return true
}
