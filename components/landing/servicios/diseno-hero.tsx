"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"

const easePremium = [0.22, 1, 0.36, 1] as const

/** Páginas del logofolio real, derivadas livianas en `public/diseno-portfolio/lite/`. */
const LOGO_WALL = [
  "0003",
  "0004",
  "0005",
  "0006",
  "0007",
  "0008",
  "0009",
  "0010",
  "0011",
  "0012",
  "0013",
  "0014",
].map((p) => `/diseno-portfolio/lite/${p}.webp`)

const DISCIPLINAS = ["Identidad", "Redes", "Publicidad", "Editorial", "Merchandising"] as const

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easePremium } },
} as const

/** Columna de piezas que se desplaza sola; duplicada para que el loop no corte. */
function WallColumn({
  images,
  direction,
  duration,
  reduce,
}: {
  images: string[]
  direction: "up" | "down"
  duration: number
  reduce: boolean | null
}) {
  const loop = [...images, ...images]

  return (
    <motion.div
      className="flex flex-col gap-4"
      animate={reduce ? undefined : { y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {loop.map((src, i) => (
        <figure
          key={`${src}-${i}`}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_18px_46px_-24px_rgba(0,0,0,0.9)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="block w-full opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(236,168,214,0.16),transparent_45%,rgba(167,139,250,0.14))] mix-blend-overlay"
            aria-hidden
          />
        </figure>
      ))}
    </motion.div>
  )
}

export function DisenoHero() {
  const reduce = useReducedMotion()
  const waHref = getWhatsAppHref("Diseño Gráfico")

  const colA = LOGO_WALL.slice(0, 6)
  const colB = LOGO_WALL.slice(6)

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-28 lg:px-12 lg:pb-24 lg:pt-32">
      {/* Resplandor superior propio de la página */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(60vh,520px)] bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(236,168,214,0.16)_0%,transparent_70%)]"
        aria-hidden
      />

      <motion.div
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-12 lg:gap-16"
      >
        {/* Texto */}
        <div className="lg:col-span-7">
          <motion.div variants={heroItem}>
            <Link
              href="/#soluciones"
              className="mb-9 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[13px] text-white/70 backdrop-blur-sm transition-all hover:border-[#eca8d6]/40 hover:text-white"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Volver a soluciones
            </Link>
          </motion.div>

          <motion.span
            variants={heroItem}
            className="mb-5 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.24em] text-[#eca8d6]/90"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#eca8d6]/60" />
            Diseño gráfico · San Juan
          </motion.span>

          <motion.h1
            variants={heroItem}
            className="font-display text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.92] tracking-tight text-white"
          >
            Diseño que hace
            <span className="mt-1 block bg-gradient-to-r from-[#eca8d6] via-[#e879f9] to-[#a78bfa] bg-clip-text text-transparent">
              que te elijan
            </span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl"
          >
            Identidad, piezas para redes, campañas y material comercial. Coherente en todos lados,
            desde el logo hasta el roll-up.
          </motion.p>

          <motion.div variants={heroItem} className="mt-7 flex flex-wrap gap-2">
            {DISCIPLINAS.map((d) => (
              <span
                key={d}
                className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 backdrop-blur-sm transition-colors hover:border-[#eca8d6]/40 hover:text-white sm:text-[11px]"
              >
                {d}
              </span>
            ))}
          </motion.div>

          <motion.div variants={heroItem} className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="sm"
              className="group h-11 gap-2 rounded-full bg-[#eca8d6] px-6 text-[13px] font-semibold text-black transition-all duration-300 hover:bg-[#f2bee2] hover:shadow-[0_14px_36px_-14px_rgba(236,168,214,0.7)]"
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="size-[17px] shrink-0 text-black" />
                Pedir presupuesto
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="group h-11 gap-2 rounded-full border-white/25 bg-transparent px-6 text-[13px] font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/[0.06] hover:text-white"
            >
              <a href="#portfolio">
                Ver trabajos
                <ArrowDown className="size-3.5 shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Muro de piezas reales */}
        <motion.div variants={heroItem} className="lg:col-span-5">
          <div
            className="relative h-[420px] overflow-hidden sm:h-[520px] lg:h-[620px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]"
            aria-hidden
          >
            <div className="grid grid-cols-2 gap-4">
              <WallColumn images={colA} direction="up" duration={42} reduce={reduce} />
              <div className="pt-10">
                <WallColumn images={colB} direction="down" duration={50} reduce={reduce} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            Logofolio Cosecha Creativa
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
