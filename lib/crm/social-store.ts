import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { normalizeSocialClient } from "@/lib/crm/migrate"
import { DEFAULT_SOCIAL_CLIENTS } from "@/lib/crm/social-seed"
import type { SocialClient, SocialClientsStore } from "@/lib/crm/social-types"

const DATA_DIR = path.join(process.cwd(), "data", "crm")
const DATA_FILE = path.join(DATA_DIR, "social-clients.json")

async function ensureStore(): Promise<SocialClientsStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as SocialClientsStore
    if (!parsed?.clients || !Array.isArray(parsed.clients)) {
      return seedAndSave()
    }
    return { clients: parsed.clients.map(normalizeSocialClient) }
  } catch {
    return seedAndSave()
  }
}

async function seedAndSave(): Promise<SocialClientsStore> {
  const store: SocialClientsStore = { clients: DEFAULT_SOCIAL_CLIENTS }
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
  return store
}

async function saveStore(store: SocialClientsStore) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
}

export async function listSocialClients(): Promise<SocialClient[]> {
  const store = await ensureStore()
  return store.clients.sort((a, b) => {
    const order = { activo: 0, onboarding: 1, pausa: 2 }
    const diff = order[a.status] - order[b.status]
    if (diff !== 0) return diff
    return a.brand.localeCompare(b.brand, "es")
  })
}

export async function upsertSocialClient(client: SocialClient): Promise<SocialClient> {
  const store = await ensureStore()
  const idx = store.clients.findIndex((c) => c.id === client.id)
  if (idx >= 0) store.clients[idx] = client
  else store.clients.push(client)
  await saveStore(store)
  return client
}

export async function updateSocialClient(
  id: string,
  patch: Partial<
    Pick<
      SocialClient,
      | "status"
      | "notes"
      | "postsDelivered"
      | "nextDelivery"
      | "tags"
      | "editorial"
      | "metrics"
    >
  >,
): Promise<SocialClient | null> {
  const store = await ensureStore()
  const client = store.clients.find((c) => c.id === id)
  if (!client) return null
  Object.assign(client, patch, { updatedAt: new Date().toISOString() })
  await saveStore(store)
  return client
}

export async function deleteSocialClient(id: string): Promise<boolean> {
  const store = await ensureStore()
  const before = store.clients.length
  store.clients = store.clients.filter((c) => c.id !== id)
  if (store.clients.length === before) return false
  await saveStore(store)
  return true
}
