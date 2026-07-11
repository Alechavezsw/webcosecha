"use client";

import { useEffect, useState, type RefObject } from "react";

/** Desplazamiento vertical según scroll (px). `intensity` ~200 = parallax marcado. */
export function useImmersiveParallax(
  ref: RefObject<HTMLElement | null>,
  intensity = 200,
) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setOffset(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      setOffset((clamped - 0.5) * intensity);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, intensity]);

  return offset;
}
