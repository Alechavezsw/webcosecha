import { isCrmAuthenticated } from "@/lib/crm/auth"
import { listLeads } from "@/lib/crm/store"
import { computeLeadStats, computePipelineRevenue } from "@/lib/crm/stats"
import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"

const MODEL = "gemini-2.0-flash"

export async function POST() {
  try {
    if (!(await isCrmAuthenticated())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const leads = await listLeads()
    const stats = computeLeadStats(leads)
    const revenue = computePipelineRevenue(leads)

    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json({
        reply: `🧉 **Consejo de Cosecha (Borrador):** Tenés **${stats.activos} leads activos** y un pipeline de **$${revenue.pipeline.toLocaleString("es-AR")} ARS** en juego. 
        
👉 *Tip comercial:* Enfocá los esfuerzos de esta semana en los prospectos que mostraron interés en *automatizaciones de IA o desarrollo web*, ya que suelen tener un ciclo de cierre más rápido. 
*(Para activar la IA real en tiempo real de Gemini, recordá cargar tu GEMINI_API_KEY en .env.local)*`,
      })
    }

    const ai = new GoogleGenAI({ apiKey })

    // Build lead details list
    const leadHighlights = leads
      .slice(0, 5)
      .map((l) => `- ${l.name || "Sin nombre"}: Interés en ${l.serviceInterest?.join(", ") || "A definir"} (${l.status})`)
      .join("\n")

    const systemPrompt = `Sos el consultor estratégico comercial interno de Cosecha Creativa (agencia en San Juan, Argentina). 
Analizás las métricas de ventas y das una recomendación ultra-táctica de 2 o 3 oraciones en tono rioplatense conversacional, empático y directo.
Usá "vos", "che", "dale". Nada de rodeos teóricos o humo corporativo. Da consejos comerciales que se puedan ejecutar HOY mismo.`

    const userPrompt = `Métricas del CRM de Cosecha Creativa:
- Leads Totales: ${stats.total}
- Nuevos esta semana: ${stats.nuevosSemana}
- Leads Activos (en seguimiento): ${stats.activos}
- Tasa de Conversión General: ${stats.conversion}%
- Monto del Pipeline Activo (Propuestas/Borradores): $${revenue.pipeline.toLocaleString("es-AR")} ARS
- Monto en propuestas enviadas a la espera de OK: $${revenue.sent.toLocaleString("es-AR")} ARS
- Monto en propuestas ganadas/cerradas: $${revenue.won.toLocaleString("es-AR")} ARS

Leads recientes destacados en seguimiento:
${leadHighlights}

Redactá una sugerencia comercial estratégica directa, inspiradora y extremadamente concreta para el equipo basada en estos datos.
Formato de respuesta deseado:
🧉 **Estrategia Cosecha:** [Breve diagnóstico dinámico de la semana]
👉 [Consejo práctico para hoy, enfocado en los leads recientes o propuestas por cerrar]`

    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    })

    const reply = res.text?.trim() || "Sin respuesta del consultor IA"
    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json({
      reply: "🧉 **Consejo de Cosecha:** ¡Buen lunes! Revisemos las propuestas comerciales que están a la espera de OK en la columna Kanban. Mandar un mensajito breve para reconectar suele ser el paso más rápido al cierre.",
    })
  }
}
