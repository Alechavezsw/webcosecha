"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Code2,
  CreditCard,
  ExternalLink,
  Globe2,
  Layout,
  Mail,
  Megaphone,
  MessageCircle,
  Palette,
  Puzzle,
  RefreshCw,
  Search,
  Share2,
  Shield,
  ShoppingBag,
  Smartphone,
  Truck,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"
import {
  PortfolioMacbookShowcase,
  PORTFOLIO_PUBLIC_URL as PORTFOLIO_URL,
} from "@/components/landing/servicios/portfolio-macbook-showcase"
import { PortfolioWebdisGallery } from "@/components/landing/servicios/portfolio-webdis-gallery"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
type ServiceSpotlightVariant = "landing" | "wordpress" | "crm"

const SERVICE_SPOTLIGHT_FLOAT_POS = [
  "left-[4%] top-[8%] z-[1] hidden md:block",
  "right-[5%] top-[12%] z-[1] hidden lg:block",
  "left-[8%] top-[42%] z-[1] hidden md:block",
  "right-[12%] top-[48%] z-[1] hidden lg:block",
] as const

function ServiceSpotlightSection({
  variant,
  prefersReducedMotion,
}: {
  variant: ServiceSpotlightVariant
  prefersReducedMotion: boolean | null
}) {
  const cfg =
    variant === "landing"
      ? {
          id: "landing" as const,
          reverse: true,
          bg: "bg-[linear-gradient(180deg,rgba(45,25,8,0.4)_0%,rgba(0,0,0,0.96)_48%,rgba(9,9,11,1)_100%)]",
          radial:
            "bg-[radial-gradient(ellipse_95%_75%_at_12%_12%,rgba(251,191,36,0.15)_0%,transparent_56%),radial-gradient(ellipse_70%_65%_at_92%_88%,rgba(244,114,182,0.1)_0%,transparent_52%)]",
          glow:
            "bg-gradient-to-br from-amber-500/22 via-orange-400/12 to-transparent blur-[100px]",
          badgeRing: "border-amber-400/28 bg-amber-500/12 text-amber-100",
          titleGradient: "from-amber-100 via-orange-200 to-rose-300",
          iconRing: "ring-amber-400/30",
          cardGlow:
            "shadow-[0_40px_100px_-48px_rgba(251,191,36,0.28)] ring-1 ring-amber-500/15",
          badgeLabel: "Conversión",
          titleBefore: "Landing ",
          titleAccent: "pages",
          description:
            "Páginas de aterrizaje enfocadas en una sola acción: leads, reservas o campañas pagas — copys y estructura pensados para conversión.",
          chips: ["CTA", "Forms", "A/B", "Ads"],
          Icon: ArrowUpRight,
          floats: [
            { Icon: Target, label: "Una acción clara" },
            { Icon: BarChart3, label: "Métricas" },
            { Icon: Megaphone, label: "Campañas" },
            { Icon: Zap, label: "Rapidez" },
          ],
          floatTint: "rgba(251,191,36,0.35)",
        }
      : variant === "wordpress"
        ? {
            id: "wordpress" as const,
            reverse: false,
            bg: "bg-[linear-gradient(180deg,rgba(15,23,42,0.45)_0%,rgba(0,0,0,0.96)_48%,rgba(9,9,11,1)_100%)]",
            radial:
              "bg-[radial-gradient(ellipse_90%_72%_at_82%_8%,rgba(59,130,246,0.14)_0%,transparent_55%),radial-gradient(ellipse_68%_58%_at_8%_92%,rgba(147,197,253,0.09)_0%,transparent_50%)]",
            glow:
              "bg-gradient-to-br from-blue-500/18 via-indigo-400/12 to-transparent blur-[100px]",
            badgeRing: "border-blue-400/28 bg-blue-500/12 text-blue-100",
            titleGradient: "from-sky-200 via-blue-200 to-indigo-300",
            iconRing: "ring-blue-400/28",
            cardGlow:
              "shadow-[0_40px_100px_-48px_rgba(59,130,246,0.26)] ring-1 ring-blue-500/15",
            badgeLabel: "CMS & soporte",
            titleBefore: "WordPress & ",
            titleAccent: "mantenimiento",
            description:
              "Implementamos WordPress cuando necesitás autonomía para editar contenidos. Sumamos mantenimiento, backups y actualizaciones para que todo siga estable.",
            chips: ["Editor", "Plugins", "Backups", "Updates"],
            Icon: Code2,
            floats: [
              { Icon: Shield, label: "Seguridad" },
              { Icon: Puzzle, label: "Temas & plugins" },
              { Icon: RefreshCw, label: "Actualizaciones" },
              { Icon: Search, label: "SEO técnico" },
            ],
            floatTint: "rgba(96,165,250,0.35)",
          }
        : {
            id: "crm" as const,
            reverse: true,
            bg: "bg-[linear-gradient(180deg,rgba(35,15,45,0.42)_0%,rgba(0,0,0,0.96)_48%,rgba(9,9,11,1)_100%)]",
            radial:
              "bg-[radial-gradient(ellipse_92%_74%_at_88%_12%,rgba(167,139,250,0.14)_0%,transparent_55%),radial-gradient(ellipse_65%_58%_at_10%_85%,rgba(236,168,214,0.1)_0%,transparent_52%)]",
            glow:
              "bg-gradient-to-br from-violet-500/20 via-fuchsia-400/12 to-transparent blur-[100px]",
            badgeRing: "border-violet-400/28 bg-violet-500/12 text-violet-100",
            titleGradient: "from-violet-100 via-fuchsia-200 to-[#eca8d6]",
            iconRing: "ring-violet-400/28",
            cardGlow:
              "shadow-[0_40px_100px_-48px_rgba(167,139,250,0.28)] ring-1 ring-violet-500/15",
            badgeLabel: "Operación",
            titleBefore: "CRM & ",
            titleAccent: "automatización",
            description:
              "Conectamos formularios y flujos con herramientas de gestión para que los contactos no se pierdan y tu equipo trabaje más ordenado.",
            chips: ["Leads", "Flujos", "Alertas", "Integraciones"],
            Icon: Workflow,
            floats: [
              { Icon: Users, label: "Pipeline" },
              { Icon: Mail, label: "Contactos" },
              { Icon: Share2, label: "Integraciones" },
              { Icon: Zap, label: "Automatizar" },
            ],
            floatTint: "rgba(167,139,250,0.38)",
          }

  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const dropA = useTransform(scrollYProgress, [0, 1], [-72, 212])
  const dropB = useTransform(scrollYProgress, [0, 1], [48, 318])
  const dropC = useTransform(scrollYProgress, [0, 1], [-34, 268])
  const dropD = useTransform(scrollYProgress, [0, 1], [88, 382])
  const dropBRot = useTransform(scrollYProgress, [0, 1], [5, -11])
  const sway = useTransform(scrollYProgress, [0, 1], [-6, 15])
  const cardY = useTransform(scrollYProgress, [0, 0.42, 1], [26, 0, -14])
  const iconScale = useTransform(scrollYProgress, [0, 0.52, 1], [0.94, 1, 1.06])
  const glowY = useTransform(scrollYProgress, [0, 1], [110, -72])

  const drops = [dropA, dropB, dropC, dropD]
  const RmIcon = cfg.Icon

  if (prefersReducedMotion) {
    return (
      <motion.section
        id={cfg.id}
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnter}
      >
        <div className={cn("pointer-events-none absolute inset-0", cfg.bg)} aria-hidden />
        <div className={cn("pointer-events-none absolute inset-0", cfg.radial)} aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div
            className={cn(
              "liquid-glass rounded-[1.85rem] border border-white/[0.08] bg-black/40 p-8 md:p-12",
              cfg.cardGlow,
            )}
          >
            <div
              className={cn(
                "md:flex md:items-center md:justify-between md:gap-12",
                cfg.reverse && "md:flex-row-reverse",
              )}
            >
              <div className={cn("max-w-xl", cfg.reverse && "md:text-right")}>
                <span
                  className={cn(
                    "mb-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]",
                    cfg.badgeRing,
                  )}
                >
                  {cfg.badgeLabel}
                </span>
                <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-[2.65rem]">
                  {cfg.titleBefore}
                  <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", cfg.titleGradient)}>
                    {cfg.titleAccent}
                  </span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-white/70">{cfg.description}</p>
              </div>
              <div
                className={cn(
                  "mt-10 flex shrink-0 justify-center md:mt-0",
                  cfg.reverse ? "md:justify-start" : "md:justify-end",
                )}
              >
                <div
                  className={cn(
                    "liquid-glass-strong flex size-28 items-center justify-center rounded-3xl ring-2 ring-offset-2 ring-offset-black/75 md:size-32",
                    cfg.iconRing,
                  )}
                >
                  <RmIcon className="size-14 text-white md:size-16" strokeWidth={1} aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    )
  }

  const MainIcon = cfg.Icon

  return (
    <motion.section
      ref={sectionRef}
      id={cfg.id}
      className="relative min-h-[min(520px,78vh)] overflow-hidden border-t border-white/10 bg-black/55 py-24 lg:py-32"
      {...sectionEnter}
    >
      <div className={cn("pointer-events-none absolute inset-0", cfg.bg)} aria-hidden />
      <div className={cn("pointer-events-none absolute inset-0", cfg.radial)} aria-hidden />
      <motion.div
        style={{ y: glowY }}
        className={cn(
          "pointer-events-none absolute left-1/2 top-[14%] h-[min(460px,52vw)] w-[min(460px,52vw)] -translate-x-1/2 rounded-full blur-[100px]",
          cfg.glow,
        )}
        aria-hidden
      />

      {cfg.floats.map((item, i) => {
        const Fi = item.Icon
        return (
          <motion.div
            key={`${cfg.id}-float-${item.label}`}
            style={{
              y: drops[i],
              rotate: i === 1 ? dropBRot : sway,
            }}
            className={cn("pointer-events-none absolute", SERVICE_SPOTLIGHT_FLOAT_POS[i])}
          >
            {i === 3 ? (
              <div
                className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-black/55 shadow-lg backdrop-blur-md"
                style={{ boxShadow: `0 16px 50px -18px ${cfg.floatTint}` }}
              >
                <Fi className="size-7 text-white/90" aria-hidden />
              </div>
            ) : (
              <span
                className="inline-flex items-center gap-2 rounded-2xl border border-white/16 bg-black/50 px-3.5 py-2 text-[11px] font-medium text-white/90 shadow-lg backdrop-blur-md md:px-4 md:py-2.5 md:text-xs"
                style={{ boxShadow: `0 18px 55px -22px ${cfg.floatTint}` }}
              >
                <Fi className="size-3.5 shrink-0 opacity-90" aria-hidden />
                {item.label}
              </span>
            )}
          </motion.div>
        )
      })}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px"
        style={{
          backgroundImage:
            variant === "landing"
              ? "linear-gradient(90deg, transparent, rgba(251,191,36,0.45), transparent)"
              : variant === "wordpress"
                ? "linear-gradient(90deg, transparent, rgba(96,165,250,0.45), transparent)"
                : "linear-gradient(90deg, transparent, rgba(167,139,250,0.45), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          style={{ y: cardY }}
          className={cn(
            "group relative overflow-hidden rounded-[1.85rem] border border-white/[0.09] bg-gradient-to-br from-white/[0.06] via-black/42 to-black/72 p-8 backdrop-blur-xl md:p-12",
            cfg.cardGlow,
          )}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden>
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                backgroundSize: "26px 26px",
              }}
            />
          </div>

          <div
            className={cn(
              "relative md:flex md:items-center md:justify-between md:gap-14",
              cfg.reverse && "md:flex-row-reverse",
            )}
          >
            <div className={cn("max-w-xl", cfg.reverse && "md:text-right")}>
              <motion.span
                className={cn(
                  "mb-5 inline-flex rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                  cfg.badgeRing,
                )}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: easePremium }}
              >
                {cfg.badgeLabel}
              </motion.span>
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                {cfg.titleBefore}
                <span
                  className={cn(
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    variant === "landing" &&
                      "from-amber-100 via-orange-200 to-rose-300",
                    variant === "wordpress" &&
                      "from-sky-100 via-blue-200 to-indigo-300",
                    variant === "crm" &&
                      "from-violet-100 via-fuchsia-200 to-[#eca8d6]",
                  )}
                >
                  {cfg.titleAccent}
                </span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/68 md:text-xl">{cfg.description}</p>
              <ul
                className={cn(
                  "mt-8 flex flex-wrap gap-2.5",
                  cfg.reverse && "md:justify-end",
                )}
              >
                {cfg.chips.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-white/10 bg-black/35 px-3.5 py-1.5 text-xs font-medium text-white/78"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={cn(
                "mt-10 flex shrink-0 justify-center md:mt-0",
                cfg.reverse ? "md:justify-start" : "md:justify-end",
              )}
            >
              <motion.div
                style={{ scale: iconScale }}
                className={cn(
                  "liquid-glass-strong relative flex size-28 items-center justify-center rounded-3xl ring-2 ring-offset-2 ring-offset-black/75 md:size-36",
                  cfg.iconRing,
                )}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 5 + (variant === "wordpress" ? 0.4 : 0),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MainIcon className="size-14 text-white md:size-[4.25rem]" strokeWidth={1} aria-hidden />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

