"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { MotionValue } from "framer-motion"
import {
  AnimatePresence,
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

const ORIGINAL_URL =
  "https://cosechacreativa.com.ar/servicio-de-gestion-de-redes-sociales/" as const

/**
 * Medios derivados livianos (generados con ffmpeg desde los originales de `public/`).
 * El .mp4 va primero: pesa menos que el .webm en ambos clips.
 */
const HERO_VIDEO_SOURCES = [
  { src: "/videos/redes-hero.mp4", type: "video/mp4" },
  { src: "/videos/redes-hero.webm", type: "video/webm" },
] as const
const HERO_POSTER = "/videos/redes-hero-poster.jpg"

const MOCKUP_VIDEO_SOURCES = [
  { src: "/videos/redes-mockup.mp4", type: "video/mp4" },
  { src: "/videos/redes-mockup.webm", type: "video/webm" },
] as const
const MOCKUP_POSTER = "/videos/redes-mockup-poster.jpg"

const INCLUYE_BG_SRC = "/images/redes-incluye-bg.webp"
const BENEFICIOS_BG_SRC = "/images/redes-beneficios-bg.webp"

const easePremium = [0.22, 1, 0.36, 1] as const

/** Ritmo vertical propio: más compacto que el resto de servicios. */
const sectionPy = "py-16 md:py-20 lg:py-24"

const SOCIALS = [
  { name: "Instagram", dot: "#E1306C" },
  { name: "TikTok", dot: "#25F4EE" },
  { name: "Facebook", dot: "#0866FF" },
  { name: "LinkedIn", dot: "#0A66C2" },
  { name: "YouTube", dot: "#FF0033" },
] as const

const HERO_STATS = [
  { value: "360°", label: "estrategia, contenido y comunidad" },
  { value: "Mensual", label: "calendario editorial cerrado" },
  { value: "Medible", label: "reportes con lectura accionable" },
] as const

/** Duración de cada paso del recorrido automático de «Qué incluye». */
const STEP_MS = 4600

const includes = [
  {
    n: "01",
    tag: "Estrategia",
    title: "Estrategias personalizadas",
    body: "Planes adaptados a tu negocio y al contexto del mercado en San Juan.",
    detail: "Diagnóstico, posicionamiento y objetivos por canal.",
    icon: Sparkles,
    accent: "#67e8f9",
  },
  {
    n: "02",
    tag: "Contenido",
    title: "Creación de contenido",
    body: "Textos, piezas visuales y formatos que reflejan la voz de tu marca.",
    detail: "Reels, carruseles, historias y fotografía de producto.",
    icon: PenLine,
    accent: "#a78bfa",
  },
  {
    n: "03",
    tag: "Calendario",
    title: "Planificación mensual",
    body: "Calendario editorial claro para publicar con constancia y sentido.",
    detail: "Grilla aprobada antes de empezar el mes.",
    icon: ListChecks,
    accent: "#c084fc",
  },
  {
    n: "04",
    tag: "Comunidad",
    title: "Interacción comunitaria",
    body: "Respuesta a comentarios y mensajes para acercarte a quienes te siguen.",
    detail: "Moderación, consultas y derivación a ventas.",
    icon: HeartHandshake,
    accent: "#eca8d6",
  },
  {
    n: "05",
    tag: "Reportes",
    title: "Análisis y reportes",
    body: "Métricas y lecturas accionables para afinar la estrategia mes a mes.",
    detail: "Alcance, interacción y conversión, con conclusiones.",
    icon: BarChart3,
    accent: "#5eead4",
  },
] as const

const benefits = [
  {
    n: "",
    title: "Conexión local",
    body: "Contenido pensado para la audiencia sanjuanina y tu rubro.",
    icon: HeartHandshake,
  },
  {
    n: "",
    title: "Ahorro de tiempo",
    body: "Delegás la operación diaria de redes y te enfocás en tu negocio.",
    icon: Timer,
  },
  {
    n: "",
    title: "Resultados medibles",
    body: "Seguimiento de alcance, interacción y conversiones con criterio.",
    icon: BarChart3,
  },
] as const

const heroItemVariants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easePremium } },
} as const

const itemStaggerVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: easePremium } },
}

const sectionStaggerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePremium, staggerChildren: 0.06 },
  },
}

/* ------------------------------------------------------------------ *
 * Media                                                               *
 * ------------------------------------------------------------------ */

/** Autoplay silencioso tolerante: reintenta al cargar y al entrar en pantalla. */
function useAutoplay(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const tryPlay = () => {
      el.muted = true
      void el.play().catch(() => {})
    }

    el.addEventListener("loadeddata", tryPlay)
    el.addEventListener("canplay", tryPlay)

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryPlay()
        else el.pause()
      },
      { threshold: 0.1 }
    )
    obs.observe(el)

    return () => {
      el.removeEventListener("loadeddata", tryPlay)
      el.removeEventListener("canplay", tryPlay)
      obs.disconnect()
    }
  }, [videoRef])
}

function HeroBackgroundVideo({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplay(videoRef)

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [0.95, 0.55])

  return (
    <motion.div style={{ y, opacity }} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center opacity-95"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster={HERO_POSTER}
      >
        {HERO_VIDEO_SOURCES.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/75 via-black/55 to-black/90" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/85 via-black/35 to-black/65" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(236,168,214,0.14)_0%,transparent_50%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_55%_45%_at_85%_100%,rgba(103,232,249,0.08)_0%,transparent_50%)]" />
    </motion.div>
  )
}

