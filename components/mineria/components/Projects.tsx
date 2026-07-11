import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { asset } from '../lib/asset';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  category: string;
  image: string;
}

interface ProjectsProps {
  projectsSectionRef: React.RefObject<HTMLDivElement | null>;
  projects: Project[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Projects: React.FC<ProjectsProps> = ({
  projectsSectionRef,
  projects,
  onMouseEnter,
  onMouseLeave,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState({ prev: false, next: true });

  const ambientRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  const updateArrowState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 8) {
      setArrows({ prev: false, next: false });
      return;
    }
    const x = el.scrollLeft;
    setArrows({
      prev: x > 8,
      next: x < max - 8,
    });
  }, []);

  const scrollStrip = useCallback(
    (dir: -1 | 1) => {
      const el = scrollRef.current;
      if (!el) return;
      const step = Math.min(el.clientWidth * 0.82, 520);
      el.scrollBy({ left: dir * step, behavior: 'smooth' });
      requestAnimationFrame(() => updateArrowState());
    },
    [updateArrowState],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateArrowState());
    ro.observe(el);
    const onScroll = () => updateArrowState();
    el.addEventListener('scroll', onScroll, { passive: true });
    updateArrowState();
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, [updateArrowState]);

  useLayoutEffect(() => {
    const section = projectsSectionRef.current;
    const ambient = ambientRef.current;
    const bgImg = bgImgRef.current;
    const stage = stageRef.current;
    const header = headerRef.current;
    const drift = driftRef.current;
    if (!section || !ambient || !bgImg || !stage) return;

    let headSt: ScrollTrigger | undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(stage, { clearProps: 'all' });
        gsap.set(bgImg, { clearProps: 'all' });
        if (drift) gsap.set(drift, { clearProps: 'all' });
        return;
      }

      gsap.set(ambient, { opacity: 0.5, scale: 1.05, willChange: 'transform, opacity' });
      gsap.set(stage, {
        clipPath: 'inset(22% 7% 22% 7%)',
        y: 64,
        opacity: 0.2,
        filter: 'blur(16px) brightness(0.55)',
        willChange: 'transform, clip-path, opacity, filter',
      });

      const label = header?.querySelector('.cases-intro-label');
      const words = header?.querySelectorAll<HTMLElement>('.cases-head-word');
      const wordInners = header?.querySelectorAll<HTMLElement>('.cases-head-word-scroll');
      if (label) gsap.set(label, { x: -36, opacity: 0, skewX: -6 });
      if (words?.length) {
        gsap.set(words, { y: 72, opacity: 0, rotateX: -22, transformOrigin: '50% 100%' });
      }

      if (drift) {
        gsap.set(drift, { xPercent: -18, opacity: 0.35 });
      }

      const enterTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 48%',
          scrub: 0.85,
        },
      });

      enterTl
        .to(
          ambient,
          {
            opacity: 1,
            scale: 1,
            duration: 1,
          },
          0,
        )
        .to(
          stage,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            filter: 'blur(0px) brightness(1)',
            duration: 1,
          },
          0,
        );

      if (label) {
        enterTl.to(
          label,
          {
            x: 0,
            opacity: 1,
            skewX: 0,
            duration: 0.85,
            ease: 'power3.out',
          },
          0.12,
        );
      }
      if (words?.length) {
        enterTl.to(
          words,
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power4.out',
          },
          0.18,
        );
      }
      if (drift) {
        enterTl.to(
          drift,
          {
            xPercent: 14,
            opacity: 0.08,
            duration: 1,
          },
          0,
        );
      }

      gsap.fromTo(
        bgImg,
        {
          yPercent: -20,
          scale: 1.16,
          rotate: -1.1,
          filter: 'brightness(0.75) saturate(1.08)',
        },
        {
          yPercent: 16,
          scale: 1.05,
          rotate: 0.85,
          filter: 'brightness(1) saturate(1.02)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.05,
          },
        },
      );

      const h2 = header?.querySelector('h2');
      if (h2 && wordInners && wordInners.length >= 2) {
        const w0 = wordInners[0];
        const w1 = wordInners[1];
        headSt = ScrollTrigger.create({
          trigger: h2,
          start: 'top 84%',
          once: true,
          onEnter: () => {
            gsap
              .timeline({ defaults: { ease: 'power4.out' } })
              .from(
                w0,
                {
                  x: -68,
                  y: 40,
                  rotateZ: -6.5,
                  scale: 0.88,
                  duration: 0.8,
                },
                0,
              )
              .from(
                w1,
                {
                  x: 60,
                  y: -36,
                  rotateZ: 6,
                  scale: 0.86,
                  duration: 0.82,
                },
                0.12,
              );
          },
        });
      }
    }, section);

    return () => {
      headSt?.kill();
      ctx.revert();
    };
  }, [projectsSectionRef]);

  return (
    <section
      id="cases"
      ref={projectsSectionRef}
      className="reveal-section relative scroll-mt-24 overflow-x-clip bg-[#07080a] py-20 md:py-28 [perspective:1200px]"
    >
      <div
        ref={ambientRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <img
          ref={bgImgRef}
          src={asset('cc%20(4).png')}
          alt=""
          className="absolute inset-0 h-full min-h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#07080a]/[0.5]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080a] via-[#07080a]/35 to-[#07080a]/95" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffb800]/[0.14] via-transparent to-[#ffb800]/[0.06]" />
        <div
          ref={driftRef}
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 30% 40%, rgba(255, 184, 0, 0.2), transparent 60%), radial-gradient(ellipse 50% 45% at 78% 65%, rgba(255, 255, 255, 0.06), transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(rgb(255, 184, 0) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div
        ref={stageRef}
        className="cases-stage relative z-10 mx-auto max-w-[1800px] px-6 sm:px-10 [transform-style:preserve-3d]"
      >
        <div ref={headerRef} className="mb-10 md:mb-14">
          <div className="cases-intro-label mb-10 flex items-center gap-6">
            <div className="h-0.5 w-20 bg-[#ffb800]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.55em] text-[#ffb800]">
              Trabajos
            </span>
          </div>
          <h2 className="relative mb-2 block font-display text-[clamp(2.5rem,9vw,7rem)] uppercase italic leading-[0.9] tracking-tighter text-white [overflow-wrap:anywhere]">
            <span className="cases-head-word inline-block">
              <span className="cases-head-word-scroll inline-block">IMPACTO</span>
            </span>{' '}
            <span className="cases-head-word inline-block text-white/25">
              <span className="cases-head-word-scroll inline-block">VISUAL</span>
            </span>
          </h2>
        </div>

        <div className="relative">
          {arrows.prev && (
            <button
              type="button"
              aria-label="Anterior casos"
              className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#07080a]/90 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-[#ffb800]/60 hover:text-[#ffb800] sm:left-1 md:h-14 md:w-14"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={() => scrollStrip(-1)}
            >
              <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
            </button>
          )}
          {arrows.next && (
            <button
              type="button"
              aria-label="Siguiente casos"
              className="absolute right-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#07080a]/90 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-[#ffb800]/60 hover:text-[#ffb800] sm:right-1 md:h-14 md:w-14"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={() => scrollStrip(1)}
            >
              <ChevronRight className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
            </button>
          )}
          <div
            ref={scrollRef}
            className="projects-cases-scroll flex w-full snap-x snap-mandatory gap-8 overflow-x-auto overflow-y-visible overscroll-x-contain pb-2 md:gap-12"
            role="region"
            aria-label="Casos de estudio, carrusel horizontal"
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="group w-[min(85vw,340px)] shrink-0 cursor-pointer snap-center sm:w-[min(80vw,400px)] md:w-[min(72vw,480px)] lg:w-[520px]"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <div className="relative mb-10 aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all duration-700 group-hover:shadow-[0_30px_80px_-20px_rgba(255,184,0,0.12)] group-hover:ring-[#ffb800]/40">
                  <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                      backgroundSize: '100% 2px, 3px 100%',
                    }}
                  />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-all duration-700 group-hover:bg-transparent" />
                  <div className="absolute bottom-10 left-10">
                    <span className="rounded-full bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#ffb800]">
                      {project.category}
                    </span>
                  </div>
                </div>
                <h4 className="font-display text-4xl uppercase italic text-white transition-colors group-hover:text-[#ffb800]">
                  {project.title}
                </h4>
              </div>
            ))}
            <div className="flex w-[min(85vw,280px)] shrink-0 snap-center items-center justify-center sm:w-[min(80vw,320px)] lg:w-[360px]">
              <button
                type="button"
                className="group flex flex-col items-center gap-6"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/20 transition-all duration-700 group-hover:border-[#ffb800] group-hover:bg-[#ffb800]">
                  <ArrowRight className="h-12 w-12 text-white transition-colors group-hover:text-black" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/40 transition-colors group-hover:text-white">
                  Ver Todos los Casos
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
