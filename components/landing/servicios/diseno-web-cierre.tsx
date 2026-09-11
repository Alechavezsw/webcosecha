"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, Globe2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { PORTFOLIO_PUBLIC_URL } from "@/components/landing/servicios/portfolio-macbook-showcase"
import { cn } from "@/lib/utils"

/**
 * Cierre de /servicios/diseno-web.
 *
 * Antes era el cierre genérico de siempre: un titular, un párrafo y una tarjeta
 * de vidrio con tres botones. El visitante llegaba hasta acá y tenía que
 * escribir de cero «hola, quiero una web».
 *
 * Ahora arma su proyecto en tres clics —tipo, tamaño y extras— y el botón de
 * WhatsApp **sale con el mensaje ya redactado con lo que eligió**. Para él es
 * un clic; para el equipo, una consulta que ya llega calificada.
 *
 * A propósito no hay precios ni plazos en números: serían un compromiso
 * comercial inventado. El resumen muestra alcance y una lectura cualitativa de
 * la complejidad, y el presupuesto se confirma en la conversación.
 */

const EASE = [0.22, 1, 0.36, 1] as const

const TYPES = [
  { id: "institucional", label: "Web institucional", hint: "Presencia y credibilidad", weight: 1 },
  { id: "ecommerce", label: "Tienda online", hint: "Catálogo y pagos", weight: 3 },
  { id: "landing", label: "Landing de campaña", hint: "Una sola acción", weight: 0 },
  { id: "wordpress", label: "WordPress", hint: "Lo editás vos", weight: 1 },
] as const

const SIZES = [
  { id: "chico", label: "1 a 3 secciones", weight: 0 },
  { id: "medio", label: "4 a 8 secciones", weight: 1 },
  { id: "grande", label: "9 o más", weight: 2 },
] as const

const EXTRAS = [
  { id: "seo", label: "SEO", weight: 1 },
  { id: "blog", label: "Blog", weight: 1 },
  { id: "crm", label: "CRM", weight: 2 },
  { id: "idiomas", label: "Multi-idioma", weight: 2 },
  { id: "turnos", label: "Turnos / reservas", weight: 2 },
] as const

type TypeId = (typeof TYPES)[number]["id"]
type SizeId = (typeof SIZES)[number]["id"]
type ExtraId = (typeof EXTRAS)[number]["id"]

/** Lo que entra en todo proyecto, se elija lo que se elija. */
const ALWAYS = ["Diseño propio, sin plantillas", "Responsive real", "Carga rápida y SEO técnico"]

