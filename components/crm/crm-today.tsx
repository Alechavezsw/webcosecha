"use client"

import { overdueTasks, tasksDueToday } from "@/lib/crm/lead-utils"
import type { CrmLead } from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"
import { formatDate } from "@/components/crm/crm-shared"
import { cn } from "@/lib/utils"
import { AlertCircle, Calendar, CheckSquare } from "lucide-react"

export function CrmToday({
  leads,
  socialClients,
  onSelectLead,
  onSelectSocial,
  onToggleTask,
}: {
  leads: CrmLead[]
  socialClients: SocialClient[]
  onSelectLead: (id: string) => void
  onSelectSocial: () => void
  onToggleTask?: (leadId: string, taskId: string, done: boolean) => void
}) {
  const todayTasks = tasksDueToday(leads)
  const overdue = overdueTasks(leads)
  const deliveries = socialClients
    .filter((c) => c.nextDelivery && c.status === "activo")
    .sort((a, b) => new Date(a.nextDelivery!).getTime() - new Date(b.nextDelivery!).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-white">Hoy</h2>
        <p className="mt-1 text-sm text-white/45">
          Tareas del equipo, seguimientos vencidos y entregas de redes — priorizado por IA.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TodayPanel title="Tareas para hoy" icon={CheckSquare} count={todayTasks.length}>
          {todayTasks.length === 0 ? (
            <p className="text-xs text-white/40">Nada programado para hoy.</p>
          ) : (
            <ul className="space-y-2">
              {todayTasks.map(({ lead, task }) => (
                <li key={task.id} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(e) => onToggleTask?.(lead.id, task.id, e.target.checked)}
                    className="mt-1"
                  />
                  <button
                    type="button"
                    onClick={() => onSelectLead(lead.id)}
                    className="min-w-0 flex-1 text-left text-sm hover:opacity-90"
                  >
                    <p className="text-white">{task.title}</p>
                    <p className="text-[10px] text-white/40">{lead.name || lead.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TodayPanel>

        <TodayPanel title="Vencidas" icon={AlertCircle} count={overdue.length} accent="red">
          {overdue.length === 0 ? (
            <p className="text-xs text-white/40">Al día.</p>
          ) : (
            <ul className="space-y-2">
              {overdue.map(({ lead, task }) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => onSelectLead(lead.id)}
                    className="w-full rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-left text-sm"
                  >
                    <p className="text-white">{task.title}</p>
                    <p className="text-[10px] text-red-300/80">
                      {lead.name} · {task.dueAt ? formatDate(task.dueAt) : ""}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TodayPanel>

        <TodayPanel title="Entregas redes" icon={Calendar} count={deliveries.length}>
          {deliveries.length === 0 ? (
            <p className="text-xs text-white/40">Sin entregas próximas.</p>
          ) : (
            <ul className="space-y-2">
              {deliveries.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={onSelectSocial}
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm hover:bg-white/[0.03]"
                  >
                    <p className="text-white">{c.brand}</p>
                    <p className="text-[10px] text-[#eca8d6]">
                      {c.nextDelivery ? formatDate(c.nextDelivery) : "—"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TodayPanel>
      </div>
    </div>
  )
}

function TodayPanel({
  title,
  icon: Icon,
  count,
  children,
  accent,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  children: React.ReactNode
  accent?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-4",
        accent === "red" && "border-red-500/20",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-[#eca8d6]/80" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">{count}</span>
      </div>
      {children}
    </section>
  )
}
