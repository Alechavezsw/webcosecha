import { GoogleGenAI } from "@google/genai"
import { PROPOSAL_TEMPLATES } from "@/lib/crm/proposal-templates"
import type { CrmLead, CrmProposal, CrmTask } from "@/lib/crm/types"
import { randomUUID } from "crypto"

const MODEL = "gemini-2.0-flash"

async function runGemini(prompt: string, maxTokens = 800): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null
  try {
    const ai = new GoogleGenAI({ apiKey })
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.4, maxOutputTokens: maxTokens },
    })
    return res.text?.trim() ?? null
  } catch {
    return null
  }
}

export async function aiSummarizeLeadForTeam(lead: CrmLead): Promise<string> {
  const fallback = `${lead.name || "Lead"} · ${lead.status} · ${lead.summary.slice(0, 200)}`
  const prompt = `Sos el asistente interno de Cosecha Creativa (agencia San Juan). Resumí en 2-3 oraciones para el equipo comercial este lead (sin inventar datos):
Nombre: ${lead.name ?? "—"}
Empresa: ${lead.company ?? "—"}
Contacto: ${lead.email ?? ""} ${lead.phone ?? ""}
Interés: ${lead.serviceInterest?.join(", ") ?? "—"}
Estado: ${lead.status}
Resumen chat: ${lead.summary}
Últimos mensajes visitante: ${lead.messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.text)
    .join(" | ")}`
  return (await runGemini(prompt, 400)) ?? fallback
}

export async function aiSuggestTasks(lead: CrmLead): Promise<CrmTask[]> {
  const now = new Date().toISOString()
  const fallback: CrmTask[] = [
    {
      id: randomUUID(),
      title: lead.phone ? "Contactar por WhatsApp" : "Pedir teléfono o email",
      dueAt: new Date(Date.now() + 86400000).toISOString(),
      done: false,
      createdAt: now,
      aiSuggested: true,
    },
  ]
  if (lead.status === "calificado") {
    fallback.push({
      id: randomUUID(),
      title: "Enviar propuesta comercial",
      dueAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      done: false,
      createdAt: now,
      aiSuggested: true,
    })
  }

  const prompt = `Para Cosecha Creativa, sugerí 2-4 tareas concretas para este lead. Respondé SOLO JSON array: [{"title":"...","dueInDays":1}]
Lead: ${lead.name}, estado ${lead.status}, interés ${lead.serviceInterest?.join(", ")}, resumen: ${lead.summary}`
  const raw = await runGemini(prompt, 600)
  if (!raw) return fallback
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) return fallback
    const arr = JSON.parse(match[0]) as { title: string; dueInDays?: number }[]
    return arr.slice(0, 4).map((t) => ({
      id: randomUUID(),
      title: t.title,
      dueAt: new Date(Date.now() + (t.dueInDays ?? 1) * 86400000).toISOString(),
      done: false,
      createdAt: now,
      aiSuggested: true,
    }))
  } catch {
    return fallback
  }
}

export async function aiDraftProposal(
  lead: CrmLead,
  templateId: string,
): Promise<Omit<CrmProposal, "id" | "createdAt" | "updatedAt">> {
  const tpl = PROPOSAL_TEMPLATES.find((t) => t.id === templateId) ?? PROPOSAL_TEMPLATES[0]
  const now = new Date().toISOString().slice(0, 10)
  const fallbackBody = `${tpl.intro}

Cliente: ${lead.name ?? "A definir"}${lead.company ? ` — ${lead.company}` : ""}
Servicio: ${tpl.service}
Inversión referencia: $${tpl.defaultAmount.toLocaleString("es-AR")} ${tpl.currency}
Validez: 15 días desde ${now}

Cosecha Creativa · San Juan`

  const prompt = `Redactá una propuesta comercial breve en español (Argentina) para Cosecha Creativa.
Plantilla: ${tpl.title}
Monto base: ${tpl.defaultAmount} ${tpl.currency}
Lead: ${lead.name}, ${lead.company}, intereses: ${lead.serviceInterest?.join(", ")}
Contexto chat: ${lead.summary}
Incluí alcance, plazo estimado sin garantizar fechas, y cierre amable. Sin markdown. Máx 250 palabras.`

  const body = (await runGemini(prompt, 900)) ?? fallbackBody
  return {
    templateId: tpl.id,
    title: tpl.title,
    amount: tpl.defaultAmount,
    currency: tpl.currency,
    status: "borrador",
    body,
    aiGenerated: true,
  }
}

export async function aiEnrichInternalNotes(lead: CrmLead): Promise<string> {
  const base = lead.internalNotes || ""
  const prompt = `Como asistente interno de Cosecha Creativa, ampliá estas notas internas del lead con bullets útiles (presupuesto estimado sugerido, objeciones probables, próximo paso). No repitas el chat literal. Máx 120 palabras.
Lead: ${lead.name}, ${lead.company}, ${lead.status}
Notas actuales: ${base || "(vacías)"}
Resumen: ${lead.summary}
Objeciones actuales: ${lead.objections ?? "—"}`
  const enriched = await runGemini(prompt, 500)
  if (!enriched) {
    return base || `Próximo paso: contactar. Interés: ${lead.serviceInterest?.join(", ") ?? "por definir"}.`
  }
  return enriched
}

