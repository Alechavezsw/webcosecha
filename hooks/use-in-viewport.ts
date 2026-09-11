"use client"

import { useEffect, useRef, useState } from "react"

/**
 * ¿El elemento está (aunque sea parcialmente) en pantalla?
 *
 * Pensado para apagar bucles caros —canvas WebGL, video— cuando el bloque ya
 * pasó de largo. Sin esto, en /servicios/apps los dos canvas seguían dibujando
 * a 60 fps mientras el visitante leía texto seiscientos píxeles más abajo, y el
 * scroll de toda la página se sentía pesado.
 *
 * `rootMargin` positivo despierta el bloque un poco antes de que entre, así no
 * se ve el primer cuadro apareciendo de golpe.
 */
export function useInViewport<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? false), {
      rootMargin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
