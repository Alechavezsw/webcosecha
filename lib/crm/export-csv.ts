import type { CrmLead } from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"

function escCell(v: string | number | undefined) {
  const s = String(v ?? "")
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function leadsToCsv(leads: CrmLead[]): string {
  const headers = [
    "id",
    "nombre",
    "email",
    "telefono",
    "empresa",
    "estado",
    "fuente",
    "asignado",
    "prioridad",
    "etiquetas",
    "intereses",
    "resumen",
    "creado",
    "actualizado",
  ]
  const rows = leads.map((l) =>
    [
      l.id,
      l.name,
      l.email,
      l.phone,
      l.company,
      l.status,
      l.source,
      l.assignee,
      l.priorityScore,
      l.tags.join("|"),
      l.serviceInterest?.join("|"),
      l.summary,
      l.createdAt,
      l.updatedAt,
    ]
      .map(escCell)
      .join(","),
  )
  return [headers.join(","), ...rows].join("\n")
}

export function socialToCsv(clients: SocialClient[]): string {
  const headers = [
    "id",
    "marca",
    "contacto",
    "plan",
    "estado",
    "plataformas",
    "piezas_mes",
    "entregadas",
    "proxima_entrega",
  ]
  const rows = clients.map((c) =>
    [
      c.id,
      c.brand,
      c.contactName,
      c.plan,
      c.status,
      c.platforms.join("|"),
      c.postsPerMonth,
      c.postsDelivered,
      c.nextDelivery,
    ]
      .map(escCell)
      .join(","),
  )
  return [headers.join(","), ...rows].join("\n")
}
