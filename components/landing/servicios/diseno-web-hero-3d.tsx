"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useInViewport } from "@/hooks/use-in-viewport"

/**
 * Hero 3D de /servicios/diseno-web.
 *
 * Antes el fondo del hero era un vídeo de stock de flores: bonito, pero no
 * decía nada de lo que la página vende. Esta escena sí: son maquetas de sitios
 * flotando en profundidad que avanzan despacio hacia el visitante, cada una
 * dibujada en un `<canvas>` con la paleta de la página (cian, violeta, rosa).
 *
 * No son imágenes: cada maqueta se dibuja por código, así que pesan cero y se
 * ven nítidas en cualquier pantalla.
 *
 * Performance — la escena vive detrás de un hero a pantalla completa, así que
 * tiene que costar poco:
 * - Las maquetas comparten cuatro texturas; diez paneles, cuatro texturas.
 * - Cada panel es un plano con `MeshBasicMaterial`: sin luces ni sombras.
 * - El resplandor de cada panel es un quad aditivo con degradado radial, no
 *   post-proceso.
 * - El bucle se apaga cuando el hero sale de pantalla y con
 *   `prefers-reduced-motion`.
 */

const CYAN = "#67e8f9"
const VIOLET = "#a78bfa"
const PINK = "#eca8d6"
const INK = "#05040a"

const GLOW_COLORS = [CYAN, VIOLET, PINK]

/* ────────────────────────────────────────────────────────────────────────── */
/* Maquetas: cada plantilla se dibuja una vez en un canvas                    */
/* ────────────────────────────────────────────────────────────────────────── */

const TEX_W = 512
const TEX_H = 320

type Template = "landing" | "shop" | "panel" | "editorial"

