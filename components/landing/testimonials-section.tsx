"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Nos prestaron una gran cobertura fotográfica en el tiempo, nos acompañaron por toda la provincia",
    author: "Alberto Hensel",
    role: "Ex ministro de gobierno",
    company: null as string | null,
    service: "Cobertura fotográfica",
    rating: 5,
  },
  {
    quote:
      "Un trabajo impecable, nuestra web quedó hermosa, trabajamos en equipo eso que vivimos en Nueva Zelanda, la distancia y el uso horario no fueron problema",
    author: "Bruno Saba",
    role: "Pumpkink",
    company: "PUMPKIN · BIM Solutions",
    service: "Diseño Web",
    rating: 5,
  },
  {
    quote:
      "Nos desarrollaron una web muy funcional a nuestro pedido, nos dieron tecnología al pueblo de 9 de Julio",
    author: "Daniel Banega",
    role: "Intendente 9 de Julio",
    company: null,
    service: "Diseño web y mails oficiales",
    rating: 4,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 md:h-6 md:w-6 ${
            i <= rating
              ? "fill-[#eca8d6] text-[#eca8d6]"
              : "fill-transparent text-white/25"
          }`}
          strokeWidth={i <= rating ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);

  const active = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="feedbacks"
      className="cc-aura cc-aura-rose relative overflow-hidden py-32 text-white lg:py-40"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">
        <header className="text-center">
          <p
            className={`mb-4 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[#eca8d6]/70 transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Feedbacks
          </p>
          <h2
            className={`font-display text-3xl font-bold tracking-tight transition-all duration-1000 md:text-4xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Algunos de nuestros clientes
          </h2>
          <p
            className={`mt-3 text-base text-white/55 transition-all duration-1000 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Gracias por confiar en nuestro trabajo
          </p>
        </header>

        <div
          className={`relative mx-auto mt-14 max-w-xl transition-all duration-1000 delay-150 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Tarjeta de vidrio: deja translucir el campo 3D detrás manteniendo legibilidad */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0612]/55 px-6 py-12 backdrop-blur-xl shadow-[0_30px_90px_-30px_rgba(0,0,0,0.85)] sm:px-10">
            {/* Aura de marca dentro de la tarjeta */}
            <div className="pointer-events-none absolute -inset-px rounded-[2rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(236,168,214,0.10),transparent_60%)]" aria-hidden />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/40 to-transparent" aria-hidden />

            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 p-3 text-white/80 transition-colors hover:border-[#eca8d6]/40 hover:bg-white/10 hover:text-white lg:flex"
                aria-label="Anterior"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 p-3 text-white/80 transition-colors hover:border-[#eca8d6]/40 hover:bg-white/10 hover:text-white lg:flex"
                aria-label="Siguiente"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              <article
                key={activeIndex}
                className="testimonial-slide flex w-full flex-col items-center px-2 text-center"
              >
                <h3 className="text-xl font-bold text-white">{active.author}</h3>
                <p className="mt-1 text-sm text-white/55">{active.role}</p>
                {active.company ? (
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#eca8d6]/95">
                    {active.company}
                  </p>
                ) : null}

                <p className="mt-4 text-base font-semibold text-white/90">{active.service}</p>

                <div className="mt-4">
                  <StarRating rating={active.rating} />
                </div>

                <blockquote className="mt-8 text-base leading-relaxed text-white/70">
                  <span className="text-[#eca8d6]/50">&ldquo;</span>
                  {active.quote}
                  <span className="text-[#eca8d6]/50">&rdquo;</span>
                </blockquote>
              </article>
            </div>

            <div className="mt-10 flex justify-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeIndex
                      ? "w-6 bg-gradient-to-r from-[#eca8d6] to-[#a100f2] shadow-[0_0_10px_rgba(236,168,214,0.6)]"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Ver testimonio ${idx + 1}`}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-full border border-white/15 p-3 text-white/80 transition-colors hover:bg-white/10"
                aria-label="Anterior"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-white/15 p-3 text-white/80 transition-colors hover:bg-white/10"
                aria-label="Siguiente"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-slide {
          animation: testimonialFade 0.45s ease-out;
        }
        @keyframes testimonialFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
