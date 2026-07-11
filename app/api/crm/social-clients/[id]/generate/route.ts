import { isCrmAuthenticated } from "@/lib/crm/auth"
import { listSocialClients } from "@/lib/crm/social-store"
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { z } from "zod"

const MODEL = "gemini-2.0-flash"

const bodySchema = z.object({
  type: z.enum(["post", "stories"]),
  topic: z.string().min(1).max(2000),
})

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isCrmAuthenticated())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await ctx.params
    const clients = await listSocialClients()
    const client = clients.find((c) => c.id === id)
    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos o tipo de pieza no válido" }, { status: 400 })
    }

    const { type, topic } = parsed.data
    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json({
        reply: `🧉 **Cosecha Copywriter (Borrador sin API Key):**

📢 **Pieza para ${client.brand} sobre "${topic}":**

*¡Hola! Recordá configurar tu GEMINI_API_KEY en .env.local para obtener copys redactados en tiempo real con toda la inteligencia y persuasión de Gemini.*`,
      })
    }

    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = `Sos el Copywriter Creativo y Social Media Manager estrella de la agencia Cosecha Creativa (San Juan, Argentina). 
Redactás copys e historias de Instagram espectaculares para la marca "${client.brand}" (Plan: ${client.plan}).
El tono debe ser 100% de San Juan / Argentina (cálido, conversacional, con uso natural de "vos" y "che", empático, persuasivo y sin humo).
Utilizá negritas estratégicamente y emojis adecuados para dinamizar la lectura táctil en dispositivos móviles.`

    const userPrompt = type === "post"
      ? `Generá un Post para Feed (Instagram / Facebook) impecable para la marca "${client.brand}" sobre el tema o promoción: "${topic}".
Estructurá la respuesta exactamente de la siguiente forma:
🎨 **Idea Creativa / Visual:** [Instrucción breve y clara para el diseñador sobre qué imagen/carrusel armar]
🪝 **Gancho Inicial (Hook):** [Una primera línea llamativa para atrapar al usuario al scrollear]
✍️ **Caption del Post:**
[Cuerpo del copy en tono local persuasivo y conversacional. Hacé foco en los beneficios y el valor de la propuesta]
💬 **Llamado a la Acción (CTA):** [Pregunta abierta o directiva clara de conversión, ej: 'Escribinos un mensaje privado / comentá acá abajo']
🏷️ **Hashtags sugeridos:** [4 a 6 hashtags relevantes]`
      : `Generá una Secuencia de 3 Historias de Instagram (Stories) altamente interactivas e impecables para la marca "${client.brand}" sobre el tema: "${topic}".
Estructurá la respuesta exactamente de la siguiente forma:
📱 **Historia 1: El Gancho (Hook)**
- **Concepto Visual:** [Instrucción breve para el diseñador o foto de fondo]
- **Texto en Pantalla:** [Texto corto y directo que impacte]
- **Interacción sugerida:** [Sticker de Encuesta o Barra Deslizante para fomentar clics]

📱 **Historia 2: El Valor (Storytelling/Beneficio)**
- **Concepto Visual:** [Boceto visual o foto de detalle]
- **Texto en Pantalla:** [Texto clave resolviendo la intriga de la Historia 1 o aportando valor]
- **Interacción sugerida:** [Caja de preguntas o quiz corto]

📱 **Historia 3: La Acción (Conversión/CTA)**
- **Concepto Visual:** [Detalle del producto, local o promo]
- **Texto en Pantalla:** [Llamado a la acción claro y urgente]
- **Interacción sugerida:** [Sticker de Enlace (Link) con texto persuasivo para tocar o botón 'Enviar DM']`

    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65,
        maxOutputTokens: 900,
      },
    })

    const reply = res.text?.trim() || "Sin respuesta del redactor de IA"
    return NextResponse.json({ reply })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({ error: `Error del redactor de IA: ${msg}` }, { status: 500 })
  }
}
