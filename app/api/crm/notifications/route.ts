import { isCrmAuthenticated } from "@/lib/crm/auth"
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadNotificationCount,
} from "@/lib/crm/notification-store"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function GET() {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const [items, unread] = await Promise.all([listNotifications(), unreadNotificationCount()])
  return NextResponse.json({ items, unread })
}

const patchSchema = z.object({
  id: z.string().optional(),
  markAllRead: z.boolean().optional(),
})

export async function PATCH(req: Request) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const json = await req.json()
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }
  if (parsed.data.markAllRead) {
    await markAllNotificationsRead()
  } else if (parsed.data.id) {
    await markNotificationRead(parsed.data.id)
  }
  const unread = await unreadNotificationCount()
  return NextResponse.json({ ok: true, unread })
}
