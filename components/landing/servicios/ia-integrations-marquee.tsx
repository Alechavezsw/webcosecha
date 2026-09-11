"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Franja de herramientas con las que se integran los agentes.
 * Va entre «El problema» (todo vive en silos) y «Servicios» (lo que construimos):
 * es la bisagra que muestra, en una línea, dónde se enchufa el trabajo.
 * Solo anima `transform`, así que no cuesta repintado.
 */
export function IaIntegrationsMarquee({
  items,
  className,
}: {
  items: readonly string[]
  className?: string
}) {
  const reduce = useReducedMotion()
  // Lista duplicada: -50% completa un ciclo exacto y el bucle no salta.
  const loop = [...items, ...items]

  return (
    // El `overflow-hidden` vive en el riel, no acá: la etiqueta monta sobre el
    // borde superior y antes se cortaba a la mitad contra el recorte del riel.
    <div className={cn("relative", className)}>
      <div className="relative overflow-hidden border-y border-white/[0.09] bg-[#04070d]/80 py-6 md:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,#030306_0%,transparent_14%,transparent_86%,#030306_100%)]"
        />

        <motion.div
          className="flex w-max items-center gap-8 md:gap-12"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 34, ease: "linear", repeat: Infinity }}
          aria-hidden={!reduce}
        >
          {loop.map((item, i) => (
            <div key={`${item}-${i}`} className="flex shrink-0 items-center gap-8 md:gap-12">
              <span className="whitespace-nowrap font-display text-xl text-white/55 md:text-3xl">
                {item}
              </span>
              <span className="h-1 w-1 shrink-0 rotate-45 bg-[#67e8f9]/70" />
            </div>
          ))}
        </motion.div>
      </div>

      <p className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto -translate-y-1/2 w-fit rounded-full border border-white/12 bg-[#04070d] px-4 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#67e8f9]">
        Se conecta con lo que ya usás
      </p>
    </div>
  )
}
