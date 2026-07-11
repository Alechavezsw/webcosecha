import { isCrmAuthenticated } from "@/lib/crm/auth"
import { aiEditorialIdeas } from "@/lib/crm/ai-internal"
import { listSocialClients, updateSocialClient } from "@/lib/crm/social-store"
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { id } = await ctx.params
  const clients = await listSocialClients()
  const client = clients.find((c) => c.id === id)
  if (!client) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

  const ideas = await aiEditorialIdeas(client.brand, client.plan, 4)
  const base = new Date()
  base.setDate(1)
  const newPieces = ideas.map((idea, i) => {
    const d = new Date(base)
    d.setDate(5 + i * 7)
    return {
      id: randomUUID(),
      title: idea.title,
      scheduledAt: d.toISOString(),
      status: "borrador" as const,
      platform: (idea.platform as "instagram") ?? client.platforms[0],
    }
  })
  client.editorial = [...client.editorial, ...newPieces]
  await updateSocialClient(id, { editorial: client.editorial })
  return NextResponse.json({ client, added: newPieces.length })
}
