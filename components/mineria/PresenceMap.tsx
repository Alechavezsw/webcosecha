import React from 'react';
import { MapPin } from 'lucide-react';
import { asset } from '../lib/asset';

/** Archivo en `public/` (copiado al raíz de `dist` con `base` de Vite). */
const PRESENCIA_BG_IMAGE = asset('543d28df-7bf5-48d8-a45e-302a3ff6829b.png');

const PresenceMap: React.FC = () => {
  return (
    <section
      id="presencia"
      className="reveal-section relative isolate overflow-hidden bg-[#040506] py-24 md:py-32"
      aria-labelledby="presencia-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <img
          src={PRESENCIA_BG_IMAGE}
          alt=""
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-[center_42%] sm:object-[center_38%] md:object-[center_34%] lg:object-[center_30%]"
          decoding="async"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#040506]/50 via-[#040506]/72 to-[#040506]/94"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.14]"
        style={{
          backgroundImage: `radial-gradient(circle at 28% 42%, rgba(255, 184, 0, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 70% 60%, rgba(255, 184, 0, 0.12) 0%, transparent 40%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 184, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 184, 0, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 sm:px-10">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-16 bg-[#ffb800]/60" />
              <span className="text-[11px] font-bold uppercase tracking-[0.55em] text-[#ffb800]/90">
                Raíz regional
              </span>
            </div>
            <h2
              id="presencia-heading"
              className="font-display text-[clamp(2rem,6vw,4.5rem)] uppercase italic leading-[0.95] tracking-tighter text-white"
            >
              Pulso en{' '}
              <span className="text-[#ffb800] drop-shadow-[0_0_40px_rgba(255,184,0,0.35)]">
                San Juan
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/45 md:text-xl">
              Argentina, corazón minero del oeste. Operamos con la misma intensidad que el litio, el
              oro y el cobre que mueven esta provincia.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#07080a]/80 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/35 backdrop-blur-md md:mb-2">
            <MapPin className="h-4 w-4 text-[#ffb800]" aria-hidden />
            <span>31°32′S · 68°32′W</span>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-4xl justify-center overflow-x-clip py-6 md:py-10">
          <svg
            className="relative z-[1] aspect-square w-full max-w-[min(220px,55vw)] drop-shadow-[0_0_56px_rgba(255,184,0,0.2)] sm:max-w-[260px]"
            viewBox="-40 -40 80 80"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Marcador de ubicación en San Juan"
          >
            <defs>
              <filter id="presence-beacon" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#presence-beacon)">
              <circle
                className="presence-map-pulse-outer"
                cx={0}
                cy={0}
                r="28"
                stroke="#ffb800"
                strokeWidth="0.75"
                fill="none"
                opacity="0.5"
              />
              <circle
                className="presence-map-pulse-mid"
                cx={0}
                cy={0}
                r="16"
                stroke="#ffb800"
                strokeWidth="1"
                fill="none"
                opacity="0.65"
              />
              <circle cx={0} cy={0} r="6" fill="#ffb800" />
              <circle cx={0} cy={0} r="2.5" fill="#fff" opacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PresenceMap;
