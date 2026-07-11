import type { Metadata } from "next";
import { EventosPageClient } from "@/components/landing/servicios/eventos-page-client";

export const metadata: Metadata = {
  title: "Apps, juegos y experiencias digitales para eventos | Cosecha Creativa",
  description:
    "Trivias en vivo, juegos para pantallas, apps web, gamificación para stands y ferias. Experiencias interactivas para eventos corporativos, deportivos y de marca en San Juan.",
  openGraph: {
    title: "Apps, juegos y experiencias digitales para eventos | Cosecha Creativa",
    description:
      "Trivias, ruletas, rankings, QR y pantallas dinámicas. Hacemos que el público participe y recuerde tu marca.",
    url: "https://cosechacreativa.com.ar/servicios/eventos",
  },
};

export default function EventosPage() {
  return <EventosPageClient />;
}
