"use client"

import { motion } from "framer-motion"
import { Layers } from "lucide-react"
import { SpotlightFeatureCard } from "@/components/landing/servicios/spotlight-feature-card"
import { CheckoutVisual, ServiceVisual } from "@/components/landing/servicios/diseno-web-visuals"
import { cn } from "@/lib/utils"

/**
 * Los cuatro servicios de /servicios/diseno-web, en una sola sección.
 *
 * Antes eran **cuatro secciones de pantalla completa, una atrás de la otra**
 * (e-commerce, landing, WordPress y CRM) con exactamente la misma estructura:
 * fondo con degradado, halo que se movía con el scroll, cuatro etiquetas
 * flotando en las esquinas, y una tarjeta de vidrio con insignia, título,
 * párrafo y chips. Cambiaba el tinte y poco más. Eran ~600 líneas de JSX
 * repetido y una tercera parte del alto de la página.
 *
 * Ahora es una grilla de cuatro tarjetas: el mismo contenido —no se perdió una
 * palabra— pero de un vistazo y comparables entre sí, que es como alguien
 * decide qué servicio necesita.
 */

const EASE = [0.22, 1, 0.36, 1] as const

const SERVICES = [
  {
    id: "ecommerce",
    badge: "Venta online",
    title: "Tiendas online &",
    accent: "e-commerce",
    accentClass: "from-emerald-200 via-[#67e8f9] to-[#c4b5fd]",
    badgeClass: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200/95",
    tint: "52,211,153",
    body: "Comercios electrónicos seguros, claros para el usuario y listos para escalar — integrados con medios de pago y tu operación.",
    chips: ["Checkout", "Stock", "Pagos", "Envíos"],
    visual: "checkout" as const,
  },
  {
    id: "landing",
    badge: "Conversión",
    title: "Landing",
    accent: "pages",
    accentClass: "from-amber-100 via-orange-200 to-rose-300",
    badgeClass: "border-amber-400/28 bg-amber-500/12 text-amber-100",
    tint: "251,191,36",
    body: "Páginas enfocadas en una sola acción: leads, reservas o campañas pagas — copys y estructura pensados para conversión.",
    chips: ["CTA", "Forms", "A/B", "Ads"],
    visual: "landing" as const,
  },
  {
    id: "wordpress",
    badge: "CMS & soporte",
    title: "WordPress &",
    accent: "mantenimiento",
    accentClass: "from-sky-100 via-blue-200 to-indigo-300",
    badgeClass: "border-blue-400/28 bg-blue-500/12 text-blue-100",
    tint: "96,165,250",
    body: "Cuando necesitás autonomía para editar contenidos. Con mantenimiento, backups y actualizaciones para que todo siga estable.",
    chips: ["Editor", "Plugins", "Backups", "Updates"],
    visual: "wordpress" as const,
  },
  {
    id: "crm",
    badge: "Operación",
    title: "CRM &",
    accent: "automatización",
    accentClass: "from-violet-100 via-fuchsia-200 to-[#eca8d6]",
    badgeClass: "border-violet-400/28 bg-violet-500/12 text-violet-100",
    tint: "167,139,250",
    body: "Formularios y flujos conectados con tus herramientas de gestión, para que los contactos no se pierdan y el equipo trabaje ordenado.",
    chips: ["Leads", "Flujos", "Alertas", "Integraciones"],
    visual: "crm" as const,
  },
] as const

export function DisenoWebServicios({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <motion.section
      id="servicios"
      className="relative scroll-mt-28 overflow-hidden border-t border-white/10 bg-black/55 py-20 lg:py-28"
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_8%,rgba(52,211,153,0.09)_0%,transparent_50%),radial-gradient(ellipse_75%_60%_at_88%_92%,rgba(167,139,250,0.12)_0%,transparent_52%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Cabecera en dos piezas: el titular a la izquierda y el apoyo caído a
            la derecha. Antes era un bloque único de `max-w-3xl` alineado a la
            izquierda, con el renglón del párrafo tan largo como el título. */}
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="liquid-glass mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium text-white/95">
              <Layers className="size-3.5 text-[#67e8f9]" aria-hidden />
              Qué construimos
            </span>
            <h2 className="font-display text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">
              Cuatro caminos,{" "}
              <span className="bg-gradient-to-r from-white via-[#e9d5ff] to-[#67e8f9] bg-clip-text text-transparent">
                una misma base técnica.
              </span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-white/55 lg:col-span-4 lg:col-start-9 lg:pb-2">
            Elegís según lo que tu negocio necesita hoy. Todo se puede sumar después.
          </p>
        </div>

        {/* 7/5 y después 5/7: cada fila carga el peso de un lado distinto, y la
            tarjeta ancha usa su ancho para poner el mecanismo al lado del copy
            en vez de estirar el párrafo a 700 px. */}
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {SERVICES.map((s, i) => {
            const wide = i === 0 || i === 3

            return (
              <motion.div
                key={s.id}
                id={s.id}
                className={cn("scroll-mt-28", wide ? "lg:col-span-7" : "lg:col-span-5")}
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
              >
                <SpotlightFeatureCard
                  disabled={reducedMotion}
                  tint={s.tint}
                  className="flex h-full flex-col border border-white/[0.09] bg-gradient-to-br from-white/[0.06] via-black/45 to-black/75 p-6 backdrop-blur-xl md:p-8"
                >
                  {/* Trama de puntos: la textura que traían las tarjetas viejas. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                      backgroundSize: "26px 26px",
                    }}
                  />

                  <div
                    className={cn(
                      "relative flex h-full flex-col",
                      wide && "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:items-center md:gap-8",
                    )}
                  >
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "mb-4 inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                          s.badgeClass,
                        )}
                      >
                        {s.badge}
                      </span>

                      <h3 className="font-display text-2xl tracking-tight text-white md:text-3xl">
                        {s.title}{" "}
                        <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", s.accentClass)}>
                          {s.accent}
                        </span>
                      </h3>

                      <p className="mt-3.5 max-w-[52ch] text-[15px] leading-relaxed text-white/62">{s.body}</p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-medium text-white/70"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* En las anchas el mecanismo va al costado; en las angostas
                        `mt-auto` lo clava abajo para que las dos de la fila
                        terminen a la misma altura. */}
                    <div className={cn(wide ? "mt-8 md:mt-0" : "mt-auto pt-8")}>
                      {s.visual === "checkout" ? (
                        <CheckoutVisual reducedMotion={reducedMotion} />
                      ) : (
                        <ServiceVisual variant={s.visual} reducedMotion={reducedMotion} />
                      )}
                    </div>
                  </div>
                </SpotlightFeatureCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

export default DisenoWebServicios
