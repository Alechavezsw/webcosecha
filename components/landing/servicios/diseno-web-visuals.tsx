"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Visuales de las secciones de servicio de /servicios/diseno-web.
 *
 * Landing, WordPress y CRM eran la misma sección tres veces seguidas: idéntico
 * layout, idéntico bloque de texto y, en el hueco de la derecha, un ícono
 * grande dentro de un cuadrado redondeado. Lo único que cambiaba era el tinte
 * —ámbar, azul, violeta—, así que el visitante bajaba por tres bloques que le
 * parecían el mismo.
 *
 * Ahora cada una tiene su propio mecanismo, y cada mecanismo cuenta lo que ese
 * servicio hace:
 * - Landing: un embudo de conversión con las cifras contando.
 * - WordPress: la pila del sitio, capa por capa, separándose en 3D.
 * - CRM: un pipeline con las oportunidades avanzando entre columnas.
 *
 * Todo es SVG y CSS: la página ya tiene dos canvas WebGL (el hero y la
 * constelación de fondo), así que estas piezas no suman ni uno más.
 */

const EASE = [0.22, 1, 0.36, 1] as const

/** ¿Entró en pantalla? Dispara las animaciones una sola vez. */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: "-15%" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, seen }
}

/** Número que sube hasta su valor. Con movimiento reducido aparece directo. */
function CountUp({ to, run, suffix = "" }: { to: number; run: boolean; suffix?: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1100)
      if (k >= 1) {
        // Se fija el valor exacto en vez de dejar que lo decida el redondeo del
        // último cuadro: si no, el contador podía frenar en 4.819.
        setValue(to)
        return
      }
      // Misma curva que el resto de la página, para que el conteo frene igual
      // que se frenan las entradas de sección.
      setValue(Math.round(to * (1 - Math.pow(1 - k, 3))))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])

  return (
    <>
      {value.toLocaleString("es-AR")}
      {suffix}
    </>
  )
}

/* ── Landing: embudo de conversión ───────────────────────────────────────── */

const FUNNEL = [
  { label: "Visitas", value: 4820, width: 100, widthSm: 100, tone: "rgba(251,191,36,0.9)" },
  { label: "Clics en el CTA", value: 1290, width: 72, widthSm: 90, tone: "rgba(251,146,60,0.9)" },
  { label: "Leads", value: 386, width: 46, widthSm: 78, tone: "rgba(244,114,182,0.92)" },
] as const

function FunnelVisual({ reducedMotion }: { reducedMotion: boolean }) {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const run = seen || reducedMotion

  /**
   * En pantallas chicas el embudo se afina mucho menos. Con el estrechamiento
   * de escritorio, el último escalón medía 46% de ~280px y no entraba ni el
   * rótulo ni la cifra.
   */
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return (
    <div ref={ref} className="w-full max-w-[420px]">
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
          Embudo · últimos 30 días
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-amber-200/80">8,0 %</span>
      </div>

      <div className="space-y-3">
        {FUNNEL.map((step, i) => (
          <motion.div
            key={step.label}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={run ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: i * 0.14, ease: EASE }}
            className="relative"
          >
            {/* La barra se estrecha en cada paso: la forma es el mensaje. */}
            <motion.div
              className="relative overflow-hidden rounded-xl border border-white/10 px-4 py-3.5"
              style={{ background: `linear-gradient(90deg, ${step.tone}, rgba(0,0,0,0.15))` }}
              initial={reducedMotion ? false : { width: "40%" }}
              animate={run ? { width: `${narrow ? step.widthSm : step.width}%` } : undefined}
              transition={{ duration: 0.9, delay: i * 0.14, ease: EASE }}
            >
              {/* En pantallas chicas la cifra baja debajo del rótulo: en una
                  barra de 78% de 280px no entran los dos en la misma línea. */}
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="truncate text-[12px] font-semibold text-black/80 sm:text-[13px]">{step.label}</span>
                <span className="font-mono text-sm font-bold text-black/85">
                  <CountUp to={step.value} run={run} />
                </span>
              </div>
              {!reducedMotion && (
                // Destello que recorre la barra: el embudo se ve vivo.
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["0%", "500%"] }}
                  transition={{ duration: 2.6, delay: 1 + i * 0.3, repeat: Infinity, repeatDelay: 2.4 }}
                />
              )}
            </motion.div>
            {i < FUNNEL.length - 1 && (
              <span aria-hidden className="ml-6 block h-3 w-px bg-white/15" />
            )}
          </motion.div>
        ))}
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-white/45">
        Una sola acción por página. Todo lo demás se saca.
      </p>
    </div>
  )
}