const VIDEO_POSTER = "/images/bridge.png"
const HERO_BG_VIDEO_BASE = "continue_with_a_lot_of_202605020801"
const HERO_BG_VIDEO_SOURCES = [
  `/videos/${HERO_BG_VIDEO_BASE}.mp4`,
  `/videos/${HERO_BG_VIDEO_BASE}.webm`,
  `/videos/${HERO_BG_VIDEO_BASE}.mov`,
  `/${HERO_BG_VIDEO_BASE}.mp4`,
  `/${HERO_BG_VIDEO_BASE}.webm`,
] as const

const MID_BG_SRC = "/Gemini_Generated_Image_txjgz6txjgz6txjg.jpg"
/** Vídeo de la carpeta `Diseño web` del proyecto, servido desde `public/videos/` */
const SEO_SECTION_VIDEO = "/videos/diseno-web-seo-bg.mp4"
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

const porQueItems = [
  {
    title: "Diseño personalizado",
    body: "Sitios a medida, alineados con tu marca y tus objetivos de negocio.",
    icon: Palette,
  },
  {
    title: "Optimización SEO",
    body: "Estrategias para posicionarte en Google y ganar visibilidad en San Juan.",
    icon: Search,
  },
  {
    title: "Responsive design",
    body: "Experiencia impecable en móvil, tablet y escritorio.",
    icon: Smartphone,
  },
  {
    title: "Velocidad y rendimiento",
    body: "Carga rápida y navegación fluida — cada milisegundo cuenta.",
    icon: Zap,
  },
  {
    title: "Redes sociales",
    body: "Integración con Instagram, Facebook y el ecosistema que uses.",
    icon: Globe2,
  },
  {
    title: "Tiendas online",
    body: "E-commerce seguros y funcionales para vender productos o servicios.",
    icon: ShoppingBag,
  },
  {
    title: "Soporte y mantenimiento",
    body: "Tu web actualizada, estable y protegida en el tiempo.",
    icon: Sparkles,
  },
  {
    title: "Diseño UX/UI",
    body: "Interfaces claras y atractivas para mejorar la interacción.",
    icon: Layout,
  },
  {
    title: "WordPress",
    body: "Sitios autoadministrables, escalables y fáciles de gestionar.",
    icon: Code2,
  },
  {
    title: "Landing pages",
    body: "Páginas de aterrizaje para campañas y captación de leads.",
    icon: ArrowUpRight,
  },
  {
    title: "CRM y automatización",
    body: "Conexión con herramientas de gestión para eficientar tu operación.",
    icon: Users,
  },
  {
    title: "Chatbots",
    body: "Atención automática y respuestas en tiempo real.",
    icon: MessageCircle,
  },
  {
    title: "Seguridad web",
    body: "Buenas prácticas para proteger datos y reducir riesgos.",
    icon: Shield,
  },
] as const

