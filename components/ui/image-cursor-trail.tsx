"use client"

import { createRef, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface ImageCursorTrailProps {
  items: string[]
  children?: ReactNode
  className?: string
  imgClass?: string
  /** Mayor número = menos fotos por movimiento (umbral en px ≈ ancho ventana / distance) */
  distance?: number
  maxNumberOfImages?: number
  fadeAnimation?: boolean
}

/**
 * Rastro de imágenes que siguen el cursor dentro del contenedor.
 * Tap / clic en una foto activa la agranda; tocá de nuevo o fuera para cerrar.
 */
export function ImageCursorTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "h-48 w-40",
  distance = 20,
  fadeAnimation = false,
}: ImageCursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useMemo(() => items.map(() => createRef<HTMLImageElement | null>()), [items.length])
  const globalIndexRef = useRef(0)
  const lastRef = useRef({ x: 0, y: 0 })
  const currentZIndexRef = useRef(1)
  const fadeTimersRef = useRef<Map<HTMLImageElement, ReturnType<typeof setTimeout>>>(new Map())
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null)
  const poppedIndexRef = useRef<number | null>(null)
  poppedIndexRef.current = poppedIndex

  const n = items.length
  const threshold =
    typeof window !== "undefined" ? window.innerWidth / Math.max(distance, 1) : 48

  useEffect(() => {
    if (poppedIndex === null) return
    const handler = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !containerRef.current?.contains(t)) {
        setPoppedIndex(null)
        return
      }
      if (t.tagName !== "IMG") setPoppedIndex(null)
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [poppedIndex])

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top
    image.style.left = `${relativeX}px`
    image.style.top = `${relativeY}px`

    const idx = Number(image.dataset.index ?? -1)
    const isPopped = poppedIndexRef.current !== null && idx === poppedIndexRef.current

    if (isPopped) {
      image.style.zIndex = "100"
    } else {
      if (currentZIndexRef.current > 40) currentZIndexRef.current = 1
      image.style.zIndex = String(currentZIndexRef.current)
      currentZIndexRef.current += 1
    }

    image.dataset.status = "active"

    if (fadeAnimation) {
      const prev = fadeTimersRef.current.get(image)
      if (prev) clearTimeout(prev)
      const t = setTimeout(() => {
        image.dataset.status = "inactive"
        fadeTimersRef.current.delete(image)
      }, 1500)
      fadeTimersRef.current.set(image, t)
    }

    lastRef.current = { x, y }
  }

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive"
  }

  const distanceFromLast = (x: number, y: number) =>
    Math.hypot(x - lastRef.current.x, y - lastRef.current.y)

  const handlePointer = (clientX: number, clientY: number) => {
    if (n === 0) return
    if (distanceFromLast(clientX, clientY) <= threshold) return

    const gi = globalIndexRef.current
    const lead = imageRefs[gi % n]?.current
    const tailGi = gi - maxNumberOfImages
    const tail = tailGi >= 0 ? imageRefs[tailGi % n]?.current : undefined

    if (lead) activate(lead, clientX, clientY)
    if (tail) deactivate(tail)

    globalIndexRef.current += 1
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={(e) => handlePointer(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches[0]
        if (!t) return
        handlePointer(t.clientX, t.clientY)
      }}
      className={cn(
        "relative grid min-h-[280px] w-full touch-manipulation place-content-center overflow-hidden rounded-3xl md:min-h-[420px]",
        className,
      )}
      aria-label="Galería interactiva de capturas"
    >
      {items.map((item, index) => (
        // eslint-disable-next-line @next/next/no-img-element -- refs + posicionamiento absoluto dinámico
        <img
          key={`${item}-${index}`}
          ref={imageRefs[index]}
          className={cn(
            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 scale-0 rounded-3xl object-cover opacity-0 transition-[opacity,transform,box-shadow] duration-300 ease-out data-[status=active]:pointer-events-auto data-[status=active]:duration-500 data-[status=active]:ease-out data-[status=active]:opacity-100 data-[status=active]:scale-100",
            poppedIndex === index &&
              "!scale-[1.42] shadow-[0_28px_80px_-20px_rgba(103,232,249,0.45)] ring-2 ring-cyan-400/50 duration-300",
            imgClass,
          )}
          data-index={index}
          data-status="inactive"
          src={item}
          alt={`Captura ${index + 1}`}
          draggable={false}
          onPointerDown={(e) => {
            e.stopPropagation()
            const el = e.currentTarget
            if (el.dataset.status !== "active") return
            setPoppedIndex((prev) => (prev === index ? null : index))
          }}
        />
      ))}
      {children}
    </section>
  )
}
