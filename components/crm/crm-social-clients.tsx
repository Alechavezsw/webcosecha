"use client"

import {
  SOCIAL_PLAN_LABEL,
  SOCIAL_STATUS_LABEL,
} from "@/lib/crm/constants"
import { PlatformIcon, formatDate } from "@/components/crm/crm-shared"
import type { SocialClient, SocialClientStatus, SocialPlan } from "@/lib/crm/social-types"
import { SOCIAL_PLANS, SOCIAL_PLATFORMS, SOCIAL_STATUSES } from "@/lib/crm/social-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CrmSocialEditorial, CrmSocialMetrics } from "@/components/crm/crm-social-extras"
import { CrmSocialGenerator } from "@/components/crm/crm-social-generator"
import { Plus, X } from "lucide-react"
import { useState } from "react"

export function CrmSocialClients({
  clients,
  onRefresh,
}: {
  clients: SocialClient[]
  onRefresh: () => Promise<void>
}) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<SocialClientStatus | "todos">("todos")

  const filtered =
    filter === "todos" ? clients : clients.filter((c) => c.status === filter)

  const counts = {
    activo: clients.filter((c) => c.status === "activo").length,
    onboarding: clients.filter((c) => c.status === "onboarding").length,
    pausa: clients.filter((c) => c.status === "pausa").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-white md:text-2xl">Clientes · Gestión de redes</h2>
          <p className="mt-1 max-w-lg text-sm text-white/45">
            Cuentas activas de Cosecha Creativa: calendarios, entregas y estado de cada marca.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-gradient-to-r from-[#eca8d6] to-[#d48ee0] text-black hover:opacity-90"
        >
          {showForm ? <X className="mr-2 size-4" /> : <Plus className="mr-2 size-4" />}
          {showForm ? "Cancelar" : "Nueva cuenta"}
        </Button>
      </div>

      {showForm ? (
        <AddClientForm
          onCreated={async () => {
            setShowForm(false)
            await onRefresh()
          }}
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <FilterPill active={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos ({clients.length})
        </FilterPill>
        {SOCIAL_STATUSES.map((s) => (
          <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {SOCIAL_STATUS_LABEL[s]} ({counts[s]})
          </FilterPill>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client) => (
          <SocialClientCard key={client.id} client={client} onUpdate={onRefresh} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/40">No hay clientes en esta categoría.</p>
      ) : null}
    </div>
  )
}

function SocialClientCard({
  client,
  onUpdate,
}: {
  client: SocialClient
  onUpdate: () => Promise<void>
}) {
  const progress = Math.min(100, Math.round((client.postsDelivered / client.postsPerMonth) * 100))
  const statusColors: Record<SocialClientStatus, string> = {
    activo: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    onboarding: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    pausa: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  }

  const patch = async (body: Record<string, unknown>) => {
    await fetch(`/api/crm/social-clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    await onUpdate()
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-black/50 p-5 shadow-xl shadow-black/25 transition hover:border-[#eca8d6]/25">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#eca8d6]/10 blur-2xl transition group-hover:bg-[#eca8d6]/20" />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg text-white">{client.brand}</h3>
          {client.contactName ? (
            <p className="text-xs text-white/45">{client.contactName}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            statusColors[client.status],
          )}
        >
          {SOCIAL_STATUS_LABEL[client.status]}
        </span>
      </div>

      <div className="relative mt-4 flex gap-2">
        {client.platforms.map((p) => (
          <span
            key={p}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70"
          >
            <PlatformIcon platform={p} className="size-3.5" />
          </span>
        ))}
        <span className="ml-auto self-center rounded-md bg-[#eca8d6]/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#eca8d6]">
          {SOCIAL_PLAN_LABEL[client.plan]}
        </span>
      </div>

      <div className="relative mt-5">
        <div className="mb-1.5 flex justify-between text-xs text-white/45">
          <span>
            {client.postsDelivered}/{client.postsPerMonth} piezas del mes
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#eca8d6] to-[#a100f2] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {client.nextDelivery && client.status !== "pausa" ? (
        <p className="relative mt-3 text-xs text-white/40">
          Próxima entrega:{" "}
          <span className="text-[#eca8d6]/90">{formatDate(client.nextDelivery)}</span>
        </p>
      ) : null}

      {client.notes ? (
        <p className="relative mt-2 line-clamp-2 text-xs text-white/35">{client.notes}</p>
      ) : null}

      <CrmSocialEditorial
        client={client}
        onSave={async (editorial) => {
          await patch({ editorial })
        }}
      />
      <CrmSocialMetrics
        client={client}
        onSave={async (metrics) => {
          await patch({ metrics })
        }}
      />
      <CrmSocialGenerator client={client} />

      <div className="relative mt-4 flex flex-wrap gap-2 border-t border-white/8 pt-4">
        <select
          value={client.status}
          onChange={(e) => void patch({ status: e.target.value })}
          className="flex-1 rounded-lg border border-white/12 bg-black/50 px-2 py-1.5 text-xs text-white"
        >
          {SOCIAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {SOCIAL_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-white/15 text-xs text-white"
          onClick={() =>
            void patch({
              postsDelivered: Math.min(client.postsPerMonth, client.postsDelivered + 1),
            })
          }
        >
          +1 pieza
        </Button>
      </div>
    </article>
  )
}

function AddClientForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const [brand, setBrand] = useState("")
  const [contactName, setContactName] = useState("")
  const [plan, setPlan] = useState<SocialPlan>("growth")
  const [platforms, setPlatforms] = useState<SocialClient["platforms"]>(["instagram"])
  const [loading, setLoading] = useState(false)

  const togglePlatform = (p: (typeof SOCIAL_PLATFORMS)[number]) => {
    setPlatforms((prev) =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter((x) => x !== p) : prev) : [...prev, p],
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/crm/social-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, contactName, plan, platforms, postsPerMonth: 12 }),
      })
      if (res.ok) await onCreated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="rounded-2xl border border-[#eca8d6]/25 bg-[#eca8d6]/5 p-5"
    >
      <h3 className="font-medium text-white">Alta de cliente redes</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Marca / negocio"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
          className="border-white/15 bg-black/40 text-white"
        />
        <Input
          placeholder="Contacto"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="border-white/15 bg-black/40 text-white"
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as SocialPlan)}
          className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
        >
          {SOCIAL_PLANS.map((p) => (
            <option key={p} value={p}>
              {SOCIAL_PLAN_LABEL[p]}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {SOCIAL_PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs capitalize transition",
                platforms.includes(p)
                  ? "border-[#eca8d6]/50 bg-[#eca8d6]/15 text-[#f5d4ea]"
                  : "border-white/15 text-white/45 hover:text-white",
              )}
            >
              <PlatformIcon platform={p} className="size-3" />
              {p}
            </button>
          ))}
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading || !brand.trim()}
        className="mt-4 bg-[#eca8d6] text-black hover:bg-[#f0b8e0]"
      >
        {loading ? "Guardando…" : "Crear cliente"}
      </Button>
    </form>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-[#eca8d6]/50 bg-[#eca8d6]/15 text-[#eca8d6]"
          : "border-white/15 text-white/50 hover:text-white",
      )}
    >
      {children}
    </button>
  )
}
