"use client"

import { collectRecentActivity } from "@/lib/crm/stats"
import type { CrmLead } from "@/lib/crm/types"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"

const TYPE_LABEL: Record<string, string> = {
  ai: "IA",
  status: "Estado",
  automation: "Auto",
  proposal: "Propuesta",
  task: "Tarea",
  lead: "Lead",
  tag: "Etiqueta",
}

export function CrmActivityFeed({
  leads,
  onSelectLead,
  limit = 12,
}: {
  leads: CrmLead[]
  onSelectLead: (id: string) => void
  limit?: number
}) {
  const items = collectRecentActivity(leads, limit)

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-4 text-[#eca8d6]/80" />
        <h3 className="text-sm font-medium text-white">Actividad reciente</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-white/40">Sin actividad registrada.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={`${item.leadId}-${item.id}`}>
              <button
                type="button"
                onClick={() => onSelectLead(item.leadId)}
                className="flex w-full gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/[0.04]"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium uppercase",
                    item.type === "ai" && "bg-[#eca8d6]/15 text-[#eca8d6]",
                    item.type === "automation" && "bg-cyan-500/15 text-cyan-300",
                    item.type === "lead" && "bg-emerald-500/15 text-emerald-300",
                    !["ai", "automation", "lead"].includes(item.type) && "bg-white/10 text-white/50",
                  )}
                >
                  {TYPE_LABEL[item.type] ?? item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/80">
                    <span className="text-white/50">{item.leadName} · </span>
                    {item.text}
                  </p>
                  <p className="text-[10px] text-white/30">
                    {new Date(item.at).toLocaleString("es-AR")}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
