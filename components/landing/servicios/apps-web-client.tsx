"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useMemo, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
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
import { AppsPageAmbient } from "@/components/landing/servicios/apps-page-ambient"
import { AppsVideoFrame } from "@/components/landing/servicios/apps-video-frame"
import { AppsCapabilityConsole } from "@/components/landing/servicios/apps-capability-console"
import { LayeredText } from "@/components/ui/layered-text"
import { CpuArchitecture } from "@/components/ui/cpu-architecture"

/**
 * /servicios/apps — sistema visual propio.
 *
 * A diferencia del resto de las páginas de servicios (negro + violeta/cian
 * difuso, vidrio esmerilado, bordes redondeados y todo el contenido centrado),
 * esta página usa: un solo acento ácido sobre tinta casi negra, bordes duros
 * de 1px, tipografía mono para la estructura y una grilla de 12 columnas
 * asimétrica con índices de sección. La intención es que se lea como una
 * herramienta técnica, no como un folleto.
 *
 * Referencia de color — no hay tokens de tema acá a propósito: el resto del
 * sitio comparte paleta y esta página tiene que despegarse de ella.
 */
const INK = "#050506"
const SURFACE = "#0B0B0E"
const LINE = "#1E1E24"
const ACID = "#C8FF00"

/**
 * Superficies translúcidas. Las tarjetas y grillas eran negro opaco sobre negro
 * opaco: con el fondo ambiental detrás (`AppsPageAmbient`) eso lo tapaba todo.
 * `PANEL` es la celda y `MESH` el fondo que dibuja las líneas de 1px del `gap`;
 * los dos dejan pasar apenas el halo y la grilla en perspectiva.
 */
const PANEL = "rgba(7,7,10,0.66)"
const MESH = "rgba(30,30,36,0.72)"

/** El campo 3D es WebGL: fuera del bundle inicial y sin render en servidor. */
const AppsHeroField = dynamic(
  () => import("@/components/landing/servicios/apps-hero-field").then((m) => m.AppsHeroField),
  { ssr: false },
)

/** Núcleo 3D de la sección de arquitectura: también WebGL, también diferido. */
const AppsCore3D = dynamic(
  () => import("@/components/landing/servicios/apps-core-3d").then((m) => m.AppsCore3D),
  { ssr: false },
)

const easePremium = [0.22, 1, 0.36, 1] as const

const sectionEnter = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10%" as const, amount: 0.15 },
  transition: { duration: 0.85, ease: easePremium },
} as const

const heroItemVariants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: easePremium } },
} as const

const MARQUEE_TAGS = [
  "Asistentes internos",
  "Lectura de documentos",
  "Generación de informes",
  "Chatbots empresariales",
  "Automatización de procesos",
] as const

/** Líneas del marquee de beneficios: van rápido, por eso siguen siendo ocho. */
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

const procesoLayeredLines = [
  { top: " ", bottom: "DIAGNÓSTICO" },
  { top: "DIAGNÓSTICO", bottom: "DISEÑO" },
  { top: "DISEÑO", bottom: "DESARROLLO" },
  { top: "DESARROLLO", bottom: "PRUEBAS" },
  { top: "PRUEBAS", bottom: "IMPLEMENTACIÓN" },
  { top: "IMPLEMENTACIÓN", bottom: "EVOLUCIÓN" },
  { top: "EVOLUCIÓN", bottom: " " },
] as const

/**
 * Los mismos ocho beneficios del marquee, resumidos en cuatro afirmaciones para
 * el bloque de lectura: repetir la lista completa dos veces seguidas era leer
 * dos veces lo mismo.
 */
const beneficiosClave = [
  {
    title: "Todo en un solo lugar",
    body: "Una sola fuente de verdad, en vez de planillas sueltas, mensajes perdidos y archivos con tres versiones.",
  },
  {
    title: "Menos tareas repetitivas",
    body: "Lo que hoy alguien hace a mano todos los días —cargar, avisar, informar— pasa a hacerlo el sistema.",
  },
  {
    title: "Decisiones con datos",
    body: "Seguimiento de clientes, ventas y procesos con métricas claras, y muchos menos errores de carga.",
  },
  {
    title: "Base para crecer",
    body: "Una estructura que aguanta más clientes, más equipo y más módulos sin tener que empezar de cero.",
  },
] as const