/* ── WordPress: la pila del sitio ────────────────────────────────────────── */

const STACK = [
  { label: "Contenido", note: "Lo editás vos" },
  { label: "Tema a medida", note: "Diseño propio" },
  { label: "Plugins", note: "Solo los que hacen falta" },
  { label: "Backups", note: "Automáticos" },
  { label: "Servidor", note: "Monitoreado" },
] as const

function StackVisual({ reducedMotion }: { reducedMotion: boolean }) {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [active, setActive] = useState(0)

  /** Recorre las capas de a una: cada capa se enciende y se adelanta. */
  useEffect(() => {
    if (reducedMotion || !seen) return
    const id = setInterval(() => setActive((i) => (i + 1) % STACK.length), 1800)
    return () => clearInterval(id)
  }, [reducedMotion, seen])

  return (
    <div ref={ref} className="w-full max-w-[420px]">
      <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
        La pila, capa por capa
      </span>

      {/* `perspective` en el contenedor: las cinco placas comparten punto de
          fuga y se leen como un mismo objeto apilado. */}
      <div className="space-y-2.5 [perspective:1000px]">
        {STACK.map((layer, i) => {
          const on = i === active
          return (
            <motion.button
              key={layer.label}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-300",
                on ? "border-sky-300/40 bg-sky-400/[0.10]" : "border-white/10 bg-white/[0.02]",
              )}
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              animate={
                seen
                  ? {
                      opacity: 1,
                      x: on && !reducedMotion ? 18 : 0,
                      rotateY: on && !reducedMotion ? -7 : 0,
                    }
                  : undefined
              }
              transition={{ duration: 0.55, delay: seen ? i * 0.08 : 0, ease: EASE }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums transition-colors",
                  on ? "text-sky-200" : "text-white/25",
                )}
              >
                {String(STACK.length - i).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span
                  className={cn(
                    "block text-sm font-semibold transition-colors",
                    on ? "text-white" : "text-white/70",
                  )}
                >
                  {layer.label}
                </span>
                <span className="block text-[11px] text-white/40">{layer.note}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full transition-all duration-300",
                  on ? "scale-150 bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.9)]" : "bg-white/15",
                )}
              />
            </motion.button>
          )
        })}
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-white/45">
        Vos tocás la capa de arriba. Del resto nos ocupamos nosotros.
      </p>
    </div>
  )
}

/* ── CRM: pipeline ───────────────────────────────────────────────────────── */

const COLUMNS = ["Nuevo", "En contacto", "Ganado"] as const

/** Cada oportunidad avanza de columna con su propio retraso. */
const DEALS = [
  { name: "Bodega Sur", amount: "$ 480k", from: 0, delay: 0 },
  { name: "Estudio Vera", amount: "$ 220k", from: 0, delay: 1.1 },
  { name: "Minera Andes", amount: "$ 1,2M", from: 1, delay: 0.5 },
  { name: "Clínica Norte", amount: "$ 350k", from: 1, delay: 1.8 },
] as const

