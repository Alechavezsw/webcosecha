/** Stories en `public/diseno-stories/` (origen: diseño/ilovepdf_pages-to-jpg (3)/storias). */

const STORY_COUNT = 29



export const DISENO_STORIES_IMAGES: readonly string[] = Array.from(

  { length: STORY_COUNT },

  (_, i) => `/diseno-stories/story-${String(i + 1).padStart(2, "0")}.jpg`,

)


