/** Rutas bajo `public/mokamilia/` — MOKAMILIA */

const MOKAMILIA_ROOT = "/mokamilia"

const RELATIVE_IMAGE_PATHS = [
  "IMG_0257.JPG.jpeg",
  "IMG_0258.JPG.jpeg",
  "IMG_0259.JPG.jpeg",
  "IMG_0260.JPG.jpeg",
  "IMG_0261.JPG.jpeg",
  "WhatsApp Image 2026-06-08 at 20.33.20.jpeg",
] as const

function publicUrl(pathFromPublicRoot: string): string {
  return encodeURI(pathFromPublicRoot)
}

/** Portada del slide (usando la imagen principal del set). */
export const mokamiliaCoverSrc = publicUrl(`${MOKAMILIA_ROOT}/IMG_0260.JPG.jpeg`)

export const mokamiliaGallerySrcs: string[] = RELATIVE_IMAGE_PATHS.map((rel) =>
  publicUrl(`${MOKAMILIA_ROOT}/${rel}`),
)
