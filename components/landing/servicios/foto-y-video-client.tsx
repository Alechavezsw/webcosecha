"use client"

import Link from "next/link"
import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
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
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import InfiniteGallery from "@/components/ui/infinite-gallery"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"

const easePremium = [0.22, 1, 0.36, 1] as const

// Servicios organizados con hincapié en Cobertura de Eventos, Política, Fotoproducto y Edición.
const offerings = [
  {
    title: "Cobertura de Eventos",
    body: "Registro profesional y ágil de congresos corporativos, lanzamientos de marca, ferias y encuentros sociales en San Juan. Entrega express de resúmenes audiovisuales de alta calidad listos para redes.",
    icon: Camera,
    badge: "Especialidad Destacada",
    highlight: true,
  },
  {
    title: "Campaña & Comunicación Política",
    body: "Spots publicitarios de alto impacto persuasivo, cobertura audiovisual de recorridos de campaña, discursos y contenidos optimizados para candidatos e instituciones gubernamentales.",
    icon: Clapperboard,
    badge: "Campañas Electorales",
    highlight: true,
  },
  {
    title: "Fotoproducto & E-commerce",
    body: "Fotografía publicitaria de producto, marcas y gastronomía local. Iluminación y dirección de arte meticulosas orientadas a resaltar detalles, texturas y potenciar tus ventas online.",
    icon: ImageIcon,
    badge: "Fotografía de Producto",
    highlight: true,
  },
  {
    title: "Edición Avanzada & Post-producción",
    body: "Montaje con ritmo cinematográfico, corrección de color (color grading), diseño sonoro envolvente, motion graphics y adaptación fluida a todos los formatos digitales actuales.",
    icon: Megaphone,
    badge: "Post-producción & VFX",
    highlight: true,
  },
  {
    title: "Video Corporativo",
    body: "Spots de marca, documentales institucionales y video explicativo de procesos y servicios diseñado para consolidar tu posicionamiento y confiabilidad corporativa.",
    icon: Film,
    badge: "Cine Publicitario",
    highlight: false,
  },
  {
    title: "Reels & Contenido Vertical",
    body: "Contenido de ritmo ágil, transiciones magnéticas y guiones pensados para retener la atención desde el segundo cero en Reels, TikTok y YouTube Shorts.",
    icon: Sparkles,
    badge: "Social Media",
    highlight: false,
  },
] as const

