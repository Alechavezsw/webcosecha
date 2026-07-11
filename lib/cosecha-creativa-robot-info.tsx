import Link from "next/link"

/** Copy centralizado para el “asistente” del robot (sección IA). */
export const COSECHA_CONTACT_EMAIL = "contacto@cosechacreativa.com.ar"

export const COSECHA_ROBOT_MESSAGE_BLOCKS: string[] = [
  `Soy el asistente de Cosecha Creativa. Somos una agencia de marketing digital y desarrollo con base en San Juan, Argentina: unimos creatividad, estrategia, tecnología y comunicación para que tu negocio tenga presencia seria en internet y procesos que escalan.`,

  `Qué hacemos en la práctica: gestión de redes sociales y comunidad; publicidad paga en Meta y otros canales con foco en resultados; SEO y posicionamiento; consultoría estratégica de marca y go-to-market; diseño y desarrollo web (sitios institucionales, landings, WordPress, e-commerce); automatización de procesos con herramientas como n8n; inteligencia artificial aplicada (chatbots y agentes conectados a Sheets, CRM, formularios y calendarios); dashboards y reporting para decisiones con datos claros; y desarrollo a medida cuando el caso lo requiere.`,

  `En la vertical IA ofrecemos de forma explícita: Chatbots inteligentes (WhatsApp, Instagram, widget web con handoff a humano); Agentes conectados a Sheets, Gmail, CRM, WordPress, formularios y bases de datos; Automatización con n8n entre APIs y sistemas; IA aplicada a marketing y ventas (borradores, priorización de leads, seguimiento); Dashboards inteligentes unificando KPIs y alertas; y Software con IA a medida cuando hace falta producto propio.`,

  `En Cosecha Creativa IA trabajamos diagnóstico de procesos, diseño de flujos con roles humanos claros, implementación con pruebas junto a tu equipo y medición (tiempo ahorrado, leads atendidos, errores evitados). No vendemos humo: la IA queda acotada a políticas, permisos y logs auditables.`,

  `Metodología resumida en cuatro pasos: Diagnóstico — entender procesos, herramientas y dolores reales. Diseño de flujos — definir agentes, disparadores, datos sensibles y quién interviene humano. Implementación — construir, conectar y probar con tu equipo hasta que el flujo sea confiable. Medición — seguir métricas simples y ajustar con datos.`,

  `Canales y foco geográfico: acompañamos marcas y equipos que necesitan ordenar consultas en WhatsApp, Instagram y web, mejorar seguimiento comercial y dejar de depender del “copiar y pegar” entre planillas y mails. Operamos con foco en San Juan y proyectos remotos cuando encaja el fit.`,

  `Contacto: podés escribirnos por email a ${COSECHA_CONTACT_EMAIL} o usar WhatsApp desde los botones del sitio. Redes: Instagram @cosecha.creativa, Facebook y LinkedIn del equipo. Sitio y rutas útiles: inicio (/), servicios de redes (/servicios/gestion-de-redes-sociales), publicidad paga (/servicios/publicidad-paga-en-redes), SEO (/servicios/seo), consultoría (/servicios/consultoria-estrategica), diseño web (/servicios/diseno-web), apps y software a medida (/servicios/apps), y esta misma página de IA (/servicios/ia).`,

  `Legal y datos: el sitio enlaza políticas de privacidad y términos donde correspondan; tratamos datos de contacto y analytics según buenas prácticas y lo que acuerdes en cada proyecto. © ${new Date().getFullYear()} Cosecha Creativa.`,
]

export function CosechaRobotLinks({
  whatsAppHref,
  className,
}: {
  whatsAppHref: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/45">Enlaces rápidos</p>
      <ul className="flex flex-col gap-2 text-sm text-sky-300/95 underline-offset-4 hover:text-sky-200">
        <li>
          <a href={whatsAppHref} target="_blank" rel="noopener noreferrer" className="underline">
            WhatsApp — conversación directa
          </a>
        </li>
        <li>
          <a href={`mailto:${COSECHA_CONTACT_EMAIL}?subject=Consulta%20Cosecha%20Creativa`} className="underline">
            Email {COSECHA_CONTACT_EMAIL}
          </a>
        </li>
        <li>
          <Link href="/servicios/diseno-web" className="underline">
            Diseño web
          </Link>
        </li>
        <li>
          <Link href="/servicios/gestion-de-redes-sociales" className="underline">
            Gestión de redes
          </Link>
        </li>
        <li>
          <Link href="/servicios/ia" className="underline">
            Cosecha Creativa IA
          </Link>
        </li>
        <li>
          <a href="https://www.instagram.com/cosecha.creativa/" target="_blank" rel="noopener noreferrer" className="underline">
            Instagram
          </a>
        </li>
      </ul>
    </div>
  )
}
