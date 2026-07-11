"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  X,
  Copy,
  Check,
  Loader2,
  FileText,
  Trash2,
  RotateCcw,
} from "lucide-react"
import { useEffect, useState } from "react"

export function CrmAiNotepad() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [aiOutput, setAiOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load note from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cosecha_crm_notepad")
    if (saved) setNote(saved)
  }, [])

  // Auto-save note to localStorage
  const handleNoteChange = (text: string) => {
    setNote(text)
    localStorage.setItem("cosecha_crm_notepad", text)
  }

  const runAiAction = async (action: "enrich" | "rioplatense" | "social" | "tasks") => {
    if (!note.trim() || loading) return
    setLoading(true)
    setError(null)
    setAiOutput("")

    try {
      const res = await fetch("/api/crm/ai-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: note, action }),
      })
      const data = (await res.json()) as { reply?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? "No se pudo procesar la solicitud")
      if (data.reply) setAiOutput(data.reply)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al conectar con la IA")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const replaceNoteWithOutput = () => {
    if (!aiOutput) return
    handleNoteChange(aiOutput)
    setAiOutput("")
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-[100] flex size-12 items-center justify-center rounded-full cursor-pointer",
          "bg-gradient-to-br from-[#eca8d6] to-[#a100f2] text-black shadow-[0_8px_30px_rgba(236,168,214,0.4)] border border-white/20",
          "transition-all duration-300"
        )}
        aria-label="Abrir Bloc de Notas Comercial con IA"
        title="Bloc de Notas Comercial con IA"
      >
        <FileText className="size-5 text-black" aria-hidden />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#67e8f9] text-[9px] font-bold text-black border border-black animate-pulse">
          IA
        </span>
      </motion.button>

      {/* Slide-out Sidebar Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Dark semi-transparent overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[110] bg-black"
            />

            {/* Note Panel Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={cn(
                "fixed bottom-0 right-0 top-0 z-[120] flex h-full w-[min(100vw,440px)] flex-col gap-0 overflow-hidden",
                "border-l border-white/10 bg-black/90 backdrop-blur-2xl p-0 text-white shadow-2xl"
              )}
            >
              {/* Drawer Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 bg-zinc-950/60">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#eca8d6]/20 text-[#eca8d6]">
                    <FileText className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                      Bloc de Notas IA
                      <Sparkles className="size-3.5 text-[#eca8d6] animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-white/45">Borradores y minutas comerciales</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Note Editor Area */}
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="space-y-2">
                  <label htmlFor="crm-scratchpad" className="text-[11px] font-semibold uppercase tracking-wider text-white/45 flex items-center justify-between">
                    <span>Escribí tu borrador o notas de reunión:</span>
                    {note && (
                      <button
                        type="button"
                        onClick={() => handleNoteChange("")}
                        className="text-red-400 hover:text-red-300 font-normal normal-case flex items-center gap-1 transition-colors cursor-pointer"
                        title="Borrar todo"
                      >
                        <Trash2 className="size-3" /> Limpiar
                      </button>
                    )}
                  </label>
                  <textarea
                    id="crm-scratchpad"
                    value={note}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Ejemplo: Reunión con Inmobiliaria San Juan. El cliente quiere un sitio web premium de propiedades, presupuesto de $1.2M ARS, necesita automatización para responder consultas de WhatsApp..."
                    className={cn(
                      "w-full h-36 rounded-xl border border-white/15 bg-white/[0.04] p-3 text-xs leading-relaxed text-white",
                      "placeholder:text-white/25 focus:border-[#eca8d6]/50 focus:outline-none focus:ring-1 focus:ring-[#eca8d6]/30",
                      "resize-none transition-all scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    )}
                  />
                </div>

                {/* AI Operations Chips */}
                {note.trim() && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#eca8d6]/75">
                      Copiloto IA - Procesar Nota:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={loading}
                        onClick={() => void runAiAction("enrich")}
                        className="h-8 rounded-full border border-white/15 bg-white/[0.04] text-[11px] text-white hover:bg-white/[0.08]"
                      >
                        ✍️ Enriquecer Minuta
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={loading}
                        onClick={() => void runAiAction("rioplatense")}
                        className="h-8 rounded-full border border-white/15 bg-white/[0.04] text-[11px] text-white hover:bg-white/[0.08]"
                      >
                        🧉 Tono Sanjuanino
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={loading}
                        onClick={() => void runAiAction("social")}
                        className="h-8 rounded-full border border-white/15 bg-white/[0.04] text-[11px] text-white hover:bg-white/[0.08]"
                      >
                        🚀 Generar Post
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={loading}
                        onClick={() => void runAiAction("tasks")}
                        className="h-8 rounded-full border border-white/15 bg-white/[0.04] text-[11px] text-white hover:bg-white/[0.08]"
                      >
                        💡 Extraer Tareas
                      </Button>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-6 gap-2 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse">
                    <Loader2 className="size-6 text-[#eca8d6] animate-spin" />
                    <p className="text-[10px] text-white/45 font-mono">Cosechando ideas con Gemini...</p>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                    <p className="text-xs text-red-300 font-mono">⚠️ Error: {error}</p>
                  </div>
                )}

                {/* AI Output Area */}
                {aiOutput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-white/8 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#eca8d6] flex items-center gap-1">
                        <Sparkles className="size-3" /> Resultado Copiloto IA
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={replaceNoteWithOutput}
                          className="rounded p-1 text-[10px] text-white/50 hover:bg-white/10 hover:text-[#eca8d6] transition-colors cursor-pointer flex items-center gap-1 font-medium"
                          title="Reemplazar nota original con este resultado"
                        >
                          <RotateCcw className="size-3" /> Reemplazar nota
                        </button>
                        <button
                          type="button"
                          onClick={() => void copyToClipboard(aiOutput)}
                          className="rounded p-1 text-[10px] text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
                          title="Copiar texto"
                        >
                          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                          {copied ? "Copiado" : "Copiar"}
                        </button>
                      </div>
                    </div>
                    <div className="whitespace-pre-line text-xs leading-relaxed text-white/90 font-sans max-h-72 overflow-y-auto pr-1">
                      {aiOutput}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer info */}
              <div className="shrink-0 border-t border-white/10 p-4 bg-zinc-950/40 text-center">
                <p className="text-[9px] tracking-wide font-mono text-white/30">
                  COSECHA CREATIVA CRM · CONEXIÓN NATIVA CON GEMINI
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