const seoTactics = [
  {
    title: "Investigación de palabras clave",
    body: "Detectamos lo que tu audiencia busca en San Juan y alrededores.",
  },
  {
    title: "Contenido optimizado",
    body: "Textos únicos y persuasivos para mejorar ranking y conversión.",
  },
  {
    title: "SEO técnico",
    body: "Indexación, estructura y velocidad alineadas a las guías de Google.",
  },
  {
    title: "Link building local",
    body: "Referencias relevantes que fortalecen la autoridad de tu sitio.",
  },
] as const

/** Vídeo de fondo recortado al ancho del contenido (no borde a borde). `narrow` = mismo ancho que el CTA central (820px). */
function SectionVideoFrame({
  narrow,
  children,
}: {
  narrow?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 px-6 lg:px-12">
      <div className={cn("mx-auto h-full", narrow ? "max-w-[820px]" : "max-w-[1400px]")}>
        <div className="relative h-full min-h-[240px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] ring-1 ring-white/[0.05]">
          {children}
        </div>
      </div>
    </div>
  )
}

function SpotlightFeatureCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setGlow({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setGlow({ x: 50, y: 50 })}
      className={cn("group relative overflow-hidden rounded-2xl", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(520px circle at ${glow.x}% ${glow.y}%, rgba(236,168,214,0.24), transparent 42%), radial-gradient(420px circle at ${glow.x}% ${glow.y}%, rgba(103,232,249,0.14), transparent 48%)`,
        }}
      />
      {children}
    </div>
  )
}

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

      <div
        className="marquee flex w-max items-center"
        style={{ animationDuration: "52s" }}
      >
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
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_65%_at_50%_0%,rgba(236,168,214,0.16)_0%,transparent_52%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_50%_45%_at_90%_100%,rgba(103,232,249,0.1)_0%,transparent_50%)]" />
    </div>
  )
}

function SeoSectionBackground({
  reducedMotion,
  videoSources,
}: {
  reducedMotion: boolean | null
  /** Clip alternativo (p. ej. mismo paquete que el hero). Por defecto: `SEO_SECTION_VIDEO`. */
  videoSources?: readonly string[]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const underlayImage = videoSources ? VIDEO_POSTER : MID_BG_SRC
  const underlayPosition = videoSources ? "object-[center_58%]" : "object-[center_35%]"

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
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <>
        <Image src={MID_BG_SRC} alt="" fill className="object-cover object-[center_35%] opacity-55" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/52 to-black/76" />
      </>
    )
  }

  return (
    <>
      <Image
        src={underlayImage}
        alt=""
        fill
        className={cn("opacity-[0.12]", underlayPosition, "object-cover")}
        sizes="100vw"
        aria-hidden
      />
      <video
        ref={videoRef}
        className="absolute inset-0 z-[1] h-full min-h-full w-full min-w-full scale-[1.02] object-cover object-center opacity-100"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster={underlayImage}
      >
        {videoSources ? (
          videoSources.map((src) => (
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
          ))
        ) : (
          <source src={SEO_SECTION_VIDEO} type="video/mp4" />
        )}
      </video>
      {/* Velada ligera extra para contraste del texto; el vídeo sigue dominante */}
      <div className="absolute inset-0 z-[2] bg-black/10" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/44 via-black/22 to-black/50" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/38 via-black/5 to-black/40" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_95%_85%_at_50%_40%,transparent_32%,rgba(0,0,0,0.3)_100%)]" />
    </>
  )
}

function EcommerceSpotlightSection({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean | null
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const dropA = useTransform(scrollYProgress, [0, 1], [-70, 210])
  const dropB = useTransform(scrollYProgress, [0, 1], [50, 320])
  const dropC = useTransform(scrollYProgress, [0, 1], [-30, 260])
  const dropD = useTransform(scrollYProgress, [0, 1], [90, 380])
  const dropBRot = useTransform(scrollYProgress, [0, 1], [4, -10])
  const sway = useTransform(scrollYProgress, [0, 1], [-5, 14])
  const cardY = useTransform(scrollYProgress, [0, 0.45, 1], [28, 0, -16])
  const iconScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.05])
  const glowY = useTransform(scrollYProgress, [0, 1], [120, -80])

  if (prefersReducedMotion) {
    return (
      <motion.section
        id="ecommerce"
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnter}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_75%_15%,rgba(52,211,153,0.12)_0%,transparent_58%),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(236,168,214,0.08)_0%,transparent_50%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="liquid-glass rounded-[1.85rem] border border-emerald-500/15 bg-black/35 p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between md:gap-12">
              <div className="max-w-xl">
                <span className="mb-4 inline-flex rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-emerald-300/90">
                  Venta online
                </span>
                <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                  Tiendas online &{" "}
                  <span className="bg-gradient-to-r from-emerald-300 via-[#67e8f9] to-[#a78bfa] bg-clip-text text-transparent">
                    e-commerce
                  </span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-white/70">
                  Si querés vender online, desarrollamos comercios electrónicos seguros, claros para el usuario y listos
                  para escalar — integrados con medios de pago y tu operación.
                </p>
              </div>
              <div className="mt-10 flex shrink-0 justify-center md:mt-0 md:justify-end">
                <div className="liquid-glass-strong flex size-28 items-center justify-center rounded-3xl ring-1 ring-emerald-400/25 md:size-32">
                  <ShoppingBag className="size-14 text-white/90 md:size-16" strokeWidth={1} aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      ref={sectionRef}
      id="ecommerce"
      className="relative min-h-[min(560px,82vh)] overflow-hidden border-t border-white/10 bg-black/55 py-24 lg:py-32"
      {...sectionEnter}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,24,18,0.35)_0%,rgba(0,0,0,0.96)_45%,rgba(9,9,11,1)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_80%_10%,rgba(52,211,153,0.14)_0%,transparent_55%),radial-gradient(ellipse_70%_60%_at_5%_90%,rgba(236,168,214,0.1)_0%,transparent_52%)]"
        aria-hidden
      />
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-[15%] h-[min(480px,55vw)] w-[min(480px,55vw)] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 via-[#67e8f9]/10 to-transparent blur-[100px]"
        aria-hidden
      />

      {/* Elementos que “caen” con el scroll */}
      <motion.div
        style={{ y: dropA, rotate: sway }}
        className="pointer-events-none absolute left-[4%] top-[8%] z-[1] hidden md:block"
      >
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/18 bg-black/50 px-4 py-2.5 text-xs font-medium text-white/95 shadow-[0_20px_60px_-24px_rgba(52,211,153,0.35)] backdrop-blur-md">
          <ShoppingBag className="size-3.5 text-emerald-300" aria-hidden />
          Carrito & catálogo
        </span>
      </motion.div>
      <motion.div
        style={{ y: dropB, rotate: dropBRot }}
        className="pointer-events-none absolute right-[5%] top-[12%] z-[1] hidden lg:block"
      >
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-black/45 px-4 py-2.5 text-xs font-medium text-white/90 backdrop-blur-md">
          <CreditCard className="size-3.5 text-[#67e8f9]" aria-hidden />
          Pagos integrados
        </span>
      </motion.div>
      <motion.div
        style={{ y: dropC }}
        className="pointer-events-none absolute left-[8%] top-[42%] z-[1] hidden md:block"
      >
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-black/40 px-3.5 py-2 text-[11px] font-medium tracking-wide text-white/75 backdrop-blur-sm">
          <Truck className="size-3.5 text-[#eca8d6]" aria-hidden />
          Envíos & logística
        </span>
      </motion.div>
      <motion.div
        style={{ y: dropD }}
        className="pointer-events-none absolute right-[12%] top-[48%] z-[1] hidden lg:block"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/15 to-black/60 shadow-[0_16px_50px_-20px_rgba(52,211,153,0.4)]">
          <Zap className="size-7 text-emerald-200/90" aria-hidden />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          style={{ y: cardY }}
          className="group relative overflow-hidden rounded-[1.85rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.07] via-black/40 to-black/70 p-8 shadow-[0_40px_100px_-48px_rgba(52,211,153,0.22)] backdrop-blur-xl md:p-12"
        >
          <div className="pointer-events-none absolute -right-24 top-0 size-56 rounded-full bg-emerald-500/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:size-72" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-[#67e8f9]/10 blur-3xl md:size-56" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />

          <div className="relative md:flex md:items-center md:justify-between md:gap-14">
            <div className="max-w-xl">
              <motion.span
                className="mb-5 inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/95"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: easePremium }}
              >
                Venta online
              </motion.span>
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-[2.85rem] lg:leading-[1.08]">
                Tiendas online &{" "}
                <span className="bg-gradient-to-r from-emerald-200 via-[#67e8f9] to-[#c4b5fd] bg-clip-text text-transparent">
                  e-commerce
                </span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/68 md:text-xl">
                Si querés vender online, desarrollamos comercios electrónicos seguros, claros para el usuario y listos
                para escalar — integrados con medios de pago y tu operación.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {["Checkout", "Stock", "Pagos", "Envíos"].map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-white/10 bg-black/35 px-3.5 py-1.5 text-xs font-medium text-white/75"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex shrink-0 justify-center md:mt-0 md:justify-end">
              <motion.div
                style={{ scale: iconScale }}
                className="liquid-glass-strong relative flex size-28 items-center justify-center rounded-3xl ring-2 ring-emerald-400/20 ring-offset-2 ring-offset-black/80 md:size-36"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShoppingBag className="size-14 text-white md:size-[4.25rem]" strokeWidth={1} aria-hidden />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

/** Cierre: layout editorial + panel de contacto (sin pastillas flotantes ni chips duplicados). */
function CierreSpotlightSection({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const ambient = !prefersReducedMotion

  const ctaButtons = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
      <Button
        size="sm"
        asChild
        className={cn(
          "group relative h-12 w-full justify-center gap-2 overflow-hidden rounded-2xl border-0 px-6 text-[13px] font-semibold text-white sm:flex-1 lg:w-full",
          "bg-gradient-to-br from-[#25D366] via-[#1ebe57] to-[#128C7E]",
          "shadow-[0_14px_44px_-12px_rgba(37,211,102,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "transition-all duration-300 hover:brightness-[1.06] hover:shadow-[0_18px_52px_-10px_rgba(37,211,102,0.68)] active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-[#4ade80]/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-t before:from-transparent before:to-white/14 before:opacity-0 before:transition-opacity hover:before:opacity-100",
        )}
      >
        <a
          href={getWhatsAppHref("Diseño web — consulta")}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex w-full items-center justify-center gap-2.5"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-black/15 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
            <WhatsAppMark className="size-[18px] text-white drop-shadow-sm" aria-hidden />
          </span>
          WhatsApp
        </a>
      </Button>
      <Button
        size="sm"
        asChild
        variant="outline"
        className={cn(
          "h-12 w-full rounded-2xl border-white/[0.22] bg-white/[0.05] px-6 font-medium text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-[#67e8f9]/45 hover:bg-white/[0.08] hover:shadow-[0_0_28px_-8px_rgba(103,232,249,0.28)] sm:flex-1 lg:w-full",
        )}
      >
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
          <Globe2 className="size-3.5 text-[#67e8f9]/85" aria-hidden />
          Portafolio
        </a>
      </Button>
      <Button
        size="sm"
        asChild
        className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.07] px-6 text-[13px] font-medium text-white hover:bg-white/[0.11] sm:flex-1 lg:w-full"
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          title={CONTACT_EMAIL}
          className="inline-flex w-full items-center justify-center"
        >
          Email
        </a>
      </Button>
    </div>
  )

  return (
    <motion.section
      className="relative overflow-hidden border-t border-white/10 bg-[#030305]/55 py-24 lg:py-32"
      {...sectionEnter}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(40,20,55,0.45)_0%,rgba(0,0,0,0.55)_42%,rgba(3,3,5,0.6)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_15%_20%,rgba(167,139,250,0.14)_0%,transparent_55%),radial-gradient(ellipse_70%_55%_at_92%_78%,rgba(236,168,214,0.09)_0%,transparent_52%),radial-gradient(ellipse_50%_45%_at_50%_100%,rgba(103,232,249,0.06)_0%,transparent_48%)]"
        aria-hidden
      />

      {ambient ? (
        <>
          <motion.div
            className="pointer-events-none absolute -left-[18%] top-[12%] size-[min(62vw,480px)] rounded-full bg-[#a78bfa]/18 blur-[110px]"
            animate={{ opacity: [0.22, 0.38, 0.22] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-[12%] bottom-[8%] size-[min(52vw,420px)] rounded-full bg-[#eca8d6]/14 blur-[100px]"
            animate={{ opacity: [0.18, 0.32, 0.18] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute left-[55%] top-[38%] size-[min(40vw,320px)] -translate-x-1/2 rounded-full bg-[#67e8f9]/10 blur-[90px]"
            animate={{ opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            aria-hidden
          />
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 xl:gap-20">
          <div className="text-left">
            <p className="cc-eyebrow-accent text-white/45">
              Cosecha Creativa · San Juan
            </p>
            <h2 className="font-display mt-5 text-[2.05rem] leading-[1.07] tracking-tight text-white sm:text-5xl lg:text-[3.15rem] xl:text-[3.45rem]">
              <span className="block text-white/[0.92]">Una web que trabaje</span>
              <span className="mt-1 block bg-gradient-to-r from-[#f5f0ff] via-[#e9d5ff] to-[#67e8f9] bg-clip-text text-transparent">
                para tu negocio.
              </span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/58 lg:text-xl">
              Combinamos creatividad y tecnología para convertir visitas en clientes: diseño profesional, SEO y una
              estrategia clara. Si querés dar el siguiente paso, escribinos.
            </p>
            <div className="mt-10 hidden h-px w-full max-w-md bg-gradient-to-r from-[#a78bfa]/50 via-[#67e8f9]/35 to-transparent lg:block" aria-hidden />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.75, ease: easePremium }}
            className="relative"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-[2rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.09] via-black/55 to-black/85 p-8 shadow-[0_48px_120px_-56px_rgba(103,232,249,0.18)] backdrop-blur-2xl md:p-10",
                "before:pointer-events-none before:absolute before:inset-0 before:rounded-[2rem] before:p-px before:content-['']",
                "before:bg-[linear-gradient(135deg,rgba(167,139,250,0.35),transparent_42%,rgba(103,232,249,0.2))]",
                "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:xor] before:[mask-clip:padding-box,border-box]",
              )}
            >
              <div className="pointer-events-none absolute -right-24 top-0 size-56 rounded-full bg-violet-500/15 blur-3xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-20 -left-12 size-44 rounded-full bg-[#67e8f9]/10 blur-3xl" aria-hidden />

              <p className="font-display text-lg italic leading-snug text-white/88 md:text-xl">
                “Estrategias digitales con identidad sanjuanina.”
              </p>
              <p className="mt-3 text-sm text-white/45">Respuesta ágil · Presupuesto sin compromiso</p>

              <div className="mt-10">{ctaButtons}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

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
        <HeroBackgroundVideo />
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

      {/* Por qué elegirnos */}
      <motion.section
        id="por-que"
        className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
        {...sectionEnter}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="relative h-full min-h-full w-full">
            <SeoSectionBackground reducedMotion={prefersReducedMotion} />
          </div>
        </div>
        {/* Velada fuerte: el vídeo queda muy atenuado detrás del contenido */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-black/55" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/38 to-black/58"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-black/22 to-black/44"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_95%_90%_at_50%_42%,transparent_18%,rgba(0,0,0,0.72)_100%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-14 max-w-3xl">
            <span className="liquid-glass mb-5 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
              ¿Por qué elegirnos?
            </span>
            <h2 className="font-display text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">
              Webs premium pensadas para{" "}
              <span className="text-white/75">convertir y posicionar</span>.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {porQueItems.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px 0px", amount: 0.08 }}
                transition={{ duration: 0.72, delay: idx * 0.04, ease: easePremium }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -6, transition: { duration: 0.35, ease: easePremium } }
                }
              >
                <SpotlightFeatureCard className="liquid-glass h-full border border-white/[0.07] bg-black/30 p-7 transition-shadow duration-300 group-hover:border-white/15 group-hover:shadow-[0_28px_70px_-28px_rgba(167,139,250,0.22)]">
                  <div className="relative z-10">
                    <motion.div
                      className="liquid-glass-strong mb-4 inline-flex size-10 items-center justify-center rounded-full"
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="size-[18px] text-white/90" strokeWidth={1.35} aria-hidden />
                    </motion.div>
                    <h3 className="font-display text-xl tracking-tight text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">{item.body}</p>
                  </div>
                </SpotlightFeatureCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SEO */}
      <motion.section className="relative overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28" {...sectionEnter}>
        <SectionVideoFrame>
          <SeoSectionBackground reducedMotion={prefersReducedMotion} videoSources={HERO_BG_VIDEO_SOURCES} />
        </SectionVideoFrame>
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
            <div>
              <span className="liquid-glass mb-5 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
                SEO en San Juan
              </span>
              <h2 className="font-display text-3xl leading-tight tracking-tight text-white md:text-5xl">
                Diseño web con SEO: la clave para destacar
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/65">
                Un sitio atractivo sin optimización no genera el tráfico que merecés. Aplicamos técnicas concretas para
                que tu marca sea encontrada.
              </p>
            </div>
            <div className="liquid-glass rounded-3xl p-8 md:p-10">
              <ul className="space-y-4">
                {seoTactics.map((t, i) => (
                  <motion.li
                    key={t.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: easePremium }}
                    whileHover={
                      prefersReducedMotion ? undefined : { x: 6, transition: { duration: 0.25 } }
                    }
                    className="flex cursor-default gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                      <BarChart3 className="size-4 text-[#c4b5fd]" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-white">{t.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{t.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* E-commerce */}
      <EcommerceSpotlightSection prefersReducedMotion={prefersReducedMotion} />

      {/* Landing */}
      <ServiceSpotlightSection variant="landing" prefersReducedMotion={prefersReducedMotion} />

      {/* WordPress */}
      <ServiceSpotlightSection variant="wordpress" prefersReducedMotion={prefersReducedMotion} />

      {/* CRM */}
      <ServiceSpotlightSection variant="crm" prefersReducedMotion={prefersReducedMotion} />

      {/* Cierre */}
      <CierreSpotlightSection prefersReducedMotion={prefersReducedMotion} />

      <motion.footer {...footerEnter}>
        <FooterSection />
      </motion.footer>
    </main>
  )
}
