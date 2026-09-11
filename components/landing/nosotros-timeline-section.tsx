"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { NosotrosSectionShell } from "@/components/landing/nosotros-section-shell";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosTimelineItem = {
  date: string;
  title: string;
  detail: string;
  /** Marca el hito actual: se resalta con relleno lleno. */
  current?: boolean;
};

/** El año suelto, para el numeral gigante de fondo. */
function yearOf(date: string) {
  const m = date.match(/\d{4}/);
  return m ? m[0] : date;
}

/**
 * Trayectoria: cada hito con su año en tamaño enorme y contorno.
 * El riel se llena a medida que se hace scroll.
 */
export function NosotrosTimelineSection({ items }: { items: NosotrosTimelineItem[] }) {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 78%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const fillHeight = useTransform(fill, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  return (
    <NosotrosSectionShell variant="copper" className="max-w-[1100px]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 26 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: easePremium }}
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e09159]">
          Trayectoria
        </p>
        <h2 className="mt-5 max-w-3xl font-display text-[2.6rem] font-semibold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-[5rem]">
          Más de dos
          <span className="italic text-[#e09159]"> décadas</span> en esto
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55 md:text-[17px]">
          De los primeros sitios web a la automatización con IA. La misma gente, herramientas cada
          vez mejores.
        </p>
      </motion.div>

      <div ref={railRef} className="relative mt-14 md:mt-20">
        {/* Riel base */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[7px] top-0 h-full w-px bg-white/[0.1] md:left-[calc(9rem-1px)]"
        />
        {/* Riel activo, según scroll */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { height: fillHeight }}
          className={cn(
            "pointer-events-none absolute left-[7px] top-0 w-px md:left-[calc(9rem-1px)]",
            "bg-gradient-to-b from-[#e09159] via-[#b85221] to-[#8b2c19]/40",
            reduce && "h-full",
          )}
        />

        <ol>
          {items.map((item, i) => (
            <motion.li
              key={`${item.date}-${item.title}`}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px", amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.04, ease: easePremium }}
              className="group relative border-b border-white/[0.08] py-9 pl-10 last:border-b-0 md:grid md:grid-cols-[9rem_1fr] md:gap-12 md:py-12 md:pl-0"
            >
              {/* Nodo sobre el riel */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-11 flex h-[15px] w-[15px] items-center justify-center rounded-full",
                  "border-2 bg-[#0b0503] transition-all duration-300 md:left-[calc(9rem-8px)] md:top-14",
                  item.current
                    ? "border-[#e09159] shadow-[0_0_24px_0_rgba(224,145,89,0.9)]"
                    : "border-[#b85221] group-hover:border-[#e09159] group-hover:shadow-[0_0_20px_-2px_rgba(224,145,89,0.8)]",
                )}
              >
                {item.current ? <span className="h-[5px] w-[5px] rounded-full bg-[#e09159]" /> : null}
              </span>

              {/* Año gigante en contorno */}
              <div className="md:pr-10 md:text-right">
                <span
                  aria-hidden
                  className={cn(
                    "block select-none font-display text-[3.5rem] leading-[0.85] tabular-nums md:text-[4.5rem]",
                    "text-transparent transition-all duration-500",
                    item.current
                      ? "[-webkit-text-stroke:1px_rgba(224,145,89,0.95)]"
                      : "[-webkit-text-stroke:1px_rgba(255,255,255,0.22)] group-hover:[-webkit-text-stroke:1px_rgba(224,145,89,0.85)]",
                  )}
                >
                  {yearOf(item.date)}
                </span>
                <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                  {item.date}
                </span>
              </div>

              <div className="mt-5 md:mt-0 md:pt-3">
                <h3 className="font-display text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-[#e09159] md:text-[2.1rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-[16px]">
                  {item.detail}
                </p>
                {item.current ? (
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e09159]/50 bg-[#e09159]/12 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e09159]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e09159]" />
                    Hoy
                  </span>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </NosotrosSectionShell>
  );
}