export async function aiSuggestTags(lead: CrmLead): Promise<string[]> {
  const existing = new Set(lead.tags.map((t) => t.toLowerCase()))
  const fallback: string[] = []
  if (/urgente|ya|hoy|rapido/i.test(lead.summary)) fallback.push("urgente")
  if (/constructora|obra|inmobiliaria/i.test(lead.summary + (lead.company ?? "")))
    fallback.push("constructora")
  if (/san juan|sj\b/i.test(lead.summary)) fallback.push("san-juan")

  const prompt = `Sugerí 1-4 etiquetas cortas en minúsculas con guiones para CRM de agencia marketing (ej: urgente, constructora, ecommerce). Solo JSON array de strings.
Lead: ${lead.name} ${lead.company} ${lead.serviceInterest?.join(" ")} ${lead.summary}`
  const raw = await runGemini(prompt, 200)
  if (!raw) return [...new Set([...existing, ...fallback])]
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) return fallback
    const tags = JSON.parse(match[0]) as string[]
    return [...new Set([...existing, ...tags.map((t) => t.replace(/^#/, "").toLowerCase())])]
  } catch {
    return fallback
  }
}

export async function aiScoreLead(lead: CrmLead): Promise<{ score: number; reason: string }> {
  let score = 50
  let reason = "Prioridad media por defecto."

  if (lead.email) score += 10
  if (lead.phone) score += 15
  if (lead.company) score += 5
  if ((lead.serviceInterest?.length ?? 0) > 0) score += 10
  if (/urgente|ya|hoy|presupuesto|contratar/i.test(lead.summary)) score += 15
  if (lead.status === "calificado") score += 20
  if (lead.status === "ganado") score = 100
  if (lead.status === "perdido") score = 10
  score = Math.min(100, Math.max(0, score))

  const prompt = `Calificá este lead de agencia marketing (0-100) y explicá en 1 frase corta.
Respondé SOLO JSON: {"score":number,"reason":"..."}
Lead: ${lead.name}, ${lead.company}, ${lead.status}, interés ${lead.serviceInterest?.join(", ")}, resumen: ${lead.summary}`
  const raw = await runGemini(prompt, 200)
  if (raw) {
    try {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0]) as { score: number; reason: string }
        score = Math.min(100, Math.max(0, Math.round(parsed.score)))
        reason = parsed.reason || reason
        return { score, reason }
      }
    } catch {
      /* fallback */
    }
  }
  reason =
    score >= 75
      ? "Alto potencial: datos de contacto e interés claro."
      : score >= 50
        ? "Seguimiento recomendado esta semana."
        : "Prioridad baja o lead frío."
  return { score, reason }
}

export async function aiEditorialIdeas(
  brand: string,
  plan: string,
  count: number,
): Promise<{ title: string; platform?: string }[]> {
  const prompt = `Sugerí ${count} ideas de contenido para redes de "${brand}" (plan ${plan}, agencia Cosecha Creativa San Juan). JSON: [{"title":"...","platform":"instagram|tiktok|facebook|linkedin"}]`
  const raw = await runGemini(prompt, 500)
  const fallback = [
    { title: "Carrusel tips del rubro", platform: "instagram" },
    { title: "Reel detrás de escena", platform: "instagram" },
  ]
  if (!raw) return fallback
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) return fallback
    return JSON.parse(match[0]) as { title: string; platform?: string }[]
  } catch {
    return fallback
  }
}

export async function aiSeoAudit(lead: CrmLead): Promise<string> {
  const website = lead.company || lead.name || "tu sitio web"
  const prompt = `Como consultor SEO técnico de Cosecha Creativa (San Juan, Argentina), elaborá una Mini Auditoría SEO Express de 3 puntos clave para el prospecto "${website}".
El objetivo es convencerlo de contratarnos para rediseñar su web o posicionarla.
Destacá de forma clara y con bullets:
1. 🔍 SEO Local y Semántica (ej: optimización de títulos, Google Business Profile en San Juan).
2. ⚡ Experiencia de usuario y velocidad móvil (Core Web Vitals).
3. 🎯 Optimización de conversión (embudo de contacto y chat con IA).
Mantené un estilo motivador, altamente profesional y rioplatense pero formal. Sé directo y de valor táctico. Máximo 180 palabras.`

  const fallback = `🔍 **Auditoría SEO Express para ${website}:**
  - **1. SEO Semántico:** Falta optimización de palabras clave locales en títulos H1/H2 ("diseño en San Juan").
  - **2. Core Web Vitals:** Tiempo de carga inicial superior a 3s en móviles, lo cual penaliza en Google.
  - **3. Conversión:** Falta de un call-to-action directo y un chat conversacional inteligente para capturar leads.`

  return (await runGemini(prompt, 550)) ?? fallback
}
