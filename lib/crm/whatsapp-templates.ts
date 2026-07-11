export type WaTemplate = {
  id: string
  label: string
  body: string
}

export const WA_TEMPLATES: WaTemplate[] = [
  {
    id: "intro",
    label: "Primer contacto",
    body: "Hola{name}, ¿cómo estás? Soy del equipo de Cosecha Creativa. Vi tu consulta por {interest} y me gustaría coordinar una charla breve sin compromiso.",
  },
  {
    id: "followup",
    label: "Seguimiento",
    body: "Hola{name}, te escribo para ver si pudiste revisar la info. ¿Te queda bien hablar esta semana?",
  },
  {
    id: "proposal",
    label: "Propuesta enviada",
    body: "Hola{name}, te enviamos la propuesta para {interest}. Cualquier duda la vemos por acá. ¡Gracias!",
  },
  {
    id: "meeting",
    label: "Agendar reunión",
    body: "Hola{name}, ¿te va un meet de 20 min el {day}? Así te contamos cómo trabajamos en Cosecha Creativa.",
  },
]

export function fillWaTemplate(
  template: WaTemplate,
  vars: { name?: string; interest?: string; day?: string },
): string {
  const name = vars.name?.trim() ? ` ${vars.name.trim()}` : ""
  return template.body
    .replace("{name}", name)
    .replace("{interest}", vars.interest?.trim() || "nuestros servicios")
    .replace("{day}", vars.day?.trim() || "próximos días")
}
