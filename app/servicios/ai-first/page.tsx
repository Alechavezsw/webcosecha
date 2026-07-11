"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { IntroAnimation, INTRO_DURATION_MS, HERO_REVEAL_MS } from "@/components/intro-animation"
import { AgentInterface } from "@/components/agent-interface"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { DevExSection } from "@/components/devex-section"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { Button } from "@/components/ui/button"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AgenticPage() {
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  // Start video zoom slightly before hero content reveals, for seamless overlap
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <Navigation />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Video background — zooms in once intro is done */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4"
          style={{
            transform: videoReady ? "scale(1.05)" : "scale(0.85)",
            transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Progressive blur + light gradient rising from bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />
        {/* Backdrop blur layers — progressively lighter toward top */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "38%", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "55%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + metrics — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-4xl">
          <div
            style={{
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(16px)",
              transform: heroReady ? "translateY(0px)" : "translateY(20px)",
              transition: "opacity 1s ease 50ms, filter 1s ease 50ms, transform 1s ease 50ms",
            }}
            className="mb-4"
          >
            <Tag>SERVICIO PARA EMPRESAS AI FIRST</Tag>
          </div>

          {/* Title */}
          <h1
            className="cc-hero-title mb-8 text-[#111] font-light"
            style={{
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 100ms, filter 1s cubic-bezier(0.16,1,0.3,1) 100ms, transform 1s cubic-bezier(0.16,1,0.3,1) 100ms",
            }}
          >
            Transformamos<br />tu empresa con<br />Inteligencia<br />Artificial.
          </h1>

          <div
            className="text-sm sm:text-base md:text-lg text-black/55 font-light max-w-2xl mb-8 space-y-4 leading-relaxed"
            style={{
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(16px)",
              transform: heroReady ? "translateY(0px)" : "translateY(20px)",
              transition: "opacity 1.2s ease 250ms, filter 1.2s ease 250ms, transform 1.2s ease 250ms",
            }}
          >
            <p>
              En Cosecha Creativa ayudamos a empresas a dar el salto hacia un modelo AI First, integrando inteligencia artificial en sus procesos, comunicación, ventas y gestión interna.
            </p>
            <p>
              No se trata solo de “usar IA porque está de moda”. Se trata de rediseñar la forma en que tu empresa trabaja, vende, responde, analiza y toma decisiones.
            </p>
          </div>

          {/* 3 metrics — staggered after title */}
          <div className="flex gap-8 sm:gap-12">
            {[
              { value: "24/7", label: "Monitoreo" },
              { value: "100%", label: "Seguridad" },
              { value: "0", label: "Humo Digital" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${350 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${350 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${350 + i * 80}ms`,
                }}
              >
                <div className="font-display text-3xl font-light tracking-tight text-[#111] sm:text-4xl">{stat.value}</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-widest text-black/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW (bento) ──────────────────────────────────────── */}
      <section id="platform" className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>¿QUÉ SIGNIFICA SER UNA EMPRESA AI FIRST?</Tag></div>
            <RevealText className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              {"No es usar IA por moda.\nEs rediseñar cómo trabajás."}
            </RevealText>
          </div>

          <div className="grid grid-cols-12 grid-rows-auto gap-3" onMouseMove={handleMouse}>
            {/* Big left card */}
            <BentoCard className="col-span-12 p-8 min-h-[200px] flex flex-col justify-between relative overflow-hidden" delay={0}>
              {/* Arc background image */}
              <img
                src="/images/arc.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 70%" }}
              />
              {/* Progressive blur layer */}
              <div className="absolute inset-0" style={{
                maskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }} />
              {/* Fade-to-background gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 35%, rgba(245,244,240,0.3) 50%, rgba(245,244,240,0.75) 65%, rgba(245,244,240,0.95) 80%, rgb(245,244,240) 100%)",
                }}
              />
              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-white/60 flex items-center justify-center mb-6" style={{ backdropFilter: "blur(8px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
                </div>
                <h3 className="text-xl font-light mb-3">¿Qué significa ser una empresa AI First?</h3>
                <p className="text-sm text-black/55 leading-relaxed max-w-2xl">
                  Una empresa AI First es aquella que incorpora la inteligencia artificial como parte central de su estrategia. La IA deja de ser una herramienta aislada y se convierte en un motor para mejorar la productividad, automatizar tareas, reducir tiempos y potenciar resultados.
                </p>
                <p className="text-sm text-black/55 leading-relaxed max-w-2xl mt-3 font-semibold">
                  En criollo: menos tareas repetitivas, más decisiones inteligentes y más tiempo para hacer crecer el negocio.
                </p>
              </div>
            </BentoCard>

            {/* Bottom row */}
            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={120}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Automatización de procesos</h3>
              <p className="text-sm text-black/45 leading-relaxed">Creamos flujos inteligentes para automatizar tareas repetitivas como carga de datos, respuestas a clientes, generación de reportes, seguimiento comercial, gestión de consultas y organización interna.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={160}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10h8M8 14h5"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Asistentes virtuales inteligentes</h3>
              <p className="text-sm text-black/45 leading-relaxed">Desarrollamos chatbots y asistentes con IA capaces de responder consultas, guiar clientes, tomar pedidos, brindar información y acompañar procesos comerciales o administrativos.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={200}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">IA conectada a tus herramientas</h3>
              <p className="text-sm text-black/45 leading-relaxed">Integramos agentes de inteligencia artificial con sistemas, planillas, CRM, WhatsApp, sitios web, bases de datos, correos y plataformas de gestión. Conectamos agentes de IA con las herramientas reales de tu empresa.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── BUILD YOUR AGENTS (Stacking cards) ────────────────────────────── */}
      <section id="agents" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>¿QUÉ HACEMOS DESDE COSECHA CREATIVA?</Tag></div>
              <RevealText className="mt-5 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
                {"Diseñamos e implementamos\nsoluciones de IA."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-md">
              Diseñamos e implementamos soluciones de inteligencia artificial adaptadas a cada empresa, según su tamaño, rubro y objetivos.
            </p>
          </div>

          <StackingAgentCards />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="workflow" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>METODOLOGÍA COSECHA</Tag></div>
            <RevealText className="mt-5 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
              {"Un proceso transparente\ny libre de humo."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onMouseMove={handleMouse}>
            {[
              { n: "01", title: "Analizar",  desc: "Analizamos tu empresa y detectamos los cuellos de botella y procesos manuales optimizables.", delay: 0,   img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/define-5aafAmGBrxZpOqJ3XLHY3n3qzC2I5K.png" },
              { n: "02", title: "Diseñar", desc: "Diseñamos una solución de inteligencia artificial adaptada a tu tamaño, rubro y metas.", delay: 80,  img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compose-5RT5VR4f1Y3GoFmovqTKLTG4UXp3g2.png" },
              { n: "03", title: "Construir",    desc: "Construimos los agentes de IA y los conectamos a las herramientas reales de tu empresa.", delay: 140, img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-zm8guZwxJHtwWsJ7XO4B0CF7GzlNK8.png" },
              { n: "04", title: "Potenciar",  desc: "Desplegamos el servicio activo las 24/7. Tu negocio ahora escala de forma inteligente.", delay: 200, img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deploy-an8fgHSLzniojkcmRyGGIFQUJF9T5J.png" },
            ].map((step) => (
              <BentoCard key={step.n} className="relative overflow-hidden flex flex-col min-h-[320px]" delay={step.delay}>
                {/* Image at top — mask fades it out strongly before the bottom edge */}
                <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover object-top"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
                {/* Number top-left */}
                <div className="relative z-10 p-7">
                  <span className="mb-1 block font-mono text-[11px] tracking-widest text-black/20">{step.n}</span>
                </div>
                {/* Text pushed further down */}
                <div className="relative z-10 px-7 pb-7 mt-auto pt-16">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{step.desc}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────────────── */}
      <section id="integrations" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>INTEGRACIÓN REAL</Tag></div>
              <RevealText className="mt-5 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
                {"Conectamos la IA\ncon tu ecosistema diario."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              Conectamos agentes de IA con las herramientas reales de tu empresa: WhatsApp, CRM, planillas de cálculo, bases de datos y correos.
            </p>
          </div>

          {/* Full-width image block with glass cards */}
          <div className="rounded-2xl overflow-hidden border border-black/[0.07] flex flex-col md:block md:relative" onMouseMove={handleMouse}>
            {/* Image */}
            <div className="relative w-full h-[280px] md:h-[480px] shrink-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Org%20Arc%20-%20Upscaled-Sk90jShfu7nltLnhoQbaMJC1YaQKuU.png"
                alt="Orquestación e integración de agentes de IA"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Cards — flex row on mobile, absolute on desktop */}
            <div className="flex flex-col gap-3 p-4 md:absolute md:bottom-4 md:right-4 md:p-0 md:w-72">
              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <Tag>INTEGRACIÓN</Tag>
                <h3 className="mt-3 text-lg font-light mb-2">IA conectada</h3>
                <p className="text-xs text-black/45 leading-relaxed mb-4">No aislamos los sistemas. Creamos flujos automatizados de extremo a extremo conectando planillas, CRM y chats.</p>
                <div className="bg-black/[0.05] rounded-lg border border-black/[0.07] p-3 font-mono text-[11px] text-black/50 leading-relaxed">
                  <span className="text-black/25">// flujo integrador</span><br />
                  <span className="text-blue-600/70">conectarAgente</span>{"({"}<br />
                  {"  "}<span className="text-amber-700/70">canal</span>: <span className="text-green-700/70">&apos;WhatsAppBusiness&apos;</span>,<br />
                  {"  "}<span className="text-amber-700/70">ejecutar</span>: <span className="text-black/35">async (datos) </span>={">"}<br />
                  {"    "}<span className="text-blue-600/70">CRM</span>.actualizarCliente(datos)<br />
                  {"})"}
                </div>
              </div>

              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-xs text-black/40 tracking-widest">IA APLICADA</span>
                </div>
                <p className="text-sm text-black/45">Automatización robusta y medible orientada 100% a la productividad de tu equipo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY & OBSERVABILITY ──────────────────────────────────────── */}
      <section id="security" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>IA APLICADA, NO HUMO DIGITAL</Tag></div>
            <RevealText className="mt-5 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
              {"IA aplicada, no humo digital"}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side — descriptions */}
            <div className="space-y-6">
              <div className="text-sm text-black/55 leading-relaxed space-y-4">
                <p>
                  En Cosecha Creativa no vendemos promesas futuristas. Diseñamos soluciones concretas, aplicables y medibles.
                </p>
                <p>
                  Analizamos tu empresa, detectamos procesos que pueden mejorarse y construimos herramientas que realmente aporten valor.
                </p>
                <p className="font-semibold text-black/80">
                  La inteligencia artificial no reemplaza tu negocio: lo potencia.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Trazabilidad Total", desc: "Cada decisión de los agentes de IA queda registrada de forma clara y auditable." },
                  { label: "Seguridad y Privacidad", desc: "Tus datos comerciales y de clientes permanecen seguros y confidenciales." },
                  { label: "IA Aplicada y Medible", desc: "Diseñamos herramientas que resuelven problemas reales de productividad de forma inmediata." },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-1 bg-black/10 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-sm font-light mb-1">{item.label}</h3>
                      <p className="text-xs text-black/35">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance badges — vertical stack */}
              <div className="pt-4 flex flex-col gap-2">
                {["Privacidad Encriptada", "Monitoreo 24/7", "Integración Segura", "Fórmula AI First"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-xs text-black/25">
                    <span className="w-1 h-1 rounded-full bg-black/25" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — live audit log visualization */}
            <BentoCard className="p-6 lg:row-span-1" delay={0}>
              <div className="text-xs text-black/30 tracking-widest uppercase mb-4">Registro Operativo en Vivo</div>
              <div className="space-y-2">
                {[
                  { time: "12:34:21", action: "consulta_whatsapp_respondida", status: "success" },
                  { time: "12:34:18", action: "crm_cliente_actualizado", status: "success" },
                  { time: "12:34:15", action: "planilla_de_ventas_sincronizada", status: "success" },
                  { time: "12:34:12", action: "reporte_semanal_generado", status: "success" },
                  { time: "12:34:09", action: "asistente_de_ventas_activo", status: "success" },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/[0.02] hover:bg-black/[0.04] transition-colors border border-black/[0.04] group cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                    }}
                  >
                    <span className="text-[10px] text-black/25 font-mono min-w-[60px]">{log.time}</span>
                    <span className="text-[11px] text-black/50 font-light flex-1">{log.action}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 group-hover:bg-green-500 transition-colors" />
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── METODOLOGÍA COSECHA (interactive) ────────────────────────────── */}
      <DevExSection />

      {/* ── MARQUEE CAPABILITIES ──────────────────────────────────────────── */}
      <section className="py-0 border-t border-black/[0.06] overflow-hidden select-none">
        <div className="flex border-b border-black/[0.06]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Carga de datos", "Asistente de WhatsApp", "Respuestas automáticas", "Orden de información", "Interpretación de datos", "Generación de ideas", "Optimización de textos", "Integración CRM", "Flujos inteligentes", "Monitoreo 24/7"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />
                  <span className="text-sm text-black/45 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Reportes automatizados", "Respuesta a clientes", "Toma de pedidos", "Dashboard estratégico", "Gestión de correos", "Sincronización WhatsApp", "Reducción de errores", "Ahorro de tiempo", "Vender mejor", "Escalar operaciones"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/12 shrink-0" />
                  <span className="text-sm text-black/30 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AGENTS ──────────────────────────────────────────────────── */}
      <section id="live" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>OPERACIONES EN TIEMPO REAL</Tag></div>
              <RevealText className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                {"Agentes trabajando\n24/7 de forma autónoma."}
              </RevealText>
              <p className="mt-6 text-base text-black/40 leading-relaxed max-w-sm">
                Diseñamos agentes de inteligencia artificial y automatizaciones que operan ininterrumpidamente, resolviendo tareas críticas para que tu equipo se concentre en lo importante.
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 text-sm mb-1 tracking-wide">tareas resueltas globalmente hoy</span>
              </div>
            </div>
            <div className="relative">
              <LiveAgentFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING (Refactored to "Beneficios para tu empresa") ───────────── */}
      <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <PixelIcon type="pricing" size={40} />
            <div className="mt-4"><Tag>BENEFICIOS PARA TU EMPRESA</Tag></div>
            <RevealText className="mt-5 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
              {"Con una estrategia AI First, tu empresa puede:"}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" onMouseMove={handleMouse}>
            {[
              {
                name: "Operación Ágil",
                price: "Eficiencia",
                sub: "Menos tareas operativas y repetitivas",
                features: ["Ahorrar tiempo operativo.", "Reducir errores humanos.", "Acelerar procesos internos."],
                delay: 0,
              },
              {
                name: "Atención Comercial",
                price: "Crecimiento",
                sub: "Vender mejor y responder más rápido",
                features: ["Mejorar la atención al cliente.", "Vender mejor y responder más rápido.", "Escalar sin depender de más carga administrativa."],
                highlight: true,
                delay: 80,
              },
              {
                name: "Inteligencia Estratégica",
                price: "Claridad",
                sub: "Decisiones con información más clara",
                features: ["Ordenar información dispersa.", "Tomar decisiones con datos más claros."],
                delay: 140,
              },
            ].map((plan) => (
              <BentoCard
                key={plan.name}
                className={`p-8 flex flex-col ${plan.highlight ? "border-black/20 bg-[#F0EEE8]" : ""}`}
                delay={plan.delay}
              >
                <div className="mb-8">
                  <div className="mb-4 font-mono text-[11px] tracking-widest text-black/40">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-light">{plan.price}</span>
                  </div>
                  <p className="text-xs text-black/35 tracking-wide">{plan.sub}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-black/55">
                      <div className="w-1.5 h-1.5 rounded-full bg-black/25 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        {/* Glass panels image — anchored to bottom center */}
        <img
          src="/images/footer.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom — blends into site bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
        {/* Colour fade from bottom to site bg #f5f4f0 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-6">
            Llevá tu empresa al<br />próximo nivel
          </h2>
          <p className="text-sm md:text-base text-black/45 leading-relaxed mb-4 max-w-xl mx-auto">
            El futuro no espera, y tus competidores tampoco. En Cosecha Creativa te ayudamos a convertir tu empresa en una organización más ágil, inteligente y preparada para crecer.
          </p>
          <p className="text-xs text-black/35 tracking-widest uppercase mb-10 max-w-xl mx-auto">
            Cosecha Creativa · Marketing, tecnología e inteligencia artificial para empresas que quieren escalar.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="group h-12 gap-2 rounded-full border border-black/10 bg-[#111] px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-[#222] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]"
            >
              <a href={getWhatsAppHref("AI First para empresas")} target="_blank" rel="noopener noreferrer">
                <WhatsAppMark className="size-[18px] shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
                Iniciar Diagnóstico Gratis
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 rounded-full border-black/20 bg-transparent px-8 text-sm font-medium text-[#111] transition-all hover:bg-black/[0.04]"
            >
              <a href="mailto:contacto@cosechacreativa.com.ar?subject=Servicio%20AI%20First">Hablar por Email</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <FooterSection />
    </div>
  )
}
