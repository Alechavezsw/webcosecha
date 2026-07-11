import { isCrmAuthenticated } from "@/lib/crm/auth"
import {
  aiDraftProposal,
  aiEnrichInternalNotes,
  aiScoreLead,
  aiSuggestTags,
  aiSuggestTasks,
  aiSeoAudit,
} from "@/lib/crm/ai-internal"
import { getLeadById, pushHistory, upsertLead } from "@/lib/crm/store"
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  action: z.enum([
    "suggest_tasks",
    "enrich_notes",
    "suggest_tags",
    "draft_proposal",
    "score_lead",
    "seo_audit",
  ]),
  templateId: z.string().optional(),
})

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { id } = await ctx.params
  const lead = await getLeadById(id)
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

  const json = await req.json()
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
  }

  const { action, templateId } = parsed.data

  if (action === "suggest_tasks") {
    const suggested = await aiSuggestTasks(lead)
    const existing = new Set(lead.tasks.map((t) => t.title))
    const added = suggested.filter((t) => !existing.has(t.title))
    lead.tasks.push(...added)
    pushHistory(lead, "ai", `IA agregó ${added.length} tarea(s)`)
    await upsertLead(lead)
    return NextResponse.json({ lead, added })
  }

  if (action === "enrich_notes") {
    lead.internalNotes = await aiEnrichInternalNotes(lead)
    pushHistory(lead, "ai", "IA amplió notas internas")
    await upsertLead(lead)
    return NextResponse.json({ lead })
  }

  if (action === "suggest_tags") {
    lead.tags = await aiSuggestTags(lead)
    pushHistory(lead, "ai", `IA sugirió etiquetas: ${lead.tags.join(", ")}`)
    await upsertLead(lead)
    return NextResponse.json({ lead })
  }

  if (action === "score_lead") {
    const { score, reason } = await aiScoreLead(lead)
    lead.priorityScore = score
    lead.priorityReason = reason
    pushHistory(lead, "ai", `Prioridad IA: ${score}/100 — ${reason}`)
    await upsertLead(lead)
    return NextResponse.json({ lead, score, reason })
  }

  if (action === "draft_proposal") {
    const draft = await aiDraftProposal(lead, templateId ?? "redes-growth")
    const now = new Date().toISOString()
    const proposal = {
      ...draft,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    lead.proposals.push(proposal)
    pushHistory(lead, "proposal", `IA generó propuesta: ${proposal.title}`)
    await upsertLead(lead)
    return NextResponse.json({ lead, proposal })
  }

  if (action === "seo_audit") {
    const seoReport = await aiSeoAudit(lead)
    const separator = lead.internalNotes ? "\n\n" : ""
    lead.internalNotes = `${lead.internalNotes}${separator}🔍 **Auditoría SEO Express:**\n${seoReport}`
    pushHistory(lead, "ai", "IA generó auditoría SEO")
    await upsertLead(lead)
    return NextResponse.json({ lead, seoReport })
  }

  return NextResponse.json({ error: "Sin acción" }, { status: 400 })
}
