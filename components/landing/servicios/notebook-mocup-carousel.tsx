"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { MOCUP_CAROUSEL_IMAGES } from "@/lib/mocup-carousel-images"
import {
  sectionHairlineTop,
  sectionPyMain,
  useServiceSectionReveal,
} from "@/components/landing/servicios/service-section-motion"
import { cn } from "@/lib/utils"

const FALLBACK_SLIDES = ["/images/bridge.png", "/images/audit.jpg"] as const

/** Archivo en `public/videos/` (sin espacios en la URL). Mantenerlo igual que `Nueva carpeta/este.mp4` si actualizás el clip. */
const MOCKUP_SECTION_BG_VIDEO = "/videos/gestion-mockup-bg.mp4"

function MarqueeSlide({
  src,
  slidePx,
  priority,
}: {
  src: string
  slidePx: number
  priority: boolean
}) {
  return (
    <div
      className="relative h-full shrink-0 overflow-hidden bg-neutral-950"
      style={{
        width: slidePx,
        minWidth: slidePx,
        maxWidth: slidePx,
      }}
    >
      {/* Capa ambiental: mismo arte expandido + blur → rellena el marco sin bandas duras */}
      <Image
        src={src}
        alt=""
        fill
        sizes={`${slidePx}px`}
        className="pointer-events-none z-0 scale-125 object-cover object-center opacity-70 blur-2xl saturate-[1.12]"
        aria-hidden
      />
      {/* Pieza nítida al ratio del mockup (1080×1350) */}
      <Image
        src={src}
        alt=""
        fill
        sizes={`${slidePx}px`}
        className="z-[1] object-contain object-center"
        priority={priority}
      />
    </div>
  )
}

