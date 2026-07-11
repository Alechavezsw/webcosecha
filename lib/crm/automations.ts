import { aiScoreLead, aiSuggestTasks } from "@/lib/crm/ai-internal"
import { notifyLeadEvent } from "@/lib/crm/notify"
import { getLeadById, listLeads, upsertLead } from "@/lib/crm/store"
import type { CrmLead, CrmTask } from "@/lib/crm/types"
import { randomUUID } from "crypto"

const HOURS_48 = 48 * 60 * 60 * 1000

function appendHistory(lead: CrmLead, type: CrmLead["history"][0]["type"], text: string) {
  lead.history.push({
    id: randomUUID(),
    at: new Date().toISOString(),
    type,
    text,
  })
}

export async function runLeadAutomations(leadId?: string): Promise<{ processed: number; actions: string[] }> {
  const leads = leadId ? [(await getLeadById(leadId))].filter(Boolean) : await listLeads()
  const actions: string[] = []
  let processed = 0

  for (const raw of leads) {
    if (!raw) continue
    const lead = raw
    let changed = false
    const now = Date.now()

    if (
      lead.status === "nuevo" &&
      !lead.lastContactedAt &&
      now - new Date(lead.createdAt).getTime() > HOURS_48 &&
      !lead.automationFlags?.includes("48h_followup")
    ) {
      const taskTitle = "IA: Contactar — sin respuesta en 48 h"
      const exists = lead.tasks.some((t) => t.title.includes("48 h"))
      if (!exists) {
        const suggested = await aiSuggestTasks(lead)
        const task: CrmTask =
          suggested[0] ??
          ({
            id: randomUUID(),
            title: taskTitle,
            dueAt: new Date().toISOString(),
            done: false,
            createdAt: new Date().toISOString(),
            aiSuggested: true,
          } satisfies CrmTask)
        task.title = taskTitle
        lead.tasks.push(task)
        appendHistory(lead, "automation", "Tarea automática: seguimiento 48 h sin contacto")
        lead.automationFlags = [...(lead.automationFlags ?? []), "48h_followup"]
        changed = true
        actions.push(`${lead.id}: tarea 48h`)
      }
    }

    const dueTasks = lead.tasks.filter(
      (t) => !t.done && t.dueAt && new Date(t.dueAt).getTime() < now,
    )
    if (dueTasks.length > 0 && !lead.automationFlags?.includes("overdue_notified")) {
      appendHistory(
        lead,
        "automation",
        `${dueTasks.length} tarea(s) vencida(s): ${dueTasks.map((t) => t.title).join(", ")}`,
      )
      lead.automationFlags = [...(lead.automationFlags ?? []), "overdue_notified"]
      changed = true
    }

    if (changed) {
      lead.updatedAt = new Date().toISOString()
      await upsertLead(lead)
      processed++
    }
  }

  return { processed, actions }
}

export async function onLeadCreated(lead: CrmLead, isNew: boolean): Promise<CrmLead> {
  if (isNew) {
    const tasks = await aiSuggestTasks(lead)
    lead.tasks = [...lead.tasks, ...tasks.filter((t) => !lead.tasks.some((x) => x.title === t.title))]
    const { score, reason } = await aiScoreLead(lead)
    lead.priorityScore = score
    lead.priorityReason = reason
    appendHistory(lead, "ai", `Prioridad IA: ${score}/100 — ${reason}`)
    appendHistory(lead, "ai", "IA sugirió tareas iniciales")
    await upsertLead(lead)
    void notifyLeadEvent("new_lead", lead)
  }
  return lead
}

export async function onLeadStatusChange(
  lead: CrmLead,
  prevStatus: string,
): Promise<CrmLead> {
  appendHistory(lead, "status", `Estado: ${prevStatus} → ${lead.status}`)
  if (lead.status === "contactado") {
    lead.lastContactedAt = new Date().toISOString()
  }
  if (lead.status === "calificado" && prevStatus !== "calificado") {
    void notifyLeadEvent("calificado", lead)
    const hasProposalTask = lead.tasks.some((t) => /propuesta/i.test(t.title))
    if (!hasProposalTask) {
      lead.tasks.push({
        id: randomUUID(),
        title: "IA: Enviar propuesta comercial",
        dueAt: new Date(Date.now() + 2 * 86400000).toISOString(),
        done: false,
        createdAt: new Date().toISOString(),
        aiSuggested: true,
      })
    }
  }
  lead.updatedAt = new Date().toISOString()
  await upsertLead(lead)
  void runLeadAutomations(lead.id)
  return lead
}
