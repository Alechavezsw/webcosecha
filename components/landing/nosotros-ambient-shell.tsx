"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Canvas de partículas rosa/blanco (respeta prefers-reduced-motion). */
export function NosotrosAmbientParticles() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 68;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618;
      return {
        bx: (seed * 127.1) % 1,
        by: (seed * 311.7) % 1,
        phase: seed * Math.PI * 2,
        speed: 0.35 + (seed % 0.45),
        radius: 1 + (seed % 2.4),
        pink: i % 3 !== 0,
      };
    });

    let time = 0;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.38 + p.phase) * 32;
        const flowY = Math.cos(time * p.speed * 0.28 + p.phase * 0.72) * 22;
        const drift = Math.sin(time * 0.2 + p.phase * 0.5) * 12;

        const bx = p.bx * w;
        const by = p.by * h;

        const x = bx + flowX + Math.cos(time * 0.35 + p.phase) * drift;
        const y = by + flowY + Math.sin(time * 0.28 + p.phase) * drift;

        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = 0.07 + pulse * 0.16;

        ctx.beginPath();
        ctx.arc(x, y, p.radius + pulse * 0.65, 0, Math.PI * 2);
        if (p.pink) {
          ctx.fillStyle = `rgba(236, 168, 214, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
        }
        ctx.fill();
      });

      time += 0.014;
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55]"
    />
  );
}

export function NosotrosAmbientShell({
  children,
  className,
  sectionClassName,
}: {
  children: ReactNode;
  className?: string;
  sectionClassName?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-[#eca8d6]/20 py-20 md:py-28",
        sectionClassName,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#05030a]/40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-40%,rgba(236,168,214,0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_80%,rgba(124,58,237,0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(236,168,214,0.05)_0%,transparent_42%,rgba(5,3,10,0.45)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-[#eca8d6]/35 to-transparent" />

      <div className="absolute inset-0 z-[1] overflow-hidden">
        <NosotrosAmbientParticles />
      </div>

      <div className={cn("relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12", className)}>
        {children}
      </div>
    </section>
  );
}