export function NotebookMocupCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [slidePx, setSlidePx] = useState(0)
  const [isFrozen, setIsFrozen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const revealMain = useServiceSectionReveal("main")

  // Scroll parallax para el fondo de video
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const videoY = useTransform(scrollYProgress, [0, 1], [-60, 60])
  const springConfig = { stiffness: 85, damping: 22, mass: 0.55 }
  const videoYSmooth = useSpring(videoY, springConfig)

  const listed = MOCUP_CAROUSEL_IMAGES.map((s) => s.trim()).filter(Boolean)
  const slides = listed.length >= 2 ? listed : [...FALLBACK_SLIDES]
  const loop = [...slides, ...slides]

  useEffect(() => {
    const el = screenRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const measure = () => {
      const w = el.clientWidth
      if (w > 0) setSlidePx(w)
    }

    measure()
    const id = requestAnimationFrame(() => requestAnimationFrame(measure))

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(id)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.load()
    const tryPlay = () => {
      void el.play().catch(() => {})
    }
    tryPlay()
    el.addEventListener("loadeddata", tryPlay)
    return () => el.removeEventListener("loadeddata", tryPlay)
  }, [])

  const slideCount = slides.length
  const marqueeSeconds = Math.min(320, Math.max(72, slideCount * 12))

  return (
    <motion.section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden bg-black/45",
        sectionPyMain,
      )}
      aria-label="Ejemplos de piezas para redes"
      {...revealMain}
    >
      <div className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden" aria-hidden>
        <motion.div
          style={prefersReducedMotion ? undefined : { y: videoYSmooth }}
          className="absolute -inset-x-0 -top-[12%] h-[124%] w-full"
        >
          <video
            ref={videoRef}
            src={MOCKUP_SECTION_BG_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-[center_38%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_38%,transparent_0%,rgba(0,0,0,0.45)_70%)]" />
      </div>

      {/* hairline removido: secciones unidas */}

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px] [perspective:1600px]">
          {/* Halo suave detrás del equipo */}
          <div
            className="pointer-events-none absolute -inset-16 z-0 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.14)_0%,rgba(59,130,246,0.08)_45%,transparent_72%)] blur-3xl motion-reduce:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-10 z-0 rounded-[35%] bg-[radial-gradient(ellipse_at_50%_80%,rgba(255,255,255,0.06)_0%,transparent_55%)] blur-2xl"
            aria-hidden
          />

          <motion.div
            className="relative z-10 mx-auto w-full origin-bottom transform-gpu cursor-pointer select-none rounded-t-[1.05rem] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/70 sm:rounded-t-[1.4rem] md:rounded-t-[1.55rem]"
            style={{ transform: "perspective(1200px) rotateX(6deg)" }}
            role="button"
            tabIndex={0}
            aria-pressed={isFrozen}
            aria-label={
              isFrozen ? "Reanudar animación del mockup" : "Pausar animación del mockup"
            }
            initial={false}
            animate={
              prefersReducedMotion === true
                ? undefined
                : isFrozen
                  ? { y: 0 }
                  : { y: [0, -5, 0] }
            }
            transition={
              prefersReducedMotion === true
                ? undefined
                : isFrozen
                  ? { duration: 0.28, ease: "easeOut" }
                  : { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            }
            onClick={() => setIsFrozen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setIsFrozen((v) => !v)
              }
            }}
          >
            <div
              className={cn(
                "rounded-t-[1.05rem] border px-2 pb-2 pt-2.5 transition-[background,box-shadow,border-color] duration-300 sm:rounded-t-[1.4rem] sm:px-3 sm:pb-3 sm:pt-3.5 md:rounded-t-[1.55rem] md:px-4 md:pb-3.5 md:pt-4",
                isFrozen
                  ? "border-cyan-400/40 bg-gradient-to-b from-cyan-700/70 via-slate-900 to-zinc-950 shadow-[0_0_1px_rgba(34,211,238,0.25),0_32px_90px_-28px_rgba(8,47,73,0.55),inset_0_1px_0_rgba(165,243,252,0.18)]"
                  : "border-white/18 bg-gradient-to-b from-zinc-500/90 via-zinc-800 to-zinc-950 shadow-[0_0_1px_rgba(255,255,255,0.12),0_32px_90px_-28px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.12)]",
              )}
            >
              <div className="mx-auto mb-2 flex justify-center sm:mb-2.5 md:mb-3">
                <div
                  className={cn(
                    "h-1 w-[52px] rounded-full bg-gradient-to-r ring-1 sm:h-1.5 sm:w-16 md:w-[72px]",
                    isFrozen
                      ? "from-cyan-950 via-black to-cyan-950 ring-cyan-400/35"
                      : "from-zinc-900 via-black to-zinc-900 ring-white/12",
                  )}
                  aria-hidden
                />
              </div>

              <div
                ref={screenRef}
                className="relative aspect-[1080/1350] w-full overflow-hidden rounded-[10px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_18px_48px_-12px_rgba(0,0,0,0.65),0_0_40px_-8px_rgba(96,165,250,0.12)] ring-1 ring-black/90 sm:rounded-xl md:rounded-[14px]"
              >
                {/* Brillo tipo vidrio en la pantalla */}
                <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-br from-white/[0.09] via-transparent to-transparent opacity-90" />
                <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/25 via-transparent to-black/15" />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[28%] bg-gradient-to-b from-white/[0.06] to-transparent" />

                <div className="absolute inset-0 overflow-hidden bg-neutral-950">
                  {slidePx > 0 ? (
                    <div
                      className="flex h-full w-max marquee gap-0"
                      style={{
                        animationDuration: `${marqueeSeconds}s`,
                        animationPlayState:
                          isFrozen || prefersReducedMotion ? "paused" : "running",
                      }}
                    >
                      {loop.map((src, i) => (
                        <MarqueeSlide key={`${src}-${i}`} src={src} slidePx={slidePx} priority={i < 2} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full w-full animate-pulse bg-gradient-to-br from-zinc-900 via-black to-zinc-950" aria-hidden />
                  )}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "relative z-0 mx-auto -mt-px h-5 max-w-[93%] rounded-b-xl border border-t-0 bg-gradient-to-b shadow-[0_16px_44px_-14px_rgba(0,0,0,0.92)] transition-[border-color,background] duration-300 sm:h-6 md:h-7 md:max-w-[91%]",
                isFrozen
                  ? "border-cyan-500/25 from-cyan-900/50 via-zinc-950 to-black"
                  : "border-white/14 from-zinc-700 via-zinc-900 to-black",
              )}
              style={{
                transform: "perspective(900px) rotateX(13deg)",
                transformOrigin: "top center",
              }}
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
