/**
 * Genera derivados WebP livianos para las fotos de la home.
 *
 * Origen:  public/<ruta>                     (JPG/PNG pesados, tal cual los entrega el cliente)
 * Destino: public/_opt/<ruta>.webp           (mismo árbol, sufijo .webp)
 *
 * El mapeo de ruta es puro y determinista (`/_opt` + rutaOriginal + `.webp`), así que
 * `lib/optimized-images.ts` sólo necesita listar las excepciones: los originales que
 * ffmpeg no pudo convertir. Ese manifiesto se regenera en cada corrida.
 *
 * Requiere ffmpeg en el PATH.  Uso: `node scripts/optimize-images.mjs [--force]`
 */
import { execFile } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const PUBLIC_DIR = path.join(ROOT, "public")
const OPT_DIR = path.join(PUBLIC_DIR, "_opt")
const FORCE = process.argv.includes("--force")

/** Anchos por grupo: el doble del tamaño máximo al que se muestra cada foto. */
const GROUPS = [
  { name: "stories (marquee métricas)", width: 480, quality: 70, sources: () => storiesSources() },
  { name: "portadas del carrusel", width: 1000, quality: 68, sources: () => coverSources() },
  { name: "packs de galería (modal)", width: 1400, quality: 70, sources: () => galleryPackSources() },
  {
    name: "tarjetas de seguridad",
    width: 900,
    quality: 74,
    sources: async () => [
      "/images/isolated.jpg",
      "/images/encrypted.jpg",
      "/images/audit.jpg",
      "/images/permissions.jpg",
    ],
  },
  { name: "fondos", width: 1920, quality: 78, sources: async () => ["/footer-bg.png"] },
  {
    // La landing de minería llegaba con PNGs de 6 a 14 MB usados como fondos
    // a pantalla completa. En WebP a 1600px pesan dos órdenes de magnitud menos.
    name: "minería (fondos a sangre)",
    width: 1600,
    quality: 72,
    sources: async () => [
      "/mineria/cc (2).png",
      "/mineria/cc (3).png",
      "/mineria/cc (4).png",
      "/mineria/Gemini_Generated_Image_yu2miiyu2miiyu2m.png",
      "/mineria/543d28df-7bf5-48d8-a45e-302a3ff6829b.png",
      "/mineria/media__1779585325500.jpg",
    ],
  },
  {
    name: "minería (piezas del portfolio)",
    width: 1200,
    quality: 74,
    sources: () => mineriaPortfolioSources(),
  },
]

async function mineriaPortfolioSources() {
  const dir = path.join(PUBLIC_DIR, "mineria/moca")
  const files = await fs.readdir(dir)
  return files.filter((f) => /.(jpe?g|png)$/i.test(f)).map((f) => `/mineria/moca/${f}`)
}

/** Lee un array `RELATIVE_IMAGE_PATHS` / constantes de los módulos de assets. */
async function readAssetModule(file) {
  return fs.readFile(path.join(ROOT, "components/landing/project-gallery", file), "utf8")
}

function extractRelativePaths(source) {
  const block = source.match(/RELATIVE_IMAGE_PATHS = \[([\s\S]*?)\] as const/)
  if (!block) return []
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
}

/** Primer string entrecomillado después de `const <name> =` (soporta salto de línea). */
function extractConst(source, name) {
  const at = source.indexOf(`const ${name} =`)
  if (at === -1) return null
  const open = source.indexOf('"', at)
  if (open === -1) return null
  const close = source.indexOf('"', open + 1)
  return close === -1 ? null : source.slice(open + 1, close)
}

async function storiesSources() {
  const dir = path.join(PUBLIC_DIR, "diseno-stories")
  const files = await fs.readdir(dir)
  return files.filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => `/diseno-stories/${f}`)
}

const PACKS = [
  { file: "evento-gyh-assets.ts", root: "EVENTO_GYH_ROOT", cover: "1 - Gráficas para Redes Sociales/1 - Gráfica general/feed_gloria_y_honor_2.jpg" },
  { file: "fiesta-bruta-assets.ts", root: "FIESTA_BRUTA_ROOT", cover: "1. GRÁFICAS GENERALES/1-feed-general-bruta-panoramica.jpg" },
  { file: "mokamilia-assets.ts", root: "MOKAMILIA_ROOT", cover: "IMG_0260.JPG.jpeg" },
]

async function coverSources() {
  const out = []
  for (const pack of PACKS) {
    const src = await readAssetModule(pack.file)
    const root = extractConst(src, pack.root)
    if (root) out.push(`${root}/${pack.cover}`)
  }
  return out
}

async function galleryPackSources() {
  const out = []
  for (const pack of PACKS) {
    const src = await readAssetModule(pack.file)
    const root = extractConst(src, pack.root)
    if (!root) continue
    for (const rel of extractRelativePaths(src)) out.push(`${root}/${rel}`)
  }
  return out
}

