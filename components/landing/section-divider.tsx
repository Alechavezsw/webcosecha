"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DividerColor =
  | "copper"
  | "rose"
  | "purple"
  | "cyan"
  | "emerald"
  | "purple-rose"
  | "purple-cyan"
  | "dark";

interface SectionDividerProps {
  color?: DividerColor;
  className?: string;
  glowHeight?: string;
}

const colorStyles: Record<
  DividerColor,
  {
    line: string;
    glow: string;
  }
> = {
  copper: {
    line: "bg-gradient-to-r from-transparent via-[#b85221]/60 via-[#8b2c19]/80 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(184,82,33,0.18)_0%,rgba(139,44,25,0.06)_50%,transparent_100%)]",
  },
  rose: {
    line: "bg-gradient-to-r from-transparent via-[#eca8d6]/70 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(236,168,214,0.15)_0%,rgba(236,168,214,0.03)_60%,transparent_100%)]",
  },
  purple: {
    line: "bg-gradient-to-r from-transparent via-[#a100f2]/70 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(161,0,242,0.14)_0%,rgba(161,0,242,0.02)_60%,transparent_100%)]",
  },
  cyan: {
    line: "bg-gradient-to-r from-transparent via-[#67e8f9]/70 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(103,232,249,0.14)_0%,rgba(103,232,249,0.02)_60%,transparent_100%)]",
  },
  emerald: {
    line: "bg-gradient-to-r from-transparent via-[#10b981]/70 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12)_0%,rgba(16,185,129,0.02)_60%,transparent_100%)]",
  },
  "purple-rose": {
    line: "bg-gradient-to-r from-transparent via-purple-600/50 via-[#eca8d6]/60 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(161,0,242,0.10)_0%,rgba(236,168,214,0.08)_50%,transparent_100%)]",
  },
  "purple-cyan": {
    line: "bg-gradient-to-r from-transparent via-indigo-500/50 via-cyan-400/55 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(161,0,242,0.09)_0%,rgba(103,232,249,0.07)_50%,transparent_100%)]",
  },
  dark: {
    line: "bg-gradient-to-r from-transparent via-white/10 to-transparent",
    glow: "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.02)_0%,transparent_100%)]",
  },
};

export function SectionDivider({
  color = "rose",
  className,
  glowHeight = "h-40 sm:h-56 md:h-72",
}: SectionDividerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const currentRef = dividerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const styles = colorStyles[color];

  return (
    <div
      ref={dividerRef}
      className={cn(
        "relative w-full overflow-hidden pointer-events-none select-none z-20",
        className
      )}
      style={{ height: "1px" }} // Contenedor colapsado físicamente para evitar espacios en blanco no deseados
    >
      {/* Luz ambiental difusa (Spotlight/Glow) que resplandece hacia arriba y abajo del divisor */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-[1200px] -translate-y-1/2 blur-2xl transition-all duration-1000 ease-out origin-center",
          styles.glow,
          glowHeight,
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      />

      {/* Línea divisoria horizontal brillante con degradado */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px transition-all duration-1000 ease-out origin-center",
          styles.line,
          isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50"
        )}
      />
    </div>
  );
}
