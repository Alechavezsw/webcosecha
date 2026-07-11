"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  FileSearch,
  FileText,
  Globe2,
  LayoutTemplate,
  LineChart,
  Link2,
  MapPin,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"
import { SeoReachActivityMap } from "@/components/landing/seo-reach-activity-map"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"

const VIDEO_POSTER = "/images/bridge.png"
const HERO_BG_VIDEO_BASE = "continue_with_a_lot_of_202605020801"
const HERO_BG_VIDEO_SOURCES = [
  `/videos/${HERO_BG_VIDEO_BASE}.mp4`,
  `/videos/${HERO_BG_VIDEO_BASE}.webm`,
  `/videos/${HERO_BG_VIDEO_BASE}.mov`,
  `/${HERO_BG_VIDEO_BASE}.mp4`,
  `/${HERO_BG_VIDEO_BASE}.webm`,
] as const

const MID_BG_SRC = "/Gemini_Generated_Image_hodiophodiophodi.jpg"

const easePremium = [0.22, 1, 0.36, 1] as const

const sectionEnter = {
  initial: { opacity: 0, y: 64 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-11%" as const, amount: 0.18 },
  transition: { duration: 1.05, ease: easePremium },
} as const

const sectionEnterTight = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px", amount: 0.22 },
  transition: { duration: 0.95, ease: easePremium },
} as const

const footerEnter = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px", amount: 0.15 },
  transition: { duration: 0.98, ease: easePremium },
} as const

const heroItemVariants = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easePremium },
  },
} as const

/** Prestaciones principales del servicio SEO */
const prestaciones = [
  {
    title: "Auditoría SEO técnica",
    body: "Rastreo, indexación, datos estructurados y corrección de errores que frenan tu visibilidad.",
    icon: FileSearch,
  },
  {
    title: "Investigación de palabras clave",
    body: "Mapas de intención de búsqueda para priorizar lo que tu audiencia realmente busca.",
    icon: Search,
  },
  {
    title: "Optimización on-page",
    body: "Títulos, metas, jerarquía de contenidos, enlaces internos y experiencia de lectura.",
    icon: LayoutTemplate,
  },
  {
    title: "SEO local",
    body: "Google Business Profile, consistencia NAP y foco en San Juan y zona de influencia.",
    icon: MapPin,
  },
  {
    title: "Contenido orientado a búsqueda",
    body: "Piezas y landings alineadas a consultas reales, sin relleno: texto útil y autoridad.",
    icon: FileText,
  },
  {
    title: "Rendimiento web",
    body: "Core Web Vitals, velocidad de carga y buenas prácticas técnicas que Google premia.",
    icon: Zap,
  },
  {
    title: "Analítica & Search Console",
    body: "Seguimiento de impresiones, clics, consultas y oportunidades mes a mes.",
    icon: BarChart3,
  },
  {
    title: "Autoridad y enlaces",
    body: "Estrategia de menciones y enlaces relevantes para fortalecer la confianza del dominio.",
    icon: Link2,
  },
] as const

const resultados = [
  {
    title: "Más tráfico cualificado",
    desc: "Visitas que llegan porque buscan lo que ofrecés.",
    icon: Globe2,
  },
  {
    title: "Mejor ranking sostenido",
    desc: "Mejoras graduales basadas en datos, no en atajos.",
    icon: LineChart,
  },
  {
    title: "Marca más visible",
    desc: "Presencia coherente en búsquedas locales y temáticas.",
    icon: ShieldCheck,
  },
] as const

function HeroBackgroundVideo() {
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

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={VIDEO_POSTER}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_58%] opacity-45"
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
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/78 via-black/55 to-black/88" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/88 via-black/35 to-black/70" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_88%_62%_at_45%_0%,rgba(103,232,249,0.14)_0%,transparent_52%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_48%_42%_at_92%_95%,rgba(167,139,250,0.12)_0%,transparent_50%)]" />
    </div>
  )
}

