import type {
  CrmHistoryEntry,
  CrmLead,
  CrmMessage,
  CrmNotification,
  CrmProposal,
  CrmTask,
  LeadStatus,
} from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"

export type LeadRow = {
  id: string
  session_id: string
  created_at: string
  updated_at: string
  status: string
  source: string
  name: string | null
  email: string | null
  phone: string | null
  company: string | null
  service_interest: string[] | null
  summary: string
  assignee: string | null
  tags: string[] | null
  internal_notes: string
  estimated_budget: string | null
  objections: string | null
  last_contacted_at: string | null
  automation_flags: string[] | null
  priority_score: number | null
  priority_reason: string | null
  proposals: CrmProposal[] | unknown
}

export type MessageRow = {
  id: string
  lead_id: string
  role: "user" | "assistant"
  text: string
  created_at: string
}

export type TaskRow = {
  id: string
  lead_id: string
  title: string
  due_at: string | null
  done: boolean
  created_at: string
  ai_suggested: boolean
}

export type HistoryRow = {
  id: string
  lead_id: string
  at: string
  type: CrmHistoryEntry["type"]
  text: string
}

export type NotificationRow = {
  id: string
  at: string
  type: CrmNotification["type"]
  lead_id: string | null
  title: string
  body: string
  read: boolean
  channels: string[] | null
}

export type SocialRow = {
  id: string
  brand: string
  contact_name: string | null
  contact_phone: string | null
  platforms: string[] | null
  plan: string | null
  status: string
  posts_per_month: number | null
  posts_delivered: number | null
  next_delivery: string | null
  notes: string | null
  tags: string[] | null
  editorial: unknown
  metrics: unknown
  created_at: string
  updated_at: string
}

export function leadToRow(lead: CrmLead): LeadRow {
  return {
    id: lead.id,
    session_id: lead.sessionId,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    status: lead.status,
    source: lead.source,
    name: lead.name ?? null,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    company: lead.company ?? null,
    service_interest: lead.serviceInterest ?? [],
    summary: lead.summary ?? "",
    assignee: lead.assignee ?? "Sin asignar",
    tags: lead.tags ?? [],
    internal_notes: lead.internalNotes ?? "",
    estimated_budget: lead.estimatedBudget ?? null,
    objections: lead.objections ?? null,
    last_contacted_at: lead.lastContactedAt ?? null,
    automation_flags: lead.automationFlags ?? [],
    priority_score: lead.priorityScore ?? 50,
    priority_reason: lead.priorityReason ?? "",
    proposals: lead.proposals ?? [],
  }
}

export function rowToLead(
  row: LeadRow,
  messages: MessageRow[] = [],
  tasks: TaskRow[] = [],
  history: HistoryRow[] = [],
): CrmLead {
  return {
    id: row.id,
    sessionId: row.session_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status as LeadStatus,
    source: row.source,
    name: row.name ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    company: row.company ?? undefined,
    serviceInterest: row.service_interest ?? undefined,
    summary: row.summary ?? "",
    assignee: row.assignee ?? "Sin asignar",
    tags: row.tags ?? [],
    internalNotes: row.internal_notes ?? "",
    estimatedBudget: row.estimated_budget ?? undefined,
    objections: row.objections ?? undefined,
    lastContactedAt: row.last_contacted_at ?? undefined,
    automationFlags: row.automation_flags ?? [],
    priorityScore: row.priority_score ?? 50,
    priorityReason: row.priority_reason ?? "",
    proposals: (Array.isArray(row.proposals) ? row.proposals : []) as CrmProposal[],
    messages: messages
      .slice()
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map(
        (m): CrmMessage => ({
          id: m.id,
          role: m.role,
          text: m.text,
          createdAt: m.created_at,
        }),
      ),
    tasks: tasks.map(
      (t): CrmTask => ({
        id: t.id,
        title: t.title,
        dueAt: t.due_at ?? undefined,
        done: t.done,
        createdAt: t.created_at,
        aiSuggested: t.ai_suggested,
      }),
    ),
    history: history
      .slice()
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
      .map(
        (h): CrmHistoryEntry => ({
          id: h.id,
          at: h.at,
          type: h.type,
          text: h.text,
        }),
      ),
  }
}

export function rowToNotification(row: NotificationRow): CrmNotification {
  return {
    id: row.id,
    at: row.at,
    type: row.type,
    leadId: row.lead_id ?? undefined,
    title: row.title,
    body: row.body,
    read: row.read,
    channels: (row.channels ?? ["in_app"]) as CrmNotification["channels"],
  }
}

export function rowToSocial(row: SocialRow): SocialClient {
  return {
    id: row.id,
    brand: row.brand,
    contactName: row.contact_name ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    platforms: (row.platforms ?? []) as SocialClient["platforms"],
    plan: (row.plan ?? "esencial") as SocialClient["plan"],
    status: row.status as SocialClient["status"],
    postsPerMonth: row.posts_per_month ?? 0,
    postsDelivered: row.posts_delivered ?? 0,
    nextDelivery: row.next_delivery ?? undefined,
    notes: row.notes ?? undefined,
    tags: row.tags ?? [],
    editorial: Array.isArray(row.editorial) ? (row.editorial as SocialClient["editorial"]) : [],
    metrics: row.metrics && typeof row.metrics === "object" ? (row.metrics as SocialClient["metrics"]) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function socialToRow(client: SocialClient): SocialRow {
  return {
    id: client.id,
    brand: client.brand,
    contact_name: client.contactName ?? null,
    contact_phone: client.contactPhone ?? null,
    platforms: client.platforms ?? [],
    plan: client.plan,
    status: client.status,
    posts_per_month: client.postsPerMonth,
    posts_delivered: client.postsDelivered,
    next_delivery: client.nextDelivery ?? null,
    notes: client.notes ?? null,
    tags: client.tags ?? [],
    editorial: client.editorial ?? [],
    metrics: client.metrics ?? null,
    created_at: client.createdAt,
    updated_at: client.updatedAt,
  }
}
