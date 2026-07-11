"use client"

import { CrmAmbient, LeadCardPreview } from "@/components/crm/crm-shared"
import { CrmKanban } from "@/components/crm/crm-kanban"
import { CrmLeadWorkspace } from "@/components/crm/crm-lead-workspace"
import { CrmNotificationsBell } from "@/components/crm/crm-notifications-bell"
import { CrmOverview } from "@/components/crm/crm-overview"
import { CrmSocialClients } from "@/components/crm/crm-social-clients"
import { CrmCommandPalette } from "@/components/crm/crm-command-palette"
import { CrmReports } from "@/components/crm/crm-reports"
import { CrmToday } from "@/components/crm/crm-today"
import { CrmAiNotepad } from "@/components/crm/crm-ai-notepad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { allLeadTags } from "@/lib/crm/lead-utils"
import type { CrmLead, LeadStatus } from "@/lib/crm/types"
import type { SocialClient } from "@/lib/crm/social-types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
  BarChart3,
  CalendarDays,
  Columns3,
  Download,
  Inbox,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Search,
  Share2,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

type CrmView = "overview" | "today" | "kanban" | "leads" | "social" | "reports"

const NAV: { id: CrmView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "today", label: "Hoy", icon: CalendarDays },
  { id: "kanban", label: "Kanban", icon: Columns3 },
  { id: "leads", label: "Leads chat", icon: Inbox },
  { id: "social", label: "Clientes redes", icon: Share2 },
  { id: "reports", label: "Informes", icon: BarChart3 },
]

