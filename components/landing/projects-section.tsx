"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectGallerySlider } from "@/components/landing/project-gallery/project-gallery-slider";

export function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="proyectos" ref={sectionRef} className="cc-aura cc-aura-violet relative overflow-hidden py-32 lg:py-40">
      {/* Background grid pattern & ambient glowing lights */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)]" />
      <div 
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem]" 
        style={{ 
          maskImage: 'radial-gradient(ellipse at 50% 50%, black, transparent 80%)', 
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black, transparent 80%)' 
        }}
      />
      <div className="absolute -left-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -right-1/4 bottom-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-14 flex flex-col gap-6 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span
              className={`mb-6 inline-flex items-center gap-3 font-mono text-sm text-muted-foreground transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="h-px w-12 bg-foreground/30" />
              Proyectos
            </span>
            <h2
              className={`font-display text-3xl tracking-tight transition-all duration-1000 sm:text-4xl md:text-5xl lg:text-6xl text-white ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Trabajos reales,
              <span className="block text-neutral-400">resultados medibles.</span>
            </h2>
            <p
              className={`mt-6 max-w-xl text-lg text-neutral-400 transition-all duration-1000 delay-100 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Una muestra de líneas de trabajo donde combinamos estrategia, diseño, desarrollo y automatización para
              marcas, comercios e instituciones.
            </p>
          </div>
        </div>

        <div
          className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950/40 backdrop-blur-xl shadow-[0_32px_100px_-30px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Subtle running edge highlights or decorative corners */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <div className="h-[min(72vh,880px)] min-h-[560px]">
            <ProjectGallerySlider />
          </div>
        </div>
      </div>
    </section>
  );
}
