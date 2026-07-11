import type { Metadata } from "next"
import { GestionRedesClient } from "@/components/landing/servicios/gestion-redes-client"

const ORIGINAL_URL =
  "https://cosechacreativa.com.ar/servicio-de-gestion-de-redes-sociales/" as const

export const metadata: Metadata = {
  title: "Gestión de Redes Sociales | Cosecha Creativa",
  description:
    "Planes de contenido, comunidad y reportes para marcas en San Juan. Estrategia 360° para redes sociales con Cosecha Creativa.",
  openGraph: {
    title: "Gestión de Redes Sociales | Cosecha Creativa",
    description:
      "Estrategias personalizadas, creación de contenido, planificación e interacción con tu audiencia.",
    url: ORIGINAL_URL,
  },
}

export default function GestionRedesSocialesPage() {
  return <GestionRedesClient />
}
