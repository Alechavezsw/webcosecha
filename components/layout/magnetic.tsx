"use client"

import { useRef, useEffect, type ReactNode } from "react"
import gsap from "gsap"

/**
 * Envoltorio "magnético": el contenido sigue suavemente al cursor y vuelve con un
 * rebote elástico al salir. Pensado para CTAs de alta visibilidad.
 * - Se desactiva con prefers-reduced-motion y en dispositivos sin hover (touch).
 * - Patrón basado en components/mineria/Magnetic.tsx (gsap.quickTo elástico).
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === "undefined") return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia?.("(hover: none)").matches) return

    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" })
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" })

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      xTo((e.clientX - (left + width / 2)) * strength)
      yTo((e.clientY - (top + height / 2)) * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={className} style={{ display: "inline-block", willChange: "transform" }}>
      {children}
    </div>
  )
}
