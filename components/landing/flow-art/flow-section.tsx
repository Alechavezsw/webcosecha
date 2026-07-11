"use client";

import type React from "react";

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export interface FlowSectionProps {
  className?: string;
  /** Fondo del panel animado (va en `.flow-art-container`, debe coincidir con la rotación GSAP). */
  innerClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function FlowSection({
  className,
  innerClassName,
  style = {},
  children,
  "aria-label": ariaLabel,
}: FlowSectionProps) {
  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cx("relative min-h-screen w-full overflow-hidden", className)}
    >
      <div
        data-flow-inner
        className={cx(
          "flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pb-[4vw] pt-[clamp(2rem,8vw,4vw)]",
          "will-change-transform",
          innerClassName,
        )}
        style={{ transformOrigin: "bottom left", ...style }}
      >
        {children}
      </div>
    </section>
  );
}
