import { isCrmAuthenticated } from "@/lib/crm/auth"
import { deleteSocialClient, listSocialClients, updateSocialClient } from "@/lib/crm/social-store"
import { EDITORIAL_STATUSES, SOCIAL_STATUSES } from "@/lib/crm/social-types"
import { NextResponse } from "next/server"
import { z } from "zod"

const editorialSchema = z.object({
  id: z.string(),
  title: z.string(),
  scheduledAt: z.string(),
  status: z.enum(EDITORIAL_STATUSES),
  platform: z.enum(["instagram", "facebook", "tiktok", "linkedin"]).optional(),
})

const metricsSchema = z.object({
  updatedAt: z.string(),
  followers: z.number().optional(),
  reach: z.number().optional(),
  engagementRate: z.number().optional(),
  notes: z.string().optional(),
})

const patchSchema = z.object({
  status: z.enum(SOCIAL_STATUSES).optional(),
  notes: z.string().optional(),
  postsDelivered: z.number().int().min(0).optional(),
  nextDelivery: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  editorial: z.array(editorialSchema).optional(),
  metrics: metricsSchema.optional(),
})

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
  const client = await updateSocialClient(id, parsed.data)
  if (!client) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ client })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { id } = await ctx.params
  const ok = await deleteSocialClient(id)
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  const clients = await listSocialClients()
  return NextResponse.json({ clients })
}
