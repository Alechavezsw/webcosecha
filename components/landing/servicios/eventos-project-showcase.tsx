"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";

export interface EventosShowcaseItem {
  eyebrow?: string;
  title: string;
  description: string;
  badge: string;
  link: string;
  image: string;
}

const ITEMS: EventosShowcaseItem[] = [
  {
    title: "Integración con marca y comunicación",
    description:
      "Cada experiencia se diseña con identidad visual personalizada: logo, colores, tipografía, gráficas del evento, animaciones, sonidos y mensajes institucionales. El resultado es comunicación y entretenimiento hechos para ese evento.",
    badge: "Marca",
    link: "/#contacto",
    image: "/games/Gemini_Generated_Image_larv62larv62larv.png",
  },
  {
    eyebrow: "Impacto",
    title: "Beneficios del servicio",
    description:
      "Con nuestras experiencias interactivas tu evento puede lograr mayor participación, más entretenimiento entre bloques, mejor recordación de marca, captación de datos, dinámicas modernas y diferenciación frente a eventos tradicionales.",
    badge: "Valor",
    link: "/#contacto",
    image: "/games/Gemini_Generated_Image_5ykc8z5ykc8z5ykc.png",
  },
  {
    eyebrow: "En pocas palabras",
    title: "Juegos, trivias y apps para eventos",
    description:
      "En Cosecha Creativa desarrollamos experiencias digitales para eventos: trivias en vivo, juegos interactivos, sorteos animados, rankings, apps web, pantallas dinámicas y entretenimiento visual personalizado para que el público participe desde el celular.",
    badge: "Resumen",
    link: "/#contacto",
    image: "/games/Gemini_Generated_Image_jbwbmmjbwbmmjbwb.png",
  },
  {
    eyebrow: "Manifiesto",
    title: "Que la gente participe",
    description:
      "Hacemos que tu evento no solo se vea bien: hacemos que la gente participe. Creamos juegos, apps y pantallas interactivas para transformar eventos tradicionales en experiencias memorables, dinámicas y conectadas con la audiencia.",
    badge: "CC",
    link: "/#contacto",
    image: "/games/Gemini_Generated_Image_tt3gjatt3gjatt3g.png",
  },
];

export function EventosProjectShowcase() {
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition, reduceMotion]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || reduceMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsVisible(false);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-3xl px-6 py-12 lg:px-8 md:py-16"
    >
      <h2 className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/90">
        Marca, impacto y experiencia
      </h2>

      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-30 h-[180px] w-[280px] overflow-hidden rounded-xl shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          style={{
            transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0) scale(${isVisible ? 1 : 0.85})`,
            opacity: isVisible ? 1 : 0,
            transition:
              "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="relative size-full overflow-hidden rounded-xl bg-black/80">
            {ITEMS.map((item, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.title}
                src={item.image}
                alt=""
                className="absolute inset-0 size-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  transform: hoveredIndex === index ? "scale(1)" : "scale(1.08)",
                  filter: hoveredIndex === index ? "none" : "blur(8px)",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      ) : null}

      <div className="space-y-0">
        {ITEMS.map((item, index) => {
          const Row = (
            <div className="relative border-t border-white/10 py-5 transition-all duration-300 ease-out">
              <div
                className={`absolute inset-0 -mx-4 rounded-lg px-4 transition-all duration-300 ease-out ${
                  hoveredIndex === index ? "bg-white/[0.06] opacity-100" : "opacity-0"
                }`}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {item.eyebrow ? (
                    <p className="cc-eyebrow-accent mb-1 text-[10px] text-[#eca8d6]/80">
                      {item.eyebrow}
                    </p>
                  ) : null}
                  <div className="inline-flex items-center gap-2">
                    <h3 className="font-display text-lg font-medium tracking-tight text-white">
                      <span className="relative">
                        {item.title}
                        <span
                          className={`absolute -bottom-0.5 left-0 h-px bg-[#eca8d6] transition-all duration-300 ease-out ${
                            hoveredIndex === index ? "w-full" : "w-0"
                          }`}
                        />
                      </span>
                    </h3>
                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 text-[#eca8d6]/90 transition-all duration-300 ease-out ${
                        hoveredIndex === index
                          ? "translate-x-0 translate-y-0 opacity-100"
                          : "-translate-x-2 translate-y-2 opacity-0"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-2 text-sm leading-relaxed transition-all duration-300 ease-out md:text-[15px] ${
                      hoveredIndex === index ? "text-white/75" : "text-white/55"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <span
                  className={`font-mono text-xs tabular-nums text-white/45 transition-all duration-300 ease-out ${
                    hoveredIndex === index ? "text-[#eca8d6]/80" : ""
                  }`}
                >
                  {item.badge}
                </span>
              </div>
            </div>
          );

          const inner = (
            <Link
              href={item.link}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#eca8d6]/50"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {Row}
            </Link>
          );

          return <div key={item.title}>{inner}</div>;
        })}

        <div className="border-t border-white/10" />
      </div>
    </section>
  );
}
