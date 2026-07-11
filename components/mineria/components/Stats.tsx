import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Rotate3d, Compass, Cpu } from 'lucide-react';
import { asset } from '../lib/asset';

interface Stat {
  label: string;
  value: string;
}

interface StatsProps {
  stats: Stat[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function parseStatValue(raw: string): { target: number; decimals: number; suffix: string } {
  const t = raw.trim();
  if (/k\+$/i.test(t)) {
    const n = parseFloat(t.replace(/k\+$/i, ''));
    return { target: Number.isFinite(n) ? n : 0, decimals: 0, suffix: 'k+' };
  }
  if (/\+$/.test(t)) {
    const n = parseFloat(t.replace(/\+$/, ''));
    return { target: Number.isFinite(n) ? n : 0, decimals: 0, suffix: '+' };
  }
  if (/x$/i.test(t)) {
    const n = parseFloat(t.replace(/x$/i, ''));
    return { target: Number.isFinite(n) ? n : 1, decimals: 1, suffix: 'x' };
  }
  const n = parseFloat(t);
  return { target: Number.isFinite(n) ? n : 0, decimals: 0, suffix: '' };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatAnimatedValue(progress: number, target: number, decimals: number, suffix: string): string {
  const eased = easeOutCubic(progress);
  const current = target * eased;
  if (progress >= 1) {
    if (decimals > 0) return `${target.toFixed(decimals)}${suffix}`;
    return `${Math.round(target)}${suffix}`;
  }
  if (decimals > 0) return `${current.toFixed(decimals)}${suffix}`;
  return `${Math.floor(current)}${suffix}`;
}

function AnimatedStatValue({
  value,
  staggerMs,
}: {
  value: string;
  staggerMs: number;
}) {
  const { target, decimals, suffix } = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? decimals > 0
        ? `${target.toFixed(decimals)}${suffix}`
        : `${Math.round(target)}${suffix}`
      : decimals > 0
        ? `0.0${suffix}`
        : `0${suffix}`
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(decimals > 0 ? `${target.toFixed(decimals)}${suffix}` : `${Math.round(target)}${suffix}`);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const durationMs = 2200;

    const run = () => {
      const start = performance.now() + staggerMs;
      const tick = (now: number) => {
        if (now < start) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const t = Math.min(1, (now - start) / durationMs);
        setDisplay(formatAnimatedValue(t, target, decimals, suffix));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        obs.disconnect();
        run();
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, decimals, suffix, staggerMs]);

  return (
    <div
      ref={ref}
      className="stat-value relative z-10 text-6xl sm:text-7xl lg:text-[85px] xl:text-[95px] font-display text-white/70 group-hover:text-[#ffb800] transition-colors duration-500 leading-none mb-3 tabular-nums select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(255,184,0,0.35)] font-bold"
      aria-live="polite"
    >
      {display}
    </div>
  );
}

const Stats: React.FC<StatsProps> = ({ stats, onMouseEnter, onMouseLeave }) => {
  const sketchfabUrl = "https://sketchfab.com/models/dcf8bedc3b4848bfa0ff4fcaf2c697de/embed?autostart=1&transparent=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_controls=0&dnt=1";

  return (
    <section className="reveal-section stats-container min-h-[950px] xl:min-h-[1050px] flex flex-col justify-between pt-24 pb-12 bg-[#050607] border-y border-[#ffb800]/10 relative overflow-hidden">
      
      {/* 3D Model background container with user's exact sand/dust gradient background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-gradient-to-b from-[#8a7d6d] to-[#5c4a3d]">
        
        {/* Custom High-Fidelity Mining backdrop loaded from the Min/fondo assets (zero people) */}
        <img
          src={asset('Gemini_Generated_Image_yu2miiyu2miiyu2m.png')}
          alt="Operación Minera Especial de Fondo"
          className="w-full h-full object-cover opacity-80"
        />

        {/* MUCHO OVERLAY: Capa oscura súper potente para que el fondo sea muy sutil y elegante */}
        <div className="absolute inset-0 bg-[#050607]/80 z-[1] pointer-events-none" />

        {/* Ambient Overlays to smooth transitions into the dark sections above/below (Darker and taller) */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#050607] via-[#050607]/85 to-transparent z-[2] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050607] via-[#050607]/85 to-transparent z-[2] pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#050607] via-[#050607]/85 to-transparent z-[2] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-[#050607] via-[#050607]/85 to-transparent z-[2] pointer-events-none" />

        {/* Stronger Inset Shadow exactly from the user's snippet for high-end cinematic frame */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_160px_rgba(0,0,0,0.85)] z-[3]" />

        {/* Blueprint HUD Overlay Background Circles & Radar */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] z-[1]">
          <div className="w-[500px] h-[500px] rounded-full border border-[#ffb800]/60 animate-[spin_60s_linear_infinite]" />
          <div className="w-[800px] h-[800px] rounded-full border border-dashed border-[#ffb800]/40 absolute animate-[spin_120s_linear_infinite_reverse]" />
        </div>

        {/* The 3D Model Iframe in the FOREGROUND, SOLID & OPAQUE, on top of the dark mine background */}
        {/* On desktop, we shift the truck to the right side (calc(47% - 40px)) to perfectly balance the text on the left */}
        <div 
          className="absolute pointer-events-auto z-[2] left-[-40px] right-[-40px] w-[calc(100%+80px)] xl:left-[calc(47%-40px)] xl:w-[calc(53%+80px)]" 
          style={{
            top: '-80px',      // Empuja el borde superior fuera de la vista
            bottom: '-80px',   // Empuja el borde inferior (donde está el logo) fuera de la vista
            height: 'calc(100% + 160px)',
            opacity: 0.95,     // Ocupa el frente de forma sólida y definida
          }}
        >
          <iframe
            title="Mining Haul Truck 3D Telemetry"
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            src={sketchfabUrl}
            className="w-full h-full object-cover"
            style={{
              pointerEvents: 'auto',
            }}
          />
        </div>
      </div>

      {/* Decorative Scanlines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,184,0,0.012)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-35" />

      {/* Side Status Bar (Aggiornado exactly like user mockup) */}
      <div className="absolute left-8 top-12 bottom-12 w-8 border-l border-[#ffb800]/15 hidden xl:flex flex-col justify-between items-center py-6 select-none pointer-events-none z-20">
        <div className="text-[8px] font-mono tracking-[0.5em] text-[#ffb800]/30 uppercase rotate-90 origin-center translate-y-12">
          SYS.LOC // SEC.ALPHA
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb800] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb800]"></span>
          </div>
          <div className="text-[9px] font-mono tracking-[0.4em] text-[#ffb800] uppercase rotate-90 origin-center whitespace-nowrap -translate-y-24 font-bold">
            STATUS: OPERATIONAL
          </div>
        </div>
        <div className="text-[8px] font-mono tracking-[0.5em] text-[#ffb800]/30 uppercase rotate-90 origin-center -translate-y-12">
          MODEL // CAT.797F
        </div>
      </div>

      {/* HUD 3D Control Prompt (Hint to interact with 3D model) */}
      <div className="absolute right-10 top-24 hidden md:flex items-center gap-2 text-[#ffb800]/40 text-[9px] font-mono tracking-widest uppercase z-20 pointer-events-none bg-black/40 px-3 py-1.5 rounded border border-[#ffb800]/10 backdrop-blur-sm select-none">
        <Rotate3d className="w-3.5 h-3.5 animate-pulse text-[#ffb800]/60" />
        <span>Arrastra para rotar camión 3D</span>
      </div>

      {/* Top Telemetry Header */}
      <div className="absolute left-10 lg:left-24 top-8 hidden md:flex items-center gap-6 text-[#ffb800]/30 text-[9px] font-mono tracking-[0.3em] uppercase z-20 pointer-events-none select-none">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-[#ffb800]/40" />
          <span>SYS.RENDER: ACTIVE_TURBOPACK</span>
        </div>
        <div className="w-[1px] h-3 bg-[#ffb800]/15" />
        <div className="flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-[#ffb800]/40" />
          <span>BEARING: 284.15° N</span>
        </div>
      </div>

      {/* Main Content Layout (Texts on the Left, 3D truck breathing room on the Right) */}
      <div className="w-full max-w-[1850px] mx-auto px-6 sm:px-10 xl:px-16 relative z-10 flex flex-col xl:flex-row gap-16 xl:gap-24 items-center justify-between mt-8 mb-16 pointer-events-none">
        
        {/* Descriptive Text Column from Mockup (styled as a highly defined framed dashboard console) */}
        <div className="w-full xl:w-[54%] text-left relative z-20 flex flex-col gap-6 p-8 sm:p-10 xl:p-12 bg-[#050607]/85 rounded-xl border border-[#ffb800]/20 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_24px_rgba(255,184,0,0.03)] relative overflow-hidden group/panel hover:border-[#ffb800]/40 transition-all duration-500 pointer-events-auto">
          
          {/* Sci-fi Corner Brackets for the panel (Fully Opaque Yellow Glowing Brackets) */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#ffb800] shadow-[0_0_8px_rgba(255,184,0,0.6)] rounded-tl-sm z-30" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#ffb800] shadow-[0_0_8px_rgba(255,184,0,0.6)] rounded-tr-sm z-30" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#ffb800] shadow-[0_0_8px_rgba(255,184,0,0.6)] rounded-bl-sm z-30" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#ffb800] shadow-[0_0_8px_rgba(255,184,0,0.6)] rounded-br-sm z-30" />
          
          {/* Glowing Left Accent line */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-[#ffb800] via-[#ffb800]/50 to-transparent rounded-r" />

          {/* Radial glow background on hover */}
          <div
            className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover/panel:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,184,0,0.06),transparent_60%)]"
            aria-hidden
          />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-mono tracking-[0.45em] text-[#ffb800] uppercase font-bold">
                COSECHA CREATIVA
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display uppercase italic tracking-tight text-white leading-none font-black">
                ¿Qué hacemos por tu empresa?
              </h2>
            </div>

            {/* Horizontal Divider Line */}
            <div className="w-full h-px bg-white/10" />

            {/* Item 01 */}
            <div className="flex flex-col gap-3 group/item">
              <div className="flex gap-3 items-center text-[#ffb800] group-hover/item:text-[#ffb800] transition-colors duration-300">
                <span className="text-xl sm:text-2xl font-display font-bold leading-none">
                  01
                </span>
                <h3 className="text-base font-bold italic tracking-wider uppercase">
                  PROFUNDIDAD TÉCNICA
                </h3>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed font-medium">
                Diseñamos estrategias y herramientas digitales para que tu empresa tenga una presencia más fuerte, ordenada y profesional dentro del sector.
              </p>
            </div>

            {/* Horizontal Divider Line */}
            <div className="w-full h-px bg-white/10" />

            {/* Item 02 */}
            <div className="flex flex-col gap-3 group/item">
              <div className="flex gap-3 items-center text-[#ffb800] group-hover/item:text-[#ffb800] transition-colors duration-300">
                <span className="text-xl sm:text-2xl font-display font-bold leading-none">
                  02
                </span>
                <h3 className="text-base font-bold italic tracking-wider uppercase">
                  RED GLOBAL
                </h3>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <p className="text-[13px] font-semibold text-white/90 leading-relaxed italic">
                  ¿Qué obtiene un proveedor minero al mejorar su marketing digital?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 mt-1">
                  {[
                    "Mejor imagen corporativa",
                    "Mejor presentación de servicios y antecedentes",
                    "Mejor posicionamiento en Google",
                    "Más oportunidades de contacto",
                    "Mayor confianza al presentar la empresa",
                    "Más visibilidad online",
                    "Mayor claridad comercial",
                    "Presencia digital al nivel del sector"
                  ].map((bullet, bidx) => (
                    <div key={bidx} className="flex gap-2.5 items-center text-[12px] text-white/75 leading-tight hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb800] shrink-0 shadow-[0_0_6px_rgba(255,184,0,0.85)] animate-pulse" />
                      <span className="font-medium whitespace-nowrap">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Spacer on Large Screens so the 3D Truck on the right has full visibility */}
        <div className="hidden xl:block xl:w-[42%] h-[350px] pointer-events-none" />

      </div>

      {/* Stats Cards Section (Expanded layout, pushed to bottom, bottom padding adjusted to prevent layout overlap) */}
      <div className="w-full max-w-[1850px] mx-auto px-6 sm:px-10 xl:px-16 mt-auto pt-12 pb-4 relative z-10 pointer-events-none">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 xl:gap-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="stat-card group relative z-10 rounded-xl p-5 sm:p-7 border border-white/[0.04] bg-[#050607]/45 backdrop-blur-md hover:border-[#ffb800]/25 hover:bg-white/[0.02] transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pointer-events-auto"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {/* Sci-fi Corner Brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#ffb800]/20 group-hover:border-[#ffb800] transition-colors duration-300 rounded-tl-sm" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#ffb800]/20 group-hover:border-[#ffb800] transition-colors duration-300 rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#ffb800]/20 group-hover:border-[#ffb800] transition-colors duration-300 rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#ffb800]/20 group-hover:border-[#ffb800] transition-colors duration-300 rounded-br-sm" />
              
              {/* Radial glow background on hover */}
              <div
                className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,184,0,0.08),transparent_60%)]"
                aria-hidden
              />

              {/* Minimal Telemetry Tag */}
              <div className="text-[8px] font-mono text-[#ffb800]/30 group-hover:text-[#ffb800]/70 transition-colors duration-300 mb-2 select-none tracking-widest">
                [ TELEMETRY.0{idx + 1} ]
              </div>

              {/* Stat Value */}
              <AnimatedStatValue value={stat.value} staggerMs={idx * 180} />
              
              {/* Stat Label */}
              <div className="text-[9px] sm:text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.35em] text-white/50 group-hover:text-white transition-colors duration-300 leading-relaxed select-none">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default Stats;
