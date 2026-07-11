"use client"

import { useEffect, useState } from "react"

/** Card width + gap: 400+32 mobile, 500+64 md+ (matches artwork-card + art-gallery track gap). */
function computeSlideStep(): number {
  if (typeof window === "undefined") return 432
  return window.innerWidth >= 768 ? 564 : 432
}

export function useSlideStep(): number {
  const [step, setStep] = useState(432)

  useEffect(() => {
    const update = () => setStep(computeSlideStep())
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return step
}
