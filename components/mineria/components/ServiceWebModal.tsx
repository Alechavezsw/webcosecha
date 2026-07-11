import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_HREF = 'https://wa.me/542645468012';

const FEATURES = [
  {
    title: 'Diseño profesional y corporativo',
    body: 'Estética alineada al sector industrial y minero, transmitiendo seriedad, confianza y solidez.',
  },
  {
    title: 'Optimización para generar contactos',
    body: 'Estructura pensada para convertir visitas en consultas reales.',
  },
  {
    title: 'SEO enfocado en minería',
    body: 'Tu empresa visible en Google para búsquedas clave del sector.',
  },
  {
    title: 'Integración con automatización e IA',
    body: 'Formularios inteligentes, respuestas automáticas y conexión con sistemas.',
  },
  {
    title: 'Adaptado a todos los dispositivos',
    body: 'Experiencia perfecta en celular, tablet y escritorio.',
  },
  {
    title: 'Velocidad, seguridad y rendimiento',
    body: 'Webs rápidas, seguras y preparadas para escala.',
  },
];

interface ServiceWebModalProps {
  open: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ServiceWebModal: React.FC<ServiceWebModalProps> = ({
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
      aria-labelledby="service-web-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#030406]/85 backdrop-blur-md transition-opacity"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div
        className="relative z-[1] flex max-h-[min(92vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#ffb800]/20 bg-[#07080a] shadow-[0_0_0_1px_rgba(255,184,0,0.08),0_40px_120px_-40px_rgba(0,0,0,0.95)]"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,184,0,0.14),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,184,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.35) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.45em] text-[#ffb800]/80">
              Servicio
            </p>
            <h2
              id="service-web-modal-title"
              className="font-display text-3xl uppercase italic leading-none tracking-tighter text-white sm:text-4xl"
            >
              Sitio <span className="text-[#ffb800]">Web</span>
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
              Tu sitio web no es solo una presentación: es la{' '}
              <span className="text-[#ffb800]">puerta de entrada</span> a nuevos clientes, contratos
              y alianzas dentro de la industria.
            </p>
            <p>
              En <strong className="font-semibold text-white">Cosecha Creativa</strong> diseñamos
              webs premium enfocadas en posicionamiento, confianza y conversión. Creamos plataformas
              digitales que representan el nivel profesional de tu empresa y funcionan como una
              herramienta activa para generar contactos.
            </p>
            <p>
              Integramos diseño, estrategia, tecnología e inteligencia artificial para que tu web
              trabaje por vos las 24 horas.
            </p>
          </div>

          <ul className="relative mt-8 space-y-5 border-t border-white/[0.06] pt-8">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#ffb800]/35 bg-[#ffb800]/10 text-xs font-bold text-[#ffb800]"
                  aria-hidden
                >
                  ✓
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

          <p className="mt-10 text-center font-medium text-white/80">
            ¿Tu empresa está lista para tener una presencia digital a la altura del sector minero?
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

export default ServiceWebModal;
