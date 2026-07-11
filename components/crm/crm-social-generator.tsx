"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SocialClient } from "@/lib/crm/social-types"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  FileText,
  Instagram,
  Bot,
  X,
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CrmSocialGenerator({ client }: { client: SocialClient }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"post" | "stories">("post")
  const [topic, setTopic] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || loading) return
    setLoading(true)
    setError(null)
    setOutput("")

    try {
      const res = await fetch(`/api/crm/social-clients/${client.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic }),
      })
      const data = (await res.json()) as { reply?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? "Error al conectar con la IA")
      if (data.reply) setOutput(data.reply)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al redactar la pieza")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-white/45">
          Copiloto Creativo IA
        </h4>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-xs text-[#eca8d6] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
        >
          {open ? "Cerrar redactor" : "✨ Redactar Post / Historias"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3 space-y-3"
          >
            {/* Post vs Stories selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("post")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition cursor-pointer",
                  type === "post"
                    ? "border-[#eca8d6]/50 bg-[#eca8d6]/15 text-[#eca8d6]"
                    : "border-white/10 bg-black/40 text-white/60 hover:text-white"
                )}
              >
                <Instagram className="size-3.5" /> Post para Feed
              </button>
              <button
                type="button"
                onClick={() => setType("stories")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition cursor-pointer",
                  type === "stories"
                    ? "border-[#eca8d6]/50 bg-[#eca8d6]/15 text-[#eca8d6]"
                    : "border-white/10 bg-black/40 text-white/60 hover:text-white"
                )}
              >
                <FileText className="size-3.5" /> Secuencia Historias
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => void handleGenerate(e)} className="flex gap-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  type === "post"
                    ? "Ej: Promo 20% off en páginas web, o Tips de branding..."
                    : "Ej: Trivia interactiva sobre marketing, o Detrás de escena..."
                }
                className="h-9 border-white/12 bg-black/40 text-xs text-white placeholder:text-white/20"
                disabled={loading}
                required
              />
              <Button
                type="submit"
                disabled={loading || !topic.trim()}
                className="h-9 bg-[#eca8d6] text-black hover:bg-[#f0b8e0] rounded-lg cursor-pointer flex items-center gap-1 text-xs shrink-0"
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                Redactar
              </Button>
            </form>

            {/* Loading text state */}
            {loading && (
              <p className="text-[10px] font-mono text-[#eca8d6]/80 animate-pulse pl-1">
                🧉 Creando contenido sanjuanino con Gemini...
              </p>
            )}

            {error && (
              <p className="text-[10px] font-mono text-red-400 pl-1">
                ⚠️ {error}
              </p>
            )}

            {/* AI Generated Output Display */}
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/8 bg-black/50 p-3.5 space-y-2.5 relative"
              >
                <div className="flex items-center justify-between border-b border-white/8 pb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#eca8d6] flex items-center gap-1.5">
                    <Bot className="size-3" /> Propuesta Copiloto IA
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="text-[10px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="whitespace-pre-line text-[11px] leading-relaxed text-white/85 font-sans max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {output}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
