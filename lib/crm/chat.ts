import { GoogleGenAI } from "@google/genai"
import { getAssistantReply } from "@/lib/cosecha-assistant-replies"
import { COSECHA_CONTACT_EMAIL } from "@/lib/cosecha-creativa-robot-info"
import { buildLeadSummary, extractLeadFieldsFromText } from "@/lib/crm/extract-lead"
import { onLeadCreated } from "@/lib/crm/automations"
import { normalizeLead } from "@/lib/crm/migrate"
import { getLeadBySessionId, upsertLead } from "@/lib/crm/store"
import type { CrmLead, CrmMessage } from "@/lib/crm/types"
import { randomUUID } from "crypto"

const MODEL = "gemini-2.0-flash"

const SYSTEM_INSTRUCTION = `Sos el asistente comercial conversacional de Cosecha Creativa (San Juan, Argentina), especialistas en marketing digital, diseño web premium, gestión de redes, publicidad paga, SEO, diseño gráfico e IA aplicada.

Personalidad e Identidad:
- Hablá con un tono 100% rioplatense, cálido, sumamente creativo, humano y empático. Usá "vos", "che", "¿cómo andás?", "te cuento", "dale", "buenísimo", etc. Evitá sonar robótico, corporativo rígido o extranjero.
- Demostrá pasión por el diseño de alta gama y la tecnología. Hablá con seguridad y sin vueltas ("sin humo").

Objetivos Conversacionales:
1. Mantener un diálogo fluido, interactivo y natural. En lugar de dar respuestas gigantescas, hacé preguntas cortas para guiar la charla (por ejemplo, preguntar sobre su negocio, su rubro o qué dolor quiere resolver).
2. Invitar sutilmente a dejar sus datos (nombre, WhatsApp, email o rubro) a medida que avanza la conversación, sin presionar ni ser invasivo.
3. Si la persona solicita hablar con un humano o agendar, indicalo de forma entusiasta y recomendá WhatsApp (usando el botón del chat o link) o escribir a ${COSECHA_CONTACT_EMAIL}.
4. No inventes precios cerrados ni plazos de entrega; explicales que hacemos proyectos premium a medida.

Integración del Blog (¡Recomendá nuestras lecturas si el tema coincide!):
Si el usuario pregunta por temas específicos, recomendale con entusiasmo que lea nuestras columnas usando los enlaces relativos exactos:
- Automatizaciones / n8n / IA corporativa: "/blog/automatizaciones-n8n-ia-empresas"
- Chatbots / asistentes IA en la web: "/blog/chats-de-ia-para-sitios-web-en-san-juan"
- Diseño Web de alta gama / Estética premium / Conversión: "/blog/diseno-web-premium-conversion"
- Estrategias de redes en San Juan / Algoritmos / Videos verticales: "/blog/estrategias-redes-sociales-san-juan"
- Comunicación política / Compol / Datos y emociones en elecciones: "/blog/comunicacion-politica-datos-emocion"
- Desarrollo de software y sistemas a medida: "/blog/desarrollamos-el-sistema-a-medida-para-tu-negocio-o-empresa-en-san-juan"
- Posicionamiento en buscadores / SEO local: "/blog/diseno-web-en-san-juan" (o "/blog/diseno-ux" para experiencia de usuario)
- Diseño gráfico / Consistencia visual de marca: "/blog/despierta-tu-marca-con-cosecha-creativa-diseno-grafico-que-impacta-y-vende"

Reglas de Estilo:
- Respuestas de extensión moderada (máximo 3 párrafos cortos). Utilizá negritas estratégicamente para destacar conceptos clave.
- Mantené la conversación dinámica y siempre cerrá tu mensaje con una pregunta abierta e intuitiva.`

function newMessage(role: CrmMessage["role"], text: string): CrmMessage {
  return { id: randomUUID(), role, text, createdAt: new Date().toISOString() }
}

async function generateWithGemini(history: CrmMessage[], userText: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null

  try {
    const ai = new GoogleGenAI({ apiKey })
    const contents = history.slice(-12).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }],
    }))
    contents.push({ role: "user", parts: [{ text: userText }] })

    const res = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.55,
        maxOutputTokens: 900,
      },
    })

    const text = res.text?.trim()
    return text || null
  } catch {
    return null
  }
}

export async function handleChatMessage(input: {
  sessionId: string
  message: string
  source: string
}): Promise<{ sessionId: string; leadId: string; reply: string }> {
  const now = new Date().toISOString()
  const sessionId = input.sessionId.trim() || randomUUID()
  const userText = input.message.trim()

  const existing = await getLeadBySessionId(sessionId)
  const isNew = !existing
  let lead =
    existing ??
    normalizeLead({
      id: randomUUID(),
      sessionId,
      createdAt: now,
      updatedAt: now,
      status: "nuevo",
      source: input.source,
      summary: "",
      messages: [],
      tags: [],
      tasks: [],
      proposals: [],
      history: [],
      internalNotes: "",
      assignee: "Sin asignar",
    })

  const userMsg = newMessage("user", userText)
  lead.messages.push(userMsg)

  const extracted = extractLeadFieldsFromText(userText, lead)
  lead = { ...lead, ...extracted, updatedAt: now }

  const reply =
    (await generateWithGemini(lead.messages.slice(0, -1), userText)) ??
    getAssistantReply(userText)

  lead.messages.push(newMessage("assistant", reply))
  lead.summary = buildLeadSummary(lead)
  lead.updatedAt = new Date().toISOString()

  await upsertLead(lead)
  if (isNew) {
    void onLeadCreated(lead, true)
  }

  return { sessionId, leadId: lead.id, reply }
}
