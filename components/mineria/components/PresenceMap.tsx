import React from 'react';
import { MapPin, Pickaxe, Shield, Compass, Mountain, Activity } from 'lucide-react';
import { asset } from '../lib/asset';

const PRESENCIA_BG_IMAGE = asset('543d28df-7bf5-48d8-a45e-302a3ff6829b.png');

const PresenceMap: React.FC = () => {
  return (
    <section
      id="presencia"
      className="reveal-section relative isolate overflow-hidden bg-[#07080a] py-24 md:py-32 border-t border-white/[0.03]"
      aria-labelledby="presencia-heading"
    >
      {/* Background Grid & Noise */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 184, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 184, 0, 0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,184,0,0.06),transparent_70%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Context & Typography */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[#ffb800]/50" />
              <span className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#ffb800]/90 font-mono">
                Raíz regional
              </span>
            </div>
            
            <h2
              id="presencia-heading"
              className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] uppercase italic leading-[0.95] tracking-tighter text-white mb-8"
            >
              Pulso en{' '}
              <span className="text-gradient-amber drop-shadow-[0_0_40px_rgba(255,184,0,0.25)]">
                San Juan
              </span>
            </h2>
            
            <p className="text-lg leading-relaxed text-white/55 mb-10 max-w-xl">
              Argentina, corazón minero del oeste. Operamos con la misma intensidad, firmeza y precisión técnica que el litio, el oro y el cobre que mueven los yacimientos más importantes de esta provincia.
            </p>

            {/* Industrial Spec Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mb-10">
              <div className="bg-[#0b0c0f]/80 border border-white/[0.06] rounded-2xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.4)] flex gap-4 items-center">
                <div className="bg-[#ffb800]/10 p-3 rounded-xl shrink-0 text-[#ffb800]">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/35">Altitud base</div>
                  <div className="text-sm font-bold text-white tracking-tight">3,200M (Cordillera)</div>
                </div>
              </div>

              <div className="bg-[#0b0c0f]/80 border border-white/[0.06] rounded-2xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.4)] flex gap-4 items-center">
                <div className="bg-[#ffb800]/10 p-3 rounded-xl shrink-0 text-[#ffb800]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/35">Monitoreo</div>
                  <div className="text-sm font-bold text-white tracking-tight">Satelital Continuo</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-[#07080a]/90 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/45 backdrop-blur-md">
              <MapPin className="h-4 w-4 text-[#ffb800]" aria-hidden />
              <span>31°32′S · 68°32′W</span>
            </div>
          </div>

          {/* Right Column: High-Tech Radar HUD Container */}
          <div className="lg:col-span-7 flex justify-center items-center relative">
            
            {/* Outer Circular Scanner HUD */}
            <div className="relative aspect-square w-full max-w-[min(540px,90vw)] rounded-full border border-white/5 bg-[#0b0c0f]/40 p-4 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-md">
              
              {/* Radar Compass Ring */}
              <div className="absolute inset-0 rounded-full border border-[#ffb800]/15 pointer-events-none m-2 sm:m-3" />
              <div className="absolute inset-0 rounded-full border border-dashed border-white/10 pointer-events-none m-4 sm:m-6 animate-[spin_120s_linear_infinite]" />
              
              {/* Radar Crosshairs */}
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.03] pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.03] pointer-events-none" />
              
              {/* HUD Compass Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/20 tracking-widest">N 000°</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/20 tracking-widest">S 180°</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[8px] font-mono text-white/20 tracking-widest">E 090°</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-mono text-white/20 tracking-widest">W 270°</div>

              {/* High-Tech Grid Map Screen */}
              <div className="relative w-full h-full rounded-full overflow-hidden border border-white/[0.08] bg-[#050607]">
                
                {/* Topographic Map Background Image */}
                <img
                  src={PRESENCIA_BG_IMAGE}
                  alt="Mapa topográfico de San Juan"
                  className="absolute inset-0 w-full h-full object-cover object-center scale-[1.1] opacity-75 filter contrast-[1.08] saturate-[0.85] pointer-events-none z-0"
                  decoding="async"
                />
                
                {/* Neon Copper Ambient Shading on Map */}
                <div className="absolute inset-0 bg-[#07080a]/30 mix-blend-multiply pointer-events-none z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/15 to-[#07080a] pointer-events-none z-[1]" />
                
                {/* Conic Radar Sweep Animation */}
                <div 
                  className="absolute inset-0 pointer-events-none z-[2] rounded-full mix-blend-screen"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 184, 0, 0.16) 0%, rgba(255, 184, 0, 0.04) 22%, transparent 45%)',
                    animation: 'spin 7.5s linear infinite'
                  }}
                />

                {/* Radar Grid Overlay */}
                <div 
                  className="absolute inset-0 z-[2] opacity-[0.06] pointer-events-none" 
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 20%, #000 70%), linear-gradient(rgba(255,184,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.12) 1px, transparent 1px)',
                    backgroundSize: '100% 100%, 32px 32px, 32px 32px'
                  }}
                />

                {/* Pulsing Beacon at Center (Radar Target) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none">
                  <svg
                    className="aspect-square w-24 sm:w-28 drop-shadow-[0_0_24px_rgba(255,184,0,0.5)]"
                    viewBox="-40 -40 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="radar-glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g" />
                        <feMerge>
                          <feMergeNode in="g" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <g filter="url(#radar-glow)">
                      <circle
                        className="presence-map-pulse-outer"
                        cx={0}
                        cy={0}
                        r="28"
                        stroke="#ffb800"
                        strokeWidth="0.8"
                        fill="none"
                        opacity="0.6"
                      />
                      <circle
                        className="presence-map-pulse-mid"
                        cx={0}
                        cy={0}
                        r="16"
                        stroke="#ffb800"
                        strokeWidth="1.2"
                        fill="none"
                        opacity="0.8"
                      />
                      <circle cx={0} cy={0} r="6" fill="#ffb800" />
                      <circle cx={0} cy={0} r="2.2" fill="#fff" opacity="0.95" />
                    </g>
                  </svg>
                </div>

                {/* Cyber HUD Overlays in Map corner */}
                <div className="absolute bottom-4 left-6 z-[3] font-mono text-[8px] tracking-widest text-[#ffb800]/50 select-none">
                  SYSTEM_STATUS: OPERATIONAL
                </div>
                <div className="absolute top-4 right-6 z-[3] font-mono text-[8px] tracking-widest text-white/20 select-none">
                  ZOOM: 12.4X
                </div>
              </div>
            </div>

            {/* Glowing corner brackets / crosshairs for HUD style */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffb800]/20 pointer-events-none hidden sm:block" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffb800]/20 pointer-events-none hidden sm:block" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ffb800]/20 pointer-events-none hidden sm:block" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ffb800]/20 pointer-events-none hidden sm:block" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default PresenceMap;
