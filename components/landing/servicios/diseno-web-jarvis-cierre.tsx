"use client"

import { useMemo, useState } from "react"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { PORTFOLIO_PUBLIC_URL } from "@/components/landing/servicios/portfolio-macbook-showcase"
import { cn } from "@/lib/utils"

/**
 * Cierre de /servicios/diseno-web con el diseño portado.
 *
 * La lógica es la misma que ya estaba: el visitante arma su proyecto en tres
 * pasos —tipo, tamaño y extras— y el botón de WhatsApp sale con el mensaje ya
 * redactado. Lo que cambia es la piel: radio cero, hairlines, monoespaciada y
 * el bloque final con las esquinas marcadas del diseño original.
 *
 * Sigue sin haber precios ni plazos en números: serían un compromiso comercial
 * inventado. El resumen muestra alcance y una lectura cualitativa de la
 * complejidad; el presupuesto se confirma en la conversación.
 */

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
  { n: "01", tag: "CONTACTO", title: "CHARLAMOS", body: "Nos contás qué necesitás y qué te está frenando hoy." },
  { n: "02", tag: "ALCANCE", title: "PROPUESTA", body: "Te mandamos alcance, plazo y presupuesto por escrito." },
  { n: "03", tag: "ENTREGA", title: "PRODUCCIÓN", body: "Diseñamos, desarrollamos y te lo entregamos andando." },
] as const

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // `min-h-11` es tamaño de toque: los chips originales medían 34 px y en
        // móvil se fallaban.
        "flex min-h-11 items-center border px-3.5 py-2 text-left text-[13px] transition-colors duration-200",
        active
          ? "border-[var(--jv-accent)] bg-[color-mix(in_srgb,var(--jv-accent)_12%,transparent)] text-[var(--jv-fg)]"
          : "border-[var(--jv-line)] bg-transparent text-[var(--jv-muted)] hover:border-[var(--jv-line-bright)] hover:text-[var(--jv-fg)]",
      )}
    >
      {children}
    </button>
  )
}

