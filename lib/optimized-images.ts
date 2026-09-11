/**
 * GENERADO por `scripts/optimize-images.mjs` — no editar a mano.
 *
 * Cada foto de `public/` tiene un derivado WebP liviano en `public/_opt/<ruta>.webp`.
 * Acá sólo viven las excepciones: originales que no se pudieron convertir y que
 * hay que seguir sirviendo tal cual.
 */

const SIN_DERIVADO = new Set<string>([
  "/deportes/EVENTO DEPORTIVO _ GLORIA Y HONOR 2 _ LUNA PARK-20260503T153451Z-3-001/EVENTO DEPORTIVO _ GLORIA Y HONOR 2 _ LUNA PARK/3 - Diseño gráfico/1 - Banners/banner_entrada_principal.jpg",
])

/**
 * Ruta pública (sin codificar) -> URL del WebP optimizado, o del original si no existe.
 * Reemplaza a `encodeURI(ruta)` en todos los assets de la home.
 */
export function opt(publicPath: string): string {
  if (SIN_DERIVADO.has(publicPath)) return encodeURI(publicPath)
  return encodeURI(`/_opt${publicPath}.webp`)
}
