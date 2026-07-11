import type { CrmLead } from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"

export function normalizeLead(raw: CrmLead): CrmLead {
  return {
    ...raw,
    tags: raw.tags ?? [],
    tasks: raw.tasks ?? [],
    proposals: raw.proposals ?? [],
    history: raw.history ?? [],
    internalNotes: raw.internalNotes ?? "",
    assignee: raw.assignee ?? "Sin asignar",
    automationFlags: raw.automationFlags ?? [],
    priorityScore: raw.priorityScore ?? 50,
    priorityReason: raw.priorityReason ?? "",
  }
}

export function normalizeSocialClient(raw: SocialClient): SocialClient {
  return {
    ...raw,
    tags: raw.tags ?? [],
    editorial: raw.editorial ?? [],
  }
}
