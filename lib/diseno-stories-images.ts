/** Stories en `public/diseno-stories/` (origen: diseño/ilovepdf_pages-to-jpg (3)/storias). */

import { opt } from "@/lib/optimized-images"

const STORY_COUNT = 29

/**
 * Se muestran en un marquee de ~170px de ancho, así que siempre van por el
 * derivado de 480px: los JPG originales pesan ~1 MB cada uno.
 */
export const DISENO_STORIES_IMAGES: readonly string[] = Array.from(
  { length: STORY_COUNT },
  (_, i) => opt(`/diseno-stories/story-${String(i + 1).padStart(2, "0")}.jpg`),
)
