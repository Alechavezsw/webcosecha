"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTitle, DialogPortal } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { EventGalleryModalConfig } from "./types"

type EventGalleryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: EventGalleryModalConfig
}

export function EventGalleryModal({ open, onOpenChange, config }: EventGalleryModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const n = config.images.length

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goPrevLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + n) % n))
  }, [n])

  const goNextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % n))
  }, [n])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") goPrevLightbox()
      if (e.key === "ArrowRight") goNextLightbox()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxIndex, closeLightbox, goPrevLightbox, goNextLightbox])

  useEffect(() => {
    if (lightboxIndex === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [lightboxIndex])

  useEffect(() => {
    if (!open) setLightboxIndex(null)
  }, [open])

  const lightboxSrc = lightboxIndex !== null ? config.images[lightboxIndex] : null



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[96dvh] w-[min(98vw,92rem)] max-w-none flex-col gap-0 overflow-hidden overflow-y-auto",
          "min-h-[min(72dvh,760px)] border border-white/10 bg-background p-0 shadow-[0_32px_120px_-28px_rgba(0,0,0,0.75)]",
          "sm:rounded-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
        )}
      >
        <DialogTitle className="sr-only">
          {config.headlineParts.filter(Boolean).join(" _ ")}
        </DialogTitle>

        <header className="relative shrink-0 overflow-hidden border-b border-white/10 bg-gradient-to-br from-background via-muted/25 to-background px-6 py-7 sm:px-10 sm:py-9">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(236,168,214,0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(255,255,255,0.04), transparent 50%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-10 bg-[#eca8d6]/45" aria-hidden />
              Galería del proyecto
              <span className="h-px w-10 bg-[#eca8d6]/45" aria-hidden />
            </span>
            <p className="font-display text-base font-semibold uppercase leading-snug tracking-[0.08em] text-foreground sm:text-lg md:text-xl">
              {config.headlineParts.filter(Boolean).map((part, index) => (
                <span key={part}>
                  {index > 0 && <span className="text-[#eca8d6]/70"> _ </span>}
                  <span className="text-foreground">{part}</span>
                </span>
              ))}
            </p>
            <p className="max-w-xl text-sm text-muted-foreground">
              {config.tagline ??
                "Piezas gráficas del proyecto: redes, piezas digitales y aplicaciones en marca."}
            </p>
          </div>
        </header>

        <div className="relative flex min-h-[min(52vh,560px)] flex-1 flex-col bg-gradient-to-b from-black/[0.22] to-background px-4 pb-8 pt-5 sm:px-8 md:min-h-[min(56vh,620px)] md:px-12 md:pb-10 md:pt-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/25 to-transparent" aria-hidden />

          <Carousel opts={{ align: "start", loop: true, slidesToScroll: 1 }} className="flex min-h-0 flex-1 flex-col">
            <CarouselContent className="-ml-3 md:-ml-4">
              {config.images.map((src, i) => (
                <CarouselItem
                  key={`${src}-${i}`}
                  className="basis-full pl-3 sm:basis-1/2 md:pl-4 lg:basis-1/2 xl:basis-1/3"
                >
                  <button
                    type="button"
                    className={cn(
                      "group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-muted/15 text-left",
                      "shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)]",
                      "ring-1 ring-[#eca8d6]/[0.12] transition-all duration-300",
                      "cursor-zoom-in hover:border-[#eca8d6]/35 hover:ring-[#eca8d6]/25",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eca8d6]/50",
                    )}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:aspect-[3/2] sm:max-h-[min(52vh,520px)] lg:max-h-[min(58vh,580px)]"
                      loading="lazy"
                    />
                    <span
                      className="pointer-events-none absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                      aria-hidden
                    >
                      <ZoomIn className="size-4" />
                    </span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                "left-1 border-[#eca8d6]/30 bg-background/95 text-foreground shadow-lg backdrop-blur-sm",
                "hover:border-[#eca8d6]/50 hover:bg-[#eca8d6]/10 md:left-3",
              )}
            />
            <CarouselNext
              className={cn(
                "right-1 border-[#eca8d6]/30 bg-background/95 text-foreground shadow-lg backdrop-blur-sm",
                "hover:border-[#eca8d6]/50 hover:bg-[#eca8d6]/10 md:right-3",
              )}
            />
          </Carousel>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Tocá o hacé clic en una imagen para verla en grande.
          </p>
        </div>
      </DialogContent>

      {/* Full-screen lightbox rendered inside DialogPortal to prevent parent transform clipping */}
      {lightboxSrc !== null && (
        <DialogPortal>
          <div
            className="fixed inset-0 z-[600] flex flex-col bg-black/98 backdrop-blur-sm animate-in fade-in duration-200"
            role="presentation"
            onClick={closeLightbox}
            style={{ pointerEvents: "auto" }}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="truncate font-mono text-xs uppercase tracking-widest text-white/50">
                {lightboxIndex !== null ? `${lightboxIndex + 1} / ${n}` : ""}
              </p>
              <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Cerrar vista ampliada"
              >
                <X className="size-5" />
              </button>
            </div>

            <button
              type="button"
              aria-label="Foto anterior"
              className="absolute left-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation()
                goPrevLightbox()
              }}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              className="absolute right-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation()
                goNextLightbox()
              }}
            >
              <ChevronRight className="size-6" />
            </button>

            <div
              className="flex min-h-0 flex-1 items-center justify-center p-6 sm:p-12"
              onClick={closeLightbox}
            >
              <img
                src={lightboxSrc}
                alt=""
                className="max-h-[82dvh] max-w-[min(96vw,100%)] object-contain shadow-2xl rounded-xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <p
              className="pointer-events-none pb-6 text-center text-xs text-white/40"
              onClick={(e) => e.stopPropagation()}
            >
              Clic fuera de la imagen para cerrar · ← → para navegar
            </p>
          </div>
        </DialogPortal>
      )}
    </Dialog>
  )
}