/** Fondos por sección — malla + brillos marca (sin cubrir contenido; z-0). */
function SeoSectionBackdrop({
  mode,
  reducedMotion,
}: {
  mode: "organic" | "prestaciones" | "results" | "cta"
  reducedMotion: boolean | null
}) {
  const gridStyle = {
    backgroundImage: `
      linear-gradient(rgba(103,232,249,0.075) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,0.055) 1px, transparent 1px)
    `,
    backgroundSize: "44px 44px",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 70%, transparent 100%)",
  } as const

  if (mode === "organic") {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_95%_72%_at_12%_18%,rgba(103,232,249,0.16)_0%,transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_68%_58%_at_94%_82%,rgba(167,139,250,0.14)_0%,transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_45%_38%_at_50%_108%,rgba(236,168,214,0.09)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.28]" style={gridStyle} />
        {reducedMotion ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
            aria-hidden
            style={{
              background:
                "linear-gradient(115deg, transparent 35%, rgba(103,232,249,0.12) 48%, transparent 62%)",
            }}
          />
        ) : (
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
            aria-hidden
            animate={{
              opacity: [0.1, 0.2, 0.12],
            }}
            transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(115deg, transparent 35%, rgba(103,232,249,0.12) 48%, transparent 62%)",
            }}
          />
        )}
      </>
    )
  }

  if (mode === "prestaciones") {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_45%_at_50%_-5%,rgba(103,232,249,0.14)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_40%_35%_at_100%_60%,rgba(236,168,214,0.08)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.2]" style={gridStyle} />
        {!reducedMotion ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] opacity-40"
            aria-hidden
            animate={{ backgroundPosition: ["0% 0%", "100% 120%"] }}
            transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(125deg, transparent 42%, rgba(103,232,249,0.09) 50%, transparent 58%)",
              backgroundSize: "220% 220%",
            }}
          />
        ) : null}
      </>
    )
  }

  if (mode === "results") {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_88%_60%_at_50%_0%,rgba(103,232,249,0.11)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_50%_at_8%_92%,rgba(167,139,250,0.14)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_45%_at_96%_88%,rgba(236,168,214,0.08)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.32]" style={gridStyle} />
        {reducedMotion ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.1]"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(103,232,249,0.06) 50%, transparent 100%)",
            }}
          />
        ) : (
          <motion.div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden
            animate={{
              opacity: [0.06, 0.14, 0.07],
            }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(103,232,249,0.06) 50%, transparent 100%)",
            }}
          />
        )}
      </>
    )
  }

  /* cta */
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_55%_at_20%_30%,rgba(103,232,249,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_65%_50%_at_88%_70%,rgba(236,168,214,0.1)_0%,transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.22]" style={gridStyle} />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
        style={{
          background:
            "linear-gradient(145deg, rgba(167,139,250,0.06) 0%, transparent 42%, rgba(103,232,249,0.05) 100%)",
        }}
      />
    </>
  )
}

/** Bruma animada sobre el hero (video); respeta prefers-reduced-motion */
function SeoHeroAtmosphere({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_85%_55%_at_65%_15%,rgba(103,232,249,0.16)_0%,transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_55%_48%_at_8%_85%,rgba(236,168,214,0.1)_0%,transparent_52%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 85%)",
        }}
      />
      {!reducedMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[2] mix-blend-screen"
          aria-hidden
          animate={{
            opacity: [0.12, 0.22, 0.14],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 40%, rgba(167,139,250,0.15) 0%, transparent 65%)",
          }}
        />
      ) : null}
    </>
  )
}

