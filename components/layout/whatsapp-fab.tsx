"use client"

import { motion } from "framer-motion"

import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

/**
 * Botón flotante de contacto. Reemplaza al widget de chat: va directo a
 * WhatsApp en vez de abrir una conversación con el asistente.
 */
export function WhatsAppFab() {
  return (
    <motion.a
      href={getWhatsAppHref()}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed bottom-5 right-5 z-[200] flex size-14 items-center justify-center rounded-full",
        "border border-white/20 bg-[#25D366] text-black",
        "shadow-[0_12px_45px_-5px_rgba(37,211,102,0.6)] transition-colors duration-300",
        "hover:bg-[#2ee878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60",
      )}
      aria-label="Escribinos por WhatsApp"
    >
      <WhatsAppMark className="size-7" />
    </motion.a>
  )
}
