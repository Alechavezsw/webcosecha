"use client"

import { ASSISTANT_WELCOME } from "@/lib/cosecha-assistant-replies"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { MessageCircle, Send, X, Bot, Sparkles } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SESSION_KEY = "cosecha_crm_session_id"
const easePremium = [0.22, 1, 0.36, 1] as const

type ChatMsg = { id: string; role: "user" | "assistant"; text: string }

const SUGGESTIONS = [
  "🚀 ¿Cómo automatizar con IA?",
  "✨ ¿Qué es Diseño Web Premium?",
  "📈 ¿Cómo vender en San Juan?",
  "🗳️ Estrategias de Compol (Política)",
  "👤 Hablar con un humano"
]

function getSessionId() {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

// Helper to parse basic markdown links: [label](url)
function parseMessageText(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (match) {
      const label = match[1]
      const href = match[2]
      const isExternal = href.startsWith("http")
      return (
        <a
          key={i}
          href={href}
          className="text-[#eca8d6] hover:text-[#f0b8e0] font-semibold underline transition-colors"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {label}
        </a>
      )
    }
    return part
  })
}

export function CosechaCrmChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const waHref = getWhatsAppHref("Chat web — Cosecha Creativa")

  useEffect(() => {
    if (!open) return
    setMessages([{ id: "welcome", role: "assistant", text: ASSISTANT_WELCOME }])
    setInput("")
    setError(null)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || typing) return

    setInput("")
    setError(null)
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text }])
    setTyping(true)

    try {
      const res = await fetch("/api/crm/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          message: text,
          source: "web-widget",
        }),
      })
      const data = (await res.json()) as { reply?: string; sessionId?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? "Error de red")

      if (data.sessionId) localStorage.setItem(SESSION_KEY, data.sessionId)

      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: data.reply ?? "Sin respuesta." },
      ])
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo enviar"
      setError(msg)
    } finally {
      setTyping(false)
    }
  }, [input, typing])

  const handleSuggestionClick = (suggestion: string) => {
    // Strip the prefix emoji if any
    const cleanText = suggestion.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]\s*/, "")
    void sendMessage(cleanText)
  }

  return (
    <>
      {/* Floating glowing button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-5 right-5 z-[200] flex size-14 items-center justify-center rounded-full cursor-pointer",
          "bg-gradient-to-br from-[#eca8d6] to-[#a100f2] text-black shadow-[0_12px_45px_-5px_rgba(236,168,214,0.7)] border border-white/20",
          "transition-all duration-300"
        )}
        aria-label="Abrir chat con Cosecha Creativa"
      >
        <MessageCircle className="size-6 text-black" aria-hidden />
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className={cn(
            "flex !h-[calc(100dvh-2rem)] !max-h-[720px] !w-[min(100vw-1rem,420px)] flex-col !gap-0 !overflow-hidden",
            "!rounded-2xl !border !border-white/15 !bg-black/90 !backdrop-blur-2xl !p-0 !text-white",
            "!bottom-4 !right-3 !top-auto !left-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)] [&>button]:hidden",
          )}
        >
          <SheetTitle className="sr-only">Chat Cosecha Creativa</SheetTitle>

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#eca8d6]/20 to-[#a100f2]/20 border border-[#eca8d6]/30">
                <Bot className="size-5 text-[#eca8d6]" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black ring-1 ring-emerald-400/50" />
              </div>
              <div>
                <p className="font-display text-base font-semibold leading-tight text-white flex items-center gap-1.5">
                  Cosecha Creativa
                  <Sparkles className="size-3.5 text-[#eca8d6]" />
                </p>
                <p className="text-[10px] tracking-wide font-mono text-white/45 uppercase">IA Asistente Comercial</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Conversation history area */}
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: easePremium }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm whitespace-pre-line",
                      m.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-[#eca8d6]/20 to-[#a100f2]/25 border border-[#eca8d6]/20 text-white"
                        : "rounded-bl-md border border-white/10 bg-white/[0.04] text-white/90",
                    )}
                  >
                    {parseMessageText(m.text)}
                  </div>
                </motion.div>
              ))}

              {/* Glowing animated Typing Indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#eca8d6] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a100f2] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#67e8f9] animate-bounce" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-xs text-red-400 font-mono pl-2">⚠️ Error: {error}</p>
            )}
          </div>

          {/* Bottom input section */}
          <div className="shrink-0 space-y-3 border-t border-white/10 p-4 bg-zinc-950/30">
            
            {/* Suggestions list chips */}
            {messages.length <= 2 && !typing && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3 py-1.5",
                      "text-[10px] font-semibold text-white/80 transition-all hover:text-white cursor-pointer"
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    void sendMessage()
                  }
                }}
                placeholder="Escribí tu consulta..."
                className="h-11 border-white/15 bg-white/[0.05] text-white placeholder:text-white/35 rounded-xl"
                disabled={typing}
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void sendMessage()}
                disabled={typing || !input.trim()}
                className="h-11 w-11 shrink-0 bg-[#eca8d6] text-black hover:bg-[#f0b8e0] rounded-xl transition-all cursor-pointer"
                aria-label="Enviar"
              >
                <Send className="size-4" />
              </Button>
            </div>
            
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-[#eca8d6]/90 hover:underline">
              Preferís WhatsApp →
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
