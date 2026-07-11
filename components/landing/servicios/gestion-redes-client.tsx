"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  HeartHandshake,
  ListChecks,
  PenLine,
  Sparkles,
  Timer,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"
import { NotebookMocupCarousel } from "@/components/landing/servicios/notebook-mocup-carousel"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import {
  sectionHairlineTop,
  sectionPyCompact,
  sectionPyMain,
} from "@/components/landing/servicios/service-section-motion"

const ORIGINAL_URL =
  "https://cosechacreativa.com.ar/servicio-de-gestion-de-redes-sociales/" as const

/** Archivos probados en orden (colocá el clip en `public/videos/` o en `public/`). */
const MOCKUP_VIDEO_SOURCES = [
  "/videos/0503.mp4",
  "/videos/0503.webm",
  "/videos/0503.mov",
  "/0503.mp4",
  "/0503.webm",
] as const

const VIDEO_POSTER = "/images/bridge.png"

/** Misma imagen que la sección «Método de trabajo» del home. */
const QUE_INCLUYE_BG_SRC = "/Gemini_Generated_Image_hodiophodiophodi.jpg"

/** Fondo inmersivo «Beneficios» — colocá el .jpg en `public/`. */
const BENEFICIOS_BG_SRC = "/Gemini_Generated_Image_txjgz6txjgz6txjg.jpg"

/** Colocá la imagen en `public/images/` (whale.png / whale.jpg / whale.webp). */
const WHALE_BENTO_BG_SRC = "/images/whale.png"

/** Fondo inmersivo de la cita — `public/images/audit.jpg` */
const CITA_AUDIT_BG_SRC = "/images/audit.jpg"

const HERO_BG_VIDEO_BASE = "continue_with_a_lot_of_202605020801"
const HERO_BG_VIDEO_SOURCES = [
  `/videos/${HERO_BG_VIDEO_BASE}.mp4`,
  `/videos/${HERO_BG_VIDEO_BASE}.webm`,
  `/videos/${HERO_BG_VIDEO_BASE}.mov`,
  `/${HERO_BG_VIDEO_BASE}.mp4`,
  `/${HERO_BG_VIDEO_BASE}.webm`,
] as const

const easePremium = [0.22, 1, 0.36, 1] as const

const heroItemVariants = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easePremium },
  },
} as const

const includes = [
  {
    n: "01",
    title: "Estrategias personalizadas",
    body: "Planes adaptados a tu negocio y al contexto del mercado en San Juan.",
    icon: Sparkles,
  },
  {
    n: "02",
    title: "Creación de contenido",
    body: "Textos, piezas visuales y formatos que reflejan la voz de tu marca.",
    icon: PenLine,
  },
  {
    n: "03",
    title: "Planificación mensual",
    body: "Calendario editorial claro para publicar con constancia y sentido.",
    icon: ListChecks,
  },
  {
    n: "04",
    title: "Interacción comunitaria",
    body: "Respuesta a comentarios y mensajes para acercarte a quienes te siguen.",
    icon: HeartHandshake,
  },
  {
    n: "05",
    title: "Análisis y reportes",
    body: "Métricas y lecturas accionables para afinar la estrategia mes a mes.",
    icon: BarChart3,
  },
] as const

const benefits = [
  {
    title: "Conexión local",
    body: "Contenido pensado para la audiencia sanjuanina y tu rubro.",
    icon: HeartHandshake,
  },
  {
    title: "Ahorro de tiempo",
    body: "Delegás la operación diaria de redes y te enfocás en tu negocio.",
    icon: Timer,
  },
  {
    title: "Resultados medibles",
    body: "Seguimiento de alcance, interacción y conversiones con criterio.",
    icon: BarChart3,
  },
] as const

const itemStaggerVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: easePremium,
    },
  },
}

interface HeroBackgroundVideoProps {
  scrollYProgress: motion.MotionValue<number>
}

