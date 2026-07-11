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

export function softGallerySrc(filename: (typeof SOFT_GALLERY_FILES)[number]): string {
  return `/soft/${encodeURIComponent(filename)}`
}
