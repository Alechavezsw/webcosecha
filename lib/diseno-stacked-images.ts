/** Imágenes en `public/diseno-stacked/` (origen: diseño/ilovepdf_pages-to-jpg (3)/2). */

export type DisenoStackedImage = {

  src: string

  /** Encuadre dentro de la tarjeta apaisada */

  objectPosition: string

}



export const DISENO_STACKED_IMAGES: readonly DisenoStackedImage[] = [

  { src: "/diseno-stacked/01-banderamodelo.jpg", objectPosition: "50% 42%" },

  { src: "/diseno-stacked/02-gorra.jpg", objectPosition: "50% 38%" },

  { src: "/diseno-stacked/03-gorra-2.jpg", objectPosition: "50% 50%" },

  { src: "/diseno-stacked/04-piluso.jpg", objectPosition: "50% 48%" },

  { src: "/diseno-stacked/05-sin-titulo.jpg", objectPosition: "50% 50%" },

  { src: "/diseno-stacked/06-sin-titulo-wide.jpg", objectPosition: "50% 50%" },

] as const



export const DISENO_STACKED_PANEL_COUNT = DISENO_STACKED_IMAGES.length


