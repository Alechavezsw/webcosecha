import React from 'react';

/**
 * El rótulo que abre cada sección.
 *
 * Antes cada una traía el suyo: tamaños de 10, 11, 12 y 13px, tracking de
 * .45em, .5em y .55em, unas en mono y otras en sans, reglas de 12px o 20px de
 * ancho y de 1px o 2px de alto — y Contacto directamente no tenía. El Hero,
 * además, abría con una píldora ámbar que no se parecía a nada de lo que venía
 * después. Eso hacía que la página no arrancara dos secciones igual.
 *
 * Acá hay una sola versión: regla ámbar que se desvanece, rematada en un rombo
 * que es el mismo acento que marca las viñetas de la sección de métricas, y la
 * etiqueta en monoespaciada, que es el registro del resto del HUD de la página.
 *
 * `align="center"` refleja la regla a ambos lados, para los bloques centrados
 * (el Hero y Contacto) sin romper el sistema.
 *
 * `className` va al elemento raíz porque varias secciones enganchan sus
 * animaciones de GSAP a una clase puesta en este bloque.
 */
interface SectionKickerProps {
  children: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

const Rule: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <span
    aria-hidden
    className={`relative hidden h-px w-16 shrink-0 sm:block ${
      flip
        ? 'bg-gradient-to-l from-[#ffb800]/0 via-[#ffb800]/60 to-[#ffb800]'
        : 'bg-gradient-to-r from-[#ffb800]/0 via-[#ffb800]/60 to-[#ffb800]'
    }`}
  >
    <span
      className={`absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#ffb800] shadow-[0_0_8px_rgba(255,184,0,0.9)] ${
        flip ? '-left-px' : '-right-px'
      }`}
    />
  </span>
);

const SectionKicker: React.FC<SectionKickerProps> = ({
  children,
  align = 'left',
  className = '',
}) => (
  <div
    className={`flex items-center gap-5 ${align === 'center' ? 'justify-center' : ''} ${className}`}
  >
    <Rule />
    <span className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.5em] text-[#ffb800]">
      {children}
    </span>
    {align === 'center' && <Rule flip />}
  </div>
);

export default SectionKicker;
