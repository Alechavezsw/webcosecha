"use client";

import { useEffect, useRef, type RefObject } from "react";

type Particle = {
  x: number;
  y: number;
  bx: number;
  by: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

const INFLUENCE = 160;
const REPEL = 3.2;
const SPRING = 0.045;
const DAMP = 0.86;

export function DevelopersMouseParticles({
  containerRef,
  disabled,
}: {
  containerRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    const root = containerRef.current;
    if (!canvas || !root) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let rafId = 0;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    function initParticles(width: number, height: number) {
      const area = width * height;
      /** ~2.5× más densa que antes: mismo divisor menor + techo más alto */
      const count = Math.min(320, Math.max(96, Math.floor(area / 5200)));
      const next: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const bx = Math.random() * width;
        const by = Math.random() * height;
        next.push({
          bx,
          by,
          x: bx,
          y: by,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.1 + 0.28,
          a: Math.random() * 0.2 + 0.05,
        });
      }
      particles = next;
    }

    function resize() {
      const rect = root.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h);
    }

    function onMove(clientX: number, clientY: number) {
      const rect = root.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    }

    function onMouseMove(e: MouseEvent) {
      onMove(e.clientX, e.clientY);
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function tick() {
      if (!isInView) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const rect = root.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mx = mouse.x;
      const my = mouse.y;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        let fx = 0;
        let fy = 0;

        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < INFLUENCE && dist > 0.5) {
          const t = 1 - dist / INFLUENCE;
          const strength = t * t;
          fx += (dx / dist) * strength * REPEL;
          fy += (dy / dist) * strength * REPEL;
        }

        fx += (p.bx - p.x) * SPRING;
        fy += (p.by - p.y) * SPRING;

        p.vx = (p.vx + fx) * DAMP;
        p.vy = (p.vy + fy) * DAMP;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 168, 214, ${p.a})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a * 0.35})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // Pausa fuera de viewport: sin física ni repintado cuando no se ve
    let isInView = true;
    const io = new IntersectionObserver(
      ([entry]) => { isInView = entry?.isIntersecting ?? true; },
      { threshold: 0.01 }
    );
    io.observe(root);

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 0) return;
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }

    root.addEventListener("mousemove", onMouseMove);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onLeave);
    root.addEventListener("touchcancel", onLeave);

    rafId = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onLeave);
      root.removeEventListener("touchcancel", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef, disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      aria-hidden
    />
  );
}
