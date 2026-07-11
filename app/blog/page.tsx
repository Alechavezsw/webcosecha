import type { Metadata } from "next";
import { BlogPageClient } from "@/components/landing/blog-page-client";

export const metadata: Metadata = {
  title: "Blog — Ideas, Estrategias y Futuro Digital",
  description:
    "Exploramos el impacto del diseño web de vanguardia, la inteligencia artificial aplicada con n8n, el marketing digital y la comunicación política de impacto en San Juan.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Cosecha Creativa",
    description:
      "Ideas, Estrategias y Futuro Digital. Artículos sobre IA, Diseño Web Premium, Gestión de Redes y Comunicación Política.",
    url: "https://cosechacreativa.com.ar/blog",
    siteName: "Cosecha Creativa",
    locale: "es_AR",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
