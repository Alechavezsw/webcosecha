"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Camera,
  Clapperboard,
  Film,
  ImageIcon,
  Megaphone,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"

const easePremium = [0.22, 1, 0.36, 1] as const

/**
 * Derivado liviano de cada foto: `public/fotografia/lite/<nombre>.webp` (1100 px).
 * Los originales de `public/fotografia/` llegan a 17 MB por archivo y no se sirven nunca.
 */
function lite(src: string): string {
  const name = src.replace("/fotografia/", "").replace(/\.(jpe?g|png)$/i, "")
  return `/fotografia/lite/${name}.webp`
}

/** Seis frentes de producción, una línea cada uno, ilustrados con trabajo real. */
const offerings = [
  {
    title: "Cobertura de eventos",
    body: "Congresos, lanzamientos y ferias, con resumen listo para redes.",
    icon: Camera,
    image: "/fotografia/cobertura-1.jpg",
  },
  {
    title: "Comunicación política",
    body: "Spots, recorridos de campaña y discursos para candidatos e instituciones.",
    icon: Clapperboard,
    image: "/fotografia/PSX_20230503_214250.jpg",
  },
  {
    title: "Fotoproducto",
    body: "Producto, marca y gastronomía con luz y dirección de arte propias.",
    icon: ImageIcon,
    image: "/fotografia/484462772_3891899754458257_4815808110930233921_n.jpg",
  },
  {
    title: "Post-producción",
    body: "Montaje, color grading, sonido y motion graphics para cada formato.",
    icon: Megaphone,
    image: "/fotografia/PSX_20251018_083548.jpg",
  },
  {
    title: "Video corporativo",
    body: "Spots de marca, institucionales y video explicativo de procesos.",
    icon: Film,
    image: "/fotografia/cobertura-2.jpg",
  },
  {
    title: "Reels y vertical",
    body: "Ritmo ágil y guion pensado para retener desde el segundo cero.",
    icon: Sparkles,
    image: "/fotografia/DSC0026-1024x683.jpg",
  },
] as const


function CustomVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const duration = videoRef.current.duration
      if (duration) {
        setProgress((current / duration) * 100)
      }
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(parseFloat(e.target.value))
    }
  }

  const toggleFullscreen = () => {
    if (!playerRef.current) return
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const resetControlsTimeout = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500)
    } else {
      setShowControls(true)
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [isPlaying])

  return (
    <div
      ref={playerRef}
      className="group relative w-full max-w-[380px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_0_80px_rgba(236,168,214,0.08)] cursor-pointer"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src="/fotografia/video-cobertura.mp4"
        className="w-full h-full object-cover"
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Ambient glowing background synced with playing status */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

      {/* Large Glowing Center Button */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="size-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl relative group-hover:scale-110 transition-transform duration-300 pointer-events-auto" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
              <div className="absolute inset-0 rounded-full bg-[#eca8d6]/30 blur-xl animate-pulse" />
              <Play className="h-8 w-8 text-white fill-white ml-1 relative z-10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Control Bar (Glassmorphic) */}
      <div
        className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md transition-all duration-300 flex flex-col gap-3 z-20 pointer-events-auto ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="relative group/progress flex items-center h-2 w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden transition-all group-hover/progress:h-2">
            <div
              className="h-full bg-gradient-to-r from-[#eca8d6] to-[#d68ec3] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 rounded-full bg-white shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <span className="text-xs font-mono text-zinc-400">
              {videoRef.current ? (
                `${Math.floor(videoRef.current.currentTime / 60)}:${String(Math.floor(videoRef.current.currentTime % 60)).padStart(2, '0')} / ${Math.floor(videoRef.current.duration / 60) || 0}:${String(Math.floor(videoRef.current.duration % 60) || 0).padStart(2, '0')}`
              ) : '0:00 / 0:00'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Se muestran junto al hero para dar contexto sin texto largo. */
const HERO_TAGS = ["Eventos", "Política", "Fotoproducto", "Retrato", "Reels"] as const

/** Tres columnas de fotos reales para el mosaico del hero, mezclando categorías. */
const HERO_MOSAIC: string[][] = [
  [
    "/fotografia/cobertura-1.jpg",
    "/fotografia/484462772_3891899754458257_4815808110930233921_n.jpg",
    "/fotografia/DSC0071-683x1024.jpg",
    "/fotografia/PSX_20251018_084108.jpg",
    "/fotografia/DSC0132-1024x683.jpg",
  ],
  [
    "/fotografia/PSX_20230503_214250.jpg",
    "/fotografia/DSC0026-1024x683.jpg",
    "/fotografia/PSX_20251018_085001.jpg",
    "/fotografia/484804592_3891899657791600_1948284077339391040_n.jpg",
    "/fotografia/DSC0078-683x1024.jpg",
  ],
  [
    "/fotografia/PSX_20251018_083548.jpg",
    "/fotografia/DSC0039-1024x683.jpg",
    "/fotografia/cobertura-4.jpg",
    "/fotografia/DSC0117-1024x683.jpg",
    "/fotografia/PSX_20230503_214434.jpg",
  ],
].map((col) => col.map(lite))

/** Columna del mosaico: se desplaza sola y se duplica para que el loop no corte. */
function MosaicColumn({
  images,
  direction,
  duration,
  reduce,
}: {
  images: string[]
  direction: "up" | "down"
  duration: number
  reduce: boolean | null
}) {
  const loop = [...images, ...images]

  return (
    <motion.div
      className="flex flex-col gap-3"
      animate={reduce ? undefined : { y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {loop.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        >
          <img
            src={src}
            alt=""
            loading={i < 3 ? "eager" : "lazy"}
            decoding="async"
            className="block w-full object-cover opacity-85"
          />
        </div>
      ))}
    </motion.div>
  )
}

export function FotoYVideoClient() {
  const reduce = useReducedMotion()

  /** Progreso de scroll de toda la página → barra superior (efecto de scroll coherente) */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  const waHref = getWhatsAppHref("Producción de Foto y Video")
  const WaContenidoHref = getWhatsAppHref("Servicios Audiovisuales y Fotográficos")

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#eca8d6]/30 selection:text-white">
      {/* Barra de navegación de la agencia */}
      <Navigation />

      {/* Constelación 3D en paleta cálida (rosa/durazno) — lee como bokeh fotográfico,
          unifica las secciones en un mismo espacio (coherente con las otras de servicios). */}
      <TechConstellation
        paletteHex={[0xeca8d6, 0xf7b8d8, 0xffd2a8, 0xc9a0ff, 0xfdeef5]}
        dustColorHex={0xf0c8dc}
        fogColorHex={0x07040a}
      />

      {/* Barra de progreso de scroll — efecto de scroll coherente */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#eca8d6] via-[#f7b8d8] to-[#ffd2a8] shadow-[0_0_12px_rgba(236,168,214,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      {/* PRIMER PLIEGUE: GALERÍA INTERACTIVA 3D A PANTALLA COMPLETA */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        
        {/* Mosaico de fotos reales: tres columnas que se desplazan solas */}
        <div
          className="absolute inset-y-0 right-0 z-0 w-full overflow-hidden lg:w-[58%] [mask-image:linear-gradient(to_right,transparent_0%,black_26%,black_100%)]"
          aria-hidden
        >
          <div className="grid h-full grid-cols-3 gap-3 px-3">
            <MosaicColumn images={HERO_MOSAIC[0]} direction="up" duration={54} reduce={reduce} />
            <div className="-mt-16">
              <MosaicColumn images={HERO_MOSAIC[1]} direction="down" duration={64} reduce={reduce} />
            </div>
            <MosaicColumn images={HERO_MOSAIC[2]} direction="up" duration={46} reduce={reduce} />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,2,8,0.9)_0%,transparent_18%,transparent_82%,rgba(4,2,8,0.95)_100%)]"
            aria-hidden
          />
        </div>

        {/* Rótulo Central y Textos Flotantes (pointer-events-none para habilitar interacción 3D) */}
        <div className="relative z-25 mx-auto w-full h-full max-w-[1400px] px-6 lg:px-12 flex flex-col justify-between pt-32 pb-12 pointer-events-none">
          
          {/* Superior */}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easePremium }}
            >
              <Link
                href="/#soluciones"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
                Volver a soluciones
              </Link>
            </motion.div>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#eca8d6]/10 bg-[#eca8d6]/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#eca8d6]">
              <Sparkles className="size-2.5" />
              Equipo propio en San Juan
            </span>
          </div>

          {/* Bloque principal: legible sobre el 3D gracias a un scrim propio */}
          <div className="absolute inset-0 z-10 flex items-center px-6 lg:px-12 pointer-events-none">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(4,2,8,0.96)_0%,rgba(4,2,8,0.9)_30%,rgba(4,2,8,0.35)_48%,transparent_66%)] lg:w-[62%]"
              aria-hidden
            />
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium }}
              className="relative mx-auto flex w-full max-w-[1400px] flex-col items-start pointer-events-auto lg:max-w-[1400px]"
            >
              <span className="mb-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-[#eca8d6]/90 sm:text-sm">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#eca8d6]/60" />
                Foto y video · San Juan
              </span>

              <h1 className="font-display text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.92] tracking-tight text-white">
                Cosechamos
                <span className="mt-1 block bg-gradient-to-r from-[#eca8d6] via-[#f7b8d8] to-[#ffd2a8] bg-clip-text text-transparent">
                  miradas
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
                Fotografía y producción audiovisual para marcas, eventos e instituciones. Del registro
                a la entrega, listo para publicar.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {HERO_TAGS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/12 bg-black/45 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 backdrop-blur-sm transition-colors hover:border-[#eca8d6]/40 hover:text-white sm:text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="sm"
                  className="h-11 gap-2 rounded-full bg-[#eca8d6] px-6 text-[13px] font-semibold text-black transition-all duration-300 hover:bg-[#f2c4e2] hover:shadow-[0_14px_36px_-14px_rgba(236,168,214,0.7)]"
                >
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    <WhatsAppMark className="size-[17px] shrink-0 text-black" />
                    Pedir presupuesto
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="group h-11 gap-2 rounded-full border-white/25 bg-transparent px-6 text-[13px] font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/[0.06] hover:text-white"
                >
                  <a href="#servicios">
                    Ver qué producimos
                    <ChevronDown className="size-3.5 shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Inferior / Pista de interacción con el 3D */}
          <div className="relative z-20 flex w-full items-center justify-between gap-4 border-t border-white/5 pt-6 pointer-events-auto">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-zinc-400 sm:text-[10px]">
              <MousePointerClick className="size-3.5 text-[#eca8d6]" />
              <span>Trabajos reales del estudio en San Juan</span>
            </div>

            <a
              href="#servicios"
              className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
            >
              <span>Ver servicios</span>
              <ChevronDown className="size-3" />
            </a>
          </div>
        </div>
      </section>

      {/* SEGUNDO PLIEGUE: NUESTRO CATÁLOGO DE SERVICIOS EN PEQUEÑAS TARJETITAS */}
      <section id="servicios" className="relative bg-zinc-950/45 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#eca8d6]">
              Servicios de producción
            </span>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Qué producimos
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Seis frentes de trabajo, todos con equipo propio y entrega lista para publicar.
            </p>
          </div>

          {/* Cada especialidad con una foto real del estudio detrás */}
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {offerings.map((item, idx) => (
              <motion.article
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: easePremium }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 transition-colors duration-500 hover:border-[#eca8d6]/45"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={lite(item.image)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07040a] via-[#07040a]/45 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl border border-[#eca8d6]/40 bg-[#eca8d6]/15 backdrop-blur-md">
                    <item.icon className="size-[18px] text-[#eca8d6]" strokeWidth={1.5} aria-hidden />
                  </span>
                </div>

                <div className="relative -mt-8 p-5 sm:p-6">
                  <h3 className="font-display text-xl tracking-tight text-white transition-colors group-hover:text-[#eca8d6] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-zinc-400">{item.body}</p>
                </div>

                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#eca8d6] via-[#ffd2a8] to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  aria-hidden
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TERCER PLIEGUE: SHOWCASE AUDIOVISUAL PREMIUM (Video institucional generado) */}
      <section className="relative overflow-hidden bg-black/45 py-16 md:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_75%_45%,rgba(236,168,214,0.1)_0%,transparent_62%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: easePremium }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[#eca8d6]">
              Contenido vertical
            </span>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Producción de reels
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Guion, rodaje y montaje pensados para el formato vertical. Gancho en los primeros
              segundos y cierre con una acción clara.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Guion y storyboard antes de filmar",
                "Rodaje con equipo e iluminación propios",
                "Montaje, color y sonido en post",
                "Entrega en 9:16, 1:1 y 16:9",
              ].map((linea) => (
                <li key={linea} className="flex items-start gap-3 text-[0.95rem] text-zinc-300">
                  <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#eca8d6]" aria-hidden />
                  {linea}
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="sm"
              className="mt-9 h-11 gap-2 rounded-full bg-[#eca8d6] px-6 text-[13px] font-semibold text-black transition-all duration-300 hover:bg-[#f2c4e2]"
            >
              <a href={WaContenidoHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="size-[17px] shrink-0 text-black" />
                Quiero mis reels
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.08, ease: easePremium }}
            className="mx-auto w-full max-w-[420px] lg:max-w-none"
          >
            <CustomVideoPlayer />
          </motion.div>
        </div>
      </section>

      {/* QUINTO PLIEGUE: CTA LLAMADA A LA ACCIÓN COMERCIAL */}
      <section className="relative overflow-hidden bg-zinc-950/45 py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#eca8d6]/5 blur-3xl filter animate-pulse" />
        </div>

        <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12 relative z-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easePremium }}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            <span className="font-mono text-xs tracking-widest text-[#eca8d6] uppercase">¿HACEMOS CLIC?</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white">
              ¿Tenés un proyecto para tu marca?
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base">
              Contanos qué necesitás filmar o fotografiar y armamos una propuesta a medida.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2 bg-[#eca8d6] text-black hover:bg-[#f0b8e0] rounded-full px-8 h-14 text-base shadow-[0_10px_30px_rgba(236,168,214,0.15)] transition-all">
                <a href={WaContenidoHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="h-5 w-5" />
                  Producir mi contenido
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 rounded-full px-8 h-14 text-base">
                <Link href="/contacto">
                  Agendar reunión virtual
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer corporativo */}
      <FooterSection />
    </main>
  )
}
