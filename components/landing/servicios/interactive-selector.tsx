"use client"

import React, { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"

export interface InteractiveSelectorOption {
  title: string
  description: string
  image: string
  icon: LucideIcon
}

interface InteractiveSelectorProps {
  options: InteractiveSelectorOption[]
  className?: string
}

export function InteractiveSelector({ options, className = "" }: InteractiveSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([])
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleOptionClick(index)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    }
  }

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, i])
      }, 180 * i)
      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [options])

  return (
    <div className={`relative flex w-full flex-col items-center justify-center ${className}`}>
      <div className="options relative mx-auto flex h-[320px] w-full max-w-[900px] min-w-0 items-stretch overflow-hidden sm:h-[380px] md:min-w-[600px] md:h-[400px]">
        {options.map((option, index) => {
          const Icon = option.icon
          const isActive = activeIndex === index
          const isHovered = hoverIndex === index && !isActive
          const isVisible = animatedOptions.includes(index)

          return (
            <div
              key={option.image}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={option.title}
              className="option group relative flex cursor-pointer flex-col justify-end overflow-hidden outline-none transition-all duration-700 ease-in-out focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                backgroundImage: `url('${option.image}')`,
                backgroundSize: isActive ? "auto 100%" : "auto 120%",
                backgroundPosition: "center",
                backfaceVisibility: "hidden",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-60px)",
                minWidth: "60px",
                minHeight: "100px",
                margin: 0,
                borderRadius: 0,
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: isActive ? "#fff" : isHovered ? "#5a5a5a" : "#292929",
                backgroundColor: "#18181b",
                filter: isActive || isHovered ? "none" : "brightness(0.82) saturate(0.9)",
                boxShadow: isActive
                  ? "0 20px 60px rgba(0,0,0,0.50)"
                  : "0 10px 30px rgba(0,0,0,0.30)",
                flex: isActive ? "7 1 0%" : isHovered ? "2.2 1 0%" : "1 1 0%",
                zIndex: isActive ? 10 : isHovered ? 5 : 1,
                willChange: "flex-grow, box-shadow, background-size, background-position, filter",
              }}
              onClick={() => handleOptionClick(index)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex((i) => (i === index ? null : i))}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <div
                className="shadow pointer-events-none absolute left-0 right-0 transition-all duration-700 ease-in-out"
                style={{
                  bottom: isActive ? "0" : "-40px",
                  height: "120px",
                  boxShadow: isActive
                    ? "inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000"
                    : "inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000",
                }}
              />

              <div className="label pointer-events-none absolute bottom-5 left-0 right-0 z-[2] flex w-full items-center justify-start gap-3 px-4">
                <div className="icon flex h-[44px] min-w-[44px] max-w-[44px] flex-shrink-0 flex-grow-0 items-center justify-center rounded-full border-2 border-[#444] bg-[rgba(32,32,32,0.85)] shadow-[0_1px_4px_rgba(0,0,0,0.18)] backdrop-blur-[10px] transition-all duration-200">
                  <Icon size={24} className="text-white" aria-hidden />
                </div>
                <div
                  className="info relative min-w-0 flex-1 text-white transition-all duration-700 ease-in-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : "translateX(25px)",
                  }}
                >
                  <div className="main font-display text-lg leading-tight">
                    {option.title}
                  </div>
                  <div className="sub mt-0.5 text-sm leading-snug text-gray-300 line-clamp-2">
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
