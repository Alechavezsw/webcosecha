"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

/** SVG oficiales desde jsDelivr (más estable que cdn.simpleicons.org en algunos navegadores/redes). */
export const SIMPLE_ICONS_VER = "13.16.0"

/** URL de icono Simple Icons por slug (compartido con otras landings, ej. e-commerce). */
export function simpleIconUrl(slug: string) {
  return `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_VER}/icons/${slug}.svg`
}

/** Logos oficiales (Simple Icons, paquete npm vía jsDelivr). */
export const DEPLOY_STACK: {
  slug: string
  label: string
}[] = [
  { slug: "wordpress", label: "WordPress" },
  { slug: "nodedotjs", label: "Node.js" },
  { slug: "laravel", label: "Laravel" },
  { slug: "react", label: "React" },
  { slug: "nextdotjs", label: "Next.js" },
  { slug: "n8n", label: "n8n" },
  { slug: "supabase", label: "Supabase" },
  { slug: "appwrite", label: "Appwrite" },
  { slug: "docker", label: "Docker" },
  { slug: "swagger", label: "APIs / OpenAPI" },
  { slug: "openai", label: "Chatbots / IA" },
  { slug: "odoo", label: "Gestión / ERP" },
  { slug: "zapier", label: "Automatización" },
  { slug: "anthropic", label: "IA interna" },
]

export const INTEGRATION_STACK: {
  slug: string
  label: string
}[] = [
  { slug: "typeform", label: "Formularios" },
  { slug: "whatsapp", label: "WhatsApp" },
  { slug: "gmail", label: "Gmail" },
  { slug: "googlesheets", label: "Sheets" },
  { slug: "hubspot", label: "CRM" },
  { slug: "postgresql", label: "Bases de datos" },
  { slug: "wordpress", label: "WordPress" },
  { slug: "meta", label: "Redes sociales" },
  { slug: "microsoft", label: "Administración" },
  { slug: "swagger", label: "APIs externas" },
  { slug: "openai", label: "Chatbots" },
  { slug: "anthropic", label: "Asistentes" },
  { slug: "n8n", label: "n8n" },
]

const gridTile: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const gridTileStatic: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

function LogoTile({
  slug,
  label,
  size = 40,
}: {
  slug: string
  label: string
  size?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-center"
      variants={reduce ? gridTileStatic : gridTile}
      whileHover={reduce ? undefined : { y: -5, transition: { duration: 0.22 } }}
    >
      <motion.div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200/90 bg-white shadow-sm"
        whileHover={reduce ? undefined : { scale: 1.06, borderColor: "rgba(59,130,246,0.35)" }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <Image
          src={simpleIconUrl(slug)}
          alt={label}
          width={size}
          height={size}
          className="max-h-10 max-w-10 object-contain"
          unoptimized
        />
      </motion.div>
      <span className="max-w-[92px] text-[11px] font-medium leading-tight text-gray-600 sm:text-xs">
        {label}
      </span>
    </motion.div>
  )
}

const gridContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
}

export function DeployLogoGrid({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(
        "grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 md:gap-6 lg:grid-cols-7",
        className,
      )}
      variants={reduce ? { hidden: {}, visible: {} } : gridContainer}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {DEPLOY_STACK.map((t) => (
        <LogoTile key={`${t.slug}-${t.label}`} slug={t.slug} label={t.label} />
      ))}
    </motion.div>
  )
}

export function IntegrationLogoGrid({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(
        "grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 md:gap-6 lg:grid-cols-7",
        className,
      )}
      variants={reduce ? { hidden: {}, visible: {} } : gridContainer}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {INTEGRATION_STACK.map((t) => (
        <LogoTile key={`int-${t.slug}-${t.label}`} slug={t.slug} label={t.label} />
      ))}
    </motion.div>
  )
}

/** Carrusel continuo tipo vitrina (referencia visual cercana a catálogos tipo Hostinger Docker) */
export function LogoMarquee({
  items,
  durationSec = 42,
  className,
}: {
  items: typeof DEPLOY_STACK
  durationSec?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const loop = [...items, ...items]

  return (
    <div
      className={cn(
        "relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <motion.div
        className="flex w-max gap-12 pr-12"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : { duration: durationSec, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
        }
      >
        {loop.map((t, i) => (
          <motion.div
            key={`${t.slug}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-gray-200/80 bg-white/95 px-4 py-2.5 shadow-sm transition-colors duration-300 hover:border-blue-200/90"
            whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src={simpleIconUrl(t.slug)}
                alt={t.label}
                width={32}
                height={32}
                className="max-h-8 max-w-8 object-contain"
                unoptimized
              />
            </div>
            <span className="whitespace-nowrap text-[13px] font-medium text-gray-800">
              {t.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export function HostingerDockerReference({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/90 bg-gradient-to-br from-white to-gray-50/90 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-2">
            <Image
                src={simpleIconUrl("hostinger")}
              alt="Hostinger"
              width={88}
              height={28}
              className="h-7 w-auto max-w-[100px] object-contain"
              unoptimized
            />
          </div>
          <span className="text-2xl font-light text-gray-300" aria-hidden>
            ×
          </span>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-2">
            <Image
              src={simpleIconUrl("docker")}
              alt="Docker"
              width={48}
              height={48}
              className="max-h-12 max-w-12 object-contain"
              unoptimized
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">Plantillas Docker en VPS</p>
          <p className="mt-1 text-[14px] leading-relaxed text-gray-600">
            Referencia de mercado: catálogo de despliegues en un clic (Hostinger). Nosotros armamos
            tu stack a medida en VPS o cloud con las mismas ideas de rapidez y estandarización.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
