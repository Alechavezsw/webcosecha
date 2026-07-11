import type { Metadata } from "next"
import { PublicidadPagaClient } from "@/components/landing/servicios/publicidad-paga-client"

export const metadata: Metadata = {
  title: "Publicidad paga en redes | Cosecha Creativa",
  description:
    "Campañas de Meta Ads estratégicas en Facebook e Instagram. Segmentación, creatividad y optimización para tu negocio en San Juan.",
  openGraph: {
    title: "Publicidad paga en redes | Cosecha Creativa",
    description:
      "Transformamos tu inversión en resultados con anuncios optimizados y reportes claros.",
    url: "https://cosechacreativa.com.ar/",
  },
}

export default function PublicidadPagaEnRedesPage() {
  return <PublicidadPagaClient />
}
