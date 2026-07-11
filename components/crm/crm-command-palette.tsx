"use client"

import type { CrmLead } from "@/lib/crm/types"
import { cn } from "@/lib/utils"
import { PriorityBadge } from "@/components/crm/crm-shared"
import { Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export function CrmCommandPalette({
  leads,
  open,
  onOpenChange,
  onSelectLead,
}: {
  leads: CrmLead[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectLead: (id: string) => void
}) {
  const [q, setQ] = useState("")

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) setQ("")
  }, [open])

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    const sorted = [...leads].sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
    if (!query) return sorted.slice(0, 8)
    return sorted
      .filter(
        (l) =>
          l.name?.toLowerCase().includes(query) ||
          l.email?.toLowerCase().includes(query) ||
          l.company?.toLowerCase().includes(query) ||
          l.tags.some((t) => t.includes(query)),
      )
      .slice(0, 12)
  }, [leads, q])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm">
      <button type="button" className="absolute inset-0" aria-label="Cerrar" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Search className="size-4 text-white/40" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar leads, emails, etiquetas… (Ctrl+K)"
            className="h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
          <button type="button" onClick={() => onOpenChange(false)} className="text-white/40 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-white/40">Sin resultados</li>
          ) : (
            results.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectLead(l.id)
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-white/[0.06]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {l.name || l.email || "Sin nombre"}
                    </p>
                    <p className="truncate text-xs text-white/40">
                      {l.company ?? l.status} · {l.assignee}
                    </p>
                  </div>
                  <PriorityBadge score={l.priorityScore} compact />
                </button>
              </li>
            ))
          )}
        </ul>
        <p className="border-t border-white/8 px-4 py-2 text-[10px] text-white/30">
          ↑↓ navegar · Enter abrir · Esc cerrar
        </p>
      </div>
    </div>
  )
}
