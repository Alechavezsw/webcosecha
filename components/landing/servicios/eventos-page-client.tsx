"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Check,
  Compass,
  Gamepad2,
  Smartphone,
  Tv,
  Sparkles,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import { PortfolioGallery, type PortfolioGalleryImage } from "@/components/ui/portfolio-gallery"

const EVENTOS_APPS_GALLERY_IMAGES: PortfolioGalleryImage[] = [
  { src: "/games/eventos-gallery-4/150_1x_shots_so.png", alt: "Interfaz de app para eventos" },
  { src: "/games/eventos-gallery-4/484_1x_shots_so.png", alt: "Pantalla de app para eventos" },
  { src: "/games/eventos-gallery-4/607_1x_shots_so.png", alt: "Vista de app para participantes" },
  { src: "/games/eventos-gallery-4/701_1x_shots_so.png", alt: "Flujo en app de evento" },
  { src: "/games/eventos-gallery-4/878_1x_shots_so.png", alt: "Experiencia mobile para eventos" },
]

const SERVICES = {
  trivias: {
    id: "trivias",
    title: "Trivias en vivo",
    tagline: "Preguntas y respuestas personalizadas en tiempo real.",
    desc: "Diseñamos juegos de preguntas y respuestas para pantallas gigantes, televisores, proyectores o LED. El público participa desde sus celulares de forma instantánea.",
    features: [
      "Participación instantánea desde celulares con QR",
      "Ranking en vivo reflejado en pantalla gigante",
      "Tiempo límite por pregunta con música y tensión",
      "Preguntas personalizadas con imágenes o videos",
      "Ganadores automáticos y sorteos integrados",
      "Diseño adaptado 100% con la marca del evento"
    ],
    ideal: "Eventos empresariales, lanzamientos de productos, aniversarios, fiestas de fin de año, capacitaciones y congresos.",
    icon: Sparkles
  },
  juegos: {
    id: "juegos",
    title: "Juegos para pantallas",
    tagline: "Interactividad y gamificación de alto impacto.",
    desc: "Creamos juegos visuales y dinámicos adaptados a la estética y objetivos de tu marca para que el público participe de forma lúdica durante el evento o en tu stand.",
    features: [
      "Ruleta digital de premios y sorteador animado",
      "Trivia de marca y memotests gigantes para stands",
      "Preguntados corporativos y desafíos por equipos",
      "Juegos de reacción rápida y bingo interactivo",
      "Totalmente personalizado con tus colores y logotipo",
      "Estadísticas de participación y leads registrados"
    ],
    ideal: "Stands en ferias (minería, turismo, agro), activaciones de marca, locales comerciales y fiestas.",
    icon: Gamepad2
  },
  visuales: {
    id: "visuales",
    title: "Entretenimiento visual",
    tagline: "Da vida a las pantallas de tu evento.",
    desc: "Desarrollamos contenido visual dinámico para que las pantallas y paneles LED del evento cobren vida propia y no sean un adorno pasivo.",
    features: [
      "Cronograma dinámico y animado en tiempo real",
      "Pantallas de bienvenida y placas institucionales",
      "Juegos interactivos cortos para transiciones y bloques",
      "Marcadores de puntuación y tableros en vivo",
      "Integración de redes sociales del público en pantalla",
      "Hashtag interactivo y moderación de mensajes"
    ],
    ideal: "Congresos, simposios, festivales, cenas anuales y entregas de premios.",
    icon: Tv
  },
  apps: {
    id: "apps",
    title: "Apps web para eventos",
    tagline: "Participación directa y sin fricciones.",
    desc: "Aplicaciones web ultralivianas que los asistentes abren en segundos desde su celular con un simple código QR. Sin descargar nada, sin instalar aplicaciones.",
    features: [
      "Acreditación ágil y control de acceso digital",
      "Agenda interactiva del evento con notificaciones",
      "Encuestas de satisfacción y carga de datos",
      "Sistemas de votación en tiempo real para paneles",
      "Mecanismos de sorteo transparentes e interactivos",
      "Ranking dinámico de desafíos en vivo"
    ],
    ideal: "Exposiciones masivas, acreditaciones corporativas, votaciones en asambleas y ferias.",
    icon: Smartphone
  }
} as const

type TabKey = keyof typeof SERVICES

// Helper type definition remains intact
type TabKey = keyof typeof SERVICES

