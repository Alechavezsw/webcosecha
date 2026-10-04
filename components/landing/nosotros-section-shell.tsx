"use client";

import type { ReactNode } from "react";
import { NosotrosAmbientParticles } from "@/components/landing/nosotros-ambient-shell";
import { cn } from "@/lib/utils";

/**
 * Un color y una textura por sección. La secuencia de la página es
 * rosa (hero) → plata (datos) → violeta → cian → esmeralda → cobre → rosa (equipo),
 * para que dos secciones contiguas nunca compartan paleta ni trama.
 */
export type NosotrosSectionVariant =
  | "violet" // por qué nosotros — violeta + trama de puntos
  | "cyan" // servicios — cian + rayas diagonales
  | "emerald" // proceso — esmeralda + grilla técnica
  | "copper" // trayectoria — cobre sepia + estrellas
  | "rose" // equipo — rosa + líneas horizontales
  | "quiet"; // bandas neutras

const VARIANTS: Record<
  NosotrosSectionVariant,
  { base: string; glows: string[]; texture?: string }
> = {
  violet: {
    base: "bg-[#0a0616]/80",
    glows: [
      "bg-[radial-gradient(ellipse_90%_70%_at_12%_-10%,rgba(139,92,246,0.28),transparent_58%)]",
      "bg-[radial-gradient(ellipse_60%_55%_at_95%_95%,rgba(167,139,250,0.16),transparent_55%)]",
    ],
    texture:
      "opacity-[0.55] [background-image:radial-gradient(rgba(196,181,253,0.16)_1px,transparent_1px)] [background-size:26px_26px]",
  },
  cyan: {
    base: "bg-[#030d14]/85",
    glows: [
      "bg-[radial-gradient(ellipse_75%_65%_at_88%_-8%,rgba(34,211,238,0.24),transparent_58%)]",
      "bg-[radial-gradient(ellipse_70%_60%_at_3%_100%,rgba(103,232,249,0.14),transparent_55%)]",
    ],
    texture:
      "opacity-[0.6] [background-image:repeating-linear-gradient(135deg,rgba(103,232,249,0.075)_0px,rgba(103,232,249,0.075)_1px,transparent_1px,transparent_13px)]",
  },
  emerald: {
    base: "bg-[#02100c]/88",
    glows: [
      "bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(16,185,129,0.22),transparent_60%)]",
      "bg-[radial-gradient(ellipse_50%_50%_at_90%_110%,rgba(52,211,153,0.12),transparent_60%)]",
    ],
    // Grilla técnica: cuadros grandes + subdivisión fina
    texture:
      "[background-image:linear-gradient(rgba(52,211,153,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.09)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] [background-size:96px_96px,96px_96px,24px_24px,24px_24px]",
  },
  copper: {
    base: "bg-[#0b0503]/90",
    glows: [
      "bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(184,82,33,0.26),transparent_62%)]",
      "bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_35%,rgba(4,2,1,0.9)_100%)]",
    ],
    // Campo de estrellas cálido
    texture:
      "opacity-[0.8] [background-image:radial-gradient(rgba(255,255,255,0.32)_1px,transparent_1px),radial-gradient(rgba(224,145,89,0.4)_1px,transparent_1px)] [background-size:120px_120px,190px_190px] [background-position:0_0,60px_95px]",
  },
  rose: {
    base: "bg-[#0d0710]/85",
    glows: [
      "bg-[radial-gradient(ellipse_85%_60%_at_50%_-10%,rgba(236,168,214,0.24),transparent_60%)]",
      "bg-[radial-gradient(ellipse_55%_55%_at_8%_100%,rgba(236,168,214,0.12),transparent_55%)]",
    ],
    // Líneas horizontales
    texture:
      "opacity-[0.45] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:100%_36px]",
  },
  quiet: {
    base: "bg-[#050407]/85",
    glows: ["bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent_60%)]"],
  },
};

export function NosotrosSectionShell({
  children,
  variant = "violet",
  particles = false,
  className,
  sectionClassName,
}: {
  children: ReactNode;
  variant?: NosotrosSectionVariant;
  /** Canvas de partículas (solo donde suma; es caro repetirlo). */
  particles?: boolean;
  className?: string;
  sectionClassName?: string;
}) {
  const v = VARIANTS[variant];

  // overflow: clip recorta igual que hidden pero no crea contenedor de scroll:
  // así las secciones pueden fijar contenido con position: sticky.
  return (
    <section className={cn("relative [overflow:clip] py-16 md:py-24", sectionClassName)}>
      <div className={cn("pointer-events-none absolute inset-0", v.base)} aria-hidden />
      {v.glows.map((g, i) => (
        <div key={i} className={cn("pointer-events-none absolute inset-0", g)} aria-hidden />
      ))}
      {v.texture ? (
        <div className={cn("pointer-events-none absolute inset-0", v.texture)} aria-hidden />
      ) : null}

      {/* Sin regla superior propia: el <SectionDivider> que va justo arriba ya
          dibuja la línea del corte, y con su mismo color. Tener las dos dejaba
          dos hairlines a 1px de distancia, que se leían como una barra doble. */}

      {particles ? (
        <div className="absolute inset-0 z-[1] overflow-hidden">
          <NosotrosAmbientParticles />
        </div>
      ) : null}

      <div className={cn("relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12", className)}>
        {children}
      </div>
    </section>
  );
}
