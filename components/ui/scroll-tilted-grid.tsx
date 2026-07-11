"use client"

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

const easeIntoFocus = cubicBezier(0.22, 1, 0.36, 1)
const easeOutOfFocus = cubicBezier(0, 0, 0.58, 1)
const focusEase: [typeof easeIntoFocus, typeof easeOutOfFocus] = [easeIntoFocus, easeOutOfFocus]

export type MaxWidthToken = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "none"

export type GapToken = 4 | 6 | 8 | 10 | 12 | 14

const MAX_WIDTH_CLASS: Record<MaxWidthToken, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  none: "",
}

const GAP_CLASS: Record<GapToken, string> = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  14: "gap-14",
}

type Side = "L" | "R"

type TileConfig = {
  aspectRatio: string
  perspective: number
  maxTilt: number
  maxBlur: number
  rounded: string
  containImages: boolean
}

function Tile({ src, side, config }: { src: string; side: Side; config: TileConfig }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const reduce = useReducedMotion()
  const sign = side === "L" ? -1 : 1
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded, containImages } = config
  const imageSrc = src.includes(" ") || src.includes("(") ? encodeURI(src) : src
  const imageClass = containImages
    ? "absolute inset-0 h-full w-full object-contain object-center p-2"
    : "absolute inset-0 h-full w-full object-cover"

  const blur = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur], { ease: focusEase })
  const opacity = useTransform(p, [0, 0.5, 1], [0.72, 1, 0.72], { ease: focusEase })

  const ty = useTransform(p, [0, 0.5, 1], ["100%", "0%", "-100%"], { ease: focusEase })
  const tz = useTransform(p, [0, 0.5, 1], [300, 0, 300], { ease: focusEase })
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt], { ease: focusEase })

  const tx = useTransform(p, [0, 0.5, 1], [`${sign * 40}%`, "0%", `${sign * 40}%`], {
    ease: focusEase,
  })
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 5, 0, sign * 5], { ease: focusEase })
  const sk = useTransform(p, [0, 0.5, 1], [sign * 20, 0, -sign * 20], { ease: focusEase })

  const innerSY = useTransform(p, [0, 0.5, 1], [1.45, 1, 1.45], { ease: focusEase })

  const filter = useMotionTemplate`blur(${blur}px)`

  if (reduce) {
    return (
      <figure ref={ref} className="relative z-10 m-0">
        <div
          className="relative w-full overflow-hidden bg-zinc-900"
          style={{ aspectRatio, borderRadius: rounded }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className={imageClass}
            loading="lazy"
            decoding="async"
          />
        </div>
      </figure>
    )
  }

  return (
    <motion.figure ref={ref} className="relative z-10 m-0" style={{ perspective, willChange: "transform" }}>
      <motion.div
        className="relative w-full overflow-hidden bg-zinc-900 will-change-[filter,transform]"
        style={{
          aspectRatio,
          borderRadius: rounded,
          filter,
          x: tx,
          y: ty,
          z: tz,
          rotate: rot,
          rotateX: rx,
          skewX: sk,
        }}
      >
        <motion.img
          src={imageSrc}
          alt=""
          className={`${imageClass} will-change-[opacity,transform]`}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{
            opacity,
            scaleY: innerSY,
            backfaceVisibility: "hidden",
          }}
        />
      </motion.div>
    </motion.figure>
  )
}

export type ScrollTiltedGridProps = {
  images?: readonly string[]
  loop?: boolean
  initialCycles?: number
  aspectRatio?: string
  maxWidth?: MaxWidthToken
  gap?: GapToken
  perspective?: number
  maxTilt?: number
  maxBlur?: number
  rounded?: string
  className?: string
  /** Muestra la imagen completa (útil para logofolios / páginas). */
  containImages?: boolean
}

export function ScrollTiltedGrid({
  images,
  loop = false,
  initialCycles = 3,
  aspectRatio = "3/4",
  maxWidth = "lg",
  gap = 10,
  perspective = 900,
  maxTilt = 70,
  maxBlur = 8,
  rounded = "0.375rem",
  className,
  containImages = false,
}: ScrollTiltedGridProps = {}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const sourceImages = images ?? []

  useEffect(() => {
    if (!loop) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCycles((c) => c + 2)
        }
      },
      { rootMargin: "1500px 0px 1500px 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [loop])

  const items = useMemo(
    () => (loop ? Array.from({ length: cycles }, () => sourceImages).flat() : [...sourceImages]),
    [loop, cycles, sourceImages],
  )

  const config = useMemo<TileConfig>(
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded, containImages }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded, containImages],
  )

  const gridClass = [
    "mx-auto mt-[20vh] mb-[10vh] grid w-full grid-cols-2 px-6 py-[20vh]",
    MAX_WIDTH_CLASS[maxWidth],
    GAP_CLASS[gap],
  ]
    .filter(Boolean)
    .join(" ")

  if (sourceImages.length === 0) return null

  return (
    <section className={["relative w-full", className].filter(Boolean).join(" ")}>
      <div className={gridClass}>
        {items.map((src, i) => (
          <Tile key={`${i}-${src}`} src={src} side={i % 2 === 0 ? "L" : "R"} config={config} />
        ))}
      </div>
      {loop ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : null}
    </section>
  )
}
