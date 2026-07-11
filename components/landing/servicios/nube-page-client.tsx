"use client"

import Link from "next/link"
import { useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion"
import { Check, Cloud, Cpu, Link2, Rocket, Shield } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import {
  DEPLOY_STACK,
  DeployLogoGrid,
  HostingerDockerReference,
  IntegrationLogoGrid,
  LogoMarquee,
} from "@/components/landing/servicios/nube-tech-logos"
import RotatingEarth from "@/components/landing/servicios/rotating-earth"
import { NubeOpenClawSection } from "@/components/landing/servicios/nube-openclaw-section"
import { cn } from "@/lib/utils"

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"

const easePremium = [0.22, 1, 0.36, 1] as const

const introAllows = [
  "Mayor velocidad.",
  "Mejor disponibilidad.",
  "Acceso remoto.",
  "Escalabilidad.",
  "Seguridad.",
  "Backups.",
  "Control técnico.",
  "Integración con herramientas de IA.",
  "Automatizaciones funcionando 24/7.",
]

const vpsDeploy = [
  "WordPress avanzado.",
  "Apps en Node.js.",
  "Laravel.",
  "React / Next.js.",
  "n8n.",
  "Supabase.",
  "Appwrite.",
  "Docker.",
  "APIs privadas.",
  "Chatbots.",
  "Sistemas de gestión.",
  "Automatizaciones empresariales.",
  "Herramientas internas con IA.",
]

const iaConnects = [
  "Formularios web.",
  "WhatsApp.",
  "Gmail.",
  "Google Sheets.",
  "CRM.",
  "Bases de datos.",
  "WordPress.",
  "Redes sociales.",
  "Sistemas administrativos.",
  "APIs externas.",
  "Chatbots.",
  "Asistentes internos.",
  "Flujos de n8n.",
]

const iaExamples = [
  "Un formulario que carga automáticamente un cliente en una base de datos.",
  "Un sistema que responde consultas frecuentes.",
  "Una automatización que crea tareas internas.",
  "Un panel que muestra ventas, pedidos o métricas.",
  "Un asistente IA que ayuda a buscar información dentro de documentos.",
  "Un flujo que conecta la web con WhatsApp, email y CRM.",
]

const scalingItems = [
  "Más usuarios.",
  "Nuevos módulos.",
  "Mayor capacidad de servidor.",
  "Automatizaciones.",
  "Integraciones.",
  "IA.",
  "Reportes avanzados.",
  "Paneles de control.",
  "App móvil.",
  "E-commerce.",
  "Sistemas internos.",
]

const empresaBenefits = [
  "Menos tareas manuales.",
  "Más orden interno.",
  "Mejor atención al cliente.",
  "Información centralizada.",
  "Procesos más rápidos.",
  "Menos errores.",
  "Acceso desde cualquier lugar.",
  "Mayor seguridad.",
  "Ahorro de tiempo.",
  "Sistemas preparados para escalar.",
  "Automatizaciones funcionando todo el día.",
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easePremium },
  },
}

const staggerHero: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easePremium },
  },
}

const listRowStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.038, delayChildren: 0.04 },
  },
}

const listRowItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: easePremium },
  },
}

const headerStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const headerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easePremium },
  },
}

const headerStaggerStatic: Variants = { hidden: {}, visible: {} }
const headerChildStatic: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}

type RevealDirection = "up" | "down" | "left" | "right"

function revealOffset(direction: RevealDirection, reduce: boolean) {
  if (reduce) return {}
  switch (direction) {
    case "down":
      return { y: -28 }
    case "left":
      return { x: 28 }
    case "right":
      return { x: -28 }
    default:
      return { y: 32 }
  }
}

function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
}) {
  const reduce = useReducedMotion()
  const off = revealOffset(direction, reduce)

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, ...off }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px", amount: 0.15 }}
      transition={{ duration: 0.78, ease: easePremium, delay }}
    >
      {children}
    </motion.div>
  )
}

