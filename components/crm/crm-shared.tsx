"use client"

import { SOURCE_LABEL, STATUS_LABEL, STATUS_STYLE } from "@/lib/crm/constants"
import type { CrmLead, LeadStatus } from "@/lib/crm/types"
import type { SocialPlatform } from "@/lib/crm/social-types"
import { cn } from "@/lib/utils"
import { Facebook, Instagram, Linkedin } from "lucide-react"

export function CrmAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#eca8d6]/12 blur-[100px]" />
      <div className="absolute -right-24 top-1/4 h-[380px] w-[380px] rounded-full bg-[#a100f2]/14 blur-[110px]" />
      <div className="absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-cyan-500/8 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  )
}

export function PriorityBadge({ score, compact }: { score?: number; compact?: boolean }) {
  const s = score ?? 50
  const color =
    s >= 75 ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200" : s >= 50
      ? "border-amber-400/35 bg-amber-500/12 text-amber-100"
      : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium tabular-nums",
        compact ? "px-1.5 py-0 text-[9px]" : "px-2 py-0.5 text-[10px]",
        color,
      )}
      title="Prioridad IA"
    >
      {s}
    </span>
  )
}

export function TemperatureBadge({ score, compact }: { score?: number; compact?: boolean }) {
  const s = score ?? 50
  let label = "Frío ❄️"
  let color = "border-cyan-500/25 bg-cyan-500/8 text-cyan-300"
  if (s >= 75) {
    label = "Fuego 🔥"
    color = "border-orange-500/40 bg-orange-500/20 text-orange-400 animate-pulse font-semibold"
  } else if (s >= 45) {
    label = "Cálido 🧉"
    color = "border-amber-400/30 bg-amber-500/10 text-amber-200"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase",
        compact ? "px-1.5 py-0 text-[8px]" : "px-2 py-0.5 text-[9px]",
        color,
      )}
    >
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        s.border,
        s.bg,
        s.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {STATUS_LABEL[status]}
    </span>
  )
}

export function LeadCardPreview({
  lead,
  compact,
  onClick,
  draggable,
  onDragStart,
}: {
  lead: CrmLead
  compact?: boolean
  onClick?: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
}) {
  const title = lead.name || lead.email || "Sin nombre"
  const source = SOURCE_LABEL[lead.source] ?? lead.source
  const s = lead.priorityScore ?? 50
  const isHot = s >= 75

  return (
    <article
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl border p-3.5 shadow-lg shadow-black/20 transition-all",
        isHot
          ? "border-orange-500/30 bg-gradient-to-br from-orange-500/[0.08] to-black/60 shadow-[0_0_15px_rgba(249,115,22,0.08)] hover:border-orange-500/50"
          : "border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40 hover:border-[#eca8d6]/35 hover:shadow-[#eca8d6]/10",
        draggable && "cursor-grab active:cursor-grabbing",
        compact && "p-3",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={cn("font-medium text-white", compact ? "text-sm" : "text-[15px]")}>
          {title}
        </h3>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {!compact ? <StatusBadge status={lead.status} /> : null}
          <div className="flex items-center gap-1.5">
            <PriorityBadge score={lead.priorityScore} compact={compact} />
            <TemperatureBadge score={lead.priorityScore} compact={compact} />
          </div>
        </div>
      </div>
      {lead.company ? (
        <p className="mt-1 text-xs text-[#eca8d6]/80">{lead.company}</p>
      ) : null}
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/45">{lead.summary}</p>
      {lead.serviceInterest?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {lead.serviceInterest.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/55"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}
      {lead.tags?.length ? (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {lead.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] text-[#eca8d6]/70">
              #{t}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-2.5 text-[10px] text-white/30">
        {source} · {formatRelative(lead.updatedAt)}
      </p>
    </article>
  )
}

export function PlatformIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const props = { className: cn("size-4", className), "aria-hidden": true as const }
  switch (platform) {
    case "instagram":
      return <Instagram {...props} />
    case "facebook":
      return <Facebook {...props} />
    case "linkedin":
      return <Linkedin {...props} />
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
        </svg>
      )
  }
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "ahora"
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `hace ${days}d`
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}
