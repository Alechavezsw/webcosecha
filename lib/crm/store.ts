import { onLeadStatusChange } from "@/lib/crm/automations"
import { normalizeLead } from "@/lib/crm/migrate"
import {
  leadToRow,
  rowToLead,
  type HistoryRow,
  type LeadRow,
  type MessageRow,
  type TaskRow,
} from "@/lib/crm/supabase-map"
import type { CrmHistoryEntry, CrmLead, LeadStatus } from "@/lib/crm/types"
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  supabaseConfigError,
} from "@/lib/supabase/admin"
import { randomUUID } from "crypto"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "crm")
const DATA_FILE = path.join(DATA_DIR, "leads.json")

type FileStore = { leads: CrmLead[] }

function assertDbReady() {
  const err = supabaseConfigError()
  if (err) throw new Error(err)
  if (process.env.VERCEL && !isSupabaseConfigured()) {
    throw new Error(
      "En Vercel hace falta Supabase (SUPABASE_SERVICE_ROLE_KEY o SUPABASE_CRM_EMAIL/PASSWORD).",
    )
  }
}

async function ensureFileStore(): Promise<FileStore> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as FileStore
    if (!parsed?.leads || !Array.isArray(parsed.leads)) return { leads: [] }
    return { leads: parsed.leads.map(normalizeLead) }
  } catch {
    await mkdir(DATA_DIR, { recursive: true })
    const empty: FileStore = { leads: [] }
    await writeFile(DATA_FILE, JSON.stringify(empty, null, 2), "utf8")
    return empty
  }
}

async function saveFileStore(store: FileStore) {
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

async function hydrateLeads(rows: LeadRow[]): Promise<CrmLead[]> {
  const sb = await getSupabaseAdmin()
  if (!sb || rows.length === 0) return rows.map((r) => normalizeLead(rowToLead(r)))

  const ids = rows.map((r) => r.id)
  const [{ data: messages }, { data: tasks }, { data: history }] = await Promise.all([
    sb.from("crm_messages").select("*").in("lead_id", ids),
    sb.from("crm_tasks").select("*").in("lead_id", ids),
    sb.from("crm_history").select("*").in("lead_id", ids),
  ])

  const msgs = (messages ?? []) as MessageRow[]
  const tsks = (tasks ?? []) as TaskRow[]
  const hist = (history ?? []) as HistoryRow[]

  return rows.map((row) =>
    normalizeLead(
      rowToLead(
        row,
        msgs.filter((m) => m.lead_id === row.id),
        tsks.filter((t) => t.lead_id === row.id),
        hist.filter((h) => h.lead_id === row.id),
      ),
    ),
  )
}

async function syncChildren(lead: CrmLead) {
  const sb = await getSupabaseAdmin()
  if (!sb) throw new Error("Supabase no configurado")

  const messageRows = lead.messages.map((m) => ({
    id: m.id,
    lead_id: lead.id,
    role: m.role,
    text: m.text,
    created_at: m.createdAt,
  }))
  const taskRows = lead.tasks.map((t) => ({
    id: t.id,
    lead_id: lead.id,
    title: t.title,
    due_at: t.dueAt ?? null,
    done: t.done,
    created_at: t.createdAt,
    ai_suggested: Boolean(t.aiSuggested),
  }))
  const historyRows = lead.history.map((h) => ({
    id: h.id,
    lead_id: lead.id,
    at: h.at,
    type: h.type,
    text: h.text,
  }))

  await Promise.all([
    sb.from("crm_messages").delete().eq("lead_id", lead.id),
    sb.from("crm_tasks").delete().eq("lead_id", lead.id),
    sb.from("crm_history").delete().eq("lead_id", lead.id),
  ])

  if (messageRows.length) {
    const { error } = await sb.from("crm_messages").insert(messageRows)
    if (error) throw error
  }
  if (taskRows.length) {
    const { error } = await sb.from("crm_tasks").insert(taskRows)
    if (error) throw error
  }
  if (historyRows.length) {
    const { error } = await sb.from("crm_history").insert(historyRows)
    if (error) throw error
  }
}

export async function listLeads(): Promise<CrmLead[]> {
  assertDbReady()
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data, error } = await sb
      .from("crm_leads")
      .select("*")
      .order("updated_at", { ascending: false })
    if (error) throw error
    return hydrateLeads((data ?? []) as LeadRow[])
  }

  const store = await ensureFileStore()
  return store.leads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export async function getLeadBySessionId(sessionId: string): Promise<CrmLead | undefined> {
  assertDbReady()
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data, error } = await sb
      .from("crm_leads")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle()
    if (error) throw error
    if (!data) return undefined
    const [lead] = await hydrateLeads([data as LeadRow])
    return lead
  }

  const store = await ensureFileStore()
  const lead = store.leads.find((l) => l.sessionId === sessionId)
  return lead ? normalizeLead(lead) : undefined
}

export async function getLeadById(id: string): Promise<CrmLead | undefined> {
  assertDbReady()
  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { data, error } = await sb.from("crm_leads").select("*").eq("id", id).maybeSingle()
    if (error) throw error
    if (!data) return undefined
    const [lead] = await hydrateLeads([data as LeadRow])
    return lead
  }

  const store = await ensureFileStore()
  const lead = store.leads.find((l) => l.id === id)
  return lead ? normalizeLead(lead) : undefined
}

export async function upsertLead(lead: CrmLead): Promise<CrmLead> {
  assertDbReady()
  const normalized = normalizeLead(lead)

  if (isSupabaseConfigured()) {
    const sb = await getSupabaseAdmin()
    if (!sb) throw new Error("Supabase no configurado")
    const { error } = await sb.from("crm_leads").upsert(leadToRow(normalized), { onConflict: "id" })
    if (error) throw error
    await syncChildren(normalized)
    return normalized
  }

  const store = await ensureFileStore()
  const idx = store.leads.findIndex((l) => l.id === normalized.id)
  if (idx >= 0) store.leads[idx] = normalized
  else store.leads.push(normalized)
  await saveFileStore(store)
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
  const existing = await getLeadById(id)
  if (!existing) return null

  const prevStatus = existing.status
  const next = normalizeLead({
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  })

  await upsertLead(next)

  if (patch.status && patch.status !== prevStatus) {
    return onLeadStatusChange(next, prevStatus)
  }
  return next
}
