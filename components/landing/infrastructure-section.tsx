"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, Monitor, Cpu, PenTool, Camera, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { useImmersiveParallax } from "@/lib/use-immersive-parallax";
import { tiltMove, tiltReset, tiltGlareStyle } from "@/lib/card-tilt";
import { RobotEmbed } from "@/components/landing/robot-embed";

const services = [
  {
    id: "redes",
    title: "Gestión de Redes",
    icon: <Smartphone className="w-6 h-6" />,
    description: "Construimos comunidades y potenciamos tu alcance con contenido estratégico y de calidad.",
    features: ["Planificación mensual", "Diseño de piezas", "Redacción de copys", "Reportes mensuales"],
    cta: "Impulsar mi marca",
    href: "/servicios/gestion-de-redes-sociales"
  },
  {
    id: "web",
    title: "Diseño Web",
    icon: <Monitor className="w-6 h-6" />,
    description: "Desarrollamos sitios y tiendas online a medida que funcionan como motores de venta y captación.",
    features: ["Sitios institucionales", "Tiendas online", "Diseño responsive", "Optimizado SEO"],
    cta: "Crear mi web",
    href: "/servicios/diseno-web"
  },
  {
    id: "ia",
    title: "Automatizaciones IA",
    icon: <Cpu className="w-6 h-6" />,
    description: "Implementamos tecnología inteligente para que tu negocio responda consultas y venda las 24hs.",
    features: ["Chatbots con IA", "Flujos con n8n", "Asistentes virtuales", "Integración WhatsApp"],
    cta: "Automatizar mi negocio",
    href: "/servicios/ia"
  },
  {
    id: "branding",
    title: "Diseño Gráfico",
    icon: <PenTool className="w-6 h-6" />,
    description: "Creamos identidades visuales sólidas que transmiten los valores de tu empresa.",
    features: ["Identidad visual", "Manual de marca", "Placas comerciales", "Material publicitario"],
    cta: "Mejorar mi imagen",
    href: "/servicios/diseno-grafico",
  },
  {
    id: "foto-video",
    title: "Foto y Video",
    icon: <Camera className="w-6 h-6" />,
    description: "Producimos material fotográfico y audiovisual de alta calidad para mostrar tus productos.",
    features: ["Fotografía profesional", "Videos corporativos", "Reels dinámicos", "Edición audiovisual"],
    cta: "Producir contenido",
    href: "/servicios/foto-y-video",
  },
  {
    id: "politica",
    title: "Com. Política",
    icon: <Megaphone className="w-6 h-6" />,
    description: "Gestionamos la imagen pública de candidatos e instituciones con estrategias sólidas.",
    features: ["Estrategia pública", "Redacción discursos", "Gestión de imagen", "Campañas digitales"],
    cta: "Quiero una estrategia",
    href: "/compol"
  }
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
    <section id="soluciones" ref={sectionRef} className="cc-aura cc-aura-violet relative scroll-mt-28 overflow-hidden bg-black/55 py-16 md:scroll-mt-24 lg:py-24">
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
            <h2
              className={`cc-section-title max-w-xl leading-[0.95] text-white transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:blur-none md:text-5xl lg:text-6xl ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[6px]"
              }`}
            >
              <span className="block">Soluciones integrales</span>
              <span className="block bg-gradient-to-r from-[#c77dff] via-[#eca8d6] to-[#f0c8e4] bg-clip-text text-transparent">para el ecosistema digital.</span>
            </h2>

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

        {/* Services Grid */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.id}
              onPointerMove={tiltMove}
              onPointerLeave={tiltReset}
              className={`group/card relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/78 p-5 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-[opacity,transform,box-shadow,border-color,background-color] duration-500 ease-out motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 hover:-translate-y-1 hover:border-[#eca8d6]/25 hover:bg-zinc-950/92 hover:shadow-[0_16px_44px_-14px_rgba(0,0,0,0.9),0_0_32px_-12px_rgba(236,168,214,0.15)] sm:p-6 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${240 + index * 65}ms` : "0ms",
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-black/50" aria-hidden />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                style={tiltGlareStyle()}
                aria-hidden
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/35 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

              <div className="relative z-10 mb-4 flex items-start gap-3">
                <div
                  className="services-icon-float flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-black/45 text-white transition-all duration-500 group-hover/card:border-[#eca8d6]/35 group-hover/card:bg-black/55 group-hover/card:text-[#eca8d6] group-hover/card:shadow-[0_0_20px_-4px_rgba(236,168,214,0.35)] sm:h-11 sm:w-11"
                  style={{ animationDelay: `${index * 0.45}s` }}
                >
                  <span className="scale-90 transition-transform duration-500 group-hover/card:rotate-6 sm:scale-100">
                    {service.icon}
                  </span>
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-display text-lg text-white sm:text-xl">{service.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-white/55">{service.description}</p>
                </div>
              </div>

              <ul className="relative z-10 mb-4 space-y-1.5">
                {service.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-xs text-white/50 transition-transform duration-300 group-hover/card:translate-x-0.5 sm:text-[13px]"
                  >
                    <span className="mr-2 h-1 w-1 shrink-0 rounded-full bg-[#eca8d6]/80" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="relative z-10 mt-auto border-t border-white/[0.06] pt-3 transition-colors duration-500 group-hover/card:border-[#eca8d6]/12">
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

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-transparent via-[#eca8d6]/60 to-transparent transition-transform duration-500 ease-out group-hover/card:scale-x-100" />
            </div>
          ))}
        </div>

        {/* IA + robot 3D integrado */}
        <div
          className={`mt-10 grid items-center gap-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-xl lg:grid-cols-2 lg:p-8 ${
            isVisible ? "opacity-100" : "opacity-0"
          } transition-all duration-1000 delay-300`}
        >
          <div>
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
          <RobotEmbed className="h-[min(56vw,300px)] lg:h-[320px]" />
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
