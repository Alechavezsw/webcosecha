/** Capturas en `public/soft/` — rutas construidas con encode para nombres con espacios */

export const SOFT_GALLERY_FILES = [
  "462shots_so.png",
  "513shots_so.png",
  "532shots_so.png",
  "641shots_so.png",
  "66shots_so.png",
  "710shots_so.png",
  "816shots_so.png",
  "822shots_so.png",
  "86shots_so (1).png",
] as const

/**
 * Sirve el derivado WebP de `public/soft/lite/` (1400 px). Los PNG originales
 * pesan entre 1,2 y 2,1 MB cada uno: las nueve capturas juntas eran 15 MB y
 * hacían que /servicios/apps cargara 16 MB. En WebP suman 340 KB.
 */
export function softGallerySrc(filename: (typeof SOFT_GALLERY_FILES)[number]): string {
  const webp = filename.replace(/\.png$/i, ".webp")
  return `/soft/lite/${encodeURIComponent(webp)}`
}
