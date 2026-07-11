import type { Metadata } from "next"
import { AppsWebClient } from "@/components/landing/servicios/apps-web-client"

export const metadata: Metadata = {
  title: "Desarrollo de Apps Web y Software a Medida | Cosecha Creativa",
  description:
    "Apps web, sistemas internos, gestión, dashboards, automatización e IA aplicada. Soluciones a medida para empresas en San Juan y proyectos remotos.",
  openGraph: {
    title: "Desarrollo de Apps Web y Software a Medida | Cosecha Creativa",
    description:
      "Desde paneles internos hasta plataformas SaaS: diseñamos software que ordena procesos y escala con tu negocio.",
    url: "https://cosechacreativa.com.ar/servicios/apps",
  },
}

export default function AppsPage() {
  return <AppsWebClient />
}
