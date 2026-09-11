"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cinta en movimiento entre el hero y el resto de la página.
 * Da vida inmediata al scroll y separa el bloque de apertura del cuerpo.
 */
export function NosotrosMarquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Se duplica la lista para que el bucle sea continuo (-50% = un ciclo exacto).
  const loop = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-white/10 bg-[#08060d]/80 py-5 md:py-7",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050506_0%,transparent_12%,transparent_88%,#050506_100%)] z-10"
        aria-hidden
      />
      <motion.div
        className="flex w-max items-center gap-10 md:gap-16"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
        aria-hidden={!reduce}
      >
        {loop.map((item, i) => (
          <div key={`${item}-${i}`} className="flex shrink-0 items-center gap-10 md:gap-16">
            <span className="font-display text-2xl tracking-tight text-white/45 md:text-4xl">
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#eca8d6]/60" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
