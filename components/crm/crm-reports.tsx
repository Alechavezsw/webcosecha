"use client"

import { STATUS_LABEL } from "@/lib/crm/constants"
import { computeFunnel, computePipelineRevenue } from "@/lib/crm/stats"
import type { CrmLead } from "@/lib/crm/types"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function CrmReports({ leads }: { leads: CrmLead[] }) {
  const funnel = computeFunnel(leads)
  const revenue = computePipelineRevenue(leads)

  const chartData = funnel.map((f) => ({
    name: STATUS_LABEL[f.status as keyof typeof STATUS_LABEL] ?? f.status,
    leads: f.count,
  }))

  const formatArs = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-white">Informes</h2>
        <p className="mt-1 text-sm text-white/45">Embudo comercial e ingresos por propuestas del CRM.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <RevenueCard label="Pipeline (estimado)" value={formatArs(revenue.pipeline)} hint="Borradores + enviados" />
        <RevenueCard label="Propuestas enviadas" value={formatArs(revenue.sent)} hint="En negociación" />
        <RevenueCard label="Ganado" value={formatArs(revenue.won)} hint="Propuestas aceptadas" accent />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="text-sm font-medium text-white">Embudo de leads</h3>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#0a0a0f",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="leads" fill="#eca8d6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="text-sm font-medium text-white">Top leads por prioridad IA</h3>
        <ul className="mt-4 space-y-2">
          {[...leads]
            .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
            .slice(0, 8)
            .map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-lg border border-white/8 bg-black/30 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-white">{l.name || l.email || "—"}</p>
                  <p className="text-[10px] text-white/40">{l.priorityReason || l.status}</p>
                </div>
                <span className="font-mono text-lg text-[#eca8d6]">{l.priorityScore ?? "—"}</span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}

function RevenueCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string
  hint: string
  accent?: boolean
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4"
          : "rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      }
    >
      <p className="text-xs text-white/45">{label}</p>
      <p className="mt-2 font-display text-2xl text-white">{value}</p>
      <p className="mt-1 text-[10px] text-white/35">{hint}</p>
    </div>
  )
}
