"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState, type ComponentType, type MouseEvent } from "react"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  Code2,
  Cog,
  Database,
  Gauge,
  HeartHandshake,
  Layers,
  Lightbulb,
  Link2Off,
  MessageCircle,
  Sparkles as SparklesIcon,
  Timer,
  Store,
  Target,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spotlight } from "@/components/ui/spotlight"
import { SparklesCore } from "@/components/ui/sparkles"
import { SplineScene } from "@/components/ui/spline-scene"
import { IaSplineRobot } from "@/components/landing/servicios/ia-spline-robot"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"
import { CardScanner } from "@/components/landing/servicios/card-scanner"
import { CosechaIaAgentPlan } from "@/components/landing/servicios/cosecha-ia-agent-plan"
import { CosechaIaChatMedida } from "@/components/landing/servicios/cosecha-ia-chat-medida"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

const VIDEO_POSTER = "/images/bridge.png"
/** Video de fondo sección «El problema»: `public/ia/1/cinematic_202605032307.*` */
const PROBLEMA_BG_VIDEO_SOURCES = [
  "/ia/1/cinematic_202605032307.mp4",
  "/ia/1/cinematic_202605032307.webm",
  "/ia/1/cinematic_202605032307.mov",
] as const
/** Escena 3D (misma URL que en `public/LO9Dx1UhR8y`) */
const SPLINE_SCENE_URL = "https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode"

const CONTACT_EMAIL = "contacto@cosechacreativa.com.ar"

const easePremium = [0.22, 1, 0.36, 1] as const

/** Ritmo vertical compacto — menos “hueco” entre bloques */
const SECTION_PAD = "py-10 lg:py-14"

const footerEnter = {
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px", amount: 0.15 },
  transition: { duration: 0.88, ease: easePremium },
} as const

const heroItemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easePremium },
  },
} as const

const methodology = [
  {
    step: "01",
    title: "Diagnóstico",
    body: "Entendemos procesos, herramientas y dolores reales: qué automatizar primero y qué no tocar.",
  },
  {
    step: "02",
    title: "Diseño de flujos",
    body: "Definimos agentes, disparadores, datos sensibles y responsables humanos en cada paso.",
  },
  {
    step: "03",
    title: "Implementación",
    body: "Construimos, conectamos y probamos con tu equipo hasta que el flujo sea confiable.",
  },
  {
    step: "04",
    title: "Medición",
    body: "Seguimos métricas simples: tiempo ahorrado, leads atendidos, errores evitados — y ajustamos.",
  },
] as const

const METHODOLOGY_CARD_ACCENTS = [
  {
    border: "border-violet-400/18 hover:border-violet-400/35",
    mesh: "bg-[radial-gradient(ellipse_130%_90%_at_15%_-10%,rgba(167,139,250,0.35),transparent_58%)]",
    stepClass: "bg-gradient-to-br from-violet-100 via-fuchsia-200 to-violet-400 bg-clip-text text-transparent",
    hoverGlow: "hover:shadow-[0_28px_56px_-26px_rgba(139,92,246,0.48)]",
  },
  {
    border: "border-cyan-400/18 hover:border-cyan-400/35",
    mesh: "bg-[radial-gradient(ellipse_130%_90%_at_85%_0%,rgba(34,211,238,0.28),transparent_55%)]",
    stepClass: "bg-gradient-to-br from-cyan-100 via-teal-200 to-cyan-500 bg-clip-text text-transparent",
    hoverGlow: "hover:shadow-[0_28px_56px_-26px_rgba(34,211,238,0.4)]",
  },
  {
    border: "border-amber-400/18 hover:border-amber-400/32",
    mesh: "bg-[radial-gradient(ellipse_120%_100%_at_50%_110%,rgba(251,191,36,0.22),transparent_50%)]",
    stepClass: "bg-gradient-to-br from-amber-100 via-orange-200 to-amber-500 bg-clip-text text-transparent",
    hoverGlow: "hover:shadow-[0_28px_56px_-26px_rgba(245,158,11,0.38)]",
  },
  {
    border: "border-emerald-400/18 hover:border-emerald-400/32",
    mesh: "bg-[radial-gradient(ellipse_110%_90%_at_10%_90%,rgba(52,211,153,0.26),transparent_52%)]",
    stepClass: "bg-gradient-to-br from-emerald-100 via-teal-200 to-emerald-500 bg-clip-text text-transparent",
    hoverGlow: "hover:shadow-[0_28px_56px_-26px_rgba(16,185,129,0.4)]",
  },
] as const

const useCases = [
  {
    title: "Comercios y marcas locales",
    body: "Consultas repetidas, stock, turnos y campañas: menos pérdida de mensajes en horas pico.",
    icon: Store,
  },
  {
    title: "Profesionales y estudios",
    body: "Seguimiento de clientes, recordatorios y documentación sin vivir en la bandeja de entrada.",
    icon: Building2,
  },
  {
    title: "Instituciones",
    body: "Centralizar consultas, canalizar pedidos y mantener trazabilidad sin saturar al equipo.",
    icon: Layers,
  },
  {
    title: "Equipos en crecimiento",
    body: "Escalar atención y reporting cuando contratar más no alcanza o no cierra por números.",
    icon: Gauge,
  },
] as const

