"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  ExternalLink,
  Gauge,
  Globe2,
  Link2,
  Mail,
  Megaphone,
  PenLine,
  Puzzle,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Target,
  Truck,
  Workflow,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"

/** El hero 3D es WebGL: fuera del bundle inicial y sin render en servidor. */
const DisenoWebHero3D = dynamic(
  () => import("@/components/landing/servicios/diseno-web-hero-3d").then((m) => m.DisenoWebHero3D),
  { ssr: false },
)
import {
  PortfolioMacbookShowcase,
  PORTFOLIO_PUBLIC_URL as PORTFOLIO_URL,
} from "@/components/landing/servicios/portfolio-macbook-showcase"
import { PortfolioWebdisGallery } from "@/components/landing/servicios/portfolio-webdis-gallery"
import { ServiceVisual, SerpClimbVisual, CheckoutVisual } from "@/components/landing/servicios/diseno-web-visuals"
import { DisenoWebCierre } from "@/components/landing/servicios/diseno-web-cierre"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import { DisenoWebServicios } from "@/components/landing/servicios/diseno-web-servicios"


// Acá vivían las rutas del vídeo de stock que usaban el hero, la sección SEO y
// «¿Por qué elegirnos?». Las tres pasaron a fondos propios, así que la página ya
// no descarga ningún vídeo — y de paso desaparecieron los 404 de la cadena de
// respaldo, que pedía cinco rutas hasta encontrar la buena.
const CONTACT_EMAIL = "contacto@cosechacreativa.com.ar"
const MARQUEE_TAGS = [
  "Next.js",
  "WordPress",
  "SEO técnico",
  "UX/UI",
  "E-commerce",
  "San Juan",
  "Performance",
  "Responsive",
  "Identidad de marca",
] as const

const easePremium = [0.22, 1, 0.36, 1] as const

const sectionEnter = {
  initial: { opacity: 0, y: 52 },
  whileInView: { opacity: 1, y: 0 },
  /** Margen amplio: evita secciones que quedan en opacity 0 si el usuario entra por #anchor o scroll rápido */
  viewport: { once: true, margin: "-12% 0px -20% 0px", amount: 0.08 },
  transition: { duration: 0.92, ease: easePremium },
} as const

const footerEnter = {
  initial: { opacity: 0, y: 44 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px", amount: 0.15 },
  transition: { duration: 0.88, ease: easePremium },
} as const

const heroItemVariants = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easePremium },
  },
} as const

const seoTactics = [
  {
    title: "Investigación de palabras clave",
    body: "Detectamos lo que tu audiencia busca en San Juan y alrededores.",
    icon: Search,
  },
  {
    title: "Contenido optimizado",
    body: "Textos únicos y persuasivos para mejorar ranking y conversión.",
    icon: PenLine,
  },
  {
    title: "SEO técnico",
    body: "Indexación, estructura y velocidad alineadas a las guías de Google.",
    icon: Gauge,
  },
  {
    title: "Link building local",
    body: "Referencias relevantes que fortalecen la autoridad de tu sitio.",
    icon: Link2,
  },
] as const

/** Vídeo de fondo recortado al ancho del contenido (no borde a borde). `narrow` = mismo ancho que el CTA central (820px). */

/**
 * Tarjeta con foco que sigue al puntero.
 *
 * Sobre la versión anterior (solo el degradado radial) agrega tres cosas: la
 * tarjeta se inclina en 3D hacia el cursor, el borde se enciende donde está el
 * puntero, y un brillo diagonal barre la superficie al entrar.
 *
 * Todo se escribe sobre `MotionValue`s y se compone con `useMotionTemplate`, así
 * que mover el mouse no dispara un solo render de React. La versión anterior
 * hacía `setState` en cada `mousemove` y volvía a renderizar toda la tarjeta,
 * hijos incluidos, sesenta veces por segundo.
 */

