/** Alineado con `lib/cosecha-assistant-replies` y `components/chat/cosecha-crm-chat.tsx` (sitio Next). */

export const CRM_SESSION_KEY = 'cosecha_crm_session_id';

const WHATSAPP_DISPLAY = '+54 9 264 546-8012';
const CONTACT_EMAIL = 'contacto@cosechacreativa.com.ar';

export const ASSISTANT_WELCOME =
  `¡Hola! Soy el asistente de Cosecha Creativa, agencia de marketing digital y desarrollo en San Juan. ` +
  `Podés escribirnos al WhatsApp ${WHATSAPP_DISPLAY} o a ${CONTACT_EMAIL}. ` +
  `Preguntame por IA, redes, web, SEO, publicidad o consultoría — o pedime contacto directo y te lo detallo.`;

const WHATSAPP_PHONE = '5492645468012';
const WA_BASE_TEXT = 'Hola, me gustaría hablar con Cosecha Creativa.';

export function getWhatsAppHref(label?: string): string {
  const text =
    label != null && label.trim() !== ''
      ? `${WA_BASE_TEXT} Me interesa: ${label.trim()}.`
      : WA_BASE_TEXT;
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(CRM_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CRM_SESSION_KEY, id);
  }
  return id;
}
