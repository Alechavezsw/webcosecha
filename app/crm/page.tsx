import { CrmDashboard } from "@/components/crm/crm-dashboard"
import { isCrmAuthenticated } from "@/lib/crm/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "CRM · Dashboard | Cosecha Creativa",
  robots: { index: false, follow: false },
}

export default async function CrmPage() {
  if (!(await isCrmAuthenticated())) redirect("/crm/login")
  return <CrmDashboard />
}
