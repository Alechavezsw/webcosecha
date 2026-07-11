"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Entrada suave de cada ruta. SOLO opacity: NO usar transform/filter acá, porque este
 * div envuelve a toda la página y un transform/filter crearía un containing-block que
 * rompería los fondos 3D `position: fixed` (ambient/constelación/grano). El efecto
 * cinematográfico fuerte (wipe) vive en components/layout/route-transition.tsx.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
    >
      {children}
    </motion.div>
  )
}
