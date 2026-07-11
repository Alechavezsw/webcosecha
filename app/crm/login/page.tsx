import { CrmLoginForm } from "@/components/crm/crm-login-form"
import { isCrmAuthenticated } from "@/lib/crm/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
  title: "CRM · Acceso | Cosecha Creativa",
  robots: { index: false, follow: false },
}

export default async function CrmLoginPage() {
  if (await isCrmAuthenticated()) redirect("/crm")

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030308] px-6 text-white">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#eca8d6]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-[#a100f2]/12 blur-[100px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eca8d6] to-[#a100f2] text-lg font-bold text-black">
            CC
          </span>
          <div>
            <p className="cc-eyebrow-accent text-[10px] text-[#eca8d6]/80">
              Cosecha Creativa
            </p>
            <h1 className="font-display text-xl tracking-tight">CRM interno</h1>
          </div>
        </div>
        <p className="mb-8 text-sm leading-relaxed text-white/50">
          Leads del chat, pipeline Kanban y clientes de gestión de redes — todo en un solo lugar.
        </p>
        <CrmLoginForm />
        <Link
          href="/"
          className="mt-8 block text-center text-xs text-white/35 transition hover:text-white/60"
        >
          ← Volver al sitio
        </Link>
      </div>
    </div>
  )
}
