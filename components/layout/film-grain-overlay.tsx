"use client"

/**
 * Capa global cinematográfica: grano de película (animado) + viñeta.
 * Fija, sobre el contenido pero por debajo de la navegación/modales (z-45) y sin
 * bloquear clicks (pointer-events-none). El grano se atenúa con prefers-reduced-motion
 * vía CSS (`.cc-film-grain` en globals.css).
 */
export function FilmGrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden>
      <div className="cc-film-grain absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.42)_100%)]" />
    </div>
  )
}
