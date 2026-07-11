"use client"

import Link from "next/link"
import { Bot, MessageCircle, Server, Sparkles, Zap } from "lucide-react"
import { motion, useReducedMotion, useTransform } from "motion/react"
import type { Variants } from "motion/react"
import {
  ContainerAnimated,
  ContainerScroll,
  ContainerSticky,
  useContainerScrollContext,
} from "@/components/landing/servicios/container-scroll"
import { SplineScene } from "@/components/ui/spline-scene"
import { cn } from "@/lib/utils"

/** Misma escena 3D que la página IA — robot Spline. */
const SPLINE_SCENE_URL =
  "https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode"

function HeroSpline({ className }: { className?: string }) {
  const { scrollYProgress } = useContainerScrollContext()
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.7, 1])

  return (
    <motion.div
      style={{ scale }}
      className={cn(
        "relative z-10 w-full max-w-[min(94vw,580px)] origin-center",
        className,
      )}
    >
      <SplineScene
        scene={SPLINE_SCENE_URL}
        className="h-[min(50vh,480px)] w-full min-h-[280px] sm:h-[min(54vh,540px)]"
      />
    </motion.div>
  )
}

const featureCards = [
  {
    title: "Puesta en marcha guiada",
    body: "Diseñamos e implementamos tu agente sobre tu VPS o nube: sin adivinar puertos, variables ni orquestación.",
    icon: Zap,
  },
  {
    title: "Operación con criterio",
    body: "Podemos dejarte el stack documentado, con backups, actualizaciones y monitoreo alineados a tu nivel de comodidad técnica.",
    icon: Server,
  },
  {
    title: "Canales que ya usás",
    body: "WhatsApp, Telegram, webhooks y herramientas internas: el agente conversa donde trabaja tu equipo.",
    icon: MessageCircle,
  },
] as const

const steps = [
  {
    step: "01",
    title: "Alcance y datos",
    body: "Definimos qué puede hacer el agente, qué sistemas toca y qué queda fuera por seguridad.",
  },
  {
    step: "02",
    title: "Canal y personalidad",
    body: "Elegís cómo hablará con tu equipo o clientes y lo conectamos a tus flujos (n8n, CRM, bases de datos).",
  },
  {
    step: "03",
    title: "Encendido y mejoras",
    body: "Salimos a producción y afinamos respuestas, alertas e integraciones según uso real.",
  },
] as const

const easeOpen = [0.22, 1, 0.36, 1] as const

const featureGrid: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
}

const featureCard: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: easeOpen },
  },
}

const stepsList: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
}

const stepItem: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.48, ease: easeOpen },
  },
}

const noopParent: Variants = { hidden: {}, visible: {} }
const noopCard: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
}
const noopStep: Variants = {
  hidden: { opacity: 1, x: 0 },
  visible: { opacity: 1, x: 0 },
}

export interface NubeOpenClawSectionProps {
  className?: string
}

/**
 * Sección inspirada en el enfoque “agente IA siempre activo” tipo [OpenClaw en hostings gestionados](https://www.hostinger.com/ar/openclaw),
 * redactada y estilada para Cosecha Creativa y la paleta de /nube.
 */