const STEPS = [
  { n: "01", title: "Charlamos", body: "Nos contás qué necesitás y qué te está frenando hoy." },
  { n: "02", title: "Propuesta", body: "Te mandamos alcance, plazo y presupuesto por escrito." },
  { n: "03", title: "Producción", body: "Diseñamos, desarrollamos y te lo entregamos andando." },
] as const

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-11 items-center rounded-xl border px-3.5 py-2 text-left text-[13px] transition-all duration-200",
        active
          ? "border-[#a78bfa]/50 bg-[#a78bfa]/[0.14] text-white shadow-[0_0_24px_-10px_rgba(167,139,250,0.7)]"
          : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:text-white/90",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function DisenoWebCierre({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [type, setType] = useState<TypeId>("institucional")
  const [size, setSize] = useState<SizeId>("medio")
  const [extras, setExtras] = useState<ExtraId[]>(["seo"])

  const toggleExtra = (id: ExtraId) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const summary = useMemo(() => {
    const t = TYPES.find((x) => x.id === type)!
    const s = SIZES.find((x) => x.id === size)!
    const chosen = EXTRAS.filter((x) => extras.includes(x.id))
    const weight = t.weight + s.weight + chosen.reduce((acc, x) => acc + x.weight, 0)

    // Lectura cualitativa, no una promesa de plazo.
    const complexity = weight <= 2 ? "Simple" : weight <= 5 ? "Media" : "Alta"

    // `getWhatsAppHref` ya arma el saludo y cierra con un punto: acá va solo el
    // fragmento que completa «Me interesa: …». Si le mandamos una frase entera
    // el mensaje sale con dos saludos y dos puntos finales.
    const message = [
      `${t.label.toLowerCase()} de ${s.label.toLowerCase()}`,
      chosen.length ? `con ${chosen.map((x) => x.label).join(", ")}` : null,
    ]
      .filter(Boolean)
      .join(", ")

    return { t, s, chosen, complexity, message }
  }, [type, size, extras])

  return (
    <motion.section
      id="cierre"
      className="relative scroll-mt-28 border-t border-white/10 bg-[#030305]/60 py-24 lg:py-32"
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_15%_18%,rgba(167,139,250,0.15)_0%,transparent_55%),radial-gradient(ellipse_70%_55%_at_92%_82%,rgba(236,168,214,0.1)_0%,transparent_52%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* 5/12 contra 6/12 y una columna de aire al final: el configurador
            manda sin quedar centrado, y la promesa se queda fija al costado
            mientras se recorre. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          {/* Columna izquierda: promesa + cómo seguimos. */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <span className="liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
              <MapPin className="size-3.5 text-[#eca8d6]" aria-hidden />
              Cosecha Creativa · San Juan
            </span>
            <h2 className="font-display mt-5 text-[2.05rem] leading-[1.07] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">
              <span className="block text-white/[0.92]">Una web que trabaje</span>
              <span className="mt-1 block bg-gradient-to-r from-[#f5f0ff] via-[#e9d5ff] to-[#67e8f9] bg-clip-text text-transparent">
                para tu negocio.
              </span>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/58">
              Armá tu proyecto en tres clics y el mensaje sale escrito solo. Sin formularios largos ni esperar tres días
              por una respuesta.
            </p>

            <ol className="mt-10 space-y-6">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.n}
                  className="relative flex gap-5 pl-1"
                  initial={reducedMotion ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                >
                  {/* Hilo que une los pasos; se corta en el último. */}
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[1.15rem] top-10 h-full w-px bg-gradient-to-b from-white/20 to-transparent"
                    />
                  )}
                  <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/60 font-mono text-[11px] text-[#a78bfa]">
                    {step.n}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-white">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/50">{step.body}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Columna derecha: el configurador. */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.75, ease: EASE }}
            className={cn(
              "relative overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.08] via-black/60 to-black/85 p-6 backdrop-blur-2xl md:p-8",
              "shadow-[0_48px_120px_-56px_rgba(167,139,250,0.35)]",
              "lg:col-span-6 lg:col-start-7",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-16 size-56 rounded-full bg-violet-500/15 blur-3xl"
            />

            <div className="relative">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                Armá tu proyecto
              </span>

              <fieldset className="mt-5">
                <legend className="mb-2.5 text-[12px] font-semibold text-white/70">¿Qué necesitás?</legend>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map((t) => (
                    <Chip key={t.id} active={type === t.id} onClick={() => setType(t.id)}>
                      <span className="block font-semibold">{t.label}</span>
                      <span className="mt-0.5 block text-[11px] text-white/40">{t.hint}</span>
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="mb-2.5 text-[12px] font-semibold text-white/70">¿De qué tamaño?</legend>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <Chip key={s.id} active={size === s.id} onClick={() => setSize(s.id)}>
                      {s.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="mb-2.5 text-[12px] font-semibold text-white/70">¿Sumás algo más?</legend>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS.map((x) => (
                    <Chip key={x.id} active={extras.includes(x.id)} onClick={() => toggleExtra(x.id)}>
                      {x.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              {/* Resumen en vivo. */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Tu proyecto</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#67e8f9]">
                    Complejidad {summary.complexity.toLowerCase()}
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/85">
                  {summary.t.label} · {summary.s.label}
                  {summary.chosen.length > 0 && (
                    <span className="text-white/55"> + {summary.chosen.map((x) => x.label).join(" + ")}</span>
                  )}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {ALWAYS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[12px] text-white/50">
                      <Check className="size-3 shrink-0 text-[#a78bfa]" strokeWidth={3} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] leading-relaxed text-white/35">
                  Plazo y presupuesto los confirmamos en la charla, según el alcance final.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  asChild
                  className={cn(
                    "group h-12 flex-[1.4] gap-2.5 rounded-2xl border-0 text-[13px] font-semibold text-white",
                    "bg-gradient-to-br from-[#25D366] via-[#1ebe57] to-[#128C7E]",
                    "shadow-[0_14px_44px_-12px_rgba(37,211,102,0.55)] transition-all duration-300 hover:brightness-[1.06] active:scale-[0.98]",
                  )}
                >
                  <a href={getWhatsAppHref(summary.message)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppMark className="size-[17px] shrink-0" aria-hidden />
                    Enviar mi proyecto
                    <ArrowRight
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 flex-1 gap-2 rounded-2xl border-white/[0.18] bg-white/[0.04] text-[13px] font-medium text-white/90 transition-all hover:border-[#67e8f9]/45 hover:bg-white/[0.08]"
                >
                  <a href={PORTFOLIO_PUBLIC_URL} target="_blank" rel="noopener noreferrer">
                    <Globe2 className="size-3.5 text-[#67e8f9]/85" aria-hidden />
                    Portafolio
                  </a>
                </Button>
              </div>

              <p className="mt-3 text-center text-[11px] text-white/35 sm:text-left">
                El mensaje sale escrito con lo que elegiste. Podés editarlo antes de enviar.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default DisenoWebCierre
