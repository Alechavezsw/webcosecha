"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface RevealTextProps {
  text?: string
  textColor?: string
  overlayColor?: string
  fontSize?: string
  letterDelay?: number
  overlayDelay?: number
  overlayDuration?: number
  springDuration?: number
  letterImages?: string[]
  className?: string
  inline?: boolean
}

const DEFAULT_LETTER_IMAGES = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626785774573-4b874ff173ca?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558591710-4bfcf4a0dca9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1557672172-298dd090a0c1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1579783902610-f9f7b0e7a778?auto=format&fit=crop&w=800&q=80",
] as const

export function RevealText({
  text = "STUNNING",
  textColor = "text-white",
  overlayColor = "text-[#eca8d6]",
  fontSize = "text-[250px]",
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  letterImages = [...DEFAULT_LETTER_IMAGES],
  className,
  inline = false,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setShowOverlay(true)
      return
    }

    const lastLetterDelay = (text.length - 1) * letterDelay
    const totalDelay = lastLetterDelay * 1000 + springDuration

    const timer = setTimeout(() => setShowOverlay(true), totalDelay)
    return () => clearTimeout(timer)
  }, [text.length, letterDelay, springDuration, reduceMotion])

  if (reduceMotion) {
    return (
      <span className={cn(fontSize, textColor, "font-display italic", className)}>{text}</span>
    )
  }

  return (
    <span
      className={cn(
        inline ? "inline-flex align-baseline" : "flex items-center justify-center",
        "relative",
        className,
      )}
      aria-label={text}
    >
      <span className="flex">
        {text.split("").map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            onMouseEnter={() => letter !== " " && setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              fontSize,
              "relative cursor-default overflow-hidden font-display italic tracking-tight",
              letter === " " && "w-[0.35em]",
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * letterDelay,
              type: "spring",
              damping: 8,
              stiffness: 200,
              mass: 0.8,
            }}
          >
            <motion.span
              className={cn("relative", textColor)}
              animate={{ opacity: hoveredIndex === index ? 0 : 1 }}
              transition={{ duration: 0.1 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>

            {letter !== " " && (
              <motion.span
                className="absolute inset-0 bg-cover bg-clip-text bg-no-repeat text-transparent"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  backgroundPosition:
                    hoveredIndex === index ? "10% center" : "0% center",
                }}
                transition={{
                  opacity: { duration: 0.1 },
                  backgroundPosition: { duration: 3, ease: "easeInOut" },
                }}
                style={{
                  backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                aria-hidden
              >
                {letter}
              </motion.span>
            )}

            {showOverlay && letter !== " " && (
              <motion.span
                className={cn("pointer-events-none absolute inset-0", overlayColor)}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: index * overlayDelay,
                  duration: overlayDuration,
                  times: [0, 0.1, 0.7, 1],
                  ease: "easeInOut",
                }}
                aria-hidden
              >
                {letter}
              </motion.span>
            )}
          </motion.span>
        ))}
      </span>
    </span>
  )
}
