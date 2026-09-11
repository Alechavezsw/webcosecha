"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, Monitor, Cpu, PenTool, Camera, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KineticHeading } from "@/components/landing/kinetic-heading";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";
import { tiltMove, tiltReset } from "@/lib/card-tilt";
import { CosechaRobot } from "@/components/landing/cosecha-robot";

// Borde vivo: el degradado de marca sólo aparece en hover; en reposo queda una
// luz blanca muy tenue arriba a la izquierda que le da volumen a la ficha.
const EDGE_IDLE =
  "linear-gradient(150deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.02))";
const EDGE_HOVER =
  "linear-gradient(150deg, rgba(161,0,242,0.85), rgba(236,168,214,0.7) 45%, rgba(161,0,242,0.25))";

// La grilla es un BENTO de 6 columnas: los anchos suman 6 por fila (2+4 / 4+2 / 3+3).
// Diseño Web y Automatizaciones IA quedan destacadas — son las dos puntas de lanza.
const services = [
  {
    id: "redes",
    title: "Gestión de Redes",
    Icon: Smartphone,
    description: "Construimos comunidades y potenciamos tu alcance con contenido estratégico y de calidad.",
    features: ["Planificación mensual", "Diseño de piezas", "Redacción de copys", "Reportes mensuales"],
    cta: "Impulsar mi marca",
    href: "/servicios/gestion-de-redes-sociales",
    span: "lg:col-span-2",
    featured: false,
  },
  {
    id: "web",
    title: "Diseño Web",
    Icon: Monitor,
    description: "Desarrollamos sitios y tiendas online a medida que funcionan como motores de venta y captación.",
    features: ["Sitios institucionales", "Tiendas online", "Diseño responsive", "Optimizado SEO"],
    cta: "Crear mi web",
    href: "/servicios/diseno-web",
    span: "sm:col-span-2 lg:col-span-4",
    featured: true,
  },
  {
    id: "ia",
    title: "Automatizaciones IA",
    Icon: Cpu,
    description: "Implementamos tecnología inteligente para que tu negocio responda consultas y venda las 24hs.",
    features: ["Chatbots con IA", "Flujos con n8n", "Asistentes virtuales", "Integración WhatsApp"],
    cta: "Automatizar mi negocio",
    href: "/servicios/ia",
    span: "sm:col-span-2 lg:col-span-4",
    featured: true,
  },
  {
    id: "branding",
    title: "Diseño Gráfico",
    Icon: PenTool,
    description: "Creamos identidades visuales sólidas que transmiten los valores de tu empresa.",
    features: ["Identidad visual", "Manual de marca", "Placas comerciales", "Material publicitario"],
    cta: "Mejorar mi imagen",
    href: "/servicios/diseno-grafico",
    span: "lg:col-span-2",
    featured: false,
  },
  {
    id: "foto-video",
    title: "Foto y Video",
    Icon: Camera,
    description: "Producimos material fotográfico y audiovisual de alta calidad para mostrar tus productos.",
    features: ["Fotografía profesional", "Videos corporativos", "Reels dinámicos", "Edición audiovisual"],
    cta: "Producir contenido",
    href: "/servicios/foto-y-video",
    span: "lg:col-span-3",
    featured: false,
  },
  {
    id: "politica",
    title: "Com. Política",
    Icon: Megaphone,
    description: "Gestionamos la imagen pública de candidatos e instituciones con estrategias sólidas.",
    features: ["Estrategia pública", "Redacción discursos", "Gestión de imagen", "Campañas digitales"],
    cta: "Quiero una estrategia",
    href: "/compol",
    span: "lg:col-span-3",
    featured: false,
  },
];

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxY = useImmersiveParallax(sectionRef, 220);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="soluciones" ref={sectionRef} className="cc-aura cc-aura-violet relative scroll-mt-28 overflow-hidden py-16 md:scroll-mt-24 lg:py-24">
      {/* Fondo aurora: negro con luz violeta/rosa de marca */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a100f2]/50 to-transparent" />
        <div className="absolute inset-x-[10%] top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(161,0,242,0.13)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,rgba(161,0,242,0.12)_0%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_88%_80%,rgba(236,168,214,0.1)_0%,transparent_55%)]" />
      </div>

      <div
        className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY * -0.3}px, 0)` }}
      >
        {/* Header */}
        <div className="mb-10 lg:mb-12">
          <span
            className={`cc-eyebrow mb-4 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <span className="cc-eyebrow-line w-8" />
            Qué hacemos
          </span>

          <div className="grid items-end gap-4 lg:grid-cols-2 lg:gap-8">
            <KineticHeading
              className="cc-section-title max-w-xl leading-[0.95] text-white md:text-5xl lg:text-6xl"
              lines={[
                { text: "Soluciones integrales" },
                {
                  text: "para el ecosistema digital.",
                  mode: "line",
                  className:
                    "bg-gradient-to-r from-[#c77dff] via-[#eca8d6] to-[#f0c8e4] bg-clip-text text-transparent",
                },
              ]}
            />

            <p
              className={`max-w-md text-sm leading-relaxed text-white/55 lg:ml-auto lg:text-[15px] ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } transition-all duration-1000 delay-150`}
            >
              Herramientas para comunicar mejor, optimizar procesos y multiplicar oportunidades de venta — de la
              idea a la automatización.
            </p>
          </div>
        </div>

        {/* Services Grid — bento de 6 columnas */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
          {services.map((service, index) => {
            const { Icon } = service;
            return (
              <article
                key={service.id}
                onPointerMove={tiltMove}
                onPointerLeave={tiltReset}
                className={`${service.span} group/card relative rounded-2xl p-px shadow-[0_16px_50px_-20px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-500 ease-out motion-reduce:hover:translate-y-0 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{
                  background: EDGE_IDLE,
                  transitionDelay: isVisible ? `${240 + index * 65}ms` : "0ms",
                }}
              >
                {/* Borde de marca que se enciende */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: EDGE_HOVER }}
                  aria-hidden
                />

                <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-zinc-950/90 p-5 backdrop-blur-xl sm:p-6">
                  {/* Luz de esquina detrás del ícono */}
                  <div
                    className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-60 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{ background: "radial-gradient(circle, rgba(161,0,242,0.22), transparent 68%)" }}
                    aria-hidden
                  />
                  {/* Barrido de luz que cruza la ficha al pasar el mouse */}
                  <span
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 transition-[left,opacity] duration-[900ms] ease-out group-hover/card:left-[115%] group-hover/card:opacity-100"
                    aria-hidden
                  />
                  {/* Ícono marca de agua: le da peso gráfico a la ficha */}
                  <Icon
                    className={`pointer-events-none absolute text-white/[0.045] transition-[transform,color] duration-700 ease-out group-hover/card:-translate-y-1 group-hover/card:text-[#a100f2]/25 ${
                      service.featured ? "-bottom-8 -right-6 h-56 w-56" : "-bottom-5 -right-4 h-28 w-28"
                    }`}
                    strokeWidth={0.75}
                    aria-hidden
                  />

                  <div className={`relative z-10 flex items-start gap-3 ${service.featured ? "mb-5" : "mb-4"}`}>
                    <div
                      className={`services-icon-float flex shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-black/45 text-white transition-all duration-500 group-hover/card:border-[#eca8d6]/40 group-hover/card:text-[#eca8d6] group-hover/card:shadow-[0_0_24px_-4px_rgba(236,168,214,0.45)] ${
                        service.featured ? "h-12 w-12" : "h-10 w-10 sm:h-11 sm:w-11"
                      }`}
                      style={{ animationDelay: `${index * 0.45}s` }}
                    >
                      <Icon
                        className={`transition-transform duration-500 group-hover/card:rotate-6 ${
                          service.featured ? "h-6 w-6" : "h-5 w-5"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3
                        className={`font-display text-white ${
                          service.featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`mt-1 leading-snug text-white/55 ${
                          service.featured ? "text-sm sm:text-[15px]" : "text-sm"
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Destacadas: píldoras al pie, para que el aire quede arriba (con la
                      marca de agua) y no como un hueco entre la lista y el CTA. */}
                  <ul
                    className={`relative z-10 mb-4 ${
                      service.featured ? "mt-auto flex flex-wrap gap-2 pt-6" : "space-y-1.5"
                    }`}
                  >
                    {service.features.map((feature) =>
                      service.featured ? (
                        <li
                          key={feature}
                          className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] text-white/65 transition-colors duration-500 group-hover/card:border-[#eca8d6]/25 group-hover/card:text-white/80 sm:text-xs"
                        >
                          {feature}
                        </li>
                      ) : (
                        <li
                          key={feature}
                          className="flex items-center text-xs text-white/50 transition-transform duration-300 group-hover/card:translate-x-0.5 sm:text-[13px]"
                        >
                          <span className="mr-2 h-1 w-1 shrink-0 rounded-full bg-[#eca8d6]/80 transition-[box-shadow] duration-500 group-hover/card:shadow-[0_0_8px_1px_rgba(236,168,214,0.7)]" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>

                  <div className="relative z-10 mt-auto border-t border-white/[0.06] pt-3 transition-colors duration-500 group-hover/card:border-[#eca8d6]/20">
                    <Button
                      variant="link"
                      asChild
                      className="group/btn flex h-auto items-center p-0 text-xs font-medium text-white/85 hover:text-[#eca8d6] sm:text-sm"
                    >
                      {"href" in service && service.href ? (
                        <Link href={service.href}>
                          {service.cta}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" />
                        </Link>
                      ) : (
                        <a href={getWhatsAppHref(service.title)} target="_blank" rel="noopener noreferrer">
                          {service.cta}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" />
                        </a>
                      )}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* IA + robot 3D integrado — cierra la sección con el mismo borde vivo */}
        <div
          className={`group/robot relative mt-4 rounded-2xl p-px shadow-[0_18px_60px_-24px_rgba(0,0,0,0.95)] transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: EDGE_IDLE }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/robot:opacity-100"
            style={{ background: EDGE_HOVER }}
            aria-hidden
          />
          <div className="relative grid items-center gap-6 overflow-hidden rounded-[15px] bg-zinc-950/85 p-6 backdrop-blur-xl lg:grid-cols-2 lg:p-8">
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(161,0,242,0.2), transparent 68%)" }}
              aria-hidden
            />
            <div className="relative z-10">
              <span className="cc-eyebrow-accent text-[10px] text-[#eca8d6]">Automatización con IA</span>
              <h3 className="mt-3 font-display text-2xl text-white sm:text-3xl">
                Agentes que trabajan mientras vos decidís.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
                Chatbots, flujos con n8n e integración con WhatsApp para responder consultas, cargar datos y dar seguimiento comercial sin sumar horas al equipo.
              </p>
              <Button variant="link" asChild className="mt-4 h-auto p-0 text-sm text-[#eca8d6] hover:text-white">
                <Link href="/servicios/ia">
                  Conocer automatizaciones
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
            <CosechaRobot className="relative z-10 h-[min(56vw,300px)] lg:h-[320px]" />
          </div>
        </div>

        {/* Botón para ver todos los servicios */}
        <div
          className={`mt-10 flex justify-center transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Button
            asChild
            size="default"
            className="rounded-full border border-[#eca8d6]/30 bg-[#eca8d6]/90 px-6 py-2.5 text-sm font-medium tracking-wide text-black shadow-[0_8px_32px_-8px_rgba(236,168,214,0.4)] transition-all duration-300 hover:bg-[#f0b8e0]"
          >
            <Link href="/servicios">
              Ver todos los servicios
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
