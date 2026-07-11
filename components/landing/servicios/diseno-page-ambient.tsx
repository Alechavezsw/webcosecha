"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

export function DisenoPageAmbient() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140])
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 200])
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80])
  const meshOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5, 1], [0.95, 1, 0.88, 0.92])
  const bottomFadeOpacity = useTransform(scrollYProgress, [0, 0.08], [0.3, 1])

  if (reduce) {
    return (
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
        style={{ opacity: meshOpacity }}
      >
        <div className="absolute inset-0 bg-[#030308]" />
        <motion.div className="absolute left-[5%] top-[18%] h-[min(50vw,480px)] w-[min(50vw,480px)] rounded-full bg-[#eca8d6]/10 blur-[100px]" />
        <motion.div className="absolute right-[4%] top-[42%] h-[min(44vw,420px)] w-[min(44vw,420px)] rounded-full bg-violet-700/16 blur-[95px]" />
        <motion.div className="absolute bottom-[8%] left-[28%] h-[min(40vw,380px)] w-[min(40vw,380px)] rounded-full bg-fuchsia-600/10 blur-[110px]" />
        <motion.div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(236,168,214,0.1),transparent_55%)]" />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ opacity: meshOpacity }}
    >
      <div className="absolute inset-0 bg-[#030308]" />

      <motion.div
        style={{ y: orbY1 }}
        className="absolute -left-[18%] top-[12%] h-[min(58vw,560px)] w-[min(58vw,560px)] rounded-full bg-[#eca8d6]/[0.17] blur-[110px]"
        animate={{
          x: [0, 36, -12, 0],
          scale: [1, 1.05, 1.02, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: orbY2 }}
        className="absolute -right-[14%] top-[32%] h-[min(52vw,500px)] w-[min(52vw,500px)] rounded-full bg-violet-600/[0.2] blur-[105px]"
        animate={{
          x: [0, -32, 20, 0],
          y: [0, 24, -8, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.div
        style={{ y: orbY3 }}
        className="absolute bottom-[2%] left-[22%] h-[min(46vw,440px)] w-[min(46vw,440px)] rounded-full bg-fuchsia-500/[0.14] blur-[120px]"
        animate={{
          x: [0, 28, -18, 0],
        }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      />
      <motion.div
        className="absolute left-[38%] top-[58%] h-[min(32vw,300px)] w-[min(32vw,300px)] rounded-full bg-[#d100d1]/[0.12] blur-[90px]"
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_95%_60%_at_50%_-12%,rgba(236,168,214,0.2),transparent_52%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_75%,rgba(161,0,242,0.13),transparent_50%)]" />

      {/* Sheen cónico que rota lento — "color en movimiento", sensación de diseño */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[120px] [background:conic-gradient(from_0deg_at_50%_50%,rgba(236,168,214,0.06),rgba(161,0,242,0.05),rgba(209,0,209,0.06),rgba(232,121,249,0.05),rgba(236,168,214,0.06))]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(236,168,214,0.04)_0%,transparent_22%,transparent_72%,rgba(3,3,8,0.85)_100%)]"
        style={{ opacity: bottomFadeOpacity }}
      />

      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(180deg,black_0%,black_40%,transparent_100%)]" />
    </motion.div>
  )
}
