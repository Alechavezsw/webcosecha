import React from 'react';
import { Pickaxe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 bg-[#030405] border-t border-[#ffb800]/10">
      <div className="max-w-[1800px] mx-auto px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-40 mb-40">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-[#ffb800] p-3 rounded-full shadow-[0_0_24px_-4px_rgba(255,184,0,0.45)]">
                <Pickaxe className="w-8 h-8 text-black" />
              </div>
              <span className="text-2xl font-display tracking-tighter uppercase italic whitespace-nowrap text-white">COSECHA <span className="text-[#ffb800]">CREATIVA</span></span>
            </div>
            <p className="text-2xl text-white/30 leading-relaxed mb-12">
              El referente global en excelencia de marketing industrial para el sector extractivo.
            </p>
            <div className="flex gap-10">
              {['LinkedIn', 'Twitter', 'Vimeo'].map(social => (
                <a key={social} href="#" className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-40">
            <div>
              <h6 className="text-[12px] font-black uppercase tracking-[0.6em] text-white mb-12">Navegación</h6>
              <ul className="space-y-6">
                {[
                  { label: 'Servicios', href: '#services' },
                  { label: 'Nosotros', href: '#about' },
                  { label: 'Presencia', href: '#presencia' },
                  { label: 'Casos', href: '#cases' },
                  { label: 'Contacto', href: '#contact' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-xl text-white/35 hover:text-[#ffb800] transition-colors uppercase font-display italic tracking-tighter">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="text-[12px] font-black uppercase tracking-[0.6em] text-white mb-12">Legal</h6>
              <ul className="space-y-6">
                {['Privacidad', 'Términos', 'Cookies'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-xl text-white/30 hover:text-[#ffb800] transition-all uppercase font-display italic tracking-tighter">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-10 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
            © 2026 COSECHA CREATIVA. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex items-center gap-6 text-white/10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Construido para la Industria</span>
            <div className="w-10 h-[1px] bg-white/10" />
            <span className="text-[10px] font-mono">22° 16' 21" S / 15° 16' 21" E</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
