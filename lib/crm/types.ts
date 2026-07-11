export const LEAD_STATUSES = ["nuevo", "contactado", "calificado", "perdido", "ganado"] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const PROPOSAL_STATUSES = ["borrador", "enviado", "aceptado", "rechazado"] as const
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number]

export const TEAM_ASSIGNEES = ["María", "Pablo", "Lucas", "Sin asignar"] as const
export type TeamAssignee = (typeof TEAM_ASSIGNEES)[number]

export type ChatRole = "user" | "assistant"

export type CrmMessage = {
  id: string
  role: ChatRole
  text: string
  createdAt: string
}

export type CrmHistoryEntry = {
  id: string
  at: string
  type: "status" | "note" | "task" | "assignee" | "ai" | "automation" | "proposal" | "tag"
  text: string
}

export type CrmTask = {
  id: string
  title: string
  dueAt?: string
  done: boolean
  createdAt: string
  aiSuggested?: boolean
}

export type CrmProposal = {
  id: string
  templateId: string
  title: string
  amount: number
  currency: string
  status: ProposalStatus
  body: string
  createdAt: string
  updatedAt: string
  aiGenerated?: boolean
}

export type CrmLead = {
  id: string
  sessionId: string
  createdAt: string
  updatedAt: string
  status: LeadStatus
  source: string
  name?: string
  email?: string
  phone?: string
  company?: string
  serviceInterest?: string[]
  summary: string
  messages: CrmMessage[]
  assignee?: TeamAssignee | string
  tags: string[]
  internalNotes: string
  estimatedBudget?: string
  objections?: string
  tasks: CrmTask[]
  proposals: CrmProposal[]
  history: CrmHistoryEntry[]
  lastContactedAt?: string
  automationFlags?: string[]
  /** 0–100, calculado por IA interna */
  priorityScore?: number
  priorityReason?: string
}

export type CrmStore = {
  leads: CrmLead[]
}

export type CrmNotification = {
  id: string
  at: string
  type: "new_lead" | "calificado" | "automation" | "task_due"
  leadId?: string
  title: string
  body: string
  read: boolean
  channels: ("in_app" | "email" | "webhook")[]
}

export type CrmNotificationsStore = {
  items: CrmNotification[]
}
