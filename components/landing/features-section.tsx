"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";
import { tiltMove, tiltReset, tiltGlareStyle } from "@/lib/card-tilt";

const features = [
  {
    number: "01",
    title: "Estrategia personalizada",
    description: "No aplicamos fórmulas repetidas. Sabemos que cada proyecto tiene objetivos, tiempos y públicos distintos.",
  },
  {
    number: "02",
    title: "Diseño profesional",
    description: "Tu imagen es tu carta de presentación. Creamos identidades visuales que impactan, posicionan y generan confianza inmediata.",
  },
  {
    number: "03",
    title: "Contenido para vender",
    description: "No solo hacemos que tus redes se vean bien; creamos piezas y redactamos textos pensados para atraer y convertir.",
  },
  {
    number: "04",
    title: "Desarrollo web moderno",
    description: "Construimos sitios rápidos, escalables y optimizados para Google, pensados como verdaderas herramientas comerciales.",
  },
  {
    number: "05",
    title: "Inteligencia artificial",
    description: "Implementamos tecnología de vanguardia para ahorrarte tiempo, automatizar tareas y potenciar tu atención al cliente.",
  },
  {
    number: "06",
    title: "Cercanía con el cliente",
    description: "Hablamos tu mismo idioma. Te acompañamos en todo el proceso con total claridad y transparencia.",
  },
];

// Floating dot particles visualization (preserved for Quantum-Bloom aesthetic)
function ParticleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Generate stable particle positions
    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618;
      return {
        bx: ((seed * 127.1) % 1),
        by: ((seed * 311.7) % 1),
        phase: seed * Math.PI * 2,
        speed: 0.4 + (seed % 0.4),
        radius: 1.2 + (seed % 2.2),
      };
    });

    // Pausa fuera de viewport: evita layout + repintado por frame cuando no se ve
    let isInView = true;
    const io = new IntersectionObserver(
      ([entry]) => { isInView = entry?.isIntersecting ?? true; },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    let time = 0;
    const render = () => {
      if (!isInView) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.4 + p.phase) * 38;
        const flowY = Math.cos(time * p.speed * 0.3 + p.phase * 0.7) * 24;

        const bx = p.bx * w;
        const by = p.by * h;
        const dx = p.bx - mx;
        const dy = p.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist * 2.8);

        const x = bx + flowX + influence * Math.cos(time + p.phase) * 36;
        const y = by + flowY + influence * Math.sin(time + p.phase) * 36;

        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = 0.08 + pulse * 0.18 + influence * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, p.radius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      time += 0.016;
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto opacity-50"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxY = useImmersiveParallax(sectionRef, 220);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="cc-aura cc-aura-rose relative scroll-mt-6 -mt-28 overflow-hidden bg-black/55 pb-16 pt-28 sm:-mt-32 sm:pb-20 sm:pt-32 lg:-mt-36 lg:pb-24 lg:pt-36"
    >
      {/* Fondo: funde desde el negro del hero y deja ver el campo 3D ambiental */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-black via-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/50 to-transparent" />
        <div className="absolute inset-x-[10%] top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(236,168,214,0.14)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_12%_20%,rgba(236,168,214,0.12)_0%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_85%_75%,rgba(161,0,242,0.1)_0%,transparent_55%)]" />
      </div>



      <div
        className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY * -0.28}px, 0)` }}
      >
        {/* Header */}
        <div className="relative mb-12 lg:mb-14">
          <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <span className="cc-eyebrow mb-4">
                <span className="cc-eyebrow-line w-8" />
                Quiénes somos
              </span>
              <h2
                className={`cc-section-title max-w-xl leading-[0.95] text-white transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:blur-none md:text-5xl lg:text-6xl ${
                  isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[6px]"
                }`}
              >
                <span className="block">Más que una agencia,</span>
                <span className="block bg-gradient-to-r from-[#eca8d6] via-[#d998e0] to-[#a78bfa] bg-clip-text text-transparent">tu aliado estratégico.</span>
              </h2>
            </div>
            <div
              className={`lg:col-span-5 lg:pt-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <p
                className={`text-[15px] leading-relaxed text-white/80 sm:text-base ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                } transition-all duration-1000 delay-150`}
              >
                En{" "}
                <span className="font-display italic text-[#eca8d6]">Cosecha Creativa</span>{" "}
                combinamos creatividad, estrategia y tecnología para que tu marca{" "}
                <span className="font-medium text-white">sepa estar</span> en internet, no solo existir.
              </p>
              <p
                className={`mt-3 text-sm leading-relaxed text-white/50 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                } transition-all duration-1000 delay-250`}
              >
                Desde San Juan acompañamos marcas, comercios e instituciones con soluciones digitales a medida.
              </p>
              <Link
                href="/nosotros"
                className={`group/link mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-[#eca8d6]/90 transition-colors duration-300 hover:text-[#eca8d6] sm:text-sm ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                } delay-300`}
              >
                Conocé nuestro equipo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {/* Diferenciales */}
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
          <h3
            className={`font-display text-xl text-white sm:text-2xl md:text-3xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            } transition-all duration-1000 delay-200`}
          >
            El diferencial de trabajar con estrategia
          </h3>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/30 sm:inline">
            6 pilares
          </span>
        </div>

        {/* Feature grid */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.number}
              onPointerMove={tiltMove}
              onPointerLeave={tiltReset}
              className={`group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-black/60 p-5 backdrop-blur-md transition-all duration-500 hover:border-[#eca8d6]/25 hover:bg-black/70 hover:shadow-[0_12px_40px_-16px_rgba(236,168,214,0.18)] sm:p-6 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${280 + idx * 70}ms` }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                <ParticleVisualization />
              </div>
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={tiltGlareStyle()}
                aria-hidden
              />
              <div className="relative z-10">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-[#eca8d6]/70">{feature.number}</span>
                  <span className="h-px flex-1 max-w-12 bg-gradient-to-r from-[#eca8d6]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <h4 className="mb-2 font-display text-lg text-white transition-transform duration-500 group-hover:translate-x-1 sm:text-xl">
                  {feature.title}
                </h4>
                <p className="text-sm leading-relaxed text-white/55">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
