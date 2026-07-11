import { aiSummarizeLeadForTeam } from "@/lib/crm/ai-internal"
import { addNotification } from "@/lib/crm/notification-store"
import type { CrmLead } from "@/lib/crm/types"
import { getWhatsAppPhoneDigits } from "@/lib/whatsapp"

function teamWhatsAppAlertUrl(text: string): string {
  const phone = process.env.CRM_TEAM_WHATSAPP?.trim() || getWhatsAppPhoneDigits()
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
}

async function sendEmail(subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.CRM_NOTIFY_EMAIL?.trim()
  if (!apiKey || !to) return false

  const from = process.env.CRM_EMAIL_FROM?.trim() ?? "CRM Cosecha <onboarding@resend.dev>"
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((e) => e.trim()),
        subject,
        html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function sendWebhook(payload: Record<string, unknown>): Promise<boolean> {
  const url = process.env.CRM_NOTIFY_WEBHOOK_URL?.trim()
  if (!url) return false
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function notifyLeadEvent(
  type: "new_lead" | "calificado",
  lead: CrmLead,
): Promise<void> {
  const aiBody = await aiSummarizeLeadForTeam(lead)
  const title =
    type === "new_lead"
      ? `Nuevo lead: ${lead.name || lead.email || "sin nombre"}`
      : `Lead calificado: ${lead.name || lead.email || "sin nombre"}`

  const waText = `${title}\n\n${aiBody}\n\nVer CRM: ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/crm`
  const waUrl = teamWhatsAppAlertUrl(waText)

  const channels: CrmNotification["channels"] = ["in_app"]
  const emailOk = await sendEmail(
    `[Cosecha CRM] ${title}`,
    `<p>${aiBody.replace(/\n/g, "<br>")}</p><p><a href="${waUrl}">Abrir alerta WhatsApp equipo</a></p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/crm">Ir al CRM</a></p>`,
  )
  if (emailOk) channels.push("email")

  const webhookOk = await sendWebhook({
    type,
    leadId: lead.id,
    title,
    summary: aiBody,
    lead: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      company: lead.company,
    },
    whatsappUrl: waUrl,
  })
  if (webhookOk) channels.push("webhook")

  await addNotification({
    type,
    leadId: lead.id,
    title,
    body: `${aiBody}\n\nWhatsApp equipo: ${waUrl}`,
    channels,
  })
}
