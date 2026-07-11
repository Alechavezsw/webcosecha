"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface LayeredTextLine {
  top: string
  bottom: string
}

interface LayeredTextProps {
  lines: LayeredTextLine[]
  lineHeight?: number
  lineHeightMd?: number
  className?: string
  reducedMotion?: boolean
}

const gradientSpan =
  "bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#eca8d6] bg-clip-text text-transparent"

const hoverEase = [0.22, 1, 0.36, 1] as const

function calculateTranslateX(index: number, total: number) {
  const baseOffset = 35
  const baseOffsetMd = 20
  const centerIndex = Math.floor(total / 2)
  return {
    desktop: (index - centerIndex) * baseOffset,
    mobile: (index - centerIndex) * baseOffsetMd,
  }
}

export function LayeredText({
  lines,
  lineHeight = 60,
  lineHeightMd = 36,
  className,
  reducedMotion = false,
}: LayeredTextProps) {
  const [hovered, setHovered] = useState(false)
  const [isMd, setIsMd] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const apply = () => setIsMd(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  const lh = isMd ? lineHeight : lineHeightMd
  const yOffset = isMd ? -60 : -35
  let paragraphIndex = 0

  return (
    <motion.div
      className={cn(
        "mx-auto py-10 font-sans text-[clamp(0.85rem,3.5vw,4rem)] font-black uppercase tracking-[-0.06em] antialiased md:py-14 md:text-[clamp(1.5rem,4.5vw,4.5rem)]",
        reducedMotion ? "cursor-default" : "cursor-pointer",
        className,
      )}
      aria-hidden
      onHoverStart={() => {
        if (!reducedMotion) setHovered(true)
      }}
      onHoverEnd={() => setHovered(false)}
    >
      <ul className="m-0 flex list-none flex-col items-center p-0">
        {lines.map((line, index) => {
          const translateX = calculateTranslateX(index, lines.length)
          const skewStr =
            index % 2 === 0 ? "skew(60deg, -30deg) scaleY(0.66667)" : "skew(0deg, -30deg) scaleY(1.33333)"
          const tx = isMd ? translateX.desktop : translateX.mobile

          const liStyle: CSSProperties = {
            height: `${lh}px`,
            transform: `translateX(${tx}px) ${skewStr}`,
          }

          const textStyle: CSSProperties = {
            height: `${lh}px`,
            lineHeight: `${lh - 5}px`,
          }

          const d1 = paragraphIndex++
          const d2 = paragraphIndex++

          return (
            <li key={`${line.top}-${line.bottom}-${index}`} className="relative overflow-hidden" style={liStyle}>
              <motion.p
                className="m-0 whitespace-nowrap px-[15px] align-top leading-[55px] md:leading-[30px]"
                style={textStyle}
                animate={{ y: hovered ? yOffset : 0 }}
                transition={{
                  duration: 0.8,
                  ease: hoverEase,
                  delay: d1 * 0.08,
                }}
              >
                <span className={gradientSpan}>{line.top}</span>
              </motion.p>
              <motion.p
                className="m-0 whitespace-nowrap px-[15px] align-top leading-[55px] md:leading-[30px]"
                style={textStyle}
                animate={{ y: hovered ? yOffset : 0 }}
                transition={{
                  duration: 0.8,
                  ease: hoverEase,
                  delay: d2 * 0.08,
                }}
              >
                <span className={gradientSpan}>{line.bottom}</span>
              </motion.p>
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
