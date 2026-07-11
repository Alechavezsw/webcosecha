import type { LeadStatus } from "@/lib/crm/types"
import type { SocialClientStatus, SocialPlan } from "@/lib/crm/social-types"

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  perdido: "Perdido",
  ganado: "Ganado",
}

export const STATUS_STYLE: Record<
  LeadStatus,
  { dot: string; border: string; bg: string; text: string }
> = {
  nuevo: {
    dot: "bg-cyan-400",
    border: "border-cyan-400/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
  },
  contactado: {
    dot: "bg-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    text: "text-amber-200",
  },
  calificado: {
    dot: "bg-[#eca8d6]",
    border: "border-[#eca8d6]/40",
    bg: "bg-[#eca8d6]/12",
    text: "text-[#f5d4ea]",
  },
  perdido: {
    dot: "bg-zinc-500",
    border: "border-zinc-500/30",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
  },
  ganado: {
    dot: "bg-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-200",
  },
}

/** Columnas del tablero Kanban (sin perdido — va al archivo) */
export const KANBAN_STATUSES: LeadStatus[] = [
  "nuevo",
  "contactado",
  "calificado",
  "ganado",
]

export const SOURCE_LABEL: Record<string, string> = {
  "web-widget": "Chat web",
  "ia-robot": "Robot IA",
}

export const SOCIAL_STATUS_LABEL: Record<SocialClientStatus, string> = {
  activo: "Activo",
  onboarding: "Onboarding",
  pausa: "En pausa",
}

export const SOCIAL_PLAN_LABEL: Record<SocialPlan, string> = {
  esencial: "Esencial",
  growth: "Growth",
  premium: "Premium",
}

export const PROPOSAL_STATUS_LABEL: Record<
  import("@/lib/crm/types").ProposalStatus,
  string
> = {
  borrador: "Borrador",
  enviado: "Enviado",
  aceptado: "Aceptado",
  rechazado: "Rechazado",
}

export const EDITORIAL_STATUS_LABEL: Record<
  import("@/lib/crm/social-types").EditorialStatus,
  string
> = {
  borrador: "Borrador",
  aprobado: "Aprobado",
  publicado: "Publicado",
}

export { TEAM_ASSIGNEES } from "@/lib/crm/types"

export const COSECHA_SERVICES = [
  "Redes sociales",
  "Diseño web",
  "IA y automatización",
  "Publicidad paga",
  "SEO",
  "Diseño gráfico",
  "Consultoría",
] as const
