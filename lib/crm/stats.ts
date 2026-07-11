import type { CrmLead } from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"

export function computeLeadStats(leads: CrmLead[]) {
  const now = Date.now()
  const weekAgo = now - 7 * 86400000

  const nuevosSemana = leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length
  const ganados = leads.filter((l) => l.status === "ganado").length
  const activos = leads.filter((l) => !["ganado", "perdido"].includes(l.status)).length
  const conversion = leads.length > 0 ? Math.round((ganados / leads.length) * 100) : 0

  const bySource: Record<string, number> = {}
  for (const l of leads) {
    bySource[l.source] = (bySource[l.source] ?? 0) + 1
  }

  const byService: Record<string, number> = {}
  for (const l of leads) {
    for (const s of l.serviceInterest ?? []) {
      byService[s] = (byService[s] ?? 0) + 1
    }
  }

  return {
    total: leads.length,
    nuevosSemana,
    ganados,
    activos,
    conversion,
    bySource,
    byService,
  }
}

export function computeSocialStats(clients: SocialClient[]) {
  const activos = clients.filter((c) => c.status === "activo").length
  const onboarding = clients.filter((c) => c.status === "onboarding").length
  const postsPendientes = clients.reduce(
    (acc, c) => acc + Math.max(0, c.postsPerMonth - c.postsDelivered),
    0,
  )
  const proximasEntregas = clients
    .filter((c) => c.nextDelivery && c.status !== "pausa")
    .sort(
      (a, b) =>
        new Date(a.nextDelivery!).getTime() - new Date(b.nextDelivery!).getTime(),
    )
    .slice(0, 5)

  return { activos, onboarding, total: clients.length, postsPendientes, proximasEntregas }
}

export function computePipelineRevenue(leads: CrmLead[]) {
  let pipeline = 0
  let won = 0
  let sent = 0
  for (const l of leads) {
    for (const p of l.proposals) {
      if (p.status === "aceptado") won += p.amount
      else if (p.status === "enviado") {
        sent += p.amount
        pipeline += p.amount
      } else if (p.status === "borrador") pipeline += p.amount * 0.5
    }
  }
  return { pipeline: Math.round(pipeline), won: Math.round(won), sent: Math.round(sent) }
}

export function computeFunnel(leads: CrmLead[]) {
  const statuses = ["nuevo", "contactado", "calificado", "ganado", "perdido"] as const
  return statuses.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }))
}

export type ActivityItem = {
  id: string
  at: string
  leadId: string
  leadName: string
  type: string
  text: string
}

export function collectRecentActivity(leads: CrmLead[], limit = 15): ActivityItem[] {
  const items: ActivityItem[] = []
  for (const lead of leads) {
    for (const h of lead.history) {
      items.push({
        id: h.id,
        at: h.at,
        leadId: lead.id,
        leadName: lead.name || lead.email || "Lead",
        type: h.type,
        text: h.text,
      })
    }
    items.push({
      id: `created-${lead.id}`,
      at: lead.createdAt,
      leadId: lead.id,
      leadName: lead.name || lead.email || "Lead",
      type: "lead",
      text: "Nuevo lead del chat",
    })
  }
  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit)
}

export function findDuplicateLeads(leads: CrmLead[]): { lead: CrmLead; duplicates: CrmLead[] }[] {
  const out: { lead: CrmLead; duplicates: CrmLead[] }[] = []
  const seen = new Map<string, CrmLead[]>()

  const key = (l: CrmLead) => {
    const email = l.email?.toLowerCase().trim()
    const phone = l.phone?.replace(/\D/g, "")
    if (email) return `e:${email}`
    if (phone && phone.length >= 8) return `p:${phone}`
    return null
  }

  for (const l of leads) {
    const k = key(l)
    if (!k) continue
    const group = seen.get(k) ?? []
    group.push(l)
    seen.set(k, group)
  }

  for (const group of seen.values()) {
    if (group.length < 2) continue
    const [first, ...rest] = group.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    out.push({ lead: first, duplicates: rest })
  }
  return out
}
