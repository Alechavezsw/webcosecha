"use client"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

/**
 * Wipe cinematográfico entre rutas. En cada cambio de pathname, un panel con gradiente
 * de marca cubre el viewport y se barre hacia arriba revelando la página nueva — además
 * tapa el "pop-in" de las escenas 3D al montar.
 *
 * Está montado en cosecha-site-extras (en el layout, hermano de {children}), así que es
 * `fixed` real respecto al viewport y NO interfiere con el containing-block de la página.
 * Sin contenido `fixed` adentro → usar transform acá es seguro.
 */
export function RouteTransition() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90]"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{
          background:
            "linear-gradient(120deg, #0a0612 0%, #1a0b2e 45%, #07131f 100%)",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(236,168,214,0.16),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/60 to-transparent" />
      </motion.div>
    </AnimatePresence>
  )
}
