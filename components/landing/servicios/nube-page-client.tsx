"use client"

import Link from "next/link"
import { motion, useReducedMotion, useScroll, useSpring, type Variants } from "framer-motion"
import { ArrowLeft, ArrowUpRight, Check, Cpu, Link2, Server, Shield } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import {
  DEPLOY_STACK,
  DeployLogoGrid,
  HostingerDockerReference,
  IntegrationLogoGrid,
  LogoMarquee,
} from "@/components/landing/servicios/nube-tech-logos"
import RotatingEarth from "@/components/landing/servicios/rotating-earth"

const easePremium = [0.22, 1, 0.36, 1] as const

/** Fondo claro propio de esta página (el globo usa este mismo color para integrarse). */
const PAGE_BG = "#f0f0ee"

/** Ritmo vertical parejo entre bloques. */
const sectionPy = "py-16 md:py-20 lg:py-24"

const HERO_CHIPS = ["VPS", "Docker", "n8n", "APIs privadas", "Chatbots"] as const

const HERO_STATS = [
  { value: "24/7", label: "automatizaciones corriendo" },
  { value: "VPS propio", label: "control técnico real" },
  { value: "Escalable", label: "crece con tu empresa" },
] as const

const capacidades = [
  {
    icon: Server,
    title: "Servidores VPS",
    body: "WordPress avanzado, Node.js, Laravel, Next.js, Docker y bases de datos en un servidor tuyo.",
  },
  {
    icon: Cpu,
    title: "Automatizaciones con IA",
    body: "Flujos de n8n, chatbots y asistentes internos que trabajan sobre tus propios datos.",
  },
  {
    icon: Link2,
    title: "Integraciones",
    body: "Formularios, WhatsApp, Gmail, Sheets, CRM y APIs externas hablando entre sí.",
  },
  {
    icon: Shield,
    title: "Seguridad y backups",
    body: "Accesos controlados, copias automáticas y monitoreo del servidor.",
  },
] as const

const ejemplos = [
  "Un formulario que carga el cliente directo en la base de datos.",
  "Un sistema que responde las consultas frecuentes solo.",
  "Un panel que muestra ventas, pedidos y métricas al día.",
  "Un asistente que busca información dentro de tus documentos.",
] as const

const beneficios = [
  "Menos tareas manuales",
  "Información centralizada",
  "Procesos más rápidos",
  "Menos errores de carga",
  "Acceso desde cualquier lugar",
  "Listo para escalar",
] as const

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easePremium } },
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePremium, staggerChildren: 0.07 },
  },
}

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

/** Encabezado compartido por los cuatro bloques, para que todos lean igual. */
function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-2xl">
      <motion.span
        variants={itemVariants}
        className="mb-5 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.22em] text-blue-600"
      >
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400" />
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={itemVariants}
        className="font-display text-4xl leading-[0.98] tracking-tight text-gray-900 md:text-5xl"
      >
        {title}
      </motion.h2>
      {body ? (
        <motion.p variants={itemVariants} className="mt-5 text-lg leading-relaxed text-gray-600">
          {body}
        </motion.p>
      ) : null}
    </div>
  )
}

