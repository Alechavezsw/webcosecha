"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { ArrowUpRight, Megaphone, Share2, Building2 } from "lucide-react"
import { FooterSection } from "@/components/landing/footer-section"
import { Navigation } from "@/components/landing/navigation"
import { DisenoHero } from "@/components/landing/servicios/diseno-hero"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { DisenoServiciosMarquee } from "@/components/landing/servicios/diseno-servicios-marquee"
import { DisenoPageAmbient } from "@/components/landing/servicios/diseno-page-ambient"
import { DisenoPortfolioGrid } from "@/components/landing/servicios/diseno-portfolio-grid"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"
import { DISENO_STORIES_IMAGES } from "@/lib/diseno-stories-images"
import { mokamiliaGallerySrcs } from "@/components/landing/project-gallery/mokamilia-assets"
import { Marquee } from "@/components/ui/marquee"

/** Muestra de piezas de redes reales, sin repetir las que usa el portafolio. */
const STORIES_STRIP = DISENO_STORIES_IMAGES.slice(12, 26)

const easePremium = [0.22, 1, 0.36, 1] as const

/** Ritmo vertical de la página: compacto y parejo entre bloques. */
const sectionPy = "py-16 md:py-20 lg:py-24"

/**
 * Tres frentes de trabajo, ilustrados con piezas reales del estudio
 * (antes eran fotos de stock de Unsplash, ajenas a la marca).
 */
const FRENTES = [
  {
    id: "redes",
    n: "01",
    icon: Share2,
    title: "Redes sociales",
    body: "Contenido constante con una estética que se reconoce. Publicaciones, carruseles e historias que informan, promocionan y venden.",
    image: DISENO_STORIES_IMAGES[1],
    accent: "#eca8d6",
  },
  {
    id: "publicitario",
    n: "02",
    icon: Megaphone,
    title: "Publicidad y eventos",
    body: "Piezas para campañas, lanzamientos y anuncios pagos. Pensadas para que el usuario haga algo: consultar, comprar, reservar.",
    image: "/diseno-stacked/01-banderamodelo.jpg",
    accent: "#e879f9",
  },
  {
    id: "institucional",
    n: "03",
    icon: Building2,
    title: "Institucional",
    body: "Presentaciones, catálogos, dossiers y papelería. Material listo para enviar, imprimir o publicar.",
    image: mokamiliaGallerySrcs[0],
    accent: "#a78bfa",
  },
] as const

/** Cómo trabajamos, en cuatro pasos de una línea cada uno. */
const PROCESO = [
  { n: "01", title: "Briefing", body: "Qué vendés, a quién y qué pieza necesitás." },
  { n: "02", title: "Concepto", body: "Definimos tono, paleta y sistema visual." },
  { n: "03", title: "Diseño", body: "Producimos las piezas y ajustamos con vos." },
  { n: "04", title: "Entrega", body: "Archivos editables y listos para cada canal." },
] as const

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easePremium } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePremium, staggerChildren: 0.08 },
  },
}