const USE_CASE_CARD_ACCENTS = [
  {
    mesh: "bg-[radial-gradient(ellipse_110%_85%_at_12%_-5%,rgba(244,114,182,0.22),transparent_58%)]",
    iconWrap: "border-rose-400/30 bg-rose-500/[0.12] text-rose-50 shadow-[0_0_28px_-8px_rgba(244,114,182,0.45)]",
    chip: "text-rose-200/85",
  },
  {
    mesh: "bg-[radial-gradient(ellipse_110%_85%_at_92%_8%,rgba(56,189,248,0.2),transparent_56%)]",
    iconWrap: "border-sky-400/30 bg-sky-500/[0.11] text-sky-50 shadow-[0_0_28px_-8px_rgba(56,189,248,0.4)]",
    chip: "text-sky-200/85",
  },
  {
    mesh: "bg-[radial-gradient(ellipse_95%_95%_at_48%_105%,rgba(167,139,250,0.22),transparent_52%)]",
    iconWrap: "border-violet-400/30 bg-violet-500/[0.11] text-violet-50 shadow-[0_0_28px_-8px_rgba(167,139,250,0.42)]",
    chip: "text-violet-200/85",
  },
  {
    mesh: "bg-[radial-gradient(ellipse_105%_80%_at_22%_102%,rgba(52,211,153,0.2),transparent_55%)]",
    iconWrap: "border-emerald-400/30 bg-emerald-500/[0.11] text-emerald-50 shadow-[0_0_28px_-8px_rgba(52,211,153,0.4)]",
    chip: "text-emerald-200/85",
  },
] as const

type IaService = {
  id: string
  name: string
  description: string
  detail: string
  bullets: readonly string[]
  Icon: ComponentType<{ className?: string }>
  /** Tailwind gradient classes for card glow */
  accent: string
  ringAccent: string
}

/** Servicios — tarjetas + contenido ampliado para modal */
const iaServices: readonly IaService[] = [
  {
    id: "chatbots",
    name: "Chatbots inteligentes",
    description:
      "WhatsApp, web e Instagram con respuestas alineadas a tu marca y a tus procesos internos.",
    detail:
      "Diseñamos conversaciones que suenan a tu marca, respetan políticas internas y saben cuándo pasar el caso a una persona.",
    bullets: [
      "Canales: WhatsApp Business, Instagram, widget web",
      "Tono y FAQs acordes a tu negocio",
      "Handoff a humano con contexto del chat",
      "Métricas de conversación y cuellos de botella",
    ],
    Icon: MessageCircle,
    accent: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    ringAccent: "group-hover:border-violet-400/35",
  },
  {
    id: "agentes",
    name: "Agentes conectados",
    description: "Integración con Sheets, Gmail, CRM, WordPress, formularios, calendarios y bases de datos.",
    detail:
      "Los agentes no viven aislados: leen y escriben donde ya trabaja tu equipo, con permisos y logs claros.",
    bullets: [
      "Google Sheets / Excel, Gmail, CRM y calendarios",
      "WordPress, formularios y webhooks",
      "Sincronización y evitar datos duplicados",
      "Roles: qué puede hacer la IA y qué no",
    ],
    Icon: Bot,
    accent: "from-cyan-500/20 via-blue-500/10 to-transparent",
    ringAccent: "group-hover:border-cyan-400/35",
  },
  {
    id: "n8n",
    name: "Automatización con n8n",
    description: "Flujos robustos entre sistemas: menos errores manuales y más trazabilidad.",
    detail:
      "Orquestamos procesos entre APIs y herramientas con flujos revisables, reintentos y alertas cuando algo falla.",
    bullets: [
      "Flujos entre sistemas sin copy-paste",
      "Errores visibles y notificaciones",
      "Versionado y documentación del flujo",
      "Escalado cuando crece el volumen",
    ],
    Icon: Cog,
    accent: "from-amber-500/20 via-orange-500/8 to-transparent",
    ringAccent: "group-hover:border-amber-400/35",
  },
  {
    id: "mkt",
    name: "IA para marketing y ventas",
    description: "Contenido, priorización de leads y seguimiento sin quemar al equipo.",
    detail:
      "Priorizamos impacto: borradores, resúmenes y seguimiento comercial con criterio humano en las decisiones finales.",
    bullets: [
      "Borradores y variantes de mensajes",
      "Priorización y etiquetado de leads",
      "Secuencias de seguimiento coherentes",
      "Sin prometer resultados mágicos",
    ],
    Icon: Target,
    accent: "from-rose-500/20 via-pink-500/10 to-transparent",
    ringAccent: "group-hover:border-rose-400/35",
  },
  {
    id: "dashboards",
    name: "Dashboards inteligentes",
    description: "Métricas y alertas para decidir con datos reunidos en un solo lugar.",
    detail:
      "Unificamos fuentes dispersas en vistas claras y alertas cuando un indicador se sale de rango.",
    bullets: [
      "KPIs en un solo panel",
      "Alertas por umbral o anomalías simples",
      "Export y lectura para reuniones",
      "Menos Excel fuera de control",
    ],
    Icon: BarChart3,
    accent: "from-emerald-500/22 via-teal-500/10 to-transparent",
    ringAccent: "group-hover:border-emerald-400/35",
  },
  {
    id: "software",
    name: "Software con IA",
    description: "Desarrollo a medida cuando tu caso necesita algo más que integraciones estándar.",
    detail:
      "Cuando no alcanza con ‘conectar cajas’, diseñamos pantallas, APIs y lógica propia con IA donde suma.",
    bullets: [
      "Productos web a medida",
      "APIs y bases según tu operación",
      "IA embebida donde aporta valor",
      "Entregas iterativas con tu equipo",
    ],
    Icon: Code2,
    accent: "from-indigo-500/25 via-purple-500/12 to-transparent",
    ringAccent: "group-hover:border-indigo-400/35",
  },
] as const

