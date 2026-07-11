export interface EventGalleryModalConfig {
  /** Bloques del titular, mostrados como: A _ B _ C (filtrando los vacíos) */
  headlineParts: readonly string[]
  images: string[]
  /** Texto descriptivo bajo el titular en la modal (por evento). */
  tagline?: string
}

export interface GallerySlide {
  id: number
  title: string
  artist: string
  year: number
  image: string
  /** Enlace externo (p. ej. portafolio publicado). */
  href?: string
  /** PDF servido desde `public/` (p. ej. `/logofolio-1895.pdf`). */
  pdfSrc?: string
  /** Modal secundario con galería + titular estructurado. */
  eventGallery?: EventGalleryModalConfig
}