/** `/diseno-stories/story-01.jpg` -> `public/_opt/diseno-stories/story-01.jpg.webp` */
function targetFor(publicPath) {
  return path.join(OPT_DIR, `${publicPath.replace(/^\//, "")}.webp`)
}

async function isFresh(source, target) {
  if (FORCE) return false
  try {
    const [s, t] = await Promise.all([fs.stat(source), fs.stat(target)])
    return t.mtimeMs >= s.mtimeMs && t.size > 0
  } catch {
    return false
  }
}

async function convert(publicPath, width, quality) {
  const source = path.join(PUBLIC_DIR, decodeURI(publicPath).replace(/^\//, ""))
  const target = targetFor(decodeURI(publicPath))

  try {
    await fs.access(source)
  } catch {
    return { skipped: true, missing: true, publicPath }
  }
  if (await isFresh(source, target)) return { skipped: true, publicPath }

  await fs.mkdir(path.dirname(target), { recursive: true })
  try {
    await execFileAsync("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", source,
      "-vf", `scale='min(${width},iw)':-2:flags=lanczos`,
      "-c:v", "libwebp", "-quality", String(quality), "-compression_level", "6",
      target,
    ])
  } catch (error) {
    // Originales que ffmpeg no puede decodificar (p. ej. JPEG de imprenta
    // gigantes): quedan fuera del manifiesto y se sirven sin optimizar.
    await fs.rm(target, { force: true })
    const reason = String(error.stderr || error.message).split("\n")[0].trim()
    return { publicPath, failed: true, reason }
  }

  const [before, after] = await Promise.all([fs.stat(source), fs.stat(target)])
  return { publicPath, before: before.size, after: after.size }
}

const MANIFEST_PATH = path.join(ROOT, "lib/optimized-images.ts")

/** Escribe la lista de excepciones que consume `opt()` en tiempo de ejecución. */
async function writeManifest(withoutDerivative) {
  const entries = [...withoutDerivative].sort()
  const body = entries.length
    ? entries.map((p) => `  ${JSON.stringify(p)},\n`).join("")
    : ""

  await fs.writeFile(
    MANIFEST_PATH,
    `/**
 * GENERADO por \`scripts/optimize-images.mjs\` — no editar a mano.
 *
 * Cada foto de \`public/\` tiene un derivado WebP liviano en \`public/_opt/<ruta>.webp\`.
 * Acá sólo viven las excepciones: originales que no se pudieron convertir y que
 * hay que seguir sirviendo tal cual.
 */

const SIN_DERIVADO = new Set<string>([\n${body}])

/**
 * Ruta pública (sin codificar) -> URL del WebP optimizado, o del original si no existe.
 * Reemplaza a \`encodeURI(ruta)\` en todos los assets de la home.
 */
export function opt(publicPath: string): string {
  if (SIN_DERIVADO.has(publicPath)) return encodeURI(publicPath)
  return encodeURI(\`/_opt\${publicPath}.webp\`)
}
`,
    "utf8",
  )
}

async function main() {
  let totalBefore = 0
  let totalAfter = 0
  let converted = 0
  const failed = new Set()

  for (const group of GROUPS) {
    const sources = await group.sources()
    process.stdout.write(`\n${group.name} — ${sources.length} archivo(s) @ ${group.width}px\n`)

    // De a 4 en paralelo: ffmpeg ya usa varios hilos por archivo.
    for (let i = 0; i < sources.length; i += 4) {
      const batch = await Promise.all(
        sources.slice(i, i + 4).map((s) => convert(s, group.width, group.quality)),
      )
      for (const r of batch) {
        if (r.missing) {
          process.stdout.write(`  ! falta ${r.publicPath}\n`)
          failed.add(decodeURI(r.publicPath))
        } else if (r.failed) {
          process.stdout.write(`  ! sin convertir ${r.publicPath} — ${r.reason}\n`)
          failed.add(decodeURI(r.publicPath))
        } else if (!r.skipped) {
          converted += 1
          totalBefore += r.before
          totalAfter += r.after
        }
      }
    }
  }

  // Las excepciones sólo se conocen tras intentar todo el set, así que el
  // manifiesto se reescribe siempre (aunque no haya conversiones nuevas).
  for (const group of GROUPS) {
    for (const src of await group.sources()) {
      const decoded = decodeURI(src)
      if (failed.has(decoded)) continue
      try {
        await fs.access(targetFor(decoded))
      } catch {
        failed.add(decoded)
      }
    }
  }
  await writeManifest(failed)

  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`
  process.stdout.write(
    converted
      ? `\nListo: ${converted} imagen(es) — ${mb(totalBefore)} -> ${mb(totalAfter)}\n`
      : `\nListo: todo al día (usá --force para regenerar).\n`,
  )
  if (failed.size) {
    process.stdout.write(`${failed.size} original(es) se sirven sin optimizar.\n`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
