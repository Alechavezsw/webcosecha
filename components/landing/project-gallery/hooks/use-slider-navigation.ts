"use client"

import { useState, useCallback, useEffect } from "react"

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  return target.isContentEditable
}

interface UseSliderNavigationProps {
  totalSlides: number
  enableKeyboard?: boolean
  /** Al llegar al último/primer slide, vuelve al inicio/fin. */
  loop?: boolean
}

interface UseSliderNavigationReturn {
  currentIndex: number
  goToNext: () => void
  goToPrev: () => void
  goToSlide: (index: number) => void
  goToFirst: () => void
  goToLast: () => void
}

export function useSliderNavigation({
  totalSlides,
  enableKeyboard = true,
  loop = true,
}: UseSliderNavigationProps): UseSliderNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop && prev >= totalSlides - 1) return 0
      return Math.min(prev + 1, totalSlides - 1)
    })
  }, [totalSlides, loop])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop && prev <= 0) return totalSlides - 1
      return Math.max(prev - 1, 0)
    })
  }, [totalSlides, loop])

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
    },
    [totalSlides],
  )

  const goToFirst = useCallback(() => {
    setCurrentIndex(0)
  }, [])

  const goToLast = useCallback(() => {
    setCurrentIndex(totalSlides - 1)
  }, [totalSlides])

  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return

      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D":
          goToNext()
          break
        case "ArrowLeft":
        case "a":
        case "A":
          goToPrev()
          break
        case "Home":
          goToFirst()
          break
        case "End":
          goToLast()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableKeyboard, goToNext, goToPrev, goToFirst, goToLast])

  return {
    currentIndex,
    goToNext,
    goToPrev,
    goToSlide,
    goToFirst,
    goToLast,
  }
}
