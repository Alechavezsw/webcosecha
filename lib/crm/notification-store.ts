import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import type { CrmNotification, CrmNotificationsStore } from "@/lib/crm/types"
import { randomUUID } from "crypto"

const DATA_FILE = path.join(process.cwd(), "data", "crm", "notifications.json")

async function ensureStore(): Promise<CrmNotificationsStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as CrmNotificationsStore
    if (!parsed?.items) return { items: [] }
    return parsed
  } catch {
    return { items: [] }
  }
}

async function saveStore(store: CrmNotificationsStore) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
}

export async function listNotifications(limit = 50): Promise<CrmNotification[]> {
  const store = await ensureStore()
  return store.items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit)
}

export async function addNotification(
  n: Omit<CrmNotification, "id" | "at" | "read">,
): Promise<CrmNotification> {
  const store = await ensureStore()
  const item: CrmNotification = {
    ...n,
    id: randomUUID(),
    at: new Date().toISOString(),
    read: false,
  }
  store.items.unshift(item)
  store.items = store.items.slice(0, 200)
  await saveStore(store)
  return item
}

export async function markNotificationRead(id: string): Promise<void> {
  const store = await ensureStore()
  const item = store.items.find((i) => i.id === id)
  if (item) item.read = true
  await saveStore(store)
}

export async function markAllNotificationsRead(): Promise<void> {
  const store = await ensureStore()
  for (const i of store.items) i.read = true
  await saveStore(store)
}

export async function unreadNotificationCount(): Promise<number> {
  const store = await ensureStore()
  return store.items.filter((i) => !i.read).length
}
