"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { mokamiliaGallerySrcs } from "@/components/landing/project-gallery/mokamilia-assets"
import { DISENO_STORIES_IMAGES } from "@/lib/diseno-stories-images"

const easePremium = [0.22, 1, 0.36, 1] as const

/** Derivados livianos en `public/diseno-stacked/lite/` (los JPG originales pesan hasta 880 KB). */
const stacked = (name: string) => `/diseno-stacked/lite/${name}.webp`

type Pieza = {
  src: string
  title: string
  kind: string
  /** Tamaño dentro del bento */
  span: string
  objectPosition?: string
}

const PIEZAS: Pieza[] = [
  {
    src: mokamiliaGallerySrcs[3],
    title: "Papelería corporativa",
    kind: "Identidad",
    span: "col-span-2 row-span-2",
  },
  {
    src: DISENO_STORIES_IMAGES[4],
    title: "Historias para redes",
    kind: "Social",
    span: "col-span-1 row-span-2",
  },
  {
    src: stacked("01-banderamodelo"),
    title: "Banderas y señalética",
    kind: "Eventos",
    span: "col-span-1 row-span-1",
  },
  {
    src: stacked("02-gorra"),
    title: "Gorras personalizadas",
    kind: "Merchandising",
    span: "col-span-1 row-span-1",
  },
  {
    src: mokamiliaGallerySrcs[0],
    title: "Brochure institucional",
    kind: "Editorial",
    span: "col-span-2 row-span-2",
  },
  {
    src: DISENO_STORIES_IMAGES[10],
    title: "Placas informativas",
    kind: "Social",
    span: "col-span-1 row-span-1",
  },
  {
    src: stacked("04-piluso"),
    title: "Textiles con logo",
    kind: "Merchandising",
    span: "col-span-1 row-span-1",
  },
  {
    src: stacked("06-sin-titulo-wide"),
    title: "Roll-ups institucionales",
    kind: "Eventos",
    span: "col-span-2 row-span-1",
  },
]

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: easePremium } },
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

function PiezaCard({ pieza }: { pieza: Pieza }) {
  return (
    <motion.figure
      variants={itemVariants}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${pieza.span}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pieza.src}
        alt={pieza.title}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        style={pieza.objectPosition ? { objectPosition: pieza.objectPosition } : undefined}
      />

      {/* Velo permanente suave + refuerzo en hover para que el texto se lea */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05010c]/85 via-[#05010c]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(236,168,214,0.18),transparent_45%,rgba(167,139,250,0.16))] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#eca8d6]">
          {pieza.kind}
        </span>
        <span className="mt-1 flex items-center gap-1.5 font-display text-base leading-tight tracking-tight text-white sm:text-lg">
          {pieza.title}
          <ArrowUpRight className="size-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-70" />
        </span>
      </figcaption>

      {/* Filete de acento que aparece al pasar el cursor */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#eca8d6] via-[#e879f9] to-transparent transition-transform duration-700 group-hover:scale-x-100"
        aria-hidden
      />
    </motion.figure>
  )
}

export function DisenoPortfolioGrid() {
  const reduce = useReducedMotion()

  return (
    <section
      id="portfolio"
      className="diseno-section diseno-section-glow relative overflow-hidden px-6 py-16 md:py-20 lg:px-12 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_15%,rgba(236,168,214,0.09)_0%,transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <motion.div
          className="max-w-2xl"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easePremium }}
        >
          <span className="cc-eyebrow-accent mb-5 block">Portafolio</span>
          <h2 className="cc-section-title text-white">Piezas que hablan por tu marca</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/65">
            Trabajos reales del estudio: identidad, editorial, redes y merchandising.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="mt-12 grid auto-rows-[120px] grid-cols-2 gap-3 sm:auto-rows-[150px] md:grid-cols-4 md:gap-4 lg:auto-rows-[170px]"
        >
          {PIEZAS.map((p) => (
            <PiezaCard key={p.src + p.title} pieza={p} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