function HeroBackgroundVideo({ scrollYProgress }: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

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
  }, [])

  // Parallax suave y desvanecimiento al ecrolear hacia abajo
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.95, 0.3])

  return (
    <motion.div
      style={{ y, opacity }}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={VIDEO_POSTER}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_58%] opacity-50"
      />
      <video
        ref={videoRef}
        className="absolute inset-0 z-[1] h-full min-h-full w-full min-w-full scale-[1.06] object-cover object-center opacity-95"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster={VIDEO_POSTER}
      >
        {HERO_BG_VIDEO_SOURCES.map((src) => (
          <source
            key={src}
            src={src}
            type={
              src.endsWith(".webm")
                ? "video/webm"
                : src.endsWith(".mov")
                  ? "video/quicktime"
                  : "video/mp4"
            }
          />
        ))}
      </video>
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/75 via-black/55 to-black/90" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/85 via-black/35 to-black/65" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(236,168,214,0.14)_0%,transparent_50%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_55%_45%_at_85%_100%,rgba(103,232,249,0.08)_0%,transparent_50%)]" />
    </motion.div>
  )
}

interface RedesPhoneMockupProps {
  scrollYProgress: motion.MotionValue<number>
}

function RedesPhoneMockup({ scrollYProgress }: RedesPhoneMockupProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const tryPlay = () => {
      el.muted = true
      void el.play().catch(() => {})
    }

    el.addEventListener("loadeddata", tryPlay)
    el.addEventListener("canplay", tryPlay)
    tryPlay()

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryPlay()
      },
      { threshold: 0.12 }
    )
    obs.observe(el)

    return () => {
      el.removeEventListener("loadeddata", tryPlay)
      el.removeEventListener("canplay", tryPlay)
      obs.disconnect()
    }
  }, [])

  // Animaciones físicas fluidas vinculadas directamente al progreso del scroll
  const springConfig = { stiffness: 90, damping: 20, mass: 0.6 }
  const phoneY = useTransform(scrollYProgress, [0, 0.45, 1], [80, 0, -80])
  const phoneRotate = useTransform(scrollYProgress, [0, 0.45, 1], [-8, 0, 4])
  const phoneScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.92, 1, 0.95])

  const smoothY = useSpring(phoneY, springConfig)
  const smoothRotate = useSpring(phoneRotate, springConfig)
  const smoothScale = useSpring(phoneScale, springConfig)

  return (
    <motion.div
      style={{
        y: smoothY,
        rotate: smoothRotate,
        scale: smoothScale,
      }}
      className="relative mx-auto w-full max-w-[min(100%,300px)] shrink-0"
    >
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3.5rem] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(236,168,214,0.35), transparent 62%), radial-gradient(ellipse 50% 45% at 70% 90%, rgba(103,232,249,0.2), transparent 55%)",
        }}
      />

      <div className="relative rounded-[2.85rem] border border-white/[0.14] bg-gradient-to-b from-zinc-700/90 via-zinc-900 to-zinc-950 p-[11px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="absolute left-1/2 top-[13px] z-20 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black/90 ring-1 ring-white/[0.06]" aria-hidden />

        <div className="relative aspect-[9/19.4] min-h-[280px] w-full overflow-hidden rounded-[2.15rem] bg-black ring-1 ring-black/80">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            poster={VIDEO_POSTER}
            aria-label="Vista previa en celular"
          >
            {MOCKUP_VIDEO_SOURCES.map((src) => (
              <source
                key={src}
                src={src}
                type={
                  src.endsWith(".webm")
                    ? "video/webm"
                    : src.endsWith(".mov")
                      ? "video/quicktime"
                      : "video/mp4"
                }
              />
            ))}
          </video>

          {/* Destello/brillo de vidrio diagonal premium en la pantalla celular */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
            <motion.div
              className="absolute -inset-x-20 -top-40 h-[200%] w-[35%] rotate-[25deg] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
              animate={{
                x: ["-120%", "220%"],
              }}
              transition={{
                duration: 4.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-[10px] left-1/2 z-20 h-[4px] w-[92px] -translate-x-1/2 rounded-full bg-white/[0.22]"
          aria-hidden
        />
      </div>
    </motion.div>
  )
}

/** Partículas flotantes orgánicas mágicas (luciérnagas muy visibles) */
function FloatingAmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {Array.from({ length: 22 }).map((_, idx) => {
        const delay = idx * 0.8
        const duration = 10 + (idx % 4) * 3
        const size = 4 + (idx % 3) * 2.5
        const color = idx % 2 === 0 ? "rgba(34, 211, 238, 0.45)" : "rgba(236, 168, 214, 0.45)"
        
        return (
          <motion.div
            key={idx}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 4}px ${color}, 0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`,
              top: `${10 + (idx * 7.5) % 80}%`,
              left: `${5 + (idx * 8.5) % 90}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 35, 0],
              scale: [0.6, 1.3, 0.6],
              opacity: [0.2, 0.95, 0.2],
            }}
            transition={{
              duration: duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: delay,
            }}
          />
        )
      })}
    </div>
  )
}

