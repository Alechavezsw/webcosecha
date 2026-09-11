"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

export type NosotrosStat = {
  /** Valor numérico final (se anima al entrar en viewport). */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
};

function useCountUp(target: number, active: boolean, duration = 1500) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      // easeOutCubic: arranca rápido y frena, igual que el resto de las transiciones.
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);

  return value;
}

function StatItem({ stat, index, active }: { stat: NosotrosStat; index: number; active: boolean }) {
  const reduce = useReducedMotion();
  const shown = useCountUp(stat.value, active);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={active && !reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easePremium }}
      className={cn(
        "group relative flex flex-col justify-between gap-4 px-6 py-8 sm:px-8 md:py-10",
        "before:pointer-events-none before:absolute before:inset-x-4 before:bottom-0 before:h-px",
        "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100",
      )}
    >
      <div className="flex items-baseline gap-1">
        {stat.prefix ? (
          <span className="font-display text-3xl leading-none text-white/35 md:text-4xl">
            {stat.prefix}
          </span>
        ) : null}
        <span className="font-display text-[3.4rem] font-semibold leading-none tracking-tight text-white tabular-nums md:text-[4.5rem] lg:text-[5rem]">
          {shown}
        </span>
        {stat.suffix ? (
          <span className="font-display text-3xl leading-none text-white/35 md:text-4xl">
            {stat.suffix}
          </span>
        ) : null}
      </div>

      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
          {stat.label}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{stat.detail}</p>
      </div>
    </motion.div>
  );
}

/**
 * Banda de indicadores entre el hero y el resto de la página.
 * Rompe el ritmo de "secciones con tarjetas" y da contexto medible de entrada.
 */
export function NosotrosStatsBand({ stats }: { stats: NosotrosStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[#05030a]/45" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_120%_at_50%_50%,rgba(255,255,255,0.06),transparent_65%)]"
        aria-hidden
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12">
        <div
          className={cn(
            "grid overflow-hidden rounded-[1.5rem] border border-white/10",
            "bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-md",
            "shadow-[0_28px_90px_-56px_rgba(255,255,255,0.25)]",
            "grid-cols-2 divide-x divide-y divide-white/[0.07] lg:grid-cols-4 lg:divide-y-0",
          )}
        >
          {stats.map((s, i) => (
            <StatItem key={s.label} stat={s} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
