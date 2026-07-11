"use client"

import { useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const gradientText =
  "[box-decoration-break:clone] bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] bg-clip-text pb-[0.25em] pt-[0.2em] text-transparent"

/** Suaviza bordes sin capas oscuras encima del texto (evita letras “cortadas” visualmente). */
const edgeFadeMask = {
  maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
} as const

interface ParallaxTextProps {
  children: string
  baseVelocity: number
}

function ParallaxText({ children, baseVelocity }: ParallaxTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)
  const directionFactor = useRef(1)

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -1
    else if (velocityFactor.get() > 0) directionFactor.current = 1
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  if (prefersReducedMotion) {
    return (
      <div className="overflow-hidden px-4 py-4 sm:px-6" style={edgeFadeMask}>
        <p
          className={`font-display text-lg font-semibold uppercase leading-[1.5] tracking-tight md:text-2xl ${gradientText}`}
        >
          {children}
        </p>
      </div>
    )
  }

  return (
    <div
      className="overflow-x-hidden overflow-y-visible px-4 py-4 sm:px-6 md:py-5"
      style={edgeFadeMask}
    >
      <motion.div
        style={{ x }}
        className={`flex w-max flex-nowrap whitespace-nowrap font-display text-xl font-semibold uppercase leading-[1.5] tracking-wide will-change-transform md:text-3xl lg:text-4xl ${gradientText}`}
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="mr-10 inline-block shrink-0 pb-1 pt-1 md:mr-14 lg:mr-16">
            {children}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function BeneficiosParallaxMarquee({ lines }: { lines: readonly string[] }) {
  const triples = [
    lines.slice(0, 3).join(" · ") + " · ",
    lines.slice(3, 6).join(" · ") + " · ",
    lines.slice(6, 8).join(" · ") + " · ",
  ]
  /** Más lento que antes (~×3): lectura tranquila */
  const velocities: readonly number[] = [-3, 3, -2]

  return (
    <div
      className="relative my-10 overflow-hidden rounded-2xl border border-white/[0.09] bg-black/35 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:my-12 md:rounded-3xl md:py-6"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(103,232,249,0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(167,139,250,0.14) 1px, transparent 1px)
          `,
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" aria-hidden />

      <div className="relative space-y-0.5 md:space-y-1">
        {triples.map((text, i) => (
          <ParallaxText key={i} baseVelocity={velocities[i] ?? -4}>
            {text}
          </ParallaxText>
        ))}
      </div>
    </div>
  )
}
