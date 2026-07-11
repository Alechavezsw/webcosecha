import { COSECHA_CONTACT_EMAIL } from "@/lib/cosecha-creativa-robot-info"
import { getWhatsAppDisplayLabel } from "@/lib/whatsapp"

function wa(): string {
  return getWhatsAppDisplayLabel()
}

/** Bloque estándar de contacto — lo usa el robot en varias respuestas. */
function bloqueContacto(): string {
  return `WhatsApp ${wa()} (o el botón de WhatsApp del sitio). Email ${COSECHA_CONTACT_EMAIL}. Si nos decís rubro y urgencia, priorizamos mejor la respuesta.`
}

/** Primer mensaje cuando abrís el chat desde el robot */
export const ASSISTANT_WELCOME =
  `¡Hola! Soy el asistente de Cosecha Creativa, agencia de marketing digital y desarrollo en San Juan. ` +
  `Podés escribirnos al WhatsApp ${wa()} o a ${COSECHA_CONTACT_EMAIL}. ` +
  `Preguntame por IA, redes, web, SEO, publicidad o consultoría — o pedime contacto directo y te lo detallo.`

/**
 * Respuestas locales (sin API): base amplia para “atender” consultas típicas.
 * Orden: temas más específicos antes que los genéricos.
 */
export function getAssistantReply(userInput: string): string {
  const raw = userInput.trim().toLowerCase()
  const t = raw
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ñ/g, "n")

  const tiene = (re: RegExp) => re.test(t)

  if (t.length < 2 || /^(hola|buen(a|o)s|hey|ey|que tal|buenas)$/.test(t)) {
    return (
      `¡Buenas! Soy el canal automático de Cosecha Creativa. ` +
      `¿Querés que te cuente sobre IA y automatización, gestión de redes y publicidad, diseño web y SEO, o consultoría estratégica? ` +
      `Para hablar con el equipo: ${bloqueContacto()}`
    )
  }

  if (tiene(/whatsapp|wsp|wasap|wa\.me/) || (tiene(/numero|telefono|celular/) && tiene(/cual|que|pasame|tenes|tienen/))) {
    return (
      `El WhatsApp de la agencia es ${wa()} (Argentina, móvil San Juan). ` +
      `También podés usar los botones verdes del sitio: abren el mismo número con un mensaje base que podés editar antes de enviar.`
    )
  }

  if (
    tiene(/contacto|mail|email|correo|escribir|hablar|comunicar|ubicacion|donde estan|donde quedan/) ||
    (tiene(/telefono|tel[eé]fono/) && !tiene(/venta|linea|soporte/))
  ) {
    return (
      `Contacto Cosecha Creativa: ${bloqueContacto()} ` +
      `Instagram @cosecha.creativa; también Facebook y LinkedIn del equipo (enlaces en el pie del sitio).`
    )
  }

  if (tiene(/horario|cuando abren|atienden|disponible|demora|respuesta/) || tiene(/urgencia|urgente/)) {
    return (
      `Los tiempos varían según la carga del equipo; por WhatsApp (${wa()}) solemos responder en horario extendido de trabajo argentino. ` +
      `Si es urgente, marcá la urgencia en el mensaje y el tipo de proyecto (ej. “sitio caído”, “campaña con fecha”).`
    )
  }

  if (tiene(/quienes son|quien soy|la agencia|nosotros|historia|equipo|manuel|founder/)) {
    return (
      `Cosecha Creativa es una agencia de marketing digital y desarrollo con foco en San Juan: unimos estrategia, creatividad, tecnología y comunicación para negocios que necesitan ordenar su presencia online y sus procesos. ` +
      `No somos solo “posteos”: trabajamos métricas, conversión y automatización donde tiene sentido. ${bloqueContacto()}`
    )
  }

  if (tiene(/precio|cuanto|cuesta|presupuesto|honorario|tarifa|cotiz|cuesta esto/)) {
    return (
      `No publicamos una lista única de precios porque cada proyecto cambia alcance, plataformas y soporte. ` +
      `Para orientarte: mandá por WhatsApp (${wa()}) qué necesitás (ej. “solo redes”, “web + SEO”, “bot de WhatsApp”) y, si podés, presupuesto aproximado o plazo. ` +
      `Así la respuesta es más concreta.`
    )
  }

  if (tiene(/san juan|argentina|pa[ií]s|ciudad|provincia|remoto|online/)) {
    return (
      `Estamos en San Juan, Argentina, y también trabajamos con clientes remotos cuando el encaje es bueno. ` +
      `Coordinamos por WhatsApp (${wa()}), mail y videollamada según lo que necesites.`
    )
  }

  if (tiene(/politic|eleccion|campania electoral|candidato|comunicacion politica/)) {
    return (
      `Tenemos experiencia en comunicación política y campañas digitales cuando el proyecto encaja con nuestra capacidad y ética de trabajo. ` +
      `Lo habitual es definir mensaje, territorios digitales, ritmo de contenidos y límites legales de publicidad. ${bloqueContacto()}`
    )
  }

  if (tiene(/constructor|obra|inmobiliaria|desarrollo inmobiliario/)) {
    return (
      `A empresas del rubro les sirve ordenar leads (WhatsApp/web), material visual consistente y reporting claro de campañas. ` +
      `Combinamos web, redes y en algunos casos automatización para que no se pierdan consultas. ${bloqueContacto()}`
    )
  }

  if (tiene(/audiovisual|video|reels|spot|grabacion|filmacion/)) {
    return (
      `Hacemos piezas y estrategia de contenido acorde al canal (reels, piezas para ads, etc.) según proyecto; ` +
      `a veces coordinamos producción con aliados si la escala lo requiere. Contanos objetivo y presupuesto orientativo por WhatsApp (${wa()}).`
    )
  }

  if (tiene(/branding|identidad|logo|grafico|grafica|diseno grafico/)) {
    return (
      `Branding y piezas gráficas van alineados a estrategia: no solo “logo lindo”, sino sistema usable en web y redes. ` +
      `Si ya tenés marca, ayudamos a aplicarla con consistencia en digital.`
    )
  }

  if (tiene(/instagram|tiktok|facebook|linkedin|redes sociales/) || (tiene(/redes/) && !tiene(/segunda|wifi/))) {
    return (
      `Gestión de redes: calendario de contenidos, tono de marca, moderación y reporting; sumamos publicidad paga cuando hay que escalar resultados con presupuesto acotado. ` +
      `Instagram @cosecha.creativa es nuestro canal más visible.`
    )
  }

  if (tiene(/publicidad|ads|meta|facebook ads|instagram ads|campania|campa[nñ]a|inversion en pauta/)) {
    return (
      `Publicidad paga: estructura de campañas, creatividades coherentes con marca, segmentación sensata y revisión semanal de métricas para aprender y ajustar — sin prometer resultados mágicos.`
    )
  }

  if (tiene(/seo|posicionamiento|google|buscador|semrush|analytics organico/)) {
    return (
      `SEO: técnico (performance, indexación), contenido alineado a intención de búsqueda y SEO local cuando aplica. ` +
      `Medimos, iteramos y te decimos qué es realista según tu mercado y competencia.`
    )
  }

  if (tiene(/consultoria|estrategia|plan|diagnostico|roadmap|marca|posicionamiento de marca/)) {
    return (
      `Consultoría estratégica: ordenamos objetivos, público, mensaje y prioridades antes de ejecutar tácticas sueltas. ` +
      `Sirve cuando sentís que “hacen cosas” pero no cierra el negocio o no sabés qué medir.`
    )
  }

  if (
    tiene(/web|sitio|pagina web|landing|wordpress|woocommerce|ecommerce|e-commerce|tienda online|mantenimiento web/) ||
    tiene(/dominio|hosting|ssl/)
  ) {
    return (
      `Diseño y desarrollo web: institucionales, landings de conversión, WordPress, e-commerce cuando el caso lo amerita. ` +
      `Pensamos velocidad, UX, SEO base, mantenimiento y seguridad básica; cada stack depende del proyecto.`
    )
  }

  if (tiene(/portafolio|casos|ejemplo|trabajos anteriores/) || tiene(/alechavez|cosechacreativa\.com\.ar/)) {
    return (
      `Tenemos material en el sitio y un portafolio en vivo en alechavez.cosechacreativa.com.ar (enlace desde el pie / desarrollo web). ` +
      `Si buscás algo parecido a tu rubro, decinos la referencia y lo vemos.`
    )
  }

  if (
    tiene(/ia|inteligencia artificial|chatbot|bot|agente|automatiz|n8n|workflow|integraci[oó]n|api|webhook|crm|sheet/) ||
    tiene(/prompt|gpt|openai|copilot/)
  ) {
    return (
      `En IA aplicada hacemos conversaciones y agentes con tono de marca, integración con Sheets, CRM, Gmail, formularios y calendarios; flujos en n8n entre sistemas; dashboards cuando hay que ver números juntos; ` +
      `y producto a medida cuando no alcanza “conectar cajas”. Siempre con límites claros de permisos y handoff a humano cuando corresponde.`
    )
  }

  if (tiene(/dashboard|metricas|m[eé]tricas|kpi|reporte|panel|looker|data studio|excel|planilla/)) {
    return (
      `Dashboards y reporting: reunimos datos dispersos en una vista útil y definimos alertas cuando un KPI se sale de rango — menos trabajo manual de armar reportes a mano cada viernes.`
    )
  }

  if (tiene(/software|desarrollo a medida|producto|saas|app|api propia/)) {
    return (
      `Cuando el caso lo requiere diseñamos pantallas, APIs y lógica propia con IA embebida donde suma; entregamos por iteraciones con tu equipo para no ir a ciegas a un mega proyecto.`
    )
  }

  if (tiene(/blog|articulo|nota|contenido seo/)) {
    return (
      `El blog y contenidos largoplazo ayudan a SEO y autoridad; lo integramos con la estrategia global (no “posts por postear”). Si querés columnas o guiones, lo vemos según recursos.`
    )
  }

  if (tiene(/privacidad|legal|cookies|datos personales|rgpd|ley/)) {
    return (
      `Tratamos datos de contacto y uso del sitio con buenas prácticas; lo contractual y alcance de tratamiento de datos lo definimos por proyecto y normativa aplicable.`
    )
  }

  if (tiene(/gracias|listo|perfecto|genial|ok|dale|buenisimo|buenísimo|chau|bye|hasta luego/)) {
    return (
      `¡Genial! Si querés retomar: WhatsApp ${wa()}, mail ${COSECHA_CONTACT_EMAIL}. Que tengas buen día.`
    )
  }

  if (tiene(/ayuda|no se|que puedo preguntar|temas|menu|opciones/)) {
    return (
      `Podés preguntar por: WhatsApp y mail; servicios (redes, ads, SEO, web, consultoría); IA y automatización; precios orientativos; San Juan / remoto; ` +
      `o describí tu negocio en una frase y te digo por dónde empezaría Cosecha Creativa. Contacto directo: ${bloqueContacto()}`
    )
  }

  return (
    `Soy un asistente automático con información de Cosecha Creativa (San Juan): marketing digital, redes, publicidad, SEO, diseño web, consultoría, IA aplicada y automatización. ` +
    `No reemplaza una llamada con el equipo, pero puedo orientarte. ` +
    `Contacto: ${bloqueContacto()} ` +
    `Probá palabras como «IA», «WhatsApp», «web», «redes», «SEO» o «precio» para una respuesta más precisa.`
  )
}
