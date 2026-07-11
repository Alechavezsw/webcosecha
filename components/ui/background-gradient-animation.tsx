"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react"

export type BackgroundGradientAnimationProps = {
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
  size?: string
  blendingValue?: string
  children?: ReactNode
  className?: string
  interactive?: boolean
  containerClassName?: string
}

export function BackgroundGradientAnimation({
  gradientBackgroundStart = "#000000",
  gradientBackgroundEnd = "#000000",
  firstColor = "236, 168, 214",
  secondColor = "209, 0, 209",
  thirdColor = "161, 0, 242",
  fourthColor = "45, 0, 247",
  fifthColor = "236, 168, 214",
  pointerColor = "236, 168, 214",
  size = "50%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: BackgroundGradientAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const interactiveRef = useRef<HTMLDivElement>(null)

  const curXRef = useRef(0)
  const curYRef = useRef(0)
  const tgXRef = useRef(0)
  const tgYRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.style.setProperty("--gradient-background-start", gradientBackgroundStart)
    el.style.setProperty("--gradient-background-end", gradientBackgroundEnd)
    el.style.setProperty("--first-color", firstColor)
    el.style.setProperty("--second-color", secondColor)
    el.style.setProperty("--third-color", thirdColor)
    el.style.setProperty("--fourth-color", fourthColor)
    el.style.setProperty("--fifth-color", fifthColor)
    el.style.setProperty("--pointer-color", pointerColor)
    el.style.setProperty("--size", size)
    el.style.setProperty("--blending-value", blendingValue)
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ])

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    if (!interactive) return

    function animateMovement() {
      if (!interactiveRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateMovement)
        return
      }

      curXRef.current = curXRef.current + (tgXRef.current - curXRef.current) / 20
      curYRef.current = curYRef.current + (tgYRef.current - curYRef.current) / 20

      interactiveRef.current.style.transform = `translate(${Math.round(curXRef.current)}px, ${Math.round(curYRef.current)}px)`

      animationFrameRef.current = requestAnimationFrame(animateMovement)
    }

    animationFrameRef.current = requestAnimationFrame(animateMovement)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [interactive])

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!interactiveRef.current) return

    const rect = interactiveRef.current.getBoundingClientRect()
    tgXRef.current = event.clientX - rect.left
    tgYRef.current = event.clientY - rect.top
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <svg className="hidden" aria-hidden>
        <defs>
          <filter id="cc-gradient-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn(
          "gradients-container pointer-events-none absolute inset-0 z-0 h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#cc-gradient-blur)_blur(40px)]",
        )}
        aria-hidden
      >
        <div
          className={cn(
            "absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] animate-first [transform-origin:center_center] [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] opacity-100",
          )}
        />
        <div
          className={cn(
            "absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-400px)] [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] opacity-100 animate-second",
          )}
        />
        <div
          className={cn(
            "absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%+400px)] [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] opacity-100 animate-third",
          )}
        />
        <div
          className={cn(
            "absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-200px)] [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] opacity-70 animate-fourth",
          )}
        />
        <div
          className={cn(
            "absolute top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [transform-origin:calc(50%-800px)_calc(50%+800px)] [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] opacity-100 animate-fifth",
          )}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute -top-1/2 -left-1/2 h-full w-full [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] opacity-70",
            )}
          />
        )}
      </div>

      {children ? <div className={cn("relative z-10", className)}>{children}</div> : null}
    </div>
  )
}
