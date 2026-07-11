"use client"

import { KANBAN_STATUSES, STATUS_LABEL, STATUS_STYLE } from "@/lib/crm/constants"
import { LeadCardPreview } from "@/components/crm/crm-shared"
import type { CrmLead, LeadStatus } from "@/lib/crm/types"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function CrmKanban({
  leads,
  onSelect,
  onStatusChange,
}: {
  leads: CrmLead[]
  onSelect: (id: string) => void
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>
}) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<LeadStatus | null>(null)

  const archived = leads.filter((l) => l.status === "perdido")
  const boardLeads = leads.filter((l) => l.status !== "perdido")

  const handleDrop = async (status: LeadStatus) => {
    if (!dragId) return
    const lead = leads.find((l) => l.id === dragId)
    if (lead && lead.status !== status) {
      await onStatusChange(dragId, status)
    }
    setDragId(null)
    setOverCol(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-white">Pipeline Kanban</h2>
          <p className="mt-1 text-sm text-white/45">
            Arrastrá las tarjetas entre columnas para actualizar el estado del lead.
          </p>
        </div>
        {archived.length > 0 ? (
          <p className="text-xs text-white/40">
            {archived.length} en archivo (perdidos)
          </p>
        ) : null}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_STATUSES.map((status) => {
          const colLeads = boardLeads.filter((l) => l.status === status)
          const style = STATUS_STYLE[status]
          const isOver = overCol === status

          return (
            <div
              key={status}
              className={cn(
                "flex w-[min(100%,280px)] shrink-0 flex-col rounded-2xl border transition-colors",
                style.border,
                isOver ? "bg-white/[0.06] ring-2 ring-[#eca8d6]/30" : "bg-black/25",
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setOverCol(status)
              }}
              onDragLeave={() => setOverCol(null)}
              onDrop={(e) => {
                e.preventDefault()
                void handleDrop(status)
              }}
            >
              <div
                className={cn(
                  "flex items-center justify-between border-b border-white/8 px-4 py-3",
                  style.bg,
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", style.dot)} />
                  <span className={cn("text-sm font-medium", style.text)}>
                    {STATUS_LABEL[status]}
                  </span>
                </div>
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-xs text-white/50">
                  {colLeads.length}
                </span>
              </div>

              <div className="flex max-h-[calc(100vh-280px)] min-h-[200px] flex-col gap-2 overflow-y-auto p-3">
                {colLeads.length === 0 ? (
                  <p className="py-8 text-center text-xs text-white/25">Sin leads</p>
                ) : (
                  colLeads.map((lead) => (
                    <div key={lead.id} className="group/kanbancard relative flex flex-col gap-1">
                      <LeadCardPreview
                        lead={lead}
                        compact
                        draggable
                        onDragStart={(e) => {
                          setDragId(lead.id)
                          e.dataTransfer.effectAllowed = "move"
                        }}
                        onClick={() => onSelect(lead.id)}
                      />
                      {/* Mobile & Touch quick stage switcher */}
                      <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 transition-opacity lg:opacity-0 lg:group-hover/kanbancard:opacity-100">
                        <span className="text-[9px] font-medium text-white/40 shrink-0">Mover a:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => void onStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="w-full border-0 bg-transparent p-0 text-[10px] font-semibold text-[#eca8d6] focus:outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="nuevo" className="bg-[#030308] text-white text-xs">Nuevo</option>
                          <option value="contactado" className="bg-[#030308] text-white text-xs">Contactado</option>
                          <option value="calificado" className="bg-[#030308] text-white text-xs">Calificado</option>
                          <option value="ganado" className="bg-[#030308] text-white text-xs">Ganado</option>
                          <option value="perdido" className="bg-[#030308] text-white text-xs">Perdido (Archivo)</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {archived.length > 0 ? (
        <section className="rounded-2xl border border-zinc-700/40 bg-zinc-900/30 p-4">
          <h3 className="text-sm font-medium text-zinc-400">Archivo · Perdidos</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {archived.map((lead) => (
              <LeadCardPreview
                key={lead.id}
                lead={lead}
                compact
                onClick={() => onSelect(lead.id)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
