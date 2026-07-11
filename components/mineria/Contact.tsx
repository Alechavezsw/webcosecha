import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Magnetic from './Magnetic';

interface ContactProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Contact: React.FC<ContactProps> = ({ onMouseEnter, onMouseLeave }) => {
  const contactInfo = [
    { icon: <Mail />, label: "Correo", value: "hello@minemark.com" },
    { icon: <Phone />, label: "Teléfono", value: "+1 800 MINE MARK" },
    { icon: <MapPin />, label: "Oficina", value: "Sede Global / Remoto" }
  ];

  return (
    <section id="contact" className="reveal-section relative overflow-visible bg-transparent py-24">
        <div className="absolute inset-0 z-0 opacity-[0.22] pointer-events-none">
        <div className="absolute inset-0 bg-[#07080a] mix-blend-multiply opacity-60" />
        <img 
          src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=2000" 
          alt="Night Mining" 
          className="w-full h-full object-cover grayscale"
          loading="lazy"
        />
      </div>
      <div className="max-w-[1800px] mx-auto px-10 text-center relative z-10">
        <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-display uppercase italic leading-[1] tracking-tighter mb-10 text-white relative z-0 [overflow-wrap:anywhere]">
          <span className="inline-block">EMPIEZA A</span>{' '}
          <span className="inline-block text-[#ffb800]">EXCAVAR</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-40 relative z-10">
          {contactInfo.map((item, idx) => (
            <div key={idx} className="bg-[#07080a]/92 backdrop-blur-md p-10 lg:p-16 group hover:bg-[#ffb800] transition-all duration-700 rounded-3xl border border-white/[0.08] hover:border-[#ffb800] shadow-[0_20px_70px_-30px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_80px_-20px_rgba(255,184,0,0.2)]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
              <div className="text-[#ffb800] group-hover:text-black mb-10 flex justify-center group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
              <div className="text-[12px] font-black uppercase tracking-[0.6em] text-white/30 group-hover:text-black/40 mb-4">{item.label}</div>
              <div className="text-xl font-bold group-hover:text-black text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <Magnetic>
          <button 
            className="bg-[#ffb800] text-black px-16 sm:px-20 py-8 sm:py-10 rounded-full text-3xl sm:text-4xl font-display uppercase italic tracking-tighter hover:bg-white hover:scale-[1.03] transition-all duration-500 shadow-[0_0_80px_-10px_rgba(255,184,0,0.35)] hover:shadow-[0_0_100px_-5px_rgba(255,255,255,0.15)]"
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
          >
            Reservar Consulta
          </button>
        </Magnetic>
      </div>
    </section>
  );
};

export default Contact;
