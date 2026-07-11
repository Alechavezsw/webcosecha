"use client"

import { useReducedMotion } from "framer-motion"

/** Motion presets compartidos — página de servicios (gestión de redes, etc.) */

export const easePremium = [0.22, 1, 0.36, 1] as const

export const sectionHairlineTop =
  "pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"

/** Ritmo vertical unificado entre bloques */
export const sectionPyMain = "py-20 md:py-28 lg:py-36"
export const sectionPyCompact = "py-16 md:py-24 lg:py-28"

const main = {
  hidden: { opacity: 0, y: 48, scale: 0.988 },
  visible: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-11%" as const, amount: 0.2 },
  transition: { duration: 1.05, ease: easePremium },
} as const

const tight = {
  hidden: { opacity: 0, y: 38, scale: 0.992 },
  visible: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-72px" as const, amount: 0.26 },
  transition: { duration: 0.92, ease: easePremium },
} as const

const footer = {
  hidden: { opacity: 0, y: 40, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-56px" as const, amount: 0.18 },
  transition: { duration: 0.88, ease: easePremium },
} as const

export const serviceSectionKinds = { main, tight, footer } as const

export type ServiceSectionKind = keyof typeof serviceSectionKinds

/**
 * Entrada al scroll con easing premium; respeta `prefers-reduced-motion`.
 */
export function useServiceSectionReveal(kind: ServiceSectionKind) {
  const prefersReducedMotion = useReducedMotion()
  const preset = serviceSectionKinds[kind]

  return {
    variants: {
      hidden: preset.hidden,
      visible: preset.visible,
    },
    initial: (prefersReducedMotion ? "visible" : "hidden") as "hidden" | "visible",
    whileInView: prefersReducedMotion ? undefined : ("visible" as const),
    viewport: preset.viewport,
    transition: preset.transition,
  }
}
