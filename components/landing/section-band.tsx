import type { ReactNode } from "react";

/**
 * Superficies del scroll de la home. Cada una tiene su propia profundidad;
 * los estilos viven al final de `app/globals.css` y el orden en `app/page.tsx`
 * es el que marca el ritmo.
 */
export type BandSurface =
  /** Atmósfera: se ve el campo 3D, con viñeta y horizonte. */
  | "void"
  /** Hoja de papel clara, elevada y cortada en diagonal. */
  | "bone"
  /** Losa de grafito hundida, con bisel arriba y canto abajo. */
  | "slab"
  /** Banda honda con un haz de luz cian al centro. */
  | "deep"
  /** Pozo oscuro con un haz de luz cenital. */
  | "well"
  /** Horizonte violeta del cierre. */
  | "signature";

export function SectionBand({
  surface,
  children,
}: {
  surface: BandSurface;
  children: ReactNode;
}) {
  return (
    <div className={`cc-band cc-band-${surface}`}>
      {/* Capa decorativa de la banda (ella y sus ::before/::after dan tres
          planos). Va primero en el DOM para quedar por debajo de la sección. */}
      <div className="cc-band-fx" aria-hidden />
      {/* Umbral: el resplandor del corte, que se enciende al cruzarlo. */}
      <div className="cc-band-seam" aria-hidden />
      {children}
    </div>
  );
}
