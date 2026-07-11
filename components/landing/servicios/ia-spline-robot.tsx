"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Application, SplineEvent } from "@splinetool/runtime"
import { Send } from "lucide-react"
import { SplineScene } from "@/components/ui/spline-scene"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ASSISTANT_WELCOME } from "@/lib/cosecha-assistant-replies"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "framer-motion"

type ChatMsg = { id: string; role: "user" | "assistant"; text: string }

const SESSION_KEY = "cosecha_crm_session_ia"

function getSessionId() {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function FallingStars({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const stars = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        id: i,
        left: `${((i * 53) % 97) + (i % 5)}%`,
        duration: 5 + (i % 9),
        delay: (i % 14) * 0.35,
        tiny: i % 4 !== 0,
      })),
    [],
  )

  if (reduceMotion) {
    return (
      <div
        className={cn("pointer-events-none absolute inset-0 opacity-[0.15]", className)}
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 20% 30%, white, transparent), radial-gradient(1px 1px at 60% 70%, white, transparent), radial-gradient(1px 1px at 80% 20%, white, transparent)",
          backgroundSize: "100% 100%",
        }}
      />
    )
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {stars.map((s) => (
        <span
          key={s.id}
          className={cn("cc-falling-star", s.tiny ? "h-px w-px" : "h-[3px] w-[3px]")}
          style={{
            left: s.left,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function IaSplineRobot({
  scene,
  canvasClassName,
  className,
}: {
  scene: string
  canvasClassName?: string
  className?: string
}) {
  const canvasPointerCleanupRef = useRef<(() => void) | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const whatsAppHref = useMemo(() => getWhatsAppHref("Chat asistente IA — Cosecha Creativa"), [])

  const openRobotChat = useCallback(() => {
    setChatOpen(true)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12)
    }
  }, [])

  useEffect(() => {
    return () => {
      canvasPointerCleanupRef.current?.()
      canvasPointerCleanupRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!chatOpen) return
    setMessages([{ id: `welcome-${Date.now()}`, role: "assistant", text: ASSISTANT_WELCOME }])
    setInput("")
    setTyping(false)
  }, [chatOpen])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  const onLoad = useCallback(
    (app: Application) => {
      canvasPointerCleanupRef.current?.()
      const canvas = app.canvas
      if (!canvas) return

      const onCanvasPointerDown = () => {
        openRobotChat()
      }

      canvas.addEventListener("pointerdown", onCanvasPointerDown, { passive: true })
      canvasPointerCleanupRef.current = () => {
        canvas.removeEventListener("pointerdown", onCanvasPointerDown)
      }
    },
    [openRobotChat],
  )

  const handleSplineMeshEvent = useCallback(() => {
    openRobotChat()
  }, [openRobotChat])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || typing) return

    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text }
    setInput("")
    setMessages((m) => [...m, userMsg])
    setTyping(true)

    try {
      const res = await fetch("/api/crm/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          message: text,
          source: "ia-robot",
        }),
      })
      const data = (await res.json()) as { reply?: string; sessionId?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? "Error de red")
      if (data.sessionId) localStorage.setItem(SESSION_KEY, data.sessionId)
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: data.reply ?? "Sin respuesta." },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "No pude responder ahora. Escribinos por WhatsApp o probá de nuevo en un momento.",
        },
      ])
    } finally {
      setTyping(false)
    }
  }, [input, typing])

  return (
    <div className={cn("relative overflow-hidden rounded-[28px]", className)}>
      <FallingStars className="z-0" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_80%_at_50%_-20%,rgba(103,232,249,0.09),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-[2] p-2 md:p-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-inner shadow-black/60 ring-1 ring-white/[0.06]">
          <SplineScene
            scene={scene}
            className={cn(
              "h-[min(52vh,520px)] min-h-[280px] w-full md:h-[min(56vh,600px)]",
              canvasClassName,
            )}
            onLoad={onLoad}
            onSplineMouseDown={handleSplineMeshEvent}
          />
        </div>
      </div>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent
          side="right"
          className={cn(
            "flex !h-[calc(100dvh-5.5rem)] !max-h-[760px] !w-[min(100vw-1.25rem,420px)] flex-col !gap-0 !overflow-hidden !rounded-2xl !border !border-white/15 !bg-zinc-950 !p-0 !text-white !shadow-2xl !shadow-cyan-950/45",
            "!inset-y-auto !bottom-6 !left-auto !right-3 !top-24 sm:!right-5 md:!top-28",
            "!data-[state=closed]:slide-out-to-right !data-[state=open]:slide-in-from-right",
          )}
        >
          <SheetTitle className="sr-only">Chat con el asistente de Cosecha Creativa</SheetTitle>

          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/35 bg-cyan-500/15 text-cyan-100">
              <BotGlyph />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-base text-white">Cosecha Creativa</p>
              <p className="truncate text-xs text-white/45">En línea · respuestas automáticas</p>
            </div>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed md:text-sm",
                    m.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-cyan-600/35 to-fuchsia-600/25 text-white"
                      : "rounded-bl-md border border-white/[0.08] bg-white/[0.06] text-white/90",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.06] px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            ) : null}
          </div>

          <form
            className="shrink-0 border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault()
              void sendMessage()
            }}
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí tu mensaje…"
                maxLength={2000}
                className="h-11 flex-1 rounded-full border-white/15 bg-black/50 text-[13px] text-white placeholder:text-white/35 focus-visible:ring-cyan-500/40"
                autoComplete="off"
                aria-label="Tu mensaje"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || typing}
                className="size-11 shrink-0 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40"
                aria-label="Enviar"
              >
                <Send className="size-5" />
              </Button>
            </div>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-[11px] text-white/40 underline-offset-2 hover:text-cyan-300/90 hover:underline"
            >
              Preferís hablar con una persona → WhatsApp
            </a>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function BotGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M12 4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth={1.25}
      />
      <circle cx={9} cy={13} r={1.25} fill="currentColor" />
      <circle cx={15} cy={13} r={1.25} fill="currentColor" />
    </svg>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block size-1.5 animate-pulse rounded-full bg-white/55"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
      <span className="sr-only">Escribiendo…</span>
    </span>
  )
}
