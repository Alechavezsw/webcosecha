import React from 'react';

/**
 * Velados / viñeta / grain — misma familia visual que el cinematic en pantalla completa,
 * pensado para ir encima del video dentro del marco (showreel).
 */
const CinematicStyleOverlays: React.FC = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040506]/62 via-[#07080a]/38 to-[#040506]/68"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 78% 68% at 50% 48%, transparent 0%, rgba(4,5,6,0.28) 58%, rgba(4,5,6,0.62) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,rgba(255,184,0,0.09),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/45"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[#ffb800]/[0.06]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.09]"
        aria-hidden
      />
    </>
  );
};

export default CinematicStyleOverlays;
