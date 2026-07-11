"use client";

import Image from "next/image";
import { Store } from "lucide-react";
import { simpleIconUrl } from "@/components/landing/servicios/nube-tech-logos";
import { cn } from "@/lib/utils";

export type EcommerceLogoEntry =
  | { type: "simple-icon"; slug: string; label: string }
  | { type: "tienda-nube"; label: "Tienda Nube" };

/** WhatsApp (bloque “Qué incluye”). */
export const ECOMMERCE_LOGOS_WHATSAPP: EcommerceLogoEntry[] = [
  { type: "simple-icon", slug: "whatsapp", label: "WhatsApp" },
];

/** Mercado Pago y medios de pago nombrados. */
export const ECOMMERCE_LOGOS_PAYMENT: EcommerceLogoEntry[] = [
  { type: "simple-icon", slug: "mercadopago", label: "Mercado Pago" },
];

/** Redes y herramientas nombradas en “Podemos conectar” (Meta cubre Pixel y Ads). */
export const ECOMMERCE_LOGOS_SOCIAL: EcommerceLogoEntry[] = [
  { type: "simple-icon", slug: "instagram", label: "Instagram" },
  { type: "simple-icon", slug: "facebook", label: "Facebook" },
  { type: "simple-icon", slug: "whatsapp", label: "WhatsApp Business" },
  { type: "simple-icon", slug: "meta", label: "Meta (Pixel / Ads)" },
  { type: "simple-icon", slug: "googleanalytics", label: "Google Analytics" },
  { type: "simple-icon", slug: "googletagmanager", label: "Google Tag Manager" },
];

/** Plataformas y stack (WordPress a Firebase). Tienda Nube no está en Simple Icons: chip propio. */
export const ECOMMERCE_LOGOS_PLATFORM: EcommerceLogoEntry[] = [
  { type: "simple-icon", slug: "wordpress", label: "WordPress" },
  { type: "simple-icon", slug: "woocommerce", label: "WooCommerce" },
  { type: "tienda-nube", label: "Tienda Nube" },
  { type: "simple-icon", slug: "shopify", label: "Shopify" },
  { type: "simple-icon", slug: "nextdotjs", label: "Next.js" },
  { type: "simple-icon", slug: "supabase", label: "Supabase" },
  { type: "simple-icon", slug: "firebase", label: "Firebase" },
];

export function EcommerceBrandLogoRow({
  items,
  eyebrow,
  className,
}: {
  items: readonly EcommerceLogoEntry[];
  eyebrow: string;
  className?: string;
}) {
  return (
    <div className={cn("mt-8 border-t border-white/10 pt-8", className)}>
      <p className="mb-4 cc-eyebrow-accent">
        {eyebrow}
      </p>
      <ul className="flex flex-wrap gap-2.5" role="list">
        {items.map((item) => {
          const key =
            item.type === "tienda-nube"
              ? "tienda-nube"
              : `${item.slug}-${item.label}`;
          return (
            <li key={key}>
              <div className="flex max-w-full items-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.97] px-3 py-2.5 shadow-sm">
                {item.type === "simple-icon" ? (
                  <Image
                    src={simpleIconUrl(item.slug)}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 object-contain"
                    unoptimized
                  />
                ) : (
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-700"
                    aria-hidden
                  >
                    <Store className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                )}
                <span className="text-[12px] font-medium leading-tight text-gray-800 sm:text-[13px]">
                  {item.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