/** Un párrafo por tarjeta: con dos, la sección era otro muro de texto. */
const metodologiaCards = [
  {
    id: "01",
    kicker: "MÉTODO",
    title: "Software pensado para tu negocio",
    body: "Antes de escribir una línea de código miramos cómo trabajás: procesos, necesidades y objetivos. De ahí sale una herramienta que ordena la información, reduce errores y mejora la comunicación interna.",
    pull: "Un buen software no es el que tiene más botones. Es el que te ahorra tiempo y te da control.",
  },
  {
    id: "02",
    kicker: "PLATAFORMA",
    title: "Apps web modernas y escalables",
    body: "Accesibles desde cualquier dispositivo y sin instalaciones: tu equipo entra desde computadora, tablet o celular, con usuarios y permisos por área.",
    pull: "Puede empezar como una herramienta simple y sumar módulos, integraciones e IA sin rehacerse.",
  },
  {
    id: "03",
    kicker: "INTELIGENCIA ARTIFICIAL",
    title: "IA aplicada al software",
    body: "Asistentes internos, informes automáticos, análisis de datos y lectura de documentos: el sistema no solo guarda información, también ayuda a interpretarla.",
    pull: "La idea no es usar IA por moda. Es usarla donde aporta: ahorrar tiempo y decidir mejor.",
  },
] as const

/* ────────────────────────────────────────────────────────────────────────── */
/* Piezas del sistema                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Marco de sección: índice + rótulo en una columna angosta a la izquierda y el
 * contenido en las nueve columnas restantes. La asimetría es el rasgo que más
 * separa esta página del resto del sitio, donde todo va centrado.
 */
function Section({
  index,
  eyebrow,
  children,
  className,
  contentClassName,
}: {
  index: string
  eyebrow: string
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <motion.section
      className={cn("relative border-t", className)}
      style={{ borderColor: LINE }}
      {...sectionEnter}
    >
      <div className="mx-auto grid max-w-[1440px] gap-x-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
        {/* `min-w-0`: sin esto los hijos de grilla toman `min-width:auto` y un
            marquee interno estira la columna miles de px fuera de pantalla. */}
        <div className="min-w-0 lg:col-span-3">
          <div className="flex items-baseline gap-4 lg:sticky lg:top-28 lg:block">
            <span className="font-mono text-[11px] tracking-[0.3em] text-white/25">{index}</span>
            <span
              className="font-mono text-[11px] uppercase tracking-[0.3em] lg:mt-3 lg:block"
              style={{ color: ACID }}
            >
              {eyebrow}
            </span>
          </div>
        </div>
        <div className={cn("mt-8 min-w-0 lg:col-span-9 lg:mt-0", contentClassName)}>{children}</div>
      </div>
    </motion.section>
  )
}

/**
 * Grano fijo sobre toda la página. Un SVG de ruido embebido (sin pedido de red)
 * a opacidad muy baja: le saca el plano perfecto al negro y ayuda a que los
 * degradados del hero no muestren bandas.
 *
 * Sin `mix-blend-mode`: mezclar una capa fija del tamaño del viewport obliga al
 * navegador a recomponer todo lo que hay debajo en cada cuadro de scroll. A esta
 * opacidad el resultado visual es prácticamente el mismo.
 */
function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

/** Esquinas en L: marcan los bloques como piezas de instrumental, no como tarjetas. */
function Corners({ color = ACID }: { color?: string }) {
  return (
    <>
      {[
        "left-0 top-0 border-l-2 border-t-2",
        "right-0 top-0 border-r-2 border-t-2",
        "left-0 bottom-0 border-l-2 border-b-2",
        "right-0 bottom-0 border-r-2 border-b-2",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            pos,
          )}
          style={{ borderColor: color }}
        />
      ))}
    </>
  )
}

