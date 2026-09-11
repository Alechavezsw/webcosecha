"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Bot, MessageCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const easePremium = [0.22, 1, 0.36, 1] as const

const STEPS = [
  {
    kicker: "Entra",
    title: "Un mensaje",
    detail: "WhatsApp, la web o Instagram, a cualquier hora.",
    Icon: MessageCircle,
    accent: "text-[#67e8f9]",
    ring: "border-[#67e8f9]/40 shadow-[0_0_28px_-10px_rgba(103,232,249,0.8)]",
  },
  {
    kicker: "Decide",
    title: "El agente",
    detail: "Consulta tu información, responde o deriva a una persona.",
    Icon: Bot,
    accent: "text-[#c4b5fd]",
    ring: "border-[#c4b5fd]/45 shadow-[0_0_32px_-8px_rgba(196,181,253,0.85)]",
  },
  {
    kicker: "Ejecuta",
    title: "Una acción",
    detail: "Agenda la reunión, carga el lead, avisa a tu equipo.",
    Icon: Zap,
    accent: "text-[#e879f9]",
    ring: "border-[#e879f9]/40 shadow-[0_0_28px_-10px_rgba(232,121,249,0.8)]",
  },
] as const

/**
 * Diagrama del recorrido de un agente, para el panel derecho del hero.
 * Reemplaza la escena 3D genérica: explica el producto de un vistazo,
 * usa la misma rampa cian → violeta y no pesa nada (SVG + transform).
 */
export function IaAgentFlow({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <div className={cn("relative flex h-full w-full items-center justify-center p-6 md:p-8", className)}>
      <div className="relative w-full max-w-sm">
        {/* Riel que conecta los tres pasos */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-[#67e8f9]/60 via-[#c4b5fd]/50 to-[#e879f9]/50"
        />
        {/* Pulso que viaja por el riel */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[25px] top-8 h-8 w-[3px] rounded-full bg-gradient-to-b from-transparent via-white to-transparent"
            animate={{ y: ["0%", "1100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
          />
        )}

        <ol className="relative space-y-5">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={reduce ? false : { opacity: 0, x: 18 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.16, ease: easePremium }}
              className="group flex gap-4"
            >
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-[#06060c] transition-transform duration-300 group-hover:scale-105",
                  s.ring,
                )}
              >
                <s.Icon className={cn("size-6", s.accent)} strokeWidth={1.3} aria-hidden />
              </span>

              <div className="min-w-0 pt-1">
                <p className={cn("font-mono text-[10px] font-semibold uppercase tracking-[0.28em]", s.accent)}>
                  {s.kicker}
                </p>
                <p className="mt-1.5 font-display text-xl leading-tight text-white">{s.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{s.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-7 border-t border-white/10 pt-5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/35"
        >
          Sin que nadie apriete un botón
        </motion.p>
      </div>
    </div>
  )
}
