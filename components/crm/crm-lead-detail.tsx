"use client"

import { LEAD_STATUSES, type CrmLead, type LeadStatus } from "@/lib/crm/types"
import { STATUS_LABEL } from "@/lib/crm/constants"
import { StatusBadge } from "@/components/crm/crm-shared"
import { cn } from "@/lib/utils"
import { Mail, MessageSquare, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CrmLeadDetail({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: CrmLead
  onClose?: () => void
  onStatusChange: (status: LeadStatus) => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl tracking-tight text-white">
              {lead.name || "Lead sin nombre"}
            </h2>
            <StatusBadge status={lead.status} />
          </div>
          {lead.company ? (
            <p className="mt-1 text-sm text-[#eca8d6]/85">{lead.company}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/55">
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Mail className="size-3.5" />
                {lead.email}
              </a>
            ) : null}
            {lead.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {lead.phone}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            className="rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {lead.serviceInterest?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {lead.serviceInterest.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[#eca8d6]/25 bg-[#eca8d6]/10 px-2.5 py-0.5 text-xs text-[#f0c4e4]"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-sm leading-relaxed text-white/70">
        {lead.summary}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
        <MessageSquare className="size-3.5" />
        {lead.messages.length} mensajes en el chat
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {lead.messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              m.role === "user"
                ? "ml-6 border border-[#eca8d6]/20 bg-gradient-to-br from-[#eca8d6]/18 to-[#a100f2]/8 text-white"
                : "mr-6 border border-white/10 bg-black/45 text-white/88",
            )}
          >
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/35">
              {m.role === "user" ? "Visitante" : "Asistente Cosecha"}
            </p>
            {m.text}
          </div>
        ))}
      </div>
    </div>
  )
}