/**
 * Panel que se inclina en 3D siguiendo al puntero.
 *
 * La página tenía profundidad solo en el hero (WebGL) y en la galería; las
 * tarjetas de método quedaban completamente planas. Acá la inclinación se
 * escribe sobre `MotionValue`s, así el movimiento no dispara un render de React
 * por cada `pointermove`.
 */
function TiltPanel({
  children,
  className,
  style,
  disabled,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  disabled?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 22, mass: 0.4 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 22, mass: 0.4 })

  const handleMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (disabled) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    // -0.5..0.5 desde el centro del panel; 6° es el techo: más que eso y el
    // texto empieza a perder nitidez en pantallas sin retina.
    rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 6)
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 6)
  }

  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={className}
      style={{
        ...style,
        ...(disabled ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }),
      }}
    >
      {children}
    </motion.article>
  )
}

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.95] tracking-tight text-white",
        className,
      )}
    >
      {children}
    </h2>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="text-[17px] leading-relaxed text-white/70 md:text-lg">{children}</p>
}

/** Botón primario: bloque ácido de esquinas duras, el único color saturado de la página. */
function AcidButton({
  href,
  children,
  external,
  className,
}: {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}) {
  return (
    <Button
      asChild
      className={cn(
        "group h-12 gap-2 rounded-none px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-black shadow-none transition-transform duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:brightness-105",
        className,
      )}
      style={{ backgroundColor: ACID, boxShadow: `-6px -6px 0 0 ${SURFACE}, -6px -6px 0 1px ${ACID}` }}
    >
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    </Button>
  )
}

function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      asChild
      variant="outline"
      className="group h-12 gap-2 rounded-none border bg-transparent px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/80 shadow-none transition-colors hover:bg-white/[0.05] hover:text-white"
      style={{ borderColor: LINE }}
    >
      <a href={href}>{children}</a>
    </Button>
  )
}

