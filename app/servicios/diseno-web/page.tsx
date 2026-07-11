import type { Metadata } from "next"
import { DisenoWebClient } from "@/components/landing/servicios/diseno-web-client"

export const metadata: Metadata = {
  title: "Diseño Web en San Juan | Sitios premium y SEO — Cosecha Creativa",
  description:
    "Diseño y desarrollo de sitios web profesionales en San Juan: premium, responsive, SEO, WordPress, e-commerce y landing pages. contacto@cosechacreativa.com.ar",
  openGraph: {
    title: "Diseño Web en San Juan | Cosecha Creativa",
    description:
      "Webs modernas, rápidas y optimizadas para Google. Estrategia digital con identidad sanjuanina.",
    url: "https://cosechacreativa.com.ar/servicios/diseno-web",
  },
}

export default function DisenoWebPage() {
  return <DisenoWebClient />
}
