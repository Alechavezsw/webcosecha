"use client"

import { motion } from "framer-motion"
import { ChevronRight, ExternalLink, FileText, Images } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { GallerySlide } from "./types"
import { EventGalleryModal } from "./event-gallery-modal"
import { PdfViewerDialog } from "./pdf-viewer-dialog"

interface SlideCardProps {
  slide: GallerySlide
  isActive: boolean
  dragOffset: number
  index: number
  currentIndex: number
  slideColors?: string[]
}

export function SlideCard({ slide, isActive, dragOffset, index, currentIndex, slideColors }: SlideCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [eventGalleryOpen, setEventGalleryOpen] = useState(false)
  const distance = index - currentIndex
  const parallaxOffset = dragOffset * (0.1 * (distance + 1))

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{
        x: parallaxOffset,
        perspective: 1000,
      }}
      animate={{
        scale: isActive ? 1 : 0.82,
        opacity: isActive ? 1 : 0.45,
        rotateY: -distance * 8,
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="group relative overflow-hidden rounded-2xl"
        animate={{
          y: isHovered && isActive ? -12 : 0,
          boxShadow: isActive
            ? (isHovered
                ? `0 35px 70px -15px ${slideColors?.[0] || "rgba(0,0,0,0.8)"}99, 0 0 40px -5px ${slideColors?.[0] || "rgba(255,255,255,0.2)"}33`
                : `0 25px 50px -12px ${slideColors?.[0] || "rgba(0,0,0,0.6)"}66, 0 0 25px -10px ${slideColors?.[0] || "rgba(255,255,255,0.1)"}22`)
            : "0 15px 30px -10px rgba(0,0,0,0.5)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl border transition-all duration-500 z-10 pointer-events-none"
          style={{
            borderColor: isActive
              ? (isHovered ? `${slideColors?.[0] || "#ffffff"}88` : `${slideColors?.[0] || "rgba(255,255,255,0.15)"}33`)
              : "rgba(255,255,255,0.06)",
            background: isActive
              ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.0) 100%)"
              : "rgba(255,255,255,0.01)",
          }}
        />

        <div className="relative h-[400px] w-[400px] overflow-hidden rounded-2xl p-3 md:h-[500px] md:w-[500px]">
          <motion.img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full rounded-xl object-cover"
            animate={{
              scale: isHovered && isActive ? 1.05 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            crossOrigin="anonymous"
            draggable={false}
          />

          {slide.eventGallery ? (
            <>
              <div
                className="pointer-events-none absolute inset-3 rounded-xl bg-gradient-to-b from-black/50 via-black/20 to-black/70"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-3 rounded-xl bg-[radial-gradient(ellipse_95%_75%_at_50%_100%,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.35)_52%,transparent_72%)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-3 rounded-xl shadow-[inset_0_0_100px_rgba(0,0,0,0.55),inset_0_-40px_80px_rgba(236,168,214,0.08)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-3 rounded-xl ring-1 ring-inset ring-white/20"
                aria-hidden
              />
            </>
          ) : null}

          <motion.div
            className={cn(
              "absolute inset-x-3 bottom-3 rounded-b-xl bg-gradient-to-t to-transparent",
              slide.eventGallery
                ? "from-black/[0.94] via-black/78 via-[38%] to-transparent"
                : "from-black/80 via-black/40",
            )}
            initial={{ opacity: 0, height: "30%" }}
            animate={{
              opacity: isActive ? 1 : 0,
              height: isHovered ? (slide.eventGallery ? "58%" : "50%") : slide.eventGallery ? "42%" : "30%",
            }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="absolute inset-x-3 bottom-3 select-none p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : 20,
            }}
            transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
          >
            <motion.p
              className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50"
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {slide.year}
            </motion.p>
            <motion.h3
              className="font-display text-2xl font-bold text-white md:text-3xl"
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {slide.title}
            </motion.h3>
            <motion.p
              className="mt-2 text-sm text-white/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {slide.artist}
            </motion.p>

            {slide.eventGallery ? (
              <motion.button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full border bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300"
                style={{
                  borderColor: `${slideColors?.[0] || "#eca8d6"}66`,
                  boxShadow: `0 8px 25px -8px ${slideColors?.[0] || "#eca8d6"}44`,
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: slideColors?.[0] || "#eca8d6",
                  backgroundColor: `${slideColors?.[0] || "#eca8d6"}22`,
                  boxShadow: `0 12px 30px -5px ${slideColors?.[0] || "#eca8d6"}66`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 8,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                transition={{ duration: 0.25 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setEventGalleryOpen(true)
                }}
              >
                Ver galería del proyecto
                <Images className="h-4 w-4 opacity-80" aria-hidden />
              </motion.button>
            ) : null}

            {slide.pdfSrc ? (
              <motion.button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full border bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300"
                style={{
                  borderColor: `${slideColors?.[0] || "#ffffff"}55`,
                  boxShadow: `0 8px 25px -8px ${slideColors?.[0] || "#ffffff"}33`,
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: slideColors?.[0] || "#ffffff",
                  backgroundColor: `${slideColors?.[0] || "#ffffff"}15`,
                  boxShadow: `0 12px 30px -5px ${slideColors?.[0] || "#ffffff"}55`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 8,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                transition={{ duration: 0.25 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setPdfOpen(true)
                }}
              >
                Ver logofolio (PDF)
                <FileText className="h-4 w-4 opacity-80" aria-hidden />
              </motion.button>
            ) : null}

            {slide.href ? (
              <motion.a
                href={slide.href}
                {...(slide.href.startsWith("http")
                  ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
                  : {})}
                className="mt-4 inline-flex items-center gap-2 rounded-full border bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300"
                style={{
                  borderColor: `${slideColors?.[0] || "#ffffff"}55`,
                  boxShadow: `0 8px 25px -8px ${slideColors?.[0] || "#ffffff"}33`,
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: slideColors?.[0] || "#ffffff",
                  backgroundColor: `${slideColors?.[0] || "#ffffff"}15`,
                  boxShadow: `0 12px 30px -5px ${slideColors?.[0] || "#ffffff"}55`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 8,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                transition={{ duration: 0.25 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {slide.href.startsWith("http") ? "Ver sitio" : "Gestión de redes"}
                {slide.href.startsWith("http") ? (
                  <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
                ) : (
                  <ChevronRight className="h-4 w-4 opacity-80" aria-hidden />
                )}
              </motion.a>
            ) : null}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-20 left-3 right-3 h-20 overflow-hidden rounded-2xl opacity-20 blur-sm"
        style={{
          background: `linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)`,
          transform: "scaleY(-1)",
        }}
        animate={{ opacity: isActive ? 0.15 : 0.05 }}
      />

      {slide.eventGallery ? (
        <EventGalleryModal
          open={eventGalleryOpen}
          onOpenChange={setEventGalleryOpen}
          config={slide.eventGallery}
        />
      ) : null}

      {slide.pdfSrc ? (
        <PdfViewerDialog
          open={pdfOpen}
          onOpenChange={setPdfOpen}
          pdfSrc={slide.pdfSrc}
          title={`Logofolio — ${slide.title}`}
        />
      ) : null}
    </motion.div>
  )
}
