"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { getWhatsAppHref } from "@/lib/whatsapp"

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4"

export function DisenoHero() {
  const [mounted, setMounted] = useState(false)
  const [framesReady, setFramesReady] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [heroInView, setHeroInView] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoBgRef = useRef<HTMLDivElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLCanvasElement[]>([])

  const waHref = getWhatsAppHref("Diseño Gráfico")

  useEffect(() => {
    setMounted(true)
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 0px 0px" },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const video = videoRef.current
    if (!video) return

    let capturing = true
    let lastTime = -1
    const MAX_WIDTH = 960
    const frames: HTMLCanvasElement[] = []
    let rafId = 0

    const captureFrame = () => {
      if (!capturing || video.readyState < 2 || video.currentTime === lastTime) return
      lastTime = video.currentTime
      const scale = Math.min(1, MAX_WIDTH / video.videoWidth)
      const w = Math.floor(video.videoWidth * scale)
      const h = Math.floor(video.videoHeight * scale)
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(video, 0, 0, w, h)
      frames.push(canvas)
    }

    const loop = () => {
      captureFrame()
      if (capturing) {
        if ("requestVideoFrameCallback" in video) {
          video.requestVideoFrameCallback(() => {
            rafId = requestAnimationFrame(loop)
          })
        } else {
          rafId = requestAnimationFrame(loop)
        }
      }
    }

    const onLoaded = () => {
      void video.play().catch(() => {})
      loop()
    }

    const onEnded = () => {
      capturing = false
      cancelAnimationFrame(rafId)
      if (frames.length > 0) {
        framesRef.current = frames
        setFramesReady(true)
      }
    }

    video.addEventListener("loadedmetadata", onLoaded)
    video.addEventListener("ended", onEnded)
    if (video.readyState >= 1) onLoaded()

    return () => {
      capturing = false
      cancelAnimationFrame(rafId)
      video.removeEventListener("loadedmetadata", onLoaded)
      video.removeEventListener("ended", onEnded)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (!framesReady || reduceMotion || !heroInView) return

    const canvas = displayCanvasRef.current
    const frames = framesRef.current
    if (!canvas || frames.length === 0) return

    canvas.width = frames[0].width
    canvas.height = frames[0].height
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let index = 0
    let direction = 1
    let last = performance.now()
    const interval = 1000 / 30
    let animId = 0

    const render = (now: number) => {
      if (now - last >= interval) {
        ctx.drawImage(frames[index], 0, 0)
        index += direction
        if (index >= frames.length - 1) {
          index = frames.length - 1
          direction = -1
        } else if (index <= 0) {
          index = 0
          direction = 1
        }
        last = now
      }
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [framesReady, reduceMotion, heroInView])

  useEffect(() => {
    if (reduceMotion || !heroInView) {
      if (videoBgRef.current) gsap.set(videoBgRef.current, { x: 0, y: 0 })
      return
    }

    const strength = 20
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let animId = 0

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      targetX = ((e.clientX - cx) / cx) * strength
      targetY = ((e.clientY - cy) / cy) * strength
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      if (videoBgRef.current) {
        gsap.set(videoBgRef.current, { x: currentX, y: currentY })
      }
      animId = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    animId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(animId)
    }
  }, [reduceMotion, heroInView])

  return (
    <section
      ref={sectionRef}
      className="relative isolate z-[1] h-screen min-h-[640px] w-full overflow-hidden bg-[#030308] text-white"
    >
      <div
        ref={videoBgRef}
        className={`pointer-events-none absolute inset-0 z-0 origin-center scale-[1.08] transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          heroInView ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
          style={{ display: framesReady && !reduceMotion ? "none" : "block" }}
        />
        <canvas
          ref={displayCanvasRef}
          className="h-full w-full object-cover"
          style={{ display: framesReady && !reduceMotion ? "block" : "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#030308]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(236,168,214,0.12)_0%,transparent_55%)]" />
        <div
          className="absolute inset-x-0 bottom-0 z-[1] h-[min(42vh,320px)] bg-gradient-to-b from-transparent via-[#030308]/40 to-[#030308]"
          aria-hidden
        />
      </div>

      <div
        className={`pointer-events-none absolute left-0 right-0 z-20 w-full px-4 transition-all duration-500 ${
          mounted && heroInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ top: "126px" }}
      >
        <h1 className="cc-hero-title select-none text-center text-white">Diseño</h1>
      </div>

      <div
        className={`pointer-events-none absolute bottom-12 left-0 right-0 z-30 flex items-end justify-between px-6 transition-all duration-500 md:px-10 ${
          mounted && heroInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <p className="hidden max-w-[220px] text-sm font-light leading-relaxed text-white/75 md:block">
          Diseño gráfico y digital con mirada estratégica: piezas que comunican, venden y destacan tu
          marca.
        </p>

        <div className="pointer-events-auto absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_0_0_rgba(255,255,255,0)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] active:scale-[0.97]"
          >
            <span className="relative z-10">Pedir presupuesto</span>
            <span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </a>
          <Link
            href="#que-hacemos"
            scroll
            className="liquid-glass group relative z-[1] rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)] active:scale-[0.97]"
          >
            Ver servicios
          </Link>
        </div>

        <p className="hidden max-w-[220px] text-right text-sm font-light leading-relaxed text-white/75 md:block">
          Identidad coherente para redes, ads, web, eventos y materiales comerciales.
        </p>
      </div>
    </section>
  )
}
