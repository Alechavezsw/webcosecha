"use client";

import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";
import { Hero3DLayer } from "@/components/landing/hero-3d";
import { Magnetic } from "@/components/layout/magnetic";

const words = ["crezca.", "venda.", "destaque."];

function BlurWord({ word, trigger }: { word: string; trigger: number }) {
  const letters = word.split("");
  const STAGGER = 45;      // ms between each letter
  const DURATION = 500;    // blur+opacity fade duration per letter
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 200;

  const [letterStates, setLetterStates] = useState<{ opacity: number; blur: number }[]>(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );
  const [showGradient, setShowGradient] = useState(true);
  const framesRef = useRef<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // reset
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];

    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));
    setShowGradient(true);

    // stagger each letter
    letters.forEach((_, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setLetterStates(prev => {
            const next = [...prev];
            next[i] = { opacity: eased, blur: 20 * (1 - eased) };
            return next;
          });
          if (progress < 1) {
            const id = requestAnimationFrame(tick);
            framesRef.current.push(id);
          }
        };
        const id = requestAnimationFrame(tick);
        framesRef.current.push(id);
      }, i * STAGGER);
      timersRef.current.push(t);
    });

    // remove gradient once all letters are settled
    const gt = setTimeout(() => setShowGradient(false), GRADIENT_HOLD);
    timersRef.current.push(gt);

    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // gradient colours cycling across letter positions
  const gradientColors = ["#eca8d6", "#a78bfa", "#67e8f9", "#fbbf24", "#eca8d6"];

  return (
    <>
      {letters.map((char, i) => {
        const colorIndex = (i / Math.max(letters.length - 1, 1)) * (gradientColors.length - 1);
        const lower = Math.floor(colorIndex);
        const upper = Math.min(lower + 1, gradientColors.length - 1);
        const t = colorIndex - lower;

        // lerp hex colours
        const hex2rgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return [r, g, b];
        };
        const [r1, g1, b1] = hex2rgb(gradientColors[lower]);
        const [r2, g2, b2] = hex2rgb(gradientColors[upper]);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: letterStates[i]?.opacity ?? 0,
              filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
              color: showGradient ? `rgb(${r},${g},${b})` : "white",
              transition: "color 0.4s ease",
            }}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxY = useImmersiveParallax(sectionRef, 180);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black">
      {/* Background video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -inset-x-[8%] -top-[12%] h-[124%]"
          style={{ transform: `translate3d(0, ${parallaxY}px, 0) scale(1.12)` }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-75"
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Overlays — legibilidad sin tapar demasiado el video */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_50%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      {/* Capa 3D inmersiva: esporas interactivas, río de polen y monarcas */}
      <Hero3DLayer />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-4 pb-16 pt-28 will-change-transform sm:px-6 sm:py-24 lg:px-12 lg:py-28 ${
          isVisible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700`}
        style={{ transform: `translate3d(0, ${parallaxY * -0.22}px, 0)` }}
      >
        <div className="w-full max-w-full lg:max-w-[58%]">
        {/* Brand — señal hero principal (SEO + marca) */}
        <div
          className={`mb-4 transition-all duration-700 sm:mb-5 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-white/50 sm:text-xs">
            Agencia de marketing digital · San Juan
          </p>
          <h1
            className={`font-display text-[clamp(2.6rem,11vw,5.75rem)] leading-[0.95] tracking-tight text-white transition-all duration-1000 sm:text-[clamp(3.25rem,8vw,6.25rem)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Cosecha Creativa
          </h1>
        </div>

        {/* Headline de apoyo */}
        <div className="mb-5 sm:mb-6">
          <p
            className={`text-left font-display text-[clamp(1.35rem,4.8vw,2.65rem)] leading-[1.12] tracking-tight text-white/90 transition-all duration-1000 delay-150 sm:leading-[1.08] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block sm:inline">Hacemos que tu marca </span>
            <span className="relative inline-block">
              <BlurWord word={words[wordIndex]} trigger={wordIndex} />
            </span>
          </p>
        </div>

        {/* Una sola frase de apoyo */}
        <div
          className={`mb-8 max-w-xl transition-all duration-1000 delay-300 sm:mb-10 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm leading-relaxed text-white/60 sm:text-base md:text-lg">
            Estrategia, creatividad y tecnología para potenciar tu presencia digital:
            redes, diseño web, SEO, branding e inteligencia artificial.
          </p>
        </div>

        {/* Buttons */}
        <div 
          className={`flex w-full flex-col items-stretch gap-3 transition-all duration-1000 delay-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Magnetic>
          <Button
            size="lg"
            asChild
            className="group relative h-11 overflow-hidden rounded-full border-0 bg-white px-6 text-sm font-medium tracking-wide text-black shadow-[0_4px_28px_-6px_rgba(255,255,255,0.55)] ring-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_12px_40px_-8px_rgba(37,211,102,0.55),0_0_0_1px_rgba(37,211,102,0.25)] active:scale-[0.98] md:h-12 md:px-7 md:text-[15px]"
          >
            <a
              href={getWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-[#f0fff4] to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-[transform,opacity] duration-700 group-hover:translate-x-full group-hover:opacity-100"
                aria-hidden
              />
              <WhatsAppMark className="relative z-10 size-[18px] shrink-0 text-[#25D366] drop-shadow-[0_0_8px_rgba(37,211,102,0.45)] transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10">Hablar por WhatsApp</span>
            </a>
          </Button>
          </Magnetic>
          <Magnetic>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="liquid-glass group relative h-11 overflow-hidden rounded-full border border-white/25 bg-white/[0.04] px-6 text-sm font-medium tracking-wide text-white shadow-[0_4px_28px_-10px_rgba(236,168,214,0.35)] backdrop-blur-md ring-0 transition-all duration-300 hover:scale-[1.04] hover:border-[#eca8d6]/45 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_12px_44px_-10px_rgba(236,168,214,0.55),0_0_0_1px_rgba(236,168,214,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-[0.98] md:h-12 md:px-7 md:text-[15px]"
          >
            <a href="#soluciones" className="gap-2">
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#eca8d6]/10 via-transparent to-[#a100f2]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <span className="relative z-10">Ver soluciones</span>
              <ArrowRight className="relative z-10 size-4 shrink-0 opacity-90 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-[#eca8d6]" />
            </a>
          </Button>
          </Magnetic>
        </div>
        </div>
      </div>
      
      {/* Stats — ancladas al bloque inferior del hero */}
      <div
        className={`relative z-10 shrink-0 px-4 pb-6 pt-2 transition-all duration-700 delay-500 will-change-transform sm:px-6 sm:pb-8 lg:px-12 lg:pb-10 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: `translate3d(0, ${parallaxY * -0.45}px, 0)` }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:gap-8 lg:gap-12">
          {[
            {
              value: "Estrategia",
              label: "Marketing 360°",
              href: "/servicios/gestion-de-redes-sociales",
              accent: "from-[#eca8d6] via-[#d48ee0] to-[#a100f2]",
            },
            {
              value: "Desarrollo",
              label: "Web y Tiendas",
              href: "/servicios/diseno-web",
              accent: "from-cyan-400 via-[#67e8f9] to-[#a100f2]",
            },
            {
              value: "Automatización",
              label: "Sistemas IA y n8n",
              href: "/servicios/ia",
              accent: "from-[#a100f2] via-[#eca8d6] to-emerald-400",
            },
          ].map((stat, i) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`cc-hero-stat group relative flex min-w-0 flex-1 flex-col gap-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:min-w-[10rem] sm:px-5 sm:py-3.5 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              } hover:-translate-y-1 hover:border-[#eca8d6]/35 hover:bg-white/[0.07] hover:shadow-[0_0_0_1px_rgba(236,168,214,0.25),0_20px_50px_-18px_rgba(236,168,214,0.55),0_8px_32px_-12px_rgba(161,0,242,0.35)] sm:hover:-translate-y-2 md:hover:-translate-y-2.5`}
              style={{ transitionDelay: `${520 + i * 110}ms` }}
            >
              {/* Glow de fondo */}
              <span
                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#eca8d6]/25 via-[#a100f2]/15 to-cyan-500/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              {/* Barrido de luz */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent opacity-0 transition-[transform,opacity] duration-700 group-hover:translate-x-full group-hover:opacity-100"
                aria-hidden
              />
              {/* Borde superior animado */}
              <span
                className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r ${stat.accent} opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100`}
                aria-hidden
              />
              {/* Acento lateral */}
              <span
                className="pointer-events-none absolute bottom-3 left-0 top-3 w-[3px] scale-y-0 rounded-full bg-gradient-to-b from-[#eca8d6] to-[#a100f2] transition-transform duration-500 group-hover:scale-y-100"
                aria-hidden
              />

              <span className="relative flex items-center gap-2">
                <Sparkles
                  className="size-3.5 shrink-0 scale-75 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-hover:text-[#eca8d6] group-hover:drop-shadow-[0_0_10px_rgba(236,168,214,0.85)]"
                  aria-hidden
                />
                <span className="font-display text-base text-white transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-[#f5d4ea] group-hover:to-[#eca8d6] group-hover:bg-clip-text group-hover:text-transparent sm:text-lg md:text-xl">
                  {stat.value}
                </span>
                <ArrowRight
                  className="size-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-90 group-hover:text-[#eca8d6]"
                  aria-hidden
                />
              </span>
              <span className="relative max-w-[11rem] pl-5 text-[10px] leading-snug tracking-wide text-white/45 transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-white/85 sm:text-[11px] md:max-w-none">
                {stat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Transición inmersiva hacia #about */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 sm:h-40 lg:h-48"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[20%] via-black/35 via-[70%] to-black" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/35 to-transparent" />
        <div className="absolute left-1/2 bottom-0 h-20 w-[min(88vw,760px)] -translate-x-1/2 translate-y-1/2 bg-[radial-gradient(ellipse_85%_100%_at_50%_0%,rgba(236,168,214,0.14)_0%,rgba(161,0,242,0.06)_40%,transparent_68%)] blur-2xl" />
      </div>

    </section>
  );
}
