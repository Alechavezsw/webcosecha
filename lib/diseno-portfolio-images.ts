const DISENO_PORTFOLIO_BASE = "/diseno-portfolio"

const FIRST_PAGE = 3
const LAST_PAGE = 20

/** Rutas públicas del logofolio en `public/diseno-portfolio/` (sin páginas 0001–0002). */
export const DISENO_PORTFOLIO_IMAGES: readonly string[] = Array.from(
  { length: LAST_PAGE - FIRST_PAGE + 1 },
  (_, i) => {
    const page = String(FIRST_PAGE + i).padStart(4, "0")
    return `${DISENO_PORTFOLIO_BASE}/logofolio-1895_page-${page}.jpg`
  },
)
