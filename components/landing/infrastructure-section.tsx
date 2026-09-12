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

// Borde vivo sobre papel: en reposo un canto gris muy fino que le da volumen a
// la ficha; el degradado de marca aparece recién en hover.
const EDGE_IDLE =
  "linear-gradient(150deg, rgba(21,21,29,0.16), rgba(21,21,29,0.06) 38%, rgba(21,21,29,0.03))";
const EDGE_HOVER =
  "linear-gradient(150deg, rgba(161,0,242,0.9), rgba(236,168,214,0.75) 45%, rgba(161,0,242,0.3))";
// Canto para el único bloque en negativo (el del robot): ahí el borde tiene que
// ser claro, porque el gris del papel desaparecería contra el fondo negro.
const EDGE_DARK_IDLE =
  "linear-gradient(150deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06) 38%, rgba(255,255,255,0.03))";

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
    <section id="soluciones" ref={sectionRef} className="relative scroll-mt-28 overflow-hidden py-16 md:scroll-mt-24 lg:py-24">
      {/* Lavados de color sobre el papel: muy suaves, sólo para que la hoja no
          quede plana. Antes eran resplandores para fondo negro. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_12%_18%,rgba(161,0,242,0.09)_0%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_90%_82%,rgba(236,168,214,0.12)_0%,transparent_55%)]" />
      </div>

      <div
        className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY * -0.3}px, 0)` }}
      >
        {/* Header */}
        <div className="mb-10 lg:mb-12">
          <span
            className={`cc-eyebrow mb-4 text-[#15151d]/55 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <span className="cc-eyebrow-line w-8 bg-[#15151d]/25" />
            Qué hacemos
          </span>

          <div className="grid items-end gap-4 lg:grid-cols-2 lg:gap-8">
            <KineticHeading
              className="cc-section-title max-w-xl leading-[0.95] text-[#15151d] md:text-5xl lg:text-6xl"
              lines={[
                { text: "Soluciones integrales" },
                {
                  text: "para el ecosistema digital.",
                  mode: "line",
                  // Sobre papel el degradé arranca en violeta pleno: el rosa
                  // claro del fondo oscuro acá no se leía.
                  className:
                    "bg-gradient-to-r from-[#7b00c4] via-[#a100f2] to-[#d46fb8] bg-clip-text text-transparent",
                },
              ]}
            />

            <p
              className={`max-w-md text-sm leading-relaxed text-[#15151d]/60 lg:ml-auto lg:text-[15px] ${
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
                className={`${service.span} group/card relative rounded-2xl p-px shadow-[0_18px_44px_-26px_rgba(21,21,29,0.55)] transition-[opacity,transform,box-shadow] duration-500 ease-out hover:shadow-[0_26px_60px_-28px_rgba(161,0,242,0.45)] motion-reduce:hover:translate-y-0 ${
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

                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-[15px] p-5 backdrop-blur-xl sm:p-6 ${
                    // Las dos destacadas llevan un lavado de marca; el resto,
                    // papel liso. Así el bento tiene jerarquía sin recuadros.
                    service.featured
                      ? "bg-[linear-gradient(150deg,rgba(255,255,255,0.97),rgba(247,240,250,0.95)_55%,rgba(240,228,246,0.95))]"
                      : "bg-white/90"
                  }`}
                >
                  {/* Filete de marca al tope: se dibuja de izquierda a derecha */}
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#a100f2] via-[#c77dff] to-transparent transition-transform duration-700 ease-out group-hover/card:scale-x-100"
                    aria-hidden
                  />
                  {/* Luz de esquina detrás del ícono */}
                  <div
                    className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-50 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{ background: "radial-gradient(circle, rgba(161,0,242,0.16), transparent 68%)" }}
                    aria-hidden
                  />
                  {/* Barrido de luz que cruza la ficha al pasar el mouse */}
                  <span
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#a100f2]/[0.07] to-transparent opacity-0 transition-[left,opacity] duration-[900ms] ease-out group-hover/card:left-[115%] group-hover/card:opacity-100"
                    aria-hidden
                  />
                  {/* Ícono marca de agua: le da peso gráfico a la ficha */}
                  <Icon
                    className={`pointer-events-none absolute text-[#15151d]/[0.055] transition-[transform,color] duration-700 ease-out group-hover/card:-translate-y-1 group-hover/card:text-[#a100f2]/20 ${
                      service.featured ? "-bottom-8 -right-6 h-56 w-56" : "-bottom-5 -right-4 h-28 w-28"
                    }`}
                    strokeWidth={0.75}
                    aria-hidden
                  />

                  <div className={`relative z-10 flex items-start gap-3 ${service.featured ? "mb-5" : "mb-4"}`}>
                    <div
                      className={`services-icon-float flex shrink-0 items-center justify-center rounded-xl border border-[#15151d]/10 bg-[#15151d]/[0.04] text-[#15151d] transition-all duration-500 group-hover/card:border-[#a100f2]/45 group-hover/card:bg-[#a100f2]/[0.08] group-hover/card:text-[#a100f2] group-hover/card:shadow-[0_0_24px_-6px_rgba(161,0,242,0.5)] ${
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
                        className={`font-display text-[#15151d] ${
                          service.featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`mt-1 leading-snug text-[#15151d]/60 ${
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
                          className="rounded-full border border-[#15151d]/12 bg-white/70 px-3 py-1 text-[11px] text-[#15151d]/70 transition-colors duration-500 group-hover/card:border-[#a100f2]/30 group-hover/card:text-[#15151d] sm:text-xs"
                        >
                          {feature}
                        </li>
                      ) : (
                        <li
                          key={feature}
                          className="flex items-center text-xs text-[#15151d]/60 transition-transform duration-300 group-hover/card:translate-x-0.5 sm:text-[13px]"
                        >
                          <span className="mr-2 h-1 w-1 shrink-0 rounded-full bg-[#a100f2]/70 transition-[box-shadow] duration-500 group-hover/card:shadow-[0_0_8px_1px_rgba(161,0,242,0.55)]" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>

                  <div className="relative z-10 mt-auto border-t border-[#15151d]/10 pt-3 transition-colors duration-500 group-hover/card:border-[#a100f2]/25">
                    <Button
                      variant="link"
                      asChild
                      className="group/btn flex h-auto items-center p-0 text-xs font-semibold text-[#15151d] hover:text-[#a100f2] sm:text-sm"
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

        {/* IA + robot 3D: se queda oscuro a propósito. Es el único bloque en
            negativo de la hoja, así ancla la sección y el render 3D del robot
            mantiene su contraste. */}
        <div
          className={`group/robot relative mt-4 rounded-2xl p-px shadow-[0_26px_70px_-30px_rgba(21,21,29,0.75)] transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: EDGE_DARK_IDLE }}
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
            className="rounded-full border-0 bg-[linear-gradient(120deg,#7b00c4,#a100f2_55%,#c77dff)] px-7 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_14px_36px_-12px_rgba(161,0,242,0.65)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_44px_-12px_rgba(161,0,242,0.8)]"
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
