"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { NosotrosAmbientShell } from "@/components/landing/nosotros-ambient-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosIaServiceItem = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export function NosotrosIaServicesSection({ services }: { services: NosotrosIaServiceItem[] }) {
  const reduce = useReducedMotion();

  return (
    <NosotrosAmbientShell>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easePremium }}
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/90">
            Lo que hacemos
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Servicios digitales para marcas que quieren más impacto
          </h2>
        </motion.div>
        <Sparkles className="hidden h-10 w-10 text-[#eca8d6]/40 md:block" aria-hidden />
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05, ease: easePremium }}
        className="mt-6 max-w-3xl text-[15px] leading-relaxed text-white/60 md:text-[17px]"
      >
        Aprovechamos herramientas actuales —incluida la inteligencia artificial donde suma— para
        optimizar procesos, creatividad y resultados medibles.
      </motion.p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px", amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: easePremium }}
            whileHover={
              reduce
                ? undefined
                : { y: -5, transition: { duration: 0.3, ease: easePremium } }
            }
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/12",
              "bg-gradient-to-b from-white/[0.07] to-black/40 shadow-[0_24px_70px_-48px_rgba(236,168,214,0.3)]",
              "backdrop-blur-md transition-shadow duration-300 hover:border-[#eca8d6]/35 hover:shadow-[0_28px_90px_-40px_rgba(236,168,214,0.25)]",
            )}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#eca8d6]/12 blur-2xl opacity-80 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eca8d6]/8 via-transparent to-violet-600/10" />
            </div>
            <div className="relative z-10 p-6 md:p-7">
              <div className="mb-4 inline-flex rounded-lg border border-white/12 bg-black/45 p-2.5 text-[#eca8d6] transition-transform group-hover:scale-105">
                <s.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </NosotrosAmbientShell>
  );
}
