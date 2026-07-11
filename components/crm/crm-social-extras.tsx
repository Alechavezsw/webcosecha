"use client"

import { EDITORIAL_STATUS_LABEL } from "@/lib/crm/constants"
import { PlatformIcon, formatDate } from "@/components/crm/crm-shared"
import type { EditorialPiece, SocialClient, SocialMetrics } from "@/lib/crm/social-types"
import { EDITORIAL_STATUSES } from "@/lib/crm/social-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Bot, Plus } from "lucide-react"
import { useMemo, useState } from "react"

export function CrmSocialEditorial({
  client,
  onSave,
  busy,
}: {
  client: SocialClient
  onSave: (editorial: EditorialPiece[]) => Promise<void>
  busy?: boolean
}) {
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })

  const pieces = useMemo(() => {
    const [y, m] = month.split("-").map(Number)
    return client.editorial
      .filter((p) => {
        const d = new Date(p.scheduledAt)
        return d.getFullYear() === y && d.getMonth() + 1 === m
      })
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  }, [client.editorial, month])

  const addPiece = () => {
    const d = new Date(`${month}-15T12:00:00`)
    const piece: EditorialPiece = {
      id: crypto.randomUUID(),
      title: "Nueva pieza",
      scheduledAt: d.toISOString(),
      status: "borrador",
      platform: client.platforms[0],
    }
    void onSave([...client.editorial, piece])
  }

  const aiCalendar = async () => {
    const res = await fetch(`/api/crm/social-clients/${client.id}/ai`, { method: "POST" })
    if (res.ok) {
      const data = (await res.json()) as { client: SocialClient }
      void onSave(data.client.editorial)
    }
  }

  const updatePiece = (id: string, patch: Partial<EditorialPiece>) => {
    void onSave(
      client.editorial.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    )
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wider text-white/45">
          Calendario editorial
        </h4>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="h-8 w-[140px] border-white/12 bg-black/40 text-xs text-white"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" className="h-7 border-white/15 text-xs" onClick={addPiece}>
          <Plus className="mr-1 size-3" />
          Pieza
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={busy}
          className="h-7 bg-[#eca8d6]/20 text-[11px] text-[#eca8d6]"
          onClick={() => void aiCalendar()}
        >
          <Bot className="mr-1 size-3" />
          IA: ideas del mes
        </Button>
      </div>
      <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
        {pieces.length === 0 ? (
          <li className="text-xs text-white/35">Sin piezas este mes.</li>
        ) : (
          pieces.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5"
            >
              {p.platform ? <PlatformIcon platform={p.platform} className="size-3 text-white/50" /> : null}
              <Input
                value={p.title}
                onChange={(e) => updatePiece(p.id, { title: e.target.value })}
                className="h-7 min-w-0 flex-1 border-0 bg-transparent text-xs text-white"
              />
              <select
                value={p.status}
                onChange={(e) =>
                  updatePiece(p.id, { status: e.target.value as EditorialPiece["status"] })
                }
                className="rounded border border-white/10 bg-black/50 px-1 py-0.5 text-[10px] text-white"
              >
                {EDITORIAL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {EDITORIAL_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-white/35">{formatDate(p.scheduledAt)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export function CrmSocialMetrics({
  client,
  onSave,
}: {
  client: SocialClient
  onSave: (metrics: SocialMetrics) => Promise<void>
}) {
  const m = client.metrics ?? { updatedAt: new Date().toISOString() }
  const [followers, setFollowers] = useState(String(m.followers ?? ""))
  const [reach, setReach] = useState(String(m.reach ?? ""))
  const [engagement, setEngagement] = useState(String(m.engagementRate ?? ""))

  const save = () => {
    void onSave({
      updatedAt: new Date().toISOString(),
      followers: followers ? Number(followers) : undefined,
      reach: reach ? Number(reach) : undefined,
      engagementRate: engagement ? Number(engagement) : undefined,
    })
  }

  const health =
    m.engagementRate != null && m.engagementRate >= 3
      ? "Buena"
      : m.engagementRate != null && m.engagementRate >= 1
        ? "Media"
        : "Revisar"

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-white/45">
          Salud de la cuenta
        </h4>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px]",
            health === "Buena" && "bg-emerald-500/15 text-emerald-300",
            health === "Media" && "bg-amber-500/15 text-amber-200",
            health === "Revisar" && "bg-white/10 text-white/50",
          )}
        >
          {health}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <MetricInput label="Seguidores" value={followers} onChange={setFollowers} />
        <MetricInput label="Alcance" value={reach} onChange={setReach} />
        <MetricInput label="Eng. %" value={engagement} onChange={setEngagement} />
      </div>
      <Button
        type="button"
        size="sm"
        className="mt-2 h-7 text-xs"
        variant="outline"
        onClick={save}
      >
        Guardar métricas
      </Button>
    </div>
  )
}

function MetricInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-[10px] text-white/35">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 h-8 border-white/10 bg-black/40 text-xs text-white"
      />
    </label>
  )
}
