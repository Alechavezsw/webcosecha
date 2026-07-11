"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NosotrosAmbientShell } from "@/components/landing/nosotros-ambient-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosPillarItem = {
  icon: LucideIcon;
  title: string;
  body: string;
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
    <NosotrosAmbientShell className={className}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: easePremium }}
        className="max-w-3xl"
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/90">
          Características
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Por qué trabajar con nosotros
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/55 md:text-[17px]">
          Tres pilares que guían cada proyecto: equipo, tecnología y resultados medibles.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {pillars.map((p, i) => (
          <motion.article
            key={p.title}
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px", amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: easePremium }}
            whileHover={
              reduce
                ? undefined
                : {
                    y: -6,
                    transition: { duration: 0.35, ease: easePremium },
                  }
            }
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/12",
              "bg-gradient-to-b from-white/[0.07] to-black/40 shadow-[0_24px_70px_-48px_rgba(236,168,214,0.35)]",
              "backdrop-blur-md transition-shadow duration-300 hover:border-[#eca8d6]/35 hover:shadow-[0_28px_90px_-40px_rgba(236,168,214,0.28)]",
            )}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#eca8d6]/15 blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eca8d6]/10 via-transparent to-violet-600/10" />
            </div>

            <div className="relative z-10 p-8">
              <div className="mb-6 inline-flex rounded-xl border border-white/15 bg-black/50 p-3.5 text-[#eca8d6] shadow-inner transition-transform duration-300 group-hover:scale-105">
                <p.icon className="h-7 w-7" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/68">{p.body}</p>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.article>
        ))}
      </div>
    </NosotrosAmbientShell>
  );
}
