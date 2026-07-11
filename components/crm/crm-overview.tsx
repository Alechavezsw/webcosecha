"use client"

import { useEffect, useState } from "react"
import { SOURCE_LABEL } from "@/lib/crm/constants"
import { CrmActivityFeed } from "@/components/crm/crm-activity-feed"
import { computeLeadStats, computePipelineRevenue, computeSocialStats, findDuplicateLeads } from "@/lib/crm/stats"
import { formatDate, LeadCardPreview } from "@/components/crm/crm-shared"
import type { CrmLead } from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  DollarSign,
  MessageCircle,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"

export function CrmOverview({
  leads,
  socialClients,
  onSelectLead,
  onGoKanban,
  onGoSocial,
}: {
  leads: CrmLead[]
  socialClients: SocialClient[]
  onSelectLead: (id: string) => void
  onGoKanban: () => void
  onGoSocial: () => void
}) {
  const leadStats = computeLeadStats(leads)
  const socialStats = computeSocialStats(socialClients)
  const revenue = computePipelineRevenue(leads)
  const duplicates = findDuplicateLeads(leads)
  const recentLeads = [...leads]
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
    .slice(0, 4)

  const [insight, setInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(true)

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true)
      try {
        const res = await fetch("/api/crm/ai-insights", { method: "POST" })
        const data = (await res.json()) as { reply?: string }
        if (data.reply) setInsight(data.reply)
      } catch {
        /* ignore */
      } finally {
        setLoadingInsight(false)
      }
    }
    void fetchInsight()
  }, [])

  const formatArs = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl tracking-tight text-white md:text-3xl">
          Buenos días, equipo Cosecha
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/50">
          Vista general de leads del chat con IA, pipeline comercial y cuentas activas de gestión de
          redes.
        </p>
      </div>

      {/* AI Recommendation Insight Card */}
      {(loadingInsight || insight) && (
        <div className="rounded-2xl border border-[#eca8d6]/20 bg-gradient-to-r from-[#eca8d6]/10 via-transparent to-[#a100f2]/10 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Sparkles className="size-16 text-[#eca8d6]" />
          </div>
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eca8d6]/20 text-[#eca8d6] mt-0.5">
              <Sparkles className="size-5 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#eca8d6] flex items-center gap-1.5">
                Estrategia Comercial IA de la Semana
              </h3>
              {loadingInsight ? (
                <div className="space-y-2 animate-pulse py-1 w-[280px] sm:w-[400px]">
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-4/5 rounded bg-white/10" />
                </div>
              ) : (
                <div className="text-xs leading-relaxed text-white/90 whitespace-pre-line font-sans">
                  {insight}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Leads totales"
          value={leadStats.total}
          hint={`${leadStats.nuevosSemana} nuevos esta semana`}
          icon={MessageCircle}
          accent="from-[#eca8d6]/20 to-[#a100f2]/10"
        />
        <StatCard
          label="Pipeline activo"
          value={leadStats.activos}
          hint="En seguimiento"
          icon={Target}
          accent="from-cyan-500/15 to-transparent"
        />
        <StatCard
          label="Conversión"
          value={`${leadStats.conversion}%`}
          hint={`${leadStats.ganados} ganados`}
          icon={TrendingUp}
          accent="from-emerald-500/15 to-transparent"
        />
        <StatCard
          label="Clientes redes"
          value={socialStats.activos}
          hint={`${socialStats.onboarding} en onboarding`}
          icon={Share2}
          accent="from-[#eca8d6]/15 to-transparent"
          onClick={onGoSocial}
        />
      </div>

      {duplicates.length > 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <p className="text-sm text-amber-100">
            {duplicates.length} posible(s) duplicado(s) — mismo email o teléfono.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pipeline"
          value={formatArs(revenue.pipeline)}
          hint="Propuestas en curso"
          icon={DollarSign}
          accent="from-[#a100f2]/15 to-transparent"
        />
        <StatCard
          label="Enviadas"
          value={formatArs(revenue.sent)}
          hint="Esperando OK"
          icon={DollarSign}
          accent="from-cyan-500/10 to-transparent"
        />
        <StatCard
          label="Ganado"
          value={formatArs(revenue.won)}
          hint="Aceptadas"
          icon={DollarSign}
          accent="from-emerald-500/15 to-transparent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-white">Leads prioritarios (IA)</h3>
            <button
              type="button"
              onClick={onGoKanban}
              className="inline-flex items-center gap-1 text-xs text-[#eca8d6] hover:underline"
            >
              Ver Kanban <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <p className="mt-8 text-sm text-white/40">
              Cuando alguien escriba en el chat del sitio, aparecerá acá.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recentLeads.map((lead) => (
                <LeadCardPreview
                  key={lead.id}
                  lead={lead}
                  compact
                  onClick={() => onSelectLead(lead.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-2 space-y-4">
          <Panel title="Origen de leads" icon={Sparkles}>
            {Object.keys(leadStats.bySource).length === 0 ? (
              <p className="text-xs text-white/40">Sin datos aún</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(leadStats.bySource).map(([src, n]) => (
                  <li key={src} className="flex items-center justify-between text-sm">
                    <span className="text-white/65">{SOURCE_LABEL[src] ?? src}</span>
                    <span className="font-medium text-white">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Próximas entregas · Redes" icon={CalendarClock}>
            {socialStats.proximasEntregas.length === 0 ? (
              <p className="text-xs text-white/40">Sin entregas programadas</p>
            ) : (
              <ul className="space-y-2">
                {socialStats.proximasEntregas.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.04] px-2.5 py-2 text-sm"
                  >
                    <span className="truncate text-white/80">{c.brand}</span>
                    <span className="shrink-0 text-xs text-[#eca8d6]">
                      {c.nextDelivery ? formatDate(c.nextDelivery) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </section>
      </div>

      <CrmActivityFeed leads={leads} onSelectLead={onSelectLead} />

      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#eca8d6]/8 via-transparent to-[#a100f2]/8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#eca8d6]/20 text-[#eca8d6]">
              <Users className="size-5" />
            </span>
            <div>
              <p className="font-medium text-white">
                {socialStats.postsPendientes} piezas pendientes de publicación
              </p>
              <p className="text-sm text-white/45">
                Entre {socialStats.total} cuentas de gestión de redes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoSocial}
            className="rounded-full border border-[#eca8d6]/40 bg-[#eca8d6]/15 px-4 py-2 text-sm font-medium text-[#f5d4ea] transition hover:bg-[#eca8d6]/25"
          >
            Gestionar clientes
          </button>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string
  value: string | number
  hint: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  onClick?: () => void
}) {
  const Comp = onClick ? "button" : "div"
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition",
        onClick && "hover:border-[#eca8d6]/30 hover:bg-white/[0.05]",
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", accent)} />
      <div className="relative">
        <Icon className="size-5 text-[#eca8d6]/90" />
        <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-sm text-white/55">{label}</p>
        <p className="mt-2 text-xs text-white/35">{hint}</p>
      </div>
    </Comp>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-[#eca8d6]/80" />
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}
