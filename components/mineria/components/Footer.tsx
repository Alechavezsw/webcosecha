import React from 'react';
import { Pickaxe } from 'lucide-react';

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
    { name: "Portafolio", href: "https://alechavez.cosechacreativa.com.ar/" },
    { name: "Apps", href: "/servicios/apps" },
    { name: "ecommerce", href: "/servicios/ecommerce" },
    { name: "Landing pages", href: "/servicios/diseno-web#landing" },
    { name: "WordPress", href: "/servicios/diseno-web#wordpress" },
  ],
  Otros: [
    { name: "AI FIRST", href: "/servicios/ia" },
    { name: "Cosecha Creativa IA", href: "/servicios/ia" },
    { name: "Nube", href: "/nube" },
    { name: "Eventos", href: "/servicios/eventos" },
    { name: "Compol", href: "/compol" },
    { name: "Foto y Video", href: "/servicios/foto-y-video" },
  ],
  Empresa: [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Privacidad", href: "/privacidad" },
    { name: "Términos", href: "/terminos" },
    { name: "Seguridad", href: "/seguridad" },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="py-20 bg-[#030405] border-t border-[#ffb800]/10">
      <div className="max-w-[1800px] mx-auto px-10">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-20 lg:gap-40 mb-20 lg:mb-40">
          <div className="max-w-md shrink-0">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-[#ffb800] p-3 rounded-full shadow-[0_0_24px_-4px_rgba(255,184,0,0.45)]">
                <Pickaxe className="w-8 h-8 text-black" />
              </div>
              <span className="text-2xl font-display tracking-tighter uppercase italic whitespace-nowrap text-white">COSECHA <span className="text-[#ffb800]">CREATIVA</span></span>
            </div>
            <p className="text-xl text-white/30 leading-relaxed mb-12">
              Agencia de marketing digital y desarrollo en San Juan. Estrategia, creatividad y tecnología para potenciar el sector minero e industrial.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/cosecha.creativa/' },
                { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61551889621823' },
                { name: 'LinkedIn', href: 'https://www.linkedin.com/in/manuel-alejandro-chávez-1316aa241' }
              ].map(social => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all">
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 md:gap-x-20 gap-y-12 w-full">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h6 className="text-[12px] font-black uppercase tracking-[0.6em] text-white mb-8">{title}</h6>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-base text-white/35 hover:text-[#ffb800] transition-colors uppercase font-display italic tracking-tighter block">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-10 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
            © 2026 COSECHA CREATIVA. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex items-center gap-6 text-white/10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Construido para la Industria</span>
            <div className="w-10 h-[1px] bg-white/10" />
            <span className="text-[10px] font-mono">31° 32' 15" S / 68° 32' 11" O</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