/** Ilustración SERP / posiciones — decorativa */
function SeoRankGraphic({ className }: { className?: string }) {
  const rows = [
    { w: 72, o: 0.95 },
    { w: 58, o: 0.78 },
    { w: 84, o: 0.88 },
    { w: 48, o: 0.62 },
    { w: 66, o: 0.82 },
  ]
  return (
    <svg viewBox="0 0 320 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="seo-snippet" x1="40" y1="24" x2="280" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0.25" />
        </linearGradient>
        <filter id="seo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="24" y="20" width="272" height="160" rx="14" stroke="url(#seo-snippet)" strokeOpacity="0.45" strokeWidth="1.2" />
      <circle cx="52" cy="48" r="10" fill="#eca8d6" fillOpacity="0.35" filter="url(#seo-glow)" />
      <rect x="72" y="40" width="180" height="8" rx="3" fill="white" fillOpacity="0.12" />
      <rect x="72" y="54" width="140" height="6" rx="2" fill="white" fillOpacity="0.06" />
      {rows.map((r, i) => (
        <g key={i} transform={`translate(40 ${88 + i * 22})`}>
          <rect width={r.w} height="10" rx="4" fill="#67e8f9" fillOpacity={0.08 + i * 0.04} />
          <rect width={Math.min(r.w + 24, 220)} height="10" rx="4" fill="white" fillOpacity={r.o * 0.09} />
          <text x="228" y="9" fill="white" fillOpacity="0.35" fontSize="9" fontFamily="monospace">
            #{i + 1}
          </text>
        </g>
      ))}
      <path
        d="M24 168 Q120 120 296 152"
        stroke="#eca8d6"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function SeoPosicionamientoClient() {
  const prefersReducedMotion = useReducedMotion()

  /** Progreso de scroll de toda la página → barra superior (efecto de scroll coherente) */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  const heroContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.11,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />

      {/* Constelación de datos 3D detrás de TODA la página (misma capa elegante que
          ia/apps/diseno-web → coherencia entre servicios). */}
      <TechConstellation />

      {/* Barra de progreso de scroll — efecto de scroll coherente, paleta tech */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] shadow-[0_0_12px_rgba(103,232,249,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      <section className="relative min-h-[min(92vh,900px)] overflow-hidden pt-24 md:pt-28">
        <HeroBackgroundVideo />
        <SeoHeroAtmosphere reducedMotion={prefersReducedMotion} />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[min(88vh,820px)] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-28 md:px-12 md:pb-24 lg:justify-center lg:pb-20">
          <motion.div variants={heroContainerVariants} initial="hidden" animate="show" className="w-full">
            <motion.div variants={heroItemVariants}>
              <Link
                href="/"
                className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                Volver al inicio
              </Link>
            </motion.div>

            <motion.span
              variants={heroItemVariants}
              className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-white/45"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
              SERVICIOS DIGITALES · SEO
            </motion.span>

            <motion.h1
              variants={heroItemVariants}
              className="max-w-[min(100%,920px)] font-display text-[clamp(2.45rem,7.2vw,5.1rem)] leading-[0.92] tracking-tight"
            >
              <span className="block text-white">Posicionamiento</span>
              <span className="mt-1 block bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] bg-clip-text text-transparent md:mt-2">
                SEO que trabaja para vos
              </span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl"
            >
              En <span className="font-medium text-white">Cosecha Creativa</span> diseñamos estrategias de SEO para que
              tu sitio gane visibilidad en Google con base técnica, contenido útil y foco en conversión — especialmente
              pensando en negocios de <span className="text-white">San Juan</span> y región.
            </motion.p>

            <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
              <Button
                size="sm"
                asChild
                className="group h-10 gap-1.5 rounded-full border border-white/25 bg-white px-5 text-[13px] font-medium tracking-wide text-black shadow-none transition-all duration-300 hover:border-[#25D366]/45 hover:bg-white hover:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.35)] md:h-11 md:px-6"
              >
                <a href={getWhatsAppHref("Posicionamiento SEO")} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-[17px] shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                  Consultar SEO por WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="group h-10 rounded-full border-white/30 bg-transparent px-5 text-[13px] font-medium tracking-wide text-white/90 shadow-none backdrop-blur-[2px] transition-all duration-300 hover:border-white/55 hover:bg-white/[0.06] hover:text-white md:h-11 md:px-6"
              >
                <a href="/servicios/publicidad-paga-en-redes" className="gap-1.5">
                  Publicidad paga
                  <ArrowRight className="size-3.5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 md:size-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnter}>
        <SeoSectionBackdrop mode="organic" reducedMotion={prefersReducedMotion} />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-3 font-mono text-sm text-white/50">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
                VISIBILIDAD ORGÁNICA
              </span>
              <h2 className="font-display text-3xl leading-tight tracking-tight text-white md:text-5xl">
                SEO integral: técnica, contenido y negocio en la misma hoja de ruta.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                No se trata solo de “subir posiciones”: priorizamos palabras con intención, mejoramos la experiencia del
                sitio y medimos el impacto para iterar con criterio.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-white/55 md:text-base">
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#67e8f9]" aria-hidden />
                  Diagnóstico claro al inicio y priorización por impacto / esfuerzo.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#a78bfa]" aria-hidden />
                  Informes legibles: qué cambió, por qué y qué sigue.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#eca8d6]" aria-hidden />
                  Coordinación con tu marca (redes, ads, web) cuando hace falta.
                </li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-gradient-to-br from-zinc-900/95 via-black to-zinc-950 p-8 shadow-[0_40px_100px_-40px_rgba(103,232,249,0.18)] md:p-10">
              <div className="pointer-events-none absolute -left-20 top-0 size-64 rounded-full bg-[#67e8f9]/12 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-12 size-56 rounded-full bg-[#a78bfa]/15 blur-3xl" />
              <SeoRankGraphic className="relative z-[1] mx-auto w-full max-w-[360px]" />
              <p className="relative z-[1] mt-6 text-center text-xs text-white/40">
                Ilustración conceptual — los informes reales usan Search Console, Analytics y herramientas profesionales.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Prestaciones — grid 8 */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnter}>
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image src={MID_BG_SRC} alt="" fill className="object-cover object-center opacity-35" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/93 via-zinc-950/88 to-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(103,232,249,0.1)_0%,transparent_55%)]" />
        </div>
        <SeoSectionBackdrop mode="prestaciones" reducedMotion={prefersReducedMotion} />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-14 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-white/55">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
              PRESTACIONES
            </span>
            <h2 className="font-display text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">
              Todo lo que incluye el servicio
            </h2>
            <p className="mt-5 text-lg text-white/55">
              Podemos armar un plan completo o focalizar etapas según el estado actual de tu sitio.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {prestaciones.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.04, ease: easePremium }}
                className="group relative overflow-hidden rounded-2xl border border-white/14 bg-black/55 p-7 backdrop-blur-xl transition-all duration-500 hover:border-[#67e8f9]/30 hover:shadow-[0_24px_60px_-28px_rgba(103,232,249,0.14)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#67e8f9]/10 via-transparent to-[#a78bfa]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05]">
                    <item.icon className="size-5 text-[#a5f3fc]" strokeWidth={1.2} aria-hidden />
                  </div>
                  <h3 className="font-display text-lg tracking-tight text-white md:text-xl">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/60">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Resultados */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnterTight}>
        <SeoSectionBackdrop mode="results" reducedMotion={prefersReducedMotion} />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-12 text-center md:mb-14">
            <span className="mb-4 inline-flex items-center justify-center gap-3 font-mono text-sm text-white/50">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/28" />
              RESULTADOS
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/28" />
            </span>
            <h2 className="mx-auto max-w-3xl font-display text-3xl tracking-tight text-white md:text-5xl">
              Lo que buscamos medir y mejorar juntos
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {resultados.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: i * 0.08, ease: easePremium }}
                className="rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-8 text-center"
              >
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
                  <r.icon className="size-7 text-cyan-200/90" strokeWidth={1.15} aria-hidden />
                </div>
                <h3 className="font-display text-xl text-white md:text-2xl">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55 md:text-base">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <SeoReachActivityMap />

      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 pb-24 pt-12 md:pb-32" {...sectionEnterTight}>
        <SeoSectionBackdrop mode="cta" reducedMotion={prefersReducedMotion} />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/12 p-8 shadow-[0_40px_100px_-50px_rgba(103,232,249,0.18)] md:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background:
                  "linear-gradient(125deg, rgba(103,232,249,0.08) 0%, transparent 45%, transparent 55%, rgba(236,168,214,0.07) 100%)",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-5xl">
                ¿Tu sitio puede rendir más en Google?
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55 md:text-lg">
                Escribinos y revisamos por dónde empezar: auditoría express o plan completo según tu prioridad.
              </p>
              <p className="mt-4 text-sm text-white/40">
                WhatsApp:{" "}
                <a href="tel:+5492645468012" className="text-white/70 underline-offset-4 hover:text-white hover:underline">
                  +54 9 264 546-8012
                </a>
              </p>
            </div>
            <div className="relative mt-10 flex flex-col gap-3 lg:mt-0 lg:min-w-[240px]">
              <Button
                size="sm"
                asChild
                className="group h-11 gap-1.5 rounded-full border border-white/25 bg-white px-6 text-[13px] font-medium tracking-wide text-black shadow-none transition-all duration-300 hover:border-[#25D366]/45 hover:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.35)] md:h-10"
              >
                <a href={getWhatsAppHref("Posicionamiento SEO")} target="_blank" rel="noopener noreferrer">
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
                <a href="mailto:contacto@cosechacreativa.com.ar?subject=SEO%20-%20consulta">Email</a>
              </Button>
              <Button variant="ghost" size="sm" className="h-11 justify-start text-white/55 hover:text-white md:h-10" asChild>
                <a href="/#soluciones" className="gap-1.5 px-2">
                  Ver soluciones en el sitio
                  <ArrowUpRight className="size-4 shrink-0" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div {...footerEnter}>
        <FooterSection />
      </motion.div>
    </main>
  )
}
