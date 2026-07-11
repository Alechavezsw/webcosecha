/** San Juan — número local 264 546-8012 → internacional móvil AR (54 9 264 …). */
const DEFAULT_WHATSAPP_PHONE = "5492645468012";

export function normalizeWhatsAppPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return DEFAULT_WHATSAPP_PHONE;
  if (digits.startsWith("54")) return digits;
  if (digits.length === 10 && digits.startsWith("264")) return `549${digits}`;
  return digits;
}

/** Dígitos E.164 sin + (ej. 5492645468012) — mismo criterio que los links del sitio. */
export function getWhatsAppPhoneDigits(): string {
  return normalizeWhatsAppPhone(process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "");
}

/** Texto humano para Argentina móvil (ej. +54 9 264 546-8012). */
export function getWhatsAppDisplayLabel(): string {
  const d = getWhatsAppPhoneDigits();
  if (d.startsWith("549") && d.length === 13) {
    return `+54 9 ${d.slice(3, 6)} ${d.slice(6, 9)}-${d.slice(9)}`;
  }
  return d ? `+${d}` : `+${DEFAULT_WHATSAPP_PHONE}`;
}

const BASE_MESSAGE = "Hola, me gustaría hablar con Cosecha Creativa.";

/**
 * URL de contacto WhatsApp. Opcionalmente añade contexto (ej. nombre del servicio).
 * Si existe `NEXT_PUBLIC_WHATSAPP_URL`, se usa tal cual (sin prefijar texto).
 */
export function getWhatsAppHref(serviceLabel?: string): string {
  const preset = process.env.NEXT_PUBLIC_WHATSAPP_URL;
  if (preset) return preset;

  const phone = normalizeWhatsAppPhone(process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "");
  const text =
    serviceLabel != null && serviceLabel.trim() !== ""
      ? `${BASE_MESSAGE} Me interesa: ${serviceLabel.trim()}.`
      : BASE_MESSAGE;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}
