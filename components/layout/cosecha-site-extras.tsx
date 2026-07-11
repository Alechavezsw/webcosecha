"use client"

import { CosechaCrmChatWidget } from "@/components/chat/cosecha-crm-chat"
import { usePathname } from "next/navigation"
import { SmoothScroll } from "@/components/layout/smooth-scroll"
import { FilmGrainOverlay } from "@/components/layout/film-grain-overlay"
import { RouteTransition } from "@/components/layout/route-transition"
import { IntroPreloader } from "@/components/layout/intro-preloader"

export function CosechaSiteExtras() {
  const pathname = usePathname()
  if (pathname?.startsWith("/crm")) return null

  // Páginas que scrollean un <div> interno (no la ventana): Lenis pelearía con su wheel.
  const innerScroll =
    pathname === "/servicios" ||
    pathname?.startsWith("/servicios/publicidad-paga-en-redes") ||
    pathname?.startsWith("/servicios/consultoria-estrategica")

  // La pradera diurna y brillante de identidad-de-marca se ve mejor PURA (sin grano/viñeta).
  const noGrain = pathname === "/servicios/identidad-de-marca"

  return (
    <>
      {!innerScroll && <SmoothScroll />}
      <RouteTransition />
      <IntroPreloader />
      {!noGrain && <FilmGrainOverlay />}
      <CosechaCrmChatWidget />
    </>
  )
}
