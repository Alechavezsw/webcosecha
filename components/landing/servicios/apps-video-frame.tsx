"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInViewport } from "@/hooks/use-in-viewport"

/**
 * Monitor de video de /servicios/apps.
 *
 * Es la única pieza de la página con material filmado, así que en vez de
 * apoyarlo como un `<video>` a sangre lo montamos dentro de un bastidor: la
 * página se lee como instrumental técnico y un video sin marco rompía esa
 * lectura. El bastidor se inclina en 3D real según el scroll —la misma
 * profundidad del hero WebGL, resuelta acá con `transform`, que no cuesta
 * nada— y se endereza justo cuando queda centrado en pantalla.
 *
 * El clip se sirve optimizado desde `public/videos/apps-reel.*` (1280px, sin
 * pista de audio, ~1 MB por formato); el original de 1080p vive en
 * `public/ia/1/` y no se usa acá por peso.
 */

const INK = "#050506"
const SURFACE = "#0B0B0E"
const LINE = "#1E1E24"
const ACID = "#C8FF00"

const VIDEO_MP4 = "/videos/apps-reel.mp4"
const VIDEO_WEBM = "/videos/apps-reel.webm"
const VIDEO_POSTER = "/videos/apps-reel-poster.jpg"

/** Lecturas del riel inferior: mismo tono que los marcadores del hero. */
const READOUTS = [
  { k: "Render", v: "Tiempo real" },
  { k: "Módulo", v: "IA aplicada" },
  { k: "Salida", v: "Web · API" },
] as const

export function AppsVideoFrame({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref: viewRef, inView } = useInViewport<HTMLDivElement>("300px")
  const [playing, setPlaying] = useState(!reducedMotion)
  const [muted, setMuted] = useState(true)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 })

  // Entra inclinado hacia atrás, queda plano en el centro del viewport y se va
  // inclinando al revés: el bastidor «pasa» por la pantalla en vez de subir.
  const rotateX = useTransform(progress, [0, 0.5, 1], [13, 0, -9])
  const scale = useTransform(progress, [0, 0.5, 1], [0.94, 1, 0.96])
  const glow = useTransform(progress, [0, 0.5, 1], [0.18, 0.6, 0.2])

  /**
   * Reproduce solo mientras el bastidor está en pantalla. Decodificar 720p con
   * el video fuera de vista era CPU tirada a la basura mientras el visitante
   * scrollea el resto de la página.
   *
   * Algunos navegadores rechazan el primer `play()`, por eso se reintenta
   * cuando el elemento ya tiene datos.
   */
  useEffect(() => {
    if (reducedMotion) return
    const el = videoRef.current
    if (!el) return

    if (!inView) {
      el.pause()
      return
    }

    const tryPlay = () => {
      el.muted = true
      void el.play().catch(() => {})
    }
    el.addEventListener("loadeddata", tryPlay)
    el.addEventListener("canplay", tryPlay)
    tryPlay()
    return () => {
      el.removeEventListener("loadeddata", tryPlay)
      el.removeEventListener("canplay", tryPlay)
    }
  }, [reducedMotion, inView])

  const togglePlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }, [])

  const toggleMute = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }, [])

  return (
    <div ref={viewRef} className="relative">
      <div ref={sectionRef} className="relative">
      {/* Resplandor detrás del bastidor: la sección deja de ser un rectángulo
          negro sobre otro rectángulo negro. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[120%] -translate-y-1/2"
        style={{
          opacity: reducedMotion ? 0.35 : glow,
          background: `radial-gradient(60% 46% at 50% 50%, rgba(200,255,0,0.11), rgba(200,255,0,0.03) 45%, transparent 72%)`,
        }}
      />

      <div className={cn("relative", !reducedMotion && "[perspective:1600px]")}>
        <motion.div
          className="relative origin-[50%_120%] border"
          style={{
            borderColor: LINE,
            backgroundColor: SURFACE,
            ...(reducedMotion ? {} : { rotateX, scale, transformStyle: "preserve-3d" }),
          }}
        >
          {/* Esquinas en L: mismas marcas que el resto de los bloques. */}
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "left-0 bottom-0 border-l-2 border-b-2",
            "right-0 bottom-0 border-r-2 border-b-2",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={cn("pointer-events-none absolute z-20 size-4", pos)}
              style={{ borderColor: ACID }}
            />
          ))}

          {/* Chrome superior: rótulo del clip y estado. */}
          <div
            className="flex items-center gap-3 border-b px-4 py-3"
            style={{ borderColor: LINE, backgroundColor: INK }}
          >
            <span className="size-2 bg-white/25" aria-hidden />
            <span className="size-2 bg-white/25" aria-hidden />
            <span className="size-2" style={{ backgroundColor: ACID }} aria-hidden />
            <span className="ml-2 truncate font-mono text-[11px] tracking-wide text-white/40">
              reel · apps-reel.mp4
            </span>
            <span className="ml-auto hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/35 sm:flex">
              <span className="relative flex size-1.5">
                {!reducedMotion && (
                  <span
                    className="absolute inline-flex size-full animate-ping rounded-full opacity-70"
                    style={{ backgroundColor: ACID }}
                  />
                )}
                <span className="relative inline-flex size-1.5 rounded-full" style={{ backgroundColor: ACID }} />
              </span>
              1280 × 720 · loop
            </span>
          </div>

          {/* Pantalla. */}
          <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ backgroundColor: INK }}>
            {reducedMotion ? (
              <Image
                src={VIDEO_POSTER}
                alt="Fotograma del reel de sistemas y software a medida de Cosecha Creativa"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                className="absolute inset-0 size-full object-cover"
                poster={VIDEO_POSTER}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Reel de sistemas y software a medida de Cosecha Creativa"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                <source src={VIDEO_WEBM} type="video/webm" />
                <source src={VIDEO_MP4} type="video/mp4" />
              </video>
            )}

            {/* Retícula de encuadre + barrido: sostiene la lectura de monitor
                sin tapar la imagen. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(110% 80% at 50% 50%, transparent 45%, rgba(5,5,6,0.6) 100%)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-6 border md:inset-8"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-6 top-6 h-4 w-px md:left-8 md:top-8"
              style={{ backgroundColor: ACID }}
            />

            <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45 md:bottom-6 md:left-6">
              Cosecha Creativa · sistemas
            </span>

            {/* Controles. Autoplay silenciado por política del navegador; el
                clip además se exporta sin pista de audio, así que el botón de
                sonido queda solo como affordance del bastidor. */}
            {!reducedMotion && (
              <div className="absolute bottom-4 right-4 flex gap-px md:bottom-6 md:right-6">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pausar el reel" : "Reproducir el reel"}
                  className="flex size-9 items-center justify-center border text-white/70 backdrop-blur-sm transition-colors hover:text-white"
                  style={{ borderColor: LINE, backgroundColor: "rgba(5,5,6,0.72)" }}
                >
                  {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Activar sonido del reel" : "Silenciar el reel"}
                  className="flex size-9 items-center justify-center border text-white/70 backdrop-blur-sm transition-colors hover:text-white"
                  style={{ borderColor: LINE, backgroundColor: "rgba(5,5,6,0.72)" }}
                >
                  {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Riel inferior de lecturas. */}
          <dl
            className="grid grid-cols-3 gap-px border-t"
            style={{ borderColor: LINE, backgroundColor: LINE }}
          >
            {READOUTS.map((r) => (
              <div key={r.k} className="px-4 py-3" style={{ backgroundColor: INK }}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">{r.k}</dt>
                <dd className="mt-1 text-[13px] text-white/80 md:text-sm">{r.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AppsVideoFrame
