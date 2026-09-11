"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";

// ============================================================================
// MÉTODO DE TRABAJO — deliberadamente NO son tarjetas.
// Las dos secciones de arriba (pilares y soluciones) ya son grillas de fichas;
// acá el proceso se lee como un ÍNDICE editorial: filas separadas por hairlines,
// numerales gigantes en contorno que se rellenan al activarse y una línea de
// acento que se dibuja de izquierda a derecha marcando la etapa en curso.
// Va sobre la banda de papel claro, así que la paleta es tinta + violeta.
// ============================================================================

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
  // El pase automático se PAUSA mientras el cursor recorre la lista y se CORTA
  // del todo si el visitante hace click: ahí manda su intención, no la nuestra.
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
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
    if (pinned || hovering) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [pinned, hovering]);

  return (
    <section
      id="method"
      ref={sectionRef}
      className="relative overflow-hidden py-20 text-[#15151d] lg:py-28"
    >
      <div
        className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY * -0.3}px, 0)` }}
      >
        <div className="relative mb-10 grid items-end gap-4 lg:mb-14 lg:grid-cols-2 lg:gap-8">
          <div>
            <span className="cc-eyebrow mb-4 text-[#15151d]/50">
              <span className="cc-eyebrow-line w-8 bg-[#15151d]/25" />
              Método de trabajo
            </span>
            <h2
              className={`cc-section-title max-w-md leading-[0.95] text-[#15151d] transition-[opacity,transform,filter] duration-[1100ms] delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:blur-none md:text-5xl lg:text-6xl ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-10 opacity-0 blur-[6px]"
              }`}
            >
              <span className="block">Cómo transformamos</span>
              <span className="block bg-gradient-to-r from-[#0e7490] via-[#7c3aed] to-[#c2418f] bg-clip-text text-transparent">ideas en resultados.</span>
            </h2>
          </div>

          <p
            className={`max-w-sm text-sm leading-relaxed text-[#15151d]/60 lg:ml-auto lg:text-right lg:text-[15px] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } transition-all duration-1000 delay-200`}
          >
            Un proceso claro en seis etapas, desde el diagnóstico hasta la optimización continua de tu inversión.
          </p>
        </div>

        <ol
          className="relative border-b border-[#15151d]/12"
          onMouseLeave={() => setHovering(false)}
        >
          {steps.map((step, index) => {
            const active = activeStep === index;
            return (
              <li
                key={step.number}
                className={`transition-[opacity,transform] duration-700 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: isVisible ? `${200 + index * 80}ms` : "0ms" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(index);
                    setPinned(true);
                  }}
                  onMouseEnter={() => {
                    setActiveStep(index);
                    setHovering(true);
                  }}
                  onFocus={() => setActiveStep(index)}
                  aria-current={active ? "step" : undefined}
                  className="group relative block w-full border-t border-[#15151d]/12 py-6 text-left lg:py-8"
                >
                  {/* Wash de papel: se aclara la fila activa, con sangrado hacia los costados */}
                  <span
                    className={`pointer-events-none absolute -inset-x-4 inset-y-0 -z-10 rounded-lg bg-white transition-opacity duration-500 sm:-inset-x-6 ${
                      active ? "opacity-70" : "opacity-0 group-hover:opacity-40"
                    }`}
                    aria-hidden
                  />
                  {/* Línea de proceso: se dibuja sobre el borde superior mientras la etapa está en curso */}
                  <span
                    className="pointer-events-none absolute inset-x-0 -top-px h-px overflow-hidden"
                    aria-hidden
                  >
                    <span
                      key={`${step.number}-${active}`}
                      className={`block h-full bg-[#a100f2] ${active ? "cc-step-draw" : "w-0"}`}
                    />
                  </span>

                  <div className="grid items-start gap-x-8 gap-y-2 lg:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.25fr)]">
                    {/* Numeral en contorno que se rellena al activarse */}
                    <span className="cc-step-num font-display leading-[0.8]" data-active={active} aria-hidden>
                      {step.number}
                    </span>

                    <div className="lg:pt-2">
                      <h3
                        className={`font-display text-2xl transition-transform duration-500 sm:text-3xl ${
                          active ? "translate-x-1" : "translate-x-0"
                        }`}
                      >
                        <span className="sr-only">Etapa {step.number}: </span>
                        {step.title}
                      </h3>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a1f6a]/75">
                        {step.subtitle}
                      </span>
                    </div>

                    <div className="flex items-start gap-4 lg:pt-2">
                      <p
                        className={`text-sm leading-relaxed transition-colors duration-500 lg:text-[15px] ${
                          active ? "text-[#15151d]/80" : "text-[#15151d]/55"
                        }`}
                      >
                        {step.description}
                      </p>
                      <ArrowRight
                        className={`mt-1 hidden h-4 w-4 shrink-0 text-[#a100f2] transition-all duration-500 lg:block ${
                          active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                        }`}
                        aria-hidden
                      />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <style jsx>{`
        /* El numeral alterna contorno → relleno cambiando SÓLO el color del trazo.
           Alternar el ancho por style inline dejaba la cifra invisible al desactivarse. */
        .cc-step-num {
          font-size: clamp(52px, 8vw, 76px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(21, 21, 29, 0.32);
          transition: color 500ms ease, -webkit-text-stroke-color 500ms ease;
        }
        .cc-step-num[data-active="true"] {
          color: #a100f2;
          -webkit-text-stroke-color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-step-num {
            transition: none;
          }
        }
        @keyframes cc-step-draw {
          from { width: 0%; }
          to { width: 100%; }
        }
        .cc-step-draw {
          animation: cc-step-draw 6s linear forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-step-draw {
            animation: none;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