// Colección completa de todas las 53 fotos categorizadas para el Portfolio Tradicional y el 3D
const galleryImages = [
  // Curated initial visual mix (first 20 images for maximum 3D and grid appeal)
  { src: "/fotografia/PSX_20230503_214434.jpg", alt: "Fotografía de moda y lifestyle en viñedos locales", category: "retrato" },
  { src: "/fotografia/PSX_20251018_083548.jpg", alt: "Discurso en panel empresarial", category: "eventos" },
  { src: "/fotografia/20250813_214643.jpg", alt: "Fotografía publicitaria de marca y producto gastronómico", category: "fotoproducto" },
  { src: "/fotografia/PSX_20240405_212950.jpg", alt: "Cobertura de prensa y autoridades gubernamentales", category: "politica" },
  { src: "/fotografia/DSC0026-1024x683.jpg", alt: "Retrato lifestyle al aire libre", category: "retrato" },
  { src: "/fotografia/cobertura-1.jpg", alt: "Cobertura corporativa Cosecha Creativa", category: "eventos" },
  { src: "/fotografia/484462772_3891899754458257_4815808110930233921_n.jpg", alt: "Fotografía de producto gourmet de exportación", category: "fotoproducto" },
  { src: "/fotografia/481503600_8905832596211180_3987812619903922815_n.jpg", alt: "Cobertura institucional y prensa oficial", category: "politica" },
  { src: "/fotografia/DSC0028-1024x683.jpg", alt: "Retrato artístico en luz natural", category: "retrato" },
  { src: "/fotografia/cobertura-2.jpg", alt: "Fotografía de eventos y oratoria profesional", category: "eventos" },
  { src: "/fotografia/484804592_3891899657791600_1948284077339391040_n.jpg", alt: "Composición fotográfica gastronómica premium", category: "fotoproducto" },
  { src: "/fotografia/PSX_20230503_214250.jpg", alt: "Campaña de cercanía y escucha vecinal - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/PSX_20230726_190136.jpg", alt: "Sesión fotográfica artística y retrato de estudio", category: "retrato" },
  { src: "/fotografia/PSX_20251018_083653.jpg", alt: "Público en evento corporativo", category: "eventos" },
  { src: "/fotografia/169ab5cefb6c89ea84509af222e52191_L.jpg", alt: "Dirección de arte en composición publicitaria y comercial", category: "fotoproducto" },
  { src: "/fotografia/481787531_8905832752877831_4501663938026490346_n.jpg", alt: "Discurso institucional e inauguraciones públicas", category: "politica" },
  { src: "/fotografia/DSC0039-1024x683.jpg", alt: "Sesión fotográfica de moda en exteriores", category: "retrato" },
  { src: "/fotografia/PSX_20251018_083745.jpg", alt: "Evento de Cosecha Creativa San Juan", category: "eventos" },
  { src: "/fotografia/DSC0117-1024x683.jpg", alt: "Fotografía publicitaria de producto y branding", category: "fotoproducto" },
  { src: "/fotografia/PSX_20251018_084451.jpg", alt: "Fotografía de prensa institucional y gobernación", category: "politica" },

  // Remaining visual items beautifully distributed
  { src: "/fotografia/DSC0071-683x1024.jpg", alt: "Retrato de estudio con iluminación suave", category: "retrato" },
  { src: "/fotografia/PSX_20251018_083852.jpg", alt: "Exposición en escenario con luces", category: "eventos" },
  { src: "/fotografia/DSC0132-1024x683.jpg", alt: "Detalle y textura en fotografía de producto", category: "fotoproducto" },
  { src: "/fotografia/PSX_20251018_084551.jpg", alt: "Panelistas en debate y mesa redonda comercial", category: "politica" },
  { src: "/fotografia/DSC0078-683x1024.jpg", alt: "Sesión conceptual de retrato y moda", category: "retrato" },
  { src: "/fotografia/PSX_20251018_083933.jpg", alt: "Conferencia y paneles de debate", category: "eventos" },
  { src: "/fotografia/PSX_20251018_084645.jpg", alt: "Registro oficial de conferencistas y autoridades", category: "politica" },
  { src: "/fotografia/484449896_3891899711124928_5801498566980876160_n.jpg", alt: "Dirección de arte y retrato conceptual en estudio", category: "retrato" },
  { src: "/fotografia/PSX_20251018_084018.jpg", alt: "Registro de networking empresarial", category: "eventos" },
  { src: "/fotografia/PSX_20251018_085001.jpg", alt: "Inauguración oficial y corte de cinta", category: "politica" },
  { src: "/fotografia/PSX_20251018_084108.jpg", alt: "Disertantes y oradores destacados", category: "eventos" },
  { src: "/fotografia/PSX_20251018_085209.jpg", alt: "Reunión institucional con directivos y gabinete", category: "politica" },
  { src: "/fotografia/PSX_20251018_084326.jpg", alt: "Público en seminario de negocios", category: "eventos" },
  { src: "/fotografia/PSX_20251018_085458.jpg", alt: "Cobertura de prensa oficial y comunicación de gobierno", category: "politica" },
  { src: "/fotografia/PSX_20251018_084735.jpg", alt: "Evento y catering corporativo", category: "eventos" },
  { src: "/fotografia/PSX_20230503_214333.jpg", alt: "Caminata y diálogo con vecinos en San Juan - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/PSX_20251018_085316.jpg", alt: "Presentación de marca y branding corporativo", category: "eventos" },
  { src: "/fotografia/PSX_20230503_215028.jpg", alt: "Encuentro y cercanía con la comunidad - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/PSX_20251018_085606.jpg", alt: "Cierre de convención y networking", category: "eventos" },
  { src: "/fotografia/PSX_20230504_201801.jpg", alt: "Cobertura de prensa institucional y congreso", category: "politica" },
  { src: "/fotografia/cobertura-3.jpg", alt: "Encuentro de innovación y networking", category: "eventos" },
  { src: "/fotografia/PSX_20230505_204217.jpg", alt: "Recorrido electoral y contacto directo - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/cobertura-4.jpg", alt: "Catering y ambientación en eventos", category: "eventos" },
  { src: "/fotografia/PSX_20230505_215057.jpg", alt: "Presentación de propuestas en San Juan - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/DSC0763-1024x683.jpg", alt: "Cobertura de evento social y corporativo", category: "eventos" },
  { src: "/fotografia/PSX_20230505_215352.jpg", alt: "Oratoria y discurso de campaña - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/DSC0772-1024x683.jpg", alt: "Detalle y ambientación de eventos en San Juan", category: "eventos" },
  { src: "/fotografia/PSX_20230525_125743.jpg", alt: "Diálogo institucional y apoyo vecinal - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/DSC0806-1024x683.jpg", alt: "Registro espontáneo y emociones en eventos", category: "eventos" },
  { src: "/fotografia/PSX_20230608_172804.jpg", alt: "Recorrido y escucha activa en San Juan - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/FB_IMG_1679691535741.jpg", alt: "Evento institucional Cosecha Creativa en San Juan", category: "eventos" },
  { src: "/fotografia/PSX_20230709_153506.jpg", alt: "Charla con comerciantes y pymes locales - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/PSX_20251018_084216.jpg", alt: "Saludo institucional y diplomático de autoridades en el estrado", category: "politica" },
]

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