export function CrmDashboard() {
  const [view, setView] = useState<CrmView>("overview")
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [socialClients, setSocialClients] = useState<SocialClient[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tagFilter, setTagFilter] = useState<string | "all">("all")
  const [aiBusy, setAiBusy] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      await fetch("/api/crm/automations", { method: "POST" })
      const [leadsRes, socialRes] = await Promise.all([
        fetch("/api/crm/leads"),
        fetch("/api/crm/social-clients"),
      ])
      const leadsData = (await leadsRes.json()) as { leads?: CrmLead[] }
      const socialData = (await socialRes.json()) as { clients?: SocialClient[] }
      if (leadsRes.ok && leadsData.leads) {
        setLeads(leadsData.leads)
        setSelectedId((prev) => prev ?? leadsData.leads?.[0]?.id ?? null)
      }
      if (socialRes.ok && socialData.clients) setSocialClients(socialData.clients)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const selected = leads.find((l) => l.id === selectedId)
  const allTags = useMemo(() => allLeadTags(leads), [leads])

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads
      .filter((l) => {
        if (tagFilter !== "all" && !l.tags.includes(tagFilter)) return false
        if (!q) return true
        return (
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.company?.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.tags.some((t) => t.includes(q))
        )
      })
      .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0))
  }, [leads, search, tagFilter])

  const exportCsv = (type: "leads" | "social") => {
    window.open(`/api/crm/export?type=${type}`, "_blank")
  }

  const toggleTask = async (leadId: string, taskId: string, done: boolean) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return
    await patchLead(leadId, {
      tasks: lead.tasks.map((t) => (t.id === taskId ? { ...t, done } : t)),
    })
  }

  const patchLead = async (id: string, patch: Partial<CrmLead>) => {
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    const data = (await res.json()) as { lead?: CrmLead }
    if (res.ok && data.lead) {
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead! : l)))
    }
  }

  const runAi = async (id: string, action: string, templateId?: string) => {
    setAiBusy(true)
    try {
      const res = await fetch(`/api/crm/leads/${id}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, templateId }),
      })
      const data = (await res.json()) as { lead?: CrmLead }
      if (res.ok && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === id ? data.lead! : l)))
      }
    } finally {
      setAiBusy(false)
    }
  }

  const updateStatus = async (id: string, status: LeadStatus) => {
    await patchLead(id, { status })
  }

  const logout = async () => {
    await fetch("/api/crm/auth", { method: "DELETE" })
    window.location.href = "/crm/login"
  }

  const openLead = (id: string) => {
    setSelectedId(id)
    if (view === "overview" || view === "kanban" || view === "today") setView("leads")
  }

  return (
    <div className="relative min-h-screen bg-[#030308] text-white">
      <CrmAmbient />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl lg:flex">
          <div className="border-b border-white/10 px-5 py-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/75">
              Cosecha
            </p>
            <p className="font-display text-lg tracking-tight">CRM Creativo</p>
            <p className="mt-1 text-[10px] text-white/35">Motor IA interno</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  view === id
                    ? "bg-gradient-to-r from-[#eca8d6]/20 to-[#a100f2]/15 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t border-white/10 p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/15 text-xs text-white"
              onClick={() => setPaletteOpen(true)}
            >
              <Search className="mr-2 size-3.5" />
              Buscar (Ctrl+K)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/15 text-xs text-white"
              onClick={() => exportCsv("leads")}
            >
              <Download className="mr-2 size-3.5" />
              Exportar leads
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/15 text-xs text-white"
              onClick={() => exportCsv("social")}
            >
              <Download className="mr-2 size-3.5" />
              Exportar redes
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/15 text-white"
              onClick={() => void load()}
            >
              <RefreshCw className="mr-2 size-3.5" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full border-white/15 text-white">
              <Link href="/">Sitio web</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/15 text-white/70"
              onClick={() => void logout()}
            >
              <LogOut className="mr-2 size-3.5" />
              Salir
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#030308]/80 px-4 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex w-full items-center justify-between gap-4 lg:hidden">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-white/15 cursor-pointer shrink-0"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Abrir menú"
                  >
                    <Menu className="size-4" />
                  </Button>
                  <div className="shrink-0">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#eca8d6]/90 font-semibold leading-none">Cosecha</p>
                    <h2 className="font-display text-sm tracking-tight text-white mt-0.5">CRM</h2>
                  </div>
                </div>
                {/* Horizontal slider bar for main views */}
                <div className="flex-1 overflow-x-auto no-scrollbar py-1">
                  <div className="flex gap-1.5 px-2">
                    {NAV.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setView(id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition whitespace-nowrap cursor-pointer",
                          view === id
                            ? "bg-[#eca8d6] text-black"
                            : "bg-white/[0.04] text-white/60 hover:text-white border border-white/5"
                        )}
                      >
                        <Icon className="size-3 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {(view === "leads" || view === "kanban") && (
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar lead, email, etiqueta…"
                    className="h-10 border-white/12 bg-white/[0.04] pl-10 text-white placeholder:text-white/30"
                  />
                </div>
              )}
              <CrmNotificationsBell onOpenLead={openLead} />
              <Button
                size="icon"
                variant="outline"
                className="border-white/15 lg:hidden"
                onClick={() => void load()}
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
            {(view === "leads" || view === "kanban") && allTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <TagChip active={tagFilter === "all"} onClick={() => setTagFilter("all")}>
                  Todas
                </TagChip>
                {allTags.map((t) => (
                  <TagChip key={t} active={tagFilter === t} onClick={() => setTagFilter(t)}>
                    #{t}
                  </TagChip>
                ))}
              </div>
            ) : null}
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            {loading && view === "overview" ? (
              <p className="text-sm text-white/45">Cargando panel…</p>
            ) : null}

            {view === "overview" ? (
              <CrmOverview
                leads={leads}
                socialClients={socialClients}
                onSelectLead={openLead}
                onGoKanban={() => setView("kanban")}
                onGoSocial={() => setView("social")}
              />
            ) : null}

            {view === "today" ? (
              <CrmToday
                leads={leads}
                socialClients={socialClients}
                onSelectLead={openLead}
                onSelectSocial={() => setView("social")}
                onToggleTask={(leadId, taskId, done) => void toggleTask(leadId, taskId, done)}
              />
            ) : null}

            {view === "reports" ? <CrmReports leads={leads} /> : null}

            {view === "kanban" ? (
              <CrmKanban
                leads={filteredLeads}
                onSelect={openLead}
                onStatusChange={updateStatus}
              />
            ) : null}

            {view === "social" ? (
              <CrmSocialClients clients={socialClients} onRefresh={load} />
            ) : null}

            {view === "leads" ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <h2 className="font-display text-lg text-white">Bandeja de leads</h2>
                  <p className="mt-1 text-xs text-white/40">Chat IA · tareas · propuestas</p>
                  {filteredLeads.length === 0 ? (
                    <p className="mt-8 text-sm text-white/40">Sin leads.</p>
                  ) : (
                    <ul className="mt-4 max-h-[calc(100vh-260px)] space-y-2 overflow-y-auto">
                      {filteredLeads.map((lead) => (
                        <li key={lead.id}>
                          <div
                            className={cn(
                              selectedId === lead.id && "rounded-xl ring-2 ring-[#eca8d6]/40",
                            )}
                          >
                            <LeadCardPreview lead={lead} onClick={() => setSelectedId(lead.id)} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:min-h-[560px]">
                  {selected ? (
                    <CrmLeadWorkspace
                      lead={selected}
                      busy={aiBusy}
                      onPatch={(patch) => patchLead(selected.id, patch)}
                      onAi={(action, templateId) => runAi(selected.id, action, templateId)}
                    />
                  ) : (
                    <p className="text-sm text-white/45">Seleccioná un lead.</p>
                  )}
                </section>
              </div>
            ) : null}
          </main>
        </div>
      </div>

      <CrmCommandPalette
        leads={leads}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelectLead={openLead}
      />

      {/* Global AI Notepad floating drawer */}
      <CrmAiNotepad />

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-white/10 bg-black/95 p-4 backdrop-blur-2xl lg:hidden text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#eca8d6]">COSECHA</p>
                  <p className="font-display text-base">CRM Comercial</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-lg cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {NAV.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setView(id)
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition cursor-pointer",
                      view === id
                        ? "bg-gradient-to-r from-[#eca8d6]/20 to-[#a100f2]/15 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="space-y-2 border-t border-white/10 pt-4 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/15 text-xs text-white"
                  onClick={() => {
                    setPaletteOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Search className="mr-2 size-3.5" />
                  Buscar (Ctrl+K)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/15 text-xs text-white"
                  onClick={() => {
                    exportCsv("leads")
                    setMobileMenuOpen(false)
                  }}
                >
                  <Download className="mr-2 size-3.5" />
                  Exportar leads
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/15 text-xs text-white"
                  onClick={() => {
                    exportCsv("social")
                    setMobileMenuOpen(false)
                  }}
                >
                  <Download className="mr-2 size-3.5" />
                  Exportar redes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/15 text-white"
                  onClick={() => {
                    void load()
                    setMobileMenuOpen(false)
                  }}
                >
                  <RefreshCw className="mr-2 size-3.5" />
                  Actualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/15 text-white/70"
                  onClick={() => void logout()}
                >
                  <LogOut className="mr-2 size-3.5" />
                  Salir
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function TagChip({
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
        "rounded-full border px-2.5 py-0.5 text-[11px]",
        active
          ? "border-[#eca8d6]/50 bg-[#eca8d6]/15 text-[#eca8d6]"
          : "border-white/12 text-white/45 hover:text-white",
      )}
    >
      {children}
    </button>
  )
}