export function NubePageClient() {
  const reduce = useReducedMotion()
  const waHref = getWhatsAppHref("Soluciones en la nube")

  const { scrollYProgress: pageScroll } = useScroll()
  const pageScrollScaleX = useSpring(pageScroll, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <main
      className="relative min-h-screen overflow-x-hidden text-gray-900"
      style={{ backgroundColor: PAGE_BG }}
    >
      {/* Fondo claro: el header necesita tinta oscura arriba de todo. */}
      <Navigation onLight />

      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500"
          style={{ scaleX: pageScrollScaleX }}
        />
      )}

      {/* ---------------------------------------------------------- *
       * 1 · Hero                                                     *
       * ---------------------------------------------------------- */}
      <section className="relative overflow-hidden px-6 pb-16 pt-36 lg:px-12 lg:pb-24 lg:pt-40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(60vh,520px)] bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-[10%] top-[20%] h-72 w-72 rounded-full bg-blue-300/25 blur-[110px]"
          aria-hidden
        />

        <motion.div
          variants={heroContainer}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
          className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-7">
            <motion.div variants={itemVariants}>
              <Link
                href="/#soluciones"
                className="mb-9 inline-flex items-center gap-2 rounded-full border border-gray-300/80 bg-white/70 px-4 py-2 text-[13px] text-gray-600 backdrop-blur-sm transition-all hover:border-blue-400/60 hover:text-gray-900"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                Volver a soluciones
              </Link>
            </motion.div>

            <motion.span
              variants={itemVariants}
              className="mb-5 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.24em] text-blue-600"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400" />
              Nube e infraestructura · San Juan
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.94] tracking-tight text-gray-900"
            >
              Tu empresa,
              <span className="mt-1 block bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
                en la nube
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl"
            >
              Servidores VPS, automatizaciones con IA y sistemas que crecen con vos. Se terminan los
              parches digitales.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-7 flex flex-wrap gap-2">
              {HERO_CHIPS.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-gray-300/70 bg-white/80 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-600 shadow-sm transition-colors hover:border-blue-400/60 hover:text-gray-900 sm:text-[11px]"
                >
                  {c}
                </span>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="sm"
                className="h-11 gap-2 rounded-full bg-gray-900 px-6 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black"
              >
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-[17px] shrink-0 text-[#25D366]" />
                  Digitalizar mi empresa
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group h-11 gap-2 rounded-full border-gray-300 bg-white/70 px-6 text-[13px] font-medium text-gray-700 backdrop-blur-sm transition-all hover:border-gray-400 hover:bg-white hover:text-gray-900"
              >
                <a href="#despliegue">
                  Ver qué desplegamos
                  <ArrowUpRight className="size-3.5 shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </Button>
            </motion.div>

            <motion.dl
              variants={itemVariants}
              className="mt-9 grid w-full max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 shadow-sm sm:grid-cols-3"
            >
              {HERO_STATS.map((s) => (
                <div key={s.value} className="bg-white px-4 py-3.5">
                  <dt className="font-display text-base font-semibold leading-none text-gray-900">
                    {s.value}
                  </dt>
                  <dd className="mt-1.5 text-[11px] leading-snug text-gray-500">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Globo: misma superficie que el fondo de la página para que se integre */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <RotatingEarth variant="light" surfaceColor={PAGE_BG} className="mx-auto max-w-[440px]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- *
       * 2 · Qué desplegamos                                          *
       * ---------------------------------------------------------- */}
      <motion.section
        id="despliegue"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className={`relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
      >
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <SectionHeader
            eyebrow="Qué desplegamos"
            title="Un servidor propio, no un alquiler compartido"
            body="Instalamos y mantenemos el stack completo en un VPS que es tuyo: sistemas, bases de datos, APIs y automatizaciones."
          />

          <motion.div variants={itemVariants} className="mt-12">
            <DeployLogoGrid />
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10">
            <HostingerDockerReference />
          </motion.div>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------- *
       * 3 · Automatizaciones e IA                                    *
       * ---------------------------------------------------------- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className={`relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_25%,rgba(99,102,241,0.08)_0%,transparent_62%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <SectionHeader eyebrow="Automatización e IA" title="Que los sistemas hablen entre sí" />

          <motion.div variants={itemVariants} className="mt-10">
            <IntegrationLogoGrid />
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10">
            <LogoMarquee items={DEPLOY_STACK} />
          </motion.div>

          {/* Ejemplos concretos, cortos */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {ejemplos.map((e) => (
              <motion.div
                key={e}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-blue-300"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50">
                  <Check className="size-3.5 text-blue-600" strokeWidth={2} aria-hidden />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-gray-600">{e}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------- *
       * 4 · Capacidades y beneficios                                 *
       * ---------------------------------------------------------- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className={`relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
      >
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <SectionHeader eyebrow="Qué te llevás" title="Infraestructura lista para crecer" />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {capacidades.map((c) => (
              <motion.article
                key={c.title}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50">
                  <c.icon className="size-[19px] text-blue-600" strokeWidth={1.4} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl leading-tight tracking-tight text-gray-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-gray-600">{c.body}</p>
              </motion.article>
            ))}
          </div>

          {/* Beneficios en una tira compacta */}
          <motion.ul variants={itemVariants} className="mt-10 flex flex-wrap gap-2.5">
            {beneficios.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-700 shadow-sm"
              >
                <Check className="size-3.5 shrink-0 text-blue-600" strokeWidth={2.2} aria-hidden />
                {b}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------- *
       * 5 · Cierre                                                   *
       * ---------------------------------------------------------- */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={`relative overflow-hidden px-6 lg:px-12 ${sectionPy}`}
      >
        <motion.div
          variants={itemVariants}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.45)] md:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12"
        >
          <div
            className="pointer-events-none absolute -inset-10 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 42%, transparent 58%, rgba(99,102,241,0.08) 100%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-display text-3xl tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              ¿Arrancamos por tu infraestructura?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 md:text-lg">
              Contanos qué procesos querés digitalizar y armamos el plan de despliegue.
            </p>
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-0 lg:min-w-[240px] lg:flex-col">
            <Button
              asChild
              size="sm"
              className="h-11 gap-2 rounded-full bg-gray-900 px-6 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black"
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="size-[17px] shrink-0 text-[#25D366]" />
                WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-11 rounded-full border-gray-300 bg-white px-6 text-[13px] font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900"
            >
              <a href="mailto:contacto@cosechacreativa.com.ar?subject=Soluciones%20en%20la%20nube">
                Email
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-11 justify-start text-gray-500 hover:text-gray-900"
            >
              <Link href="/servicios" className="gap-1.5 px-2">
                Ver otros servicios
                <ArrowUpRight className="size-4 shrink-0" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>

      <FooterSection />
    </main>
  )
}
