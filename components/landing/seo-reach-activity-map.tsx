"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const easePremium = [0.22, 1, 0.36, 1] as const

const sectionEnterTight = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px", amount: 0.22 },
  transition: { duration: 0.95, ease: easePremium },
} as const

/**
 * Visualización tipo “mapa de actividad” (SVG ei7skHIgl1w / map-dark.svg)
 * con pulso cc-reach-glimmer definido en `app/globals.css`.
 */
export function SeoReachActivityMap() {
  const [svgHtml, setSvgHtml] = useState("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/map-dark.svg")
        const text = await res.text()
        if (!cancelled) setSvgHtml(text)
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!svgHtml) return
    const id = window.setTimeout(() => {
      const root = document.getElementById("seo-reach-map-root")
      if (!root) return
      const rects = root.querySelectorAll("svg rect")
      /** Miles de rects animados = jank; animamos 1 de cada 4 para el mismo efecto visual. */
      rects.forEach((rect, index) => {
        if (index % 4 !== 0) return
        const duration = (index % 11) * 0.07 + 0.52
        const delay = (index % 9) * 0.08
        rect.setAttribute(
          "style",
          `animation: cc-reach-glimmer ${duration}s ease-in-out ${delay}s infinite alternate;`,
        )
      })
    }, 100)
    return () => window.clearTimeout(id)
  }, [svgHtml])

  return (
    <motion.section
      className="relative overflow-hidden border-t border-white/10 bg-black py-16 md:py-20 lg:py-28"
      {...sectionEnterTight}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_88%_58%_at_50%_0%,rgba(103,232,249,0.12)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(167,139,250,0.1)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_42%_38%_at_8%_92%,rgba(236,168,214,0.09)_0%,transparent_52%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(103,232,249,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 92%)",
        }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-8 max-w-3xl md:mb-10">
          <span className="mb-4 inline-flex items-center gap-3 font-mono text-sm text-white/50">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/35" />
            VISIBILIDAD · DATOS
          </span>
          <p className="text-lg text-white/55">
            Cada punto pulsa como las impresiones y consultas que analizamos en Search Console: ritmo, intensidad y
            oportunidades — siempre con foco en negocio.
          </p>
        </div>

        <div
          id="seo-reach-map-root"
          className="relative mx-auto flex max-h-[min(72vh,680px)] w-full max-w-[920px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/12 bg-black/60 shadow-[0_40px_100px_-48px_rgba(103,232,249,0.15)] ring-1 ring-white/[0.06]"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#eca8d6]/[0.07] via-transparent to-[#67e8f9]/[0.06]"
            aria-hidden
          />
          <div
            className="relative max-h-[min(72vh,680px)] w-full overflow-hidden [&_svg]:max-h-[min(72vh,680px)] [&_svg]:w-full [&_svg]:object-contain"
            style={{
              filter:
                "drop-shadow(0 0 28px rgba(103,232,249,0.12)) drop-shadow(0 0 42px rgba(236,168,214,0.08))",
            }}
          >
            {svgHtml ? (
              <div className="flex items-center justify-center p-4 md:p-6" dangerouslySetInnerHTML={{ __html: svgHtml }} />
            ) : (
              <div
                className="flex aspect-[1138/640] w-full animate-pulse items-center justify-center bg-zinc-900/80"
                aria-hidden
              >
                <span className="font-mono text-sm text-white/25">Cargando visualización…</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
