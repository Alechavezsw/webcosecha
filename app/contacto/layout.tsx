import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por WhatsApp o email. Cosecha Creativa — agencia de marketing digital, diseño web e IA en San Juan, Argentina.",
  alternates: {
    canonical: "https://cosechacreativa.com.ar/contacto",
  },
  openGraph: {
    title: "Contacto | Cosecha Creativa",
    description:
      "Hablemos de tu proyecto. WhatsApp, email y consulta sin compromiso.",
    url: "https://cosechacreativa.com.ar/contacto",
  },
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children
}
