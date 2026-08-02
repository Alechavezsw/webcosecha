import { handleChatMessage } from "@/lib/crm/chat"
import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(4000),
  source: z.string().max(80).optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const result = await handleChatMessage({
      sessionId: parsed.data.sessionId ?? "",
      message: parsed.data.message,
      source: parsed.data.source ?? "web",
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "No se pudo procesar el mensaje"
    console.error("[api/crm/chat]", err)
    return NextResponse.json(
      {
        error: message || "No se pudo procesar el mensaje",
      },
      { status: 500 },
    )
  }
}
