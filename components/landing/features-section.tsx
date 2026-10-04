"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Code2, Compass, HeartHandshake, Palette, PenTool, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";
import { tiltMove, tiltReset } from "@/lib/card-tilt";

// Acentos de marca. Van en ciclo de 3 para que cada COLUMNA de la grilla tenga
// su color y la tanda lea como un sistema y no como seis fichas sueltas.
const ROSA = "236, 168, 214";
const VIOLETA = "167, 139, 250";
const CIAN = "103, 232, 249";

const features = [
  {
    number: "01",
    title: "Estrategia personalizada",
    description: "No aplicamos fórmulas repetidas. Sabemos que cada proyecto tiene objetivos, tiempos y públicos distintos.",
    icon: Compass,
    accent: ROSA,
  },
  {
    number: "02",
    title: "Diseño profesional",
    description: "Tu imagen es tu carta de presentación. Creamos identidades visuales que impactan, posicionan y generan confianza inmediata.",
    icon: Palette,
    accent: VIOLETA,
  },
  {
    number: "03",
    title: "Contenido para vender",
    description: "No solo hacemos que tus redes se vean bien; creamos piezas y redactamos textos pensados para atraer y convertir.",
    icon: PenTool,
    accent: CIAN,
  },
  {
    number: "04",
    title: "Desarrollo web moderno",
    description: "Construimos sitios rápidos, escalables y optimizados para Google, pensados como verdaderas herramientas comerciales.",
    icon: Code2,
    accent: ROSA,
  },
  {
    number: "05",
    title: "Inteligencia artificial",
    description: "Implementamos tecnología de vanguardia para ahorrarte tiempo, automatizar tareas y potenciar tu atención al cliente.",
    icon: Sparkles,
    accent: VIOLETA,
  },
  {
    number: "06",
    title: "Cercanía con el cliente",
    description: "Hablamos tu mismo idioma. Te acompañamos en todo el proceso con total claridad y transparencia.",
    icon: HeartHandshake,
    accent: CIAN,
  },
];

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxY = useImmersiveParallax(sectionRef, 220);
  // El mazo fijado reemplaza a la grilla salvo con movimiento reducido.
  const [deck, setDeck] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDeck(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
      className="cc-aura cc-aura-rose relative scroll-mt-6 overflow-x-clip bg-black/55 pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28"
    >
      {/* Fondo: arranca justo donde el hero terminó de fundir a negro. El corte lo
          marca la hairline del hero; acá sólo entra la luz de bienvenida. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-[10%] top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(236,168,214,0.16)_0%,transparent_70%)]" />
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
        {!deck && (
        <>
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
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.number}
                onPointerMove={tiltMove}
                onPointerLeave={tiltReset}
                className={`group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-black/55 p-5 backdrop-blur-md transition-[opacity,transform,border-color,box-shadow] duration-500 hover:border-white/20 hover:shadow-[0_18px_50px_-22px_rgba(var(--accent-rgb),0.55)] sm:p-6 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={
                  {
                    "--accent-rgb": feature.accent,
                    transitionDelay: `${280 + idx * 70}ms`,
                  } as CSSProperties
                }
              >
                {/* Baño de color en diagonal: da profundidad y separa una ficha de la otra */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(155deg, rgba(var(--accent-rgb),0.16) 0%, transparent 58%)" }}
                  aria-hidden
                />
                {/* Foco que sigue al cursor (las coords las publica tiltMove) */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at var(--tilt-gx, 50%) var(--tilt-gy, 50%), rgba(var(--accent-rgb),0.18), transparent 62%)",
                  }}
                  aria-hidden
                />
                {/* Numeral fantasma: el ancla visual de la ficha */}
                <span
                  className="pointer-events-none absolute -top-3 right-2 select-none font-display text-[76px] leading-none opacity-45 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:opacity-100"
                  style={{ color: "rgba(var(--accent-rgb),0.14)" }}
                  aria-hidden
                >
                  {feature.number}
                </span>

                <div className="relative z-10 flex flex-1 flex-col">
                  <span
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-105"
                    style={{
                      color: "rgb(var(--accent-rgb))",
                      backgroundColor: "rgba(var(--accent-rgb),0.1)",
                      borderColor: "rgba(var(--accent-rgb),0.24)",
                    }}
                    aria-hidden
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h4 className="mb-2 font-display text-lg text-white transition-transform duration-500 group-hover:translate-x-1 sm:text-xl">
                    {feature.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/55 transition-colors duration-500 group-hover:text-white/70">
                    {feature.description}
                  </p>
                </div>

                {/* Línea de acento al pie: mismo idioma que las fichas de servicios */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.8), transparent)" }}
                  aria-hidden
                />
              </article>
            );
          })}
        </div>
        </>
        )}
      </div>

      {deck && <FeatureDeck />}
    </section>
  );
}

