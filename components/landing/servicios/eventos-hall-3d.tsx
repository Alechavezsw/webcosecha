"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Salón de eventos 3D de /servicios/eventos.
 *
 * Reemplaza el iframe de Sketchfab que había antes: un modelo genérico de otra
 * marca, con su propia barra de branding, que tardaba varios segundos en cargar
 * y no tenía nada que ver con lo que vendemos.
 *
 * Esta escena sí lo cuenta: es un salón a oscuras con una pantalla LED que
 * **muestra el módulo que el visitante tiene seleccionado en el panel**
 * —la trivia, la ruleta, el cronograma o el QR—, un público que responde con
 * los celulares en alto, cañones de luz barriendo y papel picado. Cambiar de
 * pestaña cambia lo que se ve en la pantalla y dispara una ola en el público.
 *
 * Decisiones de performance, que es lo que hace que esto sea viable a pantalla
 * completa y todo el tiempo:
 * - Público, celulares y papel picado son tres `InstancedMesh`: la escena
 *   entera son ~15 draw calls con miles de objetos.
 * - El reflejo del piso es geometría espejada (`scale.y = -1`) bajo un piso
 *   semitransparente, no un render-target: cuesta cero.
 * - El «bloom» son quads aditivos detrás de lo que brilla, no post-proceso.
 * - La textura de la pantalla es un `<canvas>` 2D que se redibuja ~12 veces por
 *   segundo, no en cada cuadro.
 * - El bucle se apaga con la pestaña oculta y con `prefers-reduced-motion`.
 */

export type EventosStage = "trivias" | "juegos" | "visuales" | "apps"

/** Rosa de la página. El resto de la escena se construye alrededor de este color. */
const PINK = "#eca8d6"
const VIOLET = "#7b4d9e"
const DEEP = "#0a0410"

const PINK_C = new THREE.Color(PINK)
const VIOLET_C = new THREE.Color(VIOLET)
const CROWD_DARK = new THREE.Color("#1b1024")

/* ────────────────────────────────────────────────────────────────────────── */
/* Pulso                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

/** Segundos que dura la entrada de cámara. */
const INTRO = 2.8

/** Tempo del salón. 118 BPM es el pulso típico de una fiesta corporativa. */
const BPM = 118

/**
 * Golpe compartido por toda la escena: 1 en el ataque de cada tiempo y cae con
 * una curva cúbica hasta el siguiente.
 *
 * Antes cada pieza latía con su propio seno y el conjunto se veía revuelto:
 * luces, láseres y celulares parpadeando cada uno a su ritmo. Con un único
 * pulso, el salón entero respira junto y se lee como un show con música.
 */