/** Barra superior del navegador, común a las cuatro plantillas. */
function paintChrome(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle = "#0c0a14"
  ctx.fillRect(0, 0, TEX_W, 34)
  ;["#2b2740", "#2b2740", accent].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(20 + i * 16, 17, 4.5, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = "rgba(255,255,255,0.07)"
  ctx.fillRect(74, 10, 190, 14)
}

function block(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string) {
  ctx.fillStyle = fill
  ctx.fillRect(x, y, w, h)
}

function paintTemplate(ctx: CanvasRenderingContext2D, template: Template) {
  ctx.fillStyle = "#0a0812"
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  const accent = template === "shop" ? PINK : template === "panel" ? CYAN : VIOLET
  paintChrome(ctx, accent)

  if (template === "landing") {
    // Hero con degradado + titular + dos botones + tira de tarjetas.
    const g = ctx.createLinearGradient(0, 34, TEX_W, 190)
    g.addColorStop(0, "rgba(167,139,250,0.5)")
    g.addColorStop(0.6, "rgba(103,232,249,0.22)")
    g.addColorStop(1, "rgba(236,168,214,0.32)")
    ctx.fillStyle = g
    ctx.fillRect(0, 34, TEX_W, 156)

    block(ctx, 34, 78, 250, 22, "rgba(255,255,255,0.92)")
    block(ctx, 34, 110, 180, 22, "rgba(255,255,255,0.92)")
    block(ctx, 34, 152, 92, 20, PINK)
    block(ctx, 138, 152, 92, 20, "rgba(255,255,255,0.22)")

    for (let i = 0; i < 3; i++) {
      const x = 34 + i * 150
      block(ctx, x, 212, 130, 76, "rgba(255,255,255,0.05)")
      block(ctx, x + 12, 226, 60, 8, "rgba(255,255,255,0.4)")
      block(ctx, x + 12, 244, 104, 6, "rgba(255,255,255,0.16)")
      block(ctx, x + 12, 258, 84, 6, "rgba(255,255,255,0.12)")
    }
  }

  if (template === "shop") {
    block(ctx, 0, 34, TEX_W, 44, "rgba(236,168,214,0.14)")
    block(ctx, 24, 50, 120, 12, "rgba(255,255,255,0.55)")
    for (let i = 0; i < 8; i++) {
      const x = 24 + (i % 4) * 120
      const y = 96 + Math.floor(i / 4) * 108
      block(ctx, x, y, 100, 66, "rgba(255,255,255,0.06)")
      const g = ctx.createLinearGradient(x, y, x + 100, y + 66)
      g.addColorStop(0, "rgba(236,168,214,0.35)")
      g.addColorStop(1, "rgba(167,139,250,0.14)")
      ctx.fillStyle = g
      ctx.fillRect(x, y, 100, 44)
      block(ctx, x, y + 52, 56, 6, "rgba(255,255,255,0.4)")
      block(ctx, x + 66, y + 52, 30, 6, PINK)
    }
  }

  if (template === "panel") {
    block(ctx, 0, 34, 92, TEX_H - 34, "rgba(255,255,255,0.04)")
    for (let i = 0; i < 6; i++) {
      block(ctx, 14, 58 + i * 26, i === 1 ? 64 : 52, 8, i === 1 ? CYAN : "rgba(255,255,255,0.16)")
    }
    // Tres KPIs y un gráfico de barras.
    for (let i = 0; i < 3; i++) {
      const x = 110 + i * 132
      block(ctx, x, 56, 118, 54, "rgba(255,255,255,0.05)")
      block(ctx, x + 12, 68, 40, 6, "rgba(255,255,255,0.28)")
      block(ctx, x + 12, 84, 62, 14, i === 0 ? CYAN : "rgba(255,255,255,0.75)")
    }
    block(ctx, 110, 128, 382, 168, "rgba(255,255,255,0.04)")
    const bars = [38, 62, 46, 78, 58, 92, 70, 100, 84, 118]
    bars.forEach((h, i) => {
      block(ctx, 128 + i * 36, 284 - h, 22, h, i === bars.length - 1 ? CYAN : "rgba(167,139,250,0.45)")
    })
  }

  if (template === "editorial") {
    const g = ctx.createLinearGradient(0, 34, TEX_W, 34)
    g.addColorStop(0, "rgba(103,232,249,0.28)")
    g.addColorStop(1, "rgba(167,139,250,0.4)")
    ctx.fillStyle = g
    ctx.fillRect(280, 34, TEX_W - 280, TEX_H - 34)

    block(ctx, 30, 74, 210, 18, "rgba(255,255,255,0.9)")
    block(ctx, 30, 100, 160, 18, "rgba(255,255,255,0.9)")
    for (let i = 0; i < 7; i++) {
      block(ctx, 30, 142 + i * 18, i % 3 === 2 ? 150 : 220, 7, "rgba(255,255,255,0.14)")
    }
    block(ctx, 30, 272, 84, 18, VIOLET)
  }

  paintFinish(ctx, accent)
}

/**
 * Terminación común: brillo diagonal y borde encendido.
 *
 * Es lo que separa «un rectángulo con dibujitos» de «una pantalla»: el reflejo
 * le da materialidad al vidrio y el borde de color hace que el panel se recorte
 * contra el negro del fondo en vez de fundirse con él.
 */
function paintFinish(ctx: CanvasRenderingContext2D, accent: string) {
  const sheen = ctx.createLinearGradient(0, TEX_H, TEX_W, 0)
  sheen.addColorStop(0, "rgba(255,255,255,0)")
  sheen.addColorStop(0.42, "rgba(255,255,255,0.05)")
  sheen.addColorStop(0.52, "rgba(255,255,255,0.12)")
  sheen.addColorStop(0.62, "rgba(255,255,255,0.03)")
  sheen.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.75
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, TEX_W - 4, TEX_H - 4)
  ctx.globalAlpha = 1
}

/** Las cuatro plantillas se dibujan una sola vez por página y se comparten. */
let templateCache: Record<Template, THREE.Texture> | null = null
function templateTextures() {
  if (templateCache) return templateCache
  const out = {} as Record<Template, THREE.Texture>
  ;(["landing", "shop", "panel", "editorial"] as Template[]).forEach((name) => {
    const canvas = document.createElement("canvas")
    canvas.width = TEX_W
    canvas.height = TEX_H
    paintTemplate(canvas.getContext("2d")!, name)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    out[name] = tex
  })
  templateCache = out
  return out
}

