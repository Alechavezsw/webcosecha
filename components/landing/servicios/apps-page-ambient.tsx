"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"

/**
 * Fondo ambiental de /servicios/apps.
 *
 * La página venía resuelta con negro plano: las secciones se apoyaban unas
 * sobre otras sin ninguna señal de profundidad y los tramos largos de texto
 * quedaban flotando en el vacío. Este componente arma el «cuarto» donde vive
 * la página, respetando su sistema (tinta casi negra, líneas de 1px, un único
 * acento ácido) en vez de sumar el degradado violeta/cian del resto del sitio.
 *
 * Va montado una sola vez, `fixed`, detrás de todo el contenido. Los hijos
 * posicionados que vienen después en el DOM pintan encima sin necesidad de
 * z-index, por eso acá alcanza con `z-0`.
 */

const LINE = "#1E1E24"
const ACID = "#C8FF00"

/** Lado del mosaico de la grilla en px: el bucle traslada exactamente esto. */
const TILE = 68

/** Trama de grilla usada por el piso y el techo en perspectiva. */
const gridPaint = {
  backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
  backgroundSize: `${TILE}px ${TILE}px`,
} as const

export function AppsPageAmbient({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { scrollYProgress } = useScroll()
  /** Suavizado: sin esto los blooms saltan con el scroll por rueda. */
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 })

  // Los dos halos recorren la ventana en sentidos opuestos: el fondo cambia a
  // lo largo de la página sin que aparezca nunca un color saturado.
  const acidY = useTransform(progress, [0, 1], ["-18%", "42%"])
  const acidX = useTransform(progress, [0, 1], ["12%", "-16%"])
  const coldY = useTransform(progress, [0, 1], ["46%", "-12%"])
  const acidOpacity = useTransform(progress, [0, 0.35, 0.75, 1], [0.55, 1, 0.85, 0.5])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base: el negro deja de ser un color plano y gana un centro apenas más alto. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 50% -12%, #0D0E12 0%, #08080B 46%, #050506 78%)",
        }}
      />

      {/* Piso en perspectiva: es lo que le da suelo a la página. */}
      <div className="absolute inset-x-0 bottom-0 h-[58vh] [perspective:520px] [perspective-origin:50%_0%]">
        <div className="absolute inset-x-[-60%] bottom-0 top-0 origin-bottom [transform:rotateX(74deg)]">
          <motion.div
            className="absolute inset-x-0 -top-[200%] bottom-0"
            style={gridPaint}
            {...(reducedMotion
              ? {}
              : {
                  animate: { y: [0, TILE] },
                  transition: { duration: 5.5, ease: "linear", repeat: Infinity },
                })}
          />
        </div>
        {/* Desvanece la grilla hacia el horizonte en lugar de cortarla. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,6,0) 0%, rgba(5,5,6,0.55) 46%, #050506 88%)",
          }}
        />
      </div>

      {/* Techo: la misma grilla espejada, mucho más tenue. Cierra el volumen. */}
      <div className="absolute inset-x-0 top-0 h-[34vh] opacity-[0.55] [perspective:520px] [perspective-origin:50%_100%]">
        <div className="absolute inset-x-[-60%] bottom-0 top-0 origin-top [transform:rotateX(-74deg)]" style={gridPaint} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,6,0) 0%, rgba(5,5,6,0.6) 42%, #050506 86%)",
          }}
        />
      </div>

      {/* Halo ácido: única fuente de color, siempre por debajo de 0.1 de alfa
          para que el texto blanco conserve el contraste. */}
      {/* Sin `blur`: filtrar un elemento de 70vw × 70vh obliga al compositor a
          rasterizar esa capa entera en cada cuadro de scroll. El degradado ya
          es suave por sí solo. */}
      <motion.div
        className="absolute h-[70vh] w-[70vw]"
        style={{
          top: acidY,
          right: acidX,
          opacity: reducedMotion ? 0.8 : acidOpacity,
          background: `radial-gradient(closest-side, rgba(200,255,0,0.085), rgba(200,255,0,0.03) 45%, transparent 72%)`,
        }}
      />
      {/* Halo frío: separa el fondo del negro puro sin competir con el ácido. */}
      <motion.div
        className="absolute -left-[18%] h-[64vh] w-[62vw]"
        style={{
          top: coldY,
          background:
            "radial-gradient(closest-side, rgba(96,124,160,0.10), rgba(96,124,160,0.035) 48%, transparent 74%)",
        }}
      />

      {/* Rieles verticales alineados a la grilla de contenido: la página se lee
          como una hoja técnica y no como un scroll infinito de texto. */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2 px-5 sm:px-6 lg:px-10">
        <div className="relative h-full">
          {[0, 25, 50, 75, 100].map((left) => (
            <span
              key={left}
              className="absolute inset-y-0 w-px"
              style={{
                left: `${left}%`,
                background: `linear-gradient(to bottom, transparent, ${LINE} 12%, ${LINE} 88%, transparent)`,
                opacity: left === 0 || left === 100 ? 0.7 : 0.34,
              }}
            />
          ))}
        </div>
      </div>

      {/* Líneas de barrido: textura de monitor, casi imperceptible. */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Viñeta: empuja la mirada al centro y esconde los bordes de los halos. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 42%, rgba(5,5,6,0.55) 100%)",
        }}
      />
      <span className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: ACID, opacity: 0.12 }} />
    </div>
  )
}

export default AppsPageAmbient
