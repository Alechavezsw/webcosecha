/** Rutas bajo `public/eventos/` — FIESTA PRIVADA · BRUTA PANORÁMICA · Club Comunicaciones */

const FIESTA_BRUTA_ROOT =
  "/eventos/FIESTA PRIVADA _ BRUTA PANORÁMICA _ CLUB COMUNICACIONES-20260503T155213Z-3-001/FIESTA PRIVADA _ BRUTA PANORÁMICA _ CLUB COMUNICACIONES"

const RELATIVE_IMAGE_PATHS = [
  "1. GRÁFICAS GENERALES/1-feed-general-bruta-panoramica.jpg",
  "1. GRÁFICAS GENERALES/2-stories-general.jpg",
  "1. GRÁFICAS GENERALES/3-stories-general.jpg",
  "1. GRÁFICAS GENERALES/entradas-1.jpg",
  "1. GRÁFICAS GENERALES/entradas-2.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_01.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_02.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_03.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_04.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_05.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_06.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_07.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_08.jpg",
  "2. CARRUSEL FEED/carrusel-bruta-panoramica_09.jpg",
  "3. STORIES ARTISTAS/1-NST.jpg",
  "3. STORIES ARTISTAS/2-panoramica.jpg",
  "3. STORIES ARTISTAS/3-mica-caceres.jpg",
  "3. STORIES ARTISTAS/4-los-frutto.jpg",
  "3. STORIES ARTISTAS/5-el-suspenso.jpg",
  "3. STORIES ARTISTAS/6-nik-lUps.jpg",
  "3. STORIES ARTISTAS/7-freehearts.jpg",
  "3. STORIES ARTISTAS/8-toranzo-fj.jpg",
  "4. PASSLINE/1-foto-perfil.jpg",
  "4. PASSLINE/banner-portada-725x300px.jpg",
  "4. PASSLINE/portada-1583x380.jpg",
  "4. PASSLINE/portada_800x380.jpg",
] as const

function publicUrl(pathFromPublicRoot: string): string {
  return encodeURI(pathFromPublicRoot)
}

/** Portada del slide (feed general). */
export const fiestaBrutaCoverSrc = publicUrl(
  `${FIESTA_BRUTA_ROOT}/1. GRÁFICAS GENERALES/1-feed-general-bruta-panoramica.jpg`,
)

export const fiestaBrutaGallerySrcs: string[] = RELATIVE_IMAGE_PATHS.map((rel) =>
  publicUrl(`${FIESTA_BRUTA_ROOT}/${rel}`),
)
