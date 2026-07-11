"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/** D3 v7 UMD expone `window.d3`. CDN evita `import "d3"` en el bundle (no hace falta `npm install d3`). */
const D3_SCRIPT_ID = "d3-v7-cdn"
const D3_SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"

let d3LoadPromise: Promise<D3Global> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- API expuesta por UMD `window.d3`
type D3Global = any

function getD3(): D3Global | undefined {
  if (typeof window === "undefined") return undefined
  return (window as unknown as { d3?: D3Global }).d3
}

function loadD3(): Promise<D3Global> {
  const cached = getD3()
  if (cached) return Promise.resolve(cached)

  if (!d3LoadPromise) {
    d3LoadPromise = new Promise((resolve, reject) => {
      const resolveIfReady = () => {
        const d3 = getD3()
        if (d3) {
          resolve(d3)
          return true
        }
        return false
      }

      if (resolveIfReady()) return

      if (document.getElementById(D3_SCRIPT_ID)) {
        const interval = window.setInterval(() => {
          if (resolveIfReady()) window.clearInterval(interval)
        }, 40)
        window.setTimeout(() => {
          window.clearInterval(interval)
          if (!resolveIfReady()) reject(new Error("d3 timeout"))
        }, 20000)
        return
      }

      const script = document.createElement("script")
      script.id = D3_SCRIPT_ID
      script.src = D3_SCRIPT_SRC
      script.async = true
      script.crossOrigin = "anonymous"
      script.onload = () => {
        if (!resolveIfReady()) reject(new Error("window.d3 ausente"))
      }
      script.onerror = () => reject(new Error("CDN d3"))
      document.head.appendChild(script)
    })
  }

  return d3LoadPromise
}

type GeoFeature = {
  type: "Feature"
  geometry: {
    type: string
    coordinates: unknown
  } | null
  properties?: Record<string, unknown>
}

type GeoFeatureCollection = {
  type: "FeatureCollection"
  features: GeoFeature[]
}

interface RotatingEarthProps {
  width?: number
  height?: number
  /** Tema claro u oscuro para meridianos / contraste. */
  variant?: "light" | "dark"
  /** Color del océano del globo (debe coincidir con el fondo de la página para integrarse). */
  surfaceColor?: string
  className?: string
}

const DEFAULT_PAGE_BG = "#f0f0ee"