// Colección de imágenes altamente optimizadas en resolución y peso (< 450 KB) exclusivas para la Galería 3D.
// Previene sobrecargas de VRAM en la GPU y caídas de contexto WebGL, asegurando renderizado instantáneo.
const optimized3DImages = [
  { src: "/fotografia/DSC0026-1024x683.jpg", alt: "Retrato lifestyle al aire libre", category: "retrato" },
  { src: "/fotografia/cobertura-1.jpg", alt: "Cobertura corporativa Cosecha Creativa", category: "eventos" },
  { src: "/fotografia/484462772_3891899754458257_4815808110930233921_n.jpg", alt: "Fotografía de producto gourmet de exportación", category: "fotoproducto" },
  { src: "/fotografia/PSX_20230503_214250.jpg", alt: "Campaña de cercanía y escucha vecinal - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/DSC0028-1024x683.jpg", alt: "Retrato artístico en luz natural", category: "retrato" },
  { src: "/fotografia/cobertura-2.jpg", alt: "Fotografía de eventos y oratoria profesional", category: "eventos" },
  { src: "/fotografia/484804592_3891899657791600_1948284077339391040_n.jpg", alt: "Composición fotográfica gastronómica premium", category: "fotoproducto" },
  { src: "/fotografia/PSX_20230505_215057.jpg", alt: "Presentación de propuestas en San Juan - Marcelo Orrego", category: "politica" },
  { src: "/fotografia/DSC0039-1024x683.jpg", alt: "Sesión fotográfica de moda en exteriores", category: "retrato" },
  { src: "/fotografia/cobertura-4.jpg", alt: "Catering y ambientación en eventos", category: "eventos" },
  { src: "/fotografia/DSC0117-1024x683.jpg", alt: "Fotografía publicitaria de producto y branding", category: "fotoproducto" },
  { src: "/fotografia/PSX_20230505_215352.jpg", alt: "Oratoria y discurso de campaña - Marcelo Orrego", category: "politica" }
];

