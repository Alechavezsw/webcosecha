"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nosotros3dCover } from "./nosotros-3d-cover";

const easePremium = [0.22, 1, 0.36, 1] as const;

/** Imagen en `public/` */
const HERO_IMAGE_SRC = "/nosotros-cover.png";

const HERO_CHIPS = [
  "Desde 2003",
  "Equipo in-house",
  "IA aplicada",
  "Proyectos medibles",
] as const;

export function NosotrosHero({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  // El relato del hero va en dos tiempos sobre la oficina fijada: primero el
  // título grande, después el detalle y las acciones. Todo atado al scroll.
  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;
    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      const title = titleRef.current;
      if (title) {
        const out = clamp((p - 0.3) / 0.2);
        title.style.opacity = (1 - out).toFixed(3);
        title.style.transform = `translate3d(0, ${(-out * 60).toFixed(1)}px, 0) scale(${(1 - out * 0.06).toFixed(4)})`;
        title.style.filter = out > 0.01 ? `blur(${(out * 8).toFixed(1)}px)` : "";
      }
      const body = bodyRef.current;
      if (body) {
        const inn = clamp((p - 0.42) / 0.2);
        body.style.opacity = inn.toFixed(3);
        body.style.transform = `translate3d(0, ${((1 - inn) * 50).toFixed(1)}px, 0)`;
        body.style.pointerEvents = inn > 0.5 ? "auto" : "none";
      }
      if (hintRef.current) hintRef.current.style.opacity = clamp(1 - p / 0.08).toFixed(3);
      // Cerca del final la escena se oscurece para que el detalle se lea limpio.
      if (veilRef.current) veilRef.current.style.opacity = (0.1 + clamp((p - 0.38) / 0.25) * 0.22).toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <section
      ref={trackRef}
      className={cn("relative", reduce ? "min-h-[100svh]" : "h-[260vh]", className)}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* La oficina ocupa toda la pantalla: la cámara la recorre mientras se scrollea. */}
        <div className="absolute inset-0">
          <Nosotros3dCover trackRef={trackRef} />
          <Image
            src={HERO_IMAGE_SRC}
            alt="Equipo y trabajo creativo en Cosecha Creativa, San Juan"
            fill
            priority
            sizes="100vw"
            className="pointer-events-none -z-10 object-cover object-[center_28%]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-10%,rgba(236,168,214,0.16),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#050506] via-[#050506]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-black/55 to-transparent" />
        <div ref={veilRef} className="pointer-events-none absolute inset-0 bg-[#050506]" style={{ opacity: 0.15 }} />

        {/* Tiempo 1: el título sobre la sala. */}
        <div
          ref={titleRef}
          className="absolute inset-x-0 bottom-[14svh] z-10 will-change-transform"
        >
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-[#eca8d6]/90">
                  Nosotros
                </p>
                <span className="h-px w-8 bg-[#eca8d6]/35" aria-hidden />
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                  San Juan, Argentina · desde 2003
                </p>
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-[2.7rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.6rem]">
                Innovación y tecnología
                <span className="block italic text-[#eca8d6]">para tu negocio</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm text-white/60 md:text-base">
                Agencia de marketing digital, desarrollo e IA aplicada.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Tiempo 2: quiénes somos y qué hacer ahora. */}
        <div
          ref={bodyRef}
          className="absolute inset-0 z-10 flex items-center will-change-transform"
          style={reduce ? undefined : { opacity: 0, pointerEvents: "none" }}
        >
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl">
              <p className="font-display text-2xl leading-snug text-white/90 sm:text-3xl md:text-[2.4rem] md:leading-[1.15]">
                Empezamos a hacer sitios web en 2003, mucho antes de que en San Juan se hablara de
                marketing digital.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-white/65 md:text-xl">
                Hoy somos un equipo de seis que diseña, desarrolla, comunica y automatiza — todo en
                la misma casa, y todo medido.
              </p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {HERO_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button
                  asChild
                  className="h-auto min-h-11 rounded-full border-0 bg-[#eca8d6] px-7 py-3.5 text-base font-semibold text-gray-900 shadow-[0_20px_60px_-28px_rgba(236,168,214,0.55)] hover:bg-[#f0bcdf]"
                >
                  <Link href="/#contacto">
                    Hablar con el equipo
                    <ArrowUpRight className="h-5 w-5" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto min-h-11 rounded-full border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                >
                  <Link href="/servicios">Ver servicios</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Invitación a scrollear: se apaga apenas empieza el recorrido. */}
        {!reduce && (
          <div
            ref={hintRef}
            className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45"
          >
            Recorré la casa
            <span className="h-8 w-px animate-pulse bg-gradient-to-b from-[#eca8d6] to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
