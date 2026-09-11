"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Tarjeta con foco que sigue al puntero.
 *
 * Vivía dentro de `diseno-web-client.tsx`; salió a su propio archivo cuando las
 * cuatro secciones de servicio se unificaron en una grilla de tarjetas y pasó a
 * usarse en dos lugares.
 *
 * Sobre la versión original (solo el degradado radial) agrega tres cosas: la
 * tarjeta se inclina en 3D hacia el cursor, el borde se enciende donde está el
 * puntero, y un brillo diagonal barre la superficie al entrar.
 *
 * Todo se escribe sobre `MotionValue`s y se compone con `useMotionTemplate`, así
 * que mover el mouse no dispara un solo render de React. La versión anterior
 * hacía `setState` en cada `mousemove` y volvía a renderizar toda la tarjeta,
 * hijos incluidos, sesenta veces por segundo.
 */
export function SpotlightFeatureCard({
  children,
  className,
  disabled,
  /** Color del foco y del borde. Por defecto, el rosa de la marca. */
  tint = "236,168,214",
}: {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  tint?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Posición del puntero dentro de la tarjeta, en porcentaje.
  const px = useMotionValue(50)
  const py = useMotionValue(50)
  const lift = useMotionValue(0)

  const spring = { stiffness: 260, damping: 26, mass: 0.5 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)
  const sLift = useSpring(lift, { stiffness: 200, damping: 24 })

  // 7° es el techo: más que eso y el texto de la tarjeta pierde nitidez.
  const rotateY = useTransform(sx, [0, 100], [-7, 7])
  const rotateX = useTransform(sy, [0, 100], [5.5, -5.5])
  const translateZ = useTransform(sLift, [0, 1], [0, 22])

  const glow = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgba(${tint},0.26), transparent 42%), radial-gradient(420px circle at ${sx}% ${sy}%, rgba(103,232,249,0.14), transparent 48%)`
  const rim = useMotionTemplate`radial-gradient(220px circle at ${sx}% ${sy}%, rgba(255,255,255,0.85), rgba(${tint},0.45) 35%, transparent 70%)`

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || disabled) return
    const r = el.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 100)
    py.set(((e.clientY - r.top) / r.height) * 100)
  }

  const reset = () => {
    px.set(50)
    py.set(50)
    lift.set(0)
  }

  return (
    <div className={cn("group relative h-full", disabled ? undefined : "[perspective:1200px]")}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => !disabled && lift.set(1)}
        onMouseLeave={reset}
        className={cn("relative h-full overflow-hidden rounded-2xl", className)}
        style={disabled ? undefined : { rotateX, rotateY, translateZ, transformStyle: "preserve-3d" }}
      >
        {/* Foco que sigue al cursor. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />

        {/* Borde encendido: el degradado se pinta en un anillo de 1px usando una
            máscara que recorta el relleno y deja solo el contorno. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: rim,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Barrido diagonal al entrar. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-y-8 -left-1/3 w-1/3 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[420%]"
        />

        {children}
      </motion.div>
    </div>
  )
}

export default SpotlightFeatureCard
