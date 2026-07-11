import type { Metadata } from "next";
import { NosotrosPageClient } from "@/components/landing/nosotros-page-client";

export const metadata: Metadata = {
  title: "Nosotros | Cosecha Creativa — Marketing digital y diseño web en San Juan",
  description:
    "Equipo multidisciplinario, tecnología e IA aplicada al marketing digital. Historia, servicios y valores de Cosecha Creativa (San Juan, Argentina).",
  openGraph: {
    title: "Nosotros — Cosecha Creativa",
    description:
      "Innovación y tecnología para tu negocio. Conocé al equipo y nuestra trayectoria.",
    url: "https://cosechacreativa.com.ar/nosotros",
    siteName: "Cosecha Creativa",
    locale: "es_AR",
    type: "website",
  },
};

export default function NosotrosPage() {
  return <NosotrosPageClient />;
}
