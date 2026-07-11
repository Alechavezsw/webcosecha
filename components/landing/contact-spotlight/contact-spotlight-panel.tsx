"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { ContactHeroBackground } from "./contact-hero-background"
import { WallSwitchHablemos } from "./wall-switch-hablemos"
import { Mail } from "lucide-react"

const VENTAS_EMAIL = "ventas@cosechacreativa.com.ar"
const mailtoHref = `mailto:${VENTAS_EMAIL}?subject=${encodeURIComponent("Consulta desde la web")}`

/** Panel oscuro: al encender la luz aparece el haz y los datos de contacto. */
export function ContactSpotlightPanel() {
  const [isLightOn, setIsLightOn] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-[0_32px_100px_-28px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.05]">
      <div
        className="relative overflow-hidden bg-black"
        style={{ minHeight: "clamp(440px, 56vw, 520px)" }}
      >
        {/* Interruptor «Hablemos» centrado arriba — forma física + LED */}
        <div className="absolute left-1/2 top-4 z-[60] -translate-x-1/2 pointer-events-auto">
          <WallSwitchHablemos
            checked={isLightOn}
            onCheckedChange={setIsLightOn}
            headingId="contacto-heading"
          />
        </div>

        {/* Oscuridad hasta encender — fondo sigue negro */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          animate={{ opacity: isLightOn ? 0 : 0.92 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="absolute inset-0 z-0">
          <ContactHeroBackground isLightOn={isLightOn} />
        </div>

        {/* Haz suave en el suelo cuando hay luz (coherente con referencia) */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[55%]"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 100%, rgba(255,248,237,0.14) 0%, rgba(255,248,237,0.04) 45%, transparent 72%)",
          }}
          animate={{ opacity: isLightOn ? 1 : 0 }}
          transition={{ duration: 0.55 }}
        />

        {/* Contacto: solo visible con la luz encendida */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-[45] flex flex-col items-center px-4 pb-10 pt-6 text-center sm:px-8 pointer-events-none"
          animate={{
            opacity: isLightOn ? 1 : 0,
            y: isLightOn ? 0 : 18,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: isLightOn ? "auto" : "none" }}
        >
          <div className="mt-4 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              size="sm"
              asChild
              className="h-11 rounded-full border-0 bg-[#25D366] px-6 text-[13px] font-semibold text-white shadow-[0_8px_32px_-8px_rgba(37,211,102,0.45)] hover:bg-[#20bd5a] sm:h-10"
            >
              <a
                href={getWhatsAppHref("Contacto desde la web")}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <WhatsAppMark className="size-[17px] shrink-0 text-white" />
                WhatsApp
              </a>
            </Button>

            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-11 min-w-0 rounded-full border-[#faf8f3]/25 bg-black/35 px-5 text-[13px] font-normal text-[#faf8f3] shadow-[0_0_24px_-6px_rgba(255,245,220,0.12)] backdrop-blur-sm hover:bg-black/50 hover:text-white sm:h-10 sm:max-w-xs"
            >
              <a href={mailtoHref} className="gap-2 truncate">
                <Mail className="size-4 shrink-0 text-[#c9c4bc]" aria-hidden />
                <span className="truncate">{VENTAS_EMAIL}</span>
              </a>
            </Button>
          </div>

          <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#b8b3a8]/80">
            Cosecha Creativa · San Juan
          </p>
        </motion.div>
      </div>
    </div>
  )
}