function IaServiceModalBody({
  service,
  onNavigateWhatsApp,
}: {
  service: IaService
  onNavigateWhatsApp: () => void
}) {
  const ServiceIcon = service.Icon
  return (
    <>
      <div
        className={cn(
          "relative border-b border-white/[0.08] px-6 pb-8 pt-8 md:px-8",
          "bg-gradient-to-br from-zinc-900/95 via-[#0c0a10] to-black",
        )}
      >
        <div
          className={cn("pointer-events-none absolute inset-0 opacity-90 bg-gradient-to-br", service.accent)}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-black/45" aria-hidden />
        <div className="relative flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-black/60 text-[#a5f3fc] shadow-lg backdrop-blur-sm">
            <ServiceIcon className="size-7" strokeWidth={1.15} aria-hidden />
          </span>
          <DialogHeader className="flex-1 space-y-2 text-left">
            <DialogTitle className="font-display text-2xl leading-tight text-white md:text-[1.65rem]">
              {service.name}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-white/70">{service.detail}</DialogDescription>
          </DialogHeader>
        </div>
      </div>
      <div className="space-y-4 px-6 py-6 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">En la práctica</p>
        <ul className="space-y-3">
          {service.bullets.map((line) => (
            <li key={line} className="flex gap-3 text-[15px] leading-snug text-white/78">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#67e8f9]/85" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <DialogFooter className="flex-col gap-3 border-t border-white/[0.07] bg-black/50 px-6 py-5 sm:flex-row sm:justify-between md:px-8">
        <DialogClose asChild>
          <Button type="button" variant="ghost" className="text-white/70 hover:bg-white/10 hover:text-white">
            Cerrar
          </Button>
        </DialogClose>
        <Button
          asChild
          className="rounded-full bg-gradient-to-br from-[#25D366] via-[#1ebe57] to-[#128C7E] px-8 font-semibold text-white shadow-[0_12px_40px_-12px_rgba(37,211,102,0.45)] hover:brightness-105"
        >
          <a
            href={getWhatsAppHref(`Consulta IA: ${service.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
            onClick={onNavigateWhatsApp}
          >
            <WhatsAppMark className="size-[17px]" aria-hidden />
            Consultar por WhatsApp
          </a>
        </Button>
      </DialogFooter>
    </>
  )
}

function MethodologyStepCard({
  item,
  index,
  reduceMotion,
}: {
  item: (typeof methodology)[number]
  index: number
  reduceMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 280, damping: 34 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 280, damping: 34 })
  const accent = METHODOLOGY_CARD_ACCENTS[index % METHODOLOGY_CARD_ACCENTS.length]

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function handleLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className="relative h-full min-h-[220px] [perspective:960px]">
      <motion.div
        ref={ref}
        style={
          reduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-950/75 p-6 pt-[4.25rem] backdrop-blur-md transition-[box-shadow,border-color] duration-300",
          accent.border,
          !reduceMotion && accent.hoverGlow,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100",
            accent.mesh,
          )}
          style={{ transform: "translateZ(-14px) scale(1.02)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] via-transparent to-transparent opacity-40"
          style={{ transform: "translateZ(2px)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ transform: "translateZ(16px)" }}
          aria-hidden
        />
        <span
          className={cn(
            "absolute left-5 top-5 font-mono text-4xl font-extralight tracking-tight",
            reduceMotion ? "text-white/18" : accent.stepClass,
          )}
          style={{ transform: "translateZ(28px)" }}
        >
          {item.step}
        </span>
        <h3 className="relative font-display text-xl text-white" style={{ transform: "translateZ(22px)" }}>
          {item.title}
        </h3>
        <p className="relative mt-3 text-sm leading-relaxed text-white/58" style={{ transform: "translateZ(14px)" }}>
          {item.body}
        </p>
        {!reduceMotion ? (
          <div
            className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-[#67e8f9]/12 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50"
            style={{ transform: "translateZ(8px)" }}
            aria-hidden
          />
        ) : null}
      </motion.div>
    </div>
  )
}

function UseCaseParallaxCard({
  item,
  index,
  scrollProgress,
  reduceMotion,
}: {
  item: (typeof useCases)[number]
  index: number
  scrollProgress: MotionValue<number>
  reduceMotion: boolean
}) {
  const accent = USE_CASE_CARD_ACCENTS[index % USE_CASE_CARD_ACCENTS.length]
  const parallaxY = useTransform(scrollProgress, [0, 1], [22 + index * 14, -36 - index * 20])
  const Icon = item.icon

  return (
    <motion.div style={reduceMotion ? undefined : { y: parallaxY }} className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px", amount: 0.25 }}
        transition={{ delay: index * 0.08, duration: 0.72, ease: easePremium }}
        whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.35, ease: easePremium } }}
        className="group relative flex h-full gap-5 overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-zinc-950/65 p-7 shadow-[0_24px_60px_-44px_rgba(0,0,0,0.85)] backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-white/[0.16] hover:shadow-[0_32px_72px_-40px_rgba(103,232,249,0.18)] md:gap-6 md:p-8"
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-75 transition-opacity duration-500 group-hover:opacity-100",
            accent.mesh,
          )}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-50"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden />
        <div
          className={cn(
            "relative flex size-14 shrink-0 items-center justify-center rounded-2xl border md:size-[3.75rem]",
            accent.iconWrap,
          )}
        >
          <Icon className="size-7 md:size-[1.85rem]" strokeWidth={1.12} aria-hidden />
        </div>
        <div className="relative min-w-0 flex-1 pt-0.5">
          <p className={cn("mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em]", accent.chip)}>
            Caso típico
          </p>
          <h3 className="font-display text-xl leading-snug text-white md:text-[1.35rem]">{item.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-white/62">{item.body}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SectionParticlesLayer({
  uid,
  reduceMotion,
  color,
  density = 36,
  opacityClass = "opacity-[0.4] md:opacity-[0.52]",
}: {
  uid: string
  reduceMotion: boolean
  color: string
  density?: number
  opacityClass?: string
}) {
  if (reduceMotion) return null
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-[1] overflow-hidden mix-blend-screen", opacityClass)}
      aria-hidden
    >
      <SparklesCore
        id={`ia-section-${uid}`}
        className="h-full min-h-[260px] w-full"
        background="rgba(0,0,0,0)"
        particleColor={color}
        minSize={0.12}
        maxSize={0.95}
        speed={1.15}
        particleDensity={density}
        interactive={false}
      />
    </div>
  )
}

const problemaSignals = [
  {
    text: "Consultas que se pierden entre mensajes y mails.",
    icon: Link2Off,
  },
  {
    text: "Reportes armados a mano cada semana.",
    icon: Database,
  },
  {
    text: "Respuestas lentas que enfriaron oportunidades reales.",
    icon: Timer,
  },
] as const

export function CosechaIaClient() {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = prefersReducedMotion === true

  /** Progreso de scroll de toda la página → barra superior + (futuro) reactividad global */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })
  const [openServiceId, setOpenServiceId] = useState<string | null>(null)
  const activeService = iaServices.find((s) => s.id === openServiceId) ?? null
  const problemaSectionRef = useRef<HTMLElement>(null)
  const problemaVideoRef = useRef<HTMLVideoElement>(null)
  const serviciosSectionRef = useRef<HTMLElement>(null)
  const casosSectionRef = useRef<HTMLElement>(null)
  const metodologiaSectionRef = useRef<HTMLElement>(null)
  const chatMedidaSectionRef = useRef<HTMLElement>(null)
  const agentesSectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress: serviciosScroll } = useScroll({
    target: serviciosSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: casosScroll } = useScroll({
    target: casosSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: metodologiaScroll } = useScroll({
    target: metodologiaSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: chatMedidaScroll } = useScroll({
    target: chatMedidaSectionRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: agentesScroll } = useScroll({
    target: agentesSectionRef,
    offset: ["start end", "end start"],
  })

  /** Parallax depth for #servicios — stars / grid / glow move at different rates */
  const serviciosStarsY = useTransform(serviciosScroll, [0, 1], [72, -120])
  const serviciosGridY = useTransform(serviciosScroll, [0, 1], [28, -62])
  const serviciosGridOpacity = useTransform(serviciosScroll, [0, 0.35, 0.65, 1], [0.45, 0.85, 0.78, 0.5])
  const serviciosGlowY = useTransform(serviciosScroll, [0, 1], [36, -88])

  /** Parallax decor #casos */
  const casosBlobPrimaryY = useTransform(casosScroll, [0, 1], [64, -92])
  const casosBlobSecondaryY = useTransform(casosScroll, [0, 1], [36, -120])
  const casosGridFadeY = useTransform(casosScroll, [0, 1], [20, -58])
  const casosHeaderY = useTransform(casosScroll, [0, 1], [12, -28])
  const casosRadialGlowY = useTransform(casosScroll, [0, 1], [18, -52])

  /** Parallax fondo #metodologia */
  const metaGlowCyanY = useTransform(metodologiaScroll, [0, 1], [56, -78])
  const metaGlowVioletY = useTransform(metodologiaScroll, [0, 1], [24, -105])
  const metaGridParallaxY = useTransform(metodologiaScroll, [0, 1], [38, -68])
  const metaBlobAccentY = useTransform(metodologiaScroll, [0, 1], [44, -88])
  const metaHeaderParallaxY = useTransform(metodologiaScroll, [0, 1], [10, -22])

  /** Parallax fondo #chat-medida */
  const chatBlobPrimaryY = useTransform(chatMedidaScroll, [0, 1], [46, -74])
  const chatBlobSecondaryY = useTransform(chatMedidaScroll, [0, 1], [30, -98])
  const chatGridParallaxY = useTransform(chatMedidaScroll, [0, 1], [22, -54])
  const chatRadialGlowY = useTransform(chatMedidaScroll, [0, 1], [12, -46])

  /** Parallax fondo #agentes-autonomos */
  const agentesBlobPrimaryY = useTransform(agentesScroll, [0, 1], [50, -82])
  const agentesBlobSecondaryY = useTransform(agentesScroll, [0, 1], [34, -104])
  const agentesGridParallaxY = useTransform(agentesScroll, [0, 1], [20, -58])
  const agentesRadialGlowY = useTransform(agentesScroll, [0, 1], [14, -50])

  const sectionReveal = reduceMotion
    ? ({
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-14%" as const, amount: 0.18 },
        transition: { duration: 0.42 },
      } as const)
    : ({
        initial: { opacity: 0, y: 52 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-6%" as const, amount: 0.22 },
        transition: { duration: 0.82, ease: easePremium },
      } as const)

  useEffect(() => {
    if (reduceMotion) return
    const section = problemaSectionRef.current
    const video = problemaVideoRef.current
    if (!section || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {})
          } else {
            video.pause()
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px" },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [reduceMotion])

  const heroContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.06,
      },
    },
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />

      {/* Constelación de datos 3D detrás de TODA la página (red neuronal elegante
          que desciende con el scroll y acompaña al cursor). */}
      <TechConstellation />

      {/* Barra de progreso de scroll — efecto de scroll nítido, paleta tech */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#67e8f9] via-[#c4b5fd] to-[#e879f9] shadow-[0_0_12px_rgba(103,232,249,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      {/* Hero — mismo stack visual que LO9Dx1UhR8y (gradiente, sparkles, spotlight, Spline) */}
      <motion.section
        className="relative overflow-hidden bg-black/45 pt-24 pb-8 md:pt-28 md:pb-10"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: easePremium }}
      >
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <div className="relative z-10 w-full">
          <div className="px-4 pb-2 md:px-8 lg:px-12">
            <motion.div variants={heroContainerVariants} initial="hidden" animate="show">
              <motion.div variants={heroItemVariants}>
                <Link
                  href="/"
                  className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  Volver al inicio
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <Card className="relative mt-0 w-full max-w-none overflow-hidden rounded-none border-x-0 border-white/12 bg-black/95 p-0 shadow-[0_40px_120px_-60px_rgba(167,139,250,0.25)] md:mt-2 md:mx-4 md:max-w-[calc(100%-2rem)] md:rounded-[1.75rem] md:border-x md:border-white/12 lg:mx-auto lg:max-w-[1400px] lg:rounded-[2rem]">
            <AnimatedGradientBackground
              Breathing={!reduceMotion}
              gradientColors={[
                "#050505",
                "#1a1520",
                "#0f1729",
                "#134e4a",
                "#1e1b2e",
                "#0d1f1c",
                "#030303",
              ]}
              gradientStops={[36, 48, 55, 62, 70, 82, 100]}
              containerClassName="opacity-80"
            />
            {!reduceMotion && (
              <SparklesCore
                id="ia-hero-sparkles"
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                background="#030303"
                minSize={0.4}
                maxSize={1.2}
                particleDensity={80}
                particleColor="#c4b5fd"
                speed={2}
              />
            )}
            <Spotlight className="-top-32 left-0 md:-top-20 md:left-40" size={240} />

            <div className="relative z-10 flex min-h-[min(520px,72vh)] flex-col lg:flex-row">
              <motion.div
                variants={heroContainerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-1 flex-col justify-center p-6 md:p-10"
              >
                <motion.span
                  variants={heroItemVariants}
                  className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-white/70"
                >
                  <SparklesIcon className="size-3.5 text-[#c4b5fd]" aria-hidden />
                  COSECHA CREATIVA IA · SAN JUAN
                </motion.span>

                <motion.h1
                  variants={heroItemVariants}
                  className="max-w-[min(100%,900px)] font-display text-[clamp(2.35rem,6.8vw,4.75rem)] leading-[0.95] tracking-tight text-white"
                >
                  Inteligencia Artificial para{" "}
                  <span className="bg-gradient-to-r from-[#eca8d6] via-[#c4b5fd] to-[#67e8f9] bg-clip-text text-transparent">
                    escalar tu empresa
                  </span>
                </motion.h1>

                <motion.p
                  variants={heroItemVariants}
                  className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
                >
                  Conectamos agentes de IA con las herramientas de tu negocio para automatizar procesos, mejorar la
                  atención y transformar datos en decisiones — sin humo técnico ni promesas mágicas.
                </motion.p>

                <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    asChild
                    className={cn(
                      "group relative h-12 gap-2 overflow-hidden rounded-full border-0 px-7 text-[13px] font-semibold text-white md:h-[3.25rem] md:px-9",
                      "bg-gradient-to-br from-[#25D366] via-[#1ebe57] to-[#128C7E]",
                      "shadow-[0_14px_44px_-12px_rgba(37,211,102,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]",
                      "transition-all duration-300 hover:brightness-[1.06] hover:shadow-[0_18px_52px_-10px_rgba(37,211,102,0.68)] active:scale-[0.98]",
                      "focus-visible:ring-2 focus-visible:ring-[#4ade80]/90 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                      "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-transparent before:to-white/14 before:opacity-0 before:transition-opacity hover:before:opacity-100",
                    )}
                  >
                    <a
                      href={getWhatsAppHref("Cosecha Creativa IA — diagnóstico")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center gap-2.5"
                    >
                      <span className="flex size-8 items-center justify-center rounded-full bg-black/15 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                        <WhatsAppMark className="size-[17px] text-white drop-shadow-sm" aria-hidden />
                      </span>
                      Solicitar diagnóstico
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={cn(
                      "group h-12 gap-2 rounded-full border-white/[0.22] bg-white/[0.06] px-7 text-[13px] font-semibold text-white backdrop-blur-md md:h-[3.25rem] md:px-9",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300",
                      "hover:border-[#67e8f9]/45 hover:bg-[linear-gradient(135deg,rgba(103,232,249,0.14),rgba(167,139,250,0.1))] hover:text-white hover:shadow-[0_0_36px_-10px_rgba(103,232,249,0.45)]",
                    )}
                  >
                    <a href="#servicios" className="inline-flex items-center gap-2">
                      Ver soluciones
                      <ArrowDown className="size-4 text-[#67e8f9]/90 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              <div className="relative min-h-[280px] flex-1 lg:min-h-0">
                {reduceMotion ? (
                  <Image
                    src={VIDEO_POSTER}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <SplineScene scene={SPLINE_SCENE_URL} className="h-full min-h-[280px] w-full lg:min-h-full" />
                )}
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Problema */}
      <motion.section
        ref={problemaSectionRef}
        id="problema"
        className={cn("relative scroll-mt-28 overflow-hidden bg-black", SECTION_PAD)}
        {...sectionReveal}
      >
        {reduceMotion ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_85%_at_50%_15%,rgba(76,29,149,0.22)_0%,rgba(0,0,0,0.92)_55%)]"
            aria-hidden
          />
        ) : (
          <video
            ref={problemaVideoRef}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-105 object-cover opacity-[0.68] saturate-[0.85]"
            muted
            playsInline
            preload="metadata"
            loop={false}
            poster={VIDEO_POSTER}
            aria-hidden
          >
            {PROBLEMA_BG_VIDEO_SOURCES.map((src) => (
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
        )}
        {/* Velado ligero: el vídeo se nota; lectura del texto sigue cómoda */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/38 to-black/62"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_70%_at_50%_25%,transparent_0%,rgba(0,0,0,0.28)_100%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#a78bfa]/35 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-16">
            <div>
              <span className="liquid-glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                <span className="size-1.5 rounded-full bg-[#f472b6] shadow-[0_0_12px_rgba(244,114,182,0.7)]" aria-hidden />
                El problema
              </span>
              <h2 className="font-display text-[clamp(1.85rem,4.2vw,3.25rem)] leading-[1.08] tracking-tight text-white">
                Herramientas sueltas, datos sin conversar entre sí y equipos atrapados en{" "}
                <span className="bg-gradient-to-r from-[#fca5a5] via-[#c4b5fd] to-[#67e8f9] bg-clip-text text-transparent">
                  tareas repetitivas
                </span>
                .
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/72 md:text-xl">
                Muchas empresas en San Juan ya usan WhatsApp, planillas y CRM… pero todo vive en silos. La IA sirve para
                unir esos puntos con criterio: priorizar, responder y liberar tiempo sin perder el control humano.
              </p>
              <div className="mt-10 hidden h-px max-w-md bg-gradient-to-r from-[#a78bfa]/60 via-[#67e8f9]/40 to-transparent lg:block" aria-hidden />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: easePremium }}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.07] via-black/50 to-black/80 p-8 shadow-[0_32px_80px_-40px_rgba(103,232,249,0.15)] backdrop-blur-md md:p-10"
            >
              <div className="pointer-events-none absolute -right-16 top-0 size-48 rounded-full bg-[#67e8f9]/10 blur-3xl" aria-hidden />
              <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[#67e8f9]/85">
                Señales típicas
              </p>
              <ul className="mt-6 space-y-5">
                {problemaSignals.map(({ text, icon: Icon }) => (
                  <li key={text} className="flex gap-4">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-[#a5f3fc]">
                      <Icon className="size-5" strokeWidth={1.25} aria-hidden />
                    </span>
                    <span className="text-base leading-snug text-white/82">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easePremium }}
            className="mx-auto mt-10 max-w-3xl text-center font-display text-lg italic leading-relaxed text-white/55 md:text-xl"
          >
            La IA no es magia: es ordenar el caos operativo para que tu equipo vuelva a mirar hacia afuera.
          </motion.p>
        </div>
      </motion.section>

      {/* Servicios — parallax estrellas + rejilla «robótica» */}
      <motion.section
        ref={serviciosSectionRef}
        id="servicios"
        className={cn("relative scroll-mt-28 overflow-hidden", SECTION_PAD)}
        {...sectionReveal}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,15,18,0.55)_0%,rgba(3,3,5,0.62)_45%,rgba(9,9,12,0.6)_100%)]"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ y: reduceMotion ? 0 : serviciosGlowY }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_15%_10%,rgba(167,139,250,0.14)_0%,transparent_55%),radial-gradient(ellipse_70%_55%_at_92%_85%,rgba(103,232,249,0.1)_0%,transparent_52%)]" />
        </motion.div>

        {/* Rejilla tipo panel / circuito — parallax medio */}
        <motion.div
          className="pointer-events-none absolute -left-[8%] -right-[8%] -top-[18%] bottom-[-22%] will-change-transform"
          style={{
            y: reduceMotion ? 0 : serviciosGridY,
            opacity: reduceMotion ? 0.55 : serviciosGridOpacity,
          }}
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-90"
            style={{
              transform: "perspective(880px) rotateX(2.2deg)",
              transformOrigin: "50% 40%",
              backgroundImage: [
                "linear-gradient(rgba(103,232,249,0.16) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(167,139,250,0.11) 1px, transparent 1px)",
                "linear-gradient(rgba(103,232,249,0.06) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "56px 56px, 56px 56px, 14px 14px",
              backgroundPosition: "0 0, 0 0, 0 0",
              maskImage: "radial-gradient(ellipse 75% 65% at 50% 42%, black 10%, transparent 72%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-screen opacity-[0.35]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 55px,
                rgba(103,232,249,0.09) 55px,
                rgba(103,232,249,0.09) 56px
              )`,
              maskImage: "linear-gradient(180deg, transparent 0%, black 35%, black 65%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* Campo de estrellas (partículas) — parallax lento, tonos cyan/violeta */}
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] h-[118%] w-full will-change-transform"
            style={{ y: serviciosStarsY }}
            aria-hidden
          >
            <SparklesCore
              id="ia-servicios-sparkles"
              className="absolute inset-0 h-full w-full opacity-[0.85]"
              background="#030306"
              minSize={0.35}
              maxSize={1.35}
              particleDensity={92}
              particleColor="#67e8f9"
              speed={1.35}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_38%,transparent_0%,rgba(3,3,6,0.55)_62%,rgba(3,3,6,0.92)_100%)]" />
          </motion.div>
        )}

        {reduceMotion && (
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,rgba(103,232,249,0.07)_0%,transparent_65%)]"
            aria-hidden
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#a78bfa]/40 to-transparent" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="liquid-glass mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                <SparklesIcon className="size-3.5 text-[#c4b5fd]" aria-hidden />
                Servicios
              </span>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-tight text-white md:text-5xl">
                Lo que podemos{" "}
                <span className="bg-gradient-to-r from-white via-[#e8e8f8] to-[#67e8f9] bg-clip-text text-transparent">
                  construir con vos
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/58 md:text-xl">
                Soluciones pensadas para PyMEs, profesionales e instituciones — hablando en negocio, no en jerga de laboratorio.
                <span className="mt-2 block text-sm text-white/45"> Tocá una tarjeta para ver el detalle.</span>
              </p>
            </div>
            <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-right lg:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">6 líneas de servicio</p>
              <p className="mt-1 font-display text-lg text-white/85">Diagnóstico → implementación</p>
            </div>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {iaServices.map((item, idx) => {
              const Icon = item.Icon
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: idx * 0.05, duration: 0.55, ease: easePremium }}
                  onClick={() => setOpenServiceId(item.id)}
                  className={cn(
                    "group relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-black/75 p-6 text-left shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)] transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]",
                    "hover:-translate-y-1 hover:shadow-[0_36px_90px_-38px_rgba(103,232,249,0.25)]",
                    item.ringAccent,
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-gradient-to-br opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                      item.accent,
                    )}
                    aria-hidden
                  />
                  <div className="relative flex flex-1 flex-col">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-black/40 text-white shadow-inner ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-6 text-[#a5f3fc]" strokeWidth={1.15} aria-hidden />
                    </span>
                    <h3 className="font-display mt-5 text-xl leading-snug tracking-tight text-white md:text-[1.35rem]">
                      {item.name}
                    </h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/62">{item.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#67e8f9]/95 transition-colors group-hover:text-[#a5f3fc]">
                      Ver detalle
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.section>

      <Dialog open={openServiceId !== null} onOpenChange={(open) => !open && setOpenServiceId(null)}>
        <DialogContent
          showCloseButton
          className="max-h-[min(90vh,820px)] gap-0 overflow-y-auto border-white/[0.14] bg-[#070708] p-0 text-white shadow-[0_40px_120px_-40px_rgba(103,232,249,0.2)] sm:max-w-[540px]"
        >
          {activeService ? (
            <IaServiceModalBody service={activeService} onNavigateWhatsApp={() => setOpenServiceId(null)} />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Beneficios — contenido en CardScanner (LbEErCxufs7): banda escaneada + cartas */}
      <motion.section
        id="beneficios"
        className={cn("relative scroll-mt-28 overflow-hidden bg-black/55", SECTION_PAD)}
        {...sectionReveal}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="liquid-glass mb-4 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                Beneficios
              </span>
              <h2 className="font-display text-3xl text-white md:text-5xl">Por qué tiene sentido para tu equipo</h2>
            </div>
            <p className="max-w-md text-white/55">
              Creemos que la IA amplifica criterio y ritmo: menos horas en lo repetible, más foco en clientes y estrategia.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-black/50 shadow-[0_40px_100px_-48px_rgba(103,232,249,0.14)]">
            <CardScanner embedded className="min-h-[480px]" />
          </div>
        </div>
      </motion.section>

      {/* Metodología — tarjetas 3D + fondo parallax */}
      <motion.section
        ref={metodologiaSectionRef}
        id="metodologia"
        className={cn("relative scroll-mt-28 overflow-x-hidden bg-zinc-950/40", SECTION_PAD)}
        {...sectionReveal}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-18%,rgba(103,232,249,0.11),transparent_52%)]"
          style={reduceMotion ? undefined : { y: metaGlowCyanY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_82%_88%,rgba(167,139,250,0.09),transparent_50%)]"
          style={reduceMotion ? undefined : { y: metaGlowVioletY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-[20%] top-[35%] size-[min(380px,42vw)] rounded-full bg-[#67e8f9]/[0.06] blur-[90px]"
          style={reduceMotion ? undefined : { y: metaBlobAccentY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent)] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
          style={reduceMotion ? undefined : { y: metaGridParallaxY }}
        />
        <SectionParticlesLayer uid="metodologia" reduceMotion={reduceMotion} color="#c4b5fd" density={32} />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 left-3 top-10 z-[1] flex gap-[5px] lg:left-6"
          >
            <span className="w-[2px] shrink-0 rounded-full bg-gradient-to-b from-[#c4b5fd]/55 via-white/14 to-[#67e8f9]/40" />
            <span className="w-px shrink-0 bg-white/[0.15]" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 right-3 top-10 z-[1] flex gap-[5px] lg:right-6"
          >
            <span className="w-px shrink-0 bg-white/[0.15]" />
            <span className="w-[2px] shrink-0 rounded-full bg-gradient-to-b from-[#67e8f9]/45 via-white/14 to-[#c4b5fd]/50" />
          </div>
          <div className="relative z-[2]">
            <motion.div style={reduceMotion ? undefined : { y: metaHeaderParallaxY }}>
              <span className="liquid-glass mb-5 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                Metodología
              </span>
              <h2 className="font-display text-3xl text-white md:text-5xl">Cómo trabajamos</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
                Pasá el cursor sobre cada paso: las tarjetas responden en 3D para leer el flujo como una secuencia espacial.
              </p>
            </motion.div>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
              {methodology.map((m, i) => (
                <motion.div
                  key={m.step}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.72, ease: easePremium }}
                  className="h-full min-h-0"
                >
                  <MethodologyStepCard item={m} index={i} reduceMotion={reduceMotion} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Casos de uso — parallax + tarjetas con acento */}
      <motion.section
        ref={casosSectionRef}
        id="casos"
        className={cn("relative scroll-mt-28 overflow-x-hidden bg-black/55", SECTION_PAD)}
        {...sectionReveal}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-[18%] top-[8%] size-[min(480px,52vw)] rounded-full bg-[#67e8f9]/[0.09] blur-[100px]"
          style={reduceMotion ? undefined : { y: casosBlobPrimaryY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] bottom-[12%] size-[min(420px,48vw)] rounded-full bg-[#c4b5fd]/[0.08] blur-[95px]"
          style={reduceMotion ? undefined : { y: casosBlobSecondaryY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28] [mask-image:linear-gradient(to_bottom,black_20%,transparent)] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px]"
          style={reduceMotion ? undefined : { y: casosGridFadeY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(103,232,249,0.06),transparent_58%)]"
          style={reduceMotion ? undefined : { y: casosRadialGlowY }}
        />
        <SectionParticlesLayer uid="casos" reduceMotion={reduceMotion} color="#67e8f9" density={34} />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 left-3 top-10 z-[1] flex gap-[5px] lg:left-6"
          >
            <span className="w-[2px] shrink-0 rounded-full bg-gradient-to-b from-[#67e8f9]/55 via-white/14 to-[#c4b5fd]/38" />
            <span className="w-px shrink-0 bg-white/[0.15]" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 right-3 top-10 z-[1] flex gap-[5px] lg:right-6"
          >
            <span className="w-px shrink-0 bg-white/[0.15]" />
            <span className="w-[2px] shrink-0 rounded-full bg-gradient-to-b from-[#c4b5fd]/42 via-white/14 to-[#67e8f9]/52" />
          </div>
          <div className="relative z-[2]">
            <motion.div style={reduceMotion ? undefined : { y: casosHeaderY }}>
              <span className="liquid-glass mb-5 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                Casos de uso
              </span>
              <h2 className="font-display text-3xl text-white md:text-5xl">Dónde encaja primero</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                No hace falta ser una startup de Silicon Valley: la IA aplicada bien ordena la realidad de un negocio
                sanjuanino día a día.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:gap-8">
              {useCases.map((u, idx) => (
                <UseCaseParallaxCard
                  key={u.title}
                  item={u}
                  index={idx}
                  scrollProgress={casosScroll}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Diferencial */}
      <motion.section
        id="diferencial"
        className={cn(
          "relative overflow-x-hidden scroll-mt-28 bg-gradient-to-b from-black/55 via-zinc-950/45 to-black/55",
          SECTION_PAD,
        )}
        {...sectionReveal}
      >
        <SectionParticlesLayer
          uid="diferencial"
          reduceMotion={reduceMotion}
          color="#ddd6fe"
          density={28}
          opacityClass="opacity-[0.35] md:opacity-[0.45]"
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
          <span className="liquid-glass mb-5 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
            Por qué Cosecha Creativa
          </span>
          <h2 className="font-display text-3xl text-white md:text-5xl">Creatividad + tecnología, con los pies en San Juan</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Agencia digital, no solo código",
                body: "Entendemos marca, mensaje y canales: la IA se diseña para cómo hablás con tus clientes.",
                icon: Lightbulb,
              },
              {
                title: "Implementación acompañada",
                body: "No te dejamos con un manual PDF: iteramos con tu equipo hasta que el flujo sea cotidiano.",
                icon: CheckCircle2,
              },
              {
                title: "Ética práctica",
                body: "Roles claros entre persona y máquina: automatizamos lo repetible, no la responsabilidad.",
                icon: HeartHandshake,
              },
            ].map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: easePremium }}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8"
              >
                <d.icon className="size-9 text-[#eca8d6]" strokeWidth={1.15} aria-hidden />
                <h3 className="mt-5 font-display text-xl text-white">{d.title}</h3>
                <p className="mt-3 text-white/58">{d.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={chatMedidaSectionRef}
        id="chat-medida"
        className={cn(
          "relative scroll-mt-28 overflow-x-hidden bg-gradient-to-b from-black/55 via-fuchsia-950/[0.12] to-black/55",
          SECTION_PAD,
        )}
        {...sectionReveal}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-[16%] top-[10%] size-[min(440px,50vw)] rounded-full bg-fuchsia-500/[0.09] blur-[96px]"
          style={reduceMotion ? undefined : { y: chatBlobPrimaryY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-[14%] bottom-[8%] size-[min(400px,46vw)] rounded-full bg-violet-500/[0.08] blur-[92px]"
          style={reduceMotion ? undefined : { y: chatBlobSecondaryY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.24] [mask-image:linear-gradient(to_bottom,black_22%,transparent)] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px]"
          style={reduceMotion ? undefined : { y: chatGridParallaxY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_68%_48%_at_50%_12%,rgba(217,70,239,0.08),transparent_56%)]"
          style={reduceMotion ? undefined : { y: chatRadialGlowY }}
        />
        <SectionParticlesLayer
          uid="chat-medida"
          reduceMotion={reduceMotion}
          color="#e879f9"
          density={30}
          opacityClass="opacity-[0.3] md:opacity-[0.4]"
        />
        <div className="relative z-10">
          <CosechaIaChatMedida />
        </div>
      </motion.section>

      <motion.section
        ref={agentesSectionRef}
        id="agentes-autonomos"
        className={cn(
          "relative scroll-mt-28 overflow-x-hidden bg-gradient-to-b from-black/55 via-cyan-950/[0.10] to-black/55",
          SECTION_PAD,
        )}
        {...sectionReveal}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-[14%] top-[14%] size-[min(460px,52vw)] rounded-full bg-cyan-400/[0.09] blur-[100px]"
          style={reduceMotion ? undefined : { y: agentesBlobPrimaryY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] bottom-[10%] size-[min(380px,44vw)] rounded-full bg-emerald-500/[0.07] blur-[88px]"
          style={reduceMotion ? undefined : { y: agentesBlobSecondaryY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.24] [mask-image:linear-gradient(to_bottom,black_25%,transparent)] bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:52px_52px]"
          style={reduceMotion ? undefined : { y: agentesGridParallaxY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_50%_at_50%_18%,rgba(34,211,238,0.07),transparent_58%)]"
          style={reduceMotion ? undefined : { y: agentesRadialGlowY }}
        />
        <SectionParticlesLayer
          uid="agentes-autonomos"
          reduceMotion={reduceMotion}
          color="#67e8f9"
          density={32}
          opacityClass="opacity-[0.32] md:opacity-[0.42]"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
              Agentes que ejecutan solos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/55 md:text-lg">
              No solo respondemos mensajes: diseñamos <strong className="font-medium text-white/90">agentes que disparan acciones</strong>
              — sincronizar datos, mover pedidos, avisar a tu equipo — con reglas claras y sin depender de que alguien pulse botones todo el día.
            </p>
          </div>
          <CosechaIaAgentPlan />
        </div>
      </motion.section>

      {/* CTA final */}
      <motion.section id="cta-ia" className={cn("relative scroll-mt-28 bg-black/55", SECTION_PAD)} {...sectionReveal}>
        <div className="mx-auto max-w-[720px] px-4 text-center sm:px-6 lg:px-12">
          <h2 className="font-display text-3xl leading-tight text-white md:text-5xl">
            ¿Querés ver cómo la IA puede encajar en tu negocio?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
            Pedí una reunión de diagnóstico sin compromiso: revisamos procesos, herramientas y prioridades — y te devolvemos
            una lectura clara de próximos pasos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="sm" asChild className="h-11 gap-2 rounded-full bg-white px-8 text-black hover:bg-white/90 md:h-12">
              <a href={getWhatsAppHref("Diagnóstico IA — Cosecha Creativa")} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="size-[17px] text-[#25D366]" aria-hidden />
                Solicitar reunión
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="h-11 rounded-full border-white/25 px-8 text-white md:h-12">
              <a href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20Cosecha%20Creativa%20IA`} className="gap-2">
                Escribinos por email
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="robot-ia"
        className={cn("relative scroll-mt-28 overflow-hidden border-t border-white/10 bg-black/55", SECTION_PAD)}
        {...sectionReveal}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(103,232,249,0.06),transparent_55%)]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          <IaSplineRobot scene={SPLINE_SCENE_URL} />
        </div>
      </motion.section>

      <motion.footer {...footerEnter}>
        <FooterSection />
      </motion.footer>
    </main>
  )
}
