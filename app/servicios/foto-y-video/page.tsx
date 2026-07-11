import type { Metadata } from "next"
import { FotoYVideoClient } from "@/components/landing/servicios/foto-y-video-client"

const ORIGINAL_URL =
  "https://cosechacreativa.com.ar/fotografia-profesional-en-san-juan/" as const

export const metadata: Metadata = {
  title: "Foto y Video | Cosecha Creativa — San Juan",
  description:
    "Fotografía profesional, video corporativo, reels y edición audiovisual en San Juan. Producto, eventos, marcas e instituciones.",
  openGraph: {
    title: "Foto y Video | Cosecha Creativa",
    description:
      "Producción fotográfica y audiovisual de alta calidad para potenciar tu marca en digital.",
    url: ORIGINAL_URL,
  },
}

export default function FotoYVideoPage() {
  return <FotoYVideoClient />
}
