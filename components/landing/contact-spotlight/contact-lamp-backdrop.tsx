"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const VENTAS_EMAIL = "ventas@cosechacreativa.com.ar"

type Props = {
  isLightOn: boolean
  className?: string
}

/**
 * Efecto haz tipo «lamp» (conic + bloom), adaptado al alto del panel contacto
 * y colores de marca (#67e8f9 · #a78bfa · #eca8d6).
 */
export function ContactLampBackdrop({ isLightOn, className }: Props) {
  const beamEase = [0.22, 1, 0.36, 1] as const
  const beamDuration = 0.75

  return (
    <div
      className={cn(
        "relative flex min-h-[260px] w-full flex-col items-center overflow-hidden bg-black",
        className,
      )}
    >
      <div className="relative flex min-h-[220px] w-full flex-1 scale-y-110 items-center justify-center isolate">
        {/* Fondo al encender: profundidad + bruma de marca */}
        <motion.div
          initial={false}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          animate={{ opacity: isLightOn ? 1 : 0 }}
          transition={{ duration: 0.65, ease: beamEase }}
          style={{
            background: `
              radial-gradient(ellipse 100% 70% at 50% -8%, rgba(103,232,249,0.2) 0%, transparent 52%),
              radial-gradient(ellipse 70% 55% at 85% 100%, rgba(167,139,250,0.16) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 5% 85%, rgba(236,168,214,0.1) 0%, transparent 50%),
              linear-gradient(180deg, #05050a 0%, #0a0a12 35%, #030306 100%)
            `,
          }}
        />

        {/* Líneas: grilla + acentos horizontales (solo con luz) */}
        <motion.div
          initial={false}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          animate={{ opacity: isLightOn ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: beamEase }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(103,232,249,0.11) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167,139,250,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 55%, transparent 92%)",
          }}
        />
        <motion.div
          initial={false}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[45%] origin-bottom"
          animate={{ opacity: isLightOn ? 0.55 : 0 }}
          transition={{ duration: 0.65, ease: beamEase }}
          style={{
            transform: "perspective(420px) rotateX(58deg)",
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 47px,
                rgba(103,232,249,0.14) 47px,
                rgba(103,232,249,0.14) 48px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 21px,
                rgba(236,168,214,0.06) 21px,
                rgba(236,168,214,0.06) 22px
              )
            `,
            maskImage: "linear-gradient(to top, black 12%, transparent 78%)",
          }}
        />
        {/* Haz izquierdo */}
        <motion.div
          initial={false}
          animate={{
            opacity: isLightOn ? 1 : 0.42,
            width: isLightOn ? "26rem" : "13rem",
          }}
          transition={{ duration: beamDuration, ease: beamEase }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at 50% 0%, rgba(103,232,249,0.92) 0deg, rgba(167,139,250,0.38) 52deg, transparent 138deg)`,
          }}
          className="absolute inset-auto right-1/2 top-0 h-40 overflow-visible"
        >
          <div className="absolute bottom-0 left-0 z-20 h-32 w-full bg-black [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-28 bg-black [mask-image:linear-gradient(to_right,white,transparent)] sm:w-36" />
        </motion.div>

        {/* Haz derecho */}
        <motion.div
          initial={false}
          animate={{
            opacity: isLightOn ? 1 : 0.42,
            width: isLightOn ? "26rem" : "13rem",
          }}
          transition={{ duration: beamDuration, ease: beamEase }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at 50% 0%, transparent 0deg, rgba(236,168,214,0.32) 72deg, rgba(103,232,249,0.9) 188deg)`,
          }}
          className="absolute inset-auto left-1/2 top-0 h-40 overflow-visible"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-28 bg-black [mask-image:linear-gradient(to_left,white,transparent)] sm:w-36" />
          <div className="absolute bottom-0 right-0 z-20 h-32 w-full bg-black [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <div className="absolute top-1/2 z-10 h-36 w-full translate-y-6 scale-x-150 bg-black blur-2xl" />
        <div className="absolute inset-auto z-40 h-28 w-[min(28rem,88vw)] -translate-y-1/2 rounded-full bg-[#67e8f9]/45 blur-3xl" />
        <motion.div
          initial={false}
          animate={{ scaleX: isLightOn ? 1 : 0.5 }}
          transition={{ duration: beamDuration, ease: beamEase }}
          style={{ y: "-5.25rem" }}
          className="absolute inset-auto z-30 h-28 w-[14rem] max-w-[75vw] rounded-full bg-[#67e8f9]/80 blur-2xl"
        />
        <motion.div
          initial={false}
          animate={{ scaleX: isLightOn ? 1 : 0.5 }}
          transition={{ duration: beamDuration, ease: beamEase }}
          style={{ y: "-6.25rem" }}
          className="absolute inset-auto z-40 h-0.5 w-[26rem] max-w-[88vw] bg-gradient-to-r from-transparent via-[#67e8f9] to-transparent"
        />

        <div className="absolute inset-auto z-30 h-36 w-full -translate-y-[10rem] bg-black sm:-translate-y-[11rem]" />
      </div>

      <div className="relative z-50 -mt-24 flex flex-col items-center px-5 pb-4 pt-2 text-center sm:-mt-28">
        <motion.h2
          initial={{ opacity: 0.35, y: 24 }}
          animate={{
            opacity: isLightOn ? 1 : 0.25,
            y: isLightOn ? 0 : 14,
          }}
          transition={{ delay: 0.08, duration: 0.65, ease: "easeOut" }}
          className="max-w-lg bg-gradient-to-br from-[#f4f4f5] via-[#67e8f9] to-[#a78bfa] bg-clip-text py-2 font-display text-2xl font-medium tracking-tight text-transparent sm:text-3xl md:text-4xl"
        >
          Contacto
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isLightOn ? 1 : 0.2 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="mt-2 max-w-md text-sm text-[#e8e4dc]/95 sm:text-[15px]"
        >
          Escribinos cuando quieras.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isLightOn ? 0.78 : 0.15 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className="mt-3 break-all font-mono text-[11px] tracking-wide text-[#67e8f9]/85 sm:break-normal sm:text-xs"
        >
          {VENTAS_EMAIL}
        </motion.p>
      </div>
    </div>
  )
}
