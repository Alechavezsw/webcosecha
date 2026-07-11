import type { Metadata } from "next";
import App from "@/components/mineria/App";

export const metadata: Metadata = {
  title: "Minería y Proveedores Industriales — Posicionamiento B2B | Cosecha Creativa",
  description:
    "Desarrollo web corporativo, branding industrial, producción audiovisual en terreno (minas/talleres) y posicionamiento LinkedIn B2B para el sector de la minería y proveedores industriales. San Juan, Argentina.",
  openGraph: {
    title: "Minería y Proveedores Industriales — Cosecha Creativa",
    description:
      "Llevamos tu empresa proveedora industrial al estándar que exigen las grandes operadoras mineras globales.",
    url: "https://cosechacreativa.com.ar/mineria",
    siteName: "Cosecha Creativa",
    locale: "es_AR",
    type: "website",
  },
};

export default function MineriaPage() {
  return <App />;
}