/** Degradado radial reutilizable para los resplandores. */
let glowTex: THREE.Texture | null = null
function glowTexture() {
  if (glowTex) return glowTex
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, "#ffffff")
  g.addColorStop(0.4, "rgba(255,255,255,0.35)")
  g.addColorStop(1, "#000000")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  glowTex = new THREE.CanvasTexture(canvas)
  glowTex.colorSpace = THREE.SRGBColorSpace
  return glowTex
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Escena                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

const TEMPLATES: Template[] = ["landing", "shop", "panel", "editorial"]

/** Punto de reciclado: al pasar de acá, el panel vuelve al fondo. */
const NEAR = 6.5
const FAR = -26

type PanelSpec = {
  template: Template
  x: number
  y: number
  z: number
  w: number
  tilt: number
  spin: number
  glow: string
  phase: number
}

/**
 * `spread` comprime el campo en pantallas angostas: con el ancho completo los
 * paneles caían fuera del encuadre —el campo de visión horizontal se achica con
 * el aspecto— y el hero quedaba vacío.
 */
function makePanels(count: number, spread: number): PanelSpec[] {
  let seed = 20260906
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  const out: PanelSpec[] = []
  for (let i = 0; i < count; i++) {
    const w = 3 + rnd() * 2.4
    out.push({
      template: TEMPLATES[i % TEMPLATES.length],
      // Se reparten en un anillo alrededor del eje de la cámara: el centro
      // queda despejado para el titular del hero.
      x: (rnd() > 0.5 ? 1 : -1) * (2.2 + rnd() * 5.5) * spread,
      y: (rnd() - 0.5) * 7 * (0.55 + spread * 0.45),
      z: FAR + (i / count) * (NEAR - FAR),
      w,
      tilt: (rnd() - 0.5) * 0.4,
      spin: (rnd() - 0.5) * 0.22,
      phase: rnd() * 6.28,
      glow: GLOW_COLORS[i % GLOW_COLORS.length],
    })
  }
  return out
}

function Panel({ spec, reducedMotion }: { spec: PanelSpec; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const textures = templateTextures()
  const h = (spec.w * TEX_H) / TEX_W

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    if (!reducedMotion) {
      // Avance constante hacia la cámara y reciclado al fondo.
      g.position.z += delta * 0.62
      if (g.position.z > NEAR) g.position.z = FAR
    }

    const t = state.clock.elapsedTime
    g.position.y = spec.y + Math.sin(t * 0.35 + spec.phase) * 0.28
    g.rotation.y = spec.tilt + Math.sin(t * 0.22 + spec.phase) * 0.12
    g.rotation.z = spec.spin * 0.4

    // Se desvanece al nacer en el fondo y al pasar cerca de la cámara: sin esto
    // los paneles aparecían y desaparecían de golpe.
    const nearFade = THREE.MathUtils.smoothstep(NEAR - g.position.z, 0, 3.2)
    const farFade = THREE.MathUtils.smoothstep(g.position.z - FAR, 0, 7)
    const opacity = nearFade * farFade

    const face = g.children[0] as THREE.Mesh
    const glow = g.children[1] as THREE.Mesh
    ;(face.material as THREE.MeshBasicMaterial).opacity = opacity * 0.96
    ;(glow.material as THREE.MeshBasicMaterial).opacity = opacity * 0.62
  })

  return (
    <group ref={group} position={[spec.x, spec.y, spec.z]}>
      <mesh>
        <planeGeometry args={[spec.w, h]} />
        <meshBasicMaterial map={textures[spec.template]} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[spec.w * 2.1, h * 2.4]} />
        <meshBasicMaterial
          map={glowTexture()}
          color={spec.glow}
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/** Retícula en fuga: da suelo y sensación de velocidad. */
function GridFloor({ reducedMotion }: { reducedMotion: boolean }) {
  const top = useRef<THREE.GridHelper>(null)
  const bottom = useRef<THREE.GridHelper>(null)

  useFrame((_, delta) => {
    if (reducedMotion) return
    for (const ref of [top, bottom]) {
      const g = ref.current
      if (!g) continue
      // Un paso completo de la grilla y vuelve: el bucle es imperceptible.
      g.position.z = ((g.position.z + delta * 0.62) % 2) - 2
    }
  })

  return (
    <>
      <gridHelper ref={bottom} args={[80, 40, "#1d1b33", "#141227"]} position={[0, -5.5, -2]} />
      <gridHelper ref={top} args={[80, 40, "#1d1b33", "#141227"]} position={[0, 6.5, -2]} />
    </>
  )
}

