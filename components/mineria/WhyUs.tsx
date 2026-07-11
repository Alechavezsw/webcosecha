import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GeminiContactChat from './GeminiContactChat';

gsap.registerPlugin(ScrollTrigger);

interface WhyUsProps {
  whyUsRef: React.RefObject<HTMLDivElement | null>;
}

const BENEFITS = [
  'Mejor imagen corporativa',
  'Mayor confianza al presentar la empresa',
  'Mejor presentación de servicios y antecedentes',
  'Más visibilidad online',
  'Mejor posicionamiento en Google',
  'Mayor claridad comercial',
  'Más oportunidades de contacto',
  'Presencia digital alineada al nivel del sector',
];

const WhyUs: React.FC<WhyUsProps> = ({ whyUsRef }) => {
  const bridgeRef = useRef<HTMLDivElement>(null);
  const goldSheenRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const section = whyUsRef.current;
    const bridge = bridgeRef.current;
    const sheen = goldSheenRef.current;
    const line = lineRef.current;
    const inner = innerRef.current;
    const bg = bgImgRef.current;
    if (!section || !bridge || !sheen || !line || !inner) return;

    const ctx = gsap.context(() => {
      gsap.set(line, { scaleX: 0.04, opacity: 0, transformOrigin: '50% 50%' });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 70%',
            scrub: 0.55,
          },
        })
        .fromTo(bridge, { opacity: 0.35 }, { opacity: 1, ease: 'none' }, 0)
        .fromTo(sheen, { xPercent: -12, opacity: 0.5 }, { xPercent: 4, opacity: 1, ease: 'none' }, 0)
        .fromTo(bg, { scale: 1.06, yPercent: 2 }, { scale: 1, yPercent: 0, ease: 'none' }, 0)
        .to(line, { scaleX: 1, opacity: 1, ease: 'none' }, 0);

      gsap.fromTo(
        inner,
        { y: 36, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 1.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [whyUsRef]);

  return (
    <section
      id="about"
      ref={whyUsRef}
      className="reveal-section relative isolate overflow-hidden bg-gradient-to-br from-[#ffb800] via-[#e8a800] to-[#c99200] py-16 text-black md:py-20"
    >
      <div
        ref={bridgeRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-20 md:h-24"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/25 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
      </div>

      <div
        ref={goldSheenRef}
        className="pointer-events-none absolute -left-[14%] top-[18%] z-[3] h-[95%] w-[55%] rotate-[-7deg] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.32),transparent_70%)] opacity-70 mix-blend-soft-light"
        aria-hidden
      />

      <div
        ref={lineRef}
        className="pointer-events-none absolute left-8 right-8 top-10 z-[8] h-px bg-gradient-to-r from-transparent via-black/25 to-transparent md:left-12 md:right-12"
        aria-hidden
      />

      <div className="absolute inset-0 z-0 opacity-[0.18] grayscale mix-blend-multiply pointer-events-none">
        <img
          ref={bgImgRef}
          src="https://images.unsplash.com/photo-1580048215322-3937375776f2?auto=format&fit=crop&q=80&w=2000"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div ref={innerRef} className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1fr)_min(100%,22rem)] md:gap-8 lg:gap-10">
          <div className="min-w-0 max-w-3xl rounded-2xl border border-black/10 bg-black/[0.04] px-4 py-5 sm:px-6 sm:py-6">
            <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.38em] text-black/50">
              Cosecha Creativa
            </p>
            <h3 className="split-heading font-display text-[clamp(1.35rem,3.2vw,2.35rem)] font-semibold leading-[1.12] tracking-tight text-balance text-black">
              ¿Qué hacemos por tu empresa?
            </h3>

            <div className="mt-8 space-y-8 border-t border-black/10 pt-8 md:space-y-10 md:pt-10">
            <div className="flex gap-4 sm:gap-5">
              <div className="w-10 shrink-0 font-display text-2xl tabular-nums text-black/30 sm:w-12 sm:text-3xl">
                01
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="mb-2 text-base font-black uppercase italic tracking-tight text-black sm:text-lg">
                  Profundidad técnica
                </h5>
                <p className="text-sm font-medium leading-relaxed text-black/75 sm:text-base">
                  Diseñamos estrategias y herramientas digitales para que tu empresa tenga una presencia más
                  fuerte, ordenada y profesional dentro del sector.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-5">
              <div className="w-10 shrink-0 font-display text-2xl tabular-nums text-black/30 sm:w-12 sm:text-3xl">
                02
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="mb-2 text-base font-black uppercase italic tracking-tight text-black sm:text-lg">
                  Red global
                </h5>
                <p className="mb-3 text-sm font-medium leading-relaxed text-black/75 sm:text-base">
                  ¿Qué obtiene un proveedor minero al mejorar su marketing digital?
                </p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {BENEFITS.map((item) => (
                    <li key={item} className="flex gap-2 text-xs font-medium leading-snug text-black/72 sm:text-sm">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/45" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
          </div>

          <div className="w-full md:max-w-[22rem] md:justify-self-end lg:sticky lg:top-24 lg:self-start">
            <GeminiContactChat variant="embedded" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
