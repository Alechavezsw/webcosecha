"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NosotrosSectionShell } from "@/components/landing/nosotros-section-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosPillarItem = {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Dato corto que baja el pilar a algo concreto. */
  proof?: string;
};

export function NosotrosPillarsSection({
  pillars,
  className,
}: {
  pillars: NosotrosPillarItem[];
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <NosotrosSectionShell variant="rose" particles className={className}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: easePremium }}
        className="max-w-3xl"
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/90">
          Por qué nosotros
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Un solo equipo para todo el proyecto
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/58 md:text-[17px]">
          Estrategia, diseño, desarrollo y contenido en la misma mesa. Sin proveedores encadenados
          ni responsabilidades repartidas cuando algo hay que resolver.
        </p>
      </motion.div>

      {/* 3 columnas recién en lg: a 768px las tarjetas quedaban con ~20 caracteres por línea. */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {pillars.map((p, i) => (
          <motion.article
            key={p.title}
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px", amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: easePremium }}
            whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.35, ease: easePremium } }}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-white/12",
              "bg-gradient-to-b from-white/[0.07] to-black/45 shadow-[0_24px_70px_-48px_rgba(236,168,214,0.35)]",
              "backdrop-blur-md transition-shadow duration-300 hover:border-[#eca8d6]/35",
              "hover:shadow-[0_28px_90px_-40px_rgba(236,168,214,0.3)]",
            )}
          >
            {/* Numeral de fondo: ancla visual que diferencia esta grilla de las siguientes. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[8rem] leading-none text-white/[0.04] transition-all duration-500 group-hover:text-[#eca8d6]/[0.09]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#eca8d6]/12 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-1 flex-col p-6 md:p-7 lg:p-8">
              <div className="mb-6 inline-flex w-fit rounded-xl border border-white/15 bg-black/50 p-3.5 text-[#eca8d6] shadow-inner transition-transform duration-300 group-hover:scale-105">
                <p.icon className="h-7 w-7" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-semibold text-white md:text-[1.4rem]">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/65">{p.body}</p>

              {p.proof ? (
                <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#eca8d6]/75">
                  {p.proof}
                </p>
              ) : null}
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </NosotrosSectionShell>
  );
}
