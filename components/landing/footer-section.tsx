"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

const footerLinks = {
  "Marketing Digital": [
    { name: "Minería", href: "/mineria" },
    { name: "Diseño", href: "/servicios/diseno-grafico" },
    { name: "Gestión de Redes", href: "/servicios/gestion-de-redes-sociales" },
    { name: "Publicidad Paga", href: "/servicios/publicidad-paga-en-redes" },
    { name: "Posicionamiento SEO", href: "/servicios/seo" },
    { name: "Consultoría estratégica", href: "/servicios/consultoria-estrategica" },
  ],
  "Desarrollo Web": [
    { name: "Diseño Web", href: "/servicios/diseno-web" },
    {
      name: "Portafolio",
      href: "https://alechavez.cosechacreativa.com.ar/",
    },
    { name: "Apps", href: "/servicios/apps" },
    { name: "Ecommerce", href: "/servicios/ecommerce" },
    { name: "Landing pages", href: "/servicios/diseno-web#landing" },
    { name: "WordPress", href: "/servicios/diseno-web#wordpress" },
  ],
  Otros: [
    { name: "AI FIRST", href: "/servicios/ai-first" },
    { name: "Cosecha Creativa IA", href: "/servicios/ia" },
    { name: "Nube", href: "/nube" },
    { name: "Eventos", href: "/servicios/eventos" },
    { name: "Compol", href: "/compol" },
    { name: "Foto y Video", href: "/servicios/foto-y-video" },
  ],
  Empresa: [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Blog", href: "/blog" },
    { name: "Privacidad", href: "/privacidad" },
    { name: "Términos", href: "/terminos" },
    { name: "Seguridad", href: "/seguridad" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/cosecha.creativa/" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61551889621823" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/manuel-alejandro-chávez-1316aa241",
  },
];

function AnimatedWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pausa fuera de viewport: no dibujar olas que no se ven
    let isInView = true;
    const io = new IntersectionObserver(
      ([entry]) => { isInView = entry?.isIntersecting ?? true; },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const animate = () => {
      if (!isInView) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(100, 200, 150, 0.3)";
      ctx.lineWidth = 1;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.01 + time + wave * 0.5) * 30 +
            Math.sin(x * 0.02 + time * 1.5 + wave) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      io.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function FooterSection() {
  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Background Image behind the entire footer content and links */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/footer-bg.png"
          alt="Bioluminescent landscape"
          className="w-full h-full object-cover object-center opacity-75 saturate-[1.1] brightness-[0.75]"
        />
        {/* Gradients to blend smoothly with black sections above and below and ensure high readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — white text overlaid on top of the bioluminescent background */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="/" className="mb-6 inline-flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-white sm:text-2xl tracking-wide">Cosecha Creativa</span>
              </a>

              <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/80 font-medium">
                Agencia de marketing digital en San Juan. Estrategia, creatividad y tecnología para que tu marca crezca.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-white/70 font-semibold hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-bold text-white mb-6 tracking-wider uppercase opacity-90">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm text-white/70 font-semibold hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-white text-black rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60 font-medium">
            &copy; 2026 Cosecha Creativa. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-sm text-white/60 font-medium">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#eca8d6]" />
              San Juan, Argentina
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
