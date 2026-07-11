"use client"

import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"
import {
  BookOpen,
  Clapperboard,
  FileImage,
  FolderOpen,
  GalleryHorizontal,
  Layout,
  Megaphone,
  MessageCircle,
  PartyPopper,
  Presentation,
  RectangleHorizontal,
  Share2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { Fragment, type CSSProperties } from "react"

type ServicioItem = {
  label: string
  icon: LucideIcon
  accent: string
  glow: string
}

const serviciosMarquee: ServicioItem[] = [
  {
    label: "Diseño de piezas para redes sociales",
    icon: Share2,
    accent: "from-[#eca8d6] to-[#f472b6]",
    glow: "rgba(236,168,214,0.45)",
  },
  {
    label: "Flyers digitales",
    icon: FileImage,
    accent: "from-[#c084fc] to-[#a78bfa]",
    glow: "rgba(192,132,252,0.4)",
  },
  {
    label: "Banners publicitarios",
    icon: RectangleHorizontal,
    accent: "from-[#67e8f9] to-[#38bdf8]",
    glow: "rgba(103,232,249,0.38)",
  },
  {
    label: "Creatividades para Meta Ads y Google Ads",
    icon: Megaphone,
    accent: "from-[#f9a8d4] to-[#ec4899]",
    glow: "rgba(249,168,212,0.42)",
  },
  {
    label: "Diseño de carruseles para Instagram",
    icon: GalleryHorizontal,
    accent: "from-[#fda4af] to-[#fb7185]",
    glow: "rgba(253,164,175,0.4)",
  },
  {
    label: "Historias y placas informativas",
    icon: Sparkles,
    accent: "from-[#e9d5ff] to-[#c084fc]",
    glow: "rgba(233,213,255,0.35)",
  },
  {
    label: "Portadas para reels",
    icon: Clapperboard,
    accent: "from-[#a5b4fc] to-[#818cf8]",
    glow: "rgba(165,180,252,0.4)",
  },
  {
    label: "Presentaciones comerciales",
    icon: Presentation,
    accent: "from-[#eca8d6] to-[#a78bfa]",
    glow: "rgba(236,168,214,0.4)",
  },
  {
    label: "Catálogos digitales",
    icon: BookOpen,
    accent: "from-[#7dd3fc] to-[#67e8f9]",
    glow: "rgba(125,211,252,0.38)",
  },
  {
    label: "Dossiers institucionales",
    icon: FolderOpen,
    accent: "from-[#d8b4fe] to-[#a855f7]",
    glow: "rgba(216,180,254,0.38)",
  },
  {
    label: "Diseño de piezas para WhatsApp",
    icon: MessageCircle,
    accent: "from-[#86efac] to-[#4ade80]",
    glow: "rgba(134,239,172,0.32)",
  },
  {
    label: "Gráficas para sitios web y landing pages",
    icon: Layout,
    accent: "from-[#67e8f9] to-[#a78bfa]",
    glow: "rgba(103,232,249,0.35)",
  },
  {
    label: "Diseño de identidad visual para campañas",
    icon: Sparkles,
    accent: "from-[#f0abfc] to-[#e879f9]",
    glow: "rgba(240,171,252,0.4)",
  },
  {
    label: "Material gráfico para eventos",
    icon: PartyPopper,
    accent: "from-[#fcd34d] to-[#fbbf24]",
    glow: "rgba(252,211,77,0.35)",
  },
]

const rowA = serviciosMarquee.slice(0, 5)
const rowB = serviciosMarquee.slice(5, 10)
const rowC = serviciosMarquee.slice(10)

function MarqueeGem() {
  return (
    <span className="mx-2 inline-flex shrink-0 items-center md:mx-4" aria-hidden>
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#eca8d6]/30" />
        <span className="relative h-1.5 w-1.5 rotate-45 rounded-[1px] bg-gradient-to-br from-[#eca8d6] via-white to-[#67e8f9] shadow-[0_0_14px_rgba(236,168,214,0.8)]" />
      </span>
    </span>
  )
}

function ServicioPill({ item, index }: { item: ServicioItem; index: number }) {
  const Icon = item.icon

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={cn(
        "group/pill relative inline-flex shrink-0 cursor-default items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.12] px-4 py-3 md:gap-3.5 md:px-5 md:py-3.5",
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_45%,rgba(0,0,0,0.2)_100%)]",
        "shadow-[0_12px_48px_-16px_var(--pill-glow),inset_0_1px_0_rgba(255,255,255,0.12)]",
        "backdrop-blur-xl transition-[box-shadow,border-color] duration-300",
        "hover:border-white/25 hover:shadow-[0_20px_56px_-12px_var(--pill-glow),inset_0_1px_0_rgba(255,255,255,0.2)]",
      )}
      style={{ "--pill-glow": item.glow } as CSSProperties}
    >
      <span
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/pill:opacity-100"
        style={{ background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)` }}
        aria-hidden
      />
      <span
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ring-1 ring-white/20",
          item.accent,
        )}
      >
        <Icon className="h-[18px] w-[18px] text-white drop-shadow-sm" strokeWidth={1.75} aria-hidden />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] font-semibold tabular-nums text-white/70 ring-1 ring-white/15">
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
      <span className="relative max-w-[min(280px,42vw)] font-display text-base leading-snug tracking-tight text-white md:max-w-none md:text-lg">
        <span className="bg-gradient-to-r from-white via-white to-white/75 bg-clip-text text-transparent">
          {item.label}
        </span>
      </span>
    </motion.span>
  )
}

function MarqueeRow({
  items,
  reverse,
  durationClass,
  className,
}: {
  items: ServicioItem[]
  reverse?: boolean
  durationClass: string
  className?: string
}) {
  return (
    <Marquee
      reverse={reverse}
      pauseOnHover
      repeat={4}
      className={cn("[--gap:14px] py-1", durationClass, className)}
    >
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 ? <MarqueeGem /> : null}
          <ServicioPill
            item={item}
            index={serviciosMarquee.findIndex((s) => s.label === item.label)}
          />
        </Fragment>
      ))}
    </Marquee>
  )
}

function MarqueeBackdrop() {
  return (
  <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,rgba(236,168,214,0.14)_0%,transparent_55%),radial-gradient(ellipse_70%_60%_at_0%_80%,rgba(167,139,250,0.1)_0%,transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_70%,rgba(103,232,249,0.08)_0%,transparent_48%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/50 to-transparent"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(4rem,18vw,11rem)] font-medium italic leading-none tracking-tighter text-white/[0.03]"
        aria-hidden
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        Diseño
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -left-24 top-1/4 h-56 w-56 rounded-full bg-[#eca8d6]/20 blur-[90px]"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-48 w-48 rounded-full bg-violet-500/15 blur-[80px]"
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-black via-black/95 to-transparent md:w-32" aria-hidden />
      <motion.div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-black via-black/95 to-transparent md:w-32" aria-hidden />
    </>
  )
}

export function DisenoServiciosMarquee() {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm md:p-8">
        <MarqueeBackdrop />
        <ul className="relative z-10 flex flex-wrap justify-center gap-3">
          {serviciosMarquee.map((item, i) => (
            <li key={item.label}>
              <ServicioPill item={item} index={i} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/[0.1] bg-[linear-gradient(180deg,rgba(14,10,18,0.95)_0%,rgba(0,0,0,0.92)_50%,rgba(10,8,14,0.95)_100%)] py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_100px_-40px_rgba(236,168,214,0.2)] md:py-10">
      <MarqueeBackdrop />

      <div className="relative z-10 space-y-5 md:space-y-6">
        <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">
          <MarqueeRow items={rowA} durationClass="[--duration:95s]" />
        </div>
        <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">
          <MarqueeRow items={rowB} reverse durationClass="[--duration:72s]" />
        </div>
        <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">
          <MarqueeRow items={rowC} durationClass="[--duration:58s]" className="md:[--gap:16px]" />
        </div>
      </div>
    </div>
  )
}
