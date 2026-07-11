import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_HREF = 'https://wa.me/542645468012';

const FEATURES: { icon: string; title: string; body: string }[] = [
  {
    icon: '🎯',
    title: 'Segmentación estratégica',
    body: 'Llegamos a públicos específicos relacionados con la industria minera y sectores asociados.',
  },
  {
    icon: '📈',
    title: 'Campañas orientadas a resultados',
    body: 'Diseñadas para generar consultas, contactos y oportunidades de negocio.',
  },
  {
    icon: '🎨',
    title: 'Creatividad profesional',
    body: 'Anuncios alineados al lenguaje industrial, transmitiendo confianza y seriedad.',
  },
  {
    icon: '🤖',
    title: 'Optimización con datos e IA',
    body: 'Analizamos el rendimiento y ajustamos campañas en tiempo real para mejorar resultados.',
  },
  {
    icon: '🔁',
    title: 'Remarketing inteligente',
    body: 'Impactamos nuevamente a usuarios interesados para aumentar conversiones.',
  },
  {
    icon: '🔗',
    title: 'Integración con automatización',
    body: 'Conectamos campañas con formularios, CRM y sistemas para seguimiento automático.',
  },
];

const APPLICATIONS = [
  'Generación de consultas comerciales',
  'Difusión de servicios y soluciones',
  'Posicionamiento de marca en el sector',
  'Promoción de proyectos y capacidades',
  'Captación de potenciales clientes',
];

interface ServiceMetaAdsModalProps {
  open: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ServiceMetaAdsModal: React.FC<ServiceMetaAdsModalProps> = ({
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
      aria-labelledby="service-meta-ads-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#030406]/85 backdrop-blur-md transition-opacity"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div
        className="relative z-[1] flex max-h-[min(92vh,920px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#ffb800]/20 bg-[#07080a] shadow-[0_0_0_1px_rgba(255,184,0,0.08),0_40px_120px_-40px_rgba(0,0,0,0.95)]"
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
              id="service-meta-ads-modal-title"
              className="font-display text-3xl uppercase italic leading-none tracking-tighter text-white sm:text-4xl"
            >
              Meta <span className="text-[#ffb800]">Ads</span>
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
              Creamos campañas estratégicas en Facebook e Instagram para posicionar tu empresa,
              generar <span className="text-[#ffb800]">visibilidad</span> y captar oportunidades
              dentro del sector minero.
            </p>
            <p>
              La publicidad digital no se trata de llegar a más personas, sino de llegar a las{' '}
              <strong className="font-semibold text-white">personas correctas</strong>.
            </p>
            <p>
              En <strong className="font-semibold text-white">Cosecha Creativa</strong> desarrollamos
              campañas en Meta Ads enfocadas en segmentación precisa, estrategia y resultados.
              Diseñamos anuncios que comunican de forma profesional, generan interés y convierten
              visitas en contactos reales.
            </p>
            <p>
              Integramos creatividad, datos e inteligencia artificial para optimizar cada campaña y
              maximizar el retorno de inversión.
            </p>
          </div>

          <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#ffb800]/90">
            Enfoque
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

          <p className="mt-10 text-center font-medium text-white/80">
            ¿Tu empresa está aprovechando el potencial de la publicidad digital?
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

export default ServiceMetaAdsModal;
