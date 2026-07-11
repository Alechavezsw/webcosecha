import type { Metadata } from "next"
import { ConsultoriaEstrategicaClient } from "@/components/landing/servicios/consultoria-estrategica-client"

export const metadata: Metadata = {
  title: "Consultoría estratégica | Cosecha Creativa — San Juan",
  description:
    "Consultoría estratégica en marketing digital y SEO para empresas en San Juan y región. Análisis, contenido, campañas y seguimiento.",
  openGraph: {
    title: "Consultoría estratégica | Cosecha Creativa",
    description:
      "Potenciá tu negocio con estrategia digital personalizada: SEO, contenido, ads y métricas.",
    url: "https://cosechacreativa.com.ar/",
  },
}

export default function ConsultoriaEstrategicaPage() {
  return <ConsultoriaEstrategicaClient />
}
