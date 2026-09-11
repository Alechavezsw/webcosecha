"use client";

import { motion, useReducedMotion } from "framer-motion";
import { NosotrosSectionShell } from "@/components/landing/nosotros-section-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosProcessStep = {
  title: string;
  body: string;
  /** Duración orientativa que se muestra al costado del paso. */
  meta: string;
};

/**
 * "Cómo trabajamos" como hoja de papel clara sobre fondo oscuro.
 * Es la única sección invertida de la página: corta el scroll en seco y
 * hace que el método se lea como un documento y no como otra grilla más.
 */
export function NosotrosProcessSection({ steps }: { steps: NosotrosProcessStep[] }) {
  const reduce = useReducedMotion();

  return (
    <NosotrosSectionShell variant="emerald">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 34 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: easePremium }}
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]",
          "bg-[#f5f2ea] text-[#14100c]",
          "shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-black/10",
        )}
      >
        {/* Papel cuadriculado */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(20,16,12,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(20,16,12,0.055)_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_88%_0%,rgba(16,185,129,0.18),transparent_60%)]"
        />

        <div className="relative z-10 px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:px-16">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#14100c]/15 pb-10">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0b7a5a]">
                Método
              </p>
              <h2 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.92] tracking-tight text-[#14100c] sm:text-6xl lg:text-[5rem]">
                Cómo
                <span className="italic text-[#0b7a5a]"> trabajamos</span>
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-[#14100c]/60 md:text-[16px]">
              Cinco etapas, sin misterio. Sabés en cuál estás, qué se entrega en cada una y cuándo
              empezás a ver resultados.
            </p>
          </div>

          <ol className="divide-y divide-[#14100c]/12">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px", amount: 0.25 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: easePremium }}
                className="group relative grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 py-7 md:grid-cols-[7rem_1fr_9rem] md:gap-x-8 md:py-9"
              >
                {/* Numeral gigante en contorno */}
                <span
                  aria-hidden
                  className={cn(
                    "select-none font-display text-5xl leading-none tabular-nums md:text-[5.5rem]",
                    "text-transparent [-webkit-text-stroke:1px_rgba(20,16,12,0.3)]",
                    "transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(11,122,90,0.95)]",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-2xl leading-tight text-[#14100c] transition-colors duration-300 group-hover:text-[#0b7a5a] md:text-[2rem]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-[#14100c]/65 md:text-[16px]">
                    {step.body}
                  </p>
                </div>

                <span className="col-start-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#14100c]/40 md:col-start-3 md:justify-self-end md:pt-3">
                  {step.meta}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </motion.div>
    </NosotrosSectionShell>
  );
}
