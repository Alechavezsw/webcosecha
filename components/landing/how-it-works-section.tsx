"use client";

import { useEffect, useRef, useState } from "react";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";
import { tiltMove, tiltReset, tiltGlareStyle } from "@/lib/card-tilt";

const steps = [
  {
    number: "01",
    title: "Diagnóstico",
    subtitle: "análisis inicial",
    description: "Analizamos tu marca, tu mercado actual y tus objetivos comerciales para entender con precisión dónde estás y a dónde querés llegar.",
  },
  {
    number: "02",
    title: "Estrategia",
    subtitle: "hoja de ruta",
    description: "Definimos un plan de acción a medida especificando canales, mensajes, estética y recursos tecnológicos necesarios.",
  },
  {
    number: "03",
    title: "Producción",
    subtitle: "manos a la obra",
    description: "Nuestro equipo diseña, redacta, filma y programa todo el material establecido en la planificación estratégica.",
  },
  {
    number: "04",
    title: "Publicación",
    subtitle: "y desarrollo",
    description: "Lanzamos las campañas en redes, publicamos el contenido o ponemos en línea tu nueva plataforma web.",
  },
  {
    number: "05",
    title: "Medición",
    subtitle: "análisis de datos",
    description: "Monitoreamos las métricas y los resultados en tiempo real para entender el comportamiento de tu audiencia.",
  },
  {
    number: "06",
    title: "Optimización",
    subtitle: "mejora continua",
    description: "Ajustamos los engranajes. Mejoramos continuamente las campañas y procesos para maximizar el retorno de tu inversión.",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="method"
      ref={sectionRef}
      className="cc-aura cc-aura-cyan relative overflow-hidden bg-black/55 py-16 text-white lg:py-24"
    >
      {/* Fondo aurora: negro con luz cian/rosa de marca */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/45 to-transparent" />
        <div className="absolute inset-x-[10%] top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(103,232,249,0.12)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_15%,rgba(103,232,249,0.11)_0%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_10%_80%,rgba(236,168,214,0.11)_0%,transparent_55%)]" />
      </div>

      <div
        className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY * -0.3}px, 0)` }}
      >
        <div className="relative mb-10 grid items-end gap-4 lg:mb-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <span className="cc-eyebrow mb-4 text-white/40">
              <span className="cc-eyebrow-line w-8 bg-white/20" />
              Método de trabajo
            </span>
            <h2
              className={`cc-section-title max-w-md leading-[0.95] text-white transition-[opacity,transform,filter] duration-[1100ms] delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:blur-none md:text-5xl lg:text-6xl ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-10 opacity-0 blur-[6px]"
              }`}
            >
              <span className="block">Cómo transformamos</span>
              <span className="block bg-gradient-to-r from-[#67e8f9] via-[#a5b4fc] to-[#eca8d6] bg-clip-text text-transparent">ideas en resultados.</span>
            </h2>
          </div>

          <p
            className={`max-w-sm text-sm leading-relaxed text-white/55 lg:ml-auto lg:text-right lg:text-[15px] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } transition-all duration-1000 delay-200`}
          >
            Un proceso claro en seis etapas, desde el diagnóstico hasta la optimización continua de tu inversión.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(index)}
              onPointerMove={tiltMove}
              onPointerLeave={tiltReset}
              className={`group relative overflow-hidden rounded-xl border text-left backdrop-blur-md transition-[opacity,transform,border-color,background-color,box-shadow] duration-500 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } ${
                activeStep === index
                  ? "border-[#eca8d6]/35 bg-black/75 shadow-[0_12px_40px_-16px_rgba(236,168,214,0.28)]"
                  : "border-white/[0.08] bg-black/60 hover:border-white/20 hover:bg-black/70"
              } p-5 sm:p-6`}
              style={{
                transitionDelay: isVisible ? `${220 + index * 60}ms` : "0ms",
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={tiltGlareStyle("103, 232, 249", 0.08)}
                aria-hidden
              />

              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`font-display text-2xl transition-colors duration-300 ${
                    activeStep === index ? "text-[#eca8d6]" : "text-white/25"
                  }`}
                >
                  {step.number}
                </span>
                <div className="h-px flex-1 overflow-hidden bg-white/10">
                  {activeStep === index && <div className="animate-progress h-full bg-[#eca8d6]/80" />}
                </div>
              </div>

              <h3 className="mb-1 font-display text-lg text-white sm:text-xl">{step.title}</h3>
              <span className="cc-eyebrow-accent mb-2 block text-[10px] text-white/45">{step.subtitle}</span>

              <p
                className={`text-sm leading-relaxed transition-opacity duration-300 ${
                  activeStep === index ? "text-white/75 opacity-100" : "text-white/50 opacity-80"
                }`}
              >
                {step.description}
              </p>

              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-[#eca8d6] transition-transform duration-500 ${
                  activeStep === index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </section>
  );
}
