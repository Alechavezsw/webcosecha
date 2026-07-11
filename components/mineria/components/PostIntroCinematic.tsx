import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { asset } from '../lib/asset';
import type { LucideIcon } from 'lucide-react';
import { Activity, Cpu, Globe2, Layers3, Pickaxe, Radio } from 'lucide-react';
import IndustrialVideoHud from './IndustrialVideoHud';
import CinematicStyleOverlays from './CinematicStyleOverlays';

type SectionId = 'services' | 'about' | 'presencia' | 'showreel' | 'cases' | 'contact';

interface PostIntroCinematicProps {
  onEnded: () => void;
  onSectionNavigate: (sectionId: string) => void;
  /** Se dispara a mitad de la salida para que el Hero empiece bajo el overlay (continuidad). */
  onRevealStart?: () => void;
}

const SECTION_CHIPS: Array<{ Icon: LucideIcon; label: string; id: SectionId }> = [
  { Icon: Pickaxe, label: 'Servicios', id: 'services' },
  { Icon: Cpu, label: 'Nosotros', id: 'about' },
  { Icon: Globe2, label: 'Presencia', id: 'presencia' },
  { Icon: Radio, label: 'Showreel', id: 'showreel' },
  { Icon: Layers3, label: 'Casos', id: 'cases' },
  { Icon: Activity, label: 'Contacto', id: 'contact' },
];

