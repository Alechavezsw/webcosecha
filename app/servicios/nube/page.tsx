import type { Metadata } from "next"
import { NubePageClient } from "@/components/landing/servicios/nube-page-client"

export const metadata: Metadata = {
  title: "Soluciones en la Nube | Cosecha Creativa — San Juan",
  description:
    "Desplegamos tu empresa en la nube: servidores VPS, automatizaciones con IA, integraciones y sistemas escalables. Cosecha Creativa, San Juan.",
  openGraph: {
    title: "Soluciones en la Nube | Cosecha Creativa",
    description:
      "Servidores VPS, automatizaciones con IA y sistemas escalables. Digitalizamos tu empresa y la llevamos a la nube.",
    url: "https://cosechacreativa.com.ar/servicios/nube",
  },
}

export default function NubePage() {
  return <NubePageClient />
}
