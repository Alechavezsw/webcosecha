import React from 'react';

/**
 * Capa HUD / esquinas / métricas — misma línea visual que el showreel (#showreel).
 */
const IndustrialVideoHud: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between border-4 border-transparent p-6 sm:p-10">
      <div className="hud-element absolute left-0 top-0 h-16 w-16 rounded-tl-3xl border-l-2 border-t-2 border-[#ffb800]/40 sm:h-20 sm:w-20" />
      <div className="hud-element absolute right-0 top-0 h-16 w-16 rounded-tr-3xl border-r-2 border-t-2 border-[#ffb800]/40 sm:h-20 sm:w-20" />
      <div className="hud-element absolute bottom-0 left-0 h-16 w-16 rounded-bl-3xl border-b-2 border-l-2 border-[#ffb800]/40 sm:h-20 sm:w-20" />
      <div className="hud-element absolute bottom-0 right-0 h-16 w-16 rounded-br-3xl border-b-2 border-r-2 border-[#ffb800]/40 sm:h-20 sm:w-20" />

      <div className="hud-element flex items-start justify-between opacity-100 transition-opacity duration-500">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              REC • LIVE STREAM
            </span>
          </div>
          <span className="text-[8px] font-mono tracking-widest text-white/30">SIGNAL: ENCRYPTED_7G</span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#ffb800]">
            Sector: 7G-Extraction
          </span>
          <span className="text-[8px] font-mono tracking-widest text-white/30">
            COORD: 22°27&apos;25&quot;S 15°27&apos;25&quot;E
          </span>
        </div>
      </div>

      <div className="hud-element flex items-end justify-between opacity-100 transition-opacity duration-500">
        <div className="flex flex-col gap-1">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/5 sm:w-48">
            <div className="h-full w-2/3 animate-[shimmer_2s_infinite] bg-[#ffb800]/40" />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/30">
            Buffer Analysis: 84% COMPLETE
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Depth: 1,240M</span>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-3 w-1 ${i < 3 ? 'bg-[#ffb800]/40' : 'bg-[#ffb800]/10'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialVideoHud;
