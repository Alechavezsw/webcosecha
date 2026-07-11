import { isCrmAuthenticated } from "@/lib/crm/auth"
import { leadsToCsv, socialToCsv } from "@/lib/crm/export-csv"
import { listLeads } from "@/lib/crm/store"
import { listSocialClients } from "@/lib/crm/social-store"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const type = new URL(req.url).searchParams.get("type") ?? "leads"
  const date = new Date().toISOString().slice(0, 10)

  if (type === "social") {
    const clients = await listSocialClients()
    const csv = socialToCsv(clients)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cosecha-clientes-redes-${date}.csv"`,
      },
    })
  }

  const leads = await listLeads()
  const csv = leadsToCsv(leads)
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cosecha-leads-${date}.csv"`,
    },
  })
}
