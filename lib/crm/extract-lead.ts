import type { CrmLead } from "@/lib/crm/types"

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const PHONE_RE = /(?:\+?54\s?)?(?:9\s?)?(?:11|[2368]\d{1,3})\s?\d{3,4}[-\s]?\d{4}|\d{6,12}/g

const SERVICE_KEYWORDS: Record<string, RegExp> = {
  "Redes sociales": /redes|instagram|tiktok|community|contenido/i,
  "Diseño web": /web|sitio|landing|wordpress|pagina/i,
  "IA y automatización": /ia|inteligencia artificial|chatbot|n8n|automatiz/i,
  "Publicidad paga": /ads|meta|facebook ads|publicidad|campana/i,
  "SEO": /seo|google|posicionamiento|maps/i,
  "Diseño gráfico": /diseño grafico|branding|logo|identidad/i,
  "Consultoría": /consultoria|estrategia|plan/i,
}

export function extractLeadFieldsFromText(text: string, current: Partial<CrmLead>): Partial<CrmLead> {
  const patch: Partial<CrmLead> = {}
  const lower = text.toLowerCase()

  const emails = text.match(EMAIL_RE)
  if (emails?.[0] && !current.email) patch.email = emails[0].toLowerCase()

  const phones = text.match(PHONE_RE)
  if (phones?.[0] && !current.phone) patch.phone = phones[0].replace(/\s+/g, " ").trim()

  const nameMatch =
    text.match(/(?:me llamo|mi nombre es|soy)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3})/i) ??
    text.match(/(?:nombre|name):\s*([^\n,;.]+)/i)
  if (nameMatch?.[1] && !current.name) patch.name = nameMatch[1].trim()

  const companyMatch =
    text.match(/(?:empresa|negocio|marca|institucion)\s+(?:es\s+)?([^\n,.;]+)/i) ??
    text.match(/(?:trabajo en|de)\s+([A-ZÁÉÍÓÚÑ][^\n,.;]{2,40})/i)
  if (companyMatch?.[1] && !current.company) patch.company = companyMatch[1].trim()

  const interests = new Set(current.serviceInterest ?? [])
  for (const [label, re] of Object.entries(SERVICE_KEYWORDS)) {
    if (re.test(lower)) interests.add(label)
  }
  if (interests.size > 0) patch.serviceInterest = [...interests]

  return patch
}

export function buildLeadSummary(lead: CrmLead): string {
  const userLines = lead.messages
    .filter((m) => m.role === "user")
    .slice(-6)
    .map((m) => m.text)
  const intent = userLines.join(" · ").slice(0, 480)
  const parts = [
    lead.name && `Contacto: ${lead.name}`,
    lead.email && `Email: ${lead.email}`,
    lead.phone && `Tel: ${lead.phone}`,
    lead.company && `Empresa: ${lead.company}`,
    lead.serviceInterest?.length && `Interés: ${lead.serviceInterest.join(", ")}`,
    intent && `Últimos mensajes: ${intent}`,
  ].filter(Boolean)
  return parts.join(" | ") || "Consulta desde el chat web sin datos de contacto aún."
}
