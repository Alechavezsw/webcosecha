import { isCrmAuthenticated } from "@/lib/crm/auth"
import { listLeads } from "@/lib/crm/store"
import { NextResponse } from "next/server"

export async function GET() {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const leads = await listLeads()
  return NextResponse.json({ leads })
}