function beat(t: number, offset = 0) {
  const phase = ((t * BPM) / 60 + offset) % 1
  return Math.pow(1 - phase, 3)
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Texturas de luz                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Con mezcla aditiva el negro no suma nada, así que un degradado a negro **es**
 * un degradado a transparente. Por eso alcanza con un `map` en escala de grises
 * y no hace falta canal alfa ni un shader.
 *
 * Es la diferencia entre un cono de luz de verdad y el triángulo plano de
 * opacidad uniforme que teníamos antes.
 */
function makeGradient(kind: "radial" | "beam") {
  const canvas = document.createElement("canvas")
  canvas.width = kind === "radial" ? 128 : 8
  canvas.height = 128
  const ctx = canvas.getContext("2d")!

  if (kind === "radial") {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, "#ffffff")
    g.addColorStop(0.35, "rgba(255,255,255,0.42)")
    g.addColorStop(1, "#000000")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
  } else {
    // Arriba (v = 1, la boca del foco) blanco; abajo, negro.
    const g = ctx.createLinearGradient(0, 0, 0, 128)
    g.addColorStop(0, "#ffffff")
    g.addColorStop(0.14, "rgba(255,255,255,0.5)")
    g.addColorStop(1, "#000000")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 8, 128)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Se crean una sola vez por página y las comparten todas las luces. */
let radialTex: THREE.Texture | null = null
let beamTex: THREE.Texture | null = null
function lightTextures() {
  if (!radialTex) radialTex = makeGradient("radial")
  if (!beamTex) beamTex = makeGradient("beam")
  return { radial: radialTex, beam: beamTex }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Pantalla LED: un canvas 2D que dibuja el módulo activo                     */
/* ────────────────────────────────────────────────────────────────────────── */

const SCREEN_W = 1024
const SCREEN_H = 448

/** Módulos del QR: fijos, para que no titile de un cuadro a otro. */
const QR_CELLS = (() => {
  const n = 21
  const out: boolean[] = []
  let seed = 7
  for (let i = 0; i < n * n; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    out.push(seed / 4294967296 > 0.48)
  }
  return out
})()

/**
 * Rejilla de píxeles del panel: líneas oscuras cada 4px, en horizontal y en
 * vertical. Es el detalle que hace que la pantalla se lea como LED de evento y
 * no como una imagen pegada sobre un plano.
 */
function paintPixelGrid(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(0,0,0,0.34)"
  for (let y = 0; y < SCREEN_H; y += 4) ctx.fillRect(0, y, SCREEN_W, 1)
  ctx.fillStyle = "rgba(0,0,0,0.18)"
  for (let x = 0; x < SCREEN_W; x += 4) ctx.fillRect(x, 0, 1, SCREEN_H)
}

function paintScreen(ctx: CanvasRenderingContext2D, stage: EventosStage, t: number) {
  paintScreenContent(ctx, stage, t)
  paintPixelGrid(ctx)
}

function paintScreenContent(ctx: CanvasRenderingContext2D, stage: EventosStage, t: number) {
  const W = SCREEN_W
  const H = SCREEN_H

  ctx.fillStyle = "#0a0512"
  ctx.fillRect(0, 0, W, H)

  // Marco y rótulo comunes: la pantalla se lee como una pieza de la marca.
  ctx.strokeStyle = "rgba(236,168,214,0.35)"
  ctx.lineWidth = 4
  ctx.strokeRect(18, 18, W - 36, H - 36)

  ctx.font = "600 20px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(236,168,214,0.85)"
  ctx.fillText("COSECHA CREATIVA", 46, 62)

  ctx.textAlign = "right"
  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.fillText(`${118 + Math.floor((Math.sin(t * 0.7) + 1) * 24)} EN VIVO`, W - 46, 62)
  ctx.textAlign = "left"

  if (stage === "trivias") {
    ctx.font = "700 54px system-ui, -apple-system, Segoe UI, sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("¿Qué año fundó la empresa?", 46, 150)

    const options = ["1987", "1994", "2003", "2011"]
    const correct = 1
    options.forEach((o, i) => {
      const x = 46 + (i % 2) * ((W - 132) / 2 + 40)
      const y = 196 + Math.floor(i / 2) * 88
      const w = (W - 132) / 2
      const on = i === correct && Math.sin(t * 2.4) > 0
      ctx.fillStyle = on ? "rgba(236,168,214,0.9)" : "rgba(255,255,255,0.06)"
      ctx.fillRect(x, y, w, 68)
      ctx.strokeStyle = on ? PINK : "rgba(255,255,255,0.18)"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, 68)
      ctx.font = "600 34px system-ui, sans-serif"
      ctx.fillStyle = on ? "#12060f" : "rgba(255,255,255,0.85)"
      ctx.fillText(o, x + 26, y + 46)
    })

    // Cuenta regresiva.
    const p = (Math.sin(t * 0.55) + 1) * 0.5
    ctx.fillStyle = "rgba(255,255,255,0.1)"
    ctx.fillRect(46, H - 74, W - 92, 12)
    ctx.fillStyle = PINK
    ctx.fillRect(46, H - 74, (W - 92) * p, 12)
    return
  }

  if (stage === "juegos") {
    const cx = W * 0.74
    const cy = H * 0.54
    const r = 148
    const wedges = 10
    for (let i = 0; i < wedges; i++) {
      const a0 = (i / wedges) * Math.PI * 2 + t * 0.9
      const a1 = ((i + 1) / wedges) * Math.PI * 2 + t * 0.9
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, a0, a1)
      ctx.closePath()
      ctx.fillStyle = i % 2 ? "rgba(236,168,214,0.9)" : "rgba(123,77,158,0.85)"
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(cx, cy, 34, 0, Math.PI * 2)
    ctx.fillStyle = "#0a0512"
    ctx.fill()
    ctx.strokeStyle = PINK
    ctx.lineWidth = 4
    ctx.stroke()

    // Aguja.
    ctx.beginPath()
    ctx.moveTo(cx, cy - r - 26)
    ctx.lineTo(cx - 18, cy - r + 8)
    ctx.lineTo(cx + 18, cy - r + 8)
    ctx.closePath()
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    ctx.font = "700 58px system-ui, sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Ruleta de premios", 46, 176)
    ctx.font = "500 28px system-ui, sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.fillText("Girá desde tu celular", 46, 222)

    const prizes = ["Kit de marca", "Sorteo final", "Descuento"]
    prizes.forEach((p, i) => {
      const y = 268 + i * 46
      ctx.fillStyle = i === Math.floor(t * 0.8) % 3 ? PINK : "rgba(255,255,255,0.22)"
      ctx.fillRect(46, y - 14, 14, 14)
      ctx.font = "500 26px system-ui, sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.fillText(p, 76, y)
    })
    return
  }

  if (stage === "visuales") {
    ctx.font = "700 52px system-ui, sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Cronograma en vivo", 46, 148)

    const rows = [
      ["19:00", "Acreditación"],
      ["20:15", "Apertura y palabras"],
      ["21:00", "Show central"],
      ["22:30", "Sorteos y cierre"],
    ]
    const active = Math.floor(t * 0.45) % rows.length
    rows.forEach(([time, label], i) => {
      const y = 196 + i * 58
      const on = i === active
      ctx.fillStyle = on ? "rgba(236,168,214,0.14)" : "transparent"
      ctx.fillRect(40, y - 34, W - 320, 48)
      ctx.font = "600 30px ui-monospace, Menlo, monospace"
      ctx.fillStyle = on ? PINK : "rgba(255,255,255,0.4)"
      ctx.fillText(time, 52, y)
      ctx.font = "500 30px system-ui, sans-serif"
      ctx.fillStyle = on ? "#ffffff" : "rgba(255,255,255,0.6)"
      ctx.fillText(label, 176, y)
    })

    // Reloj grande a la derecha.
    ctx.textAlign = "right"
    ctx.font = "700 96px ui-monospace, Menlo, monospace"
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillText(`21:${String(Math.floor(t * 3) % 60).padStart(2, "0")}`, W - 52, 250)
    ctx.font = "600 24px ui-monospace, Menlo, monospace"
    ctx.fillStyle = PINK
    ctx.fillText("#TUEVENTO2026", W - 52, 300)
    ctx.textAlign = "left"
    return
  }

  // apps
  const qx = 60
  const qy = 128
  const cell = 12
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(qx - 14, qy - 14, 21 * cell + 28, 21 * cell + 28)
  ctx.fillStyle = "#0a0512"
  for (let i = 0; i < 21 * 21; i++) {
    if (!QR_CELLS[i]) continue
    ctx.fillRect(qx + (i % 21) * cell, qy + Math.floor(i / 21) * cell, cell, cell)
  }
  // Barrido del lector sobre el QR.
  const scan = qy + ((t * 90) % (21 * cell))
  ctx.fillStyle = "rgba(236,168,214,0.55)"
  ctx.fillRect(qx - 14, scan, 21 * cell + 28, 4)

  ctx.font = "700 52px system-ui, sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.fillText("Escaneá y participá", 400, 176)
  ctx.font = "500 27px system-ui, sans-serif"
  ctx.fillStyle = "rgba(255,255,255,0.55)"
  ctx.fillText("Sin descargar nada. Se abre en el navegador.", 400, 218)

  const rank = [
    ["01", "Equipo Norte", 0.92],
    ["02", "Los del fondo", 0.74],
    ["03", "Marketing", 0.58],
  ] as const
  rank.forEach(([pos, name, v], i) => {
    const y = 274 + i * 46
    ctx.font = "600 24px ui-monospace, Menlo, monospace"
    ctx.fillStyle = "rgba(255,255,255,0.35)"
    ctx.fillText(pos, 400, y)
    ctx.font = "500 24px system-ui, sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.fillText(name, 444, y)
    const bw = 300
    ctx.fillStyle = "rgba(255,255,255,0.1)"
    ctx.fillRect(640, y - 18, bw, 20)
    ctx.fillStyle = i === 0 ? PINK : "rgba(236,168,214,0.45)"
    ctx.fillRect(640, y - 18, bw * (v * (0.94 + Math.sin(t * 1.6 + i) * 0.06)), 20)
  })
}

