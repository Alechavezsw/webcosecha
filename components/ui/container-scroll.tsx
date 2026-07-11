"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"

export type ContainerScrollProps = {
  titleComponent: ReactNode
  children: ReactNode
}

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  /** Salida estable para que useTransform no reciba un array nuevo en cada render */
  const scaleOutput = useMemo<[number, number]>(
    () => (isMobile ? [0.7, 0.9] : [1.05, 1]),
    [isMobile],
  )

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleOutput)
  /** En Motion hay que usar `y`, no translateY, para enlazar MotionValues al pipeline de transforms */
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[56rem] items-center justify-center overflow-visible p-2 md:min-h-[76rem] md:p-16 lg:min-h-[84rem]"
    >
      <div
        className="relative w-full py-8 md:py-24 lg:py-32"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
      >
        <ContainerScrollHeader y={titleY} titleComponent={titleComponent} />
        <ContainerScrollCard rotate={rotate} scale={scale}>
          {children}
        </ContainerScrollCard>
      </div>
    </div>
  )
}

function ContainerScrollHeader({
  y,
  titleComponent,
}: {
  y: MotionValue<number>
  titleComponent: ReactNode
}) {
  return (
    <motion.div style={{ y }} className="mx-auto max-w-5xl text-center will-change-transform">
      {titleComponent}
    </motion.div>
  )
}

function ContainerScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  children: ReactNode
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        transformPerspective: 1200,
        transformOrigin: "center bottom",
      }}
      className="mx-auto -mt-10 h-[26rem] w-full max-w-5xl rounded-[28px] border border-white/18 bg-zinc-950 p-1.5 shadow-2xl [transform-style:preserve-3d] will-change-transform md:-mt-12 md:h-[38rem] md:rounded-[30px] md:border-[3px] md:p-5 lg:h-[40rem]"
    >
      <div className="h-full w-full overflow-hidden rounded-[22px] bg-zinc-900 ring-1 ring-white/10 md:rounded-2xl md:p-3 [transform-style:preserve-3d]">
        {children}
      </div>
    </motion.div>
  )
}
