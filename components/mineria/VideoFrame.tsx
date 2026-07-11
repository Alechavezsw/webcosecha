import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../lib/asset';
import IndustrialVideoHud from './IndustrialVideoHud';

gsap.registerPlugin(ScrollTrigger);

interface VideoFrameProps {
  videoSectionRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const VideoFrame: React.FC<VideoFrameProps> = ({ videoSectionRef, videoRef }) => {
  const frameWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = videoSectionRef.current;
    const frame = frameWrapRef.current;
    const video = videoRef.current;
    const stage = stageRef.current;
    const scan = scanRef.current;
    const bloom = bloomRef.current;
    if (!section || !frame || !video || !stage) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    let playSt: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(stage, { clearProps: 'all' });
        gsap.set(frame, { clearProps: 'all' });
        gsap.set(video, { clearProps: 'all' });
        if (scan) gsap.set(scan, { opacity: 0, visibility: 'hidden' });
        if (bloom) gsap.set(bloom, { opacity: 0, visibility: 'hidden' });
        playSt = ScrollTrigger.create({
          trigger: section,
          start: 'top 78%',
          once: true,
          onEnter: () => {
            video.currentTime = 0;
            void video.play().catch(() => {});
          },
        });
        return;
      }

      gsap.set(stage, {
        clipPath: 'inset(26% 10% 26% 10%)',
        y: 72,
        rotateX: 5,
        opacity: 0.15,
        filter: 'blur(18px) brightness(0.55)',
        transformOrigin: '50% 42%',
        willChange: 'transform, clip-path, opacity, filter',
      });
      gsap.set(frame, {
        clipPath: 'inset(12% 10% 12% 10%)',
        opacity: 0.65,
        willChange: 'clip-path, opacity',
      });
      gsap.set(video, {
        scale: 1.12,
        opacity: 0.12,
        filter: 'saturate(0.85) contrast(1.05)',
        willChange: 'transform, opacity, filter',
      });
      if (scan) {
        gsap.set(scan, {
          yPercent: -52,
          opacity: 0.55,
          scaleY: 1.35,
          willChange: 'transform, opacity',
        });
      }
      if (bloom) {
        gsap.set(bloom, { opacity: 0.45, scale: 0.88, willChange: 'transform, opacity' });
      }

      const reveal = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 50%',
          scrub: 0.9,
        },
      });

      reveal
        .to(
          stage,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            rotateX: 0,
            opacity: 1,
            filter: 'blur(0px) brightness(1)',
            duration: 1,
          },
          0,
        )
        .to(
          frame,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1,
          },
          0.06,
        )
        .to(
          video,
          {
            scale: 1,
            opacity: 0.9,
            filter: 'saturate(1) contrast(1)',
            duration: 1,
          },
          0.08,
        );

      if (scan) {
        reveal.to(
          scan,
          {
            yPercent: 48,
            opacity: 0,
            scaleY: 1.6,
            duration: 1,
          },
          0,
        );
      }
      if (bloom) {
        reveal.to(
          bloom,
          {
            opacity: 0,
            scale: 1.45,
            duration: 1,
          },
          0,
        );
      }

      playSt = ScrollTrigger.create({
        trigger: section,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          video.currentTime = 0;
          void video.play().catch(() => {});
        },
      });
    }, section);

    return () => {
      playSt?.kill();
      ctx.revert();
    };
  }, [videoSectionRef, videoRef]);

  return (
    <section
      id="showreel"
      ref={videoSectionRef}
      className="video-section relative scroll-mt-24 overflow-hidden bg-[#07080a] py-20 md:py-28 [perspective:1280px]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 100% 80% at 50% 20%, rgba(255, 184, 0, 0.14), transparent 55%),
            radial-gradient(ellipse 60% 50% at 80% 60%, rgba(212, 165, 116, 0.08), transparent 50%),
            radial-gradient(ellipse 50% 40% at 10% 70%, rgba(255, 184, 0, 0.05), transparent 45%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '100% 48px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06]"
        aria-hidden
      />

      <div
        ref={bloomRef}
        className="pointer-events-none absolute inset-0 z-[14] mix-blend-screen"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255, 184, 0, 0.22), transparent 62%), radial-gradient(ellipse 90% 40% at 50% 100%, rgba(255, 255, 255, 0.06), transparent 55%)',
        }}
      />
      <div
        ref={scanRef}
        className="showreel-scan pointer-events-none absolute inset-0 z-[15] opacity-0"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, transparent 42%, rgba(255,184,0,0.14) 49.2%, rgba(255,255,255,0.2) 50%, rgba(255,184,0,0.14) 50.8%, transparent 58%, transparent 100%)',
          backgroundSize: '100% 160%',
        }}
      />

      <div
        ref={stageRef}
        className="showreel-stage relative z-10 mx-auto flex w-full max-w-[1800px] flex-col items-center px-6 sm:px-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="mb-10 flex w-full max-w-6xl flex-col gap-5 sm:mb-12">
          <div className="flex items-center gap-6">
            <div className="h-0.5 w-20 shrink-0 bg-[#ffb800]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.45em] text-[#ffb800] sm:text-[13px] sm:tracking-[0.5em]">
              Oportunidad de Comunicar
            </span>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-white/55 md:text-xl">
            Tu empresa puede trabajar muy bien… pero si no se comunica bien, pierde oportunidades. Muchos proveedores
            mineros tienen experiencia, capacidad técnica y trayectoria, pero no siempre cuentan con una presencia
            digital que refleje el nivel real de su empresa.
          </p>
        </div>

        <div className="relative w-full max-w-6xl">
          <div
            ref={frameWrapRef}
            className="video-frame relative w-full aspect-video overflow-hidden rounded-3xl border border-white/15 shadow-[0_0_0_1px_rgba(255,184,0,0.06),0_0_120px_-20px_rgba(255,184,0,0.15),0_40px_100px_-40px_rgba(0,0,0,0.8)]"
          >
            <video
              ref={videoRef}
              poster="https://images.unsplash.com/photo-1578307336416-0c97e827c953?auto=format&fit=crop&q=60&w=1600"
              className="h-full w-full object-cover opacity-90 will-change-transform"
              muted
              playsInline
              loop={false}
              preload="auto"
            >
              <source src={asset('clip_1_202603281304.webm')} type="video/webm" />
            </video>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
            <div className="pointer-events-none absolute inset-0 bg-[#ffb800]/5" />
            <IndustrialVideoHud />
          </div>

          <div className="video-label pointer-events-none absolute left-0 top-1/2 z-[5] hidden -translate-y-1/2 flex-col gap-16 vertical-text xl:-left-2 xl:flex">
            <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
              SYSTEM_DIAGNOSTIC_READY
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
              MINING_CORE_PROTOCOL_V4.2
            </span>
          </div>
          <div className="video-label pointer-events-none absolute right-0 top-1/2 z-[5] hidden -translate-y-1/2 flex-col gap-16 vertical-text xl:-right-2 xl:flex">
            <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
              REALTIME_DATA_MINING
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/40">
              SECURE_EXTRACTION_ALPHA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFrame;