function FrenteCard({ frente }: { frente: (typeof FRENTES)[number] }) {
  const Icon = frente.icon

  return (
    <motion.article
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-500 hover:border-white/20"
    >
      {/* Pieza real del estudio */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frente.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 20%, rgba(3,3,8,0.55) 70%, rgba(3,3,8,0.95) 100%), linear-gradient(140deg, ${frente.accent}26, transparent 55%)`,
          }}
          aria-hidden
        />
        <span
          className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl border backdrop-blur-md"
          style={{ borderColor: `${frente.accent}59`, background: `${frente.accent}1f` }}
        >
          <Icon className="size-[18px]" style={{ color: frente.accent }} strokeWidth={1.5} aria-hidden />
        </span>
        <span className="absolute right-4 top-4 font-mono text-[11px] tracking-[0.22em] text-white/40">
          {frente.n}
        </span>
      </div>

      <div className="relative p-6">
        <div
          className="absolute inset-x-6 top-0 h-px opacity-70"
          style={{ background: `linear-gradient(90deg, ${frente.accent}, transparent)` }}
          aria-hidden
        />
        <h3 className="font-display text-2xl leading-tight tracking-tight text-white">{frente.title}</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-white/60">{frente.body}</p>
      </div>
    </motion.article>
  )
}

export function DisenoGraficoClient() {
  const reduce = useReducedMotion()
  const waHref = getWhatsAppHref("Diseño Gráfico")

  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <DisenoPageAmbient />
      {/* Constelación 3D en la paleta creativa (rosa/fucsia/violeta), sin el cian
          que chocaría con el resto de la página. */}
      <TechConstellation
        paletteHex={[0xeca8d6, 0xe879f9, 0xc77dff, 0xa78bfa, 0xf7e6f5]}
        dustColorHex={0xf0b6e0}
        fogColorHex={0x06020e}
      />
      <Navigation />

      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#eca8d6] via-[#e879f9] to-[#a78bfa] shadow-[0_0_12px_rgba(236,168,214,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      <DisenoHero />

      <div id="contenido" className="relative z-10 scroll-mt-6">
        {/* ---------------------------------------------------------- *
         * 1 · Qué hacemos (absorbe la intro larga que había antes)     *
         * ---------------------------------------------------------- */}
        <motion.section
          id="que-hacemos"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className={`diseno-section diseno-section-glow relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
        >
          <div className="relative z-10 mx-auto max-w-[1400px]">
            <motion.span variants={itemVariants} className="cc-eyebrow-accent mb-5 block">
              Catálogo creativo
            </motion.span>
            <motion.h2 variants={itemVariants} className="cc-section-title">
              ¿Qué hacemos?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65"
            >
              No hacemos piezas lindas sueltas: armamos un sistema visual que se sostiene en el tiempo,
              canal por canal.
            </motion.p>

            {/* Tira de piezas reales: el catálogo se ve, no solo se lee */}
            <motion.div variants={itemVariants} className="mt-12">
              <Marquee
                pauseOnHover
                speed="slow"
                repeat={3}
                className="[--gap:0.75rem] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
              >
                {STORIES_STRIP.map((src, i) => (
                  <span
                    key={`${src}-${i}`}
                    className="relative block w-[132px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:w-[150px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[9/16] w-full object-cover opacity-85 transition-opacity duration-500 hover:opacity-100"
                    />
                  </span>
                ))}
              </Marquee>
            </motion.div>

            <DisenoServiciosMarquee />
          </div>
        </motion.section>

        {/* ---------------------------------------------------------- *
         * 2 · Tres frentes (reemplaza los tabs con fotos de stock)     *
         * ---------------------------------------------------------- */}
        <motion.section
          id="frentes"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className={`diseno-section relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_80%_20%,rgba(232,121,249,0.09)_0%,transparent_62%)]"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-[1400px]">
            <div className="max-w-2xl">
              <motion.span variants={itemVariants} className="cc-eyebrow-accent mb-5 block">
                Tres frentes
              </motion.span>
              <motion.h2 variants={itemVariants} className="cc-section-title">
                Dónde entra el diseño
              </motion.h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
              {FRENTES.map((f) => (
                <FrenteCard key={f.id} frente={f} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ---------------------------------------------------------- *
         * 3 · Proceso — riel horizontal de cuatro pasos                *
         * ---------------------------------------------------------- */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="diseno-section relative overflow-hidden px-6 py-14 md:py-16 lg:px-12 lg:py-20"
        >
          <div className="relative z-10 mx-auto max-w-[1400px]">
            <motion.span variants={itemVariants} className="cc-eyebrow-accent mb-8 block">
              Cómo trabajamos
            </motion.span>

            <div className="relative">
              {/* Riel que une los pasos en desktop */}
              <div
                className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-[#eca8d6]/45 via-[#a78bfa]/30 to-transparent md:block"
                aria-hidden
              />

              <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
                {PROCESO.map((p) => (
                  <motion.li key={p.n} variants={itemVariants} className="group relative">
                    <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[#eca8d6]/35 bg-[#0a0512] font-mono text-[11px] tracking-[0.14em] text-[#eca8d6] transition-all duration-500 group-hover:border-[#eca8d6]/70 group-hover:shadow-[0_0_24px_-6px_rgba(236,168,214,0.9)]">
                      {p.n}
                    </span>
                    <h3 className="mt-5 font-display text-xl tracking-tight text-white sm:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-[26ch] text-[0.95rem] leading-relaxed text-white/55">
                      {p.body}
                    </p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </motion.section>

        {/* ---------------------------------------------------------- *
         * 4 · Portafolio                                               *
         * ---------------------------------------------------------- */}
        <DisenoPortfolioGrid />

        {/* ---------------------------------------------------------- *
         * 5 · Cierre                                                   *
         * ---------------------------------------------------------- */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={`diseno-section relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
        >
          <motion.div
            variants={itemVariants}
            className="relative mx-auto max-w-[1400px] overflow-hidden rounded-2xl border border-white/12 p-8 md:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12"
          >
            <div
              className="pointer-events-none absolute -inset-10 opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, rgba(236,168,214,0.12) 0%, transparent 42%, transparent 58%, rgba(167,139,250,0.1) 100%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl lg:text-5xl">
                ¿Arrancamos por tu marca?
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
                Contanos qué necesitás diseñar y te armamos una propuesta a medida.
              </p>
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-0 lg:min-w-[240px] lg:flex-col">
              <Button
                asChild
                size="sm"
                className="group h-11 gap-2 rounded-full bg-[#eca8d6] px-6 text-[13px] font-semibold text-black transition-all duration-300 hover:bg-[#f2bee2] hover:shadow-[0_14px_36px_-14px_rgba(236,168,214,0.7)]"
              >
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-[17px] shrink-0 text-black" />
                  Consultar por WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-11 rounded-full border-white/25 bg-transparent px-6 text-[13px] font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/[0.06]"
              >
                <a href="mailto:contacto@cosechacreativa.com.ar?subject=Dise%C3%B1o%20gr%C3%A1fico">Email</a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-11 justify-start text-white/55 hover:text-white"
              >
                <a href="/#soluciones" className="gap-1.5 px-2">
                  Ver otros servicios
                  <ArrowUpRight className="size-4 shrink-0" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.section>

        <FooterSection />
      </div>
    </main>
  )
}
