import { isCrmAuthenticated } from "@/lib/crm/auth"
import { getLeadById } from "@/lib/crm/store"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata = {
  title: "Propuesta Comercial | Cosecha Creativa",
  robots: { index: false, follow: false },
}

export default async function ProposalPrintPage(ctx: { params: Promise<{ leadId: string }> }) {
  if (!(await isCrmAuthenticated())) redirect("/crm/login")

  const { leadId } = await ctx.params
  const lead = await getLeadById(leadId)

  if (!lead) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-950 text-white">
        <p className="text-sm text-white/50">Lead no encontrado.</p>
        <Link href="/crm" className="mt-4 text-xs text-[#eca8d6] hover:underline">← Volver al CRM</Link>
      </div>
    )
  }

  const latestProposal = lead.proposals[lead.proposals.length - 1]

  if (!latestProposal) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-950 text-white">
        <p className="text-sm text-white/50">Este lead no tiene ninguna propuesta generada aún.</p>
        <Link href="/crm" className="mt-4 text-xs text-[#eca8d6] hover:underline">← Volver al CRM</Link>
      </div>
    )
  }

  const dateStr = new Date(latestProposal.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans antialiased p-0 sm:p-8 print:p-0">
      {/* Interactive print toolbar - Hidden on actual print */}
      <div className="mx-auto max-w-3xl mb-6 flex items-center justify-between bg-zinc-900 p-4 rounded-xl shadow-lg print:hidden text-white">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#eca8d6] font-semibold">Propuesta Comercial</p>
          <p className="text-xs text-white/50 mt-0.5">Cliente: {lead.name || lead.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/crm"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white/90 px-4 py-2 rounded-lg font-medium transition"
          >
            Volver al CRM
          </Link>
          <button
            id="print-btn"
            className="text-xs bg-gradient-to-r from-[#eca8d6] to-[#d48ee0] text-zinc-950 hover:opacity-90 px-4 py-2 rounded-lg font-bold transition shadow-md cursor-pointer"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="mx-auto max-w-3xl bg-white p-12 sm:p-16 border border-zinc-200 shadow-xl print:shadow-none print:border-none rounded-2xl print:rounded-none min-h-[297mm]">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-zinc-200 pb-8 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#a100f2] font-bold">Cosecha Creativa</p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 mt-1">Propuesta Comercial</h1>
            <p className="text-xs text-zinc-400 mt-1">ID: CC-{latestProposal.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="text-right text-xs text-zinc-500 space-y-1">
            <p className="font-bold text-zinc-800">Cosecha Creativa</p>
            <p>San Juan, Argentina</p>
            <p>hola@cosechacreativa.com.ar</p>
          </div>
        </div>

        {/* Lead Details Info Card */}
        <div className="grid grid-cols-2 gap-8 bg-zinc-50 border border-zinc-100 rounded-xl p-5 text-xs mb-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-400">Preparado para:</p>
            <p className="font-bold text-zinc-800 mt-1 text-sm">{lead.name || "A definir"}</p>
            {lead.company && <p className="text-zinc-600 mt-0.5">{lead.company}</p>}
            {lead.email && <p className="text-zinc-500 mt-0.5">{lead.email}</p>}
            {lead.phone && <p className="text-zinc-500 mt-0.5">{lead.phone}</p>}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-400">Detalles de propuesta:</p>
            <p className="text-zinc-700 mt-1"><span className="font-semibold text-zinc-800">Fecha:</span> {dateStr}</p>
            <p className="text-zinc-700 mt-0.5"><span className="font-semibold text-zinc-800">Servicios:</span> {lead.serviceInterest?.join(", ") || "Servicios Integrales"}</p>
            <p className="text-zinc-700 mt-0.5"><span className="font-semibold text-zinc-800">Estado:</span> Borrador de Referencia</p>
          </div>
        </div>

        {/* Main Proposal Body */}
        <div className="text-sm leading-relaxed text-zinc-800 space-y-6 mb-12 whitespace-pre-line font-sans">
          {latestProposal.body}
        </div>

        {/* Investment Details Box */}
        <div className="border-t border-zinc-200 pt-8 mb-12">
          <div className="flex justify-between items-center bg-zinc-50 border border-zinc-100 rounded-xl p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Presupuesto Estimado de Inversión</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Sujeto a modificaciones según requerimientos finales</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-zinc-950 font-mono">
                ${latestProposal.amount.toLocaleString("es-AR")}
              </span>
              <span className="text-xs font-bold text-zinc-500 ml-1.5 uppercase font-mono">
                {latestProposal.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="border-t border-zinc-150 pt-8 text-center text-xs text-zinc-400 space-y-2">
          <p className="font-medium text-zinc-500">¡Muchas gracias por confiar en Cosecha Creativa!</p>
          <p className="text-[10px]">San Juan · Argentina · © {new Date().getFullYear()}</p>
        </div>
      </div>
      
      {/* Quick script to support native window.print inside react */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.print = window.print || function() {};
        document.getElementById('print-btn')?.addEventListener('click', function() {
          window.print();
        });
      `}} />
    </div>
  )
}
