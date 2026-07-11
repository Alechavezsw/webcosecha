"use client"

import { useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SlideCard } from "./slide-card"
import { NavigationDots } from "./navigation-dots"
import { gallerySlides } from "./data"
import { useSliderNavigation } from "./hooks/use-slider-navigation"
import { useSliderDrag } from "./hooks/use-slider-drag"
import { useSliderWheel } from "./hooks/use-slider-wheel"
import { useColorExtraction, useCurrentColors } from "./hooks/use-color-extraction"
import { useSlideStep } from "./use-slide-step"

export function ProjectGallerySlider() {
  const rootRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const slideStep = useSlideStep()
  const galleryInView = useInView(rootRef, { amount: 0.2, margin: "0px 0px -12% 0px" })

  const { currentIndex, goToNext, goToPrev, goToSlide } = useSliderNavigation({
    totalSlides: gallerySlides.length,
    enableKeyboard: galleryInView,
    loop: true,
  })

  const { isDragging, dragX, handleDragStart, handleDragMove, handleDragEnd } = useSliderDrag({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  })

  useSliderWheel({
    sliderRef,
    onScrollLeft: goToNext,
    onScrollRight: goToPrev,
  })

  const colors = useColorExtraction(gallerySlides)
  const currentColors = useCurrentColors(colors, gallerySlides[currentIndex]?.id)

  return (
    <div ref={rootRef} className="relative h-full min-h-[560px] w-full overflow-hidden md:min-h-[640px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, ${currentColors[0]}66 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, ${currentColors[1]}66 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${currentColors[2]}44 0%, transparent 70%),
              linear-gradient(180deg, #0a0a0a 0%, #111111 100%)
            `,
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="absolute top-0 right-0 z-20 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
        >
          <span className="text-sm text-white/60">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/30">/</span>
          <span className="text-sm text-white/40">{String(gallerySlides.length).padStart(2, "0")}</span>
        </motion.div>
      </div>

      <button
        type="button"
        aria-label="Proyecto anterior"
        className="absolute left-1 top-1/2 z-30 flex -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/55 md:left-4 md:p-3"
        onClick={(e) => {
          e.stopPropagation()
          goToPrev()
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        aria-label="Proyecto siguiente"
        className="absolute right-1 top-1/2 z-30 flex -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/55 md:right-4 md:p-3"
        onClick={(e) => {
          e.stopPropagation()
          goToNext()
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        ref={sliderRef}
        className="relative flex h-full w-full cursor-grab touch-pan-x items-center active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <motion.div
          className="flex items-center gap-8 px-[calc(50vw-200px)] md:gap-16 md:px-[calc(50vw-250px)]"
          animate={{
            x: -currentIndex * slideStep + dragX,
          }}
          transition={isDragging ? { duration: 0 } : { duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          {gallerySlides.map((slide, index) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              isActive={index === currentIndex}
              dragOffset={dragX}
              index={index}
              currentIndex={currentIndex}
              slideColors={colors[slide.id]}
            />
          ))}
        </motion.div>
      </div>

      <NavigationDots
        total={gallerySlides.length}
        current={currentIndex}
        onSelect={goToSlide}
        colors={currentColors}
      />
    </div>
  )
}
