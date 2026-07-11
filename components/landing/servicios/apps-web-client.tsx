"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { ContainerScroll } from "@/components/ui/container-scroll"
import { ImageCursorTrail } from "@/components/ui/image-cursor-trail"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { SOFT_GALLERY_FILES, softGallerySrc } from "@/lib/soft-gallery-images"
import { cn } from "@/lib/utils"
import { BeneficiosParallaxMarquee } from "@/components/landing/servicios/beneficios-parallax-marquee"
import { LayeredText } from "@/components/ui/layered-text"
import { CpuArchitecture } from "@/components/ui/cpu-architecture"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"

const VIDEO_POSTER = "/images/bridge.png"
const HERO_BG_VIDEO_BASE = "continue_with_a_lot_of_202605020801"
const HERO_BG_VIDEO_SOURCES = [
  `/videos/${HERO_BG_VIDEO_BASE}.mp4`,
  `/videos/${HERO_BG_VIDEO_BASE}.webm`,
  `/videos/${HERO_BG_VIDEO_BASE}.mov`,
  `/${HERO_BG_VIDEO_BASE}.mp4`,
  `/${HERO_BG_VIDEO_BASE}.webm`,
] as const

/** Nombres de archivo en `public/videos/` (mismos clips que otras páginas del sitio) — el intro avanza al terminar cada uno */
const INTRO_SECTION_VIDEO_BASES = [
  "continue_with_a_lot_of_202605020801",
  "diseno-web-seo-bg",
  "0503",
  "gestion-mockup-bg",
] as const

function videoSourcesForBase(base: string): readonly string[] {
  return [
    `/videos/${base}.mp4`,
    `/videos/${base}.webm`,
    `/videos/${base}.mov`,
    `/${base}.mp4`,
    `/${base}.webm`,
  ]
}

const MID_BG_SRC = "/Gemini_Generated_Image_hodiophodiophodi.jpg"

const easePremium = [0.22, 1, 0.36, 1] as const

const sectionEnter = {
  initial: { opacity: 0, y: 64 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-11%" as const, amount: 0.15 },
  transition: { duration: 1.05, ease: easePremium },
} as const

const sectionEnterTight = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px", amount: 0.2 },
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

/** Sección «¿Qué hacemos?» — stagger + tarjetas */
const alcanceHeadingChild = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easePremium },
  },
} as const

const alcanceCardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: easePremium },
  },
} as const

const MARQUEE_TAGS = [
  "Asistentes internos",
  "Lectura de documentos",
  "Generación de informes",
  "Chatbots empresariales",
  "Automatización de procesos",
] as const

const podemosCrear = [
  "Apps web administrativas.",
  "Sistemas de gestión de clientes.",
  "Paneles internos para equipos.",
  "Plataformas de turnos, reservas o pedidos.",
  "Sistemas de stock e inventario.",
  "Gestores de pagos, cuotas o socios.",
  "Dashboards con métricas en tiempo real.",
  "Automatizaciones conectadas con WhatsApp, email, formularios o bases de datos.",
  "Software con inteligencia artificial integrada.",
  "Sistemas conectados a APIs externas.",
  "Plataformas SaaS listas para escalar.",
] as const

const beneficios = [
  "Centralizar toda la información en un solo lugar.",
  "Evitar planillas desordenadas y mensajes perdidos.",
  "Automatizar tareas repetitivas.",
  "Mejorar el seguimiento de clientes, ventas, pagos o procesos.",
  "Tener métricas claras para tomar decisiones.",
  "Reducir errores humanos.",
  "Ahorrar tiempo operativo.",
  "Escalar tu negocio con una estructura digital sólida.",
] as const

