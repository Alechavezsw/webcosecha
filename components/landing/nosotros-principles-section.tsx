"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NosotrosSectionShell } from "@/components/landing/nosotros-section-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosPrinciple = {
  icon: LucideIcon;
  title: string;
  body: string;
};

/**
 * "Por qué nosotros": lista editorial a dos columnas con encabezado pegajoso.
 * Sin tarjetas: es el contrapunto de la grilla bento de servicios y evita que
 * dos secciones seguidas se vean igual.
 */
export function NosotrosPrinciplesSection({
  principles,
}: {
  principles: NosotrosPrinciple[];
}) {
  const reduce = useReducedMotion();

  return (
    <NosotrosSectionShell variant="violet" particles>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: easePremium }}
          className="lg:col-span-5"
        >
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a78bfa]">
              Por qué nosotros
            </p>
            <h2 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
              {"Un solo "}
              <span className="italic text-[#a78bfa]">equipo</span>{", "}
              <span className="block text-white/30">un mismo criterio</span>
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/55 md:text-[16.5px]">
              Cuatro cosas que aplicamos siempre, incluso cuando complican la venta.
            </p>
          </div>
        </motion.div>

        <div className="lg:col-span-7">
          <ul className="divide-y divide-white/[0.1] border-y border-white/[0.1]">
            {principles.map((p, i) => (
              <motion.li
                key={p.title}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px", amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: easePremium }}
                className={cn(
                  "group relative flex gap-5 py-7 transition-colors duration-300 md:gap-7 md:py-8",
                  "hover:bg-white/[0.025]",
                )}
              >
                {/* Numeral gigante en contorno + icono chico: contraste de escala. */}
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <span
                    aria-hidden
                    className="select-none font-display text-4xl leading-none tabular-nums text-transparent [-webkit-text-stroke:1px_rgba(196,181,253,0.35)] transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(167,139,250,0.95)] md:text-[3.5rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-black/45 text-[#c4b5fd] transition-all duration-300 group-hover:border-[#a78bfa]/60 group-hover:scale-105">
                    <p.icon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl leading-snug text-white md:text-[1.9rem]">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-white/58 md:text-[15.5px]">
                    {p.body}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-[#a78bfa]/85 to-transparent transition-all duration-500 group-hover:w-2/3"
                />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </NosotrosSectionShell>
  );
}
