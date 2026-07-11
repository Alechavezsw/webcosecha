import { isCrmAuthenticated } from "@/lib/crm/auth"
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { z } from "zod"

const MODEL = "gemini-2.0-flash"

const bodySchema = z.object({
  message: z.string().min(1).max(5000),
  action: z.enum(["enrich", "rioplatense", "social", "tasks"]),
})

const PROMPTS = {
  enrich: `Sos el asistente comercial interno de Cosecha Creativa (San Juan, Argentina). 
Tomá estas notas rápidas y desordenadas sobre un prospecto o reunión, y transformalas en una minuta comercial impecable, resumida y profesional.
Destacá claramente:
- 👤 Datos clave del lead
- 💡 Dolor o necesidad principal
- 💰 Presupuesto o alcance sugerido
- 🏁 Próximo paso inmediato
Mantené un estilo directo, limpio y profesional. Máximo 150 palabras.`,

  rioplatense: `Sos el redactor creativo de Cosecha Creativa (San Juan, Argentina). 
Traducí el siguiente mensaje, correo o borrador comercial a un tono 100% rioplatense (cálido, cercano, humano y empático).
Usá "vos", "che", "¿cómo andás?", "dale", "te cuento", etc. 
Evitá sonar artificial o exageradamente informal; debe conservar la profesionalidad y ser persuasivo pero sonar como un mensaje de audio que te mandaría un socio comercial de confianza. Máximo 150 palabras.`,

  social: `Sos el Social Media Planner estrella de Cosecha Creativa.
Tomá la idea, notas o tema que te paso, y desarrollá exactamente 3 propuestas de contenido atractivas y creativas listas para publicar (Instagram, Reels o TikTok).
Para cada una de las 3 ideas proveé:
1. 📌 Título de la idea
2. 🪝 Gancho inicial (Hook visual/textual)
3. ✍️ Copy sugerido para el feed (breve y con llamado a la acción)
Mantené un estilo sumamente dinámico, fresco y moderno.`,

  tasks: `Sos el gestor comercial de Cosecha Creativa.
Analizá el siguiente texto o minutas de reunión e identificá exactamente 2 o 3 tareas críticas de seguimiento o entregables que el equipo comercial debe realizar de forma inmediata.
Formateá la respuesta como una lista de tareas corta y clara con plazos recomendados de entrega (ej: "Llamar por teléfono mañana para...", "Armar borrador de cotización en 48hs para...").`,
}

export async function POST(req: Request) {
  try {
    if (!(await isCrmAuthenticated())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos o acción no permitida" }, { status: 400 })
    }

    const { message, action } = parsed.data
    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json({
        error: "Falta configurar GEMINI_API_KEY en el servidor.",
      }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const systemPrompt = PROMPTS[action]

    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 1000,
      },
    })

    const reply = res.text?.trim() || "Sin respuesta de la IA"
    return NextResponse.json({ reply })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({ error: `Error del motor de IA: ${msg}` }, { status: 500 })
  }
}
