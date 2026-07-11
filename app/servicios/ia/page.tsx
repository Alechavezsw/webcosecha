import type { Metadata } from "next"
import { CosechaIaClient } from "@/components/landing/servicios/cosecha-ia-client"

export const metadata: Metadata = {
  title: "Cosecha Creativa IA | Inteligencia Artificial para tu negocio — San Juan",
  description:
    "Agentes de IA, chatbots, automatizaciones con n8n y dashboards para PyMEs y profesionales en San Juan. Diagnóstico sin compromiso.",
  openGraph: {
    title: "Cosecha Creativa IA",
    description:
      "Conectamos IA con tus herramientas para automatizar procesos y mejorar la atención sin reemplazar a tu equipo.",
    url: "https://cosechacreativa.com.ar/servicios/ia",
  },
}

export default function CosechaIaPage() {
  return <CosechaIaClient />
}