export function DisenoWebJarvisCierre({ reduced = false }: { reduced?: boolean }) {
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
    <section id="cierre" className="relative scroll-mt-[88px] border-t border-[var(--jv-line)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* ── Proceso ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 border-b border-[var(--jv-line)] py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="jv-tag mb-3 block">PROCESO</span>
            <h2 className="jv-display text-5xl leading-[0.88] tracking-tight text-[var(--jv-fg)] sm:text-6xl lg:text-8xl">
              CÓMO
              <br />
              <span className="jv-outline">SEGUIMOS</span>
            </h2>
          </div>
          <span className="jv-mono text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">
            CHARLAMOS &nbsp;·&nbsp; PROPUESTA &nbsp;·&nbsp; PRODUCCIÓN
          </span>
        </div>

        {STEPS.map((step) => (
          <div
            key={step.n}
            className="jv-row-hover group grid grid-cols-[56px_1fr] border-b border-[var(--jv-line)] lg:grid-cols-[56px_300px_1fr]"
          >
            <div className="flex items-start border-r border-[var(--jv-line)] p-5 pt-6">
              <span className="jv-mono text-[10px] tracking-[0.16em] text-[var(--jv-dim)]">{step.n}</span>
            </div>
            <div className="flex flex-col gap-3 border-r border-[var(--jv-line)] p-6">
              <span className="jv-tag text-[9px]">{step.tag}</span>
              <h3 className="jv-display text-3xl leading-[0.9] text-[var(--jv-fg)] transition-colors duration-300 group-hover:text-[var(--jv-accent)] lg:text-4xl">
                {step.title}
              </h3>
            </div>
            <div className="col-span-2 flex items-center p-6 lg:col-span-1">
              <p className="max-w-lg text-sm leading-relaxed text-[var(--jv-muted)]">{step.body}</p>
            </div>
          </div>
        ))}

        {/* ── Bloque final ────────────────────────────────────── */}
        <div className="relative my-12 border border-[var(--jv-line)] lg:my-16">
          {/* Esquinas marcadas: el remate del diseño original. */}
          <span aria-hidden className="absolute left-0 top-0 size-16 border-b border-r border-[var(--jv-accent)]/30" />
          <span aria-hidden className="absolute right-0 top-0 size-16 border-b border-l border-[var(--jv-accent)]/30" />
          <span
            aria-hidden
            className="absolute bottom-0 left-0 size-16 border-r border-t border-[var(--jv-accent)]/30"
          />
          <span
            aria-hidden
            className="absolute bottom-0 right-0 size-16 border-l border-t border-[var(--jv-accent)]/30"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in srgb, var(--jv-accent) 5%, transparent) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <div className="mb-10 flex items-center gap-3">
              <span
                className={cn("inline-block size-2 rounded-full bg-[#22c55e]", !reduced && "jv-status-pulse")}
                aria-hidden
              />
              <span className="jv-mono text-[11px] tracking-[0.2em] text-[#22c55e]">COSECHA CREATIVA · SAN JUAN</span>
            </div>

            {/* 1fr / 1.05fr: el configurador es el que trabaja, así que se
                lleva la mitad ancha. */}
            <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <div>
                <h2 className="jv-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.88] tracking-tight text-[var(--jv-fg)]">
                  UNA WEB
                  <br />
                  <span className="text-[var(--jv-accent)]">QUE TRABAJE</span>
                  <br />
                  <span className="jv-outline">PARA VOS.</span>
                </h2>

                <p className="mt-8 max-w-md text-base leading-relaxed text-[var(--jv-muted)]">
                  Armá tu proyecto en tres clics y el mensaje sale escrito solo. Sin formularios largos ni esperar tres
                  días por una respuesta.
                </p>

                <ul className="mt-10 border-t border-[var(--jv-line)]">
                  {ALWAYS.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-[var(--jv-line)] py-3 text-[13px] text-[var(--jv-muted)]"
                    >
                      <span className="inline-block size-1.5 shrink-0 bg-[var(--jv-accent)]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="jv-mono mt-4 text-[10px] tracking-[0.14em] text-[var(--jv-dim)]">
                  ENTRA EN TODO PROYECTO, SE ELIJA LO QUE SE ELIJA
                </p>
              </div>

              {/* Configurador */}
              <div className="border border-[var(--jv-line)] bg-[var(--jv-surface)] p-6 md:p-8">
                <div className="jv-mono mb-6 flex items-center justify-between border-b border-[var(--jv-line)] pb-4 text-[10px] tracking-[0.2em] text-[var(--jv-dim)]">
                  <span>ARMÁ TU PROYECTO</span>
                  <span className="text-[var(--jv-accent)]">03 PASOS</span>
                </div>

                <fieldset>
                  <legend className="jv-mono mb-2.5 text-[10px] tracking-[0.16em] text-[var(--jv-muted)]">
                    01 · ¿QUÉ NECESITÁS?
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map((t) => (
                      <Chip key={t.id} active={type === t.id} onClick={() => setType(t.id)}>
                        <span className="block">
                          <span className="block font-semibold">{t.label}</span>
                          <span className="mt-0.5 block text-[11px] text-[var(--jv-dim)]">{t.hint}</span>
                        </span>
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="jv-mono mb-2.5 text-[10px] tracking-[0.16em] text-[var(--jv-muted)]">
                    02 · ¿DE QUÉ TAMAÑO?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <Chip key={s.id} active={size === s.id} onClick={() => setSize(s.id)}>
                        {s.label}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="jv-mono mb-2.5 text-[10px] tracking-[0.16em] text-[var(--jv-muted)]">
                    03 · ¿SUMÁS ALGO MÁS?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {EXTRAS.map((x) => (
                      <Chip key={x.id} active={extras.includes(x.id)} onClick={() => toggleExtra(x.id)}>
                        {x.label}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                {/* Resumen en vivo. */}
                <div className="mt-7 border border-[var(--jv-line)] bg-[var(--jv-bg)] p-4">
                  <div className="jv-mono flex items-baseline justify-between gap-4 text-[10px] tracking-[0.18em]">
                    <span className="text-[var(--jv-dim)]">TU PROYECTO</span>
                    <span className="text-[var(--jv-accent)]">
                      COMPLEJIDAD {summary.complexity.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--jv-fg)]">
                    {summary.t.label} · {summary.s.label}
                    {summary.chosen.length > 0 && (
                      <span className="text-[var(--jv-muted)]">
                        {" "}
                        + {summary.chosen.map((x) => x.label).join(" + ")}
                      </span>
                    )}
                  </p>
                  <p className="jv-mono mt-3 text-[10px] leading-relaxed tracking-[0.12em] text-[var(--jv-dim)]">
                    PLAZO Y PRESUPUESTO SE CONFIRMAN EN LA CHARLA, SEGÚN EL ALCANCE FINAL
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href={getWhatsAppHref(summary.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jv-mono group inline-flex flex-[1.4] items-center justify-center gap-3 bg-[var(--jv-accent)] px-5 py-4 text-[12px] font-semibold tracking-widest text-[var(--jv-bg)] transition-colors hover:bg-[var(--jv-fg)]"
                  >
                    <WhatsAppMark className="size-[16px] shrink-0" aria-hidden />
                    ENVIAR MI PROYECTO
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </a>
                  <a
                    href={PORTFOLIO_PUBLIC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jv-mono inline-flex flex-1 items-center justify-center gap-2 border border-[var(--jv-line-bright)] px-5 py-4 text-[12px] tracking-widest text-[var(--jv-muted)] transition-colors hover:border-[var(--jv-accent)]/40 hover:text-[var(--jv-accent)]"
                  >
                    PORTAFOLIO
                  </a>
                </div>

                <p className="jv-mono mt-3 text-[10px] leading-relaxed tracking-[0.12em] text-[var(--jv-dim)]">
                  EL MENSAJE SALE ESCRITO CON LO QUE ELEGISTE. PODÉS EDITARLO ANTES DE ENVIAR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DisenoWebJarvisCierre
