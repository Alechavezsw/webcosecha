import React from 'react';
import { Pickaxe, Menu, X } from 'lucide-react';
import Magnetic from './Magnetic';

interface NavbarProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  scrolled, 
  isMenuOpen, 
  setIsMenuOpen, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const menuItems = [
    { label: 'Servicios', id: 'services' },
    { label: 'Nosotros', id: 'about' },
    { label: 'Presencia', id: 'presencia' },
    { label: 'Casos', id: 'cases' },
    { label: 'Contacto', id: 'contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-10'}`}>
        <div className="max-w-[1800px] mx-auto px-10 flex justify-between items-center">
          <Magnetic>
            <a href="/" className="flex items-center gap-4 group cursor-pointer" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
              <div className="bg-[#ffb800] p-3 rounded-full transform group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_24px_-4px_rgba(255,184,0,0.55)] ring-2 ring-[#ffb800]/30">
                <Pickaxe className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-display tracking-tighter uppercase italic leading-none whitespace-nowrap text-white">
                COSECHA <span className="text-[#ffb800]">CREATIVA</span>
              </span>
            </a>
          </Magnetic>

          <div className="hidden lg:flex items-center gap-16">
            {menuItems.map((item) => (
              <div key={item.id}>
                <Magnetic>
                  <a 
                    href={`#${item.id}`} 
                    className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/55 hover:text-[#ffb800] transition-colors duration-300"
                    onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                  >
                    {item.label}
                  </a>
                </Magnetic>
              </div>
            ))}
            <Magnetic>
              <a 
                href="/"
                className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/55 hover:text-[#ffb800] transition-colors duration-300"
                onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
              >
                Home
              </a>
            </Magnetic>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[90] bg-[#07080a] transition-all duration-700 flex flex-col items-center justify-center gap-10 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <a href="/" className="text-6xl font-display uppercase italic tracking-tighter text-white/50 hover:text-[#ffb800]" onClick={() => setIsMenuOpen(false)}>
          Home
        </a>
        {menuItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="text-6xl font-display uppercase italic tracking-tighter text-white hover:text-[#ffb800]" onClick={() => setIsMenuOpen(false)}>
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navbar;