function ListCard({
  items,
  id,
  className,
}: {
  items: readonly string[]
  id?: string
  className?: string
}) {
  const reduce = useReducedMotion()

  const listBody = (
    <>
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-400/15 blur-3xl transition-opacity duration-700 group-hover/card:opacity-100"
        aria-hidden
      />
      {reduce ? (
        <ul className="relative grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-[15px] leading-snug text-gray-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <motion.ul
          className="relative grid gap-2.5 sm:grid-cols-2"
          variants={listRowStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          {items.map((item) => (
            <motion.li
              key={item}
              className="flex gap-2 text-[15px] leading-snug text-gray-700"
              variants={listRowItem}
            >
              <motion.span
                className="mt-0.5 inline-flex shrink-0"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
              >
                <Check className="h-4 w-4 text-blue-500" aria-hidden />
              </motion.span>
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </>
  )

  return (
    <motion.div
      id={id}
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.15)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_28px_90px_-44px_rgba(37,99,235,0.18)] sm:p-8",
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}
    >
      {listBody}
    </motion.div>
  )
}

function SectionShell({
  id,
  icon: Icon,
  tint,
  children,
}: {
  id: string
  icon: typeof Cloud
  tint: string
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()

  return (
    <Reveal direction="left">
      <motion.section
        id={id}
        className="group relative scroll-mt-28 overflow-hidden rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-[#fafaf8] to-gray-100/80 p-8 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.18)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_40px_120px_-50px_rgba(15,23,42,0.22)] sm:p-10"
        whileHover={reduce ? undefined : { scale: 1.008 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div
          className={cn(
            "pointer-events-none absolute -left-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full opacity-40 blur-3xl transition-all duration-700 group-hover:opacity-80 group-hover:scale-105",
            tint,
          )}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute right-6 top-6 opacity-[0.07]"
          aria-hidden
          animate={reduce ? undefined : { rotate: [0, 6, 0], scale: [1, 1.06, 1] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Icon className="h-24 w-24 text-gray-900" strokeWidth={1} />
        </motion.div>
        <div className="relative">{children}</div>
      </motion.section>
    </Reveal>
  )
}

export function NubePageClient() {
  const heroRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const videoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 180])
  const videoScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12])
  const topGradientOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.96])
  const radialGlowOpacity = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const heroContentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 72])
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const heroBlurPx = useTransform(scrollYProgress, [0, 0.85], reduce ? [0, 0] : [0, 5])
  const blurFilter = useMotionTemplate`blur(${heroBlurPx}px)`

  const decorativeFloat = reduce
    ? {}
    : {
        animate: {
          y: [0, -12, 0],
          opacity: [0.4, 0.65, 0.4],
        },
        transition: {
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut" as const,
        },
      }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f0f0ee] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      <Navigation />

      <div
        ref={heroRef}
        className="relative flex min-h-[110vh] flex-col overflow-hidden"
      >
        <motion.video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ y: videoY, scale: videoScale }}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#f0f0ee]"
          style={{ opacity: topGradientOpacity }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_70%_20%,rgba(59,130,246,0.2),transparent_55%),radial-gradient(ellipse_70%_50%_at_10%_80%,rgba(147,197,253,0.12),transparent_50%)]"
          style={{ opacity: radialGlowOpacity }}
          aria-hidden
        />

        {!reduce && (
          <>
            <motion.div
              className="pointer-events-none absolute left-[8%] top-[22%] h-56 w-56 rounded-full bg-blue-400/25 blur-[100px]"
              {...decorativeFloat}
            />
            <motion.div
              className="pointer-events-none absolute bottom-[30%] right-[12%] h-44 w-44 rounded-full bg-indigo-400/20 blur-[90px]"
              animate={{
                y: [0, 18, 0],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </>
        )}

        <div className="relative z-10 flex flex-1 flex-col pt-20">
          <motion.div
            className="flex flex-1 flex-col justify-end px-6 pb-14 sm:px-12 sm:pb-16 md:px-20 lg:px-28 lg:pb-24"
            style={{ y: heroContentY }}
          >
            <motion.div
              className="max-w-3xl"
              variants={staggerHero}
              initial="hidden"
              animate="visible"
              style={{
                opacity: heroContentOpacity,
                filter: reduce ? "none" : blurFilter,
              }}
            >
              <motion.div variants={fadeUp}>
                <Link
                  href="#despliegue"
                  className="group mb-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-300 transition-colors hover:text-white sm:text-[13px]"
                >
                  <motion.span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Digitalizamos tu empresa y la llevamos a la nube
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </motion.span>
                </Link>
              </motion.div>

              <motion.h1
                className="mb-5 font-display text-[1.85rem] leading-[1.12] tracking-tight text-white sm:text-[2.25rem] lg:text-[2.7rem]"
                variants={fadeUp}
              >
                Tu empresa no necesita más parches digitales. Necesita una infraestructura lista
                para crecer.
              </motion.h1>

              <motion.p
                className="mb-8 max-w-2xl text-[15px] leading-relaxed text-white/88 sm:text-[16px]"
                variants={fadeUp}
              >
                En Cosecha Creativa desarrollamos sistemas, automatizaciones y soluciones en la
                nube para transformar procesos manuales en herramientas inteligentes, seguras y
                escalables.
              </motion.p>

              <motion.div variants={fadeUp}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/#contacto"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/12 px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-gray-900"
                  >
                    Digitalizá tu empresa con Cosecha Creativa
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="pointer-events-none flex justify-center pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            aria-hidden
          >
            <motion.div
              animate={reduce ? {} : { y: [0, 8, 0] }}
              transition={{
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50"
            >
              <span>Scroll</span>
              <motion.span
                className="block h-8 w-[1px] rounded-full bg-gradient-to-b from-white/60 to-transparent"
                animate={reduce ? {} : { scaleY: [1, 1.4, 1] }}
                transition={{
                  duration: 2.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <article
        id="despliegue"
        className="relative z-10 -mt-4 overflow-hidden border-t border-gray-200/50 bg-[#f0f0ee] px-6 pb-24 pt-16 sm:px-12 md:px-20 lg:px-28"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        {!reduce && (
          <>
            <motion.div
              className="pointer-events-none absolute -left-20 top-[12%] h-[min(60vw,420px)] w-[min(60vw,420px)] rounded-full bg-blue-400/[0.07] blur-[120px]"
              aria-hidden
              animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute bottom-[8%] right-[-8%] h-[min(55vw,380px)] w-[min(55vw,380px)] rounded-full bg-indigo-400/[0.06] blur-[110px]"
              aria-hidden
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
              transition={{
                duration: 18,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </>
        )}

        <div className="relative mx-auto max-w-3xl space-y-16 lg:max-w-4xl">
          <motion.header
            className="space-y-5"
            variants={reduce ? headerStaggerStatic : headerStagger}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.p
              className="text-[13px] font-semibold uppercase tracking-[0.2em] text-blue-600"
              variants={reduce ? headerChildStatic : headerChild}
            >
              Despliegue en la nube
            </motion.p>
            <motion.h2
              className="font-display text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl lg:text-[2.15rem] lg:leading-tight"
              variants={reduce ? headerChildStatic : headerChild}
            >
              Tus sistemas funcionando online, seguros y disponibles
            </motion.h2>
            <motion.div
              className="space-y-4 text-[15px] leading-relaxed text-gray-600"
              variants={reduce ? headerChildStatic : headerChild}
            >
              <p>
                Nos encargamos de llevar tu proyecto a la nube para que pueda ser utilizado desde
                cualquier lugar, con infraestructura preparada para crecer.
              </p>
              <p>
                Trabajamos con servidores VPS, entornos cloud, bases de datos, contenedores Docker y
                herramientas modernas para desplegar aplicaciones web, automatizaciones e
                integraciones.
              </p>
              <p className="font-medium text-gray-800">Esto permite que tu empresa tenga:</p>
            </motion.div>
          </motion.header>

          <Reveal direction="right">
            <motion.div
              className="space-y-4"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: easePremium }}
            >
              <p className="text-center text-[12px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                Stack &amp; herramientas
              </p>
              <LogoMarquee items={DEPLOY_STACK} durationSec={48} />
            </motion.div>
          </Reveal>

          <Reveal direction="right">
            <motion.div
              className="w-full max-w-[min(100%,56rem)]"
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 28 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, ease: easePremium }}
            >
              <RotatingEarth width={960} height={440} variant="light" />
            </motion.div>
          </Reveal>

          <ListCard items={introAllows} />

          <SectionShell id="vps" icon={Cpu} tint="bg-blue-400/30">
            <h2 className="mb-5 font-display text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Servidores VPS para empresas
            </h2>
            <div className="mb-5 space-y-4 text-[15px] leading-relaxed text-gray-600">
              <p>
                Implementamos y configuramos servidores privados virtuales para proyectos que
                necesitan más potencia, independencia y control que un hosting tradicional.
              </p>
              <p>
                Un VPS permite instalar sistemas personalizados, manejar bases de datos, correr
                aplicaciones, automatizaciones, APIs, bots, paneles internos y herramientas de
                inteligencia artificial.
              </p>
              <p className="font-medium text-gray-800">Podemos desplegar:</p>
            </div>
            <DeployLogoGrid className="mb-8" />
            <HostingerDockerReference className="mb-8" />
            <ListCard items={vpsDeploy} className="mb-6 border-blue-100/80 bg-blue-50/40" />
            <p className="text-[15px] leading-relaxed text-gray-600">
              Con infraestructura tipo VPS se obtiene acceso root, recursos dedicados, mayor
              flexibilidad, discos rápidos NVMe, backups, firewall y capacidad para instalar software
              personalizado.
            </p>
          </SectionShell>

          <SectionShell id="automatizacion" icon={Link2} tint="bg-violet-400/25">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Automatizaciones e inteligencia artificial
            </h2>
            <p className="mb-4 text-[15px] font-medium text-gray-800">
              Conectamos herramientas para que tu empresa trabaje sola donde sea posible
            </p>
            <p className="mb-6 text-[15px] leading-relaxed text-gray-600">
              Integramos agentes de IA y automatizaciones con las herramientas de tu empresa.
            </p>
            <p className="mb-3 font-medium text-gray-800">Podemos conectar:</p>
            <IntegrationLogoGrid className="mb-8" />
            <ListCard items={iaConnects} className="mb-8 border-violet-100/80 bg-violet-50/35" />
            <p className="mb-4 font-medium text-gray-800">Ejemplos de uso:</p>
            <motion.ul
              className="space-y-3 rounded-2xl border border-violet-200/50 bg-white/90 p-6 shadow-inner backdrop-blur-sm sm:p-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
            >
              {iaExamples.map((ex) => (
                <motion.li
                  key={ex}
                  className="flex gap-3 text-[15px] leading-snug text-gray-600"
                  variants={staggerItem}
                >
                  <motion.span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    aria-hidden
                  />
                  {ex}
                </motion.li>
              ))}
            </motion.ul>
          </SectionShell>

          <NubeOpenClawSection />

          <SectionShell id="escalar" icon={Rocket} tint="bg-amber-400/25">
            <h2 className="mb-5 font-display text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Infraestructura preparada para crecer
            </h2>
            <div className="mb-5 space-y-4 text-[15px] leading-relaxed text-gray-600">
              <p>Creamos soluciones que pueden empezar simples y escalar con el tiempo.</p>
              <p className="font-medium text-gray-800">
                Tu empresa puede comenzar con un sistema básico y luego sumar:
              </p>
            </div>
            <ListCard items={scalingItems} className="mb-6 border-amber-100/80 bg-amber-50/30" />
            <p className="text-[15px] leading-relaxed text-gray-600">
              La idea es clara: construir una base tecnológica que no quede chica al primer
              crecimiento.
            </p>
          </SectionShell>

          <SectionShell id="beneficios" icon={Shield} tint="bg-emerald-400/22">
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Beneficios para tu empresa
            </h2>
            <p className="mb-5 text-[15px] leading-relaxed text-gray-600">
              Con nuestro servicio de digitalización y nube, tu negocio puede lograr:
            </p>
            <ListCard items={empresaBenefits} className="border-emerald-100/80 bg-emerald-50/25" />
          </SectionShell>

          <motion.figure
            className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50 via-white to-indigo-50/90 p-8 shadow-[0_28px_90px_-50px_rgba(37,99,235,0.35)] sm:p-11"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.72, ease: easePremium }}
            whileHover={reduce ? {} : { y: -6, transition: { duration: 0.35, ease: easePremium } }}
          >
              <motion.div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl"
                animate={
                  reduce
                    ? {}
                    : {
                        scale: [1, 1.08, 1],
                        opacity: [0.5, 0.75, 0.5],
                      }
                }
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                aria-hidden
              />
              <Cloud className="absolute right-8 top-8 h-16 w-16 text-blue-500/15" strokeWidth={1} aria-hidden />
              <blockquote className="relative text-lg font-semibold leading-snug text-gray-900 sm:text-xl">
                Digitalizamos tu empresa y la llevamos a la nube
              </blockquote>
              <figcaption className="relative mt-5 text-[15px] leading-relaxed text-gray-600">
                Creamos sistemas, aplicaciones web, automatizaciones e infraestructura cloud para que
                tu empresa trabaje de forma más ordenada, rápida y escalable. Desde un panel de
                gestión hasta servidores VPS, bases de datos, IA y automatizaciones con n8n:
                desarrollamos soluciones digitales pensadas para crecer con tu negocio.
              </figcaption>
          </motion.figure>

          <motion.section
            className="relative overflow-hidden rounded-3xl bg-gray-950 px-8 py-12 text-center sm:px-14 sm:py-14"
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 36 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.82, ease: easePremium }}
            whileHover={reduce ? {} : { scale: 1.01 }}
          >
              <motion.div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-20%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(167,139,250,0.12),transparent_50%)]"
                aria-hidden
                animate={
                  reduce
                    ? undefined
                    : {
                        opacity: [0.85, 1, 0.85],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div className="relative">
                <h2 className="mb-3 font-display text-xl font-semibold text-white sm:text-2xl">
                  Digitalizá tu empresa con Cosecha Creativa.
                </h2>
                <p className="mx-auto mb-9 max-w-xl text-[15px] leading-relaxed text-gray-400">
                  Creamos, desplegamos y conectamos la tecnología que tu negocio necesita para
                  trabajar mejor.
                </p>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/#contacto"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-3.5 text-[14px] font-semibold text-gray-900 shadow-[0_20px_50px_-20px_rgba(255,255,255,0.35)] transition-colors hover:bg-gray-100"
                  >
                    Hablar con el equipo
                    <span aria-hidden>→</span>
                  </Link>
                </motion.div>
              </div>
          </motion.section>
        </div>
      </article>

      <FooterSection />
    </div>
  )
}
