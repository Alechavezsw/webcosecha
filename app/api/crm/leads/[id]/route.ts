import { isCrmAuthenticated } from "@/lib/crm/auth"
import { getLeadById, updateLead } from "@/lib/crm/store"
import { LEAD_STATUSES, PROPOSAL_STATUSES, TEAM_ASSIGNEES } from "@/lib/crm/types"
import { NextResponse } from "next/server"
import { z } from "zod"

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueAt: z.string().optional(),
  done: z.boolean(),
  createdAt: z.string(),
  aiSuggested: z.boolean().optional(),
})

const proposalSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  title: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(PROPOSAL_STATUSES),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  aiGenerated: z.boolean().optional(),
})

const patchSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  assignee: z.union([z.enum(TEAM_ASSIGNEES), z.string()]).optional(),
  tags: z.array(z.string()).optional(),
  internalNotes: z.string().optional(),
  estimatedBudget: z.string().optional(),
  objections: z.string().optional(),
  tasks: z.array(taskSchema).optional(),
  proposals: z.array(proposalSchema).optional(),
  lastContactedAt: z.string().optional(),
  priorityScore: z.number().min(0).max(100).optional(),
  priorityReason: z.string().optional(),
})

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { id } = await ctx.params
  const lead = await getLeadById(id)
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ lead })
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { id } = await ctx.params
  const json = await req.json()
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }
  const lead = await updateLead(id, parsed.data)
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ lead })
}
