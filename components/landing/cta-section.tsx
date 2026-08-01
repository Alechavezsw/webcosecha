"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { Magnetic } from "@/components/layout/magnetic";
import { Mail } from "lucide-react";

const VENTAS_EMAIL = "ventas@cosechacreativa.com.ar";
const mailtoHref = `mailto:${VENTAS_EMAIL}?subject=${encodeURIComponent("Consulta desde la web")}`;

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      aria-labelledby="contacto-heading"
      className="cc-aura cc-aura-center relative overflow-hidden py-28 sm:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/40 to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <span
          className={`cc-eyebrow mb-6 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <span className="cc-eyebrow-line w-8" />
          Hablemos
          <span className="cc-eyebrow-line w-8" />
        </span>

        <h2
          id="contacto-heading"
          className={`cc-section-title leading-[0.98] text-white transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:blur-none md:text-6xl lg:text-7xl ${
            isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-[6px]"
          }`}
        >
          <span className="block">Sembremos hoy.</span>
          <span className="block bg-gradient-to-r from-[#eca8d6] via-[#c77dff] to-[#a78bfa] bg-clip-text text-transparent">
            Cosechá resultados.
          </span>
        </h2>

        <p
          className={`mt-6 max-w-md text-sm leading-relaxed text-white/55 transition-all duration-1000 delay-150 sm:text-[15px] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Contanos qué necesita tu marca y te respondemos en el día. Sin vueltas y sin compromiso.
        </p>

        <div
          className={`mt-9 flex flex-wrap items-center justify-center gap-3 transition-all duration-1000 delay-300 sm:gap-4 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Magnetic>
            <Button
              size="lg"
              asChild
              className="group relative h-11 overflow-hidden rounded-full border-0 bg-white px-6 text-sm font-medium tracking-wide text-black shadow-[0_4px_28px_-6px_rgba(255,255,255,0.55)] ring-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_12px_40px_-8px_rgba(37,211,102,0.55),0_0_0_1px_rgba(37,211,102,0.25)] active:scale-[0.98] md:h-12 md:px-7 md:text-[15px]"
            >
              <a href={getWhatsAppHref("Contacto desde la web")} target="_blank" rel="noopener noreferrer" className="gap-2">
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-[#f0fff4] to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <WhatsAppMark className="relative z-10 size-[18px] shrink-0 text-[#25D366] drop-shadow-[0_0_8px_rgba(37,211,102,0.45)] transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10">Hablar por WhatsApp</span>
              </a>
            </Button>
          </Magnetic>

          <Magnetic>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="group relative h-11 overflow-hidden rounded-full border-white/20 bg-white/[0.04] px-6 text-sm font-normal text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-[#eca8d6]/40 hover:bg-white/[0.08] hover:text-white md:h-12 md:px-7 md:text-[15px]"
            >
              <a href={mailtoHref} className="gap-2">
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#eca8d6]/10 via-transparent to-[#a100f2]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <Mail className="relative z-10 size-4 shrink-0 text-[#eca8d6]/80 transition-transform duration-300 group-hover:scale-110" aria-hidden />
                <span className="relative z-10">{VENTAS_EMAIL}</span>
              </a>
            </Button>
          </Magnetic>
        </div>

        <p
          className={`mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-white/35 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Cosecha Creativa · San Juan
        </p>
      </div>
    </section>
  );
}
