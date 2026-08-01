import { rowToNotification, type NotificationRow } from "@/lib/crm/supabase-map"
import type { CrmNotification, CrmNotificationsStore } from "@/lib/crm/types"
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin"
import { randomUUID } from "crypto"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "crm", "notifications.json")

async function ensureFileStore(): Promise<CrmNotificationsStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as CrmNotificationsStore
    if (!parsed?.items) return { items: [] }
    return parsed
  } catch {
    return { items: [] }
  }
}

async function saveFileStore(store: CrmNotificationsStore) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
}

export async function listNotifications(limit = 50): Promise<CrmNotification[]> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data, error } = await sb
      .from("crm_notifications")
      .select("*")
      .order("at", { ascending: false })
      .limit(limit)
    if (error) throw error
    return ((data ?? []) as NotificationRow[]).map(rowToNotification)
  }

  const store = await ensureFileStore()
  return store.items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit)
}

export async function addNotification(
  n: Omit<CrmNotification, "id" | "at" | "read">,
): Promise<CrmNotification> {
  const item: CrmNotification = {
    ...n,
    id: randomUUID(),
    at: new Date().toISOString(),
    read: false,
  }

  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { error } = await sb.from("crm_notifications").insert({
      id: item.id,
      at: item.at,
      type: item.type,
      lead_id: item.leadId ?? null,
      title: item.title,
      body: item.body,
      read: item.read,
      channels: item.channels,
    })
    if (error) throw error
    return item
  }

  const store = await ensureFileStore()
  store.items.unshift(item)
  store.items = store.items.slice(0, 200)
  await saveFileStore(store)
  return item
}

export async function markNotificationRead(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { error } = await sb.from("crm_notifications").update({ read: true }).eq("id", id)
    if (error) throw error
    return
  }

  const store = await ensureFileStore()
  const item = store.items.find((i) => i.id === id)
  if (item) item.read = true
  await saveFileStore(store)
}

export async function markAllNotificationsRead(): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { error } = await sb.from("crm_notifications").update({ read: true }).eq("read", false)
    if (error) throw error
    return
  }

  const store = await ensureFileStore()
  for (const i of store.items) i.read = true
  await saveFileStore(store)
}

export async function unreadNotificationCount(): Promise<number> {
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { count, error } = await sb
      .from("crm_notifications")
      .select("*", { count: "exact", head: true })
      .eq("read", false)
    if (error) throw error
    return count ?? 0
  }

  const store = await ensureFileStore()
  return store.items.filter((i) => !i.read).length
}
