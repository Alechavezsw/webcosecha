"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  Flag,
  ImageIcon,
  Layers,
  Package,
  Palette,
  Share2,
  Shirt,
  Sparkles,
  Star,
} from "lucide-react"
import { mokamiliaGallerySrcs } from "@/components/landing/project-gallery/mokamilia-assets"
import { DISENO_STACKED_IMAGES } from "@/lib/diseno-stacked-images"
import { InteractiveSelector, type InteractiveSelectorOption } from "./interactive-selector"

// Selección sin piezas repetidas: IMG_0259 duplica el brochure de IMG_0257 y
// 06-sin-titulo-wide repite los roll-ups de 05-sin-titulo.
const MOKAMILIA_OPTIONS: InteractiveSelectorOption[] = [
  {
    image: mokamiliaGallerySrcs[0],
    title: "Diseño editorial",
    description: "Brochure institucional",
    icon: Layers,
  },
  {
    image: mokamiliaGallerySrcs[1],
    title: "Identidad visual",
    description: "Portadas y sistema de marca",
    icon: Palette,
  },
  {
    image: mokamiliaGallerySrcs[3],
    title: "Papelería corporativa",
    description: "Tarjetas personales premium",
    icon: ImageIcon,
  },
  {
    image: mokamiliaGallerySrcs[4],
    title: "Piezas digitales",
    description: "Contenido para redes",
    icon: Share2,
  },
]

const STACKED_OPTIONS: InteractiveSelectorOption[] = DISENO_STACKED_IMAGES.slice(0, 5).map(
  (image, index) => {
    const meta = [
      {
        title: "Banderas y señalética",
        description: "Merchandising para eventos",
        icon: Flag,
      },
      {
        title: "Gorras personalizadas",
        description: "Producto con identidad de marca",
        icon: Shirt,
      },
      {
        title: "Variantes de producto",
        description: "Aplicaciones sobre distintos soportes",
        icon: Package,
      },
      {
        title: "Pilusos y accesorios",
        description: "Piezas textiles con logo",
        icon: Star,
      },
      {
        title: "Roll-ups institucionales",
        description: "Banners para eventos y stands",
        icon: Sparkles,
      },
    ][index]

    return { image: image.src, ...meta }
  },
)

const PORTFOLIO_OPTIONS = [...MOKAMILIA_OPTIONS, ...STACKED_OPTIONS]

export function DisenoPortfolioGrid() {
  const reduce = useReducedMotion()

  return (
    <section
      id="portfolio"
      className="diseno-section diseno-section-glow relative overflow-hidden"
    >
      <div className="relative z-10 px-6 pt-20 pb-4 lg:px-12 lg:pt-28">
        <motion.div
          className="mx-auto max-w-[1400px] text-center"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="cc-eyebrow-accent mb-6 block">
            Portafolio
          </span>
          <h2 className="cc-section-title mt-3 text-white">
            Piezas que hablan por tu marca
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
            Hacé clic en cada pieza para explorar nuestros trabajos de diseño.
          </p>
        </motion.div>
      </div>

      <div className="relative z-20 flex justify-center px-6 pb-24 pt-8 lg:px-12">
        <InteractiveSelector options={PORTFOLIO_OPTIONS} className="w-full max-w-[900px]" />
      </div>
    </section>
  )
}
