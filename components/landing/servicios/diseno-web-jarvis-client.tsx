"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { Navigation } from "@/components/landing/navigation"
import {
  PortfolioMacbookShowcase,
  PORTFOLIO_PUBLIC_URL as PORTFOLIO_URL,
} from "@/components/landing/servicios/portfolio-macbook-showcase"
import { PortfolioWebdisGallery } from "@/components/landing/servicios/portfolio-webdis-gallery"
import { CheckoutVisual, SerpClimbVisual, ServiceVisual } from "@/components/landing/servicios/diseno-web-visuals"
import { JarvisParticleCanvas } from "@/components/landing/servicios/jarvis-particle-canvas"
import { DotMotif } from "@/components/landing/servicios/jarvis-dot-motifs"
import { DisenoWebJarvisCierre } from "@/components/landing/servicios/diseno-web-jarvis-cierre"
import { FooterSection } from "@/components/landing/footer-section"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import "./jarvis-diseno-web.css"

/**
 * /servicios/diseno-web con el diseño portado de `jarvis-agents-that-execute-autonomously`.
 *
 * Del diseño original se conserva lo que lo define: retícula de hairlines de
 * 1 px, titulares en condensada itálica mayúscula (sólido contra contorneado),
 * etiquetas de sistema en monoespaciada, radio cero, negro real y una única
 * tinta de acento. Del proyecto anterior se conserva **todo el contenido**:
 * copy, portafolio con sus fotos, tácticas de SEO, los cuatro servicios con
 * sus visuales y el configurador que arma el mensaje de WhatsApp.
 *
 * De las doce secciones del diseño original se usan las que tienen contenido
 * real detrás. Quedaron afuera métricas, precios, testimonios, seguridad,
 * infraestructura y developers: llenarlas habría significado inventar cifras,
 * tarifas y clientes.
 */

const CONTACT_EMAIL = "contacto@cosechacreativa.com.ar"

/**
 * El titular rota sobre lo que la página ya promete en su copy: convertir,
 * posicionar y atraer clientes.
 *
 * El largo importa: la línea que rota comparte tamaño con las dos fijas y vive
 * dentro de un contenedor con `overflow-hidden`, así que una palabra larga no
 * desborda — se **recorta**. A 320 px de ancho entran ~13 caracteres; de ahí el
 * tope. («QUE CARGA RÁPIDO» quedaba cortada por la mitad en móvil.)
 */
const HERO_WORDS = ["QUE CONVIERTE", "QUE POSICIONA", "QUE ATRAE"] as const

const TECH_ROW_1 = [
  { name: "Next.js", cat: "FRAMEWORK" },
  { name: "WordPress", cat: "CMS" },
  { name: "SEO técnico", cat: "POSICIONAMIENTO" },
  { name: "UX/UI", cat: "DISEÑO" },
  { name: "E-commerce", cat: "VENTA" },
] as const

const TECH_ROW_2 = [
  { name: "San Juan", cat: "LOCAL" },
  { name: "Performance", cat: "VELOCIDAD" },
  { name: "Responsive", cat: "MULTIDISPOSITIVO" },
  { name: "Identidad de marca", cat: "BRANDING" },
] as const

/**
 * Cada táctica lleva su propio motivo de puntos. No es decoración suelta: el
 * pulso ilustra la táctica —rastreo disperso para las palabras clave, órbita
 * para el contenido, barrido para lo técnico, señal creciente para los enlaces—
 * y de paso las cuatro filas dejan de ser idénticas.
 */
const SEO_TACTICS = [
  {
    id: "01",
    motif: "grid" as const,
    title: "INVESTIGACIÓN DE\nPALABRAS CLAVE",
    body: "Detectamos lo que tu audiencia busca en San Juan y alrededores.",
  },
  {
    id: "02",
    motif: "orbit" as const,
    title: "CONTENIDO\nOPTIMIZADO",
    body: "Textos únicos y persuasivos para mejorar ranking y conversión.",
  },
  {
    id: "03",
    motif: "scan" as const,
    title: "SEO\nTÉCNICO",
    body: "Indexación, estructura y velocidad alineadas a las guías de Google.",
  },
  {
    id: "04",
    motif: "bars" as const,
    title: "LINK BUILDING\nLOCAL",
    body: "Referencias relevantes que fortalecen la autoridad de tu sitio.",
  },
] as const

