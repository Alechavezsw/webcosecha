"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Consola de capacidades de /servicios/apps.
 *
 * Reemplaza tres bloques que eran la misma grilla de celdas repetida: la lista
 * de «qué podemos crear» (11 ítems), la grilla de integraciones (10 celdas) y
 * el manifiesto de texto. Acá cada capacidad es un módulo con su esquema, su
 * frase y las integraciones que le corresponden, así el visitante ve una cosa
 * por vez en lugar de barrer treinta celdas iguales.
 *
 * Avanza sola hasta que alguien toca algo: a partir de ahí manda el usuario y
 * el autoavance no vuelve (nada peor que una lista que se te mueve sola
 * mientras leés).
 */

const INK = "#050506"
const LINE = "#1E1E24"
const ACID = "#C8FF00"
const PANEL = "rgba(7,7,10,0.66)"
const MESH = "rgba(30,30,36,0.72)"

/** Milisegundos por módulo cuando la consola avanza sola. */
const DWELL = 5000

type Kind =
  | "rows"
  | "calendar"
  | "shelves"
  | "money"
  | "chart"
  | "flow"
  | "chat"
  | "portal"
  | "gantt"
  | "stack"

const MODULES: {
  id: string
  name: string
  title: string
  blurb: string
  /** Sistemas concretos que ya construimos con ese módulo. */
  examples: readonly string[]
  tools: readonly string[]
  kind: Kind
}[] = [
  {
    id: "gestion",
    name: "Gestión y clientes",
    title: "Todo el cliente en una ficha",
    blurb:
      "Historial, seguimiento, responsables y permisos por área. Se termina el «¿quién habló con este cliente?».",
    examples: ["CRM comercial", "Padrón de socios", "Legajos de empleados"],
    tools: ["CRM", "Gmail", "Google Sheets"],
    kind: "rows",
  },
  {
    id: "turnos",
    name: "Turnos y reservas",
    title: "Una agenda que no se pisa",
    blurb: "Disponibilidad real, confirmaciones automáticas y una vista por profesional, cancha o sucursal.",
    examples: ["Agenda de consultorio", "Reserva de canchas", "Órdenes de trabajo"],
    tools: ["Google Calendar", "WhatsApp Business", "Bases de datos"],
    kind: "calendar",
  },
  {
    id: "stock",
    name: "Stock e inventario",
    title: "Saber qué hay y dónde está",
    blurb: "Movimientos, mínimos y alertas de reposición, con depósito y sucursales en la misma base.",
    examples: ["Depósito y sucursales", "Control de insumos", "Trazabilidad de lotes"],
    tools: ["Excel", "Bases de datos", "APIs externas"],
    kind: "shelves",
  },
  {
    id: "dinero",
    name: "Pagos y cobranzas",
    title: "Cuotas, socios y vencimientos",
    blurb: "Estado de cuenta por cliente y recordatorios que salen solos antes de que la fecha se pase.",
    examples: ["Cuotas de socios", "Cobranza de expensas", "Estado de cuenta online"],
    tools: ["WhatsApp Business", "Excel", "APIs externas"],
    kind: "money",
  },
  {
    id: "metricas",
    name: "Paneles y métricas",
    title: "Datos en tiempo real",
    blurb: "Ventas, procesos y equipos en un panel que se lee en diez segundos, no en una reunión de una hora.",
    examples: ["Tablero de ventas", "Producción en planta", "Reportes por sucursal"],
    tools: ["Google Sheets", "Bases de datos", "Webhooks"],
    kind: "chart",
  },
  {
    id: "automatizacion",
    name: "Automatizaciones",
    title: "Tareas que se hacen solas",
    blurb: "Formularios, avisos, informes y sincronizaciones corriendo sin que nadie tenga que acordarse.",
    examples: ["Avisos por WhatsApp", "Informe semanal automático", "Alta de cliente desde el formulario"],
    tools: ["n8n", "WhatsApp Business", "Webhooks", "Gmail"],
    kind: "flow",
  },
  {
    id: "ia",
    name: "IA aplicada",
    title: "Un asistente adentro del sistema",
    blurb: "Lee documentos, redacta informes y responde consultas con los datos de tu propia operación.",
    examples: ["Asistente interno", "Lectura de facturas", "Clasificación de consultas"],
    tools: ["Asistentes", "Lectura de documentos", "Informes"],
    kind: "chat",
  },
  {
    id: "portal",
    name: "Portal de clientes",
    title: "Autogestión, sin llamados",
    blurb: "Tu cliente entra con su usuario, ve su información y resuelve solo lo que hoy te pregunta por teléfono.",
    examples: ["Autogestión de cuenta", "Seguimiento de pedidos", "Descarga de comprobantes"],
    tools: ["Bases de datos", "Gmail", "APIs externas"],
    kind: "portal",
  },
  {
    id: "obras",
    name: "Obras y proyectos",
    title: "Avance visible, etapa por etapa",
    blurb: "Tareas, partes diarios, fotos y certificaciones ordenados por proyecto y por responsable.",
    examples: ["Avance de obra", "Partes diarios", "Certificaciones"],
    tools: ["Google Sheets", "Bases de datos", "Webhooks"],
    kind: "gantt",
  },
  {
    id: "saas",
    name: "Plataformas SaaS",
    title: "Preparado para escalar",
    blurb: "Multiusuario, con planes e integraciones, y una base lista para sumar módulos sin rehacer nada.",
    examples: ["Multiempresa con planes", "Catálogo mayorista B2B", "Marketplace de servicios"],
    tools: ["APIs externas", "Bases de datos", "Webhooks"],
    kind: "stack",
  },
]

