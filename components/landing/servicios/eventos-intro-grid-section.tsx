"use client";

import { useEffect, useId, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type GridPatternProps = {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  patternId: string;
  className?: string;
};

function GridPattern({ offsetX, offsetY, patternId, className }: GridPatternProps) {
  return (
    <svg className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <motion.pattern
          id={patternId}
          width={40}
          height={40}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function EventosIntroGridSection({
  reduceMotion,
  className,
}: {
  reduceMotion: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId().replace(/:/g, "");
  const patternBgId = `eventos-grid-bg-${rawId}`;
  const patternFgId = `eventos-grid-fg-${rawId}`;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    mouseX.set(width / 2);
    mouseY.set(height / 2);
  }, [mouseX, mouseY]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const step = (delta / 1000) * 14;
    gridOffsetX.set((gridOffsetX.get() + step) % 40);
    gridOffsetY.set((gridOffsetY.get() + step * 0.85) % 40);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const maskImage = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 72%)`;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative w-full overflow-hidden border-t border-white/10 bg-[#060608]",
        className,
      )}
    >
      <div
        ref={containerRef}
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        className="relative mx-auto flex min-h-[min(88vh,920px)] w-full max-w-[1400px] flex-col justify-center py-16 md:py-24"
      >
        {/* Capa base: grid tenue */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]">
          <GridPattern
            offsetX={gridOffsetX}
            offsetY={gridOffsetY}
            patternId={patternBgId}
            className="text-white"
          />
        </div>

        {/* Grid revelado con máscara radial al cursor */}
        {!reduceMotion ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] text-white"
            style={{
              maskImage,
              WebkitMaskImage: maskImage,
              opacity: 0.55,
            }}
          >
            <GridPattern
              offsetX={gridOffsetX}
              offsetY={gridOffsetY}
              patternId={patternFgId}
              className="text-[#eca8d6]"
            />
          </motion.div>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]">
            <GridPattern
              offsetX={gridOffsetX}
              offsetY={gridOffsetY}
              patternId={patternFgId}
              className="text-[#eca8d6]"
            />
          </div>
        )}

        {/* Orbes */}
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <div className="absolute -right-[18%] -top-[18%] h-[42%] min-h-[220px] w-[42%] rounded-full bg-[#eca8d6]/25 blur-[120px]" />
          <div className="absolute right-[8%] top-[0%] h-[22%] min-h-[140px] w-[22%] rounded-full bg-violet-500/25 blur-[100px]" />
          <div className="absolute -bottom-[22%] -left-[12%] h-[44%] min-h-[240px] w-[44%] rounded-full bg-cyan-500/20 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl space-y-6 px-6 text-[15px] leading-relaxed text-white/78 md:text-[17px] md:leading-[1.65] lg:px-8">
        <p>
          En Cosecha Creativa llevamos la tecnología al centro de la experiencia. Creamos juegos,
          trivias, pantallas interactivas y dinámicas digitales para eventos sociales, empresariales,
          institucionales, deportivos, culturales y de marca.
        </p>
        <p>
          No hacemos solamente &ldquo;una pantalla con un video de fondo&rdquo;. Creamos
          experiencias para que el público participe, juegue, responda, compita, gane premios y se
          lleve un momento memorable.
        </p>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, x: -10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="border-l-4 border-[#eca8d6] pl-5 font-medium text-white/92"
        >
          Porque en un evento, la atención dura poco. Hay que conquistarla rápido, antes de que
          alguien abra TikTok y se nos vaya media audiencia al algoritmo.
        </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
