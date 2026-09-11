"use client"

import { useEffect, useRef } from "react"

/**
 * Red de partículas del hero: nodos que flotan, se enlazan cuando se acercan y
 * mandan un punto de datos por los enlaces «calientes».
 *
 * Portado del diseño original con dos cambios: la paleta pasa al cian/violeta
 * de la marca —el original era azul eléctrico y verde— y respeta
 * `prefers-reduced-motion` dibujando **un solo cuadro** en vez de no dibujar
 * nada: quien pidió menos movimiento igual ve la textura, quieta.
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
  pulseOffset: number
  type: "node" | "relay" | "hub"
}

const CYAN = "103,232,249"
const VIOLET = "167,139,250"
const WHITE = "242,237,230"

export function JarvisParticleCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let animId = 0
    let W = 0
    let H = 0
    let particles: Particle[] = []

    const init = () => {
      // La densidad sigue al área: en un hero de móvil no tiene sentido dibujar
      // los mismos cientos de nodos que en uno de escritorio.
      const COUNT = Math.max(28, Math.min(120, Math.floor((W * H) / 5200)))
      particles = Array.from({ length: COUNT }, () => {
        const roll = Math.random()
        const type: Particle["type"] = roll < 0.08 ? "hub" : roll < 0.28 ? "relay" : "node"
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * (type === "hub" ? 0.15 : 0.4),
          vy: (Math.random() - 0.5) * (type === "hub" ? 0.15 : 0.4),
          radius: type === "hub" ? 6 : type === "relay" ? 4 : 2.5,
          baseAlpha: type === "hub" ? 0.95 : type === "relay" ? 0.8 : 0.55 + Math.random() * 0.35,
          pulseOffset: Math.random() * Math.PI * 2,
          type,
        }
      })
    }

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (W === 0 || H === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr
      canvas.height = H * dpr
      // `setTransform` en vez de `scale`: `scale` se acumula en cada resize y a
      // la tercera vuelta el dibujo sale gigante.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init()
      if (reduced) frame(false)
    }

    let t = 0

    const frame = (animate = true) => {
      ctx.clearRect(0, 0, W, H)
      if (animate) t += 0.014

      /* ── ENLACES ── */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const MAX = a.type === "hub" || b.type === "hub" ? 220 : 140

          if (dist < MAX) {
            const t01 = 1 - dist / MAX
            const hot = a.type !== "node" || b.type !== "node"

            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = hot ? `rgba(${CYAN},${t01 * 0.5})` : `rgba(120,120,130,${t01 * 0.16})`
            ctx.lineWidth = hot ? 1 : 0.5
            ctx.stroke()

            /* Punto de datos viajando por los enlaces calientes. */
            if (animate && hot && dist < MAX * 0.8) {
              const phase = (t * 0.6 + i * 0.37 + j * 0.19) % 1
              ctx.beginPath()
              ctx.arc(a.x + (b.x - a.x) * phase, a.y + (b.y - a.y) * phase, 2, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(${CYAN},0.9)`
              ctx.fill()
            }
          }
        }
      }

      /* ── NODOS ── */
      for (const p of particles) {
        if (animate) {
          p.x += p.vx
          if (p.x < -10) p.x = W + 10
          if (p.x > W + 10) p.x = -10
          p.y += p.vy
          if (p.y < -10) p.y = H + 10
          if (p.y > H + 10) p.y = -10
        }

        const pulse = animate ? 0.72 + 0.28 * Math.sin(t * 1.6 + p.pulseOffset) : 0.85
        const r = p.radius * pulse
        const alpha = p.baseAlpha * pulse

        if (p.type === "hub") {
          const grd = ctx.createRadialGradient(p.x, p.y, r, p.x, p.y, r + 18)
          grd.addColorStop(0, `rgba(${CYAN},0.32)`)
          grd.addColorStop(1, `rgba(${CYAN},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, r + 18, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()

          ctx.beginPath()
          ctx.arc(p.x, p.y, r + 7, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${CYAN},${alpha * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${WHITE},${alpha})`
          ctx.fill()
        } else if (p.type === "relay") {
          ctx.beginPath()
          ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${CYAN},${alpha * 0.45})`
          ctx.lineWidth = 0.9
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${CYAN},${alpha})`
          ctx.fill()
        } else {
          // Una minoría en violeta: el segundo tono de la marca, para que la
          // nube no sea monocroma.
          const isViolet = Math.sin(p.pulseOffset * 3.7) > 0.65
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = isViolet ? `rgba(${VIOLET},${alpha})` : `rgba(${CYAN},${alpha})`
          ctx.fill()
        }
      }

      if (animate) animId = requestAnimationFrame(() => frame(true))
    }

    resize()
    if (!reduced) frame(true)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} style={{ display: "block", width: "100%", height: "100%" }} />
}

export default JarvisParticleCanvas