const SERVICES = [
  {
    id: "ecommerce",
    n: "01",
    tag: "VENTA ONLINE",
    title: "TIENDAS ONLINE\n& E-COMMERCE",
    body: "Comercios electrónicos seguros, claros para el usuario y listos para escalar — integrados con medios de pago y tu operación.",
    chips: ["Checkout", "Stock", "Pagos", "Envíos"],
    visual: "checkout" as const,
  },
  {
    id: "landing",
    n: "02",
    tag: "CONVERSIÓN",
    title: "LANDING\nPAGES",
    body: "Páginas enfocadas en una sola acción: leads, reservas o campañas pagas — copys y estructura pensados para conversión.",
    chips: ["CTA", "Forms", "A/B", "Ads"],
    visual: "landing" as const,
  },
  {
    id: "wordpress",
    n: "03",
    tag: "CMS & SOPORTE",
    title: "WORDPRESS &\nMANTENIMIENTO",
    body: "Cuando necesitás autonomía para editar contenidos. Con mantenimiento, backups y actualizaciones para que todo siga estable.",
    chips: ["Editor", "Plugins", "Backups", "Updates"],
    visual: "wordpress" as const,
  },
  {
    id: "crm",
    n: "04",
    tag: "OPERACIÓN",
    title: "CRM &\nAUTOMATIZACIÓN",
    body: "Formularios y flujos conectados con tus herramientas de gestión, para que los contactos no se pierdan y el equipo trabaje ordenado.",
    chips: ["Leads", "Flujos", "Alertas", "Integraciones"],
    visual: "crm" as const,
  },
] as const

/* ─────────────────────────────────────────────────────────────
   Utilidades de reveal.

   El diseño original no usa framer-motion: entra con IntersectionObserver y
   una transición de CSS. Se respeta esa mecánica en vez de mezclar dos motores
   de animación en la misma página.
   ───────────────────────────────────────────────────────────── */

function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Sin IntersectionObserver (o con el nodo ya en pantalla al montar) se
    // muestra igual: nunca se queda contenido invisible.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(node)

    // Red de seguridad: si el observer no llega a disparar —pestaña en segundo
    // plano, render throttleado, un salto de scroll por #ancla— el contenido se
    // muestra igual. Una entrada perdida no puede dejar media página en blanco.
    const failsafe = window.setTimeout(() => {
      setVisible(true)
      obs.disconnect()
    }, 2500)

    return () => {
      window.clearTimeout(failsafe)
      obs.disconnect()
    }
  }, [threshold])

  return [ref, visible] as const
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [ref, visible] = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 motion-reduce:opacity-100",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/**
 * Cabecera de sección del diseño: etiqueta de sistema, titular partido en
 * sólido + contorneado, y una nota en monoespaciada alineada a la derecha.
 */
function SectionHead({
  tag,
  solid,
  outline,
  note,
}: {
  tag: string
  solid: string
  outline: string
  note?: string
}) {
  return (
    <Reveal className="flex flex-col gap-6 border-b border-[var(--jv-line)] py-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="jv-tag mb-3 block">{tag}</span>
        <h2 className="jv-display text-5xl leading-[0.88] tracking-tight text-[var(--jv-fg)] sm:text-6xl lg:text-8xl">
          {solid}
          <br />
          <span className="jv-outline">{outline}</span>
        </h2>
      </div>
      {note && (
        <p className="jv-mono max-w-[240px] text-[10px] leading-relaxed tracking-[0.16em] text-[var(--jv-dim)] lg:text-right">
          {note}
        </p>
      )}
    </Reveal>
  )
}

/* ─────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────── */

