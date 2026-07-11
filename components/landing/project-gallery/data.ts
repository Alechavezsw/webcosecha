import type { GallerySlide } from "./types"
import { eventoGyhCoverSrc, eventoGyhGallerySrcs } from "./evento-gyh-assets"
import { fiestaBrutaCoverSrc, fiestaBrutaGallerySrcs } from "./fiesta-bruta-assets"
import { mokamiliaCoverSrc, mokamiliaGallerySrcs } from "./mokamilia-assets"

export const gallerySlides: GallerySlide[] = [
  {
    id: 1,
    title: "Portafolio web",
    artist: "Alejandro Chávez",
    year: 2026,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    href: "https://alechavez.cosechacreativa.com.ar/",
  },
  {
    id: 2,
    title: "Marca + presencia online",
    artist: "B2B · Argentina / exterior",
    year: 2026,
    image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=800&q=80",
    pdfSrc: "/logofolio-1895.pdf",
  },
  {
    id: 3,
    title: "Eventos deportivos",
    artist: "Cobertura · piezas · territorio",
    year: 2024,
    image: eventoGyhCoverSrc,
    eventGallery: {
      headlineParts: ["EVENTO DEPORTIVO", "GLORIA Y HONOR 2", "LUNA PARK"],
      images: eventoGyhGallerySrcs,
      tagline: "Piezas de redes, ring y merchandising del evento en Luna Park.",
    },
  },
  {
    id: 4,
    title: "Eventos",
    artist: "Club Comunicaciones · redes · passline",
    year: 2024,
    image: fiestaBrutaCoverSrc,
    eventGallery: {
      headlineParts: ["FIESTA PRIVADA", "BRUTA PANORÁMICA", "CLUB COMUNICACIONES"],
      images: fiestaBrutaGallerySrcs,
      tagline:
        "Gráficas generales, carrusel de feed, stories de artistas y piezas Passline para la fiesta privada.",
    },
  },
  {
    id: 5,
    title: "Identidad de marca",
    artist: "Mokamilia · café de especialidad",
    year: 2024,
    image: mokamiliaCoverSrc,
    eventGallery: {
      headlineParts: ["IDENTIDAD DE MARCA"],
      images: mokamiliaGallerySrcs,
      tagline: "Fotografías de producto, diseño de packaging e identidad digital para Mokamilia.",
    },
  },
  {
    id: 6,
    title: "Social media",
    artist: "Calendario · piezas · comunidad",
    year: 2024,
    image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80",
    href: "/servicios/gestion-de-redes-sociales",
  },
  {
    id: 7,
    title: "Piezas para redes",
    artist: "Contenido institucional",
    year: 2023,
    image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800&q=80",
  },
  {
    id: 8,
    title: "Eventos y cobertura",
    artist: "San Juan",
    year: 2022,
    image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80",
  },
]
