import type { Metadata } from "next";
import { ServiciosPageClient } from "@/components/landing/servicios/servicios-page-client";

export const metadata: Metadata = {
  title: "Nuestros Servicios | Cosecha Creativa — Ecosistema Digital",
  description:
    "Explorá el ecosistema completo de servicios digitales de Cosecha Creativa. Un bosque interactivo 3D inmersivo que recorre Estrategia 360°, Desarrollo Web, Branding Industrial, Paid Ads, SEO, IA y Redes Sociales.",
  openGraph: {
    title: "Nuestros Servicios | Cosecha Creativa",
    description:
      "Explorá nuestro bosque de servicios digitales interactivo en 3D.",
    url: "https://cosechacreativa.com.ar/servicios",
    siteName: "Cosecha Creativa",
    locale: "es_AR",
    type: "website",
  },
};

export default function ServiciosPage() {
  return <ServiciosPageClient />;
}