function useScreenTexture(stage: EventosStage, reducedMotion: boolean) {
  const data = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const ctx = canvas.getContext("2d")!
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return { canvas, ctx, texture }
  }, [])

  useEffect(() => {
    paintScreen(data.ctx, stage, 0)
    data.texture.needsUpdate = true
  }, [data, stage])

  useEffect(() => () => data.texture.dispose(), [data])

  /** ~12 redibujos por segundo: en la pantalla no se nota y cuesta la décima parte. */
  const last = useRef(0)
  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    if (t - last.current < 1 / 12) return
    last.current = t
    paintScreen(data.ctx, stage, t)
    data.texture.needsUpdate = true
  })

  return data.texture
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Piezas de la escena                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

// Medidas del escenario. La pantalla se achicó de 19 a 15 de ancho: con el
// panel de HUD ocupando los 440px de la izquierda, a 19 no entraba en el hueco
// que queda libre y se cortaba contra el borde derecho.
const WALL_W = 15
const WALL_H = 6.6
const WALL_Y = 4.4
const WALL_Z = -16

/** Pantalla principal + laterales + el halo que las envuelve. */
function LedWall({ texture }: { texture: THREE.Texture }) {
  return (
    <group>
      <mesh position={[0, WALL_Y, WALL_Z]}>
        <planeGeometry args={[WALL_W, WALL_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Halo de la pantalla. Con un quad liso se veía el rectángulo del halo;
          con el degradado radial el brillo se derrama y no tiene borde. */}
      <mesh position={[0, WALL_Y, WALL_Z + 0.3]}>
        <planeGeometry args={[WALL_W * 2.4, WALL_H * 3.2]} />
        <meshBasicMaterial
          map={lightTextures().radial}
          color={PINK}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Columnas LED laterales, giradas hacia el público. Ahora muestran el
          mismo contenido que la pantalla principal —como en un evento real, que
          repite la señal en las torres— en vez de ser dos manchas violetas. */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 10.2, 4, WALL_Z + 3.2]} rotation={[0, -s * 0.62, 0]}>
          <mesh position={[0, 0, -0.06]}>
            <planeGeometry args={[3.3, 6.5]} />
            <meshBasicMaterial color="#150c1d" />
          </mesh>
          <mesh>
            {/* Vertical: la textura es 16:7, así que se ve un recorte, que es
                justamente lo que pasa con las torres verticales de verdad. */}
            <planeGeometry args={[3, 6.2]} />
            <meshBasicMaterial map={texture} transparent opacity={0.62} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[7, 12]} />
            <meshBasicMaterial
              map={lightTextures().radial}
              color={VIOLET}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* Estructura: parrilla de truss sobre el escenario. */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 9.6 - i * 0.02, WALL_Z + 3 + i * 3.4]}>
          <boxGeometry args={[21, 0.18, 0.18]} />
          <meshBasicMaterial color="#241a2c" />
        </mesh>
      ))}

      {/* Bastidor de la pantalla: sin el marco oscuro alrededor, el LED flotaba
          en el aire en vez de estar montado sobre algo. */}
      <mesh position={[0, WALL_Y, WALL_Z - 0.05]}>
        <planeGeometry args={[WALL_W + 0.9, WALL_H + 0.9]} />
        <meshBasicMaterial color="#150c1d" />
      </mesh>

      {/* Torres de sonido flanqueando el escenario. */}
      {[-1, 1].map((s) => (
        <group key={`pa-${s}`} position={[s * 8.7, 0, WALL_Z + 5]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, 2.1 + i * 1.05, 0]}>
              <boxGeometry args={[1.15, 0.95, 1]} />
              <meshBasicMaterial color="#120a19" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Borde del escenario. */}
      <mesh position={[0, 0.5, WALL_Z + 6]}>
        <boxGeometry args={[21, 1, 0.5]} />
        <meshBasicMaterial color="#160d1e" />
      </mesh>
    </group>
  )
}