function RedesPhoneMockup({
  scrollYProgress,
  step,
}: {
  scrollYProgress: MotionValue<number>
  step: (typeof includes)[number]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useAutoplay(videoRef)
  const StepIcon = step.icon

  const springConfig = { stiffness: 90, damping: 20, mass: 0.6 }
  const phoneY = useTransform(scrollYProgress, [0, 0.45, 1], [60, 0, -60])
  const phoneRotate = useTransform(scrollYProgress, [0, 0.45, 1], [-6, 0, 3])

  const smoothY = useSpring(phoneY, springConfig)
  const smoothRotate = useSpring(phoneRotate, springConfig)

  return (
    <motion.div
      style={{ y: smoothY, rotate: smoothRotate }}
      className="relative mx-auto w-full max-w-[min(100%,218px)] shrink-0 sm:max-w-[min(100%,290px)]"
    >
      {/* Halo que toma el color del paso activo */}
      <motion.div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3.5rem] blur-3xl"
        animate={{
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${step.accent}59, transparent 62%), radial-gradient(ellipse 50% 45% at 70% 90%, ${step.accent}26, transparent 55%)`,
        }}
        transition={{ duration: 0.8, ease: easePremium }}
        aria-hidden
      />

      {/* Anillos concéntricos que toman el color del paso */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-700"
          style={{
            width: `${118 + i * 34}%`,
            aspectRatio: "1",
            borderColor: `${step.accent}${["26", "18", "10"][i]}`,
          }}
          aria-hidden
        />
      ))}

      {/* Tarjeta flotante con el paso activo */}
      <div className="pointer-events-none absolute -left-3 top-6 z-30 w-[178px] sm:-left-16 sm:top-10 sm:w-[210px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.n}
            initial={{ opacity: 0, x: -18, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.94 }}
            transition={{ duration: 0.45, ease: easePremium }}
            className="overflow-hidden rounded-2xl border bg-black/80 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl"
            style={{ borderColor: `${step.accent}4d` }}
          >
            <div className="h-[3px] w-full" style={{ background: step.accent }} aria-hidden />
            <div className="flex items-start gap-3 p-3.5">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${step.accent}1f`, boxShadow: `0 0 22px -8px ${step.accent}` }}
              >
                <StepIcon className="size-4" style={{ color: step.accent }} strokeWidth={1.6} aria-hidden />
              </span>
              <span className="min-w-0">
                <span
                  className="block font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: step.accent }}
                >
                  {step.tag}
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-white/70">{step.detail}</span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini indicador de recorrido */}
      <div
        className="pointer-events-none absolute -right-2 bottom-14 z-30 flex flex-col gap-2 rounded-full border border-white/12 bg-black/70 px-2.5 py-3 backdrop-blur-xl sm:-right-7"
        aria-hidden
      >
        {includes.map((s) => (
          <span
            key={s.n}
            className="size-1.5 rounded-full transition-all duration-500"
            style={{
              background: s.n === step.n ? s.accent : "rgba(255,255,255,0.22)",
              boxShadow: s.n === step.n ? `0 0 10px ${s.accent}` : "none",
              transform: s.n === step.n ? "scale(1.5)" : "scale(1)",
            }}
          />
        ))}
      </div>

      <div className="relative rounded-[2.6rem] border border-white/[0.14] bg-gradient-to-b from-zinc-700/90 via-zinc-900 to-zinc-950 p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div
          className="absolute left-1/2 top-[12px] z-20 h-[20px] w-[80px] -translate-x-1/2 rounded-full bg-black/90 ring-1 ring-white/[0.06]"
          aria-hidden
        />

        <div className="relative aspect-[9/19.4] w-full overflow-hidden rounded-[2rem] bg-black ring-1 ring-black/80">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster={MOCKUP_POSTER}
            aria-label="Vista previa de contenido en celular"
          >
            {MOCKUP_VIDEO_SOURCES.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>

          {/* Tinte del paso activo sobre la pantalla */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
            animate={{ background: `linear-gradient(180deg, ${step.accent}00 35%, ${step.accent}66 100%)` }}
            transition={{ duration: 0.8, ease: easePremium }}
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
            <motion.div
              className="absolute -inset-x-20 -top-40 h-[200%] w-[35%] rotate-[25deg] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
              animate={{ x: ["-120%", "220%"] }}
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
          className="pointer-events-none absolute bottom-[9px] left-1/2 z-20 h-[4px] w-[84px] -translate-x-1/2 rounded-full bg-white/[0.22]"
          aria-hidden
        />
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Tarjeta única (reemplaza a BentoCard y BenefitCard)                  *
 * ------------------------------------------------------------------ */

type TiltCardItem = {
  n: string
  title: string
  body: string
  icon: typeof Sparkles
}

function TiltCard({
  item,
  accent,
  className = "",
}: {
  item: TiltCardItem
  accent: string
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), { stiffness: 110, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 110, damping: 18 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el || reduce) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
    spotlightX.set(e.clientX - rect.left)
    spotlightY.set(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const spotlightBg = useMotionTemplate`radial-gradient(ellipse 240px 240px at ${spotlightX}px ${spotlightY}px, ${accent}38 0%, ${accent}14 45%, transparent 100%)`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={itemStaggerVariants}
      style={reduce ? undefined : { transformStyle: "preserve-3d", rotateX, rotateY }}
      className={`group relative overflow-hidden rounded-2xl border border-white/12 bg-black/50 p-5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-colors duration-300 sm:p-6 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBg }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        aria-hidden
      />
      <div className="pointer-events-none relative z-10">
        <div className="flex items-center justify-between">
          <span
            className="flex size-10 items-center justify-center rounded-xl border"
            style={{ borderColor: `${accent}40`, background: `${accent}14` }}
          >
            <item.icon className="size-[18px]" style={{ color: accent }} strokeWidth={1.4} aria-hidden />
          </span>
          {item.n ? <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">{item.n}</span> : null}
        </div>
        <h3 className="mt-4 font-display text-xl leading-tight tracking-tight text-white sm:text-[1.4rem]">
          {item.title}
        </h3>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-white/60">{item.body}</p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Página                                                              *
 * ------------------------------------------------------------------ */

export function GestionRedesClient() {
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  const heroRef = useRef<HTMLElement>(null)
  const incluyeRef = useRef<HTMLElement>(null)
  const beneficiosRef = useRef<HTMLElement>(null)

  const springConfig = { stiffness: 85, damping: 22, mass: 0.55 }

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroContentY = useTransform(heroScroll, [0, 1], [0, -70])
  const heroContentOpacity = useTransform(heroScroll, [0, 0.75], [1, 0])

  const { scrollYProgress: incluyeScroll } = useScroll({
    target: incluyeRef,
    offset: ["start end", "end start"],
  })
  const incluyeBgY = useSpring(useTransform(incluyeScroll, [0, 1], [-50, 50]), springConfig)

  const { scrollYProgress: beneficiosScroll } = useScroll({
    target: beneficiosRef,
    offset: ["start end", "end start"],
  })
  const beneficiosBgY = useSpring(useTransform(beneficiosScroll, [0, 1], [-50, 50]), springConfig)

  const heroContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  }

  /** Recorrido automático de «Qué incluye»: avanza solo y se frena al interactuar. */
  const [activeIndex, setActiveIndex] = useState(0)
  const [stepPaused, setStepPaused] = useState(false)
  const activeStep = includes[activeIndex]

  useEffect(() => {
    if (stepPaused || prefersReducedMotion) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % includes.length)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [stepPaused, prefersReducedMotion])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />

      {/* Constelación de datos 3D detrás de toda la página — unifica las secciones. */}
      <TechConstellation />

      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] shadow-[0_0_12px_rgba(103,232,249,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      {/* ---------------------------------------------------------- *
       * 1 · Hero                                                     *
       * ---------------------------------------------------------- */}
      <section ref={heroRef} className="relative min-h-[min(88vh,820px)] overflow-hidden pt-24 md:pt-28">
        <HeroBackgroundVideo scrollYProgress={heroScroll} />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="show"
          style={{ y: heroContentY, opacity: heroContentOpacity }}
          className="relative z-10 mx-auto flex min-h-[min(84vh,760px)] max-w-[1400px] flex-col justify-end px-6 pb-14 pt-24 md:px-12 md:pb-20 lg:justify-center"
        >
          <motion.div variants={heroItemVariants}>
            <Link
              href="/"
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Volver al inicio
            </Link>
          </motion.div>

          <motion.span
            variants={heroItemVariants}
            className="mb-5 inline-flex items-center gap-3 font-mono text-sm text-white/45"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
            SERVICIOS DIGITALES · REDES
          </motion.span>

          <motion.h1
            variants={heroItemVariants}
            className="max-w-[min(100%,920px)] font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-tight"
          >
            <span className="block text-white">Gestión de</span>
            <span className="mt-1 block bg-gradient-to-r from-[#eca8d6] via-[#a78bfa] to-[#67e8f9] bg-clip-text text-transparent md:mt-2">
              Redes Sociales
            </span>
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl"
          >
            Presencia coherente, contenido con criterio y comunidad activa. En{" "}
            <span className="font-medium text-white">Cosecha Creativa</span> operamos el día a día de tus redes con foco
            en <span className="text-white">San Juan</span> y resultados que se ven en métricas y en negocio.
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-7 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:text-white sm:text-[11px]"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: s.dot, boxShadow: `0 0 8px ${s.dot}` }}
                  aria-hidden
                />
                {s.name}
              </span>
            ))}
          </motion.div>

          <motion.div variants={heroItemVariants} className="mt-8 flex flex-wrap gap-3">
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

          <motion.dl
            variants={heroItemVariants}
            className="mt-9 grid w-full max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3"
          >
            {HERO_STATS.map((s) => (
              <div key={s.value} className="bg-black/65 px-4 py-3.5 backdrop-blur-sm">
                <dt className="font-display text-base font-semibold leading-none text-white">{s.value}</dt>
                <dd className="mt-1.5 text-[11px] leading-snug text-white/45">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- *
       * 2 · Qué incluye — bloque inmersivo + mockup + 5 tarjetas     *
       *     (antes eran dos bloques separados)                       *
       * ---------------------------------------------------------- */}
      <motion.section
        ref={incluyeRef}
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className={`relative overflow-hidden bg-black/45 ${sectionPy}`}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <motion.div style={{ y: incluyeBgY }} className="absolute inset-x-0 -top-[12%] h-[124%] w-full">
            <Image
              src={INCLUYE_BG_SRC}
              alt=""
              fill
              className="scale-105 object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/94" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/94 via-black/70 to-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_85%,rgba(236,168,214,0.12)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_85%_at_50%_50%,transparent_28%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Aurora que toma el color del paso activo */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          animate={{
            background: `radial-gradient(ellipse 60% 45% at 72% 40%, ${activeStep.accent}1f 0%, transparent 62%)`,
          }}
          transition={{ duration: 1, ease: easePremium }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          {/* Encabezado */}
          <div className="max-w-3xl">
            <motion.span
              variants={itemStaggerVariants}
              className="mb-5 inline-flex items-center gap-3 font-mono text-sm text-white/55"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
              QUÉ INCLUYE
            </motion.span>
            <motion.h2
              variants={itemStaggerVariants}
              className="font-display text-4xl leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:text-5xl lg:text-6xl"
            >
              Un enfoque <span className="text-white/70">360°</span> para tu marca
            </motion.h2>
            <motion.p
              variants={itemStaggerVariants}
              className="mt-5 text-base leading-relaxed text-white/70 drop-shadow-md md:text-lg"
            >
              Estrategia, producción, calendario, comunidad y reporting, todo alineado a tus objetivos comerciales.
            </motion.p>
          </div>

          {/* Recorrido interactivo: pasos a la izquierda, teléfono a la derecha */}
          <div
            className="mt-12 grid items-center gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-10"
            onMouseEnter={() => setStepPaused(true)}
            onMouseLeave={() => setStepPaused(false)}
          >
            <motion.ol variants={itemStaggerVariants} className="lg:col-span-7">
              {includes.map((item, i) => {
                const isActive = i === activeIndex
                const Icon = item.icon

                return (
                  <li key={item.n} className="border-t border-white/10 last:border-b">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIndex(i)
                        setStepPaused(true)
                      }}
                      aria-expanded={isActive}
                      className="group relative flex w-full items-start gap-4 py-5 text-left transition-colors sm:gap-5 sm:py-6"
                    >
                      {/* Barra de acento vertical */}
                      <span
                        className="absolute left-0 top-0 h-full w-px transition-all duration-500"
                        style={{
                          background: isActive ? item.accent : "transparent",
                          boxShadow: isActive ? `0 0 12px ${item.accent}` : "none",
                        }}
                        aria-hidden
                      />

                      <span
                        className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-500"
                        style={{
                          borderColor: isActive ? `${item.accent}66` : "rgba(255,255,255,0.12)",
                          background: isActive ? `${item.accent}1a` : "rgba(255,255,255,0.03)",
                          boxShadow: isActive ? `0 0 28px -8px ${item.accent}` : "none",
                        }}
                      >
                        <Icon
                          className="size-[19px] transition-colors duration-500"
                          style={{ color: isActive ? item.accent : "rgba(255,255,255,0.45)" }}
                          strokeWidth={1.4}
                          aria-hidden
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span
                            className="font-mono text-[11px] tracking-[0.22em] transition-colors duration-500"
                            style={{ color: isActive ? item.accent : "rgba(255,255,255,0.28)" }}
                          >
                            {item.n}
                          </span>
                          <span
                            className={`font-display text-xl leading-tight tracking-tight transition-colors duration-500 sm:text-2xl ${
                              isActive ? "text-white" : "text-white/55 group-hover:text-white/85"
                            }`}
                          >
                            {item.title}
                          </span>
                        </span>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              key="body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.45, ease: easePremium }}
                              className="block overflow-hidden"
                            >
                              <span className="block pt-3 text-[0.95rem] leading-relaxed text-white/65">
                                {item.body}
                              </span>
                              <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                                <span
                                  className="size-1 rounded-full"
                                  style={{ background: item.accent }}
                                  aria-hidden
                                />
                                {item.detail}
                              </span>

                              {/* Temporizador del recorrido automático */}
                              <span className="mt-4 block h-px w-full bg-white/10">
                                <motion.span
                                  key={`${item.n}-${stepPaused}`}
                                  className="block h-px origin-left"
                                  style={{ background: item.accent }}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: stepPaused || prefersReducedMotion ? 0 : 1 }}
                                  transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                                />
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                )
              })}
            </motion.ol>

            <motion.div variants={itemStaggerVariants} className="lg:col-span-5">
              <RedesPhoneMockup scrollYProgress={incluyeScroll} step={activeStep} />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------- *
       * 3 · Beneficios + cita (antes eran dos secciones)             *
       * ---------------------------------------------------------- */}
      <motion.section
        ref={beneficiosRef}
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className={`relative overflow-hidden bg-black/45 [perspective:1400px] ${sectionPy}`}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <motion.div style={{ y: beneficiosBgY }} className="absolute inset-x-0 -top-[12%] h-[124%] w-full">
            <Image
              src={BENEFICIOS_BG_SRC}
              alt=""
              fill
              className="object-cover object-[center_35%] opacity-95"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-zinc-950/55 to-black/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_20%,rgba(167,139,250,0.14)_0%,transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_85%_at_50%_50%,transparent_25%,rgba(0,0,0,0.62)_100%)]" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-10 md:mb-12">
            <motion.span
              variants={itemStaggerVariants}
              className="mb-5 inline-flex items-center gap-3 font-mono text-sm text-white/55"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
              POR QUÉ ELEGIRNOS
            </motion.span>
            <motion.h2
              variants={itemStaggerVariants}
              className="font-display text-4xl tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.5)] md:text-5xl"
            >
              Beneficios claros
            </motion.h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {benefits.map((b) => (
              <TiltCard key={b.title} item={b} accent="#c4b5fd" />
            ))}
          </div>

          {/* Cita — ahora es una franja dentro de esta misma sección */}
          <motion.figure
            variants={itemStaggerVariants}
            className="relative mt-6 overflow-hidden rounded-2xl border border-white/15 bg-black/55 p-7 backdrop-blur-xl md:p-10"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "linear-gradient(145deg, rgba(236,168,214,0.12) 0%, transparent 45%, transparent 55%, rgba(103,232,249,0.1) 100%)",
              }}
            />
            <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#eca8d6]/25 blur-3xl" />
            <blockquote className="relative font-display text-xl leading-snug tracking-tight text-white md:text-2xl md:leading-snug">
              &ldquo;Somos más que una agencia de marketing digital: un equipo comprometido con el crecimiento de las
              empresas sanjuaninas.&rdquo;
            </blockquote>
            <figcaption className="relative mt-5 text-sm font-medium tracking-wide text-white/55">
              — Cosecha Creativa
            </figcaption>
          </motion.figure>
        </div>
      </motion.section>

      <NotebookMocupCarousel />

      {/* ---------------------------------------------------------- *
       * 4 · CTA final                                                *
       * ---------------------------------------------------------- */}
      <motion.section
        variants={sectionStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className={`relative overflow-hidden bg-black/45 ${sectionPy}`}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <motion.div
            variants={itemStaggerVariants}
            className="relative overflow-hidden rounded-2xl border border-white/12 p-8 shadow-[0_40px_100px_-50px_rgba(236,168,214,0.2)] md:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12"
          >
            <div
              className="pointer-events-none absolute -inset-10 opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, rgba(236,168,214,0.08) 0%, transparent 40%, transparent 60%, rgba(103,232,249,0.06) 100%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-5xl">
                ¿Listo para destacar?
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55 md:text-lg">
                Coordinemos una charla o leé la nota completa con más detalle en nuestro sitio.
              </p>
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-0 lg:min-w-[240px] lg:flex-col">
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

      <FooterSection />
    </main>
  )
}
