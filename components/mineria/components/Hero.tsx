import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { asset } from '../lib/asset';
import Magnetic from './Magnetic';

interface HeroProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Hero: React.FC<HeroProps> = ({ heroRef, onMouseEnter, onMouseLeave }) => {
  return (
    <section ref={heroRef} className="relative min-h-screen flex items-start justify-center overflow-visible pt-24 lg:items-center lg:pt-36 pb-20">
      <div className="absolute inset-0 z-0 hero-img-container">
        <img
          src={asset('cc%20(2).png')}
          alt="Operación minera y ecosistema digital"
          className="hero-img h-full w-full object-cover object-center"
          loading="eager"
        />
        {/* Capas al tono marca: base fría + acento ámbar + lectura del texto */}
        <div
          className="pointer-events-none absolute inset-0 bg-[#07080a]/[0.38]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#ffb800]/[0.11] via-transparent to-[#ffb800]/[0.05]"
          aria-hidden
        />
        <div
          className="hero-gradient-overlay pointer-events-none absolute inset-0 will-change-transform bg-gradient-to-b from-[#07080a]/95 via-[#07080a]/42 via-40% to-[#07080a]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_62%_at_50%_18%,rgba(255,184,0,0.12),transparent_55%)] mix-blend-soft-light"
          aria-hidden
        />
      </div>

      <div className="relative z-10 px-6 text-center">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 lg:gap-10">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.55em] text-[#ffb800] bg-[rgba(255,184,0,0.1)] px-6 py-2.5 rounded-full border border-[#ffb800]/25 glow-amber-sm shadow-[0_0_30px_-10px_rgba(255,184,0,0.5)]">
              Especialistas en Marketing Digital
            </span>
            <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest text-white/20">
              <span>LAT: 22.2725° S</span>
              <span>LNG: 15.2725° E</span>
              <span className="text-[#ffb800]/40">ALT: 1,240M</span>
            </div>
          </div>

          <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-display uppercase italic leading-[0.9] tracking-tighter text-white lg:text-[clamp(4rem,11vw,9rem)]">
            <div className="hero-line overflow-visible">
              <span>ECOSISTEMA</span>
            </div>
            <div className="hero-line overflow-visible">
              <span className="text-gradient-amber">DIGITAL</span>
            </div>
            <div className="hero-line overflow-visible">
              <span>MINERO</span>
            </div>
          </h1>

          <div className="hero-meta flex w-full max-w-[34rem] flex-col items-center gap-8">
            <p className="text-lg font-medium leading-relaxed tracking-tight text-white/65 sm:text-xl lg:text-2xl">
              Prestamos servicios de marketing digital para prestadores mineros. Es momento de actuar: crear un
              ecosistema digital que permita que tu empresa sea visible, confiable y atractiva, no solo para las
              grandes mineras, sino también para otros proveedores.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Magnetic>
                <a
                  href="#services"
                  className="group inline-flex items-center gap-4 rounded-full bg-[#ffb800] px-12 py-6 text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-500 hover:bg-white hover:shadow-[0_0_50px_-10px_rgba(255,184,0,0.6)] sm:text-sm"
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  Explorar Soluciones <ArrowRight className="transition-transform group-hover:translate-x-2" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://wa.me/542645468012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-12 py-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-[#ffb800]/80 hover:bg-white/[0.04] sm:text-sm"
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  aria-label="Abrir WhatsApp para hablar con Cosecha Creativa"
                >
                  Hablanos
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
      {/* Botón bajar */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <a
          href="#services"
          className="group flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 hover:text-[#ffb800]"
          aria-label="Bajar al contenido"
        >
          <span>Bajar</span>
          <ChevronDown
            className="h-4 w-4 animate-bounce text-white/40 transition-colors duration-300 group-hover:text-[#ffb800]"
            strokeWidth={2.5}
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