const BEAMS = [
  { x: -9, color: PINK, speed: 0.42, phase: 0 },
  { x: -4.5, color: "#ffe9f6", speed: 0.31, phase: 1.4 },
  { x: 0, color: VIOLET, speed: 0.5, phase: 2.6 },
  { x: 4.5, color: PINK, speed: 0.36, phase: 4.1 },
  { x: 9, color: "#c9b4ff", speed: 0.46, phase: 5.3 },
] as const

/**
 * Cañones de luz: conos aditivos que barren el salón, cada uno con su charco de
 * luz en el piso.
 *
 * Los haces son finos y tenues a propósito. En la primera versión eran anchos y
 * al 14% de opacidad: se superponían de a tres y velaban toda la escena de gris.
 */
function Beams({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const pools = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime

    group.current?.children.forEach((child, i) => {
      const b = BEAMS[i]
      if (!b) return
      const swing = Math.sin(t * b.speed + b.phase)
      child.rotation.z = swing * 0.5
      child.rotation.x = Math.cos(t * b.speed * 0.7 + b.phase) * 0.24
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      m.opacity = 0.2 + beat(t, b.phase * 0.12) * 0.34

      // El charco sigue al haz: la base del cono cae donde apunta el swing.
      const pool = pools.current?.children[i]
      if (pool) {
        pool.position.x = b.x + swing * 9
        const pm = (pool as THREE.Mesh).material as THREE.MeshBasicMaterial
        pm.opacity = 0.24 + beat(t, b.phase * 0.12) * 0.42
      }
    })
  })

  return (
    <>
      <group ref={group}>
        {BEAMS.map((b) => (
          // El cono pivota en el foco (arriba), no en el medio del haz.
          <mesh key={b.x} position={[b.x, 10.6, WALL_Z + 7]}>
            <coneGeometry args={[1.7, 16, 28, 1, true]} />
            <meshBasicMaterial
              map={lightTextures().beam}
              color={b.color}
              transparent
              opacity={0.34}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Cuerpo del foco colgado del truss. Sin él los haces nacían de la nada;
          con la lente encendida se entiende de dónde sale cada uno. */}
      <group>
        {BEAMS.map((b) => (
          <group key={`fx-${b.x}`} position={[b.x, 10.9, WALL_Z + 7]}>
            <mesh>
              <boxGeometry args={[0.62, 0.7, 0.62]} />
              <meshBasicMaterial color="#181022" />
            </mesh>
            <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.3, 16]} />
              <meshBasicMaterial color={b.color} transparent opacity={0.85} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={pools}>
        {BEAMS.map((b) => (
          <mesh key={`pool-${b.x}`} rotation={[-Math.PI / 2, 0, 0]} position={[b.x, 0.06, WALL_Z + 8]}>
            <circleGeometry args={[4.2, 28]} />
            <meshBasicMaterial
              map={lightTextures().radial}
              color={b.color}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}

const LASER_COUNT = 14

/**
 * Abanico de láseres desde el truss. Son planos larguísimos y finísimos con
 * mezcla aditiva: el detalle que termina de leerse como show en vivo, por unas
 * pocas decenas de triángulos.
 */
function Lasers({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  /** Anclado por el extremo de arriba: el rayo se estira hacia abajo desde el truss. */
  const laserGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.08, 26)
    g.translate(0, -13, 0)
    return g
  }, [])
  useEffect(() => () => laserGeometry.dispose(), [laserGeometry])

  const paint = (t: number) => {
    const m = mesh.current
    if (!m) return
    const sweep = Math.sin(t * 0.35)
    for (let i = 0; i < LASER_COUNT; i++) {
      const spread = (i / (LASER_COUNT - 1) - 0.5) * 1.5
      dummy.position.set(0, 9.4, WALL_Z + 5)
      dummy.rotation.set(-0.45 + Math.sin(t * 0.6) * 0.12, 0, spread + sweep * 0.35)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      const hit = beat(t, i * 0.04)
      m.setColorAt(i, color.copy(VIOLET_C).lerp(PINK_C, hit).multiplyScalar(0.35 + hit))
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
    <instancedMesh ref={mesh} args={[laserGeometry, undefined, LASER_COUNT]} frustumCulled={false}>
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.36}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

const CROWD_COUNT = 780
const PHONE_COUNT = 250

/** Público: barras oscuras que se mecen, con una ola rosa cuando cambia el módulo. */
function Crowd({ pulseAt, reducedMotion }: { pulseAt: number; reducedMotion: boolean }) {
  const bodies = useRef<THREE.InstancedMesh>(null)
  const phones = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const people = useMemo(() => {
    const out: { x: number; z: number; h: number; ph: number; phone: boolean; energy: number }[] = []
    let seed = 12345
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    for (let i = 0; i < CROWD_COUNT; i++) {
      const x = (rnd() - 0.5) * 34
      const z = -8 + rnd() * 19
      // Pasillo central despejado: deja ver la pantalla completa.
      if (Math.abs(x) < 1.6 && z > 2) continue
      // `energy`: cuánto salta cada uno. La mayoría se mueve poco y unos pocos
      // saltan de verdad, que es como se ve un salón real.
      out.push({ x, z, h: 1.35 + rnd() * 0.5, ph: rnd() * 6.28, phone: rnd() > 0.66, energy: Math.pow(rnd(), 2.2) })
    }
    return out
  }, [])

  const phonePeople = useMemo(() => people.filter((p) => p.phone).slice(0, PHONE_COUNT), [people])

  const paint = (t: number) => {
    const bodyMesh = bodies.current
    const phoneMesh = phones.current
    if (!bodyMesh) return

    for (let i = 0; i < people.length; i++) {
      const p = people[i]
      // Mecerse + un salto en el golpe. Con solo el vaivén el público parecía
      // un campo de trigo; el salto en el tiempo lo vuelve gente en una fiesta.
      const bob = reducedMotion ? 0 : Math.sin(t * 2.1 + p.ph) * 0.05
      const hop = reducedMotion ? 0 : beat(t, p.ph * 0.14) * p.energy * 0.34
      dummy.position.set(p.x, p.h / 2 + bob + hop, p.z)
      dummy.scale.set(0.34, p.h, 0.34)
      dummy.updateMatrix()
      bodyMesh.setMatrixAt(i, dummy.matrix)

      // Las primeras filas reciben la luz de la pantalla; el fondo queda negro.
      // Sin esto el público era una mancha plana contra el piso.
      const lit = Math.max(0, 1 - (p.z + 9) / 19) * 0.4

      // Ola: un frente que sale del escenario cuando se cambia de módulo.
      const wave = Math.max(0, 1 - Math.abs((t - pulseAt) * 9 - (p.z + 9)) * 0.5)

      bodyMesh.setColorAt(i, color.copy(CROWD_DARK).lerp(VIOLET_C, lit).lerp(PINK_C, wave * 0.85))
    }
    bodyMesh.instanceMatrix.needsUpdate = true
    if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true

    if (!phoneMesh) return
    for (let i = 0; i < phonePeople.length; i++) {
      const p = phonePeople[i]
      const lift = reducedMotion ? 0 : Math.sin(t * 1.3 + p.ph) * 0.1 + beat(t, p.ph * 0.14) * p.energy * 0.34
      dummy.position.set(p.x, p.h + 0.5 + lift, p.z + 0.2)
      dummy.scale.setScalar(1)
      dummy.rotation.set(0, 0, Math.sin(p.ph) * 0.2)
      dummy.updateMatrix()
      phoneMesh.setMatrixAt(i, dummy.matrix)
      // Los celulares levantan en el golpe, cada uno con su desfasaje.
      const twinkle = 0.4 + beat(t, p.ph * 0.16) * 0.85
      phoneMesh.setColorAt(i, color.copy(VIOLET_C).lerp(PINK_C, Math.min(1, twinkle)).multiplyScalar(0.5 + twinkle * 0.6))
    }
    phoneMesh.instanceMatrix.needsUpdate = true
    if (phoneMesh.instanceColor) phoneMesh.instanceColor.needsUpdate = true
  }

  useEffect(() => {
    paint(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state) => paint(state.clock.elapsedTime))

  return (
    <group>
      <instancedMesh ref={bodies} args={[undefined, undefined, people.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial vertexColors />
      </instancedMesh>
      <instancedMesh ref={phones} args={[undefined, undefined, phonePeople.length]} frustumCulled={false}>
        <planeGeometry args={[0.16, 0.28]} />
        <meshBasicMaterial vertexColors transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}

const DUST_COUNT = 220

/**
 * Polvo suspendido en el aire, con el degradado radial: partículas blandas que
 * flotan y titilan. Es lo que le da atmósfera al salón — sin nada en el aire,
 * los haces de luz se ven como geometría flotando en el vacío.
 */
function Dust({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const motes = useMemo(() => {
    const out: { x: number; y: number; z: number; s: number; ph: number; tone: number }[] = []
    let seed = 4242
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    for (let i = 0; i < DUST_COUNT; i++) {
      out.push({
        x: (rnd() - 0.5) * 30,
        y: 0.6 + rnd() * 10,
        z: WALL_Z + 2 + rnd() * 24,
        s: 0.1 + rnd() * 0.26,
        ph: rnd() * 6.28,
        tone: rnd(),
      })
    }
    return out
  }, [])

  const paint = (t: number) => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < motes.length; i++) {
      const d = motes[i]
      dummy.position.set(
        d.x + Math.sin(t * 0.22 + d.ph) * 1.1,
        d.y + Math.sin(t * 0.3 + d.ph * 1.7) * 0.5,
        d.z,
      )
      dummy.scale.setScalar(d.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      const glow = 0.22 + beat(t, d.ph * 0.2) * 0.5
      m.setColorAt(i, color.copy(d.tone > 0.65 ? PINK_C : VIOLET_C).multiplyScalar(glow))
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
    <instancedMesh ref={mesh} args={[undefined, undefined, motes.length]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={lightTextures().radial}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

const CONFETTI_COUNT = 190

/** Papel picado cayendo sobre el público. */
function Confetti({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const bits = useMemo(() => {
    const out: { x: number; z: number; y0: number; sp: number; sp2: number; tone: number }[] = []
    let seed = 999
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      out.push({
        x: (rnd() - 0.5) * 32,
        z: -12 + rnd() * 22,
        y0: rnd() * 14,
        sp: 0.7 + rnd() * 1.1,
        sp2: rnd() * 6.28,
        tone: rnd(),
      })
    }
    return out
  }, [])

  const paint = (t: number) => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i]
      const y = 14 - ((b.y0 + t * b.sp) % 14)
      dummy.position.set(b.x + Math.sin(t * 0.8 + b.sp2) * 0.7, y, b.z)
      dummy.rotation.set(t * b.sp * 1.6 + b.sp2, t * b.sp + b.sp2, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, color.copy(b.tone > 0.5 ? PINK_C : VIOLET_C))
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
      <planeGeometry args={[0.09, 0.14]} />
      {/* Aditivo: sobre el negro del salón el papel picado tiene que brillar,
          no aparecer como cuadraditos grises. */}
      <meshBasicMaterial
        vertexColors
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

/**
 * Bruma del salón: tres velos aditivos a distintas profundidades que se
 * desplazan despacio.
 *
 * Es lo que separa «una escena 3D» de «un lugar»: al haber algo entre la cámara
 * y el escenario, el ojo lee aire, y los haces de luz pasan por delante y por
 * detrás de la bruma en vez de flotar en el vacío.
 */
function Haze({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)

  const layers = [
    { z: WALL_Z + 4, y: 3.4, w: 46, h: 15, color: VIOLET, opacity: 0.2, speed: 0.055 },
    { z: WALL_Z + 14, y: 2.6, w: 40, h: 12, color: PINK, opacity: 0.14, speed: -0.04 },
    { z: WALL_Z + 24, y: 2, w: 34, h: 10, color: VIOLET, opacity: 0.1, speed: 0.03 },
  ]

  useFrame((state) => {
    if (reducedMotion || !group.current) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((layer, i) => {
      const l = layers[i]
      layer.position.x = Math.sin(t * l.speed) * 7
      layer.position.y = l.y + Math.sin(t * l.speed * 1.7 + i) * 0.5
    })
  })

  return (
    <group ref={group}>
      {layers.map((l) => (
        <mesh key={l.z} position={[0, l.y, l.z]}>
          <planeGeometry args={[l.w, l.h]} />
          <meshBasicMaterial
            map={lightTextures().radial}
            color={l.color}
            transparent
            opacity={l.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Piso semitransparente: lo que se ve debajo es la escena espejada.
 *
 * La opacidad es lo único que separa «reflejo» de «segunda pantalla dada vuelta»
 * — a 0.84 el texto de la pantalla LED se leía perfecto al revés.
 */
function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color={DEEP} transparent opacity={0.93} />
      </mesh>
      <gridHelper args={[160, 80, "#2a1836", "#150b1d"]} position={[0, 0.02, 0]} />

      {/* Derrame de la pantalla sobre el piso del escenario. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, WALL_Z + 5]}>
        <planeGeometry args={[21, 16]} />
        <meshBasicMaterial
          color={PINK}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Filo del escenario encendido: separa tarima de platea. */}
      <mesh position={[0, 1.02, WALL_Z + 6.26]}>
        <planeGeometry args={[21, 0.09]} />
        <meshBasicMaterial color={PINK} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

/**
 * Cámara: deriva lenta + paralaje con el puntero.
 *
 * El panel de HUD ocupa los ~440px de la izquierda, así que en pantallas anchas
 * la cámara mira a un punto corrido a la izquierda del escenario: eso empuja
 * todo el salón hacia la mitad derecha, que es la que queda libre. En vertical
 * el HUD está abajo y no hace falta.
 */
function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, size } = useThree()
  const target = useRef({ x: 0, y: 0 })
  const wide = size.width / size.height > 1.05

  // En ancho el HUD ocupa la izquierda, así que la cámara mira a un punto
  // corrido a la izquierda y el salón se va a la mitad derecha libre.
  const aim = wide ? -6.2 : 0

  // En vertical el HUD ocupa la mitad de abajo. Mirando más abajo del centro de
  // la pantalla LED, el escenario sube en cuadro y queda en la banda visible;
  // apuntando al centro quedaba justo detrás del panel.
  const aimY = wide ? 4.6 : 1.4

  useEffect(() => {
    camera.position.set(0, 3.9, 16)
    camera.lookAt(aim, aimY, WALL_Z)
  }, [camera, aim, aimY])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime

    const tx = target.current.x * 3 + Math.sin(t * 0.13) * 1.5
    const ty = 3.9 + target.current.y * 1 + Math.sin(t * 0.19) * 0.4
    // Respiración lenta en Z: el salón nunca queda del todo quieto.
    const tz = 16 + Math.sin(t * 0.09) * 1.6

    // Entrada: los primeros segundos la cámara viene desde el fondo del salón y
    // baja hasta su altura de reposo. El visitante llega a un lugar en vez de
    // aparecer plantado frente a la pantalla.
    //
    // Se escribe la posición directamente en vez de suavizar hacia ella: con el
    // suavizado del reposo (2% por cuadro) la cámara no llegaba nunca, y sumar
    // el desplazamiento a la posición en cada cuadro la mandaba al infinito.
    if (t < INTRO) {
      const k = 1 - Math.pow(1 - t / INTRO, 3)
      camera.position.set(tx * k, ty + (1 - k) * 7, tz + (1 - k) * 26)
    } else {
      camera.position.x += (tx - camera.position.x) * 0.035
      camera.position.y += (ty - camera.position.y) * 0.035
      camera.position.z += (tz - camera.position.z) * 0.02
    }

    camera.lookAt(aim + target.current.x * 1.1, aimY, WALL_Z)
  })

  return null
}

function Scene({ stage, reducedMotion }: { stage: EventosStage; reducedMotion: boolean }) {
  const texture = useScreenTexture(stage, reducedMotion)
  const { clock } = useThree()
  const [pulseAt, setPulseAt] = useState(-99)

  /** Cambiar de módulo dispara la ola en el público. */
  useEffect(() => {
    setPulseAt(clock.elapsedTime)
  }, [stage, clock])

  return (
    <>
      <fog attach="fog" args={[DEEP, 14, 62]} />

      {/* Escena espejada bajo el piso: el reflejo del salón, sin render-target. */}
      <group scale={[1, -1, 1]}>
        <LedWall texture={texture} />
        <Beams reducedMotion={reducedMotion} />
      </group>

      <Floor />

      <LedWall texture={texture} />
      <Beams reducedMotion={reducedMotion} />
      <Lasers reducedMotion={reducedMotion} />
      <Haze reducedMotion={reducedMotion} />
      <Dust reducedMotion={reducedMotion} />
      <Crowd pulseAt={pulseAt} reducedMotion={reducedMotion} />
      <Confetti reducedMotion={reducedMotion} />
      <Rig reducedMotion={reducedMotion} />
    </>
  )
}

export function EventosHall3D({
  stage = "trivias",
  reducedMotion = false,
}: {
  stage?: EventosStage
  reducedMotion?: boolean
}) {
  /** Con la pestaña en segundo plano no hay nada que dibujar. */
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const sync = () => setVisible(!document.hidden)
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [])

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 3.9, 16], fov: 46 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion || !visible ? "demand" : "always"}
      onCreated={({ gl }) => gl.setClearColor(DEEP, 1)}
    >
      <Scene stage={stage} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

export default EventosHall3D
