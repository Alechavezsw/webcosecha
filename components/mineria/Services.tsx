import React, { useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { asset } from '../lib/asset';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceWebModal from './ServiceWebModal';
import ServiceGraphicModal from './ServiceGraphicModal';
import ServicePositioningModal from './ServicePositioningModal';
import ServiceLinkedInModal from './ServiceLinkedInModal';
import ServiceAIModal from './ServiceAIModal';
import ServiceMetaAdsModal from './ServiceMetaAdsModal';

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
}

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  servicesRef: React.RefObject<HTMLDivElement | null>;
  /** Contenedor que se fija: el scroll vertical se “gasta” en mover el carril hasta Meta Ads */
  servicesCarouselRef: React.RefObject<HTMLDivElement | null>;
  /** Fila de tarjetas: GSAP anima translateX en desktop (lg+) */
  horizontalRef: React.RefObject<HTMLDivElement | null>;
  services: Service[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Services: React.FC<ServicesProps> = ({
  servicesRef,
  servicesCarouselRef,
  horizontalRef,
  services,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [webModalOpen, setWebModalOpen] = useState(false);
  const [graphicModalOpen, setGraphicModalOpen] = useState(false);
  const [positioningModalOpen, setPositioningModalOpen] = useState(false);
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [metaAdsModalOpen, setMetaAdsModalOpen] = useState(false);

  const ambientRootRef = useRef<HTMLDivElement>(null);
  const ambientImgRef = useRef<HTMLImageElement>(null);
  const ambientVignetteRef = useRef<HTMLDivElement>(null);
  const ambientSheenRef = useRef<HTMLDivElement>(null);
  const introHeaderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = servicesRef.current;
    const root = ambientRootRef.current;
    const img = ambientImgRef.current;
    const vignette = ambientVignetteRef.current;
    const sheen = ambientSheenRef.current;
    const header = introHeaderRef.current;
    if (!section || !root || !img) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    let st: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(root, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
        gsap.set(img, { scale: 1.05, filter: 'brightness(0.92) saturate(1.02)' });
        if (vignette) gsap.set(vignette, { opacity: 1 });
        if (sheen) gsap.set(sheen, { opacity: 1, xPercent: 0 });
        return;
      }

      gsap.set(root, {
        clipPath: 'inset(11% 9% 11% 9%)',
        opacity: 0.92,
        willChange: 'clip-path, opacity',
      });
      gsap.set(img, {
        scale: 1.18,
        filter: 'brightness(0.72) saturate(1.06) contrast(1.04)',
        willChange: 'transform, filter',
      });
      if (vignette) gsap.set(vignette, { opacity: 0.45 });
      if (sheen) gsap.set(sheen, { opacity: 0, xPercent: -18 });

      const lines = header?.querySelectorAll<HTMLElement>('.services-intro-line');
      if (lines?.length) {
        gsap.set(lines, { y: 48, opacity: 0, skewY: 3, transformOrigin: '50% 100%' });
      }

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          tl.to(
            root,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: 1.35,
              ease: 'expo.out',
            },
            0,
          )
            .to(
              img,
              {
                scale: 1.05,
                filter: 'brightness(0.94) saturate(1.03) contrast(1.02)',
                duration: 1.55,
                ease: 'power3.out',
              },
              0,
            )
            .to(
              img,
              {
                filter: 'brightness(1) saturate(1.02) contrast(1)',
                duration: 0.85,
                ease: 'sine.out',
              },
              '-=0.55',
            );

          if (vignette) {
            tl.to(vignette, { opacity: 1, duration: 0.95, ease: 'power2.out' }, 0.08);
          }
          if (sheen) {
            tl.to(
              sheen,
              { opacity: 1, xPercent: 0, duration: 1.05, ease: 'power3.inOut' },
              0.12,
            );
          }

          if (lines?.length) {
            tl.to(
              lines,
              {
                y: 0,
                opacity: 1,
                skewY: 0,
                duration: 1.05,
                stagger: 0.09,
                ease: 'power4.out',
              },
              0.18,
            );
          }
        },
      });
    }, section);

    return () => {
      st?.kill();
      ctx.revert();
    };
  }, [servicesRef]);

  return (
    <>
    <section
      id="services"
      ref={servicesRef}
      className="reveal-section relative overflow-x-clip bg-[#07080a] py-20 md:py-28 scroll-mt-24"
    >
      <div
        ref={ambientRootRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <img
          ref={ambientImgRef}
          src={asset('cc%20(3).png')}
          alt=""
          className="services-ambient-img absolute inset-0 h-full min-h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div
          ref={ambientVignetteRef}
          className="services-ambient-vignette absolute inset-0 bg-[#07080a]/[0.52]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080a] via-[#07080a]/25 to-[#07080a]/92" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffb800]/[0.12] via-transparent to-[#ffb800]/[0.05]" />
        <div
          ref={ambientSheenRef}
          className="absolute inset-0 opacity-0"
          style={{
            background:
              'linear-gradient(105deg, transparent 0%, rgba(255,184,0,0.14) 42%, transparent 62%, rgba(255,255,255,0.04) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: 'radial-gradient(rgb(255, 184, 0) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 sm:px-10">
        <div ref={introHeaderRef} className="mb-14 md:mb-20">
          <div className="services-intro-line mb-10 flex items-center gap-6">
            <div className="h-0.5 w-20 bg-[#ffb800]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.55em] text-[#ffb800]">
              Nuestras Capacidades
            </span>
          </div>
          <div className="mb-10 max-w-5xl">
            <h2 className="services-intro-line font-display text-[clamp(2.5rem,7vw,6rem)] uppercase italic leading-[0.9] tracking-tighter text-white">
              MARKETING <span className="text-[#ffb800]">DIGITAL</span>
            </h2>
            <h2 className="services-intro-line font-display text-[clamp(2rem,6vw,5rem)] uppercase italic leading-[0.9] tracking-tighter text-[#ffb800]">
              PARA PROVEEDORES <span className="text-white">MINEROS</span>
            </h2>
          </div>
          <p className="services-intro-line max-w-xl text-lg text-white/60 md:text-xl md:leading-relaxed">
            Nuestro enfoque se basa en la profundidad técnica y la intuición industrial. No solo
            comercializamos; diseñamos el crecimiento.
          </p>
        </div>

        {/* Desde aquí: en lg+ el scroll vertical avanza el carril hasta la última tarjeta (Meta Ads) */}
        <div ref={servicesCarouselRef} className="relative -mx-6 sm:-mx-10">
          <div
            className="services-scroll-clip relative min-h-[480px] overflow-x-auto overflow-y-visible px-6 sm:px-10 pb-6 pt-2 lg:min-h-[520px] lg:overflow-hidden"
            aria-label="Servicios"
          >
            <div
              ref={horizontalRef}
              className="services-horizontal-inner flex w-max gap-6 will-change-transform md:gap-10"
            >
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="service-item group flex w-[min(88vw,340px)] shrink-0 flex-col sm:w-[min(82vw,380px)] md:w-[min(78vw,440px)] lg:w-[min(70vw,480px)] xl:w-[520px]"
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  <div className="flex min-h-[480px] flex-col justify-between rounded-[32px] border border-white/[0.07] bg-[#0a0a0a]/95 p-8 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 service-card-inner group-hover:border-[#ffb800]/35 group-hover:shadow-[0_0_60px_-20px_rgba(255,184,0,0.25)] md:min-h-[520px] md:p-10">
                    <div>
                      <div className="relative mb-8 flex items-start justify-between">
                        <div className="absolute -left-1 -top-3 h-2 w-2 rounded-full bg-[#ffb800]/20" />
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-500 group-hover:border-[#ffb800] group-hover:bg-[#ffb800] md:p-8">
                          <div className="transition-colors group-hover:text-black">{service.icon}</div>
                        </div>
                        <span className="font-display text-5xl text-white/5 transition-colors group-hover:text-[#ffb800]/20 md:text-6xl">
                          {service.tag}
                        </span>
                      </div>
                      <h4 className="mb-4 font-display text-3xl uppercase italic leading-tight text-white transition-colors group-hover:text-[#ffb800] md:text-4xl">
                        {service.title}
                      </h4>
                      <p className="max-w-sm text-base leading-relaxed text-white/40 transition-colors group-hover:text-white/80 md:text-lg">
                        {service.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-8 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#ffb800] transition-all group-hover:gap-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (service.title === 'Sitio Web') setWebModalOpen(true);
                        if (service.title === 'Diseño Gráfico') setGraphicModalOpen(true);
                        if (service.title === 'Posicionamiento Google') setPositioningModalOpen(true);
                        if (service.title === 'Presencia en LinkedIn') setLinkedInModalOpen(true);
                        if (service.title === 'Inteligencia Artificial') setAiModalOpen(true);
                        if (service.title === 'Meta Ads') setMetaAdsModalOpen(true);
                      }}
                    >
                      Saber Más <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[#07080a] to-transparent sm:w-14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-[#07080a] to-transparent sm:w-14"
            aria-hidden
          />
        </div>
      </div>
    </section>

    <ServiceWebModal
      open={webModalOpen}
      onClose={() => setWebModalOpen(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
    <ServiceGraphicModal
      open={graphicModalOpen}
      onClose={() => setGraphicModalOpen(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
    <ServicePositioningModal
      open={positioningModalOpen}
      onClose={() => setPositioningModalOpen(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
    <ServiceLinkedInModal
      open={linkedInModalOpen}
      onClose={() => setLinkedInModalOpen(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
    <ServiceAIModal
      open={aiModalOpen}
      onClose={() => setAiModalOpen(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
    <ServiceMetaAdsModal
      open={metaAdsModalOpen}
      onClose={() => setMetaAdsModalOpen(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
    </>
  );
};

export default Services;