/** Cinta de capacidades: mono en versalitas, sin brillos ni degradados. */
function AppsTicker({ reducedMotion }: { reducedMotion: boolean }) {
  const items = [...MARQUEE_TAGS, ...MARQUEE_TAGS]

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-mono text-xs uppercase tracking-[0.22em] text-white/55 md:px-8 md:text-sm">
            {t}
          </span>
          <span aria-hidden className="size-1.5 rotate-45" style={{ backgroundColor: ACID }} />
        </span>
      ))}
    </div>
  )

  return (
    <div
      className="relative overflow-hidden border-y py-4"
      style={{ borderColor: LINE, backgroundColor: "rgba(11,11,14,0.72)" }}
    >
      {reducedMotion ? (
        <div className="mx-auto flex max-w-[1440px] flex-wrap justify-center gap-x-6 gap-y-2 px-6">
          {MARQUEE_TAGS.map((t) => (
            <span
              key={t}
              className="font-mono text-xs uppercase tracking-[0.22em] text-white/55"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div className="marquee flex w-max items-center" style={{ animationDuration: "42s" }}>
          {row}
          {row}
        </div>
      )}
    </div>
  )
}

function AppsScrollCardInner() {
  return (
    <div className="relative h-full min-h-[12rem] w-full overflow-hidden" style={{ backgroundColor: PANEL }}>
      <div className="relative z-10 flex h-full flex-col p-4 md:p-6">
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: LINE }}>
          <span className="size-2 rounded-none bg-white/25" aria-hidden />
          <span className="size-2 rounded-none bg-white/25" aria-hidden />
          <span className="size-2 rounded-none" style={{ backgroundColor: ACID }} aria-hidden />
          <span className="ml-3 truncate font-mono text-[11px] tracking-wide text-white/35">
            app.cosechacreativa.local
          </span>
        </div>
        <div className="mt-4 grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <div className="border p-3 md:p-4" style={{ borderColor: LINE, backgroundColor: SURFACE }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Ventas</p>
            <p className="mt-2 font-display text-2xl text-white md:text-3xl">+24%</p>
            <div className="mt-3 flex h-10 items-end gap-1">
              {[38, 52, 44, 70, 62, 88, 74].map((h, i) => (
                <span
                  key={i}
                  className="flex-1"
                  style={{ height: `${h}%`, backgroundColor: i === 5 ? ACID : "#26262E" }}
                />
              ))}
            </div>
          </div>
          <div className="border p-3 md:p-4" style={{ borderColor: LINE, backgroundColor: SURFACE }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Leads</p>
            <p className="mt-2 font-display text-2xl text-white md:text-3xl">128</p>
            <div className="mt-3 space-y-1.5">
              <div className="h-1 bg-white/15" />
              <div className="h-1 w-4/5" style={{ backgroundColor: ACID }} />
              <div className="h-1 w-2/5 bg-white/10" />
            </div>
          </div>
          <div
            className="col-span-2 border p-3 md:col-span-1 md:p-4"
            style={{ borderColor: LINE, backgroundColor: SURFACE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Automatización</p>
            <p className="mt-2 text-sm leading-snug text-white/75 md:text-base">Flujos activos · IA · APIs</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["n8n", "WhatsApp"].map((t) => (
                <span
                  key={t}
                  className="border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70"
                  style={{ borderColor: LINE }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla inferior: llena el alto del mockup, que antes quedaba vacío, y
            hace que la vista se lea como un panel real y no como tres cajas. */}
        <div className="mt-3 hidden flex-[1.35] flex-col border md:mt-4 md:flex" style={{ borderColor: LINE }}>
          <div
            className="grid grid-cols-[1.6fr_1fr_1fr_auto] gap-4 border-b px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"
            style={{ borderColor: LINE, backgroundColor: SURFACE }}
          >
            <span>Proceso</span>
            <span>Área</span>
            <span>Última corrida</span>
            <span>Estado</span>
          </div>
          <div className="flex-1">
            {[
              { p: "Alta de cliente", a: "Ventas", t: "hace 2 min", s: "OK" },
              { p: "Sincronización de stock", a: "Depósito", t: "hace 11 min", s: "OK" },
              { p: "Recordatorio de pago", a: "Cobranzas", t: "hace 34 min", s: "OK" },
              { p: "Informe semanal", a: "Dirección", t: "programado", s: "EN COLA" },
            ].map((row) => (
              <div
                key={row.p}
                className="grid grid-cols-[1.6fr_1fr_1fr_auto] items-center gap-4 border-b px-4 py-2.5 text-[12px] text-white/70 last:border-b-0"
                style={{ borderColor: LINE }}
              >
                <span className="truncate">{row.p}</span>
                <span className="truncate text-white/45">{row.a}</span>
                <span className="truncate font-mono text-[11px] text-white/35">{row.t}</span>
                <span
                  className="font-mono text-[10px] tracking-[0.18em]"
                  style={{ color: row.s === "OK" ? ACID : "rgba(255,255,255,0.4)" }}
                >
                  {row.s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AppsScrollSectionTitle() {
  return (
    <>
      <span
        className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{ color: ACID }}
      >
        Producto
      </span>
      <h2 className="font-display text-[clamp(2rem,4.6vw,3.5rem)] leading-[0.95] tracking-tight text-white">
        Software que ordena tu operación
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base text-white/55 md:text-lg">
        Vista conceptual: paneles, métricas y flujos en un solo lugar.
      </p>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */

export function AppsWebClient() {
  const prefersReducedMotion = useReducedMotion()
  const reduce = !!prefersReducedMotion
  const softTrailUrls = useMemo(() => SOFT_GALLERY_FILES.map(softGallerySrc), [])

  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  const heroContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.1,
        delayChildren: reduce ? 0 : 0.06,
      },
    },
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white" style={{ backgroundColor: PANEL }}>
      <Navigation />
      {/* Va primero en el DOM: el resto de las secciones son `relative` y
          pintan encima sin necesidad de z-index. */}
      <AppsPageAmbient reducedMotion={reduce} />
      <GrainOverlay />

      {/* Barra de progreso: una línea ácida, sin degradado. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[2px] origin-left"
          style={{ scaleX: pageScrollScaleX, backgroundColor: ACID }}
        />
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[min(96vh,940px)] overflow-hidden">
        {/* Campo 3D a pantalla completa. Los velos lo apagan justo donde va el
            texto: en desktop hacia la izquierda (el skyline queda libre a la
            derecha), en mobile hacia abajo, que es donde cae la columna. */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0">
            <AppsHeroField reducedMotion={reduce} />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] md:h-[42%]"
            style={{
              background: `linear-gradient(to top, ${INK} 4%, rgba(5,5,6,0.78) 42%, transparent 100%)`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              background: `linear-gradient(100deg, ${INK} 0%, rgba(5,5,6,0.93) 32%, rgba(5,5,6,0.42) 60%, transparent 86%)`,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(96vh,940px)] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 sm:px-6 lg:px-10 lg:pb-24">
          <motion.div variants={heroContainerVariants} initial="hidden" animate="show" className="w-full">
            <motion.div variants={heroItemVariants}>
              <Link
                href="/"
                className="mb-6 inline-flex w-fit items-center gap-2 border px-4 py-2 sm:mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
                style={{ borderColor: LINE }}
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                Volver al inicio
              </Link>
            </motion.div>

            <motion.div
              variants={heroItemVariants}
              className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono sm:mb-7 text-[11px] uppercase tracking-[0.28em]"
            >
              <span style={{ color: ACID }}>Apps web · Software a medida</span>
              <span className="text-white/25">Cosecha Creativa · San Juan</span>
            </motion.div>

            <motion.h1
              variants={heroItemVariants}
              className="max-w-[16ch] font-display text-[clamp(2.8rem,8.4vw,6.6rem)] font-light leading-[0.88] tracking-[-0.03em]"
            >
              <span className="block text-white">Sistemas que</span>
              <span className="block text-white">ordenan tu</span>
              <span className="block" style={{ color: ACID }}>
                operación.
              </span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="mt-6 max-w-[62ch] text-base leading-relaxed text-white/70 sm:mt-8 sm:text-lg md:text-xl"
            >
              Diseñamos y desarrollamos apps web, plataformas de gestión y herramientas inteligentes para ordenar
              procesos, automatizar tareas y escalar tu negocio con tecnología.
            </motion.p>

            <motion.div variants={heroItemVariants} className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <AcidButton href={getWhatsAppHref("Apps / software a medida")} external>
                <WhatsAppMark className="size-[17px] shrink-0" />
                Quiero mi sistema
              </AcidButton>
              <GhostButton href="/servicios/diseno-web">
                Diseño web integral
                <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </GhostButton>
            </motion.div>

            {/* Marcadores técnicos: refuerzan la lectura de instrumento. */}
            <motion.dl
              variants={heroItemVariants}
              className="mt-10 grid max-w-3xl grid-cols-2 gap-px border sm:mt-14 sm:grid-cols-4"
              style={{ borderColor: LINE, backgroundColor: MESH }}
            >
              {[
                { k: "Stack", v: "Web · API · IA" },
                { k: "Acceso", v: "Cualquier device" },
                { k: "Escala", v: "Modular" },
                { k: "Base", v: "A medida" },
              ].map((s) => (
                <div key={s.k} className="px-4 py-4" style={{ backgroundColor: PANEL }}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">{s.k}</dt>
                  <dd className="mt-1.5 text-sm text-white/85">{s.v}</dd>
                </div>
              ))}
            </motion.dl>

            {/* Señal de vida + invitación a bajar. */}
            <motion.div
              variants={heroItemVariants}
              className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35 sm:mt-10"
            >
              <span className="relative flex size-2 shrink-0">
                {!reduce && (
                  <span
                    className="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                    style={{ backgroundColor: ACID }}
                  />
                )}
                <span className="relative inline-flex size-2 rounded-full" style={{ backgroundColor: ACID }} />
              </span>
              Deslizá para ver el sistema
              <span className="h-px w-10 sm:w-16" style={{ backgroundColor: LINE }} aria-hidden />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AppsTicker reducedMotion={reduce} />

      {/* ── PRODUCTO ──────────────────────────────────────────────────────── */}
      {reduce ? (
        <section className="relative border-t py-16" style={{ borderColor: LINE }}>
          <div className="mx-auto max-w-5xl px-6 text-center">
            <AppsScrollSectionTitle />
            <div className="mt-10 border p-2" style={{ borderColor: LINE, backgroundColor: SURFACE }}>
              <AppsScrollCardInner />
            </div>
          </div>
        </section>
      ) : (
        <div className="relative border-t" style={{ borderColor: LINE }}>
          <ContainerScroll titleComponent={<AppsScrollSectionTitle />}>
            <AppsScrollCardInner />
          </ContainerScroll>
        </div>
      )}

      {/* ── 01 · CAPACIDADES ──────────────────────────────────────────────── */}
      <Section index="01" eyebrow="Qué hacemos">
        <SectionTitle className="max-w-[18ch]">
          Apps web y software <span style={{ color: ACID }}>a medida</span>
        </SectionTitle>
        <Lead>
          <span className="mt-6 block max-w-[64ch]">
            No usamos recetas genéricas: miramos tu proceso, detectamos dónde se pierde tiempo, dinero o información, y
            construimos la herramienta que falta. Estos son los módulos con los que solemos empezar.
          </span>
        </Lead>
        <div className="mt-10">
          <AppsCapabilityConsole reducedMotion={reduce} />
        </div>
      </Section>

      {/* ── 02 · REEL ─────────────────────────────────────────────────────── */}
      <Section index="02" eyebrow="En movimiento">
        <SectionTitle className="max-w-[17ch]">
          El sistema, <span style={{ color: ACID }}>en movimiento</span>
        </SectionTitle>
        <Lead>
          <span className="mt-6 block max-w-[64ch]">
            Interfaces, datos y automatizaciones trabajando juntos. El mismo criterio que aplicamos al software: nada
            decorativo, todo con función.
          </span>
        </Lead>
        <div className="mt-10">
          <AppsVideoFrame reducedMotion={reduce} />
        </div>
      </Section>

      {/* ── 03 · TRABAJOS ─────────────────────────────────────────────────── */}
      <Section index="03" eyebrow="Trabajos">
        <SectionTitle className="max-w-[16ch]">Algunos de nuestros trabajos</SectionTitle>
        <Lead>
          <span className="mt-6 block max-w-[70ch]">
            Proyectos reales: interfaces claras, datos ordenados y herramientas que ya están ayudando a equipos a
            trabajar mejor. Si te gusta cómo se ven, podemos llevar ese mismo nivel a tu próximo sistema.
          </span>
        </Lead>

        {!reduce ? (
          <div className="mt-10">
            <ImageCursorTrail
              items={softTrailUrls}
              maxNumberOfImages={5}
              distance={22}
              className="min-h-[300px] rounded-none border md:min-h-[420px]"
              imgClass="h-36 w-28 rounded-none border border-white/20 sm:h-44 sm:w-36 md:h-52 md:w-44"
            >
              {/* Sin esto el bloque queda en negro hasta que el cursor entra:
                  era un hueco de pantalla completa en la versión anterior. */}
              <div className="pointer-events-none select-none px-6 text-center">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.3em]"
                  style={{ color: ACID }}
                >
                  Movés el cursor
                </p>
                <p className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] tracking-tight text-white/85">
                  Pasá por acá para revelar
                  <br />
                  las capturas.
                </p>
              </div>
            </ImageCursorTrail>
          </div>
        ) : null}

        <ul className="mt-4 grid gap-px border sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: LINE, backgroundColor: MESH }}>
          {SOFT_GALLERY_FILES.map((file, i) => (
            <li
              key={file}
              className="group relative aspect-[4/3] overflow-hidden [perspective:1000px] sm:last:col-span-2 lg:last:col-span-1"
              style={{ backgroundColor: PANEL }}
            >
              {/* La captura se inclina en 3D real al pasar el cursor: la misma
                  profundidad del hero, resuelta con transform en vez de WebGL. */}
              <div className="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(7deg)_rotateZ(-1.2deg)_scale(1.07)]">
                <Image
                  src={softGallerySrc(file)}
                  alt={`Referencia visual ${i + 1} — interfaces y software Cosecha Creativa`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                />
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 2px ${ACID}` }}
              />
              <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.22em] text-white/45">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 04 · MÉTODO ───────────────────────────────────────────────────── */}
      <Section index="04" eyebrow="Método">
        <SectionTitle className="max-w-[18ch]">Cómo pensamos cada sistema</SectionTitle>
        {/* `perspective` en el contenedor: las tres tarjetas comparten punto de
            fuga, así la inclinación se lee como un solo objeto y no como tres
            planos sueltos. */}
        <div
          className="mt-12 grid gap-px border lg:grid-cols-3 [perspective:1200px]"
          style={{ borderColor: LINE, backgroundColor: MESH }}
        >
          {metodologiaCards.map((card) => (
            <TiltPanel
              key={card.id}
              disabled={reduce}
              className="group relative flex flex-col p-6 transition-colors duration-300 md:p-8"
              style={{ backgroundColor: PANEL }}
            >
              <Corners />
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl leading-none text-white/12">{card.id}</span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: ACID }}
                >
                  {card.kicker}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight text-white md:text-[1.75rem]">
                {card.title}
              </h3>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-white/65">{card.body}</p>
              <p
                className="mt-7 border-l-2 pl-4 text-[15px] leading-relaxed text-white"
                style={{ borderColor: ACID }}
              >
                {card.pull}
              </p>
            </TiltPanel>
          ))}
        </div>
      </Section>

      {/* ── 05 · BENEFICIOS ───────────────────────────────────────────────── */}
      <Section index="05" eyebrow="Beneficios" contentClassName="lg:col-span-9">
        <h2 className="sr-only">Beneficios para tu empresa</h2>
        <BeneficiosParallaxMarquee lines={beneficios} />

        {/* Cuatro afirmaciones en tipografía grande separadas por filetes. Antes
            eran ocho celdas más de la misma grilla; el cambio de cadencia es lo
            que evita que la página se lea siempre igual. */}
        <ul className="mt-14 border-t" style={{ borderColor: LINE }}>
          {beneficiosClave.map((b, i) => (
            <li
              key={b.title}
              className="group flex flex-col gap-2 border-b py-7 transition-[padding] duration-300 md:flex-row md:items-baseline md:gap-10 md:py-9 md:hover:pl-4"
              style={{ borderColor: LINE }}
            >
              <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-white/20 md:w-16">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.05] tracking-tight text-white md:w-[42%] md:shrink-0">
                {b.title}
              </h3>
              <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80 md:text-base">
                {b.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-l-2 pl-6 md:pl-8" style={{ borderColor: ACID }}>
          <p className="max-w-[24ch] font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.05] tracking-tight text-white/45">
            Tu empresa tiene una forma única de trabajar.{" "}
            <span className="text-white">Tu software también debería tenerla.</span>
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-white/35">
            Software que trabaja con vos, no contra vos
          </p>
        </div>
      </Section>

      {/* ── 06 · PROCESO ──────────────────────────────────────────────────── */}
      <Section index="06" eyebrow="Proceso">
        <SectionTitle className="max-w-[14ch]">Nuestro proceso</SectionTitle>
        {!reduce ? (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-white/30">
            Pasá el cursor sobre el bloque para animar los pasos
          </p>
        ) : null}
        <p className="sr-only">
          Etapas del proceso en orden: diagnóstico, diseño de solución, desarrollo, pruebas y ajustes, implementación y
          evolución.
        </p>
        <div className="-mx-4 mt-10 overflow-x-auto px-2 pb-4 md:mx-0 md:overflow-visible md:px-0">
          <LayeredText lines={[...procesoLayeredLines]} reducedMotion={reduce} />
        </div>
      </Section>

      {/* ── 07 · ARQUITECTURA ─────────────────────────────────────────────── */}
      <Section index="07" eyebrow="Arquitectura">
        <SectionTitle className="max-w-[18ch]">
          Todo conectado a <span style={{ color: ACID }}>un mismo núcleo</span>
        </SectionTitle>
        <Lead>
          <span className="mt-6 block max-w-[62ch]">
            Base de datos, integraciones, automatizaciones y modelos de IA hablando entre sí, en lugar de vivir cada
            uno en su planilla.
          </span>
        </Lead>

        {/* Dos lecturas del mismo concepto: el núcleo en volumen (WebGL) y el
            ruteo entre módulos (diagrama). */}
        <div className="mt-10 grid gap-px border md:grid-cols-2" style={{ borderColor: LINE, backgroundColor: MESH }}>
          <div className="relative" style={{ backgroundColor: PANEL }}>
            <div className="h-[300px] w-full md:h-[340px]">
              <AppsCore3D reducedMotion={reduce} />
            </div>
            <span className="pointer-events-none absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
              Núcleo · retícula 5 × 5 × 5
            </span>
          </div>
          <div className="flex items-center p-6 md:p-8" style={{ backgroundColor: PANEL }}>
            <CpuArchitecture
              className="h-auto w-full"
              height="220px"
              text="CPU"
              animateLines={!reduce}
              animateMarkers={!reduce}
              animateText={!reduce}
            />
          </div>
        </div>
      </Section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <motion.section className="relative border-t" style={{ borderColor: LINE }} {...sectionEnter}>
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.3em]"
                style={{ color: ACID }}
              >
                Siguiente paso
              </span>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4.5rem)] leading-[0.95] tracking-tight text-white">
                ¿Tenés una idea o un proceso que querés digitalizar?
              </h2>
              <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-white/70">
                En <span className="text-white">Cosecha Creativa</span> podemos convertirlo en una app web, un sistema
                interno o una plataforma escalable. Contanos qué necesitás ordenar, automatizar o mejorar, y diseñamos
                una solución a medida.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
                <AcidButton href={getWhatsAppHref("Apps / software a medida")} external>
                  <WhatsAppMark className="size-[17px] shrink-0" />
                  Hablemos por WhatsApp
                </AcidButton>
                <GhostButton href="mailto:contacto@cosechacreativa.com.ar?subject=Apps%20%2F%20software%20a%20medida">
                  Escribir por email
                </GhostButton>
              </div>
            </div>

            <div className="lg:col-span-4">
              <dl className="grid gap-px border" style={{ borderColor: LINE, backgroundColor: MESH }}>
                <div className="px-5 py-5" style={{ backgroundColor: PANEL }}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">WhatsApp</dt>
                  <dd className="mt-2">
                    <a
                      href="tel:+5492645468012"
                      className="text-lg text-white underline-offset-4 transition-colors hover:underline"
                    >
                      +54 9 264 546-8012
                    </a>
                  </dd>
                </div>
                <div className="px-5 py-5" style={{ backgroundColor: PANEL }}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">Email</dt>
                  <dd className="mt-2 break-all text-[15px] text-white/80">contacto@cosechacreativa.com.ar</dd>
                </div>
                <div className="px-5 py-5" style={{ backgroundColor: PANEL }}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">También</dt>
                  <dd className="mt-2">
                    <a
                      href="/servicios/diseno-web"
                      className="inline-flex items-center gap-1.5 text-[15px] text-white/80 transition-colors hover:text-white"
                    >
                      Ver diseño web
                      <ArrowUpRight className="size-4 shrink-0" />
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </motion.section>

      <FooterSection />
    </main>
  )
}
