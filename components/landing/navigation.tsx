"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Nosotros", href: "/nosotros" },
  {
    name: "Servicios",
    href: "/servicios",
    dropdown: [
      { name: "Inteligencia Artificial", href: "/servicios/ia", desc: "Chatbots y automatización a medida" },
      { name: "AI First", href: "/servicios/ai-first", desc: "Transformación a modelos AI First" },
      { name: "Apps Web", href: "/servicios/apps", desc: "Plataformas web de alto rendimiento" },
      { name: "Eventos Interactivos", href: "/servicios/eventos", desc: "Trivias, juegos y virtual tours 3D" },
      { name: "Diseño Web", href: "/servicios/diseno-web", desc: "Sitios corporativos y landings premium" },
      { name: "E-commerce", href: "/servicios/ecommerce", desc: "Tiendas online optimizadas para vender" },
      { name: "SEO & Posicionamiento", href: "/servicios/seo", desc: "Tráfico orgánico y visibilidad en Google" },
      { name: "Publicidad Paga (Ads)", href: "/servicios/publicidad-paga-en-redes", desc: "Meta Ads, Google Ads y conversión" },
      { name: "Gestión de Redes", href: "/servicios/gestion-de-redes-sociales", desc: "Contenido, comunidad y branding digital" },
      { name: "Identidad de Marca", href: "/servicios/identidad-de-marca", desc: "Branding: estrategia, naming y sistema visual" },
      { name: "Diseño Gráfico", href: "/servicios/diseno-grafico", desc: "Identidad visual, logotipos y marca" },
      { name: "Foto y Video", href: "/servicios/foto-y-video", desc: "Producción audiovisual institucional" },
      { name: "Consultoría Estratégica", href: "/servicios/consultoria-estrategica", desc: "Planificación 360° para tu negocio" },
      { name: "Nube & Infraestructura", href: "/servicios/nube", desc: "VPS, automatizaciones y sistemas en la nube" }
    ]
  },
  { name: "Minería", href: "/mineria" },
  { name: "Compol", href: "/compol" },
  { name: "Blog", href: "/blog" },
] as const;

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex min-w-0 items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 truncate ${isScrolled ? "text-lg text-foreground sm:text-xl" : "text-xl text-white sm:text-2xl"}`}>
              Cosecha Creativa
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative group py-2"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <a
                      href={link.href}
                      className={`text-sm transition-colors duration-300 relative flex items-center gap-1 ${
                        isScrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <svg
                        className={`size-3 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>

                    {/* Dropdown Mega-Menu Box */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 mt-2 w-[min(540px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-black/95 p-3.5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-300 grid grid-cols-2 gap-2.5 ${
                        isDropdownOpen 
                          ? "opacity-100 translate-y-0 pointer-events-auto" 
                          : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      {link.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block rounded-xl px-3 py-2 hover:bg-white/[0.08] transition-all group"
                        >
                          <div className="font-semibold text-xs text-white/95 group-hover:text-[#eca8d6] transition-colors">
                            {subItem.name}
                          </div>
                          <div className="text-[10px] text-white/45 mt-0.5 leading-normal group-hover:text-white/60 transition-colors">
                            {subItem.desc}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors duration-300 relative group ${isScrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-foreground" : "bg-white"}`} />
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Button
              asChild
              size="sm"
              className={`rounded-full transition-all duration-500 ${isScrolled ? "bg-foreground hover:bg-foreground/90 text-background px-4 h-8 text-xs" : "bg-white hover:bg-white/90 text-black px-6"}`}
            >
              <a href="/contacto">Háblanos</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-500 ${isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex h-full flex-col px-5 pb-6 pt-24 sm:px-8 sm:pt-28 sm:pb-8">
          {/* Navigation Links */}
          <div className="flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-y-auto overscroll-contain sm:justify-center sm:gap-4">
            {navLinks.map((link, i) => {
              if (link.dropdown) {
                return (
                  <div key={link.name} className="flex flex-col gap-1.5">
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={`flex w-full items-center justify-between text-left font-display text-2xl text-foreground transition-all duration-500 hover:text-muted-foreground sm:text-3xl md:text-4xl ${
                        isMobileMenuOpen 
                          ? "opacity-100 translate-y-0" 
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
                    >
                      <span>{link.name}</span>
                      <svg
                        className={`size-5 shrink-0 transition-transform duration-300 sm:size-6 ${isMobileServicesOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div
                      className={`flex flex-col gap-1 overflow-y-auto overscroll-contain border-l border-[#eca8d6]/30 pl-3 transition-all duration-300 sm:gap-2 sm:pl-4 ${
                        isMobileServicesOpen ? "mt-2 mb-2 max-h-[min(42vh,420px)] opacity-100" : "pointer-events-none max-h-0 opacity-0"
                      }`}
                    >
                      {link.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-1 text-sm text-foreground/80 transition-colors hover:text-[#eca8d6] sm:text-base sm:py-0.5"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-display text-2xl text-foreground transition-all duration-500 hover:text-muted-foreground sm:text-3xl md:text-4xl ${
                    isMobileMenuOpen 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
          
          {/* Bottom CTAs */}
          <div className={`flex shrink-0 gap-4 border-t border-foreground/10 pt-5 transition-all duration-500 sm:pt-6 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button 
              asChild
              className="h-12 flex-1 rounded-full bg-foreground text-base text-background sm:h-14"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <a href="/contacto">Háblanos</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
