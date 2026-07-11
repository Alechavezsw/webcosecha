import type { Metadata } from "next";
import { EcommercePageClient } from "@/components/landing/servicios/ecommerce-page-client";

export const metadata: Metadata = {
  title: "E-commerce y tiendas online | Cosecha Creativa — San Juan",
  description:
    "Tiendas online profesionales: WooCommerce, Shopify, medios de pago, envíos, WhatsApp, redes y automatización. Cosecha Creativa, San Juan.",
  openGraph: {
    title: "E-commerce y tiendas online | Cosecha Creativa",
    description:
      "Diseñamos y desarrollamos tiendas listas para vender, con pagos, envíos e integraciones.",
    url: "https://cosechacreativa.com.ar/servicios/ecommerce",
  },
};

export default function EcommercePage() {
  return <EcommercePageClient />;
}
