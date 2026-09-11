"use client"

import { cn } from "@/lib/utils"

/**
 * Los cuatro motivos de puntos del diseño original, uno por fila.
 *
 * Hacen de icono sin ser iconos: en vez de un pictograma genérico, cada fila
 * tiene un pulso propio —parpadeo disperso, órbita, barrido y ecualizador— que
 * la distingue de un vistazo. Todo con `<span>` y keyframes; ni un SVG, ni una
 * imagen, ni una dependencia.
 *
 * Las animaciones se apagan solas con `prefers-reduced-motion` (regla en
 * `jarvis-diseno-web.css`, enganchada a la clase `jv-dot`).
 */

type Variant = "grid" | "orbit" | "scan" | "bars"

const DOT = "jv-dot block rounded-full bg-[var(--jv-accent)]"

function Grid() {
  return (
    <div className="grid h-full w-full grid-cols-8 content-start gap-[4px] pt-1">
      {Array.from({ length: 24 }).map((_, d) => (
        <span
          key={d}
          className={cn(DOT, "size-[3px]")}
          style={{
            animationName: "jv-dot-blink",
            animationDuration: `${1.2 + (d % 4) * 0.4}s`,
            animationTimingFunction: "step-start",
            animationIterationCount: "infinite",
            animationDelay: `${d * 80}ms`,
            animationFillMode: "both",
          }}
        />
      ))}
    </div>
  )
}

function Orbit() {
  return (
    <div className="relative size-10">
      {Array.from({ length: 8 }).map((_, d) => {
        const angle = (d / 8) * 2 * Math.PI
        const r = 16
        return (
          <span
            key={d}
            className={cn(DOT, "absolute size-[3px]")}
            style={{
              left: 20 + r * Math.cos(angle),
              top: 20 + r * Math.sin(angle),
              animationName: "jv-dot-blink",
              animationDuration: "1.6s",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${d * 200}ms`,
              animationFillMode: "both",
            }}
          />
        )
      })}
      <span className={cn(DOT, "absolute size-[3px]")} style={{ left: 19, top: 19 }} />
    </div>
  )
}

function Scan() {
  return (
    <div className="flex h-full items-center gap-[5px]">
      {Array.from({ length: 14 }).map((_, d) => (
        <span
          key={d}
          className={cn(DOT, "size-[3px]")}
          style={{
            animationName: "jv-dot-scan",
            animationDuration: "2s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${d * 140}ms`,
            animationFillMode: "both",
          }}
        />
      ))}
    </div>
  )
}

const BAR_HEIGHTS = [6, 14, 22, 28, 18, 32, 10, 26, 20, 8, 30, 16]

function Bars() {
  return (
    <div className="flex h-full items-end gap-[3px]">
      {BAR_HEIGHTS.map((h, d) => (
        <span
          key={d}
          className="jv-dot block w-[4px] bg-[var(--jv-accent)]"
          style={{
            height: h,
            opacity: 0.3 + (h / 32) * 0.7,
            animation: "jv-dot-pulse 1.4s ease-in-out infinite",
            animationDelay: `${d * 90}ms`,
          }}
        />
      ))}
    </div>
  )
}

const VARIANTS: Record<Variant, () => React.JSX.Element> = {
  grid: Grid,
  orbit: Orbit,
  scan: Scan,
  bars: Bars,
}

export function DotMotif({ variant, className }: { variant: Variant; className?: string }) {
  const Motif = VARIANTS[variant]

  return (
    <div aria-hidden className={cn("relative h-10 overflow-hidden", className)}>
      <Motif />
    </div>
  )
}

export default DotMotif