function TechMarquee({ reducedMotion }: { reducedMotion: boolean | null }) {
  const TagSep = () => (
    <span
      className="mx-5 inline-flex items-center md:mx-7"
      aria-hidden
    >
      <span className="size-1 rounded-full bg-gradient-to-br from-[#eca8d6] via-[#a78bfa] to-[#67e8f9] opacity-80 shadow-[0_0_12px_rgba(103,232,249,0.35)]" />
    </span>
  )

  if (reducedMotion) {
    return (
      <div
        id="apps"
        className="relative scroll-mt-28 overflow-hidden border-y border-white/[0.12] bg-[linear-gradient(180deg,rgba(12,12,14,0.98)_0%,rgba(0,0,0,0.97)_45%,rgba(10,10,12,0.98)_100%)] py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
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
    <div
      id="apps"
      className="relative scroll-mt-28 overflow-hidden border-y border-white/[0.12] bg-[linear-gradient(180deg,rgba(11,11,13,0.98)_0%,rgba(0,0,0,0.96)_50%,rgba(11,11,13,0.98)_100%)] py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:py-7"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_90%_at_50%_-40%,rgba(236,168,214,0.11)_0%,transparent_50%),radial-gradient(ellipse_60%_80%_at_110%_40%,rgba(103,232,249,0.07)_0%,transparent_48%),radial-gradient(ellipse_50%_70%_at_-10%_60%,rgba(167,139,250,0.06)_0%,transparent_46%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/20 to-transparent opacity-80" />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-28 bg-gradient-to-r from-black via-black/90 to-transparent md:w-36" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-28 bg-gradient-to-l from-black via-black/90 to-transparent md:w-36" />

      {/* Cinta en 3D: dos filas cruzándose sobre un plano inclinado. Era una
          sola línea plana de texto corriendo; con la perspectiva y la fila de
          contra, la banda gana volumen y deja de leerse como un ticker. */}
      <div className="[perspective:700px]">
        <div className="space-y-1 [transform:rotateX(24deg)] [transform-style:preserve-3d]">
          <div className="marquee flex w-max items-center" style={{ animationDuration: "52s" }}>
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center px-3 md:px-5">
                {MARQUEE_TAGS.map((t, i) => (
                  <span key={`${dup}-${t}`} className="flex items-center">
                    {i > 0 ? <TagSep /> : null}
                    <span className="font-display bg-gradient-to-b from-white via-white/88 to-white/55 bg-clip-text text-xl italic tracking-tight text-transparent [text-shadow:0_1px_32px_rgba(167,139,250,0.12)] md:text-2xl lg:text-[1.7rem]">
                      {t}
                    </span>
                  </span>
                ))}
                <TagSep />
              </div>
            ))}
          </div>

          {/* Fila de atrás: más chica, más tenue y en sentido contrario. Es la
              que crea la sensación de profundidad. */}
          <div
            className="marquee-reverse flex w-max items-center opacity-40 [transform:translateZ(-60px)]"
            style={{ animationDuration: "64s" }}
            aria-hidden
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center px-3 md:px-5">
                {MARQUEE_TAGS.map((t, i) => (
                  <span key={`b-${dup}-${t}`} className="flex items-center">
                    {i > 0 ? <TagSep /> : null}
                    <span className="font-display text-base italic tracking-tight text-white/45 md:text-lg lg:text-xl">
                      {t}
                    </span>
                  </span>
                ))}
                <TagSep />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



/** Cierre: layout editorial + panel de contacto (sin pastillas flotantes ni chips duplicados). */

