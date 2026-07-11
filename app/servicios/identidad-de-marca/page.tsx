import type { Metadata } from "next"
import { IdentidadMarcaClient } from "@/components/landing/servicios/identidad-marca-client"

export const metadata: Metadata = {
  title: "Identidad de Marca / Branding | Cosecha Creativa — San Juan",
  description:
    "Diseñamos identidad de marca con raíces: estrategia, naming, logotipo, sistema visual y manual de marca. Branding que crece con tu negocio. Cosecha Creativa, San Juan.",
  openGraph: {
    title: "Identidad de Marca / Branding | Cosecha Creativa",
    description:
      "Estrategia, naming, sistema visual y manual de marca. Una identidad coherente que se reconoce a la distancia.",
    url: "https://cosechacreativa.com.ar/servicios/identidad-de-marca",
  },
}

export default function IdentidadDeMarcaPage() {
  return <IdentidadMarcaClient />
}
