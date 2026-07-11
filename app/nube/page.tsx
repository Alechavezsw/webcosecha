import type { Metadata } from "next"
import { NubePageClient } from "@/components/landing/servicios/nube-page-client"

export const metadata: Metadata = {
  title: "Despliegue en la nube | VPS, Docker, automatización — Cosecha Creativa",
  description:
    "Servidores VPS, Docker, bases de datos y despliegue en la nube para aplicaciones web, automatizaciones e IA. Infraestructura lista para escalar — Cosecha Creativa, San Juan.",
}

export default function NubePage() {
  return <NubePageClient />
}
