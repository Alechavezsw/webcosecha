"use client"

import Image from "next/image"
import React from "react"
import { motion } from "framer-motion"
import { useShortcuts, clamp } from "@/hooks/use-shortcut"
import {
  WEBDIS_GALLERY_IMAGES,
  WEBDIS_IMAGE_FALLBACK,
} from "@/components/landing/servicios/webdis-gallery-images"
import { cn } from "@/lib/utils"

const IMAGES = [...WEBDIS_GALLERY_IMAGES]

function WebdisCoverImg({
  initialSrc,
  className,
  alt = "",
}: {
  initialSrc: string
  className?: string
  alt?: string
}) {
  const [src, setSrc] = React.useState(initialSrc)
  React.useEffect(() => {
    setSrc(initialSrc)
  }, [initialSrc])
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fallback por archivo ausente
    <img
      alt={alt}
      src={src}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setSrc(WEBDIS_IMAGE_FALLBACK)}
    />
  )
}

const FRAME_OFFSET = -30
const FRAMES_VISIBLE_LENGTH = 3
const SCROLL_THRESHOLD = 40
const BUFFER_SIZE = 8

function WebdisTimeMachine() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollAccumulator = React.useRef(0)
  const lastUpdateTime = React.useRef(Date.now())
  const touchStartY = React.useRef(0)

  const getVisibleCards = React.useCallback(() => {
    const start = currentIndex - BUFFER_SIZE
    const end = currentIndex + FRAMES_VISIBLE_LENGTH + BUFFER_SIZE
    const cards = []

    for (let i = start; i <= end; i++) {
      cards.push({
        index: i,
        imageIndex: ((i % IMAGES.length) + IMAGES.length) % IMAGES.length,
      })
    }

    return cards
  }, [currentIndex])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const MIN_UPDATE_INTERVAL = 75

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrollAccumulator.current += e.deltaY

      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime.current

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
          const delta = scrollAccumulator.current > 0 ? 1 : -1
          setCurrentIndex((prev) => prev + delta)
          scrollAccumulator.current = 0
          lastUpdateTime.current = now
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY.current - touchY
      touchStartY.current = touchY

      scrollAccumulator.current += deltaY

      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime.current

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
          const delta = scrollAccumulator.current > 0 ? 1 : -1
          setCurrentIndex((prev) => prev + delta)
          scrollAccumulator.current = 0
          lastUpdateTime.current = now
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    })
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    })

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  const shortcuts = React.useMemo(
    () => ({
      ArrowRight: () => setCurrentIndex((prev) => prev + 1),
      ArrowLeft: () => setCurrentIndex((prev) => prev - 1),
    }),
    [],
  )

  useShortcuts(shortcuts)

  const visibleCards = getVisibleCards()

  return (
    <div
      ref={containerRef}
      className="relative flex h-[min(560px,78vh)] w-full items-center justify-center overflow-hidden md:h-[min(620px,82vh)]"
      role="region"
      aria-label="Galería de proyectos web: desplazá con la rueda o las flechas"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {visibleCards.map((card) => {
          const offsetIndex = card.index - currentIndex
          const blur = currentIndex > card.index ? 2 : 0
          const opacity = currentIndex > card.index ? 0 : 1
          const scale = clamp(1 - offsetIndex * 0.08, [0.08, 2])
          const y = clamp(offsetIndex * FRAME_OFFSET, [
            FRAME_OFFSET * FRAMES_VISIBLE_LENGTH,
            Number.POSITIVE_INFINITY,
          ])

          const src = IMAGES[card.imageIndex]
          const image = (
            <WebdisCoverImg initialSrc={src} className="h-full w-full object-cover" alt="" />
          )

          return (
            <motion.div
              key={card.index}
              className="absolute aspect-[16/9] w-[85%] max-w-[800px] overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10"
              initial={false}
              animate={{
                y,
                scale,
                transition: {
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  mass: 0.5,
                },
              }}
              style={{
                willChange: "opacity, filter, transform",
                filter: `blur(${blur}px)`,
                opacity,
                transitionProperty: "opacity, filter",
                transitionDuration: "200ms",
                transitionTimingFunction: "ease-in-out",
                zIndex: 1000 - card.index,
              }}
            >
              {image}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function WebdisGalleryStatic() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {IMAGES.map((src, i) => (
        <li
          key={src}
          className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.1] bg-zinc-900/40 shadow-lg"
        >
          <WebdisStaticThumb src={src} alt={`Proyecto web ${i + 1}`} />
        </li>
      ))}
    </ul>
  )
}

function WebdisStaticThumb({ src, alt }: { src: string; alt: string }) {
  const [effective, setEffective] = React.useState(src)
  return (
    <Image
      src={effective}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      unoptimized={effective === WEBDIS_IMAGE_FALLBACK}
      onError={() => setEffective(WEBDIS_IMAGE_FALLBACK)}
    />
  )
}

export function PortfolioWebdisGallery({
  prefersReducedMotion,
  className,
}: {
  prefersReducedMotion: boolean | null
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/[0.08] bg-[#050508] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      <div className="p-4 md:p-6">
        {prefersReducedMotion ? <WebdisGalleryStatic /> : <WebdisTimeMachine />}
      </div>
    </div>
  )
}
