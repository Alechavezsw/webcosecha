"use client"

import { motion } from "framer-motion"

type Props = {
  checked: boolean
  onCheckedChange: (next: boolean) => void
  headingId?: string
}

/** Interruptor tipo pared con «Hablemos» y LED verde que indica encendido. */
export function WallSwitchHablemos({ checked, onCheckedChange, headingId }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={headingId}
      onClick={() => onCheckedChange(!checked)}
      className="group pointer-events-auto flex flex-col items-center gap-2 rounded-xl border border-white/[0.14] bg-gradient-to-b from-[#2a2a2e] via-[#1a1a1f] to-[#0e0e12] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.65)] outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <span
        id={headingId}
        className="font-display text-[13px] font-medium tracking-tight text-[#f4f4f5]"
      >
        Hablemos
      </span>

      <div className="relative flex h-[56px] w-[36px] flex-col items-center rounded-md border border-black/55 bg-gradient-to-b from-[#3f3f46] to-[#18181b] px-[6px] pb-7 pt-[6px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.55)]">
        {/* Canal del breaker */}
        <div className="relative h-[28px] w-full rounded-[3px] bg-[#050505] shadow-[inset_0_2px_8px_rgba(0,0,0,0.95)]">
          <motion.span
            className="absolute left-1/2 block h-[13px] w-[20px] -translate-x-1/2 rounded-[2px] border border-white/20 bg-gradient-to-b from-[#e4e4e7] to-[#71717a] shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
            initial={false}
            animate={{ top: checked ? 13 : 2 }}
            transition={{ type: "spring", stiffness: 440, damping: 30 }}
          />
        </div>

        {/* Pilotito verde abajo del interruptor */}
        <div className="pointer-events-none absolute bottom-[5px] left-1/2 -translate-x-1/2">
          <span
            className={`block h-[8px] w-[8px] rounded-full transition-all duration-300 ${
              checked
                ? "bg-emerald-400 shadow-[0_0_12px_4px_rgba(52,211,153,0.95),0_0_22px_8px_rgba(16,185,129,0.35)]"
                : "bg-[#022c14] shadow-[inset_0_1px_4px_rgba(0,0,0,0.95)]"
            }`}
            aria-hidden
          />
        </div>
      </div>
    </button>
  )
}
