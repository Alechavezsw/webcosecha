/** Rutas bajo `public/` del pack Gloria y Honor 2 · Luna Park (archivos reales en disco). */

const EVENTO_GYH_ROOT =
  "/deportes/EVENTO DEPORTIVO _ GLORIA Y HONOR 2 _ LUNA PARK-20260503T153451Z-3-001/EVENTO DEPORTIVO _ GLORIA Y HONOR 2 _ LUNA PARK"

const RELATIVE_IMAGE_PATHS = [
  "1 - Gráficas para Redes Sociales/1 - Gráfica general/boleteria_LP(1920px-x-1080px).jpg",
  "1 - Gráficas para Redes Sociales/1 - Gráfica general/feed_gloria_y_honor_2.jpg",
  "1 - Gráficas para Redes Sociales/1 - Gráfica general/stories_gloria_y_honor_2.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed_alanis_v_acevedo.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed_hernandez_v_soto.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed_maidana_vs_bennett.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed_marini_v_castagno.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed_melian_vs_.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/feed_reyes_vs_gonzalez.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/para_BDP_stories_alanis_v_acevedo.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/stories.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/stories_hernandez_v_soto.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/stories_maidana_vs_bennett.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/stories_marini_v_castagno.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/stories_melian_vs_.jpg",
  "1 - Gráficas para Redes Sociales/2 - Todas las peleas/stories_reyes_vs_gonzalez.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/2triptico_01.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/2triptico_02.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/2triptico_03.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/OR_maidana.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/OR_melian.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/OR_reyes.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/SEGUINOS_HASHTAG.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/SORTEOdoble_01.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/SORTEOdoble_02.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/TYC_maidana.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/TYC_melian.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/TYC_reyes.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/entradas_01.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/entradas_02.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/stories_sorteo.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/stories_tyc.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/stories_tyc_play.jpg",
  "1 - Gráficas para Redes Sociales/3 - Feed Instagram/ya_en_vivo_tyc_sports.jpg",
  "3 - Diseño gráfico/1 - Banners/1-1-balanza_imprimir.jpg",
  "3 - Diseño gráfico/1 - Banners/banner_entrada_principal.jpg",
  "3 - Diseño gráfico/1 - Banners/banner_vertical_atril.jpg",
  "3 - Diseño gráfico/1 - Banners/logos_vertical.jpg",
  "3 - Diseño gráfico/2 - Remera/Sin título-1 copia.png",
  "3 - Diseño gráfico/2 - Remera/remera_or.jpg",
] as const

function publicUrl(pathFromPublicRoot: string): string {
  return encodeURI(pathFromPublicRoot)
}

/** Portada del slide en el carrusel principal (gráfica general del evento). */
export const eventoGyhCoverSrc = publicUrl(
  `${EVENTO_GYH_ROOT}/1 - Gráficas para Redes Sociales/1 - Gráfica general/feed_gloria_y_honor_2.jpg`,
)

/** Todas las piezas del pack para la modal-galería. */
export const eventoGyhGallerySrcs: string[] = RELATIVE_IMAGE_PATHS.map((rel) =>
  publicUrl(`${EVENTO_GYH_ROOT}/${rel}`),
)
