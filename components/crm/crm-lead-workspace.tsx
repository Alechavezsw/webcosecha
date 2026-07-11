"use client"

import {
  PROPOSAL_STATUS_LABEL,
  STATUS_LABEL,
  TEAM_ASSIGNEES,
} from "@/lib/crm/constants"
import { PROPOSAL_TEMPLATES } from "@/lib/crm/proposal-templates"
import { buildLeadCopyText } from "@/lib/crm/lead-utils"
import type { CrmLead, CrmProposal, CrmTask, LeadStatus } from "@/lib/crm/types"
import { PriorityBadge, StatusBadge } from "@/components/crm/crm-shared"
import { fillWaTemplate, WA_TEMPLATES } from "@/lib/crm/whatsapp-templates"
import { getLeadWhatsAppHref } from "@/lib/crm/lead-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Bot,
  Check,
  ClipboardCopy,
  History,
  Mail,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react"
import { useEffect, useState } from "react"
import { LEAD_STATUSES } from "@/lib/crm/types"

type Tab = "resumen" | "tareas" | "notas" | "propuestas" | "chat" | "historial"

export function CrmLeadWorkspace({
  lead,
  onPatch,
  onAi,
  busy,
}: {
  lead: CrmLead
  onPatch: (patch: Partial<CrmLead>) => Promise<void>
  onAi: (action: string, templateId?: string) => Promise<void>
  busy?: boolean
}) {
  const [tab, setTab] = useState<Tab>("resumen")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDue, setTaskDue] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [copied, setCopied] = useState(false)
  const [notes, setNotes] = useState(lead.internalNotes)
  const [budget, setBudget] = useState(lead.estimatedBudget ?? "")
  const [objections, setObjections] = useState(lead.objections ?? "")

  useEffect(() => {
    setNotes(lead.internalNotes)
    setBudget(lead.estimatedBudget ?? "")
    setObjections(lead.objections ?? "")
  }, [lead.id, lead.internalNotes, lead.estimatedBudget, lead.objections])

  const waHref = getLeadWhatsAppHref(lead)

  const addTask = () => {
    if (!taskTitle.trim()) return
    const task: CrmTask = {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      dueAt: taskDue ? new Date(taskDue).toISOString() : undefined,
      done: false,
      createdAt: new Date().toISOString(),
    }
    void onPatch({ tasks: [...lead.tasks, task] })
    setTaskTitle("")
    setTaskDue("")
  }

  const toggleTask = (id: string) => {
    void onPatch({
      tasks: lead.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })
  }

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "").toLowerCase()
    if (!t || lead.tags.includes(t)) return
    void onPatch({ tags: [...lead.tags, t] })
    setTagInput("")
  }

  const copySummary = async () => {
    await navigator.clipboard.writeText(buildLeadCopyText(lead))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "resumen", label: "Resumen" },
    { id: "tareas", label: `Tareas (${lead.tasks.filter((t) => !t.done).length})` },
    { id: "notas", label: "Notas" },
    { id: "propuestas", label: `Propuestas (${lead.proposals.length})` },
    { id: "chat", label: "Chat" },
    { id: "historial", label: "Historial" },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl text-white">{lead.name || "Lead sin nombre"}</h2>
            <StatusBadge status={lead.status} />
            <PriorityBadge score={lead.priorityScore} />
          </div>
          {lead.priorityReason ? (
            <p className="mt-2 text-xs text-white/40">{lead.priorityReason}</p>
          ) : null}
            {lead.company ? <p className="mt-1 text-sm text-[#eca8d6]/85">{lead.company}</p> : null}
          </div>
          <select
            value={lead.status}
            onChange={(e) => void onPatch({ status: e.target.value as LeadStatus })}
            className="rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
            disabled={busy}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 cursor-pointer"
            >
              WhatsApp Cliente
            </a>
          ) : null}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*Cosecha CRM - Briefing de Lead*\n\n` + buildLeadCopyText(lead))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-700/80 hover:bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
          >
            🧉 Compartir WhatsApp
          </a>
          {lead.email ? (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5 cursor-pointer"
            >
              <Mail className="size-3.5" />
              Email
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => void copySummary()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5 cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <ClipboardCopy className="size-3.5" />}
            Copiar resumen
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-xs text-white/40">Responsable</label>
          <select
            value={lead.assignee ?? "Sin asignar"}
            onChange={(e) => void onPatch({ assignee: e.target.value })}
            className="rounded-lg border border-white/12 bg-black/40 px-2 py-1 text-xs text-white"
          >
            {TEAM_ASSIGNEES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            className="h-7 border-[#eca8d6]/30 text-[11px] text-[#eca8d6]"
            onClick={() => void onAi("suggest_tags")}
          >
            <Sparkles className="mr-1 size-3" />
            IA etiquetas
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            className="h-7 border-white/15 text-[11px] text-white/70"
            onClick={() => void onAi("score_lead")}
          >
            <Bot className="mr-1 size-3" />
            IA prioridad
          </Button>
        </div>

        {waHref ? (
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/35">
              Plantillas WhatsApp
            </p>
            <div className="flex flex-wrap gap-1.5">
              {WA_TEMPLATES.map((tpl) => {
                const text = fillWaTemplate(tpl, {
                  name: lead.name?.split(" ")[0],
                  interest: lead.serviceInterest?.[0],
                })
                const href = getLeadWhatsAppHref(lead, text)
                if (!href) return null
                return (
                  <a
                    key={tpl.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-200 hover:bg-emerald-500/20"
                  >
                    {tpl.label}
                  </a>
                )
              })}
            </div>
          </div>
        ) : null}

        {lead.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {lead.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/60"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Nueva etiqueta"
            className="h-8 max-w-[140px] border-white/12 bg-black/40 text-xs text-white"
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <Button type="button" size="sm" variant="ghost" className="h-8 text-xs" onClick={addTag}>
            +
          </Button>
        </div>
      </div>

      <div className="mt-3 flex gap-1 overflow-x-auto border-b border-white/10 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-xs transition",
              tab === t.id
                ? "bg-[#eca8d6]/15 text-[#eca8d6]"
                : "text-white/45 hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-4">
        {tab === "resumen" ? (
          <p className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-sm leading-relaxed text-white/70">
            {lead.summary}
          </p>
        ) : null}

        {tab === "tareas" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={busy}
                className="bg-[#eca8d6]/20 text-[#eca8d6] hover:bg-[#eca8d6]/30"
                onClick={() => void onAi("suggest_tasks")}
              >
                <Bot className="mr-1 size-3.5" />
                IA: sugerir tareas
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Nueva tarea…"
                className="h-9 flex-1 min-w-[160px] border-white/12 bg-black/40 text-sm text-white"
              />
              <Input
                type="date"
                value={taskDue}
                onChange={(e) => setTaskDue(e.target.value)}
                className="h-9 w-[140px] border-white/12 bg-black/40 text-sm text-white"
              />
              <Button type="button" size="sm" onClick={addTask} className="bg-[#eca8d6] text-black">
                <Plus className="size-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {lead.tasks.map((t) => (
                <li
                  key={t.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-white/10 px-3 py-2.5",
                    t.done && "opacity-50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm text-white", t.done && "line-through")}>{t.title}</p>
                    <p className="text-[10px] text-white/35">
                      {t.dueAt ? new Date(t.dueAt).toLocaleDateString("es-AR") : "Sin fecha"}
                      {t.aiSuggested ? " · IA" : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "notas" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={busy}
                className="bg-[#eca8d6]/20 text-[#eca8d6]"
                onClick={() => void onAi("enrich_notes")}
              >
                <Sparkles className="mr-1 size-3.5" />
                IA: ampliar notas
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={busy}
                className="bg-cyan-500/20 text-cyan-300"
                onClick={() => void onAi("seo_audit")}
              >
                <Sparkles className="mr-1 size-3.5" />
                IA: auditoría SEO
              </Button>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => void onPatch({ internalNotes: notes })}
              rows={6}
              placeholder="Notas internas, presupuesto, objeciones…"
              className="border-white/12 bg-black/40 text-sm text-white"
            />
            <Input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onBlur={() => void onPatch({ estimatedBudget: budget })}
              placeholder="Presupuesto estimado (ej. $180.000 ARS)"
              className="border-white/12 bg-black/40 text-white"
            />
            <Textarea
              value={objections}
              onChange={(e) => setObjections(e.target.value)}
              onBlur={() => void onPatch({ objections })}
              rows={2}
              placeholder="Objeciones del cliente"
              className="border-white/12 bg-black/40 text-sm text-white"
            />
          </div>
        ) : null}

        {tab === "propuestas" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {PROPOSAL_TEMPLATES.map((tpl) => (
                <Button
                  key={tpl.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  className="border-white/15 text-xs text-white"
                  onClick={() => void onAi("draft_proposal", tpl.id)}
                >
                  <Sparkles className="mr-1 size-3" />
                  IA: {tpl.service}
                </Button>
              ))}
            </div>
            {lead.proposals.map((p) => (
              <ProposalCard
                key={p.id}
                leadId={lead.id}
                proposal={p}
                onChange={(updated) =>
                  void onPatch({
                    proposals: lead.proposals.map((x) => (x.id === p.id ? updated : x)),
                  })
                }
              />
            ))}
            {lead.proposals.length === 0 ? (
              <p className="text-sm text-white/40">Generá una propuesta con IA desde una plantilla.</p>
            ) : null}
          </div>
        ) : null}

        {tab === "chat" ? (
          <div className="space-y-3">
            {lead.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "rounded-2xl px-3.5 py-2.5 text-sm",
                  m.role === "user"
                    ? "ml-4 border border-[#eca8d6]/20 bg-[#eca8d6]/12 text-white"
                    : "mr-4 border border-white/10 bg-black/40 text-white/85",
                )}
              >
                <p className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/35">
                  <MessageSquare className="size-3" />
                  {m.role === "user" ? "Visitante" : "Asistente"}
                </p>
                {m.text}
              </div>
            ))}
          </div>
        ) : null}

        {tab === "historial" ? (
          <ul className="space-y-2">
            {[...lead.history].reverse().map((h) => (
              <li
                key={h.id}
                className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 text-xs"
              >
                <span className="text-white/35">{new Date(h.at).toLocaleString("es-AR")}</span>
                <span className="mx-2 text-[#eca8d6]/60">[{h.type}]</span>
                <span className="text-white/70">{h.text}</span>
              </li>
            ))}
            {lead.history.length === 0 ? (
              <p className="text-sm text-white/40">Sin eventos aún.</p>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

function ProposalCard({
  leadId,
  proposal,
  onChange,
}: {
  leadId: string
  proposal: CrmProposal
  onChange: (p: CrmProposal) => void
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-medium text-white">{proposal.title}</h4>
        <div className="flex items-center gap-2">
          <a
            href={`/crm/proposals/${leadId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-2 py-1 text-[11px] font-semibold text-white transition cursor-pointer"
          >
            📄 PDF Imprimible
          </a>
          <select
            value={proposal.status}
            onChange={(e) =>
              onChange({
                ...proposal,
                status: e.target.value as CrmProposal["status"],
                updatedAt: new Date().toISOString(),
              })
            }
            className="rounded-lg border border-white/12 bg-black/50 px-2 py-1.5 text-xs text-white"
          >
            {Object.entries(PROPOSAL_STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Input
          type="number"
          value={proposal.amount}
          onChange={(e) => onChange({ ...proposal, amount: Number(e.target.value) })}
          className="h-8 w-32 border-white/12 bg-black/40 text-sm text-white"
        />
        <span className="self-center text-xs text-white/40">{proposal.currency}</span>
        {proposal.aiGenerated ? (
          <span className="self-center text-[10px] text-[#eca8d6]">Generada con IA</span>
        ) : null}
      </div>
      <Textarea
        value={proposal.body}
        onChange={(e) => onChange({ ...proposal, body: e.target.value })}
        rows={5}
        className="mt-2 border-white/10 bg-black/40 text-xs text-white/80"
      />
    </article>
  )
}