interface BentoCardProps {
  item: typeof includes[number]
}

function BentoCard({ item }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Motion values para el cursor
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)

  // Spring physics para rotación 3D fluida y elástica al pasar el cursor (rango más amplio y visible)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 100, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 100, damping: 18 })
  
  // Resorte de escala para que la tarjeta crezca sutilmente en hover
  const hoverScale = useSpring(1, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    
    // Normalizar mouse de -0.5 a 0.5
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)

    // Posición del Spotlight de luz
    spotlightX.set(e.clientX - rect.left)
    spotlightY.set(e.clientY - rect.top)
    hoverScale.set(1.028) // Crece de forma interactiva
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    hoverScale.set(1) // Vuelve a escala normal
  }

  // Reflejo radial interactivo de luz que sigue al cursor (brillante y con mayor radio)
  const spotlightBg = useMotionTemplate`radial-gradient(ellipse 260px 260px at ${spotlightX}px ${spotlightY}px, rgba(34, 211, 238, 0.28) 0%, rgba(167, 139, 250, 0.16) 45%, transparent 100%)`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={itemStaggerVariants}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        scale: hoverScale,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/18 bg-black/45 p-8 shadow-[0_12px_40px_-20px_rgba(0,30,60,0.55)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(34, 211, 238, 0.22)]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      <div className="relative z-10 pointer-events-none">
        <span className="font-mono text-sm text-white/35">{item.n}</span>
        <item.icon
          className="mb-5 mt-4 size-10 text-cyan-300 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          strokeWidth={1.15}
          aria-hidden
        />
        <h3 className="font-display text-2xl tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-cyan-100">
          {item.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-white/80">
          {item.body}
        </p>
      </div>
    </motion.div>
  )
}

function BenefitCard({ b }: { b: typeof benefits[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 100, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 18 })
  const hoverScale = useSpring(1, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
    spotlightX.set(e.clientX - rect.left)
    spotlightY.set(e.clientY - rect.top)
    hoverScale.set(1.028)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    hoverScale.set(1)
  }

  const spotlightBg = useMotionTemplate`radial-gradient(ellipse 240px 240px at ${spotlightX}px ${spotlightY}px, rgba(167, 139, 250, 0.28) 0%, rgba(236, 168, 214, 0.16) 45%, transparent 100%)`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={itemStaggerVariants}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        scale: hoverScale,
      }}
      className="group relative rounded-2xl border border-white/18 bg-black/40 p-8 shadow-[0_16px_48px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_20px_50px_rgba(167, 139, 250, 0.22)]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      <div className="relative z-10 pointer-events-none">
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#a78bfa]/15 to-transparent shadow-inner">
          <b.icon className="size-6 text-[#c4b5fd]/95 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:text-[#e9d5ff]" strokeWidth={1.2} aria-hidden />
        </div>
        <h3 className="font-display text-xl tracking-tight text-white md:text-2xl transition-colors duration-300 group-hover:text-[#e9d5ff]">{b.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base transition-colors duration-300 group-hover:text-white/85">{b.body}</p>
      </div>
    </motion.div>
  )
}

