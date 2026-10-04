"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
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

      {!reduce && <TimelineRail items={items} />}

      {/* La lista vertical queda montada (useScroll necesita su ref) pero sólo
          se ve con movimiento reducido. */}
      <div ref={railRef} className={reduce ? "relative mt-14 md:mt-20" : "hidden"}>
      {reduce && (
      <>
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
      </>
      )}
      </div>
    </NosotrosSectionShell>
  );
}

/**
 * Recorrido horizontal: la sección queda fijada y los hitos pasan de costado
 * mientras se scrollea hacia abajo. El año del hito que está al frente se
 * rellena de cobre; el riel inferior marca cuánto falta para llegar a hoy.
 */
function TimelineRail({ items }: { items: NosotrosTimelineItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const panelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const n = items.length;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    let raf = 0;
    let running = false;
    let p = 0;

    const target = () => {
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? clamp(-r.top / total) : 0;
    };
    p = target();

    const frame = () => {
      raf = running ? requestAnimationFrame(frame) : 0;
      p += (target() - p) * 0.14;
      // Cuánto hay que correr la pista para que el último panel quede centrado.
      const first = panelRefs.current[0];
      const last = panelRefs.current[n - 1];
      if (!first || !last) return;
      const vw = window.innerWidth;
      const start = first.offsetLeft + first.offsetWidth / 2 - vw / 2;
      const end = last.offsetLeft + last.offsetWidth / 2 - vw / 2;
      const x = start + (end - start) * p;
      track.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

      for (let i = 0; i < n; i++) {
        const el = panelRefs.current[i];
        if (!el) continue;
        // Distancia del panel al centro de la pantalla, en anchos de panel.
        const c = el.offsetLeft + el.offsetWidth / 2 - x - vw / 2;
        const d = clamp(Math.abs(c) / el.offsetWidth, 0, 2);
        const focus = 1 - clamp(d);
        el.style.opacity = (0.3 + focus * 0.7).toFixed(3);
        el.style.transform = `scale(${(0.9 + focus * 0.1).toFixed(4)}) rotateY(${(clamp(c / el.offsetWidth, -1, 1) * -10).toFixed(2)}deg)`;
        const year = yearRefs.current[i];
        if (year) {
          // El año se llena de cobre al pasar por el frente.
          year.style.color = `rgba(224, 145, 89, ${(focus * 0.95).toFixed(3)})`;
          year.style.textShadow = focus > 0.6 ? `0 0 60px rgba(224,145,89,${((focus - 0.6) * 0.9).toFixed(3)})` : "";
        }
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!e.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(root);
    running = true;
    frame();
    running = false;
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [n]);

  return (
    <div ref={rootRef} className="relative mt-10" style={{ height: `${n * 75 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
        {/* La pista rompe el ancho del contenedor: va de borde a borde de la pantalla. */}
        <div className="relative left-1/2 w-screen -translate-x-1/2 [perspective:1400px]">
          <ol ref={trackRef} className="flex w-max items-stretch gap-6 px-[10vw] will-change-transform md:gap-10">
            {items.map((item, i) => (
              <li
                key={`${item.date}-${item.title}`}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="relative flex w-[78vw] max-w-[760px] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-[#0b0503]/70 p-7 backdrop-blur-sm will-change-transform md:w-[58vw] md:p-12"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_100%_0%,rgba(224,145,89,0.16),transparent_60%)]"
                />
                <span
                  ref={(el) => {
                    yearRefs.current[i] = el;
                  }}
                  aria-hidden
                  className="relative block select-none font-display text-[5.5rem] leading-[0.8] tabular-nums text-transparent [-webkit-text-stroke:1px_rgba(224,145,89,0.6)] md:text-[10rem]"
                >
                  {yearOf(item.date)}
                </span>
                <span className="relative mt-4 block font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                  {String(i + 1).padStart(2, "0")} · {item.date}
                </span>
                <h3 className="relative mt-4 font-display text-2xl leading-tight text-white md:text-[2.4rem]">
                  {item.title}
                </h3>
                <p className="relative mt-3 max-w-xl text-[15px] leading-relaxed text-white/65 md:text-[17px]">
                  {item.detail}
                </p>
                {item.current ? (
                  <span className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#e09159]/50 bg-[#e09159]/12 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e09159]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e09159]" />
                    Hoy
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {/* Riel: de 2003 a hoy. */}
        <div className="mx-auto mt-10 flex w-full max-w-[1100px] items-center gap-4 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 sm:px-6 lg:px-12">
          <span>{yearOf(items[0]?.date ?? "")}</span>
          <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              ref={fillRef}
              style={{ transform: "scaleX(0)" }}
              className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-[#b85221] to-[#f0a46c] shadow-[0_0_12px_rgba(224,145,89,0.8)]"
            />
          </span>
          <span className="text-[#e09159]">Hoy</span>
        </div>
      </div>
    </div>
  );
}