function PipelineVisual({ reducedMotion }: { reducedMotion: boolean }) {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reducedMotion || !seen) return
    const id = setInterval(() => setStep((s) => s + 1), 2600)
    return () => clearInterval(id)
  }, [reducedMotion, seen])

  /**
   * Tres columnas no entran en un celular: a 280px cada una quedaba en 75px y
   * los nombres se cortaban en «B..», «E..». En angosto el mismo pipeline se
   * muestra como lista, con la etapa en una etiqueta al costado.
   */
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  /** Etapa actual de cada oportunidad, compartida por las dos vistas. */
  const stageOf = (from: number) => from + (reducedMotion ? 0 : Math.min(2 - from, step))

  if (narrow) {
    return (
      <div ref={ref} className="w-full">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
            Pipeline comercial
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-fuchsia-200/80">4 abiertas</span>
        </div>

        <ul className="space-y-2">
          {DEALS.map((deal) => {
            const stage = stageOf(deal.from)
            const won = stage === 2
            return (
              <li
                key={deal.name}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                  won ? "border-fuchsia-300/30 bg-fuchsia-400/[0.08]" : "border-white/10 bg-white/[0.02]",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-white/90">{deal.name}</span>
                  <span className="font-mono text-[10px] text-white/45">{deal.amount}</span>
                </span>
                <motion.span
                  key={stage}
                  initial={reducedMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                    won
                      ? "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100"
                      : "border-white/12 bg-black/40 text-white/60",
                  )}
                >
                  {COLUMNS[stage]}
                </motion.span>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-[12px] leading-relaxed text-white/45">
          Cada consulta que entra por la web queda cargada y con responsable.
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} className="w-full max-w-[440px]">
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
          Pipeline comercial
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-fuchsia-200/80">4 abiertas</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {COLUMNS.map((col, ci) => (
          <div
            key={col}
            className={cn(
              "min-h-[190px] rounded-xl border p-2.5",
              ci === 2 ? "border-fuchsia-300/25 bg-fuchsia-400/[0.06]" : "border-white/10 bg-white/[0.02]",
            )}
          >
            <span className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
              {col}
            </span>
            <div className="space-y-2">
              {DEALS.map((deal) => {
                // La oportunidad avanza una columna por vuelta y se queda en la
                // última: el pipeline se llena, no da vueltas en círculo.
                if (stageOf(deal.from) !== ci) return null
                return (
                  <motion.div
                    key={deal.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: deal.delay * 0.1, ease: EASE }}
                    className={cn(
                      "rounded-lg border px-2.5 py-2",
                      ci === 2
                        ? "border-fuchsia-300/30 bg-fuchsia-400/10"
                        : "border-white/10 bg-black/40",
                    )}
                  >
                    <span className="block truncate text-[11px] font-semibold text-white/90">
                      {deal.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-white/45">{deal.amount}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-white/45">
        Cada consulta que entra por la web queda cargada y con responsable.
      </p>
    </div>
  )
}

/* ── E-commerce: el checkout ─────────────────────────────────────────────── */

const CART = [
  { name: "Malbec Reserva 2021", qty: 2, price: "$ 24.800", tone: "from-emerald-400/40 to-emerald-900/20" },
  { name: "Caja degustación", qty: 1, price: "$ 18.500", tone: "from-[#67e8f9]/35 to-cyan-900/20" },
] as const

/** Estados del botón de pago; vuelven a empezar en bucle. */
const PAY_STATES = ["idle", "loading", "done"] as const

/**
 * Checkout de una tienda.
 *
 * La sección de e-commerce cerraba con el mismo bolso gigante dentro de un
 * cuadrado que usaban las otras. Acá se ve lo que se vende: carrito, totales y
 * un pago que se aprueba. El bucle de tres estados es lo que hace que el bloque
 * se sienta un producto y no una ilustración.
 */
export function CheckoutVisual({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [state, setState] = useState(0)

  useEffect(() => {
    if (reducedMotion || !seen) return
    const id = setInterval(() => setState((s) => (s + 1) % PAY_STATES.length), 1900)
    return () => clearInterval(id)
  }, [reducedMotion, seen])

  const pay = PAY_STATES[state]

  return (
    <div ref={ref} className="w-full max-w-[380px]">
      <div className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">Tu carrito</span>
          <span className="font-mono text-[10px] text-emerald-300/80">3 items</span>
        </div>

        <ul className="space-y-2.5">
          {CART.map((item) => (
            <li key={item.name} className="flex items-center gap-3">
              <span className={cn("size-11 shrink-0 rounded-lg bg-gradient-to-br", item.tone)} aria-hidden />
              {/* En angosto el precio baja a la segunda línea: compitiendo por
                  el ancho, el nombre del producto quedaba en «Ma…». */}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-white/90">{item.name}</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-white/40">× {item.qty}</span>
                  <span className="font-mono text-[11px] text-white/70 sm:hidden">{item.price}</span>
                </span>
              </span>
              <span className="hidden shrink-0 font-mono text-[12px] text-white/75 sm:block">{item.price}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
          <div className="flex justify-between text-[11px] text-white/45">
            <span>Subtotal</span>
            <span className="font-mono">$ 43.300</span>
          </div>
          <div className="flex justify-between text-[11px] text-white/45">
            <span>Envío</span>
            <span className="font-mono text-emerald-300/85">Gratis</span>
          </div>
          <div className="flex justify-between pt-1 text-[13px] font-semibold text-white">
            <span>Total</span>
            <span className="font-mono">$ 43.300</span>
          </div>
        </div>

        {/* El botón recorre inactivo → procesando → aprobado. */}
        <motion.div
          className={cn(
            "mt-4 flex h-11 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-colors duration-300",
            pay === "done"
              ? "bg-emerald-400 text-emerald-950"
              : "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white",
          )}
          animate={reducedMotion ? undefined : { scale: pay === "loading" ? 0.98 : 1 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {pay === "loading" ? (
            <>
              <motion.span
                className="size-3.5 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                aria-hidden
              />
              Procesando…
            </>
          ) : pay === "done" ? (
            <>
              <Check className="size-4" strokeWidth={3} aria-hidden />
              Pago aprobado
            </>
          ) : (
            "Pagar $ 43.300"
          )}
        </motion.div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-white/45">
        Checkout corto, stock real y el pago resuelto en la misma pantalla.
      </p>
    </div>
  )
}

/* ── SEO: la escalada en los resultados ──────────────────────────────────── */

/** Posiciones por las que va pasando el sitio. Termina en el primer lugar. */
const CLIMB = [8, 6, 4, 2, 1] as const

const COMPETITORS = ["directorio-generico.com", "listado-empresas.ar", "portal-noticias.com", "otra-agencia.com", "guia-comercial.ar"]

/**
 * Escalada en los resultados de búsqueda.
 *
 * La sección de SEO tenía de fondo un vídeo de stock y a la derecha una lista
 * de tácticas: nada mostraba el resultado del que habla. Acá se ve: el sitio
 * arranca en la posición 8 y sube hasta la 1, y las filas se reacomodan solas
 * con `layout`, que es lo que hace que el salto se lea como un movimiento y no
 * como un cambio de contenido.
 */
export function SerpClimbVisual({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (reducedMotion || !seen) return
    const id = setInterval(() => setStage((s) => (s + 1) % (CLIMB.length + 2)), 1500)
    return () => clearInterval(id)
  }, [reducedMotion, seen])

  // Los dos pasos extra del ciclo dejan el primer puesto en pantalla un rato
  // antes de volver a empezar.
  const position = CLIMB[Math.min(stage, CLIMB.length - 1)]

  const rows = COMPETITORS.map((host, i) => ({ id: host, host, mine: false as const, i }))
  const list = [...rows]
  list.splice(position - 1, 0, { id: "cosecha", host: "tu-sitio.com.ar", mine: true as never, i: -1 })

  return (
    <div ref={ref} className="w-full">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
          «diseño web san juan»
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#c4b5fd]">
          Posición {position}
        </span>
      </div>

      <ol className="space-y-1.5">
        {list.slice(0, 6).map((row, idx) => {
          const mine = row.mine
          return (
            <motion.li
              key={row.id}
              layout={!reducedMotion}
              transition={{ layout: { duration: 0.7, ease: EASE } }}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                mine
                  ? "border-[#a78bfa]/45 bg-[#a78bfa]/[0.12] shadow-[0_0_30px_-14px_rgba(167,139,250,0.9)]"
                  : "border-white/[0.07] bg-white/[0.02]",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded font-mono text-[10px]",
                  mine ? "bg-[#a78bfa] text-black" : "bg-white/[0.06] text-white/35",
                )}
              >
                {idx + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block h-2 rounded-full",
                    mine ? "w-[72%] bg-[#c4b5fd]" : "w-[58%] bg-white/15",
                  )}
                />
                <span
                  className={cn(
                    "mt-1.5 block truncate font-mono text-[10px]",
                    mine ? "text-[#c4b5fd]" : "text-white/25",
                  )}
                >
                  {row.host}
                </span>
              </span>
              {mine && (
                <span className="shrink-0 rounded-full border border-[#a78bfa]/40 px-2 py-0.5 text-[10px] font-semibold text-[#e9d5ff]">
                  Tu sitio
                </span>
              )}
            </motion.li>
          )
        })}
      </ol>

      <p className="mt-4 text-[12px] leading-relaxed text-white/45">
        Subir no es magia: es contenido, velocidad y estructura técnica, sostenidos en el tiempo.
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */

export function ServiceVisual({
  variant,
  reducedMotion = false,
}: {
  variant: "landing" | "wordpress" | "crm"
  reducedMotion?: boolean
}) {
  if (variant === "landing") return <FunnelVisual reducedMotion={reducedMotion} />
  if (variant === "wordpress") return <StackVisual reducedMotion={reducedMotion} />
  return <PipelineVisual reducedMotion={reducedMotion} />
}

export default ServiceVisual
