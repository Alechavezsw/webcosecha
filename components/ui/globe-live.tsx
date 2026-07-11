"use client"

import createGlobe from "cobe"
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react"

export interface LiveMarker {
  id: string
  location: [number, number]
}

export interface GlobeLiveProps {
  markers?: LiveMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: LiveMarker[] = [
  { id: "san-juan", location: [-31.54, -68.53] },
  { id: "buenos-aires", location: [-34.6, -58.38] },
  { id: "santiago", location: [-33.45, -70.67] },
  { id: "madrid", location: [40.42, -3.7] },
  { id: "miami", location: [25.76, -80.19] },
  { id: "mexico", location: [19.43, -99.13] },
]

export function GlobeLive({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeLiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [liveViewers, setLiveViewers] = useState(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((v) => Math.max(100, v + Math.floor(Math.random() * 21) - 8))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  const handlePointerDown = useCallback((e: PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: globalThis.PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId = 0
    let phi = 0

    const animate = () => {
      if (!globe) return
      if (!isPausedRef.current) phi += speed
      globe.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
      })
      animationId = requestAnimationFrame(animate)
    }

    const init = () => {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [0.95, 0.95, 0.95],
        markerColor: [0.93, 0.66, 0.84],
        glowColor: [0.92, 0.88, 0.98],
        markerElevation: 0.01,
        markers: markers.map((m) => ({ location: m.location, size: 0.025 })),
        arcs: [],
        arcColor: [0.93, 0.66, 0.84],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      })

      animate()
      window.setTimeout(() => {
        canvas.style.opacity = "1"
      }, 80)
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      cancelAnimationFrame(animationId)
      globe?.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m, i) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS anchor positioning (cobe marker anchors)
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.6rem",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: "#eca8d6",
              borderRadius: "50%",
              boxShadow: "0 0 8px #eca8d6",
              animation: "live-pulse 1.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "#eca8d6",
              textTransform: "uppercase",
            }}
          >
            LIVE
          </span>
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.7)",
              paddingLeft: "0.4rem",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {Math.floor(liveViewers * (0.3 + 0.7 * Math.pow(0.6, i))).toLocaleString("es-AR")} en línea
          </span>
        </div>
      ))}
    </div>
  )
}