const STREAK_COUNT = 90

/** Estelas de luz: partículas alargadas que pasan volando. */
function Streaks({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const bits = useMemo(() => {
    let seed = 77
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    return Array.from({ length: STREAK_COUNT }, () => ({
      x: (rnd() - 0.5) * 26,
      y: (rnd() - 0.5) * 13,
      z: FAR + rnd() * (NEAR - FAR),
      speed: 1.6 + rnd() * 3.4,
      len: 0.5 + rnd() * 2.2,
      tone: rnd(),
    }))
  }, [])

  const paint = (t: number) => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i]
      const span = NEAR - FAR
      const z = reducedMotion ? b.z : FAR + (((b.z - FAR) + t * b.speed) % span)
      dummy.position.set(b.x, b.y, z)
      dummy.scale.set(1, 1, b.len)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, color.set(b.tone > 0.66 ? PINK : b.tone > 0.33 ? VIOLET : CYAN))
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }

  useEffect(() => {
    paint(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state) => {
    if (reducedMotion) return
    paint(state.clock.elapsedTime)
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, bits.length]} frustumCulled={false}>
      <boxGeometry args={[0.014, 0.014, 1]} />
      <meshBasicMaterial vertexColors transparent opacity={0.72} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

/**
 * Cámara: paralaje suave con el puntero.
 *
 * En pantallas anchas el titular del hero cae a la izquierda, así que la mirada
 * se corre hacia allá y los paneles se acomodan hacia la derecha. En vertical
 * el texto ocupa el ancho completo y la escena queda centrada.
 */
function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, size } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const aim = size.width / size.height > 1.05 ? -1.6 : 0

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  useFrame((state) => {
    if (reducedMotion) {
      camera.lookAt(aim, 0, -8)
      return
    }
    const t = state.clock.elapsedTime
    const tx = pointer.current.x * 1.5 + Math.sin(t * 0.12) * 0.5
    const ty = pointer.current.y * 0.9 + Math.sin(t * 0.17) * 0.3
    camera.position.x += (tx - camera.position.x) * 0.04
    camera.position.y += (ty - camera.position.y) * 0.04
    camera.lookAt(aim + pointer.current.x * 0.5, 0, -8)
  })

  return null
}

function Scene({ reducedMotion, dense }: { reducedMotion: boolean; dense: boolean }) {
  const panels = useMemo(() => makePanels(dense ? 12 : 8, dense ? 1 : 0.5), [dense])

  return (
    <>
      {/* La niebla toma el negro del hero: los paneles nacen del fondo en vez de
          aparecer recortados contra él. */}
      <fog attach="fog" args={[INK, 9, 30]} />
      <GridFloor reducedMotion={reducedMotion} />
      <Streaks reducedMotion={reducedMotion} />
      {panels.map((spec, i) => (
        <Panel key={i} spec={spec} reducedMotion={reducedMotion} />
      ))}
      <Rig reducedMotion={reducedMotion} />
    </>
  )
}

export function DisenoWebHero3D({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { ref, inView } = useInViewport<HTMLDivElement>("120px")
  const [dense, setDense] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const sync = () => setDense(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 size-full" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 46 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion || !inView ? "demand" : "always"}
        onCreated={({ gl }) => gl.setClearColor(INK, 1)}
      >
        <Scene reducedMotion={reducedMotion} dense={dense} />
      </Canvas>
    </div>
  )
}

export default DisenoWebHero3D
