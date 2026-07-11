"use client"

import Link from "next/link"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { FooterSection } from "@/components/landing/footer-section"
import { Navigation } from "@/components/landing/navigation"
import { DisenoHero } from "@/components/landing/servicios/diseno-hero"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { RevealText } from "@/components/ui/reveal-text"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { DisenoServiciosMarquee } from "@/components/landing/servicios/diseno-servicios-marquee"
import { DisenoVerticalTabs } from "@/components/landing/servicios/diseno-vertical-tabs"
import { DisenoPageAmbient } from "@/components/landing/servicios/diseno-page-ambient"
import { DisenoPortfolioGrid } from "@/components/landing/servicios/diseno-portfolio-grid"
import { TechConstellation } from "@/components/landing/servicios/tech-constellation"

const easePremium = [0.22, 1, 0.36, 1] as const

export function DisenoGraficoClient() {
  const reduce = useReducedMotion()
  const waHref = getWhatsAppHref("Diseño Gráfico")

  /** Progreso de scroll de toda la página → barra superior (coherente con las demás de servicios) */
  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <DisenoPageAmbient />
      {/* Constelación 3D recoloreada a la paleta creativa (rosa/fucsia/violeta) — capa de
          profundidad sobre el wash de color del ambient. Coherente con las otras páginas
          de servicios pero sin el cian que chocaría acá. */}
      <TechConstellation
        paletteHex={[0xeca8d6, 0xe879f9, 0xc77dff, 0xa78bfa, 0xf7e6f5]}
        dustColorHex={0xf0b6e0}
        fogColorHex={0x06020e}
      />
      <Navigation />

      {/* Barra de progreso de scroll — paleta creativa */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#eca8d6] via-[#e879f9] to-[#a78bfa] shadow-[0_0_12px_rgba(236,168,214,0.6)]"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      <DisenoHero />

      <div id="contenido" className="relative z-10 scroll-mt-6">
        <section className="diseno-section diseno-section-glow relative overflow-hidden">
          <BackgroundGradientAnimation
            gradientBackgroundStart="#030308"
            gradientBackgroundEnd="#06020e"
            containerClassName="min-h-full w-full !bg-transparent"
            className="px-6 py-20 lg:px-12 lg:py-28"
            firstColor="236, 168, 214"
            secondColor="242, 0, 137"
            thirdColor="209, 0, 209"
            fourthColor="161, 0, 242"
            fifthColor="236, 168, 214"
            pointerColor="209, 0, 209"
            size="58%"
            blendingValue="soft-light"
          >
            <motion.div
              className="mx-auto max-w-3xl"
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.85, ease: easePremium }}
            >
              <Link
                href="/#soluciones"
                className="mb-10 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Volver a soluciones
              </Link>
              <p className="text-lg leading-relaxed text-white/85 md:text-xl">
                En{" "}
                <RevealText
                  text="Cosecha Creativa"
                  inline
                  fontSize="text-[clamp(1.75rem,5vw,2.5rem)]"
                  textColor="text-white"
                  overlayColor="text-[#eca8d6]"
                  letterDelay={0.06}
                  overlayDelay={0.04}
                  overlayDuration={0.45}
                  springDuration={500}
                  className="mx-1"
                />{" "}
                creamos diseños que ayudan a tu marca a comunicar mejor, vender más y destacarse en un
                mundo cada vez más visual.
              </p>
              <p className="mt-6 leading-relaxed text-white/70">
                Trabajamos el diseño gráfico y digital desde una mirada estratégica: no se trata solo de
                hacer piezas lindas, sino de construir una imagen profesional, coherente y atractiva para tu
                empresa, emprendimiento o institución.
              </p>
              <p className="mt-6 leading-relaxed text-white/70">
                Diseñamos contenidos pensados para redes sociales, campañas publicitarias, sitios web,
                presentaciones, eventos y materiales comerciales. Cada pieza se adapta a la identidad de tu
                marca y al objetivo que querés lograr.
              </p>
            </motion.div>
          </BackgroundGradientAnimation>
        </section>

        <section
          id="que-hacemos"
          className="diseno-section diseno-section-glow relative overflow-hidden px-6 py-20 lg:px-12 lg:py-28"
        >
          <motion.div
            className="relative z-10 mx-auto max-w-[1400px]"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: easePremium }}
          >
            <span className="cc-eyebrow-accent mb-6 block">
              Catálogo creativo
            </span>
            <h2 className="cc-section-title mt-3">
              ¿Qué hacemos?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
              Creamos piezas visuales para que tu marca tenga presencia en todos los canales digitales y
              comerciales.
            </p>

            <DisenoServiciosMarquee />
          </motion.div>
        </section>

        <DisenoVerticalTabs />

        <DisenoPortfolioGrid />

        <section className="diseno-section relative overflow-hidden px-6 py-20 lg:px-12 lg:py-28">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(236,168,214,0.1)_0%,transparent_65%)]"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="cc-section-title md:text-4xl">
              ¿Listo para mejorar la imagen de tu marca?
            </h2>
            <p className="mt-4 text-white/60">
              Contanos qué necesitás diseñar y te armamos una propuesta a medida.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2 rounded-full bg-[#eca8d6] text-black hover:bg-[#f0b8e0]">
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </section>

        <FooterSection />
      </div>
    </main>
  )
}
