import type { CrmLead } from "@/lib/crm/types"
import { normalizeWhatsAppPhone } from "@/lib/whatsapp"

export function buildLeadCopyText(lead: CrmLead): string {
  const lines = [
    `Lead — Cosecha Creativa`,
    `Nombre: ${lead.name ?? "—"}`,
    `Empresa: ${lead.company ?? "—"}`,
    `Email: ${lead.email ?? "—"}`,
    `Tel: ${lead.phone ?? "—"}`,
    `Estado: ${lead.status}`,
    `Asignado: ${lead.assignee ?? "—"}`,
    `Interés: ${lead.serviceInterest?.join(", ") ?? "—"}`,
    `Presupuesto est.: ${lead.estimatedBudget ?? "—"}`,
    ``,
    `Resumen:`,
    lead.summary,
  ]
  if (lead.internalNotes) {
    lines.push(``, `Notas internas:`, lead.internalNotes)
  }
  return lines.join("\n")
}

export function getLeadWhatsAppHref(lead: CrmLead, customText?: string): string | null {
  if (!lead.phone?.trim()) return null
  const phone = normalizeWhatsAppPhone(lead.phone)
  const text =
    customText ??
    `Hola${lead.name ? ` ${lead.name}` : ""}, te escribe el equipo de Cosecha Creativa. `
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
}

export function allLeadTags(leads: CrmLead[]): string[] {
  const set = new Set<string>()
  for (const l of leads) {
    for (const t of l.tags) set.add(t)
  }
  return [...set].sort()
}

export function tasksDueToday(leads: CrmLead[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const out: { lead: CrmLead; task: CrmLead["tasks"][0] }[] = []
  for (const lead of leads) {
    for (const task of lead.tasks) {
      if (task.done || !task.dueAt) continue
      const d = new Date(task.dueAt)
      if (d >= today && d < tomorrow) out.push({ lead, task })
    }
  }
  return out
}

export function overdueTasks(leads: CrmLead[]) {
  const now = Date.now()
  const out: { lead: CrmLead; task: CrmLead["tasks"][0] }[] = []
  for (const lead of leads) {
    for (const task of lead.tasks) {
      if (task.done || !task.dueAt) continue
      if (new Date(task.dueAt).getTime() < now) out.push({ lead, task })
    }
  }
  return out
}
