import type { Metadata } from "next";
import { NosotrosPageClient } from "@/components/landing/nosotros-page-client";

const BASE_URL = "https://cosechacreativa.com.ar";

export const metadata: Metadata = {
  title: "Nosotros | Cosecha Creativa — Marketing digital y diseño web en San Juan",
  description:
    "Somos un equipo de seis especialistas en San Juan: desarrollo web, IA aplicada, publicidad, redes y fotografía. Conocé nuestro método de trabajo, principios y trayectoria desde 2003.",
  keywords: [
    "agencia marketing digital San Juan",
    "diseño web San Juan",
    "inteligencia artificial aplicada",
    "Cosecha Creativa",
    "equipo",
  ],
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    title: "Nosotros — Cosecha Creativa",
    description:
      "Equipo multidisciplinario en San Juan: estrategia, diseño, desarrollo e IA aplicada. Método de trabajo, principios y más de 20 años de trayectoria.",
    url: `${BASE_URL}/nosotros`,
    siteName: "Cosecha Creativa",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros — Cosecha Creativa",
    description:
      "Equipo multidisciplinario en San Juan: estrategia, diseño, desarrollo e IA aplicada.",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Nosotros — Cosecha Creativa",
  url: `${BASE_URL}/nosotros`,
  inLanguage: "es-AR",
  description:
    "Equipo, método de trabajo, principios y trayectoria de Cosecha Creativa, agencia de marketing digital y desarrollo en San Juan, Argentina.",
  mainEntity: { "@id": `${BASE_URL}/#organization` },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Nosotros", item: `${BASE_URL}/nosotros` },
  ],
};

export default function NosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NosotrosPageClient />
    </>
  );
}
