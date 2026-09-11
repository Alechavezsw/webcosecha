"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const WORDS = [
  "Estrategia",
  "Diseño web",
  "Redes sociales",
  "SEO",
  "Branding",
  "Publicidad",
  "Inteligencia artificial",
  "Automatización",
  "Foto y video",
];

/** Mantiene un número dentro de [min, max) dando la vuelta (para el loop infinito). */
function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function Strip({ baseVelocity }: { baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  /** El scroll rápido empuja la tira; parado, sólo queda la deriva base. */
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });

  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);

    // Scrollear para abajo empuja la tira en un sentido y para arriba en el otro:
    // es lo que hace que se sienta atada al scroll y no un loop suelto.
    if (smooth.get() < 0) direction.current = -1;
    else if (smooth.get() > 0) direction.current = 1;

    move += direction.current * move * boost.get();
    baseX.set(baseX.get() + move);
  });

  // Cada copia mide 33.33% del track (hay 3), así que el ciclo cierra en -33.33%.
  const x = useTransform(baseX, (v) => `${wrap(-33.3333, 0, v)}%`);

  return (
    <motion.div className="flex w-max flex-nowrap" style={{ x }}>
      {[0, 1, 2].map((copy) => (
        <div key={copy} className="flex flex-nowrap items-center" aria-hidden={copy > 0}>
          {WORDS.map((word) => (
            <span key={`${copy}-${word}`} className="flex items-center whitespace-nowrap">
              <span className="font-display text-[clamp(1.75rem,5vw,4rem)] leading-none tracking-tight text-white/85">
                {word}
              </span>
              <span
                className="mx-[clamp(1rem,2.5vw,2.5rem)] size-[7px] shrink-0 rounded-full bg-[#eca8d6]"
                aria-hidden
              />
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  );
}

/**
 * Tira cinética que corre entre dos bandas: hace de corte y a la vez de resumen
 * de lo que hace la agencia. La velocidad reacciona al scroll (más rápido si
 * scrolleás fuerte, y cambia de sentido si subís).
 */
export function KineticMarquee() {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#0a0a10] py-6 sm:py-8">
      {/* Los bordes se funden al negro para que la tira no arranque de golpe. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0a0a10] to-transparent sm:w-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0a0a10] to-transparent sm:w-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_50%_50%,rgba(236,168,214,0.1),transparent_70%)]"
        aria-hidden
      />

      {reduce ? (
        <div className="flex flex-nowrap justify-center gap-6 px-6 text-center">
          <span className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-none tracking-tight text-white/85">
            {WORDS.join(" · ")}
          </span>
        </div>
      ) : (
        <Strip baseVelocity={2.4} />
      )}
    </div>
  );
}
