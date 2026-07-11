import { isCrmAuthenticated } from "@/lib/crm/auth"
import { runLeadAutomations } from "@/lib/crm/automations"
import { listLeads } from "@/lib/crm/store"
import { NextResponse } from "next/server"

export async function POST() {
  if (!(await isCrmAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const result = await runLeadAutomations()
  const leads = await listLeads()
  return NextResponse.json({ ...result, leads })
}
