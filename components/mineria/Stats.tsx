import React, { useEffect, useMemo, useRef, useState } from 'react';

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
    return { target: Number.isFinite(n) ? n : 0, decimals: 1, suffix: 'x' };
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
      className="stat-value relative z-10 text-7xl sm:text-8xl lg:text-[120px] font-display text-white/30 group-hover:text-[#ffb800] transition-colors duration-500 leading-none mb-4 tabular-nums"
      aria-live="polite"
    >
      {display}
    </div>
  );
}

const Stats: React.FC<StatsProps> = ({ stats, onMouseEnter, onMouseLeave }) => {
  return (
    <section className="reveal-section stats-container py-40 bg-[#050607] border-y border-[#ffb800]/10 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://cosechacreativa.com.ar/wp-content/uploads/2026/03/cc-scaled.png"
          alt="Cosecha Creativa Background"
          className="w-full h-full object-cover opacity-10 grayscale"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>
      <div className="max-w-[1800px] mx-auto px-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="stat-card group relative z-0 rounded-2xl p-6 sm:p-8 -m-2 border border-transparent hover:border-[#ffb800]/20 hover:bg-white/[0.02] transition-[border-color,background-color] duration-500"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div
                className="absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,184,0,0.12),transparent_55%)]"
                aria-hidden
              />
              <AnimatedStatValue value={stat.value} staggerMs={idx * 180} />
              <div className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
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