function HeroAmbientOrbs({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <>
      <motion.div
        className="absolute -left-[20%] top-[18%] size-[min(55vw,420px)] rounded-full bg-[#eca8d6]/25 blur-[100px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[12%] size-[min(48vw,380px)] rounded-full bg-[#67e8f9]/20 blur-[90px]"
        animate={{ scale: [1.08, 1, 1.08], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a78bfa]/10 blur-[120px]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
    </>
  )
}

export function DisenoWebClient() {
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
          /servicios/ia y /servicios/apps → coherencia entre servicios tech). */}
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
        {/* Hero 3D propio: maquetas de sitios flotando en profundidad. Antes acá
            había un vídeo de stock de flores, que no decía nada de lo que la
            página vende. */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <DisenoWebHero3D reducedMotion={!!prefersReducedMotion} />
          {/* Velos: la escena queda dominante a la derecha y el titular
              conserva contraste sobre la izquierda. */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/88 via-black/30 to-black/5 md:from-black/92 md:via-black/40" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-black/45 to-black/85 md:via-transparent md:to-black/80" />
          <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_65%_at_50%_0%,rgba(236,168,214,0.14)_0%,transparent_52%)]" />
        </div>
        <HeroAmbientOrbs active={!prefersReducedMotion} />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[min(88vh,820px)] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-28 md:px-12 md:pb-24 lg:justify-center lg:pb-20">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            className="w-full"
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

            <motion.div variants={heroItemVariants} className="mb-6">
              <motion.span
                className="liquid-glass inline-flex cursor-default items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white/90"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black">
                  Premium
                </span>
                Diseño web · San Juan
              </motion.span>
            </motion.div>

            <motion.span
              variants={heroItemVariants}
              className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-white/45"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
              DESARROLLO WEB & EXPERIENCIA DIGITAL
            </motion.span>

            <motion.h1
              variants={heroItemVariants}
              className="max-w-[min(100%,920px)] font-display text-[clamp(2.5rem,7.5vw,5.25rem)] leading-[0.92] tracking-tight"
            >
              <span className="block text-white">Diseño Web</span>
              <span className="mt-1 block bg-gradient-to-r from-[#eca8d6] via-[#a78bfa] to-[#67e8f9] bg-clip-text text-transparent md:mt-2">
                en San Juan
              </span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl"
            >
              En <span className="font-medium text-white">Cosecha Creativa</span> creamos sitios{" "}
              <span className="text-white">profesionales, modernos y optimizados para SEO</span>. Tu web es una
              herramienta para potenciar tu marca en San Juan y atraer clientes — no solo una carta de presentación.
            </motion.p>

            <motion.div
              variants={heroItemVariants}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55"
            >
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-[#67e8f9]" aria-hidden />
                {CONTACT_EMAIL}
              </a>
            </motion.div>

            <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
              <Button
                size="sm"
                asChild
                className={cn(
                  "group relative h-11 gap-2 overflow-hidden rounded-full border-0 px-7 text-[13px] font-semibold tracking-wide text-white md:h-12 md:px-8",
                  "bg-gradient-to-br from-[#25D366] via-[#1ebe57] to-[#128C7E]",
                  "shadow-[0_14px_44px_-12px_rgba(37,211,102,0.55),inset_0_1px_0_rgba(255,255,255,0.22)]",
                  "transition-all duration-300 hover:brightness-[1.07] hover:shadow-[0_18px_52px_-10px_rgba(37,211,102,0.72)] active:scale-[0.98]",
                  "focus-visible:ring-2 focus-visible:ring-[#4ade80]/90 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-transparent before:to-white/15 before:opacity-0 before:transition-opacity hover:before:opacity-100",
                )}
              >
                <a
                  href={getWhatsAppHref("Diseño web premium — San Juan")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-black/15 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                    <WhatsAppMark className="size-[18px] shrink-0 text-white drop-shadow-sm" aria-hidden />
                  </span>
                  <span className="pr-0.5">Consultar por WhatsApp</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className={cn(
                  "group h-11 rounded-full border border-white/[0.22] bg-white/[0.04] px-6 text-[13px] font-medium tracking-wide text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 md:h-12 md:px-7",
                  "hover:border-[#67e8f9]/45 hover:bg-[linear-gradient(135deg,rgba(103,232,249,0.12),rgba(167,139,250,0.08))] hover:text-white hover:shadow-[0_0_32px_-8px_rgba(103,232,249,0.35)]",
                  "focus-visible:ring-2 focus-visible:ring-[#67e8f9]/50",
                )}
              >
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Globe2 className="size-3.5 shrink-0 text-[#67e8f9]/90 transition-transform duration-300 group-hover:rotate-6" aria-hidden />
                  Ver portafolio
                  <ArrowUpRight className="size-3.5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="group h-11 rounded-full border-white/30 bg-transparent px-5 text-[13px] font-medium tracking-wide text-white/90 shadow-none backdrop-blur-[2px] transition-all duration-300 hover:border-white/55 hover:bg-white/[0.06] hover:text-white md:h-12 md:px-6"
              >
                <a href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20Diseño%20Web`} className="gap-1.5">
                  Enviar email
                  <ArrowRight className="size-3.5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 md:size-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <TechMarquee reducedMotion={prefersReducedMotion} />

      {/* Portafolio — referencia interactiva */}
      <motion.section
        id="portafolio"
        className="relative scroll-mt-28 border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnter}
      >
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="liquid-glass mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                <Sparkles className="size-3.5 text-[#eca8d6]" aria-hidden />
                Portafolio
              </span>
              <h2 className="font-display text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">
                Mirá{" "}
                <span className="bg-gradient-to-r from-white via-[#e8e8e8] to-white/75 bg-clip-text text-transparent">
                  Nuestros Trabajos
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/55">
                Alejandro Chávez — portafolio público con proyectos y estilo editorial.
              </p>
            </div>
            <motion.a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-strong inline-flex shrink-0 items-center gap-2 self-start rounded-full px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03] md:self-auto"
              whileTap={{ scale: 0.98 }}
            >
              alechavez.cosechacreativa.com.ar
              <ExternalLink className="size-4 opacity-80" aria-hidden />
            </motion.a>
          </div>

          <PortfolioMacbookShowcase />

          <PortfolioWebdisGallery prefersReducedMotion={prefersReducedMotion} className="mt-16 lg:mt-24" />
        </div>
      </motion.section>

      {/* SEO — columna angosta fija + columna ancha que corre. El título deja
          de perderse arriba y el bloque queda deliberadamente desbalanceado
          (4/12 contra 8/12) en vez del 50/50 de antes. */}
      <motion.section
        id="seo"
        className="relative scroll-mt-28 border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnter}
      >
        {/* Fondo propio en vez del vídeo de stock que había acá: la sección
            habla de posicionamiento y ahora eso se ve en la escalada de abajo.
            Sin `overflow-hidden`: rompería el `sticky` de la columna izquierda
            y las capas ya están clavadas a `inset-0`, así que nada se escapa. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(167,139,250,0.16)_0%,transparent_55%),radial-gradient(ellipse_65%_55%_at_88%_85%,rgba(103,232,249,0.1)_0%,transparent_52%)]"
        />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <span className="liquid-glass mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                <Search className="size-3.5 text-[#67e8f9]" aria-hidden />
                SEO en San Juan
              </span>
              <h2 className="font-display text-4xl leading-[1.06] tracking-tight text-white md:text-5xl">
                Diseño web con SEO:{" "}
                <span className="bg-gradient-to-r from-white via-[#e9d5ff] to-[#67e8f9] bg-clip-text text-transparent">
                  la clave para destacar
                </span>
              </h2>
              {/* Medida en `ch`: la columna angosta ya acota el renglón, pero
                  esto lo deja legible también en tablet. */}
              <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-white/60">
                Un sitio atractivo sin optimización no genera el tráfico que merecés. Aplicamos técnicas concretas para
                que tu marca sea encontrada.
              </p>
            </div>

            {/* Columna ancha: primero el mecanismo, después las cuatro tácticas
                en dos columnas escalonadas. */}
            <div className="lg:col-span-8 lg:pt-14">
              <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-5 backdrop-blur-md md:p-6">
                <SerpClimbVisual reducedMotion={!!prefersReducedMotion} />
              </div>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-x-6 lg:mt-10">
                {seoTactics.map((t, i) => (
                  <motion.li
                    key={t.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px 0px" }}
                    transition={{ delay: (i % 2) * 0.07, duration: 0.5, ease: easePremium }}
                    /* El escalón de la columna derecha rompe la grilla sin
                       tocar el orden de lectura. */
                    className={cn(i % 2 === 1 && "sm:mt-10")}
                  >
                    <div className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.045]">
                      <div className="flex items-start gap-4">
                        {/* Un ícono por táctica: antes las cuatro repetían el
                            mismo gráfico de barras y no distinguían nada. */}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-black/50 transition-colors duration-300 group-hover:border-[#a78bfa]/45">
                          <t.icon className="size-[18px] text-[#c4b5fd]" strokeWidth={1.5} aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-mono text-[10px] text-white/30">0{i + 1}</span>
                            <h3 className="font-display text-lg leading-tight text-white">{t.title}</h3>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/55">{t.body}</p>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Servicios — antes eran cuatro secciones de pantalla completa con la
          misma estructura; ahora es una grilla de cuatro tarjetas comparables. */}
      <DisenoWebServicios reducedMotion={!!prefersReducedMotion} />

      {/* Cierre */}
      <DisenoWebCierre reducedMotion={!!prefersReducedMotion} />

      <motion.footer {...footerEnter}>
        <FooterSection />
      </motion.footer>
    </main>
  )
}
