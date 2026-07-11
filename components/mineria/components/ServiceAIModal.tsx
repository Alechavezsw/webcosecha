import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_HREF = 'https://wa.me/542645468012';

const FEATURES: { icon: string; title: string; body: string }[] = [
  {
    icon: '🧠',
    title: 'Asistentes virtuales con IA',
    body: 'Desarrollamos asistentes personalizados para empresas que gestionan información, procesos y comunicación interna o externa.',
  },
  {
    icon: '⚙️',
    title: 'Automatización con n8n',
    body: 'Integramos herramientas y sistemas para automatizar flujos de trabajo: contactos, formularios, respuestas, seguimiento y más.',
  },
  {
    icon: '🖥️',
    title: 'Desarrollo de software a medida',
    body: 'Creamos sistemas digitales adaptados a las necesidades de cada empresa: gestión, control, dashboards y procesos internos.',
  },
  {
    icon: '🚀',
    title: 'Integración con OpenClaw',
    body: 'Implementamos soluciones avanzadas para automatizar tareas complejas, centralizar procesos y escalar operaciones con inteligencia artificial.',
  },
  {
    icon: '🔗',
    title: 'Integraciones inteligentes',
    body: 'Conectamos tu web, redes, WhatsApp, CRM y herramientas digitales en un ecosistema automatizado.',
  },
];

const APPLICATIONS = [
  'Automatización de consultas comerciales',
  'Seguimiento automático de clientes',
  'Formularios inteligentes conectados a sistemas',
  'Respuestas automáticas en múltiples canales',
  'Gestión de datos y reportes en tiempo real',
  'Procesos internos digitalizados',
];

interface ServiceAIModalProps {
  open: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ServiceAIModal: React.FC<ServiceAIModalProps> = ({
  open,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-ai-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#030406]/85 backdrop-blur-md transition-opacity"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div
        className="relative z-[1] flex max-h-[min(92vh,940px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#ffb800]/20 bg-[#07080a] shadow-[0_0_0_1px_rgba(255,184,0,0.08),0_40px_120px_-40px_rgba(0,0,0,0.95)]"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,184,0,0.14),transparent_55%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,184,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.45em] text-[#ffb800]/80">
              Servicio
            </p>
            <h2
              id="service-ai-modal-title"
              className="font-display text-3xl uppercase italic leading-none tracking-tighter text-white sm:text-4xl"
            >
              Inteligencia <span className="text-[#ffb800]">Artificial</span>
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-white/15 p-2.5 text-white/50 transition-colors hover:border-[#ffb800]/50 hover:bg-white/[0.05] hover:text-[#ffb800]"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5 text-[15px] leading-relaxed text-white/70 sm:text-base">
            <p className="text-white/90">
              Desarrollamos sistemas inteligentes que automatizan procesos, optimizan la comunicación
              y generan <span className="text-[#ffb800]">oportunidades de negocio</span> en el sector
              minero.
            </p>
            <p>
              La transformación digital en minería ya no es una opción. Las empresas que incorporan
              inteligencia artificial y automatización logran mayor eficiencia, mejor comunicación y
              una ventaja competitiva real.
            </p>
            <p>
              En <strong className="font-semibold text-white">Cosecha Creativa</strong> diseñamos
              soluciones tecnológicas a medida, integrando IA, automatización y desarrollo de software
              para optimizar procesos comerciales, operativos y de atención.
            </p>
            <p>
              Creamos sistemas que trabajan de forma continua, reducen tareas manuales y permiten
              escalar resultados.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#ffb800]/15 bg-[#ffb800]/[0.06] px-5 py-4 sm:px-6 sm:py-5">
            <p className="font-display text-lg uppercase italic tracking-tight text-[#ffb800]">
              Chatbots inteligentes
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
              Implementamos asistentes automatizados capaces de responder consultas, calificar
              contactos y atender clientes las 24 horas.
            </p>
          </div>

          <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#ffb800]/90">
            Capacidades
          </p>
          <ul className="relative mt-4 space-y-5 border-t border-white/[0.06] pt-6">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ffb800]/30 bg-[#ffb800]/10 text-lg leading-none"
                  aria-hidden
                >
                  {f.icon}
                </span>
                <div>
                  <p className="font-display text-lg uppercase italic tracking-tight text-white">
                    {f.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#ffb800]/90">
            Aplicaciones
          </p>
          <ul className="mt-4 grid gap-2 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
            {APPLICATIONS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ffb800]/70"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7">
            <p className="font-display text-lg uppercase italic tracking-tight text-[#ffb800]">
              ¿Qué significa automatizar tu empresa?
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Significa que tareas que hoy requieren tiempo, personas y seguimiento manual pasan a
              ejecutarse de forma automática, precisa y escalable.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-2 text-base font-semibold text-white">
              <span aria-hidden>👉</span>
              <span>Menos trabajo operativo, más enfoque en crecimiento.</span>
            </p>
          </div>

          <p className="mt-10 text-center font-medium text-white/80">
            ¿Querés llevar tu empresa al siguiente nivel con inteligencia artificial?
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#ffb800] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_40px_-12px_rgba(255,184,0,0.55)] transition-all hover:bg-white hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.35)]"
            >
              <span aria-hidden>👉</span>
              Solicitar asesoría
            </a>
            <span className="font-mono text-xs text-white/35">264 546-8012</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAIModal;
