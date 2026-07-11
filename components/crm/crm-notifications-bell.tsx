"use client"

import type { CrmNotification } from "@/lib/crm/types"
import { cn } from "@/lib/utils"
import { Bell } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function CrmNotificationsBell({ onOpenLead }: { onOpenLead?: (leadId: string) => void }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CrmNotification[]>([])
  const [unread, setUnread] = useState(0)

  const load = useCallback(async () => {
    const res = await fetch("/api/crm/notifications")
    if (!res.ok) return
    const data = (await res.json()) as { items?: CrmNotification[]; unread?: number }
    setItems(data.items ?? [])
    setUnread(data.unread ?? 0)
  }, [])

  useEffect(() => {
    void load()
    const t = setInterval(() => void load(), 30000)
    return () => clearInterval(t)
  }, [load])

  const markAll = async () => {
    await fetch("/api/crm/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
    void load()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/70 hover:text-white"
        aria-label="Notificaciones"
      >
        <Bell className="size-4" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#eca8d6] text-[10px] font-bold text-black">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-[min(100vw-2rem,360px)] rounded-2xl border border-white/15 bg-zinc-950 p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-medium text-white">Alertas IA</p>
              {unread > 0 ? (
                <button
                  type="button"
                  onClick={() => void markAll()}
                  className="text-xs text-[#eca8d6] hover:underline"
                >
                  Marcar leídas
                </button>
              ) : null}
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-2 py-6 text-center text-xs text-white/40">Sin notificaciones</li>
              ) : (
                items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (n.leadId) onOpenLead?.(n.leadId)
                        setOpen(false)
                      }}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2.5 text-left transition",
                        n.read
                          ? "border-white/8 bg-white/[0.02]"
                          : "border-[#eca8d6]/25 bg-[#eca8d6]/8",
                      )}
                    >
                      <p className="text-xs font-medium text-white">{n.title}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-white/45">{n.body}</p>
                      <p className="mt-1 text-[10px] text-white/30">
                        {n.channels.join(" · ")} · {new Date(n.at).toLocaleString("es-AR")}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  )
}