export default function RotatingEarth({
  width = 800,
  height = 520,
  variant = "light",
  surfaceColor = DEFAULT_PAGE_BG,
  className = "",
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    let rotationTimer: { stop: () => void } | undefined
    let canvasEl: HTMLCanvasElement | null = null
    let onMouseDown: ((e: MouseEvent) => void) | undefined
    let onWheel: ((e: WheelEvent) => void) | undefined

    void (async () => {
      const d3 = await loadD3()
      if (cancelled || !canvasRef.current) return

      const canvas = canvasRef.current
      canvasEl = canvas
      const context = canvas.getContext("2d")
      if (!context) return

      const containerWidth = Math.min(width, window.innerWidth - 48)
      const containerHeight = Math.min(height, Math.round(height * 0.85))
      const radius = Math.min(containerWidth, containerHeight) / 2.45

      const dpr = window.devicePixelRatio || 1
      canvas.width = containerWidth * dpr
      canvas.height = containerHeight * dpr
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`
      context.scale(dpr, dpr)

      const projection = d3
        .geoOrthographic()
        .scale(radius)
        .translate([containerWidth / 2, containerHeight / 2])
        .clipAngle(90)

      const path = d3.geoPath().projection(projection).context(context)

      const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
        const [x, y] = point
        let inside = false

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const [xi, yi] = polygon[i] ?? [0, 0]
          const [xj, yj] = polygon[j] ?? [0, 0]

          if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
            inside = !inside
          }
        }

        return inside
      }

      const pointInFeature = (point: [number, number], feature: GeoFeature): boolean => {
        const geometry = feature.geometry
        if (!geometry) return false

        if (geometry.type === "Polygon") {
          const coordinates = geometry.coordinates as number[][][]
          const outer = coordinates[0]
          if (!outer || !pointInPolygon(point, outer)) return false
          for (let i = 1; i < coordinates.length; i++) {
            const ring = coordinates[i]
            if (ring && pointInPolygon(point, ring)) return false
          }
          return true
        }

        if (geometry.type === "MultiPolygon") {
          for (const polygon of geometry.coordinates as number[][][][]) {
            const outer = polygon[0]
            if (outer && pointInPolygon(point, outer)) {
              let inHole = false
              for (let i = 1; i < polygon.length; i++) {
                const ring = polygon[i]
                if (ring && pointInPolygon(point, ring)) {
                  inHole = true
                  break
                }
              }
              if (!inHole) return true
            }
          }
          return false
        }

        return false
      }

      const generateDotsInPolygon = (feature: GeoFeature, dotSpacing = 16) => {
        const dots: [number, number][] = []
        const bounds = d3.geoBounds(feature)
        const [[minLng, minLat], [maxLng, maxLat]] = bounds

        const stepSize = dotSpacing * 0.08

        for (let lng = minLng; lng <= maxLng; lng += stepSize) {
          for (let lat = minLat; lat <= maxLat; lat += stepSize) {
            const point: [number, number] = [lng, lat]
            if (pointInFeature(point, feature)) {
              dots.push(point)
            }
          }
        }

        return dots
      }

      interface DotData {
        lng: number
        lat: number
      }

      const allDots: DotData[] = []
      let landFeatures: GeoFeatureCollection | null = null

      const isLight = variant === "light"

      const render = () => {
        context.clearRect(0, 0, containerWidth, containerHeight)

        const currentScale = projection.scale()
        const scaleFactor = currentScale / radius

        context.beginPath()
        context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
        context.fillStyle = isLight ? surfaceColor : "#0a0a0a"
        context.fill()
        context.strokeStyle = isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.35)"
        context.lineWidth = 2 * scaleFactor
        context.stroke()

        if (landFeatures) {
          const graticule = d3.geoGraticule()
          context.beginPath()
          path(graticule())
          context.strokeStyle = isLight ? "rgba(15,23,42,0.14)" : "rgba(255,255,255,0.2)"
          context.lineWidth = 1 * scaleFactor
          context.globalAlpha = isLight ? 0.55 : 0.35
          context.stroke()
          context.globalAlpha = 1

          context.beginPath()
          landFeatures.features.forEach((feature: GeoFeature) => {
            path(feature)
          })
          context.strokeStyle = isLight ? "rgba(15,23,42,0.28)" : "rgba(255,255,255,0.45)"
          context.lineWidth = 1 * scaleFactor
          context.stroke()

          allDots.forEach((dot) => {
            const projected = projection([dot.lng, dot.lat])
            if (
              projected &&
              projected[0] >= 0 &&
              projected[0] <= containerWidth &&
              projected[1] >= 0 &&
              projected[1] <= containerHeight
            ) {
              context.beginPath()
              context.arc(projected[0], projected[1], 1.15 * scaleFactor, 0, 2 * Math.PI)
              context.fillStyle = isLight ? "#94a3b8" : "#9ca3af"
              context.fill()
            }
          })
        }
      }

      const loadWorldData = async () => {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
          )
          if (!response.ok) throw new Error("Failed to load land data")

          landFeatures = (await response.json()) as GeoFeatureCollection

          landFeatures.features.forEach((feature) => {
            const dots = generateDotsInPolygon(feature, 16)
            dots.forEach(([lng, lat]) => {
              allDots.push({ lng, lat })
            })
          })

          render()
        } catch {
          /* GeoJSON falló */
        }
      }

      const rotation: [number, number] = [0, 0]
      let autoRotate = true
      const rotationSpeed = 0.45

      const rotate = () => {
        if (autoRotate) {
          rotation[0] += rotationSpeed
          projection.rotate(rotation)
          render()
        }
      }

      rotationTimer = d3.timer(rotate)

      onMouseDown = (event: MouseEvent) => {
        autoRotate = false
        const startX = event.clientX
        const startY = event.clientY
        const startRotation: [number, number] = [...rotation]

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const sensitivity = 0.5
          const dx = moveEvent.clientX - startX
          const dy = moveEvent.clientY - startY

          rotation[0] = startRotation[0] + dx * sensitivity
          rotation[1] = startRotation[1] - dy * sensitivity
          rotation[1] = Math.max(-90, Math.min(90, rotation[1]))

          projection.rotate(rotation)
          render()
        }

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)

          setTimeout(() => {
            autoRotate = true
          }, 10)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      }

      onWheel = (event: WheelEvent) => {
        event.preventDefault()
        const zoom = event.deltaY > 0 ? 0.92 : 1.08
        const newRadius = Math.max(radius * 0.45, Math.min(radius * 3.2, projection.scale() * zoom))
        projection.scale(newRadius)
        render()
      }

      canvas.addEventListener("mousedown", onMouseDown)
      canvas.addEventListener("wheel", onWheel, { passive: false })

      await loadWorldData()
    })().catch(() => {
      /* CDN bloqueado o sin red */
    })

    return () => {
      cancelled = true
      rotationTimer?.stop()
      if (canvasEl && onMouseDown && onWheel) {
        canvasEl.removeEventListener("mousedown", onMouseDown)
        canvasEl.removeEventListener("wheel", onWheel)
      }
    }
  }, [width, height, variant, surfaceColor])

  return (
    <div className={cn("relative w-full overflow-hidden rounded-3xl", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "block h-auto w-full rounded-3xl",
          variant === "light" ? "bg-transparent" : "bg-neutral-950",
        )}
      />
    </div>
  )
}