/* ── Esquemas ──────────────────────────────────────────────────────────────
   Wireframes mínimos, en la misma línea de 1px y el mismo ácido del resto de
   la página. No son capturas: son la forma del módulo, que es lo que hace que
   se distingan de un vistazo.                                              */

function Bar({ w, lit }: { w: string; lit?: boolean }) {
  return <span className="block h-[6px]" style={{ width: w, backgroundColor: lit ? ACID : "rgba(255,255,255,0.14)" }} />
}

function Schematic({ kind }: { kind: Kind }) {
  if (kind === "rows") {
    return (
      <div className="flex h-full flex-col justify-center gap-2.5">
        {[
          { w: "62%", lit: false },
          { w: "84%", lit: true },
          { w: "48%", lit: false },
          { w: "71%", lit: false },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="size-2 shrink-0 rotate-45" style={{ backgroundColor: r.lit ? ACID : "#2A2A32" }} />
            <Bar w={r.w} lit={r.lit} />
          </div>
        ))}
      </div>
    )
  }

  if (kind === "calendar") {
    return (
      <div className="grid h-full grid-cols-7 grid-rows-4 gap-px" style={{ backgroundColor: MESH }}>
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            style={{ backgroundColor: [9, 10, 17, 23].includes(i) ? ACID : INK }}
            className={[9, 10, 17, 23].includes(i) ? "opacity-90" : "opacity-100"}
          />
        ))}
      </div>
    )
  }

  if (kind === "money") {
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        {[
          { l: "38%", r: "18%", lit: true },
          { l: "52%", r: "12%", lit: false },
          { l: "30%", r: "22%", lit: false },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Bar w={r.l} lit={false} />
            <Bar w={r.r} lit={r.lit} />
          </div>
        ))}
        <div className="mt-2 h-px w-full" style={{ backgroundColor: LINE }} />
        <div className="flex items-center justify-between gap-4">
          <Bar w="24%" lit={false} />
          <Bar w="34%" lit />
        </div>
      </div>
    )
  }

  if (kind === "chart") {
    return (
      <div className="flex h-full items-end gap-2">
        {[34, 58, 46, 72, 55, 88, 64, 96].map((h, i) => (
          <span
            key={i}
            className="flex-1"
            style={{ height: `${h}%`, backgroundColor: i === 7 ? ACID : "#23232B" }}
          />
        ))}
      </div>
    )
  }

  if (kind === "flow") {
    return (
      <svg viewBox="0 0 200 96" className="h-full w-full" aria-hidden>
        <g stroke={LINE} strokeWidth="1" fill="none">
          <path d="M28 48 H84" />
          <path d="M116 48 H172" />
          <path d="M100 32 V16 H172" />
          <path d="M100 64 V80 H172" />
        </g>
        <g fill="#1A1A20" stroke={LINE}>
          <rect x="8" y="38" width="20" height="20" />
          <rect x="162" y="6" width="20" height="20" />
          <rect x="162" y="70" width="20" height="20" />
        </g>
        <rect x="84" y="32" width="32" height="32" fill="none" stroke={ACID} />
        <rect x="162" y="38" width="20" height="20" fill={ACID} />
      </svg>
    )
  }

  if (kind === "chat") {
    return (
      <div className="flex h-full flex-col justify-center gap-2.5">
        <span className="h-7 w-[58%] border" style={{ borderColor: LINE, backgroundColor: INK }} />
        <span className="ml-auto h-7 w-[44%]" style={{ backgroundColor: "rgba(200,255,0,0.16)", border: `1px solid ${ACID}` }} />
        <span className="h-7 w-[68%] border" style={{ borderColor: LINE, backgroundColor: INK }} />
        <span className="flex items-center gap-1.5 pt-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full" style={{ backgroundColor: ACID, opacity: 1 - i * 0.3 }} />
          ))}
        </span>
      </div>
    )
  }

  if (kind === "shelves") {
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        {[
          [1, 1, 0, 1, 1, 1, 0, 1],
          [1, 0, 1, 1, 2, 1, 1, 0],
          [1, 1, 1, 0, 1, 0, 1, 1],
        ].map((row, r) => (
          <div key={r} className="flex items-end gap-2 border-b pb-1.5" style={{ borderColor: LINE }}>
            {row.map((v, i) => (
              <span
                key={i}
                className="flex-1"
                style={{
                  height: v === 0 ? 6 : 18,
                  backgroundColor: v === 2 ? ACID : v === 0 ? "rgba(255,255,255,0.06)" : "#23232B",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (kind === "portal") {
    return (
      <div className="flex h-full items-center">
        <div className="h-[92%] w-full border" style={{ borderColor: LINE, backgroundColor: INK }}>
          <div className="flex items-center gap-1.5 border-b px-2.5 py-1.5" style={{ borderColor: LINE }}>
            <span className="size-1.5" style={{ backgroundColor: "#2A2A32" }} />
            <span className="size-1.5" style={{ backgroundColor: "#2A2A32" }} />
            <span className="size-1.5" style={{ backgroundColor: ACID }} />
            <span className="ml-2 h-1.5 w-1/3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          </div>
          <div className="flex gap-2.5 p-2.5">
            <span className="h-[52px] w-[26%]" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
            <span className="flex flex-1 flex-col gap-1.5">
              <Bar w="72%" lit />
              <Bar w="94%" />
              <Bar w="58%" />
              <Bar w="80%" />
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (kind === "gantt") {
    return (
      <div className="flex h-full flex-col justify-center gap-2.5">
        {[
          { off: "0%", w: "44%", lit: false },
          { off: "18%", w: "52%", lit: true },
          { off: "38%", w: "38%", lit: false },
          { off: "56%", w: "40%", lit: false },
        ].map((r, i) => (
          <div key={i} className="flex">
            <span style={{ width: r.off }} />
            <span
              className="h-[10px]"
              style={{ width: r.w, backgroundColor: r.lit ? ACID : "#26262E" }}
            />
          </div>
        ))}
      </div>
    )
  }

  // stack
  return (
    <div className="flex h-full items-center justify-center [perspective:600px]">
      <div className="relative h-[76%] w-[68%] [transform-style:preserve-3d] [transform:rotateX(52deg)_rotateZ(-28deg)]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 border"
            style={{
              borderColor: i === 2 ? ACID : LINE,
              backgroundColor: i === 2 ? "rgba(200,255,0,0.06)" : INK,
              transform: `translateZ(${i * 22}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */

export function AppsCapabilityConsole({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [active, setActive] = useState(0)
  /** Una vez que el usuario elige, el autoavance no vuelve. */
  const [locked, setLocked] = useState(reducedMotion)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const rail = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (locked || reducedMotion) return
    timer.current = setInterval(() => setActive((i) => (i + 1) % MODULES.length), DWELL)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [locked, reducedMotion])

  /**
   * En mobile el índice es un riel horizontal: sin esto el autoavance mostraba
   * el módulo 05 en el panel mientras el riel seguía mostrando el 01 y el 02.
   * Se mueve el riel a mano en vez de `scrollIntoView` para no arrastrar el
   * scroll vertical de la página.
   */
  useEffect(() => {
    const box = rail.current
    const tab = tabs.current[active]
    if (!box || !tab || box.scrollWidth <= box.clientWidth) return
    box.scrollTo({
      left: tab.offsetLeft - box.clientWidth / 2 + tab.clientWidth / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }, [active, reducedMotion])

  const choose = (i: number) => {
    setLocked(true)
    setActive(i)
  }

  const mod = MODULES[active]

  return (
    <div className="relative border" style={{ borderColor: LINE, backgroundColor: PANEL }}>
      {/* Barra de estado: índice del módulo y avance del autoplay. */}
      <div
        className="relative flex items-center gap-4 border-b px-4 py-3"
        style={{ borderColor: LINE, backgroundColor: INK }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
          Módulo {String(active + 1).padStart(2, "0")} / {String(MODULES.length).padStart(2, "0")}
        </span>
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/25 sm:block">
          {locked ? ` módulos` : "Recorriendo módulos"}
        </span>
        {!locked && !reducedMotion && (
          <motion.span
            key={active}
            aria-hidden
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ backgroundColor: ACID }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: DWELL / 1000, ease: "linear" }}
          />
        )}
      </div>

      <div className="grid gap-px md:grid-cols-[minmax(200px,0.9fr)_1.6fr]" style={{ backgroundColor: MESH }}>
        {/* Índice de módulos. En mobile es un riel horizontal: apilar siete
            botones a lo alto empujaba el panel fuera de la primera pantalla. */}
        <div
          ref={rail}
          className="flex overflow-x-auto md:block md:overflow-visible"
          style={{ backgroundColor: INK }}
          role="tablist"
          aria-label="Capacidades"
        >
          {MODULES.map((m, i) => {
            const on = i === active
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => choose(i)}
                onMouseEnter={() => !reducedMotion && choose(i)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-3 whitespace-nowrap px-4 py-4 text-left transition-colors duration-200 md:w-full md:whitespace-normal md:px-5 md:py-[15px]",
                  on ? "text-white" : "text-white/55 hover:text-white/85",
                )}
              >
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left transition-transform duration-300 md:inset-y-0 md:h-auto md:w-[2px]"
                  style={{
                    backgroundColor: ACID,
                    transform: on ? "scaleX(1) scaleY(1)" : "scaleX(0) scaleY(0)",
                  }}
                />
                {/* Tinte ácido apenas perceptible en el activo: sostiene la
                    selección cuando el filete queda fuera de la mirada. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{
                    opacity: on ? 1 : 0,
                    background: "linear-gradient(90deg, rgba(200,255,0,0.09), transparent 78%)",
                  }}
                />
                <span className="relative font-mono text-[10px] tracking-[0.2em] text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative text-[14px] leading-snug md:text-[15px]">{m.name}</span>
                <span
                  aria-hidden
                  className="relative ml-auto hidden font-mono text-[11px] transition-opacity duration-200 md:block"
                  style={{ color: ACID, opacity: on ? 1 : 0 }}
                >
                  ▸
                </span>
              </button>
            )
          })}
        </div>

        {/* Panel del módulo activo. */}
        <div className="relative min-h-[380px] p-6 md:min-h-[440px] md:p-8" style={{ backgroundColor: INK }}>
          {/* Sin `AnimatePresence`: con `mode="wait"` el panel quedaba medio
              segundo vacío entre la salida de un módulo y la entrada del otro.
              Cambiando la `key` el nodo se reemplaza en el acto y solo se anima
              la entrada. */}
          <motion.div
            key={mod.id}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col"
          >
            {/* Visor: el esquema dentro de su propio marco, con un resplandor
                ácido detrás. Suelto sobre el fondo se leía como un adorno. */}
            <div
              className="relative shrink-0 border p-4 md:p-5"
              style={{ borderColor: LINE, backgroundColor: "rgba(12,12,16,0.85)" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 100% at 50% 100%, rgba(200,255,0,0.09), transparent 70%)",
                }}
              />
              {["left-0 top-0 border-l border-t", "right-0 bottom-0 border-r border-b"].map((pos) => (
                <span
                  key={pos}
                  aria-hidden
                  className={cn("pointer-events-none absolute size-3", pos)}
                  style={{ borderColor: ACID }}
                />
              ))}
              <div className="relative h-[104px] md:h-[124px]">
                <Schematic kind={mod.kind} />
              </div>
            </div>

            <h3 className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight tracking-tight text-white">
              {mod.title}
            </h3>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/65 md:text-base">{mod.blurb}</p>

            {/* Ejemplos concretos: nombres de sistemas reales, que es lo que
                la gente busca cuando llega a esta página. */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {mod.examples.map((e) => (
                <li key={e} className="flex items-center gap-2 text-[14px] text-white/80">
                  <span aria-hidden className="size-1 shrink-0 rotate-45" style={{ backgroundColor: ACID }} />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">Conecta</span>
              {mod.tools.map((t) => (
                <span
                  key={t}
                  className="border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70"
                  style={{ borderColor: LINE }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AppsCapabilityConsole
