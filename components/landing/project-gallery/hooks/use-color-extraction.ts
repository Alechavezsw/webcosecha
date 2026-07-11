"use client"

import { useState, useEffect } from "react"
import { extractColors } from "../color-extractor"
import { DEFAULT_COLORS } from "../slider-constants"
import type { GallerySlide } from "../types"

export function useColorExtraction(slides: GallerySlide[]): Record<number, string[]> {
  const [colors, setColors] = useState<Record<number, string[]>>({})

  useEffect(() => {
    slides.forEach((slide) => {
      extractColors(slide.image).then((extractedColors) => {
        setColors((prev) => ({ ...prev, [slide.id]: extractedColors }))
      })
    })
  }, [slides])

  return colors
}

export function useCurrentColors(colors: Record<number, string[]>, slideId: number | undefined): string[] {
  return colors[slideId ?? -1] || [...DEFAULT_COLORS]
}