/** Texto encadenado para el bloque skew animado (pasos del proceso). */
const procesoLayeredLines = [
  { top: "\u00A0", bottom: "DIAGNÓSTICO" },
  { top: "DIAGNÓSTICO", bottom: "DISEÑO" },
  { top: "DISEÑO", bottom: "DESARROLLO" },
  { top: "DESARROLLO", bottom: "PRUEBAS" },
  { top: "PRUEBAS", bottom: "IMPLEMENTACIÓN" },
  { top: "IMPLEMENTACIÓN", bottom: "EVOLUCIÓN" },
  { top: "EVOLUCIÓN", bottom: "\u00A0" },
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

/** Rota entre varios fondos de `public/videos/` al terminar cada clip (sin loop en el elemento; lista circular) */
function IntroSectionBackgroundVideo({ reducedMotion }: { reducedMotion: boolean | null }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [clipIndex, setClipIndex] = useState(0)
  const currentBase = INTRO_SECTION_VIDEO_BASES[clipIndex]
  const introSources = videoSourcesForBase(currentBase)

  useEffect(() => {
    if (reducedMotion) return
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
  }, [reducedMotion, clipIndex])

  const goNextClip = () => {
    setClipIndex((i) => (i + 1) % INTRO_SECTION_VIDEO_BASES.length)
  }

  const overlays = (
    <>
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/50 via-black/38 to-black/58" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/42 via-black/22 to-black/38" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_95%_65%_at_40%_25%,rgba(103,232,249,0.05)_0%,transparent_58%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_55%_50%_at_85%_85%,rgba(167,139,250,0.04)_0%,transparent_52%)]" />
      <div className="absolute inset-0 z-[2] bg-black/12" />
    </>
  )

  if (reducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VIDEO_POSTER}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_58%] opacity-45"
        />
        {overlays}
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={VIDEO_POSTER}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_58%] opacity-40"
      />
      <video
        key={currentBase}
        ref={videoRef}
        className="absolute inset-0 z-[1] h-full min-h-full w-full min-w-full scale-[1.06] object-cover object-center opacity-100"
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        poster={VIDEO_POSTER}
        onEnded={goNextClip}
        onError={goNextClip}
      >
        {introSources.map((src) => (
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
      {overlays}
    </div>
  )
}

function AppsHeroAtmosphere({
  reducedMotion,
  orbParallax,
}: {
  reducedMotion: boolean | null
  orbParallax?: readonly [MotionValue<number>, MotionValue<number>]
}) {
  const g1 =
    "pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_85%_55%_at_65%_15%,rgba(103,232,249,0.16)_0%,transparent_58%)]"
  const g2 =
    "pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_55%_48%_at_8%_85%,rgba(236,168,214,0.1)_0%,transparent_52%)]"

  return (
    <>
      {orbParallax ? (
        <>
          <motion.div className={g1} style={{ y: orbParallax[0] }} aria-hidden />
          <motion.div className={g2} style={{ y: orbParallax[1] }} aria-hidden />
        </>
      ) : (
        <>
          <div className={g1} />
          <div className={g2} />
        </>
      )}
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

function AppsSectionBackdrop({
  mode,
  reducedMotion,
}: {
  mode: "quotes" | "capabilities" | "cta"
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

  if (mode === "quotes") {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_95%_72%_at_12%_18%,rgba(103,232,249,0.16)_0%,transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_68%_58%_at_94%_82%,rgba(167,139,250,0.14)_0%,transparent_52%)]" />
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

  if (mode === "capabilities") {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_45%_at_50%_-5%,rgba(103,232,249,0.14)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_40%_35%_at_100%_60%,rgba(236,168,214,0.08)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.2]" style={gridStyle} />
      </>
    )
  }

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

function SectionDivider() {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
  )
}

function ProseMuted({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-relaxed text-white/65 md:text-xl">{children}</p>
}

function AppsScrollCardInner() {
  return (
    <div className="relative h-full min-h-[12rem] w-full overflow-hidden rounded-[14px] bg-zinc-950 md:min-h-0 md:rounded-xl">
      <Image
        src={MID_BG_SRC}
        alt=""
        fill
        className="object-cover object-center opacity-40"
        sizes="(max-width: 768px) 100vw, min(1280px, 90vw)"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
      <div className="relative z-10 flex h-full flex-col p-4 md:p-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="size-2.5 rounded-full bg-red-400/90" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-400/90" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-400/90" aria-hidden />
          <span className="ml-3 truncate font-mono text-[11px] text-white/35">app.cosechacreativa.local</span>
        </div>
        <div className="mt-4 grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <div className="rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-md md:p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45 md:text-xs">Ventas</p>
            <p className="mt-2 font-display text-xl text-white md:text-2xl">+24%</p>
            <div className="mt-3 h-8 rounded-md bg-gradient-to-r from-cyan-500/25 to-violet-500/20" />
          </div>
          <div className="rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-md md:p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45 md:text-xs">Leads</p>
            <p className="mt-2 font-display text-xl text-white md:text-2xl">128</p>
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 rounded-full bg-white/10" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/15" />
            </div>
          </div>
          <div className="col-span-2 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-md md:col-span-1 md:p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45 md:text-xs">Automatización</p>
            <p className="mt-2 text-sm leading-snug text-white/75 md:text-base">Flujos activos · IA · APIs</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-100/90">
                n8n
              </span>
              <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-100/90">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppsScrollSectionTitle() {
  return (
    <>
      <span className="mb-4 inline-flex items-center justify-center gap-3 font-mono text-sm text-white/50">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/28" aria-hidden />
        PRODUCTO
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/28" aria-hidden />
      </span>
      <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">Software que ordena tu operación</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base text-white/55 md:text-lg">
        Vista conceptual: paneles, métricas y flujos en un solo lugar.
      </p>
    </>
  )
}

function AppsMarquee({ reducedMotion }: { reducedMotion: boolean | null }) {
  const TagSep = () => (
    <span className="mx-5 inline-flex items-center md:mx-7" aria-hidden>
      <span className="size-1 rounded-full bg-gradient-to-br from-[#eca8d6] via-[#a78bfa] to-[#67e8f9] opacity-80 shadow-[0_0_12px_rgba(103,232,249,0.35)]" />
    </span>
  )

  if (reducedMotion) {
    return (
      <div className="relative scroll-mt-28 overflow-hidden border-y border-white/[0.12] bg-[linear-gradient(180deg,rgba(12,12,14,0.98)_0%,rgba(0,0,0,0.97)_45%,rgba(10,10,12,0.98)_100%)] py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(236,168,214,0.1)_0%,transparent_52%),radial-gradient(ellipse_70%_60%_at_100%_50%,rgba(103,232,249,0.06)_0%,transparent_45%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        <div className="relative z-[1] mx-auto flex max-w-[1400px] flex-wrap justify-center gap-2.5 px-6 md:gap-3">
          {MARQUEE_TAGS.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 font-display text-sm font-medium italic tracking-wide text-white/80 shadow-[0_8px_32px_-16px_rgba(167,139,250,0.25)] backdrop-blur-sm md:px-5 md:text-base"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative scroll-mt-28 overflow-hidden border-y border-white/[0.12] bg-[linear-gradient(180deg,rgba(11,11,13,0.98)_0%,rgba(0,0,0,0.96)_50%,rgba(11,11,13,0.98)_100%)] py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:py-7">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_90%_at_50%_-40%,rgba(236,168,214,0.11)_0%,transparent_50%),radial-gradient(ellipse_60%_80%_at_110%_40%,rgba(103,232,249,0.07)_0%,transparent_48%),radial-gradient(ellipse_50%_70%_at_-10%_60%,rgba(167,139,250,0.06)_0%,transparent_46%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/20 to-transparent opacity-80" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-28 bg-gradient-to-r from-black via-black/90 to-transparent md:w-36" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-28 bg-gradient-to-l from-black via-black/90 to-transparent md:w-36" />
      <div className="marquee flex w-max items-center" style={{ animationDuration: "48s" }}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center px-3 md:px-5">
            {MARQUEE_TAGS.map((t, i) => (
              <span key={`${dup}-${t}`} className="flex items-center">
                {i > 0 ? <TagSep /> : null}
                <span className="font-display text-xl italic tracking-tight text-transparent md:text-2xl lg:text-[1.7rem] [text-shadow:0_1px_32px_rgba(167,139,250,0.12)] bg-gradient-to-b from-white via-white/88 to-white/55 bg-clip-text">
                  {t}
                </span>
              </span>
            ))}
            <TagSep />
          </div>
        ))}
      </div>
    </div>
  )
}

function useSectionScrollParallax(
  sectionRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean | null,
  variant: "hero" | "section" = "section",
) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const m = variant === "hero" ? 1.28 : 1
  const slow = 42 * m
  const opposite = 28 * m
  const fast = 64 * m
  const still: [number, number] = [0, 0]
  const ySlow = useTransform(scrollYProgress, [0, 1], reducedMotion ? still : [slow, -slow])
  const yOpposite = useTransform(scrollYProgress, [0, 1], reducedMotion ? still : [-opposite, opposite])
  const yFast = useTransform(scrollYProgress, [0, 1], reducedMotion ? still : [fast, -fast])
  return { ySlow, yOpposite, yFast }
}

export function AppsWebClient() {
  const prefersReducedMotion = useReducedMotion()
  const softTrailUrls = useMemo(() => SOFT_GALLERY_FILES.map(softGallerySrc), [])

  /** Progreso de scroll de toda la página → barra superior (efecto de scroll coherente) */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  const heroSectionRef = useRef<HTMLElement>(null)
  const introSectionRef = useRef<HTMLElement>(null)
  const alcanceSectionRef = useRef<HTMLElement>(null)
  const gallerySectionRef = useRef<HTMLElement>(null)
  const metodologiaSectionRef = useRef<HTMLElement>(null)
  const methodologyStripRef = useRef<HTMLDivElement>(null)
  const methodologyCarouselPauseRef = useRef(false)

  const methodologySectionInView = useInView(metodologiaSectionRef, {
    amount: 0.28,
    margin: "-12% 0px -10% 0px",
  })

  const heroPx = useSectionScrollParallax(heroSectionRef, prefersReducedMotion, "hero")
  const introPx = useSectionScrollParallax(introSectionRef, prefersReducedMotion)
  const alcancePx = useSectionScrollParallax(alcanceSectionRef, prefersReducedMotion)
  const galleryPx = useSectionScrollParallax(gallerySectionRef, prefersReducedMotion)
  const metodologiaPx = useSectionScrollParallax(metodologiaSectionRef, prefersReducedMotion)

  const heroContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.11,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  }

  useEffect(() => {
    if (prefersReducedMotion || !methodologySectionInView) return
    const strip = methodologyStripRef.current
    if (!strip) return
    const cards = strip.querySelectorAll<HTMLElement>("[data-apps-carousel-card]")
    if (cards.length < 2) return

    let active = 0
    const stepMs = 5200
    const id = window.setInterval(() => {
      if (methodologyCarouselPauseRef.current) return
      active = (active + 1) % cards.length
      cards[active]?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      })
    }, stepMs)

    return () => window.clearInterval(id)
  }, [prefersReducedMotion, methodologySectionInView])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />

      {/* Constelación de datos 3D detrás de TODA la página (misma capa elegante que
          /servicios/ia → coherencia entre las páginas de servicios tech). */}
      <TechConstellation />

      {/* Barra de progreso de scroll — efecto de scroll coherente, paleta tech */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] shadow-[0_0_12px_rgba(103,232,249,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      <motion.section ref={heroSectionRef} className="relative min-h-[min(92vh,900px)] overflow-hidden pt-24 md:pt-28">
        <motion.div
          className="pointer-events-none absolute -top-[12%] bottom-0 left-0 right-0 z-0 overflow-hidden"
          style={{ y: prefersReducedMotion ? undefined : heroPx.yFast }}
          aria-hidden
        >
          <HeroBackgroundVideo />
        </motion.div>
        <AppsHeroAtmosphere
          reducedMotion={prefersReducedMotion}
          orbParallax={prefersReducedMotion ? undefined : [heroPx.ySlow, heroPx.yOpposite]}
        />
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
              className="mb-6 inline-flex max-w-xl flex-col gap-1 font-mono text-sm text-white/45 sm:flex-row sm:items-center sm:gap-3"
            >
              <span className="hidden h-px w-12 shrink-0 bg-gradient-to-r from-transparent to-white/35 sm:block" />
              <span>
                DESARROLLO DE APPS WEB Y SOFTWARE A MEDIDA ·{" "}
                <span className="text-white/55">Cosecha Creativa</span>
              </span>
            </motion.span>

            <motion.h1
              variants={heroItemVariants}
              className="max-w-[min(100%,920px)] font-display text-[clamp(2.45rem,7.2vw,5.1rem)] leading-[0.92] tracking-tight"
            >
              <span className="block text-white">Apps web y software a medida</span>
              <span className="mt-1 block bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] bg-clip-text text-transparent md:mt-2">
                para empresas que quieren crecer
              </span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl"
            >
              Diseñamos y desarrollamos sistemas digitales, plataformas web y herramientas inteligentes para ordenar
              procesos, automatizar tareas y escalar tu negocio con tecnología.
            </motion.p>

            <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
              <Button
                size="sm"
                asChild
                className="group h-10 gap-1.5 rounded-full border border-white/25 bg-white px-5 text-[13px] font-medium tracking-wide text-black shadow-none transition-all duration-300 hover:border-[#25D366]/45 hover:bg-white hover:shadow-[0_10px_28px_-10px_rgba(37,211,102,0.35)] md:h-11 md:px-6"
              >
                <a href={getWhatsAppHref("Apps / software a medida")} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-[17px] shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                  Quiero desarrollar mi sistema
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="group h-10 rounded-full border-white/30 bg-transparent px-5 text-[13px] font-medium tracking-wide text-white/90 shadow-none backdrop-blur-[2px] transition-all duration-300 hover:border-white/55 hover:bg-white/[0.06] hover:text-white md:h-11 md:px-6"
              >
                <a href="/servicios/diseno-web" className="gap-1.5">
                  Diseño web integral
                  <ArrowRight className="size-3.5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 md:size-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <AppsMarquee reducedMotion={prefersReducedMotion} />

      {prefersReducedMotion ? (
        <section className="relative border-t border-white/10 bg-black/55 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-12">
            <AppsScrollSectionTitle />
            <div className="mx-auto mt-10 max-h-none overflow-hidden rounded-[28px] border border-white/15 bg-zinc-950 p-1.5 shadow-2xl md:rounded-[30px] md:border-[3px] md:p-5">
              <div className="overflow-hidden rounded-[22px] bg-zinc-900 ring-1 ring-white/10 md:rounded-2xl md:p-3">
                <AppsScrollCardInner />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="relative border-t border-white/10 bg-black/55">
          <ContainerScroll titleComponent={<AppsScrollSectionTitle />}>
            <AppsScrollCardInner />
          </ContainerScroll>
        </div>
      )}

      {/* Intro */}
      <motion.section
        ref={introSectionRef}
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnter}
      >
        <motion.div
          className="pointer-events-none absolute -inset-[6%] z-0 overflow-hidden"
          style={{ y: prefersReducedMotion ? undefined : introPx.ySlow }}
          aria-hidden
        >
          <IntroSectionBackgroundVideo reducedMotion={prefersReducedMotion} />
        </motion.div>
        <SectionDivider />
        <div className="relative z-10 mx-auto max-w-[900px] px-6 lg:px-12">
          <div className="rounded-2xl border border-white/15 bg-black/25 p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10 md:rounded-3xl md:p-9 lg:p-11 [&_p]:text-white/80">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-white md:text-5xl">
              Desarrollo de Apps Web y Software a Medida
            </h2>
            <div className="mt-8 space-y-6">
              <ProseMuted>
                Creamos soluciones digitales pensadas para que tu empresa trabaje mejor, venda más y pierda menos tiempo en
                tareas repetitivas.
              </ProseMuted>
              <ProseMuted>
                En <span className="font-medium text-white">Cosecha Creativa</span> desarrollamos apps web, sistemas
                internos, plataformas de gestión y software a medida, adaptados a la realidad de cada negocio. No usamos
                recetas genéricas: analizamos tu proceso, detectamos dónde se pierde tiempo, dinero o información, y
                diseñamos una herramienta que ordena, automatiza y potencia tu forma de trabajar.
              </ProseMuted>
              <ProseMuted>
                Desde un sistema simple de carga de datos hasta una plataforma escalable en la nube, convertimos tus ideas
                en tecnología funcional, clara y preparada para crecer.
              </ProseMuted>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ¿Qué hacemos? */}
      <motion.section
        ref={alcanceSectionRef}
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnterTight}
      >
        <AppsSectionBackdrop mode="capabilities" reducedMotion={prefersReducedMotion} />
        {!prefersReducedMotion ? (
          <>
            <motion.div
              className="pointer-events-none absolute -left-32 top-[18%] z-[1]"
              style={{ y: alcancePx.ySlow }}
              aria-hidden
            >
              <motion.div
                className="size-[min(480px,85vw)] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.28)_0%,transparent_68%)] blur-3xl"
                animate={{ opacity: [0.35, 0.58, 0.35], scale: [1, 1.08, 1], x: [0, 24, 0] }}
                transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute -right-28 bottom-[12%] z-[1]"
              style={{ y: alcancePx.yOpposite }}
              aria-hidden
            >
              <motion.div
                className="size-[min(420px,75vw)] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.22)_0%,transparent_68%)] blur-3xl"
                animate={{ opacity: [0.28, 0.48, 0.28], scale: [1, 1.1, 1], x: [0, -20, 0] }}
                transition={{ duration: 13, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.2 }}
              />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute left-1/2 top-0 z-[1] h-px w-[min(72%,520px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent"
              aria-hidden
              animate={{ opacity: [0.35, 0.85, 0.35], scaleX: [0.85, 1, 0.85] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </>
        ) : null}
        <SectionDivider />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.085,
                  delayChildren: prefersReducedMotion ? 0 : 0.06,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-11%", amount: 0.2 }}
            className="mb-10 md:mb-12"
          >
            <motion.span
              variants={alcanceHeadingChild}
              className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-white/50"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" aria-hidden />
              ALCANCE
            </motion.span>
            <motion.h2
              variants={alcanceHeadingChild}
              className="font-display text-3xl tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              ¿Qué hacemos?
            </motion.h2>
            <motion.p
              variants={alcanceHeadingChild}
              className="mt-6 max-w-3xl text-lg leading-relaxed text-white/65 md:text-xl"
            >
              Desarrollamos herramientas digitales para empresas, comercios, instituciones, profesionales y proyectos que
              necesitan ordenar su gestión y mejorar sus resultados.
            </motion.p>
            <motion.p variants={alcanceHeadingChild} className="mt-6 font-display text-xl text-white md:text-2xl">
              Podemos crear:
            </motion.p>
          </motion.div>

          <motion.ul
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.042,
                  delayChildren: prefersReducedMotion ? 0 : 0.08,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%", amount: 0.15 }}
            className="grid gap-3.5 sm:grid-cols-2 lg:gap-4"
          >
            {podemosCrear.map((line) => (
              <motion.li
                key={line}
                variants={alcanceCardVariants}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: -5,
                        scale: 1.015,
                        transition: { type: "spring", stiffness: 420, damping: 22 },
                      }
                }
                className="group relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent p-4 shadow-[0_16px_48px_-28px_rgba(103,232,249,0.25)] backdrop-blur-[2px] transition-colors duration-300 hover:border-cyan-400/35 hover:shadow-[0_24px_56px_-24px_rgba(103,232,249,0.35)] md:p-5"
              >
                <span
                  className="pointer-events-none absolute inset-y-3 left-0 z-0 w-[3px] origin-center scale-y-[0.72] rounded-full bg-gradient-to-b from-cyan-400/85 via-violet-400/65 to-fuchsia-400/55 opacity-70 transition-transform duration-300 group-hover:scale-y-100 group-hover:opacity-100"
                  aria-hidden
                />
                {!prefersReducedMotion ? (
                  <span className="pointer-events-none absolute inset-0 z-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-[transform] duration-700 ease-out group-hover:translate-x-[100%]" />
                ) : null}
                <div className="relative z-[1] flex gap-3.5">
                  <motion.span
                    className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/25 to-violet-500/15 shadow-[0_0_24px_-4px_rgba(103,232,249,0.35)]"
                    whileHover={
                      prefersReducedMotion ? undefined : { scale: 1.08, rotate: [0, -6, 6, 0], transition: { duration: 0.45 } }
                    }
                  >
                    <Check className="size-4 text-cyan-100" strokeWidth={2.5} aria-hidden />
                  </motion.span>
                  <span className="text-base leading-relaxed text-white/80 md:text-[17px]">{line}</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      {/* Galería — public/soft */}
      <motion.section
        ref={gallerySectionRef}
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnterTight}
      >
        <AppsSectionBackdrop mode="capabilities" reducedMotion={prefersReducedMotion} />
        {!prefersReducedMotion ? (
          <>
            <motion.div
              className="pointer-events-none absolute left-[12%] top-[12%] z-[1]"
              style={{ y: galleryPx.ySlow }}
              aria-hidden
            >
              <motion.div
                className="size-[min(400px,72vw)] rounded-full bg-[radial-gradient(circle,rgba(236,168,214,0.14)_0%,transparent_65%)] blur-3xl"
                animate={{ opacity: [0.22, 0.42, 0.22], scale: [1, 1.06, 1] }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute bottom-[10%] right-[10%] z-[1]"
              style={{ y: galleryPx.yOpposite }}
              aria-hidden
            >
              <motion.div
                className="size-[min(360px,68vw)] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.16)_0%,transparent_62%)] blur-3xl"
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.07, 1] }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.4 }}
              />
            </motion.div>
          </>
        ) : null}
        <SectionDivider />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.08,
                  delayChildren: prefersReducedMotion ? 0 : 0.05,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%", amount: 0.2 }}
            className="mb-10 md:mb-12"
          >
            <motion.span
              variants={alcanceHeadingChild}
              className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-white/50"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" aria-hidden />
              VISUAL
            </motion.span>
            <motion.h2
              variants={alcanceHeadingChild}
              className="font-display text-3xl tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Algunos de nuestros trabajos
            </motion.h2>
            <motion.p variants={alcanceHeadingChild} className="mt-4 max-w-2xl text-lg text-white/55 md:text-xl">
              Estas piezas son proyectos reales: interfaces claras, datos ordenados y herramientas que ya están ayudando a
              equipos a trabajar mejor. Si te gusta cómo se ven y cómo encajan con tu marca, podemos llevar ese mismo
              nivel de diseño y desarrollo a tu próximo sistema.
            </motion.p>
          </motion.div>

          {!prefersReducedMotion ? (
            <div className="mb-12 md:mb-14">
              <ImageCursorTrail
                items={softTrailUrls}
                maxNumberOfImages={5}
                distance={22}
                className="mx-auto max-w-4xl border border-white/12 bg-zinc-950/35 shadow-[0_24px_80px_-40px_rgba(103,232,249,0.25)] ring-1 ring-cyan-400/18 md:h-[520px] md:min-h-[520px]"
                imgClass="h-36 w-28 rounded-2xl border border-white/18 shadow-[0_16px_44px_-18px_rgba(167,139,250,0.45)] sm:h-44 sm:w-36 md:h-52 md:w-44"
              />
            </div>
          ) : null}

          <motion.ul
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.052,
                  delayChildren: prefersReducedMotion ? 0 : 0.06,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-8%", amount: 0.12 }}
            className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {SOFT_GALLERY_FILES.map((file, i) => (
              <motion.li
                key={file}
                variants={alcanceCardVariants}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -6, scale: 1.02, transition: { type: "spring", stiffness: 380, damping: 24 } }
                }
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/12 bg-zinc-950/70 shadow-[0_22px_64px_-36px_rgba(103,232,249,0.38)] ring-1 ring-inset ring-cyan-400/15 transition-[box-shadow,border-color] duration-300 hover:border-cyan-400/40 hover:shadow-[0_32px_80px_-28px_rgba(167,139,250,0.32)] hover:ring-violet-400/30"
              >
                <Image
                  src={softGallerySrc(file)}
                  alt={`Referencia visual ${i + 1} — interfaces y software Cosecha Creativa`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#67e8f9]/12 via-transparent to-[#a78bfa]/18 opacity-60 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      {/* Metodología · Apps web · IA — carril horizontal */}
      <motion.section
        ref={metodologiaSectionRef}
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-14 lg:py-20"
        {...sectionEnter}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(6,6,8,0.58)_0%,rgba(0,0,0,0.55)_45%,rgba(6,6,8,0.58)_100%)]"
          aria-hidden
        />
        <SectionDivider />

        <div
          ref={methodologyStripRef}
          onMouseEnter={() => {
            methodologyCarouselPauseRef.current = true
          }}
          onMouseLeave={() => {
            methodologyCarouselPauseRef.current = false
          }}
          className={cn(
            "relative z-[2] flex gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-6 pb-10 pt-4 lg:gap-7 lg:px-12",
            !prefersReducedMotion && "snap-x snap-mandatory",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="region"
          aria-label="Tarjetas: metodología, apps web e inteligencia artificial"
          tabIndex={0}
        >
          {/* Tarjeta 1 — Metodología */}
          <article
            data-apps-carousel-card
            className={cn(
              "flex h-full min-w-[calc(100vw-3rem)] shrink-0 flex-col items-center lg:min-w-[calc(100vw-6rem)]",
              !prefersReducedMotion && "snap-center snap-always",
            )}
          >
            <div className="relative flex h-[560px] w-full max-w-[720px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-white/14 bg-zinc-950/55 shadow-[0_36px_90px_-44px_rgba(103,232,249,0.28)] ring-1 ring-white/10 md:h-[600px]">
              <AppsSectionBackdrop mode="quotes" reducedMotion={prefersReducedMotion} />
              {!prefersReducedMotion ? (
                <>
                  <motion.div
                    className="pointer-events-none absolute left-[6%] top-[18%] z-[1]"
                    style={{ y: metodologiaPx.ySlow }}
                    aria-hidden
                  >
                    <motion.div
                      className="size-[min(300px,62vw)] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.14)_0%,transparent_68%)] blur-3xl md:size-[min(340px,70vw)]"
                      animate={{ opacity: [0.2, 0.42, 0.2], x: [0, 18, 0], y: [0, -12, 0] }}
                      transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </motion.div>
                  <motion.div
                    className="pointer-events-none absolute bottom-[14%] right-[5%] z-[1]"
                    style={{ y: metodologiaPx.yOpposite }}
                    aria-hidden
                  >
                    <motion.div
                      className="size-[min(280px,58vw)] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.13)_0%,transparent_65%)] blur-3xl md:size-[min(320px,65vw)]"
                      animate={{ opacity: [0.18, 0.38, 0.18], x: [0, -14, 0], scale: [1, 1.06, 1] }}
                      transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
                    />
                  </motion.div>
                </>
              ) : null}
              <div className="relative z-10 flex min-h-0 flex-1 flex-col p-7 md:p-9 lg:p-10">
                <motion.div
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: prefersReducedMotion ? 0 : 0.095,
                        delayChildren: prefersReducedMotion ? 0 : 0.04,
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-8%", amount: 0.2 }}
                  className="shrink-0"
                >
                  <motion.span
                    variants={alcanceHeadingChild}
                    className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-white/50"
                  >
                    <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" aria-hidden />
                    METODOLOGÍA
                  </motion.span>
                  <motion.h2
                    variants={alcanceHeadingChild}
                    className="font-display text-3xl tracking-tight text-white md:text-[2.35rem] lg:text-5xl"
                  >
                    Software pensado para tu negocio
                  </motion.h2>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: prefersReducedMotion ? 0 : 0.075,
                        delayChildren: prefersReducedMotion ? 0 : 0.12,
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-8%", amount: 0.15 }}
                  className="mt-6 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-black/35 p-6 shadow-[0_24px_70px_-36px_rgba(103,232,249,0.22)] backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10 md:mt-8 md:rounded-3xl md:p-9 [&_p]:text-white/82"
                >
                  <motion.div variants={alcanceCardVariants}>
                    <ProseMuted>
                      Cada empresa tiene una forma distinta de trabajar. Por eso, antes de escribir una línea de código,
                      entendemos cómo funciona tu negocio.
                    </ProseMuted>
                  </motion.div>
                  <motion.div variants={alcanceCardVariants}>
                    <ProseMuted>
                      Analizamos tus procesos, tus necesidades y tus objetivos para crear una solución realmente útil. El
                      resultado es un sistema que no solo se ve bien, sino que resuelve problemas concretos: organiza
                      información, reduce errores, mejora la comunicación interna y permite tomar mejores decisiones.
                    </ProseMuted>
                  </motion.div>
                  <motion.div variants={alcanceCardVariants} className="relative pl-5 md:pl-6">
                    <span
                      className="absolute top-1 bottom-1 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] opacity-95 shadow-[0_0_20px_rgba(103,232,249,0.35)]"
                      aria-hidden
                    />
                    <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
                      Porque un buen software no es el que tiene más botones. Es el que te ahorra tiempo, te da control y
                      hace que todo fluya mejor.
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </article>

          {/* Tarjeta 2 — Apps web modernas */}
          <article
            data-apps-carousel-card
            className={cn(
              "flex h-full min-w-[calc(100vw-3rem)] shrink-0 flex-col items-center lg:min-w-[calc(100vw-6rem)]",
              !prefersReducedMotion && "snap-center snap-always",
            )}
          >
            <div className="relative flex h-[560px] w-full max-w-[720px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-white/12 bg-zinc-950/40 shadow-[0_36px_90px_-44px_rgba(167,139,250,0.15)] ring-1 ring-cyan-400/10 md:h-[600px]">
              <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(103,232,249,0.12)_0%,transparent_52%)]" />
              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center p-7 md:p-9 lg:p-10">
                <h2 className="shrink-0 font-display text-3xl tracking-tight text-white md:text-[2.35rem] lg:text-5xl">
                  Apps web modernas, rápidas y escalables
                </h2>
                <div className="mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pr-1 md:mt-8">
                  <ProseMuted>
                    Diseñamos aplicaciones web accesibles desde cualquier dispositivo, sin necesidad de instalaciones
                    complicadas. Tu equipo puede ingresar desde una computadora, tablet o celular, con usuarios, permisos y
                    funciones adaptadas a cada área.
                  </ProseMuted>
                  <ProseMuted>
                    Trabajamos con tecnologías modernas para crear sistemas rápidos, seguros y preparados para crecer
                    junto a tu empresa.
                  </ProseMuted>
                  <ProseMuted>
                    Tu app puede comenzar como una herramienta simple y evolucionar con nuevas funciones, módulos,
                    integraciones e inteligencia artificial.
                  </ProseMuted>
                </div>
              </div>
            </div>
          </article>

          {/* Tarjeta 3 — IA */}
          <article
            data-apps-carousel-card
            className={cn(
              "flex h-full min-w-[calc(100vw-3rem)] shrink-0 flex-col items-center lg:min-w-[calc(100vw-6rem)]",
              !prefersReducedMotion && "snap-center snap-always",
            )}
          >
            <div className="relative flex h-[560px] w-full max-w-[720px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-white/14 bg-zinc-950/50 shadow-[0_36px_90px_-44px_rgba(236,168,214,0.12)] ring-1 ring-violet-400/12 md:h-[600px]">
              <AppsSectionBackdrop mode="capabilities" reducedMotion={prefersReducedMotion} />
              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center p-7 md:p-9 lg:p-10">
                <span className="mb-4 inline-flex shrink-0 items-center gap-3 font-mono text-sm text-white/50">
                  <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" aria-hidden />
                  INTELIGENCIA ARTIFICIAL
                </span>
                <h2 className="shrink-0 font-display text-3xl tracking-tight text-white md:text-[2.35rem] lg:text-5xl">
                  Inteligencia Artificial aplicada al software
                </h2>
                <div className="mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pr-1 md:mt-8">
                  <ProseMuted>
                    Integramos IA para que tu sistema no solo almacene información, sino que también ayude a
                    interpretarla.
                  </ProseMuted>
                  <ProseMuted>
                    Podemos incorporar asistentes inteligentes, generación automática de reportes, análisis de datos,
                    lectura de documentos, clasificación de información, respuestas automáticas y procesos asistidos por
                    IA.
                  </ProseMuted>
                  <p className="text-lg leading-relaxed text-white/75 md:text-xl">
                    La idea no es usar inteligencia artificial por moda. Es usarla donde realmente aporta: ahorrar tiempo,
                    reducir tareas repetitivas y mejorar la toma de decisiones.
                  </p>
                </div>
              </div>
            </div>
          </article>

        </div>
      </motion.section>

      {/* Beneficios */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnterTight}>
        <AppsSectionBackdrop mode="quotes" reducedMotion={prefersReducedMotion} />
        <SectionDivider />
        <div className="relative z-10 mx-auto max-w-[1000px] px-6 lg:px-12">
          <h2 className="sr-only">Beneficios para tu empresa</h2>
          <BeneficiosParallaxMarquee lines={beneficios} />
          <motion.ul
            className="mt-10 space-y-2 md:space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%", amount: 0.12 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.085,
                  delayChildren: prefersReducedMotion ? 0 : 0.06,
                },
              },
            }}
          >
            {beneficios.map((b) => (
              <motion.li
                key={b}
                variants={{
                  hidden: { opacity: 0, x: -36, filter: "blur(8px)" },
                  show: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.62, ease: easePremium },
                  },
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        x: 10,
                        transition: { type: "spring", stiffness: 420, damping: 28 },
                      }
                }
                className="group relative flex gap-3 rounded-xl border border-transparent px-3 py-2.5 text-base leading-relaxed text-white/70 transition-colors duration-300 hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-white/88 md:gap-4 md:text-lg"
              >
                <span
                  className="mt-2 size-2 shrink-0 rounded-full bg-gradient-to-br from-[#67e8f9] to-[#a78bfa] shadow-[0_0_14px_rgba(167,139,250,0.4)] transition-transform duration-300 group-hover:scale-125 group-hover:shadow-[0_0_22px_rgba(103,232,249,0.45)]"
                  aria-hidden
                />
                <span className="relative">
                  {b}
                  <span
                    className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-[#67e8f9]/70 via-[#a78bfa]/50 to-transparent opacity-0 transition-all duration-500 group-hover:w-full group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.p
            className="mt-12 border-l-2 border-white/25 pl-6 font-display text-xl text-white/90 md:mt-14 md:text-2xl"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%", amount: 0.2 }}
            transition={{ duration: 0.85, ease: easePremium, delay: 0.08 }}
          >
            Un sistema bien diseñado no es un gasto: es infraestructura para crecer.
          </motion.p>
        </div>
      </motion.section>

      {/* Frases destacadas */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnter}>
        <AppsSectionBackdrop mode="quotes" reducedMotion={prefersReducedMotion} />
        <SectionDivider />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <span className="mb-8 inline-flex items-center gap-3 font-mono text-sm text-white/50">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
            ENFOQUE
          </span>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <blockquote className="rounded-2xl border border-white/12 bg-white/[0.03] p-8 md:p-10">
              <p className="font-display text-2xl leading-snug tracking-tight text-white md:text-3xl">
                Creamos software que trabaja con vos,{" "}
                <span className="bg-gradient-to-r from-[#67e8f9] to-[#a78bfa] bg-clip-text text-transparent">
                  no contra vos.
                </span>
              </p>
            </blockquote>
            <blockquote className="rounded-2xl border border-white/12 bg-white/[0.03] p-8 md:p-10">
              <p className="font-display text-2xl leading-snug tracking-tight text-white md:text-3xl">
                Convertimos procesos desordenados en sistemas{" "}
                <span className="text-white/90">simples, inteligentes y escalables.</span>
              </p>
            </blockquote>
          </div>
          <p className="mx-auto mt-14 max-w-3xl text-center text-xl leading-relaxed text-white/65 md:text-2xl">
            Tu empresa tiene una forma única de trabajar.{" "}
            <span className="text-white">Tu software también debería tenerla.</span>
          </p>
        </div>
      </motion.section>

      {/* Proceso */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnter}>
        <AppsSectionBackdrop mode="quotes" reducedMotion={prefersReducedMotion} />
        <SectionDivider />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-12">
          <span className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-white/50">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
            CÓMO TRABAJAMOS
          </span>
          <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">Nuestro proceso</h2>
          {!prefersReducedMotion ? (
            <p className="mt-3 max-w-2xl text-sm text-white/45 md:text-base">
              Pasá el cursor sobre el bloque para animar los pasos.
            </p>
          ) : null}
          <p className="sr-only">
            Etapas del proceso en orden: diagnóstico, diseño de solución, desarrollo, pruebas y ajustes,
            implementación y evolución.
          </p>
          <div className="-mx-4 mt-8 overflow-x-auto px-2 pb-4 md:mx-0 md:overflow-visible md:px-0">
            <LayeredText lines={[...procesoLayeredLines]} reducedMotion={!!prefersReducedMotion} />
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 pb-24 pt-12 md:pb-32" {...sectionEnterTight}>
        <AppsSectionBackdrop mode="cta" reducedMotion={prefersReducedMotion} />
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
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                ¿Tenés una idea o un proceso que querés digitalizar?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                En <span className="font-medium text-white">Cosecha Creativa</span> podemos ayudarte a convertirlo en una
                app web, un sistema interno o una plataforma escalable.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                Contanos qué necesitás ordenar, automatizar o mejorar, y diseñamos una solución a medida para tu empresa.
              </p>
              <p className="mt-6 font-display text-xl text-white md:text-2xl">Hablemos de tu próximo software.</p>
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
                <a href={getWhatsAppHref("Apps / software a medida")} target="_blank" rel="noopener noreferrer">
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
                <a href="mailto:contacto@cosechacreativa.com.ar?subject=Apps%20%2F%20software%20a%20medida">Email</a>
              </Button>
              <Button variant="ghost" size="sm" className="h-11 justify-start text-white/55 hover:text-white md:h-10" asChild>
                <a href="/servicios/diseno-web" className="gap-1.5 px-2">
                  Ver diseño web
                  <ArrowUpRight className="size-4 shrink-0" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-16 lg:py-20"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px", amount: 0.2 }}
        transition={{ duration: 0.85, ease: easePremium }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(103,232,249,0.06)_0%,transparent_55%)]" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-[640px] flex-col items-center px-6">
          <span className="mb-6 font-mono text-xs tracking-[0.2em] text-white/40">ARQUITECTURA</span>
          <CpuArchitecture
            className="h-auto w-full max-w-[520px] text-white/55"
            height="220px"
            text="CPU"
            animateLines={!prefersReducedMotion}
            animateMarkers={!prefersReducedMotion}
            animateText={!prefersReducedMotion}
          />
        </div>
      </motion.section>

      <motion.div {...footerEnter}>
        <FooterSection />
      </motion.div>
    </main>
  )
}
