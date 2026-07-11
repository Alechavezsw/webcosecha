import type { Metadata } from "next"
import { SeoPosicionamientoClient } from "@/components/landing/servicios/seo-posicionamiento-client"

export const metadata: Metadata = {
  title: "Posicionamiento SEO | Cosecha Creativa",
  description:
    "SEO técnico, contenido, local y analítica para ganar visibilidad en Google. Servicio integral en San Juan — Cosecha Creativa.",
  openGraph: {
    title: "Posicionamiento SEO | Cosecha Creativa",
    description:
      "Auditoría, keywords, on-page, SEO local, velocidad, Search Console y estrategia de autoridad.",
    url: "https://cosechacreativa.com.ar/",
  },
}

export default function SeoPage() {
  return <SeoPosicionamientoClient />
}