export function GestionRedesClient() {
  const prefersReducedMotion = useReducedMotion()

  /** Progreso de scroll de toda la página → barra superior (efecto de scroll coherente) */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  // Referencias para useScroll
  const heroRef = useRef<HTMLElement>(null)
  const queIncluyeRef = useRef<HTMLElement>(null)
  const beneficiosRef = useRef<HTMLElement>(null)
  const citaRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  // Configuración de resortes (springs) compartida para parallax
  const springConfig = { stiffness: 85, damping: 22, mass: 0.55 }

  // 1. Scroll de Hero
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroContentY = useTransform(heroScroll, [0, 1], [0, -90])
  const heroContentOpacity = useTransform(heroScroll, [0, 0.75], [1, 0])

  // 2. Scroll de Qué Incluye
  const { scrollYProgress: queIncluyeScroll } = useScroll({
    target: queIncluyeRef,
    offset: ["start end", "end start"],
  })
  const queIncluyeBgY = useTransform(queIncluyeScroll, [0, 1], [-55, 55])
  const queIncluyeBgYSmooth = useSpring(queIncluyeBgY, springConfig)

  const bentoBgY = useTransform(queIncluyeScroll, [0, 1], [-85, 85])
  const bentoBgYSmooth = useSpring(bentoBgY, springConfig)

  // 3. Scroll de Beneficios
  const { scrollYProgress: beneficiosScroll } = useScroll({
    target: beneficiosRef,
    offset: ["start end", "end start"],
  })
  const beneficiosBgY = useTransform(beneficiosScroll, [0, 1], [-65, 65])
  const beneficiosBgYSmooth = useSpring(beneficiosBgY, springConfig)

  // 4. Scroll de Cita
  const { scrollYProgress: citaScroll } = useScroll({
    target: citaRef,
    offset: ["start end", "end start"],
  })
  const citaBgY = useTransform(citaScroll, [0, 1], [-50, 50])
  const citaBgYSmooth = useSpring(citaBgY, springConfig)

  // 5. Scroll de CTA
  const { scrollYProgress: ctaScroll } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  })
  const ctaBgY = useTransform(ctaScroll, [0, 1], [-30, 30])
  const ctaBgYSmooth = useSpring(ctaBgY, springConfig)

  // Orquestación en Cascada (Stagger) de los contenedores
  const sectionStaggerVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.992 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: easePremium,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const heroContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.11,
        delayChildren: 0.08,
      },
    },
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />

      {/* Constelación de datos 3D detrás de TODA la página — unifica las secciones en
          un mismo espacio continuo (misma capa que ia/apps/seo → coherencia). */}
      <TechConstellation />

      {/* Barra de progreso de scroll — efecto de scroll coherente, paleta tech */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] shadow-[0_0_12px_rgba(103,232,249,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      {/* Hero — video de fondo + scrims (misma línea visual que el home) */}
      <section ref={heroRef} className="relative min-h-[min(92vh,900px)] overflow-hidden pt-24 md:pt-28">
        <HeroBackgroundVideo scrollYProgress={heroScroll} />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="show"
          style={{ y: heroContentY, opacity: heroContentOpacity }}
          className="relative z-10 mx-auto flex min-h-[min(88vh,820px)] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-28 md:px-12 md:pb-24 lg:justify-center lg:pb-20"
        >
          <motion.div variants={heroItemVariants}>
            <Link
              href="/"
              className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Volver al inicio
            </Link>
          </motion.div>

          <motion.span variants={heroItemVariants} className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-white/45">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
            SERVICIOS DIGITALES · REDES
          </motion.span>

          <motion.h1
            variants={heroItemVariants}
            className="max-w-[min(100%,920px)] font-display text-[clamp(2.75rem,8vw,5.75rem)] leading-[0.92] tracking-tight"
          >
            <span className="block text-white">Gestión de</span>
            <span className="mt-1 block bg-gradient-to-r from-[#eca8d6] via-[#a78bfa] to-[#67e8f9] bg-clip-text text-transparent md:mt-2">
              Redes Sociales
            </span>
          </motion.h1>

          <motion.p variants={heroItemVariants} className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Presencia coherente, contenido con criterio y comunidad activa. En{" "}
            <span className="font-medium text-white">Cosecha Creativa</span> operamos el día a día de tus redes con foco
            en <span className="text-white">San Juan</span> y resultados que se ven en métricas y en negocio.
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
            <Button
              size="sm"
              asChild
              className="group h-10 gap-1.5 rounded-full border border-white/25 bg-white px-5 text-[13px] font-medium tracking-wide text-black shadow-none transition-all duration-300 hover:border-[#25D366]/45 hover:bg-white hover:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.35)] md:h-11 md:px-6"
            >
              <a href={getWhatsAppHref("Gestión de redes sociales")} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="size-[17px] shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                Hablar por WhatsApp
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="group h-10 rounded-full border-white/30 bg-transparent px-5 text-[13px] font-medium tracking-wide text-white/90 shadow-none backdrop-blur-[2px] transition-all duration-300 hover:border-white/55 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_32px_-12px_rgba(236,168,214,0.35)] md:h-11 md:px-6"
            >
              <a href="/#soluciones" className="gap-1.5">
                Ver más servicios
                <ArrowRight className="size-3.5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 md:size-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Qué incluye — bento estilo features */}
      <motion.section
        ref={queIncluyeRef}
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%", amount: 0.15 }}
        className={`relative overflow-hidden bg-black/45 ${sectionPyMain}`}
      >
        {/* hairline removido: secciones unidas */}

        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          {/* Bloque inmersivo: texto + mockup sobre la misma imagen que el método del home */}
          <div className="relative mb-16 min-h-[min(100%,520px)] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)] lg:mb-24 lg:min-h-[560px] lg:rounded-[2rem]">
            <div className="pointer-events-none absolute inset-0 z-0">
              <motion.div
                style={{ y: queIncluyeBgYSmooth }}
                className="absolute -inset-x-0 -top-[12%] h-[124%] w-full"
              >
                <Image
                  src={QUE_INCLUYE_BG_SRC}
                  alt=""
                  fill
                  className="object-cover object-center scale-105"
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  priority={false}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/88" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-black/55" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_75%_25%,transparent_0%,rgba(0,0,0,0.4)_45%,rgba(0,0,0,0.65)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_85%,rgba(236,168,214,0.12)_0%,transparent_55%)]" />
            </div>

            {/* Partículas de luciérnagas flotantes ambientales */}
            <FloatingAmbientParticles />

            <div className="pointer-events-none absolute left-6 right-6 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent lg:left-10 lg:right-10" />

            <div className="relative z-10 grid items-center gap-10 p-8 md:gap-12 md:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
              <div className="lg:col-span-6">
                <motion.span
                  variants={itemStaggerVariants}
                  className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-white/55"
                >
                  <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
                  QUÉ INCLUYE
                </motion.span>
                <motion.h2
                  variants={itemStaggerVariants}
                  className="font-display text-4xl leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:text-6xl lg:text-[4.25rem]"
                >
                  Un enfoque <span className="text-white/70">360°</span>
                  <br />
                  para tu marca
                </motion.h2>
                <motion.p
                  variants={itemStaggerVariants}
                  className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 drop-shadow-md md:text-xl"
                >
                  Estrategia, producción, calendario, comunidad y reporting — todo alineado a tus objetivos comerciales.
                </motion.p>
              </div>

              <motion.div
                variants={itemStaggerVariants}
                className="flex justify-center lg:col-span-6 lg:justify-end"
              >
                <RedesPhoneMockup scrollYProgress={queIncluyeScroll} />
              </motion.div>
            </div>
          </div>

          {/* Bento «Qué incluye» — fondo whale + sensación 3D / inmersiva */}
          <div className="relative mt-4 overflow-hidden rounded-[2rem] border border-cyan-400/15 shadow-[0_48px_120px_-48px_rgba(14,165,233,0.18)] [perspective:1600px]">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <motion.div
                style={{ y: bentoBgYSmooth }}
                className="absolute -inset-x-0 -top-[15%] h-[130%] w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={WHALE_BENTO_BG_SRC}
                  alt=""
                  className="h-full w-full object-cover object-[center_42%] opacity-[0.92]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-sky-950/35 to-black/[0.94]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-cyan-950/25 to-sky-950/55" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_115%,rgba(34,211,238,0.22)_0%,transparent_58%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_85%_25%,rgba(59,130,246,0.14)_0%,transparent_52%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_12%_55%,rgba(236,168,214,0.08)_0%,transparent_45%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
            </div>

            <div className="relative z-10 grid gap-4 p-5 sm:p-6 md:grid-cols-2 md:p-8 lg:grid-cols-3 lg:gap-6 lg:p-10">
              {includes.map((item) => (
                <BentoCard key={item.n} item={item} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Beneficios — fondo Gemini inmersivo + tarjetas vidrio 3D */}
      <motion.section
        ref={beneficiosRef}
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%", amount: 0.15 }}
        className={`relative overflow-hidden bg-black/45 [perspective:1400px] ${sectionPyMain}`}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <motion.div
            style={{ y: beneficiosBgYSmooth }}
            className="absolute -inset-x-0 -top-[12%] h-[124%] w-full"
          >
            <Image
              src={BENEFICIOS_BG_SRC}
              alt=""
              fill
              className="object-cover object-[center_35%] opacity-95"
              sizes="100vw"
              priority={false}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-zinc-950/55 to-black/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_20%,rgba(167,139,250,0.14)_0%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_85%,rgba(103,232,249,0.12)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_85%_at_50%_50%,transparent_25%,rgba(0,0,0,0.62)_100%)]" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05]" />
        </div>

        {/* hairline removido: secciones unidas */}

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-14 md:mb-16">
            <motion.span
              variants={itemStaggerVariants}
              className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-white/55"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
              POR QUÉ ELEGIRNOS
            </motion.span>
            <motion.h2
              variants={itemStaggerVariants}
              className="font-display text-4xl tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.5)] md:text-5xl lg:text-6xl"
            >
              Beneficios claros
            </motion.h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {benefits.map((b) => (
              <BenefitCard key={b.title} b={b} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Cita — fondo audit inmersivo + tarjeta vidrio */}
      <motion.section
        ref={citaRef}
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%", amount: 0.15 }}
        className={`relative min-h-[min(52vh,520px)] overflow-hidden bg-black/45 md:min-h-[min(48vh,560px)] ${sectionPyCompact}`}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full">
          <motion.div
            style={{ y: citaBgYSmooth }}
            className="absolute -inset-x-0 -top-[15%] h-[130%] w-full"
          >
            <Image
              src={CITA_AUDIT_BG_SRC}
              alt=""
              fill
              className="object-cover object-[center_42%]"
              sizes="100vw"
              priority={false}
            />
          </motion.div>
          {/* Scrims más livianos para que se note la foto audit */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_75%_at_50%_35%,rgba(236,168,214,0.14)_0%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_85%_at_50%_50%,transparent_35%,rgba(0,0,0,0.42)_100%)]" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.07]" />
        </div>

        {/* hairline removido: secciones unidas */}

        <div className="relative z-10 mx-auto flex min-h-[min(44vh,440px)] max-w-[1400px] items-center px-6 py-4 lg:px-12">
          <div className="mx-auto w-full max-w-[900px]">
            <motion.div
              variants={itemStaggerVariants}
              className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/22 bg-black/55 p-9 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.75)] backdrop-blur-xl md:rounded-[2rem] md:p-12 md:backdrop-blur-2xl"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(236,168,214,0.12) 0%, transparent 45%, transparent 55%, rgba(103,232,249,0.1) 100%)",
                }}
              />
              <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#eca8d6]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-[#67e8f9]/15 blur-3xl" />
              <p className="relative font-display text-2xl leading-snug tracking-tight text-white drop-shadow-[0_3px_28px_rgba(0,0,0,0.65)] md:text-3xl md:leading-snug">
                &ldquo;Somos más que una agencia de marketing digital: un equipo comprometido con el crecimiento de las
                empresas sanjuaninas.&rdquo;
              </p>
              <footer className="relative mt-8 text-sm font-medium tracking-wide text-white/65">
                — Cosecha Creativa
              </footer>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <NotebookMocupCarousel />

      {/* CTA final */}
      <motion.section
        ref={ctaRef}
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%", amount: 0.15 }}
        className={`relative overflow-hidden bg-black/45 ${sectionPyCompact}`}
      >
        {/* hairline removido: secciones unidas */}
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <motion.div
            variants={itemStaggerVariants}
            className="relative overflow-hidden rounded-2xl border border-white/12 p-8 shadow-[0_40px_100px_-50px_rgba(236,168,214,0.2)] md:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12"
          >
            <motion.div
              style={{ y: ctaBgYSmooth }}
              className="pointer-events-none absolute -inset-10 opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, rgba(236,168,214,0.08) 0%, transparent 40%, transparent 60%, rgba(103,232,249,0.06) 100%)",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-5xl">
                ¿Listo para destacar?
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55 md:text-lg">
                Coordinemos una charla o leé la nota completa con más detalle en nuestro sitio.
              </p>
            </div>
            <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-0 lg:flex-col lg:min-w-[240px]">
              <Button
                size="sm"
                asChild
                className="group h-11 gap-1.5 rounded-full border border-white/25 bg-white px-6 text-[13px] font-medium tracking-wide text-black shadow-none transition-all duration-300 hover:border-[#25D366]/45 hover:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.35)] md:h-10"
              >
                <a href={getWhatsAppHref("Gestión de redes sociales")} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-[17px] shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                  WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-11 rounded-full border-white/30 bg-transparent px-6 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/[0.06] md:h-10"
              >
                <a href="mailto:contacto@cosechacreativa.com.ar?subject=Gestión%20de%20redes%20sociales">Email</a>
              </Button>
              <Button variant="ghost" size="sm" className="h-11 justify-start text-white/55 hover:text-white md:h-10" asChild>
                <a href={ORIGINAL_URL} target="_blank" rel="noopener noreferrer" className="gap-1.5 px-2">
                  Artículo en cosechacreativa.com.ar
                  <ArrowUpRight className="size-4 shrink-0" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.div className="block w-full">
        <FooterSection />
      </motion.div>
    </main>
  )
}
