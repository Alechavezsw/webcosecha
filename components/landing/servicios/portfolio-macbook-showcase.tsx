"use client"

import { Sparkles } from "lucide-react"
import { MacbookScroll } from "@/components/ui/macbook-scroll"
import {
  PORTFOLIO_MACBOOK_SCREENSHOT,
  WEBDIS_IMAGE_FALLBACK,
} from "@/components/landing/servicios/webdis-gallery-images"

const PORTFOLIO_SCREENSHOT = PORTFOLIO_MACBOOK_SCREENSHOT

/** URL pública del portafolio referenciado en Diseño web */
export const PORTFOLIO_PUBLIC_URL = "https://alechavez.cosechacreativa.com.ar/" as const

export function PortfolioMacbookShowcase() {
  return (
    <div className="relative mt-8 rounded-[2rem] border border-white/[0.08] bg-[#050508] shadow-[0_48px_120px_-48px_rgba(236,168,214,0.16),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-[#eca8d6]/14 blur-[92px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 size-60 rounded-full bg-[#67e8f9]/12 blur-[78px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/35 to-transparent md:inset-x-16" />

      <MacbookScroll
        className="md:py-56 lg:py-72"
        lidHref={PORTFOLIO_PUBLIC_URL}
        fallbackSrc={WEBDIS_IMAGE_FALLBACK}
        titleClassName="font-display font-normal text-white"
        title={
          <span className="block max-w-2xl md:mx-auto">
            <span className="bg-gradient-to-r from-[#eca8d6] via-[#a78bfa] to-[#67e8f9] bg-clip-text text-transparent">
              Alejandro Chávez
            </span>
            <span className="mt-3 block text-lg font-normal leading-snug text-white/55 md:text-xl">
              Portafolio
            </span>
          </span>
        }
        src={PORTFOLIO_SCREENSHOT}
        showGradient
        badge={
          <a
            href={PORTFOLIO_PUBLIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-black/80 to-zinc-900/90 text-[#eca8d6] shadow-[0_14px_44px_-14px_rgba(236,168,214,0.45)] ring-1 ring-[#eca8d6]/25 transition-all hover:scale-105 hover:border-[#67e8f9]/45 hover:text-[#a5f3fc] hover:shadow-[0_18px_50px_-12px_rgba(103,232,249,0.35)] md:size-12"
            aria-label="Abrir portafolio de Alejandro Chávez"
          >
            <Sparkles className="size-5 md:size-6" strokeWidth={1.2} aria-hidden />
          </a>
        }
      />
    </div>
  )
}