/**
 * Mazo de diferenciales: la sección queda fijada y cada pilar sube desde abajo
 * y se apoya sobre el anterior, que retrocede (más chico, inclinado y en
 * sombra). Seis fichas chicas en grilla se leían de un vistazo y se olvidaban;
 * de a una, cada pilar tiene su momento.
 */
function FeatureDeck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const n = features.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    let running = false;
    let shown = -1;
    let t = 0;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

    const target = () => {
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      // Un respiro al final: la última ficha queda quieta antes de soltar el pin.
      return clamp(p / 0.88) * (n - 1);
    };
    t = target();

    const frame = () => {
      raf = running ? requestAnimationFrame(frame) : 0;
      t += (target() - t) * 0.16;
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const arrive = i === 0 ? 1 : ease(clamp(t - (i - 1)));
        const depth = clamp(t - i, 0, n); // cuántas fichas tiene encima
        const y = (1 - arrive) * 150 - depth * 4.2; // % del alto propio
        const scale = 1 - Math.min(depth, 3) * 0.065;
        const tilt = Math.min(depth, 3) * 5;
        el.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0) scale(${scale.toFixed(4)}) rotateX(${tilt.toFixed(2)}deg)`;
        // Las que esperan no asoman: entran con fundido; las del fondo del mazo se apagan.
        const enter = i === 0 ? 1 : clamp((t - (i - 1)) * 3);
        const leave = depth > 3.2 ? clamp(1 - (depth - 3.2)) : 1;
        el.style.opacity = (enter * leave).toFixed(3);
        const shade = shadeRefs.current[i];
        if (shade) shade.style.opacity = Math.min(0.75, depth * 0.32).toFixed(3);
      }
      const active = Math.min(n - 1, Math.max(0, Math.round(t)));
      if (active !== shown) {
        shown = active;
        if (numRef.current) numRef.current.textContent = features[active].number;
        dotRefs.current.forEach((d, i) => {
          if (!d) return;
          d.style.transform = `scaleX(${i === active ? 1 : 0.35})`;
          d.style.opacity = i <= active ? "1" : "0.3";
        });
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
    <div ref={rootRef} className="relative" style={{ height: `${n * 60 + 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          {/* Lado del relato: qué es esto y en qué pilar vamos. */}
          <div className="lg:col-span-5">
            <span className="cc-eyebrow mb-4">
              <span className="cc-eyebrow-line w-8" />6 pilares
            </span>
            <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl lg:text-5xl">
              El diferencial de trabajar con estrategia
            </h3>
            <div className="mt-6 hidden items-end gap-5 lg:mt-10 lg:flex">
              <span
                ref={numRef}
                className="font-display text-[7rem] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(236,168,214,0.55)]"
              >
                01
              </span>
              <span className="mb-2 font-mono text-xs text-white/40">/ 0{n}</span>
            </div>
            <div className="mt-6 flex gap-1.5" aria-hidden>
              {features.map((f, i) => (
                <span
                  key={f.number}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="h-[3px] w-8 origin-left rounded-full transition-[transform,opacity] duration-500"
                  style={{ background: `rgb(${f.accent})`, transform: "scaleX(0.35)", opacity: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* El mazo. */}
          <div className="relative h-[min(58svh,440px)] [perspective:1400px] lg:col-span-7">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.number}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex origin-top flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0d0a10] p-7 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] will-change-transform sm:p-10"
                  style={
                    {
                      "--accent-rgb": feature.accent,
                      zIndex: i + 1,
                      transform: i === 0 ? undefined : "translate3d(0,150%,0)",
                      opacity: i === 0 ? 1 : 0,
                    } as CSSProperties
                  }
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(var(--accent-rgb),0.22) 0%, transparent 60%), linear-gradient(160deg, rgba(var(--accent-rgb),0.08) 0%, transparent 55%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.7), transparent)" }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 right-4 select-none font-display text-[9rem] leading-none sm:text-[12rem]"
                    style={{ color: "rgba(var(--accent-rgb),0.1)" }}
                  >
                    {feature.number}
                  </span>
                  <span
                    className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border"
                    style={{
                      color: "rgb(var(--accent-rgb))",
                      backgroundColor: "rgba(var(--accent-rgb),0.1)",
                      borderColor: "rgba(var(--accent-rgb),0.28)",
                      boxShadow: "0 0 40px -10px rgba(var(--accent-rgb),0.6)",
                    }}
                    aria-hidden
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="relative max-w-md">
                    <h4 className="font-display text-3xl leading-tight text-white sm:text-4xl">{feature.title}</h4>
                    <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">{feature.description}</p>
                  </div>
                  {/* Sombra de las fichas que quedan debajo del mazo. */}
                  <div
                    ref={(el) => {
                      shadeRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-black"
                    style={{ opacity: 0 }}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
