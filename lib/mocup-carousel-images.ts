/**
 * Carrusel dentro del mockup notebook (Gestión de redes).
 * Archivos en `public/MOCUP/` — orden = orden del carrusel.
 */
const MOCUP_FILES = [
  "carrusel_01.jpg",
  "carrusel_02 (1).jpg",
  "carrusel_02.jpg",
  "carrusel_03.jpg",
  "carrusel-1080x1350_01 (1).jpg",
  "carrusel-1080x1350_01 (2).jpg",
  "carrusel-1080x1350_01 (3).jpg",
  "carrusel-1080x1350_01.jpg",
  "carrusel-1080x1350_02.jpg",
  "carrusel-difusores_07.jpg",
  "carrusel-difusores_08.jpg",
  "carrusel-difusores_09.jpg",
  "carrusel-difusores_10.jpg",
  "carrusel-difusores_12.jpg",
  "carrusel-difusores_13.jpg",
  "carrusel-difusores_14.jpg",
  "carrusel-difusores_15.jpg",
  "carrusel-x-7_01 (1).jpg",
  "carrusel-x-7_01 (2).jpg",
  "carrusel-x-7_01.jpg",
  "carrusel-x-7_02 (2).jpg",
  "carrusel-x-7_02.jpg",
  "carrusel-x-7_03 (2).jpg",
  "carrusel-x-7_03.jpg",
  "carrusel-x-7_04 (2).jpg",
  "carrusel-x-7_04.jpg",
  "carrusel-x-7_05 (2).jpg",
  "carrusel-x-7_05.jpg",
  "carrusel-x-7_06 (2).jpg",
  "carrusel-x-7_06.jpg",
  "carrusel-x-7_07.jpg",
  "feed-carrusel-x2_01 (1).jpg",
  "feed-carrusel-x2_01 (2).jpg",
  "feed-carrusel-x2_01.jpg",
  "feed-carrusel-x2_02 (1).jpg",
  "feed-carrusel-x2_02.jpg",
] as const

export const MOCUP_CAROUSEL_IMAGES: string[] = MOCUP_FILES.map(
  (name) => `/MOCUP/${encodeURIComponent(name)}`,
)
