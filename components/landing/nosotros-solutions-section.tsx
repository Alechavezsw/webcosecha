"use client";

import { motion, useReducedMotion } from "framer-motion";
import { NosotrosAmbientShell } from "@/components/landing/nosotros-ambient-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosSolutionItem = {
  title: string;
  body: string;
};

export function NosotrosSolutionsSection({ solutions }: { solutions: NosotrosSolutionItem[] }) {
  const reduce = useReducedMotion();

  return (
    <NosotrosAmbientShell>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 22 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: easePremium }}
        className="max-w-4xl"
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/90">
          Soluciones
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Soluciones completas para crecer en digital
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/58 md:text-[17px]">
          Nos adaptamos con servicios personalizados, tecnología y estrategia. Trabajo colaborativo
          para mejorar presencia, procesos y conversión.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {solutions.map((s, i) => (
          <motion.article
            key={s.title}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: easePremium }}
            whileHover={
              reduce
                ? undefined
                : { y: -6, transition: { duration: 0.35, ease: easePremium } }
            }
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/12",
              "bg-gradient-to-b from-white/[0.06] to-black/45 shadow-[0_20px_60px_-44px_rgba(236,168,214,0.28)]",
              "backdrop-blur-md transition-shadow duration-300 hover:border-[#eca8d6]/35 hover:shadow-[0_26px_85px_-38px_rgba(236,168,214,0.26)]",
            )}
          >
            <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#eca8d6]/70 via-[#eca8d6]/35 to-transparent opacity-90" />
            <div className="pointer-events-none absolute -right-14 top-0 h-36 w-36 rounded-full bg-[#eca8d6]/10 blur-3xl opacity-70 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 border-l border-transparent py-8 pl-8 pr-6 md:pl-9">
              <h3 className="font-display text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{s.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </NosotrosAmbientShell>
  );
}
