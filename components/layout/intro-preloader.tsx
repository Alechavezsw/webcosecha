"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

/**
 * Intro de marca en la PRIMERA carga de la sesión. El overlay se renderiza desde el
 * primer paint (estado inicial `mounted=true`, igual en SSR y cliente → sin mismatch de
 * hidratación) cubriendo la página; el efecto en mount decide:
 *  - reduced-motion o ya visto (sessionStorage `cc_intro_seen`) → se quita al instante.
 *  - primera vez → revela el wordmark con shimmer y barre hacia arriba (~1.8s).
 * No re-aparece en navegaciones client-side (el componente no se re-monta).
 */
export function IntroPreloader() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(true)
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = !!sessionStorage.getItem("cc_intro_seen")
    } catch {}

    if (reduce || seen) {
      setMounted(false)
      return
    }

    try {
      sessionStorage.setItem("cc_intro_seen", "1")
    } catch {}

    const t1 = setTimeout(() => setRevealing(true), 1100)
    const t2 = setTimeout(() => setMounted(false), 1850)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#050308] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        revealing ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(161,0,242,0.18),transparent_62%)]" />
      <div className="cc-film-grain absolute inset-0" />
      <span className="cc-intro-word relative px-6 text-center font-display text-[clamp(2rem,8vw,5rem)] font-semibold leading-none tracking-tight">
        Cosecha Creativa
      </span>
    </div>
  )
}
