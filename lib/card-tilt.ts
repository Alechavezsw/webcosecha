"use client";

import type { PointerEvent } from "react";

// Tilt 3D de fichas que sigue al cursor. Muta el style directamente (sin
// re-renders) y expone --tilt-gx/--tilt-gy para el brillo especular del hijo.
// El transform inline pisa las clases hover:-translate-y mientras dura el
// hover; al salir se limpia y vuelven a mandar las clases.

let reducedMotion: boolean | null = null;
const prefersReducedMotion = () => {
  if (reducedMotion === null) {
    reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return reducedMotion;
};

export function tiltMove(e: PointerEvent<HTMLElement>, maxTilt = 5) {
  if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.transition = "transform 140ms ease-out";
  el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-3px)`;
  el.style.setProperty("--tilt-gx", `${((px + 0.5) * 100).toFixed(1)}%`);
  el.style.setProperty("--tilt-gy", `${((py + 0.5) * 100).toFixed(1)}%`);
}

export function tiltReset(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.transition = "";
  el.style.transform = "";
}

/** Estilo del brillo especular que sigue al cursor (poner en un div absolute inset-0). */
export const tiltGlareStyle = (rgb = "236, 168, 214", alpha = 0.1) => ({
  background: `radial-gradient(circle at var(--tilt-gx, 50%) var(--tilt-gy, 50%), rgba(${rgb}, ${alpha}), transparent 55%)`,
});