function Hero() {
  const reduced = useReducedMotion()
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  useEffect(() => {
    // Con «menos movimiento» el titular se queda quieto en la primera palabra.
    if (reduced) return
    const id = setInterval(() => setWordIdx((v) => (v + 1) % HERO_WORDS.length), 2600)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <section className="jv-grid-bg relative flex min-h-screen flex-col justify-center overflow-hidden pt-[88px]">
      {/* Red de partículas: ocupa la mitad derecha en escritorio —donde no hay
          titular— y todo el ancho en móvil, detrás del texto. */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[55%]">
        <JarvisParticleCanvas className="size-full" />
      </div>

      {/* Velo: en móvil la red queda detrás del texto a ancho completo, así que
          se la baja de contraste para que el titular siga siendo lo primero.
          En escritorio la red vive a la derecha y el velo se apaga. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[var(--jv-bg)] via-[var(--jv-bg)]/70 to-transparent lg:from-[var(--jv-bg)]/95 lg:via-transparent"
      />

      {/* Resplandor de acento a la derecha: el contrapeso del titular. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 82% 45%, color-mix(in srgb, var(--jv-accent) 7%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 50% at 12% 85%, color-mix(in srgb, var(--jv-accent-2) 6%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
        <div
          className={cn(
            "transition-all duration-700 motion-reduce:transition-none",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:opacity-100",
          )}
        >
          <Link
            href="/"
            className="jv-mono mb-10 inline-flex items-center gap-3 border border-[var(--jv-line)] px-4 py-2.5 text-[10px] tracking-[0.2em] text-[var(--jv-muted)] transition-colors hover:border-[var(--jv-accent)]/40 hover:text-[var(--jv-accent)]"
          >
            <span aria-hidden>←</span>
            VOLVER AL INICIO
          </Link>

          <p className="jv-mono mb-4 text-[11px] tracking-[0.2em] text-[var(--jv-accent)]">
            — COSECHA CREATIVA · DESARROLLO WEB &amp; EXPERIENCIA DIGITAL
          </p>

          <h1 className="jv-display text-[clamp(2.1rem,11vw,9.5rem)] leading-[0.88] tracking-tight text-[var(--jv-fg)]">
            DISEÑO WEB
          </h1>

          {/* La palabra que rota, en la altura exacta de una línea para que el
              bloque de abajo no salte en cada cambio. */}
          <div className="relative h-[clamp(2.1rem,11vw,9.5rem)] overflow-hidden leading-[0.88]">
            <h2
              key={wordIdx}
              className="jv-display absolute inset-0 text-[clamp(2.1rem,11vw,9.5rem)] leading-[0.88] tracking-tight text-[var(--jv-accent)]"
              style={{ animation: reduced ? undefined : "jv-fade-up 0.28s ease forwards" }}
            >
              {HERO_WORDS[wordIdx]}
            </h2>
          </div>

          <h2 className="jv-display text-[clamp(2.1rem,11vw,9.5rem)] leading-[0.88] tracking-tight">
            <span className="jv-outline">EN SAN JUAN</span>
          </h2>
        </div>

        <div
          className={cn(
            "mt-14 transition-all delay-300 duration-700 motion-reduce:transition-none",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 motion-reduce:opacity-100",
          )}
        >
          <p className="max-w-xl text-base leading-relaxed text-[var(--jv-muted)]">
            En <span className="text-[var(--jv-fg)]">Cosecha Creativa</span> creamos sitios{" "}
            <span className="text-[var(--jv-fg)]">profesionales, modernos y optimizados para SEO</span>. Tu web es una
            herramienta para potenciar tu marca en San Juan y atraer clientes — no solo una carta de presentación.
          </p>

          <div className="mt-8 flex w-fit flex-col gap-3 sm:flex-row">
            <a
              href={getWhatsAppHref("Diseño web premium — San Juan")}
              target="_blank"
              rel="noopener noreferrer"
              className="jv-mono group inline-flex items-center gap-6 bg-[var(--jv-accent)] px-6 py-4 text-sm font-semibold tracking-widest text-[var(--jv-bg)] transition-colors hover:bg-[var(--jv-fg)]"
            >
              <WhatsAppMark className="size-[18px] shrink-0" aria-hidden />
              CONSULTAR POR WHATSAPP
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="jv-mono group inline-flex items-center gap-6 border border-[var(--jv-line)] px-6 py-4 text-sm tracking-widest text-[var(--jv-fg)] transition-colors hover:border-[var(--jv-accent)]/40 hover:text-[var(--jv-accent)]"
            >
              VER PORTAFOLIO
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
          </div>

          <div className="jv-mono mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] tracking-[0.14em] text-[var(--jv-dim)]">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Consulta%20Dise%C3%B1o%20Web`}
              className="inline-flex items-center gap-2 transition-colors hover:text-[var(--jv-accent)]"
            >
              <span className="inline-block size-1 bg-[var(--jv-accent)]" aria-hidden />
              {CONTACT_EMAIL.toUpperCase()}
            </a>
            <span className="inline-flex items-center gap-2">
              <span className="jv-status-pulse inline-block size-1.5 rounded-full bg-[#22c55e]" aria-hidden />
              AGENDA ABIERTA
            </span>
          </div>
        </div>
      </div>

      {/* Cinta inferior a ancho completo: el remate del hero original. */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--jv-line)] py-5">
        <div className="overflow-hidden">
          <div className="jv-marquee-fast flex gap-16 whitespace-nowrap">
            {[0, 1].map((rep) => (
              <span key={rep} className="inline-flex shrink-0 items-center gap-16">
                {[
                  "DISEÑO A MEDIDA",
                  "SEO TÉCNICO",
                  "CARGA RÁPIDA",
                  "RESPONSIVE REAL",
                  "E-COMMERCE",
                  "WORDPRESS AUTOADMINISTRABLE",
                  "SOPORTE Y MANTENIMIENTO",
                  "SAN JUAN, ARGENTINA",
                ].map((item) => (
                  <span
                    key={item}
                    className="jv-mono flex items-center gap-3 text-[10px] tracking-[0.2em] text-[var(--jv-dim)]"
                  >
                    <span className="inline-block size-1 shrink-0 bg-[var(--jv-accent)]" aria-hidden />
                    {item}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STACK — la cinta de tecnologías, con el tratamiento de «integraciones»
   ───────────────────────────────────────────────────────────── */

function TechChip({ name, cat }: { name: string; cat: string }) {
  return (
    <div className="group flex shrink-0 items-center gap-4 border border-[var(--jv-line)] px-5 py-3.5 transition-all duration-200 hover:border-[var(--jv-accent)]/40 hover:bg-[color-mix(in_srgb,var(--jv-accent)_5%,transparent)]">
      <span className="jv-mono text-[9px] tracking-[0.18em] text-[var(--jv-dim)]">{cat}</span>
      <span className="jv-display-straight text-lg text-[var(--jv-muted)] transition-colors group-hover:text-[var(--jv-fg)]">
        {name}
      </span>
    </div>
  )
}

function StackSection() {
  return (
    <section className="relative border-t border-[var(--jv-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHead
          tag="STACK"
          solid="CON QUÉ"
          outline="LO CONSTRUIMOS"
          note="LA HERRAMIENTA LA ELIGE EL PROYECTO / NO AL REVÉS"
        />
      </div>

      {/* Cintas a ancho completo, como en el diseño original. */}
      <div className="overflow-hidden border-b border-[var(--jv-line)] py-4">
        <div className="jv-marquee flex gap-3">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 gap-3">
              {TECH_ROW_1.map((t) => (
                <TechChip key={`${t.name}-${rep}`} {...t} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border-b border-[var(--jv-line)] py-4">
        <div className="jv-marquee-reverse flex gap-3">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 gap-3">
              {TECH_ROW_2.map((t) => (
                <TechChip key={`${t.name}-${rep}`} {...t} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   PORTAFOLIO — acá viven las fotos
   ───────────────────────────────────────────────────────────── */

function PortfolioSection({ reduced }: { reduced: boolean }) {
  return (
    <section id="portafolio" className="relative scroll-mt-[88px] border-t border-[var(--jv-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHead
          tag="PORTAFOLIO"
          solid="MIRÁ NUESTROS"
          outline="TRABAJOS"
          note="ALEJANDRO CHÁVEZ / PORTAFOLIO PÚBLICO CON PROYECTOS Y ESTILO EDITORIAL"
        />

        <Reveal className="py-12 lg:py-16">
          <PortfolioMacbookShowcase />
          <PortfolioWebdisGallery prefersReducedMotion={reduced} className="mt-16 lg:mt-24" />
        </Reveal>

        <div className="flex flex-col gap-3 border-t border-[var(--jv-line)] py-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="jv-mono text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">
            PROYECTOS PROPIOS · SIN PLANTILLAS
          </span>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="jv-mono text-[10px] tracking-[0.16em] text-[var(--jv-accent)] hover:underline"
          >
            ALECHAVEZ.COSECHACREATIVA.COM.AR →
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SEO — cabecera + escalada SERP + tácticas como filas de tabla
   ───────────────────────────────────────────────────────────── */

function SeoSection({ reduced }: { reduced: boolean }) {
  return (
    <section id="seo" className="relative scroll-mt-[88px] border-t border-[var(--jv-line)] bg-[var(--jv-bg-soft)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHead
          tag="SEO EN SAN JUAN"
          solid="LA CLAVE"
          outline="PARA DESTACAR"
          note="UN SITIO ATRACTIVO SIN OPTIMIZACIÓN NO GENERA EL TRÁFICO QUE MERECÉS"
        />

        {/* 320 / resto: la columna de texto queda angosta a propósito y el
            mecanismo se lleva el ancho. */}
        <div className="grid border-b border-[var(--jv-line)] lg:grid-cols-[320px_1fr]">
          <div className="border-b border-[var(--jv-line)] p-6 lg:border-b-0 lg:border-r lg:p-8">
            <p className="text-sm leading-relaxed text-[var(--jv-muted)]">
              Un sitio atractivo sin optimización no genera el tráfico que merecés. Aplicamos técnicas concretas para
              que tu marca sea encontrada.
            </p>
            <div className="jv-mono mt-8 border-t border-[var(--jv-line)] pt-4 text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">
              CUATRO FRENTES · UNA MISMA META
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="border border-[var(--jv-line)] p-4 md:p-6">
              <div className="jv-mono mb-4 flex items-center justify-between text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">
                <span>RESULTADO-BUSQUEDA.LIVE</span>
                <span className="flex items-center gap-2 text-[#22c55e]">
                  <span className="jv-status-pulse inline-block size-1.5 rounded-full bg-[#22c55e]" aria-hidden />
                  ESCALANDO
                </span>
              </div>
              <SerpClimbVisual reducedMotion={reduced} />
            </div>
          </div>
        </div>

        {/* Tácticas como filas: número, titular, descripción. */}
        {SEO_TACTICS.map((t, i) => (
          <Reveal key={t.id} delay={i * 70}>
            <div className="jv-row-hover group grid grid-cols-[56px_1fr] border-b border-[var(--jv-line)] lg:grid-cols-[56px_300px_1fr]">
              <div className="flex items-start border-r border-[var(--jv-line)] p-5 pt-6">
                <span className="jv-mono text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">{t.id}</span>
              </div>
              <div className="flex flex-col gap-4 border-r border-[var(--jv-line)] p-6">
                <DotMotif variant={t.motif} />
                <h3 className="jv-display whitespace-pre-line text-3xl leading-[0.9] text-[var(--jv-fg)] transition-colors duration-300 group-hover:text-[var(--jv-accent)] lg:text-4xl">
                  {t.title}
                </h3>
              </div>
              <div className="col-span-2 flex items-center p-6 lg:col-span-1">
                <p className="max-w-lg text-sm leading-relaxed text-[var(--jv-muted)]">{t.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SERVICIOS — navegador lateral + panel, con el visual de cada servicio
   ───────────────────────────────────────────────────────────── */

function ServiciosSection({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0)
  /** El auto-avance se corta apenas alguien elige: mandar el usuario, no el timer. */
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || reduced) return
    const id = setInterval(() => setActive((a) => (a + 1) % SERVICES.length), 6000)
    return () => clearInterval(id)
  }, [auto, reduced])

  const service = SERVICES[active]

  return (
    <section id="servicios" className="relative scroll-mt-[88px] border-t border-[var(--jv-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHead
          tag="QUÉ CONSTRUIMOS"
          solid="CUATRO CAMINOS,"
          outline="UNA MISMA BASE"
          note="ELEGÍS SEGÚN LO QUE TU NEGOCIO NECESITA HOY / TODO SE PUEDE SUMAR DESPUÉS"
        />

        <div className="grid border-b border-[var(--jv-line)] lg:grid-cols-[300px_1fr]">
          {/* Navegador */}
          <div className="border-b border-[var(--jv-line)] lg:border-b-0 lg:border-r" role="tablist" aria-label="Servicios">
            {SERVICES.map((s, i) => (
              <button
                key={s.id}
                id={s.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => {
                  setActive(i)
                  setAuto(false)
                }}
                className={cn(
                  "w-full scroll-mt-[88px] border-b border-[var(--jv-line)] p-6 text-left transition-colors duration-200",
                  active === i ? "bg-[var(--jv-surface)]" : "hover:bg-[#0a0a0a]",
                )}
              >
                <div className="jv-mono mb-3 flex items-center justify-between text-[9px] tracking-[0.18em] text-[var(--jv-dim)]">
                  <span>{s.tag}</span>
                  <span>{s.n}</span>
                </div>
                <h3
                  className={cn(
                    "jv-display whitespace-pre-line text-2xl leading-[0.9] transition-colors",
                    active === i ? "text-[var(--jv-accent)]" : "text-[var(--jv-dim)]",
                  )}
                >
                  {s.title}
                </h3>
                {active === i && auto && !reduced && (
                  <div className="mt-4 h-px overflow-hidden bg-[var(--jv-line)]">
                    <div key={active} className="jv-draw-line h-full bg-[var(--jv-accent)]" style={{ width: 0 }} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-between border-b border-[var(--jv-line)] p-6 lg:border-b-0 lg:border-r lg:p-8">
              <div>
                <p className="mb-8 text-sm leading-relaxed text-[var(--jv-muted)]">{service.body}</p>
                <ul className="flex flex-wrap gap-2">
                  {service.chips.map((chip) => (
                    <li
                      key={chip}
                      className="jv-mono border border-[var(--jv-line)] px-3 py-1.5 text-[10px] tracking-[0.14em] text-[var(--jv-muted)]"
                    >
                      {chip.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="jv-mono mt-8 border-t border-[var(--jv-line)] pt-4 text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">
                SERVICIO {service.n} DE 04
              </div>
            </div>

            {/* El mecanismo propio de cada servicio, tal como estaba. */}
            <div className="bg-[var(--jv-bg)] p-6 lg:p-8">
              {service.visual === "checkout" ? (
                <CheckoutVisual reducedMotion={reduced} />
              ) : (
                <ServiceVisual variant={service.visual} reducedMotion={reduced} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   CLIENTE
   ───────────────────────────────────────────────────────────── */

export function DisenoWebJarvisClient() {
  const reduced = !!useReducedMotion()

  return (
    <main className="jv relative min-h-screen overflow-x-hidden">
      <Navigation />
      <Hero />
      <StackSection />
      <PortfolioSection reduced={reduced} />
      <SeoSection reduced={reduced} />
      <ServiciosSection reduced={reduced} />
      <DisenoWebJarvisCierre reduced={reduced} />
      <FooterSection />
    </main>
  )
}

export default DisenoWebJarvisClient
