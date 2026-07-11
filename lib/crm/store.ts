import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { onLeadStatusChange } from "@/lib/crm/automations"
import { normalizeLead } from "@/lib/crm/migrate"
import type { CrmHistoryEntry, CrmLead, CrmStore, LeadStatus } from "@/lib/crm/types"
import { randomUUID } from "crypto"

const DATA_DIR = path.join(process.cwd(), "data", "crm")
const DATA_FILE = path.join(DATA_DIR, "leads.json")

async function ensureStore(): Promise<CrmStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as CrmStore
    if (!parsed?.leads || !Array.isArray(parsed.leads)) return { leads: [] }
    return { leads: parsed.leads.map(normalizeLead) }
  } catch {
    await mkdir(DATA_DIR, { recursive: true })
    const empty: CrmStore = { leads: [] }
    await writeFile(DATA_FILE, JSON.stringify(empty, null, 2), "utf8")
    return empty
  }
}

async function saveStore(store: CrmStore) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
}

export function pushHistory(
  lead: CrmLead,
  type: CrmHistoryEntry["type"],
  text: string,
): CrmLead {
  lead.history.push({
    id: randomUUID(),
    at: new Date().toISOString(),
    type,
    text,
  })
  return lead
}

export async function listLeads(): Promise<CrmLead[]> {
  const store = await ensureStore()
  return store.leads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export async function getLeadBySessionId(sessionId: string): Promise<CrmLead | undefined> {
  const store = await ensureStore()
  const lead = store.leads.find((l) => l.sessionId === sessionId)
  return lead ? normalizeLead(lead) : undefined
}

export async function getLeadById(id: string): Promise<CrmLead | undefined> {
  const store = await ensureStore()
  const lead = store.leads.find((l) => l.id === id)
  return lead ? normalizeLead(lead) : undefined
}

export async function upsertLead(lead: CrmLead): Promise<CrmLead> {
  const store = await ensureStore()
  const normalized = normalizeLead(lead)
  const idx = store.leads.findIndex((l) => l.id === normalized.id)
  if (idx >= 0) store.leads[idx] = normalized
  else store.leads.push(normalized)
  await saveStore(store)
  return normalized
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<CrmLead | null> {
  return updateLead(id, { status })
}

export type LeadPatch = Partial<
  Pick<
    CrmLead,
    | "status"
    | "assignee"
    | "tags"
    | "internalNotes"
    | "estimatedBudget"
    | "objections"
    | "tasks"
    | "proposals"
    | "lastContactedAt"
    | "priorityScore"
    | "priorityReason"
  >
>

export async function updateLead(id: string, patch: LeadPatch): Promise<CrmLead | null> {
  const store = await ensureStore()
  const lead = store.leads.find((l) => l.id === id)
  if (!lead) return null

  const prevStatus = lead.status
  Object.assign(lead, patch, { updatedAt: new Date().toISOString() })
  const normalized = normalizeLead(lead)
  const idx = store.leads.findIndex((l) => l.id === id)
  store.leads[idx] = normalized
  await saveStore(store)

  if (patch.status && patch.status !== prevStatus) {
    return onLeadStatusChange(normalized, prevStatus)
  }
  return normalized
}
