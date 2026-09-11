"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { NosotrosSectionShell } from "@/components/landing/nosotros-section-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosIaServiceItem = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Página de servicio a la que enlaza la tarjeta. */
  href?: string;
  /** Etiquetas cortas que muestran el alcance real del servicio. */
  tags?: string[];
};

/** Bento: la primera tarjeta es más ancha y las filas siguientes cambian de ritmo. */
const SPANS = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
];

export function NosotrosIaServicesSection({ services }: { services: NosotrosIaServiceItem[] }) {
  const reduce = useReducedMotion();

  return (
    <NosotrosSectionShell variant="cyan">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easePremium }}
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-[#67e8f9]">
            Lo que hacemos
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[2.6rem] font-semibold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-[5rem]">
            Seis
            <span className="italic text-[#67e8f9]"> disciplinas</span>{", "}
            <span className="block text-white/30">una sola mesa</span>
          </h2>
        </motion.div>
        <Sparkles className="hidden h-10 w-10 text-[#67e8f9]/40 md:block" aria-hidden />
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05, ease: easePremium }}
        className="mt-6 max-w-3xl text-[15px] leading-relaxed text-white/60 md:text-[17px]"
      >
        Usamos herramientas actuales —incluida la inteligencia artificial donde realmente suma— para
        que cada pieza empuje en la misma dirección: más consultas, mejor marca, menos trabajo
        manual.
      </motion.p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
        {services.map((s, i) => {
          const featured = i === 0;
          const inner = (
            <>
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#67e8f9]/12 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#67e8f9]/12 via-transparent to-[#22d3ee]/14" />
              </div>
              {/* Barrido de luz en hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(103,232,249,0.14)_50%,transparent_65%)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
              />
              {/* Índice de la tarjeta, en contorno */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute select-none font-display leading-none tabular-nums text-transparent",
                  "[-webkit-text-stroke:1px_rgba(255,255,255,0.14)] transition-all duration-500",
                  "group-hover:[-webkit-text-stroke:1px_rgba(103,232,249,0.55)]",
                  featured ? "bottom-4 right-6 text-[7rem]" : "bottom-3 right-4 text-[4.5rem]",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={cn("relative z-10 flex h-full flex-col p-6", featured && "md:p-9")}>
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={cn(
                      "inline-flex rounded-lg border border-white/12 bg-black/45 text-[#67e8f9] transition-transform duration-300 group-hover:scale-105",
                      featured ? "p-3.5" : "p-2.5",
                    )}
                  >
                    <s.icon className={featured ? "h-7 w-7" : "h-5 w-5"} aria-hidden />
                  </div>
                  {s.href ? (
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 -translate-y-1 text-white/25 transition-all duration-300 group-hover:translate-y-0 group-hover:text-[#67e8f9]"
                      aria-hidden
                    />
                  ) : null}
                </div>

                <h3
                  className={cn(
                    "mt-5 font-display font-semibold text-white",
                    featured ? "text-2xl md:text-[1.9rem]" : "text-lg",
                  )}
                >
                  {s.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 flex-1 leading-relaxed text-white/65",
                    featured ? "max-w-lg text-[15px] md:text-[16.5px]" : "text-sm",
                  )}
                >
                  {s.body}
                </p>

                {s.tags?.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </>
          );

          const cardClass = cn(
            "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/12",
            "bg-gradient-to-b from-white/[0.07] to-black/40 shadow-[0_24px_70px_-48px_rgba(103,232,249,0.3)]",
            "backdrop-blur-md transition-shadow duration-300 hover:border-[#67e8f9]/35",
            "hover:shadow-[0_28px_90px_-40px_rgba(103,232,249,0.28)]",
            featured && "sm:col-span-2 bg-gradient-to-br from-[#67e8f9]/[0.10] via-white/[0.04] to-black/45",
          );

          return (
            <motion.div
              key={s.title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px", amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: easePremium }}
              whileHover={reduce ? undefined : { y: -5, transition: { duration: 0.3, ease: easePremium } }}
              className={SPANS[i] ?? "lg:col-span-2"}
            >
              {s.href ? (
                <Link href={s.href} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <article className={cardClass}>{inner}</article>
              )}
            </motion.div>
          );
        })}
      </div>
    </NosotrosSectionShell>
  );
}
