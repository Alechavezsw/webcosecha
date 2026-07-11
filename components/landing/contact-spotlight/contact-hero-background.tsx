"use client"

import { motion } from "framer-motion"
import { ContactLampBackdrop } from "./contact-lamp-backdrop"

export function ContactHeroBackground({ isLightOn }: { isLightOn: boolean }) {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-black" />

      <motion.div
        className="absolute inset-0 z-[1] overflow-hidden"
        initial={false}
        animate={{ opacity: isLightOn ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <ContactLampBackdrop isLightOn={isLightOn} />
      </motion.div>

      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #000000 18%, rgba(0,0,0,0.42) 44%, transparent 64%)",
        }}
      />
    </>
  )
}
