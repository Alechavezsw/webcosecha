import { isCrmAuthenticated } from "@/lib/crm/auth"
import { listSocialClients, upsertSocialClient } from "@/lib/crm/social-store"
import { SOCIAL_PLANS, SOCIAL_PLATFORMS } from "@/lib/crm/social-types"
import { NextResponse } from "next/server"
import { z } from "zod"

const createSchema = z.object({
  brand: z.string().min(2),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  platforms: z.array(z.enum(SOCIAL_PLATFORMS)).min(1),
  plan: z.enum(SOCIAL_PLANS),
  postsPerMonth: z.number().int().min(1).max(60).default(8),
})

export async function GET() {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const clients = await listSocialClients()
  return NextResponse.json({ clients })
}

export async function POST(req: Request) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }
  const now = new Date().toISOString()
  const client = await upsertSocialClient({
    id: crypto.randomUUID(),
    brand: parsed.data.brand,
    contactName: parsed.data.contactName,
    contactPhone: parsed.data.contactPhone,
    platforms: parsed.data.platforms,
    plan: parsed.data.plan,
    status: "onboarding",
    postsPerMonth: parsed.data.postsPerMonth,
    postsDelivered: 0,
    tags: [],
    editorial: [],
    createdAt: now,
    updatedAt: now,
  })
  return NextResponse.json({ client }, { status: 201 })
}