export function FotoYVideoClient() {
  const reduce = useReducedMotion()

  /** Progreso de scroll de toda la página → barra superior (efecto de scroll coherente) */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  const waHref = getWhatsAppHref("Producción de Foto y Video")
  const WaContenidoHref = getWhatsAppHref("Servicios Audiovisuales y Fotográficos")

  // Filtros de la Galería Tradicional
  const [activeFilter, setActiveFilter] = useState<"todos" | "eventos" | "politica" | "fotoproducto" | "retrato">("todos")
  
  // Estado para el visualizador Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Cantidad de imágenes iniciales a mostrar (Load More)
  const [visibleImagesCount, setVisibleImagesCount] = useState(12)

  // Resetear la cantidad de imágenes cuando cambia el filtro
  useEffect(() => {
    setVisibleImagesCount(12)
  }, [activeFilter])

  // Filtrado de las imágenes en base a la categoría activa
  const filteredImages = useMemo(() => {
    if (activeFilter === "todos") return galleryImages
    return galleryImages.filter((img) => img.category === activeFilter)
  }, [activeFilter])

  // Subconjunto de imágenes actualmente visibles
  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleImagesCount)
  }, [filteredImages, visibleImagesCount])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const showPrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => {
        if (prev === null) return null
        return prev === 0 ? filteredImages.length - 1 : prev - 1
      })
    }
  }

  const showNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => {
        if (prev === null) return null
        return prev === filteredImages.length - 1 ? 0 : prev + 1
      })
    }
  }

  // Manejo de teclas para navegación de lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") showPrevImage()
      if (e.key === "ArrowRight") showNextImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, filteredImages])

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
        
        {/* Canvas de la galería interactiva en 3D con todas las fotos */}
        <div className="absolute inset-0 z-0">
          <InfiniteGallery
            images={optimized3DImages}
            speed={1.2}
            visibleCount={12}
            className="w-full h-full"
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

            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[#eca8d6] bg-[#eca8d6]/10 px-3 py-1 rounded-full uppercase border border-[#eca8d6]/10">
              <Sparkles className="size-2.5 animate-pulse" />
              {galleryImages.length} Obras en Portfolio
            </span>
          </div>

          {/* Rótulo Central en mix-blend-exclusion */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center text-center px-4 mix-blend-exclusion">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: easePremium }}
              className="flex flex-col items-center select-none"
            >
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8.5xl tracking-tight leading-none text-white select-none">
                <span className="font-light italic text-[#eca8d6]">cosechamos</span> <span className="font-extralight uppercase tracking-tighter">miradas</span>
              </h1>
              <p className="mt-4 font-mono text-[9px] sm:text-xs tracking-[0.35em] text-white/50 uppercase">
                Estilo 3D & Producción Visual
              </p>
            </motion.div>
          </div>

          {/* Inferior / Instrucciones y CTAs */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 pt-6 border-t border-white/5 pointer-events-auto">
            <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest">
              <MousePointerClick className="size-3.5 text-[#eca8d6] animate-pulse" />
              <span>Arrastrá o usá scroll para navegar en 3D</span>
            </div>

            <div className="flex items-center gap-4">
              <Button asChild size="sm" className="bg-[#eca8d6] text-black hover:bg-[#f0b8e0] rounded-full px-5 py-1 text-xs">
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="h-4 w-4 mr-1.5" />
                  Hablemos
                </a>
              </Button>
              <a href="#servicios" className="inline-flex items-center gap-1 font-mono text-[9px] text-zinc-500 hover:text-white transition-colors uppercase tracking-widest animate-pulse">
                <span>Ver servicios</span>
                <ChevronDown className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEGUNDO PLIEGUE: NUESTRO CATÁLOGO DE SERVICIOS EN PEQUEÑAS TARJETITAS */}
      <section id="servicios" className="relative py-24 md:py-32 bg-zinc-950/45">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs tracking-widest text-[#eca8d6] uppercase">SERVICIOS DE PRODUCCIÓN</span>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Nuestras Especialidades
            </h2>
            <p className="mt-4 text-zinc-400 text-base">
              Diseñamos soluciones audiovisuales y fotográficas a medida en San Juan. Hacemos especial foco en coberturas de eventos, spots políticos, fotografía de producto gourmet y post-producción avanzada.
            </p>
          </div>

          {/* Grilla de Pequeñas Tarjetitas de Servicio */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item, idx) => (
              <motion.article
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: easePremium }}
                className={`group relative rounded-xl border p-6 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col justify-between ${
                  item.highlight
                    ? "border-[#eca8d6]/30 bg-zinc-900/60 shadow-[0_4px_30px_rgba(236,168,214,0.03)]"
                    : "border-white/5 bg-zinc-900/20"
                } hover:border-[#eca8d6]/60 hover:bg-zinc-900/80`}
              >
                {/* Glow decorativo de fondo en tarjetas destacadas */}
                {item.highlight && (
                  <div className="absolute top-0 right-0 size-20 bg-[#eca8d6]/5 rounded-bl-full filter blur-lg transition-all group-hover:bg-[#eca8d6]/10" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
                      item.highlight
                        ? "bg-[#eca8d6]/10 border-[#eca8d6]/20 text-[#eca8d6] group-hover:bg-[#eca8d6] group-hover:text-black"
                        : "bg-white/5 border-white/10 text-zinc-400 group-hover:text-white"
                    }`}>
                      <item.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.highlight
                        ? "text-[#eca8d6] bg-[#eca8d6]/10 border border-[#eca8d6]/20"
                        : "text-zinc-500 bg-white/5"
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mb-2 font-display text-lg tracking-tight text-white group-hover:text-[#eca8d6] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {item.body}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500 group-hover:text-white transition-colors">
                  <span>Consultar por WhatsApp</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TERCER PLIEGUE: SHOWCASE AUDIOVISUAL PREMIUM (Video institucional generado) */}
      <section className="relative py-24 md:py-32 bg-black/45">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Producción de Reels
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <CustomVideoPlayer />
          </div>
        </div>
      </section>

      {/* CUARTO PLIEGUE: PORTFOLIO TRADICIONAL Y CATEGORIZADO (NO SOLO 3D) */}
      <section id="portfolio-galeria" className="relative py-24 md:py-32 bg-zinc-950/45">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#eca8d6] uppercase">PORTFOLIO DE TRABAJOS</span>
              <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
                Galería de Proyectos
              </h2>
              <p className="mt-4 text-zinc-400 max-w-xl text-sm sm:text-base">
                Explorá en detalle cada una de nuestras fotografías reales. Hacé clic sobre cualquier imagen para ampliarla en alta definición.
              </p>
            </div>

            {/* Pestañas de Filtro (Categorías) */}
            <div className="flex flex-wrap gap-2 font-mono text-xs border-b border-white/5 pb-2 md:pb-0 md:border-b-0">
              {[
                { id: "todos", label: "Todos" },
                { id: "eventos", label: "Eventos" },
                { id: "politica", label: "Política" },
                { id: "fotoproducto", label: "Fotoproducto" },
                { id: "retrato", label: "Retratos & Moda" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    activeFilter === tab.id
                      ? "bg-[#eca8d6] text-black border-[#eca8d6]"
                      : "bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grilla Asimétrica de Portfolio (Masonry Grid) */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {visibleImages.map((img) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: easePremium }}
                  className="break-inside-avoid relative group overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 cursor-pointer"
                  onClick={() => openLightbox(filteredImages.indexOf(img))}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay en hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#eca8d6] uppercase tracking-widest mb-1.5">
                      <ZoomIn className="size-3" />
                      <span>Ampliar Imagen</span>
                    </div>
                    <p className="text-xs text-white leading-tight font-medium drop-shadow-md">
                      {img.alt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Botón de Cargar Más (Load More) */}
          {filteredImages.length > visibleImagesCount && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={() => setVisibleImagesCount((prev) => prev + 12)}
                variant="outline"
                className="border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 rounded-full px-8 py-5 text-sm font-mono tracking-widest uppercase transition-all duration-300"
              >
                Cargar más proyectos
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* QUINTO PLIEGUE: CTA LLAMADA A LA ACCIÓN COMERCIAL */}
      <section className="relative bg-zinc-950/45 py-24 md:py-32 overflow-hidden">
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
              Contanos qué necesitás filmar o fotografiar. Te asesoramos en la planificación creativa, locación y armamos una propuesta adaptada a tus plazos y objetivos.
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

      {/* LIGHTBOX MODAL EN ALTA RESOLUCIÓN */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={closeLightbox}
          >
            {/* Botón de cerrar */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors z-50 pointer-events-auto"
            >
              <X className="size-6" />
            </button>

            {/* Botón previo */}
            <button
              onClick={showPrevImage}
              className="absolute left-4 p-3 rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors z-50 pointer-events-auto"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Contenido de la Imagen */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].alt}
                className="max-w-full max-h-[72vh] object-contain rounded-xl border border-white/10 shadow-2xl"
              />
              
              {/* Pie de foto en Lightbox */}
              <div className="mt-4 text-center px-4 max-w-lg">
                <p className="text-sm font-medium text-white">
                  {filteredImages[lightboxIndex].alt}
                </p>
                <span className="mt-1 inline-block font-mono text-[9px] uppercase tracking-widest text-[#eca8d6]">
                  Categoría: {filteredImages[lightboxIndex].category} ({lightboxIndex + 1} / {filteredImages.length})
                </span>
              </div>
            </motion.div>

            {/* Botón siguiente */}
            <button
              onClick={showNextImage}
              className="absolute right-4 p-3 rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors z-50 pointer-events-auto"
            >
              <ChevronRight className="size-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer corporativo */}
      <FooterSection />
    </main>
  )
}
