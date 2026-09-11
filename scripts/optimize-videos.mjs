/**
 * Genera derivados livianos de los videos de `public/`.
 *
 * Origen:  public/<ruta>                       (tal cual los entrega el cliente)
 * Destino: public/_opt/<ruta>                  (WebM VP9 re-encodeado)
 *          public/_opt/<ruta>.poster.webp      (primer cuadro, para `poster`)
 *
 * Los originales llegan con bitrates de master de edición (el cinematic de la
 * página de minería pesaba 48 MB para 8 segundos). Acá se re-encodean a un
 * bitrate de web y se les saca el audio: los dos `<video>` que los usan están
 * muteados, así que la pista de audio era peso puro.
 *
 * Requiere ffmpeg en el PATH.  Uso: `node scripts/optimize-videos.mjs [--force]`
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

/**
 * El grano de los masters es lo que se come el bitrate: VP9 gasta bits en
 * codificar ruido. Un `hqdn3d` previo baja el peso a la mitad sin diferencia
 * visible a tamaño de pantalla, y la textura vuelve por CSS (grain-overlay).
 */
const VIDEOS = [
  { path: "/mineria/cinematic_202604191001.webm", width: 1280, crf: 38, denoise: "3:3:10:10" },
  { path: "/mineria/clip_1_202603281304.webm", width: 1100, crf: 36, denoise: "2:2:8:8" },
]

const mb = (n) => `${(n / 1048576).toFixed(2)} MB`

async function isFresh(source, target) {
  if (FORCE) return false
  try {
    const [s, t] = await Promise.all([fs.stat(source), fs.stat(target)])
    return t.mtimeMs >= s.mtimeMs && t.size > 0
  } catch {
    return false
  }
}

async function convert({ path: publicPath, width, crf, denoise }) {
  const source = path.join(PUBLIC_DIR, decodeURI(publicPath).replace(/^\//, ""))
  const target = path.join(OPT_DIR, decodeURI(publicPath).replace(/^\//, ""))
  const poster = `${target}.poster.webp`

  try {
    await fs.access(source)
  } catch {
    process.stdout.write(`  ! falta ${publicPath}\n`)
    return null
  }
  if (await isFresh(source, target)) {
    process.stdout.write(`  = ${publicPath} (al día)\n`)
    return null
  }

  await fs.mkdir(path.dirname(target), { recursive: true })

  // `-deadline good -cpu-used 3` es el punto donde VP9 deja de ganar tamaño
  // a cambio de mucho tiempo de encode. `-an` saca el audio: van muteados.
  await execFileAsync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", source,
    "-vf", `scale='min(${width},iw)':-2:flags=lanczos,hqdn3d=${denoise}`,
    "-c:v", "libvpx-vp9", "-crf", String(crf), "-b:v", "0",
    "-row-mt", "1", "-deadline", "good", "-cpu-used", "3",
    "-pix_fmt", "yuv420p",
    "-an",
    target,
  ], { maxBuffer: 1 << 24 })

  // Poster: sin él el navegador pinta un rectángulo negro hasta el primer
  // cuadro, y con `preload="none"` ese hueco dura hasta que el usuario llega.
  await execFileAsync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", source,
    "-frames:v", "1",
    "-vf", `scale='min(${width},iw)':-2:flags=lanczos`,
    "-c:v", "libwebp", "-quality", "72", "-compression_level", "6",
    poster,
  ], { maxBuffer: 1 << 24 })

  const [before, after, post] = await Promise.all([
    fs.stat(source),
    fs.stat(target),
    fs.stat(poster),
  ])
  const pct = Math.round((1 - after.size / before.size) * 100)
  process.stdout.write(
    `  ${publicPath}\n    ${mb(before.size)} -> ${mb(after.size)}  (-${pct}%)  + poster ${mb(post.size)}\n`,
  )
  return { before: before.size, after: after.size + post.size }
}

async function main() {
  let totalBefore = 0
  let totalAfter = 0
  process.stdout.write(`\nvideos — ${VIDEOS.length} archivo(s)\n`)
  for (const video of VIDEOS) {
    const r = await convert(video)
    if (r) {
      totalBefore += r.before
      totalAfter += r.after
    }
  }
  if (totalBefore) {
    const pct = Math.round((1 - totalAfter / totalBefore) * 100)
    process.stdout.write(`\ntotal: ${mb(totalBefore)} -> ${mb(totalAfter)}  (-${pct}%)\n`)
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`)
  process.exit(1)
})
