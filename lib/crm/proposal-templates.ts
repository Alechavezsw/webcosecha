export type ProposalTemplate = {
  id: string
  title: string
  service: string
  defaultAmount: number
  currency: string
  intro: string
}

export const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: "redes-growth",
    title: "Gestión de redes — Plan Growth",
    service: "Redes sociales",
    defaultAmount: 185000,
    currency: "ARS",
    intro:
      "Calendario mensual, diseño de piezas, copies y publicación en Instagram y Facebook. Incluye reporte mensual.",
  },
  {
    id: "redes-esencial",
    title: "Gestión de redes — Plan Esencial",
    service: "Redes sociales",
    defaultAmount: 120000,
    currency: "ARS",
    intro: "8 piezas mensuales + stories. Ideal para marcas que arrancan en redes.",
  },
  {
    id: "web-landing",
    title: "Diseño web — Landing profesional",
    service: "Diseño web",
    defaultAmount: 350000,
    currency: "ARS",
    intro: "Landing responsive, formulario de contacto, SEO básico y entrega en 3 semanas.",
  },
  {
    id: "ia-automation",
    title: "IA y automatización — Pack inicial",
    service: "IA y automatización",
    defaultAmount: 280000,
    currency: "ARS",
    intro: "Chatbot web, flujos n8n y capacitación del equipo. Integración con WhatsApp opcional.",
  },
  {
    id: "publicidad-meta",
    title: "Publicidad paga — Meta Ads",
    service: "Publicidad paga",
    defaultAmount: 95000,
    currency: "ARS",
    intro: "Setup de campañas, creatividades y optimización semanal (fee; inversión en ads aparte).",
  },
]
