import type { Metadata } from "next"
import { PublicidadPagaClient } from "@/components/landing/servicios/publicidad-paga-client"

export const metadata: Metadata = {
  title: "Publicidad paga en redes",
  description:
    "Campañas de Meta Ads, Google Ads, TikTok y LinkedIn en San Juan. Segmentación, creativos UGC, optimización de ROAS y escalamiento controlado.",
  alternates: {
    canonical: "https://cosechacreativa.com.ar/servicios/publicidad-paga-en-redes",
  },
  openGraph: {
    title: "Publicidad paga en redes | Cosecha Creativa",
    description:
      "Transformamos tu inversión publicitaria en resultados medibles: Meta, Google, TikTok y LinkedIn.",
    url: "https://cosechacreativa.com.ar/servicios/publicidad-paga-en-redes",
  },
}

export default function PublicidadPagaEnRedesPage() {
  return <PublicidadPagaClient />
}
