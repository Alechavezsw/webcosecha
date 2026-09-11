import { opt } from "@/lib/optimized-images";

/**
 * Ruta pública del original, tal cual lo entregó el cliente.
 *
 * Sirve para el `<source>` de respaldo y poco más: los originales de esta
 * landing son PNGs de 6 a 14 MB y masters de video de 48 MB. Todo lo que se
 * renderiza debe pasar por `assetOpt` / `assetVideo`.
 */
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  if (normalized.startsWith("mineria/")) {
    return `/${normalized}`;
  }
  return `/mineria/${normalized}`;
}

/** Derivado WebP de `public/_opt` (generado por `scripts/optimize-images.mjs`). */
export function assetOpt(path: string): string {
  return opt(asset(decodeURI(path)));
}

/** Derivado WebM liviano de `public/_opt` (generado por `scripts/optimize-videos.mjs`). */
export function assetVideo(path: string): string {
  return encodeURI(`/_opt${asset(decodeURI(path))}`);
}

/** Primer cuadro del video, para usar como `poster` mientras no se descarga. */
export function assetVideoPoster(path: string): string {
  return encodeURI(`/_opt${asset(decodeURI(path))}.poster.webp`);
}