export function NubeOpenClawSection({ className }: NubeOpenClawSectionProps) {
  const reduce = useReducedMotion()

  return (
    <section
      id="openclaw"
      className={cn("scroll-mt-28 border-t border-gray-200/50 bg-[#f0f0ee]", className)}
    >
      <ContainerScroll
        className="min-h-[220vh]"
        scrollOffset={["start start", "end end"]}
      >
        <ContainerSticky className="flex min-h-svh flex-col overflow-x-hidden bg-[#f0f0ee]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_18%,rgba(59,130,246,0.14),transparent_58%),radial-gradient(ellipse_55%_45%_at_85%_75%,rgba(99,102,241,0.09),transparent_52%)]" />

          <div className="relative z-10 flex min-h-[min(52vh,480px)] flex-1 flex-col items-center justify-center px-3 pb-2 pt-10 sm:min-h-[min(56vh,540px)] sm:px-8 sm:pb-4 sm:pt-14">
            <HeroSpline />
          </div>

          <div className="relative z-20 mx-auto w-full max-w-4xl shrink-0 px-6 pb-10 pt-2 sm:px-10 sm:pb-14">
            <ContainerAnimated className="max-w-xl space-y-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-blue-600">
                IA operativa 24/7
              </p>
              <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Tu agente de IA, privado y siempre encendido
              </h2>
              <p className="text-pretty text-[15px] leading-relaxed text-gray-600 sm:text-[16px]">
                En Cosecha Creativa montamos asistentes sobre tu infraestructura: conversan por los
                canales que elijas, ejecutan tareas repetitivas y se integran con n8n, APIs y bases de
                datos — sin depender de un panel genérico que no conoce tu negocio.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/#contacto"
                  className="inline-flex w-fit items-center rounded-full border border-blue-500/55 bg-white/90 px-5 py-2.5 text-[14px] font-semibold text-gray-900 shadow-[0px_4px_28px_rgba(37,99,235,0.22)] transition-all hover:scale-[1.015] hover:border-blue-600 hover:bg-white hover:shadow-[0px_8px_32px_rgba(37,99,235,0.28)] active:scale-[0.985]"
                >
                  Hablemos de tu agente
                </Link>
                <span className="text-[12px] text-gray-500">
                  Referencia de mercado: despliegues tipo{" "}
                  <a
                    href="https://www.hostinger.com/ar/openclaw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:decoration-blue-600"
                  >
                    OpenClaw
                  </a>{" "}
                  en hosting; nosotros lo adaptamos a tu marca y a tu stack.
                </span>
              </div>
            </ContainerAnimated>
          </div>
        </ContainerSticky>

        <div className="relative z-10 mx-auto max-w-4xl space-y-14 px-6 pb-24 pt-8 sm:px-10">
          <motion.div
            className="grid gap-5 sm:grid-cols-3"
            variants={reduce ? noopParent : featureGrid}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {featureCards.map(({ title, body, icon: Icon }) => (
              <motion.div
                key={title}
                variants={reduce ? noopCard : featureCard}
                whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25, ease: easeOpen } }}
                className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-shadow duration-300 hover:border-blue-200/80 hover:shadow-[0_24px_70px_-44px_rgba(37,99,235,0.2)]"
              >
                <motion.div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600"
                  whileHover={reduce ? undefined : { rotate: [0, -8, 8, 0], scale: 1.06 }}
                  transition={{ duration: 0.45 }}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </motion.div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-[14px] leading-relaxed text-gray-600">{body}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white via-[#fafaf8] to-blue-50/40 p-8 sm:p-10"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: easeOpen }}
          >
            <div className="mb-8 flex items-start gap-3">
              <motion.span
                className="mt-0.5 inline-flex shrink-0"
                animate={reduce ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Bot className="h-8 w-8 text-blue-600" aria-hidden />
              </motion.span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Tres pasos para tenerlo en producción
                </h3>
                <p className="mt-1 text-[14px] text-gray-600">
                  Sin humo: alineamos expectativas antes de escribir una línea de integración.
                </p>
              </div>
            </div>
            <motion.ol
              className="space-y-6"
              variants={reduce ? noopParent : stepsList}
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
            >
              {steps.map((s) => (
                <motion.li
                  key={s.step}
                  variants={reduce ? noopStep : stepItem}
                  className="flex gap-4 border-b border-gray-200/70 pb-6 last:border-0 last:pb-0"
                >
                  <span className="font-mono text-[13px] font-bold tabular-nums text-blue-600">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{s.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-gray-600">{s.body}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#contacto"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/55 bg-white/90 px-5 py-2.5 text-[14px] font-semibold text-gray-900 shadow-[0px_4px_28px_rgba(37,99,235,0.22)] transition-all hover:scale-[1.015] hover:border-blue-600 hover:bg-white hover:shadow-[0px_8px_32px_rgba(37,99,235,0.28)] active:scale-[0.985]"
              >
                <Sparkles className="h-4 w-4 text-blue-600" aria-hidden />
                Pedir propuesta
              </Link>
            </div>
          </motion.div>
        </div>
      </ContainerScroll>
    </section>
  )
}