export function EventosPageClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("trivias")
  const currentService = SERVICES[activeTab]
  const ServiceIcon = currentService.icon


  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white font-sans select-none">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 168, 214, 0.35);
          border-radius: 9px;
        }
      `}</style>

      {/* ── VISOR 3D DETRÁS DE TODO (fixed fullscreen) ────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-0 bg-[#050505] pointer-events-auto">
        <iframe
          id="sketchfab-iframe"
          src="https://sketchfab.com/models/f3b2e77703644c13ba4d839323ee8788/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_hint=0&ui_theme=dark"
          title="Recorrido Virtual 3D — Salón de Eventos"
          className="w-full h-full border-none outline-none block opacity-85"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="eager"
        />
      </div>

      {/* Progressive vignette overlay to blend 3D with the HUD */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_120%_90%_at_25%_50%,rgba(0,0,0,0.7)_0%,transparent_60%,rgba(0,0,0,0.85)_100%)]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 z-[1] bg-gradient-to-b from-black/90 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 z-[1] bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

      {/* ── HEADER HUD ────────────────────────────────────────────────────── */}
      <header className="fixed top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center size-10 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white/80 transition-all hover:border-[#eca8d6]/40 hover:text-white hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="rounded-xl border border-white/10 bg-black/65 px-4 py-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#eca8d6] block">COSECHA CREATIVA</span>
            <span className="text-xs font-semibold tracking-wider text-white/90">EVENTOS INTERACTIVOS</span>
          </div>
        </div>

        {/* Live HUD indicator */}
        <div className="pointer-events-auto rounded-full border border-white/10 bg-black/65 px-4 py-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono font-semibold tracking-widest text-white/80 uppercase">Salón 3D Activo</span>
        </div>
      </header>

      {/* ── SIDEBAR HUD (MAIN INFORMATION CENTER - Desktop) ──────────────── */}
      <section className="fixed bottom-6 left-3 top-24 z-20 hidden w-[min(400px,calc(100vw-1.5rem))] flex-col justify-between rounded-2xl border border-white/15 bg-black/65 p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] transition-all duration-500 hover:border-[#eca8d6]/30 select-text md:left-6 md:flex md:w-[min(420px,42vw)] md:p-6 lg:w-[440px] lg:p-8">
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Main Titles */}
          <div className="mb-6 shrink-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#eca8d6]/20 bg-[#eca8d6]/10 text-[9px] font-mono tracking-widest text-[#eca8d6] uppercase">
              Tecnología & Gamificación
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-white">
              Apps, juegos y experiencias digitales
            </h1>
            <p className="text-xs text-white/55 mt-2 leading-relaxed">
              Llevá tu evento en San Juan al próximo nivel. Seleccioná una categoría para explorar nuestras soluciones interactivas:
            </p>
          </div>

          {/* HUD Tabs System */}
          <div className="grid grid-cols-4 gap-2 mb-6 p-1 rounded-xl border border-white/8 bg-white/[0.03] shrink-0">
            {(Object.keys(SERVICES) as TabKey[]).map((key) => {
              const item = SERVICES[key]
              const Icon = item.icon
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2.5 rounded-lg transition-all duration-300 group relative",
                    isActive 
                      ? "bg-[#eca8d6] text-black shadow-[0_4px_16px_rgba(236,168,214,0.35)]" 
                      : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="size-4 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-semibold tracking-wider uppercase">{key}</span>
                </button>
              )
            })}
          </div>

          {/* Dynamic Information Module with Slide-In Transitions */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-[#eca8d6]">
                      <ServiceIcon className="size-4" />
                    </span>
                    {currentService.title}
                  </h2>
                  <p className="text-xs font-medium text-[#eca8d6] mt-1.5">{currentService.tagline}</p>
                  <p className="text-xs text-white/70 leading-relaxed mt-2.5">{currentService.desc}</p>
                </div>

                {/* Bullet items list */}
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
                  <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase block">¿Qué incluye el módulo?</span>
                  <ul className="space-y-2.5">
                    {currentService.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-white/85 leading-normal">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[#eca8d6]" strokeWidth={3} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal for card */}
                <div className="rounded-xl border border-[#eca8d6]/15 bg-[#eca8d6]/[0.03] p-4">
                  <span className="text-[10px] font-mono tracking-wider text-[#eca8d6]/90 uppercase block mb-1">Ideal para:</span>
                  <p className="text-xs leading-relaxed text-white/80">{currentService.ideal}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* CTA Buttons HUD Footer */}
        <div className="space-y-3 shrink-0 pt-4 border-t border-white/10">
          <Button
            size="lg"
            asChild
            className={cn(
              "w-full group h-12 gap-2.5 rounded-xl border-0 text-xs font-semibold text-white",
              "bg-gradient-to-br from-[#25D366] via-[#1ebe57] to-[#128C7E]",
              "shadow-[0_12px_32px_-12px_rgba(37,211,102,0.6)] hover:brightness-105 transition-all duration-300"
            )}
          >
            <a href={getWhatsAppHref(`Consulta Eventos: ${currentService.title}`)} target="_blank" rel="noopener noreferrer">
              <WhatsAppMark className="size-[17px] shrink-0 text-white transition-transform duration-300 group-hover:scale-110" />
              Hablar del evento por WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full h-12 rounded-xl border-white/20 bg-transparent text-xs font-semibold text-white/90 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <a href={`mailto:contacto@cosechacreativa.com.ar?subject=Consulta%20Eventos%20-%20${currentService.title}`} className="gap-2">
              <Mail className="size-4 text-[#eca8d6]" />
              Hablar por Correo
            </a>
          </Button>
        </div>
      </section>

      {/* ── RIGHT TUTORIAL PANEL HUD (Desktop) ────────────────────────────── */}
      <section className="fixed right-6 top-24 z-20 w-80 rounded-2xl border border-white/10 bg-black/45 p-6 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.6)] hidden lg:block select-text hover:border-white/20 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="size-4 text-[#eca8d6] animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-[10px] font-mono tracking-widest text-[#eca8d6] uppercase">Controles del Entorno 3D</span>
        </div>
        <p className="text-[11px] leading-relaxed text-white/60">
          Este salón virtual 3D es completamente interactivo. Podés interactuar directamente con el fondo de la pantalla:
        </p>
        <ul className="mt-3.5 space-y-2 text-[11px] text-white/80">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Click y arrastrá para orbitar el salón.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Click derecho y arrastrá para paneo.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Usá la rueda del mouse para hacer zoom.
          </li>
        </ul>
        <div className="mt-5 pt-4 border-t border-white/8">
          <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase block mb-1">San Juan, Argentina</span>
          <span className="text-[11px] text-white/70">Creamos experiencias interactivas que conectan personas con tu marca.</span>
        </div>
      </section>

      {/* ── PREVIEW DECK HUD (Horizontal Portfolio Gallery of Screens) ────── */}
      <section className="fixed left-[470px] right-6 bottom-6 z-20 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md shadow-[0_16px_48px_rgba(0,0,0,0.85)] hidden lg:block hover:border-white/18 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eca8d6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#eca8d6]"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#eca8d6] uppercase">Capturas de Pantallas y Banners reales</span>
          </div>
          <span className="text-[9px] font-mono text-white/35">// Galería Interactiva</span>
        </div>
        <div className="relative overflow-hidden w-full h-[130px] rounded-lg bg-black/15">
          <PortfolioGallery
            hideHeader
            images={EVENTOS_APPS_GALLERY_IMAGES}
            maxHeight={70}
            spacing="-space-x-52"
            className="w-full h-full p-0"
          />
        </div>
      </section>

      {/* ── RESPONSIVE FLOATING HUD PANEL (Mobile) ───────────────────────── */}
      <section className="fixed bottom-6 left-3 right-3 z-20 flex max-h-[min(52vh,420px)] flex-col justify-between rounded-2xl border border-white/12 bg-black/75 p-4 backdrop-blur-md shadow-[0_16px_48px_rgba(0,0,0,0.9)] sm:left-4 sm:right-4 sm:p-5 md:hidden">
        
        {/* Selector Tabs Mobile */}
        <div className="flex justify-between gap-1 mb-4 p-1 rounded-lg border border-white/8 bg-white/[0.02]">
          {(Object.keys(SERVICES) as TabKey[]).map((key) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold tracking-wider rounded-md text-center uppercase transition-all duration-300",
                  isActive ? "bg-[#eca8d6] text-black" : "text-white/40"
                )}
              >
                {key === "visuales" ? "visual" : key}
              </button>
            )
          })}
        </div>

        {/* Dynamic Mobile Text (scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eca8d6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#eca8d6]"></span>
            </span>
            {currentService.title}
          </h2>
          <p className="text-[11px] text-white/80 leading-relaxed mt-2">{currentService.desc}</p>
          <ul className="mt-3 space-y-2">
            {currentService.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex gap-2 text-[11px] text-white/70">
                <Check className="mt-0.5 size-3 shrink-0 text-[#eca8d6]" strokeWidth={3} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Call to Action */}
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <a
            href={getWhatsAppHref(`Consulta Eventos: ${currentService.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center h-10 gap-2 rounded-lg bg-[#25D366] text-[11px] font-bold text-white"
          >
            <WhatsAppMark className="size-[15px]" />
            WhatsApp
          </a>
          <a
            href={`mailto:contacto@cosechacreativa.com.ar?subject=Consulta%20Eventos%20-%20${currentService.title}`}
            className="flex-1 inline-flex items-center justify-center h-10 gap-2 rounded-lg border border-white/20 text-[11px] font-bold text-white"
          >
            <Mail className="size-3.5 text-[#eca8d6]" />
            Correo
          </a>
        </div>
      </section>

    </main>
  )
}
