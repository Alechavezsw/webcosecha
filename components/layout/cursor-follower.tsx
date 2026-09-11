"use client"

import { useEffect, useRef, useState } from "react"

/** Elementos sobre los que el cursor "engorda" y muestra que hay algo para hacer. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor]'

/**
 * Cursor de dos piezas: un punto que va exacto donde está el mouse y un anillo
 * que lo persigue con retardo. Sobre algo clickeable el anillo crece y puede
 * mostrar una etiqueta (`data-cursor="Ver proyecto"`).
 *
 * Sólo se monta con puntero fino (mouse/trackpad) y sin `prefers-reduced-motion`:
 * en touch no aporta nada y además taparía el tap.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState("")
  /** Sobre la banda de papel el blanco desaparece: ahí el cursor se pinta en tinta. */
  const [onLight, setOnLight] = useState(false)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)")
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    const decide = () => setEnabled(fine.matches && !calm.matches)

    decide()
    fine.addEventListener("change", decide)
    calm.addEventListener("change", decide)
    return () => {
      fine.removeEventListener("change", decide)
      calm.removeEventListener("change", decide)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    document.documentElement.classList.add("cc-cursor-on")

    let frame = 0
    let lastFrame = performance.now()
    let lastProbe = 0

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
      }

      // `elementFromPoint` es un hit-test contra todo el DOM: en esta home, que ya
      // va cargada, no conviene hacerlo en cada frame.
      const now = performance.now()
      if (now - lastProbe < 90) return
      lastProbe = now

      const el = document.elementFromPoint(event.clientX, event.clientY)
      const hit = el?.closest(INTERACTIVE) as HTMLElement | null
      setHovering(Boolean(hit))
      setLabel(hit?.dataset.cursor ?? "")
      setOnLight(Boolean(el?.closest(".cc-band-bone")))
    }

    const loop = () => {
      // El anillo llega siempre un poco tarde: eso es lo que le da peso. El factor
      // se corrige por delta para que el retardo se sienta igual a 60 o a 30 fps.
      const now = performance.now()
      const delta = Math.min(now - lastFrame, 64)
      lastFrame = now
      const k = 1 - Math.pow(1 - 0.2, delta / 16.67)

      ring.current.x += (target.current.x - ring.current.x) * k
      ring.current.y += (target.current.y - ring.current.y) * k
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      }
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    frame = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove("cc-cursor-on")
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="cc-cursor" aria-hidden data-on-light={onLight || undefined}>
      <div ref={dotRef} className="cc-cursor-dot" data-hidden={hovering || undefined} />
      <div
        ref={ringRef}
        className="cc-cursor-ring"
        data-active={hovering || undefined}
        data-labeled={label ? true : undefined}
      >
        {label ? <span className="cc-cursor-label">{label}</span> : null}
      </div>
    </div>
  )
}
