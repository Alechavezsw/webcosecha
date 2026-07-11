import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI FIRST | Orquestación y Creación de Agentes de IA — Cosecha Creativa",
  description: "Diseñá y desplegá agentes de IA autónomos que piensan, actúan y ejecutan cualquier flujo de trabajo en tu negocio. Automatización inteligente.",
}

export default function AiFirstLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