const PostIntroCinematic: React.FC<PostIntroCinematicProps> = ({ onEnded, onSectionNavigate, onRevealStart }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  const onSectionNavigateRef = useRef(onSectionNavigate);
  const onRevealStartRef = useRef(onRevealStart);
  const exitStartedRef = useRef(false);

  onEndedRef.current = onEnded;
  onSectionNavigateRef.current = onSectionNavigate;
  onRevealStartRef.current = onRevealStart;

  const finishOverlay = (after: () => void, opts?: { handoffToHero?: boolean }) => {
    const handoffToHero = opts?.handoffToHero ?? true;
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;
    videoRef.current?.pause();

    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) {
      after();
      return;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      if (handoffToHero) onRevealStartRef.current?.();
      gsap.to(root, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: after,
      });
      return;
    }

    gsap.set(root, {
      transformOrigin: '50% 38%',
      clipPath: 'inset(0% 0% 0% 0%)',
      willChange: 'transform, clip-path, opacity, filter',
    });
    if (video) gsap.set(video, { transformOrigin: '50% 42%' });

    const tl = gsap.timeline({ onComplete: after });

    tl.to(
      '.post-cinematic-chrome',
      {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.035,
        ease: 'power3.in',
      },
      0,
    ).to(
      '.post-cinematic-ui-layer',
      {
        opacity: 0,
        y: -56,
        scale: 0.86,
        duration: 0.44,
        ease: 'power4.in',
      },
      0.05,
    );

    if (video) {
      tl.to(
        video,
        {
          scale: 1.08,
          filter: 'brightness(1.12) saturate(1.05) contrast(1.02)',
          duration: 0.52,
          ease: 'power2.out',
        },
        0.02,
      ).to(
        video,
        {
          scale: 1.02,
          filter: 'brightness(0.92) saturate(1.02)',
          duration: 0.85,
          ease: 'power3.inOut',
        },
        '-=0.28',
      );
    }

    if (handoffToHero) {
      tl.call(
        () => {
          onRevealStartRef.current?.();
        },
        undefined,
        0.42,
      );
    }

    tl.to(
      '.post-cinematic-handoff-flare',
      {
        opacity: 0.42,
        scale: 1.35,
        duration: 0.28,
        ease: 'power2.out',
      },
      0.36,
    ).to(
      '.post-cinematic-handoff-flare',
      {
        opacity: 0,
        scale: 2.05,
        duration: 0.62,
        ease: 'power3.in',
      },
      '-=0.12',
    );

    tl.to(
      root,
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        scale: 1.035,
        y: -18,
        duration: 1.12,
        ease: 'expo.inOut',
      },
      '-=0.22',
    )
      .to(
        root,
        {
          opacity: 0.72,
          filter: 'brightness(1.08) blur(0px)',
          duration: 0.38,
          ease: 'power1.out',
        },
        '-=0.78',
      )
      .to(
        root,
        {
          opacity: 0.22,
          filter: 'brightness(1.15) blur(3px)',
          duration: 0.48,
          ease: 'power2.inOut',
        },
        '-=0.42',
      )
      .to(
        root,
        {
          opacity: 0,
          filter: 'brightness(1.22) blur(5px)',
          scale: 1.01,
          duration: 0.4,
          ease: 'power2.in',
        },
        '-=0.28',
      );
  };

  const runExit = () => {
    finishOverlay(() => {
      onEndedRef.current?.();
    });
  };

  const handleSectionClick = (e: React.MouseEvent, id: SectionId) => {
    e.preventDefault();
    finishOverlay(
      () => {
        onSectionNavigateRef.current(id);
      },
      { handoffToHero: false },
    );
  };

  const runExitRef = useRef(runExit);
  runExitRef.current = runExit;

  useEffect(() => {
    let wheelAccum = 0;
    let wheelReset: ReturnType<typeof setTimeout> | undefined;

    const clearWheelAccum = () => {
      if (wheelReset) clearTimeout(wheelReset);
      wheelReset = setTimeout(() => {
        wheelAccum = 0;
      }, 140);
    };

    const onWheel = (e: WheelEvent) => {
      if (exitStartedRef.current) return;
      if (e.deltaY <= 0) return;
      wheelAccum += e.deltaY;
      clearWheelAccum();
      if (e.deltaY >= 28 || wheelAccum >= 42) {
        e.preventDefault();
        wheelAccum = 0;
        runExitRef.current();
      }
    };

    let touchY0 = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY0 = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (exitStartedRef.current) return;
      const y = e.changedTouches[0]?.clientY ?? touchY0;
      if (touchY0 - y > 56) runExitRef.current();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (exitStartedRef.current) return;
      if (['ArrowDown', 'PageDown', 'Enter', 'Escape', ' '].includes(e.key)) {
        e.preventDefault();
        runExitRef.current();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      if (wheelReset) clearTimeout(wheelReset);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    gsap.set(root, { yPercent: 0, opacity: 1, y: 0 });

    video.currentTime = 0;
    video.playbackRate = 1.2;
    void video.play().catch(() => {
      finishOverlay(() => onEndedRef.current?.());
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(
        '.post-cinematic-root .hud-element',
        { opacity: 0, y: 8, duration: 0.26, stagger: 0.02, ease: 'power2.out' },
        0,
      )
        .from(
          '.post-cinematic-title-line',
          { opacity: 0, y: 14, duration: 0.3, stagger: 0.05, ease: 'power3.out' },
          0,
        )
        .from(
          '.post-cinematic-icon-chip',
          { opacity: 0, y: 10, duration: 0.24, stagger: 0.03, ease: 'power2.out' },
          0.02,
        )
        .from(
          '.post-cinematic-deco-line',
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.32,
            stagger: 0.025,
            ease: 'power2.out',
          },
          0,
        )
        .from(
          '.post-cinematic-deco-v',
          {
            scaleY: 0,
            opacity: 0,
            duration: 0.34,
            ease: 'power2.out',
            transformOrigin: 'top center',
          },
          0,
        )
        .from(
          '.post-cinematic-meta',
          { opacity: 0, y: 6, duration: 0.22, ease: 'power2.out' },
          '-=0.12',
        );
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="post-cinematic-root fixed inset-0 z-[190] overflow-hidden bg-[#07080a]"
      role="dialog"
      aria-modal="true"
      aria-label="Ecosistema digital minero. Usá scroll hacia abajo, flecha abajo o Escape para pasar al sitio."
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 70% at 50% 22%, rgba(255, 184, 0, 0.12), transparent 58%),
            radial-gradient(ellipse 50% 40% at 88% 58%, rgba(212, 165, 116, 0.06), transparent 52%),
            radial-gradient(ellipse 55% 45% at 8% 68%, rgba(255, 184, 0, 0.05), transparent 48%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.28]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 40px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-38deg, transparent, transparent 22px, rgba(255,184,0,0.12) 22px, rgba(255,184,0,0.12) 23px)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08]"
        aria-hidden
      />

      <div
        className="post-cinematic-handoff-flare pointer-events-none absolute inset-0 z-[2] opacity-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 85% 55% at 50% 36%, rgba(255, 184, 0, 0.38), transparent 58%),
            radial-gradient(ellipse 120% 80% at 50% 100%, rgba(7, 8, 10, 0.55), transparent 45%)
          `,
          transform: 'scale(0.92)',
        }}
      />

      <div className="post-cinematic-chrome pointer-events-none absolute inset-x-0 top-1/2 z-[3] h-px -translate-y-1/2 overflow-hidden">
        <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-[#ffb800]/35 to-transparent animate-preloader-scan" />
      </div>

      <div className="post-cinematic-chrome pointer-events-none absolute left-0 right-0 top-0 z-30 px-6 pt-7 sm:px-10 sm:pt-9">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="post-cinematic-deco-line h-px w-12 origin-left bg-gradient-to-r from-[#ffb800] to-transparent sm:w-16" />
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ffb800] sm:text-[11px]">
            Secuencia de apertura
          </span>
          <div className="post-cinematic-deco-line hidden h-px min-w-[3rem] flex-1 origin-left bg-gradient-to-r from-[#ffb800]/40 to-transparent sm:block" />
        </div>
      </div>

      <div className="absolute inset-0 z-[1]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.88]"
          muted
          playsInline
          loop={false}
          preload="auto"
          onEnded={runExit}
          onError={runExit}
        >
          <source src={asset('cinematic_202604191001.webm')} type="video/webm" />
        </video>
        <CinematicStyleOverlays />
      </div>

      <div className="post-cinematic-chrome pointer-events-none absolute inset-0 z-[22]" aria-hidden>
        <div className="post-cinematic-deco-v absolute left-1/2 top-[18%] h-[min(42%,320px)] w-px -translate-x-1/2 bg-gradient-to-b from-[#ffb800]/50 via-white/10 to-transparent sm:top-[16%]" />
        <div className="post-cinematic-deco-line absolute left-[8%] right-[8%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#ffb800]/25 to-transparent md:left-[14%] md:right-[14%]" />
        <div className="absolute left-4 top-1/4 h-8 w-8 border-l-2 border-t-2 border-[#ffb800]/35 sm:left-8" />
        <div className="absolute right-4 top-1/4 h-8 w-8 border-r-2 border-t-2 border-[#ffb800]/35 sm:right-8" />
        <div className="absolute bottom-1/4 left-4 h-8 w-8 border-b-2 border-l-2 border-[#ffb800]/35 sm:left-8" />
        <div className="absolute bottom-1/4 right-4 h-8 w-8 border-b-2 border-r-2 border-[#ffb800]/35 sm:right-8" />
      </div>

      <div className="post-cinematic-chrome pointer-events-none absolute inset-0 z-[25]">
        <IndustrialVideoHud />
      </div>

      <div className="post-cinematic-ui-layer absolute inset-0 z-[38] flex flex-col items-center justify-center px-5 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28">
        <div className="post-cinematic-meta pointer-events-none mb-8 flex flex-wrap items-center justify-center gap-3 sm:mb-10 sm:gap-4">
          <span className="rounded-full border border-[#ffb800]/30 bg-black/50 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.45em] text-[#ffb800]/95 backdrop-blur-sm sm:text-[10px]">
            Pulso operativo
          </span>
          <div className="hidden h-px w-10 bg-gradient-to-r from-transparent to-[#ffb800]/50 sm:block" />
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/35 sm:text-[10px]">
            Canal · 7G · Sync
          </span>
        </div>

        <div className="flex max-w-[min(100%,720px)] flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-4">
          {SECTION_CHIPS.map(({ Icon, label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleSectionClick(e, id)}
              className="post-cinematic-icon-chip group flex flex-col items-center gap-1 rounded-2xl border border-white/12 bg-[#07080a]/80 px-2.5 py-2 shadow-[0_0_0_1px_rgba(255,184,0,0.06)] backdrop-blur-md transition-colors duration-200 hover:border-[#ffb800]/35 hover:bg-[#0a0c0f]/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb800] sm:gap-1.5 sm:px-3 sm:py-2.5"
            >
              <Icon
                className="h-5 w-5 text-[#ffb800] transition-transform duration-200 group-hover:scale-105 sm:h-6 sm:w-6"
                strokeWidth={1.35}
                aria-hidden
              />
              <span className="text-[7px] font-mono uppercase tracking-[0.22em] text-white/45 group-hover:text-white/70 sm:text-[8px]">
                {label}
              </span>
            </a>
          ))}
        </div>

        <div className="post-cinematic-deco-line pointer-events-none mx-auto mt-8 h-px w-[min(90%,420px)] bg-gradient-to-r from-transparent via-[#ffb800]/45 to-transparent sm:mt-10" />

        <h2 className="pointer-events-none mt-6 max-w-[min(96vw,920px)] text-center font-display text-[clamp(2.1rem,9vw,5.5rem)] uppercase italic leading-[0.92] tracking-tighter text-white sm:mt-8">
          <div className="post-cinematic-title-line overflow-visible">
            <span>ECOSISTEMA</span>
          </div>
          <div className="post-cinematic-title-line overflow-visible">
            <span className="text-gradient-amber">DIGITAL</span>
          </div>
          <div className="post-cinematic-title-line overflow-visible">
            <span>MINERO</span>
          </div>
        </h2>

        <div className="post-cinematic-deco-line pointer-events-none mx-auto mt-6 h-px w-[min(70%,280px)] bg-gradient-to-r from-transparent via-white/20 to-transparent sm:mt-8" />

        <p className="post-cinematic-meta pointer-events-none mt-5 max-w-lg text-center text-[11px] font-mono uppercase leading-relaxed tracking-[0.22em] text-white/30 sm:mt-6 sm:text-xs">
          Marketing industrial · Litio · Cobre · Oro
        </p>
      </div>

      <div className="post-cinematic-chrome video-label pointer-events-none absolute left-2 top-1/2 z-[15] hidden -translate-y-1/2 flex-col gap-14 vertical-text sm:left-3 xl:-left-1 xl:flex">
        <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
          SYSTEM_DIAGNOSTIC_READY
        </span>
        <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
          MINING_CORE_PROTOCOL_V4.2
        </span>
      </div>
      <div className="post-cinematic-chrome video-label pointer-events-none absolute right-2 top-1/2 z-[15] hidden -translate-y-1/2 flex-col gap-14 vertical-text sm:right-3 xl:-right-1 xl:flex">
        <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
          REALTIME_DATA_MINING
        </span>
        <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
          SECURE_EXTRACTION_ALPHA
        </span>
      </div>

      <div
        className="post-cinematic-chrome pointer-events-none absolute bottom-5 left-0 right-0 z-[45] flex justify-center px-4 sm:bottom-8"
        aria-hidden
      >
        <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[9px] font-mono uppercase tracking-[0.32em] text-white/40 backdrop-blur-sm">
          Scroll · pasar al sitio
        </span>
      </div>
    </div>
  );
};

export default PostIntroCinematic;
