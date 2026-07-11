import type { Metadata } from "next";
import { CompolPageClient } from "@/components/landing/compol-page-client";

export const metadata: Metadata = {
  title: "Compol — Comunicación política | Cosecha Creativa",
  description:
    "Equipo especializado en comunicación política, gubernamental y de campaña: estrategia, community management, sondeos, diseño, crisis, contenidos, fotografía y análisis de datos. San Juan, Argentina.",
  openGraph: {
    title: "Compol — Comunicación política | Cosecha Creativa",
    description:
      "Asesoramiento, estrategia digital, investigación, producción visual, crisis, redacción, cobertura fotográfica y big data para campañas y gestión.",
    url: "https://cosechacreativa.com.ar/compol",
    siteName: "Cosecha Creativa",
    locale: "es_AR",
    type: "website",
  },
};

export default function CompolPage() {
  return <CompolPageClient />;
}
