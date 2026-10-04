"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Sprout,
  Compass,
  Palette,
  Layers,
  Flower2,
  Package,
  TrendingUp,
  BookOpen,
} from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { Magnetic } from "@/components/layout/magnetic"

const easePremium = [0.22, 1, 0.36, 1] as const

/**
 * Paletas de cielo: el scroll no sólo hace crecer la planta, también amanece.
 * De noche cerrada (semilla) a hora dorada plena (flor).
 */
type SkyKey = { t: number; top: number; mid: number; low: number; hor: number }
const SKY_KEYS: SkyKey[] = [
  { t: 0.0, top: 0x0a0918, mid: 0x231c3a, low: 0x4a2f47, hor: 0x6d3b34 },
  { t: 0.4, top: 0x161d40, mid: 0x4a3159, low: 0x9a5150, hor: 0xd0713f },
  { t: 0.75, top: 0x2b3a6d, mid: 0x835668, low: 0xd88a55, hor: 0xffb066 },
  { t: 1.0, top: 0x3d5892, mid: 0xbb8672, low: 0xf4ae70, hor: 0xffd79a },
]

function skyPaletteAt(t: number) {
  let a = SKY_KEYS[0]
  let b = SKY_KEYS[SKY_KEYS.length - 1]
  for (let i = 0; i < SKY_KEYS.length - 1; i++) {
    if (t >= SKY_KEYS[i].t && t <= SKY_KEYS[i + 1].t) {
      a = SKY_KEYS[i]
      b = SKY_KEYS[i + 1]
      break
    }
  }
  const k = a.t === b.t ? 0 : (t - a.t) / (b.t - a.t)
  return { a, b, k }
}

function makeRadialTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 64
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(0.35, "rgba(255,235,200,0.7)")
  g.addColorStop(1, "rgba(255,210,150,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.minFilter = THREE.LinearFilter
  return t
}

/** Banda horizontal suave para la niebla del valle. */
function makeHazeTexture() {
  const c = document.createElement("canvas")
  c.width = 256
  c.height = 64
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  const g = ctx.createLinearGradient(0, 0, 0, 64)
  g.addColorStop(0, "rgba(255,255,255,0)")
  g.addColorStop(0.5, "rgba(255,255,255,0.85)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 64)
  ctx.globalCompositeOperation = "destination-out"
  const gx = ctx.createLinearGradient(0, 0, 256, 0)
  gx.addColorStop(0, "rgba(0,0,0,1)")
  gx.addColorStop(0.5, "rgba(0,0,0,0)")
  gx.addColorStop(1, "rgba(0,0,0,1)")
  ctx.fillStyle = gx
  ctx.fillRect(0, 0, 256, 64)
  const t = new THREE.CanvasTexture(c)
  t.minFilter = THREE.LinearFilter
  return t
}

/** Tierra con manchas: un suelo de color plano se lee como plástico. */
function makeGroundTexture() {
  const S = 256
  const c = document.createElement("canvas")
  c.width = c.height = S
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  ctx.fillStyle = "#4a3f26"
  ctx.fillRect(0, 0, S, S)
  const tints = ["#5d5230", "#3a3018", "#6b5a36", "#2f2a15", "#55492a"]
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * S
    const y = Math.random() * S
    const r = 2 + Math.random() * 14
    ctx.fillStyle = tints[(Math.random() * tints.length) | 0]
    ctx.globalAlpha = 0.12 + Math.random() * 0.3
    // Se dibuja en las nueve posiciones para que la textura repita sin costura.
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        ctx.beginPath()
        ctx.arc(x + ox * S, y + oy * S, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  ctx.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Silueta de ave en vuelo (dos alas curvas). */
function makeBirdTexture() {
  const W = 64
  const H = 32
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 3.5
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(6, 22)
  ctx.quadraticCurveTo(18, 6, 32, 17)
  ctx.quadraticCurveTo(46, 6, 58, 22)
  ctx.stroke()
  const t = new THREE.CanvasTexture(c)
  t.minFilter = THREE.LinearFilter
  return t
}

/** Ala de mariposa: lóbulo grande arriba, chico abajo. */
function makeWingTexture() {
  const S = 128
  const c = document.createElement("canvas")
  c.width = c.height = S
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.ellipse(S * 0.44, S * 0.34, S * 0.4, S * 0.3, -0.35, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(S * 0.36, S * 0.72, S * 0.27, S * 0.22, 0.25, 0, Math.PI * 2)
  ctx.fill()
  const t = new THREE.CanvasTexture(c)
  t.minFilter = THREE.LinearFilter
  return t
}

/** Nube suave: varias manchas difusas superpuestas. */
function makeCloudTexture() {
  const W = 256
  const H = 128
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  for (let i = 0; i < 22; i++) {
    const x = 30 + Math.random() * (W - 60)
    const y = H * 0.45 + (Math.random() - 0.5) * H * 0.4
    const r = 16 + Math.random() * 40
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, "rgba(255,255,255,0.5)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.minFilter = THREE.LinearFilter
  return t
}

/** Hoja lanceolada: largo en +X, ancho en Z, grosor en Y, con caída y cuenco. */
function makeLeafGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.3, 0.3, 0.74, 0.34, 1.18, 0)
  s.bezierCurveTo(0.74, -0.34, 0.3, -0.3, 0, 0)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.015,
    bevelEnabled: true,
    bevelSize: 0.022,
    bevelThickness: 0.012,
    bevelSegments: 1,
    curveSegments: 18,
  })
  geo.rotateX(-Math.PI / 2)
  const p = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const z = p.getZ(i)
    p.setY(i, p.getY(i) - x * x * 0.2 + z * z * 0.55) // cae en la punta, se ahueca
  }
  p.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/** Geometría de pétalo con forma real (gota curvada) que apunta hacia +Z. */
function makePetalGeometry(curl: number) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.44, 0.13, 0.62, 0.64, 0, 1)
  s.bezierCurveTo(-0.62, 0.64, -0.44, 0.13, 0, 0)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.03,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.02,
    bevelSegments: 2,
    curveSegments: 14,
  })
  geo.rotateX(Math.PI / 2) // el largo del pétalo pasa a +Z, el grosor a Y
  // Curvatura: el pétalo se arquea hacia arriba en la punta.
  const p = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i)
    p.setY(i, p.getY(i) + z * z * curl)
  }
  p.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/**
 * Pinta el pétalo de la base a la punta con tres paradas de color. Un pétalo
 * de color plano es lo que delata que la flor es geometría y no una flor.
 */
function tintPetalGeometry(geo: THREE.BufferGeometry, base: number, mid: number, tip: number) {
  const p = geo.attributes.position as THREE.BufferAttribute
  // Si la geometría ya trae sombreado por vértice (venas del modelo de
  // Blender), el degradado se multiplica por encima en vez de pisarlo.
  const shadeAttr = geo.attributes.color as THREE.BufferAttribute | undefined
  const colors = new Float32Array(p.count * 3)
  const cBase = new THREE.Color(base)
  const cMid = new THREE.Color(mid)
  const cTip = new THREE.Color(tip)
  const c = new THREE.Color()
  let maxZ = 0.001
  let maxX = 0.001
  for (let i = 0; i < p.count; i++) {
    maxZ = Math.max(maxZ, p.getZ(i))
    maxX = Math.max(maxX, Math.abs(p.getX(i)))
  }
  for (let i = 0; i < p.count; i++) {
    const t = Math.max(0, Math.min(1, p.getZ(i) / maxZ))
    const SPLIT = 0.62
    if (t < SPLIT) c.copy(cBase).lerp(cMid, t / SPLIT)
    else c.copy(cMid).lerp(cTip, (t - SPLIT) / (1 - SPLIT))
    // Los bordes laterales caen un punto: le da el ahuecado que tiene un
    // pétalo real y deja la nervadura central como la zona más clara.
    const edge = Math.abs(p.getX(i)) / maxX
    c.multiplyScalar(1 - edge * edge * 0.26)
    if (shadeAttr) c.multiplyScalar(shadeAttr.getX(i))
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
}

/** Escena de crecimiento: noche → amanecer, semilla → tallo → hojas → flor. */
function GrowthScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    try {
      const t = document.createElement("canvas")
      if (!t.getContext("webgl") && !t.getContext("experimental-webgl")) return
    } catch {
      return
    }

    const isMobile = window.innerWidth < 768

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x2a1f18, 0.0085)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 400)
    camera.position.set(0, 1.4, 9)

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 1.85))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.02
    // Sólo la planta proyecta sombra: el pase de sombras queda barato y el
    // suelo gana el apoyo que delata que la planta está parada ahí.
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    let composer: EffectComposer | null = null
    let bloomPass: UnrealBloomPass | null = null
    if (!isMobile) {
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.75, 0.6)
      composer.addPass(bloomPass)
      composer.addPass(new OutputPass())
    }

    const radialTex = makeRadialTexture()
    const hazeTex = makeHazeTexture()
    const disposables: { dispose: () => void }[] = [radialTex, hazeTex]

    // -----------------------------------------------------------------
    // CIELO: cúpula con gradiente por vértices que repintamos al scrollear
    // -----------------------------------------------------------------
    const skyGeo = new THREE.SphereGeometry(180, 40, 28)
    const skyColors = new Float32Array(skyGeo.attributes.position.count * 3)
    skyGeo.setAttribute("color", new THREE.BufferAttribute(skyColors, 3))
    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    })
    const sky = new THREE.Mesh(skyGeo, skyMat)
    sky.renderOrder = -10
    scene.add(sky)
    disposables.push(skyMat)

    const cGround = new THREE.Color()
    const cHor = new THREE.Color()
    const cLow = new THREE.Color()
    const cMid = new THREE.Color()
    const cTop = new THREE.Color()
    const cTmp = new THREE.Color()
    const cAux = new THREE.Color()
    const smooth = (a: number, b: number, x: number) => {
      const u = Math.max(0, Math.min(1, (x - a) / (b - a)))
      return u * u * (3 - 2 * u)
    }

    const paintSky = (t: number) => {
      const { a, b, k } = skyPaletteAt(t)
      cHor.setHex(a.hor).lerp(cAux.setHex(b.hor), k)
      cLow.setHex(a.low).lerp(cAux.setHex(b.low), k)
      cMid.setHex(a.mid).lerp(cAux.setHex(b.mid), k)
      cTop.setHex(a.top).lerp(cAux.setHex(b.top), k)
      cGround.copy(cHor).multiplyScalar(0.28)

      const pos = skyGeo.attributes.position as THREE.BufferAttribute
      const col = skyGeo.attributes.color as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getY(i) / 360 + 0.5
        cTmp.copy(cGround).lerp(cHor, smooth(0.3, 0.475, u))
        cTmp.lerp(cLow, smooth(0.475, 0.565, u))
        cTmp.lerp(cMid, smooth(0.565, 0.71, u))
        cTmp.lerp(cTop, smooth(0.71, 0.93, u))
        col.setXYZ(i, cTmp.r, cTmp.g, cTmp.b)
      }
      col.needsUpdate = true
      if (scene.fog) (scene.fog as THREE.FogExp2).color.copy(cHor).multiplyScalar(0.55)
    }
    paintSky(0)

    // --- Estrellas (se apagan al amanecer) ---
    const starCount = isMobile ? 320 : 750
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(Math.random() * 0.92 + 0.06)
      const r = 150
      starPos[i * 3] = Math.sin(ph) * Math.cos(th) * r
      starPos[i * 3 + 1] = Math.abs(Math.cos(ph)) * r * 0.85 + 6
      starPos[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 1.5,
      map: radialTex,
      color: 0xdfe6ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)
    disposables.push(starGeo, starMat)

    // -----------------------------------------------------------------
    // LUCES (de luna fría a sol cálido)
    // -----------------------------------------------------------------
    const ambient = new THREE.AmbientLight(0x2a3352, 0.5)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0x9fb4ff, 0.5)
    key.position.set(-6, 6, 4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.left = -8
    key.shadow.camera.right = 8
    key.shadow.camera.top = 12
    key.shadow.camera.bottom = -4
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 60
    key.shadow.bias = -0.0007
    key.shadow.normalBias = 0.02
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff9a5a, 0.3)
    rim.position.set(4, 4, -6)
    scene.add(rim)
    const bounce = new THREE.HemisphereLight(0xffd9a0, 0x1a1208, 0.35)
    scene.add(bounce)
    // -----------------------------------------------------------------
    // TERRENO
    // -----------------------------------------------------------------
    // Relieve suave compartido: pasto, flores y árboles se apoyan en la misma
    // función, así nada queda flotando ni enterrado.
    const GROUND_Y = -0.66
    const terrainH = (x: number, z: number) => {
      const r = Math.hypot(x, z)
      const flat = smooth(2.2, 10, r) // el pie de la planta queda a nivel
      const h =
        Math.sin(x * 0.055 + 0.4) * 0.5 +
        Math.sin(z * 0.047 - 1.1) * 0.42 +
        Math.sin((x + z) * 0.11 + 2.3) * 0.16 +
        Math.sin((x - z) * 0.021) * 0.7
      return h * flat
    }

    const groundTex = makeGroundTexture()
    groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping
    groundTex.repeat.set(34, 34)
    const landMat = new THREE.MeshStandardMaterial({ map: groundTex, color: 0x7a6242, roughness: 1 })
    const landGeo = new THREE.PlaneGeometry(420, 420, 110, 110)
    const landPos = landGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < landPos.count; i++) {
      // El plano nace en XY: tras rotarlo, su Z local es la altura del mundo.
      landPos.setZ(i, terrainH(landPos.getX(i), -landPos.getY(i)))
    }
    landPos.needsUpdate = true
    landGeo.computeVertexNormals()
    const land = new THREE.Mesh(landGeo, landMat)
    land.rotation.x = -Math.PI / 2
    land.position.y = GROUND_Y
    land.receiveShadow = true
    scene.add(land)

    const soilMat = new THREE.MeshStandardMaterial({ map: groundTex, color: 0x5a452c, roughness: 1 })
    const soilGeo = new THREE.SphereGeometry(1.15, 32, 16)
    const soil = new THREE.Mesh(soilGeo, soilMat)
    soil.scale.set(1, 0.5, 1)
    soil.position.y = GROUND_Y + 0.04
    soil.castShadow = true
    soil.receiveShadow = true
    scene.add(soil)
    disposables.push(groundTex, soilGeo, soilMat, landGeo, landMat)

    // --- Pasto instanciado: brizna curvada, en dos tonos, con viento ---
    const grassCount = isMobile ? 1600 : 5200
    const bladeGeo = new THREE.PlaneGeometry(0.085, 1, 1, 6)
    bladeGeo.translate(0, 0.5, 0)
    const bladePos = bladeGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < bladePos.count; i++) {
      const y = bladePos.getY(i)
      bladePos.setX(i, bladePos.getX(i) * (1 - 0.82 * y * y)) // punta afilada
      bladePos.setZ(i, bladePos.getZ(i) + y * y * 0.22) // arco natural
    }
    bladePos.needsUpdate = true
    bladeGeo.computeVertexNormals()

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x8a9a52,
      roughness: 1,
      side: THREE.DoubleSide,
    })
    const windUniform = { value: 0 }
    grassMat.onBeforeCompile = (shader: { uniforms: Record<string, unknown>; vertexShader: string }) => {
      shader.uniforms.uTime = windUniform
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;")
        .replace(
          "#include <begin_vertex>",
          [
            "#include <begin_vertex>",
            "float phase = instanceMatrix[3][0] * 0.6 + instanceMatrix[3][2] * 0.45;",
            "float gust = 0.6 + 0.4 * sin(uTime * 0.35 + instanceMatrix[3][0] * 0.05);",
            "float sway = (sin(uTime * 1.6 + phase) * 0.11 + sin(uTime * 0.64 + phase * 1.9) * 0.07) * gust;",
            "transformed.x += sway * transformed.y * transformed.y;",
            "transformed.z += sway * 0.4 * transformed.y * transformed.y;",
          ].join("\n")
        )
    }
    const grass = new THREE.InstancedMesh(bladeGeo, grassMat, grassCount)
    grass.frustumCulled = false
    grass.receiveShadow = true
    const dummy = new THREE.Object3D()
    const gc = new THREE.Color()
    for (let i = 0; i < grassCount; i++) {
      const ang = Math.random() * Math.PI * 2
      const rad = 1.1 + Math.pow(Math.random(), 1.8) * 46
      const x = Math.cos(ang) * rad
      const z = Math.sin(ang) * rad
      dummy.position.set(x, GROUND_Y + terrainH(x, z) - 0.02, z)
      dummy.rotation.set((Math.random() - 0.5) * 0.3, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4)
      const h = 0.3 + Math.random() * 0.62 + (rad > 18 ? 0.4 : 0)
      dummy.scale.set(0.7 + Math.random() * 0.9, h, 1)
      dummy.updateMatrix()
      grass.setMatrixAt(i, dummy.matrix)
      // Mezcla de verdes y pajizos: el pasto de un solo tono se ve sintético.
      const dry = Math.random() < 0.28
      const v = 0.7 + Math.random() * 0.55
      if (dry) gc.setRGB(0.62 * v, 0.5 * v, 0.24 * v)
      else gc.setRGB(0.32 * v, 0.5 * v, 0.2 * v)
      grass.setColorAt(i, gc)
    }
    grass.instanceMatrix.needsUpdate = true
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true
    scene.add(grass)
    disposables.push(bladeGeo, grassMat)

    // --- Florcitas del campo: aparecen cuando entra la luz ---
    const wfCount = isMobile ? 120 : 320
    const wfGeo = new THREE.PlaneGeometry(0.13, 0.13)
    const wfMat = new THREE.MeshStandardMaterial({
      map: radialTex,
      transparent: true,
      opacity: 0,
      roughness: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const wildflowers = new THREE.InstancedMesh(wfGeo, wfMat, wfCount)
    wildflowers.frustumCulled = false
    const wfTint = [0xfff0b8, 0xffd9e2, 0xfff6e0, 0xe8d0ff]
    for (let i = 0; i < wfCount; i++) {
      const ang = Math.random() * Math.PI * 2
      const rad = 1.6 + Math.pow(Math.random(), 1.6) * 26
      const x = Math.cos(ang) * rad
      const z = Math.sin(ang) * rad
      dummy.position.set(x, GROUND_Y + terrainH(x, z) + 0.18 + Math.random() * 0.3, z)
      dummy.rotation.set(0, Math.random() * Math.PI, 0)
      dummy.scale.setScalar(0.7 + Math.random() * 0.8)
      dummy.updateMatrix()
      wildflowers.setMatrixAt(i, dummy.matrix)
      gc.setHex(wfTint[i % wfTint.length])
      wildflowers.setColorAt(i, gc)
    }
    wildflowers.instanceMatrix.needsUpdate = true
    if (wildflowers.instanceColor) wildflowers.instanceColor.needsUpdate = true
    scene.add(wildflowers)
    disposables.push(wfGeo, wfMat)

    // --- Arboleda: modelos low-poly hechos en Blender (public/models/trees.glb) ---
    // Copa redonda, álamo, algarrobo y arbusto, con color por vértice. Con
    // volumen real reciben la luz de contorno del sol en vez de ser recortes.
    const treeMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      fog: true,
    })
    treeMat.onBeforeCompile = (shader: { uniforms: Record<string, unknown>; vertexShader: string }) => {
      shader.uniforms.uTime = windUniform
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;")
        .replace(
          "#include <begin_vertex>",
          [
            "#include <begin_vertex>",
            // El tronco queda firme: sólo se mece lo que está arriba de la base.
            "float tPhase = instanceMatrix[3][0] * 0.3 + instanceMatrix[3][2] * 0.2;",
            "float tBend = max(transformed.y - 0.35, 0.0);",
            "float tSway = sin(uTime * 0.9 + tPhase) * 0.035 + sin(uTime * 2.3 + tPhase * 1.7) * 0.012;",
            "transformed.x += tSway * tBend * tBend;",
            "transformed.z += tSway * 0.5 * tBend * tBend;",
          ].join("\n")
        )
    }
    disposables.push(treeMat)

    type TreeKind = "tree_round" | "tree_poplar" | "tree_carob" | "tree_bush"
    type TreeSpot = { x: number; z: number; s: number; tilt: number }
    const treeSpots: Record<TreeKind, TreeSpot[]> = {
      tree_round: [],
      tree_poplar: [],
      tree_carob: [],
      tree_bush: [],
    }
    const k = isMobile ? 0.5 : 1
    // Arboleda lejana: mezcla de copas redondas y algarrobos sobre el valle.
    for (let i = 0; i < Math.round(38 * k); i++) {
      const x = (Math.random() - 0.5) * 150
      const z = -18 - Math.random() * 26
      const kind = Math.random() < 0.68 ? "tree_round" : "tree_carob"
      treeSpots[kind].push({ x, z, s: 1.6 + Math.random() * 2.8, tilt: 0.05 })
    }
    // Hileras de álamos: el cortaviento típico de las fincas cuyanas.
    const rows = [
      { x0: -62, x1: -22, z: -30 },
      { x0: 18, x1: 70, z: -36 },
    ]
    rows.forEach((row) => {
      const n = Math.round(((row.x1 - row.x0) / 2.2) * k)
      for (let i = 0; i < n; i++) {
        const x = row.x0 + ((row.x1 - row.x0) * i) / n + (Math.random() - 0.5) * 0.6
        const z = row.z + (Math.random() - 0.5) * 0.8
        treeSpots.tree_poplar.push({ x, z, s: 2.6 + Math.random() * 0.9, tilt: 0.03 })
      }
    })
    // Plano medio a los costados: con el paralaje de la cámara se nota el volumen.
    for (let i = 0; i < Math.round(10 * k); i++) {
      const side = i % 2 ? 1 : -1
      const x = side * (14 + Math.random() * 16)
      const z = -11 - Math.random() * 8
      treeSpots[Math.random() < 0.6 ? "tree_round" : "tree_carob"].push({
        x,
        z,
        s: 1.1 + Math.random() * 0.7,
        tilt: 0.06,
      })
    }
    // Arbustos: lejos de la cámara y semihundidos entre el pasto; adelante
    // y enteros se leían como almohadones.
    for (let i = 0; i < Math.round(26 * k); i++) {
      const ang = Math.random() * Math.PI * 2
      const rad = 13 + Math.random() * 26
      const x = Math.cos(ang) * rad
      const z = -Math.abs(Math.sin(ang) * rad) - 6
      if (Math.abs(x) < 5 && z > -12) continue // que no tape la planta
      treeSpots.tree_bush.push({ x, z, s: 0.9 + Math.random() * 1.1, tilt: 0.1 })
    }

    let disposed = false
    const treeMeshes: THREE.InstancedMesh[] = []
    new GLTFLoader().load(
      "/models/trees.glb",
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose())
          return
        }
        ;(Object.keys(treeSpots) as TreeKind[]).forEach((kind) => {
          const src = gltf.scene.getObjectByName(kind) as THREE.Mesh | undefined
          const spots = treeSpots[kind]
          if (!src || !spots.length) return
          const mesh = new THREE.InstancedMesh(src.geometry, treeMat, spots.length)
          mesh.frustumCulled = false
          const sink = kind === "tree_bush" ? 0.18 : 0.08
          spots.forEach((p, i) => {
            dummy.position.set(p.x, GROUND_Y + terrainH(p.x, p.z) - sink * p.s, p.z)
            dummy.rotation.set(
              (Math.random() - 0.5) * p.tilt,
              Math.random() * Math.PI * 2,
              (Math.random() - 0.5) * p.tilt
            )
            dummy.scale.setScalar(p.s)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
            // Cada ejemplar con su tono: una arboleda clonada se ve de juguete.
            const v = (kind === "tree_bush" ? 0.55 : 0.8) + Math.random() * 0.3
            mesh.setColorAt(i, gc.setRGB(v, v * (0.95 + Math.random() * 0.1), v * 0.9))
          })
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
          mesh.instanceMatrix.needsUpdate = true
          scene.add(mesh)
          treeMeshes.push(mesh)
          disposables.push(src.geometry)
        })
      },
      undefined,
      () => {
        // Sin modelos el valle queda abierto: mejor eso que romper la escena.
      }
    )

    // -----------------------------------------------------------------
    // SOL: nace detrás de las montañas y sube con el scroll
    // -----------------------------------------------------------------
    const SUN_X = -11
    const SUN_Z = -95
    const sunGlowMat = new THREE.SpriteMaterial({
      map: radialTex,
      color: 0xffcf8a,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
    const sunGlow = new THREE.Sprite(sunGlowMat)
    sunGlow.scale.set(20, 20, 1)
    scene.add(sunGlow)

    const sunHaloMat = new THREE.SpriteMaterial({
      map: radialTex,
      color: 0xff9f5c,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
    const sunHalo = new THREE.Sprite(sunHaloMat)
    sunHalo.scale.set(70, 70, 1)
    scene.add(sunHalo)

    const sunBodyMat = new THREE.MeshBasicMaterial({
      color: 0xffe6bc,
      fog: false,
      transparent: true,
      opacity: 0.95,
    })
    const sunBodyGeo = new THREE.CircleGeometry(2.4, 48)
    const sunBody = new THREE.Mesh(sunBodyGeo, sunBodyMat)
    scene.add(sunBody)
    disposables.push(sunGlowMat, sunHaloMat, sunBodyMat, sunBodyGeo)

    // -----------------------------------------------------------------
    // MONTAÑAS: tres capas que reciben la luz del amanecer
    // -----------------------------------------------------------------
    const ridgeNoise = (x: number, s: number) => {
      const v =
        (Math.sin(x * 0.045 + s) * 0.5 + 0.5) * 0.6 +
        (Math.sin(x * 0.12 + s * 1.7) * 0.5 + 0.5) * 0.3 +
        (Math.sin(x * 0.3 + s) * 0.5 + 0.5) * 0.1
      return Math.max(0, Math.min(1, v))
    }
    type Ridge = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; base: THREE.Color; lift: number }
    const ridges: Ridge[] = []
    const makeRidge = (
      W: number,
      segs: number,
      z: number,
      baseY: number,
      peak: number,
      color: number,
      seed: number,
      lift: number
    ) => {
      const H = peak + 12
      const geo = new THREE.PlaneGeometry(W, H, segs, 1)
      const p = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        if (p.getY(i) > 0) p.setY(i, baseY + 0.3 + ridgeNoise(p.getX(i), seed) * peak)
        else p.setY(i, baseY - 12)
      }
      p.needsUpdate = true
      const mat = new THREE.MeshBasicMaterial({ color, fog: true })
      const m = new THREE.Mesh(geo, mat)
      m.position.set(0, 0, z)
      scene.add(m)
      ridges.push({ mesh: m, mat, base: new THREE.Color(color), lift })
      disposables.push(geo, mat)
    }
    makeRidge(320, 110, -86, -1.0, 7.0, 0x5c4433, 4.1, 1.0)
    makeRidge(240, 100, -62, -1.2, 5.0, 0x35261a, 1.3, 0.55)
    makeRidge(190, 100, -42, -1.4, 3.4, 0x181008, 8.7, 0.25)

    // --- Cordillera y rocas modeladas en Blender (public/models/landscape.glb) ---
    // La capa del fondo pasa a ser una cordillera con relieve y nieve en las
    // cumbres (con un portezuelo donde nace el sol). El color por vértice trae
    // roca, nieve y sombreado de laderas; el tinte del amanecer sigue en `ridges`.
    const rockMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      flatShading: true,
    })
    disposables.push(rockMat)
    type RockSpot = { x: number; z: number; s: number }
    const rockSpots: RockSpot[][] = [[], [], []]
    // Un par de piedras al pie de la planta: la apoyan en el suelo.
    rockSpots[0].push({ x: -1.35, z: 0.55, s: 0.32 })
    rockSpots[1].push({ x: 1.25, z: 0.35, s: 0.24 })
    rockSpots[2].push({ x: 0.55, z: 1.25, s: 0.18 })
    for (let i = 0; i < Math.round(30 * k); i++) {
      const x = (Math.random() - 0.5) * 44
      const z = 4 - Math.random() * 26
      if (Math.hypot(x, z) < 3.2) continue
      // Más chicas cerca de la cámara, para que no tapen el texto.
      const s = (0.25 + Math.random() * 0.75) * (z > 0 ? 0.6 : 1)
      rockSpots[i % 3].push({ x, z, s })
    }
    const rockMeshes: THREE.InstancedMesh[] = []
    new GLTFLoader().load(
      "/models/landscape.glb",
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose())
          return
        }
        const range = gltf.scene.getObjectByName("range_far") as THREE.Mesh | undefined
        const far = ridges[0]
        if (range && far) {
          far.mesh.geometry = range.geometry
          far.mat.vertexColors = true
          far.mat.needsUpdate = true
          far.base.setHex(0xa08e86)
          disposables.push(range.geometry)
        }
        rockSpots.forEach((spots, r) => {
          const src = gltf.scene.getObjectByName(`rock_${r}`) as THREE.Mesh | undefined
          if (!src || !spots.length) return
          const mesh = new THREE.InstancedMesh(src.geometry, rockMat, spots.length)
          mesh.frustumCulled = false
          mesh.receiveShadow = true
          spots.forEach((p, i) => {
            dummy.position.set(p.x, GROUND_Y + terrainH(p.x, p.z) - 0.25 * p.s, p.z)
            dummy.rotation.set(0, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.3)
            dummy.scale.setScalar(p.s)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
          })
          mesh.instanceMatrix.needsUpdate = true
          scene.add(mesh)
          rockMeshes.push(mesh)
          disposables.push(src.geometry)
        })
      },
      undefined,
      () => {}
    )

    // --- Niebla de valle en capas ---
    type Haze = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; speed: number }
    const hazes: Haze[] = []
    const hazeDefs = [
      { z: -78, y: 1.2, w: 300, h: 16, o: 0.16, c: 0xffc79a, s: 0.35 },
      { z: -58, y: 0.2, w: 220, h: 12, o: 0.2, c: 0xffb489, s: -0.5 },
      { z: -34, y: -0.35, w: 160, h: 9, o: 0.22, c: 0xe8a882, s: 0.75 },
    ]
    hazeDefs.forEach((d) => {
      const mat = new THREE.MeshBasicMaterial({
        map: hazeTex,
        color: d.c,
        transparent: true,
        opacity: d.o,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      })
      const geo = new THREE.PlaneGeometry(d.w, d.h)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, d.y, d.z)
      mesh.renderOrder = 2
      scene.add(mesh)
      hazes.push({ mesh, mat, speed: d.s })
      disposables.push(mat, geo)
    })

    // --- Rayos de sol: el gesto más cinematográfico del amanecer ---
    // Van en un grupo que mira siempre a la cámara, así los rayos quedan
    // siempre en el plano de pantalla y no se ven de canto.
    const rayGroup = new THREE.Group()
    const rayMats: THREE.MeshBasicMaterial[] = []
    const RAY_LEN = 88
    const rayGeo = new THREE.PlaneGeometry(RAY_LEN, 3.2)
    rayGeo.translate(RAY_LEN / 2, 0, 0)
    const rayCount = isMobile ? 7 : 13
    for (let i = 0; i < rayCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: hazeTex,
        color: 0xffd9a0,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      })
      const ray = new THREE.Mesh(rayGeo, mat)
      // En abanico hacia arriba: los que apuntan al suelo quedan tapados por
      // las montañas y sólo aportarían costo de dibujo.
      ray.rotation.z = Math.PI * (0.12 + (i / (rayCount - 1)) * 0.76) + (Math.random() - 0.5) * 0.12
      ray.scale.y = 0.14 + Math.random() * 0.7
      ray.renderOrder = 3
      rayGroup.add(ray)
      rayMats.push(mat)
      disposables.push(mat)
    }
    rayGroup.renderOrder = 3
    scene.add(rayGroup)
    disposables.push(rayGeo)

    // --- Bandada: cruza el valle cuando entra la luz ---
    const birdTex = makeBirdTexture()
    type Bird = { sprite: THREE.Sprite; mat: THREE.SpriteMaterial; ox: number; oy: number; sp: number; ph: number }
    const birds: Bird[] = []
    const birdCount = isMobile ? 7 : 12
    for (let i = 0; i < birdCount; i++) {
      const mat = new THREE.SpriteMaterial({
        map: birdTex,
        color: 0x2a1c14,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,
      })
      const sprite = new THREE.Sprite(mat)
      // Formación en V suelta.
      const rank = Math.floor(i / 2)
      const side = i % 2 === 0 ? 1 : -1
      birds.push({
        sprite,
        mat,
        ox: -rank * 2.6 + (Math.random() - 0.5) * 1.2,
        oy: rank * 0.85 * side + (Math.random() - 0.5) * 0.6,
        sp: 1,
        ph: Math.random() * Math.PI * 2,
      })
      scene.add(sprite)
      disposables.push(mat)
    }
    disposables.push(birdTex)

    // --- Nubes: toman el color del cielo y le dan techo a la escena ---
    const cloudTex = makeCloudTexture()
    type Cloud = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; x: number; speed: number }
    const clouds: Cloud[] = []
    const cloudCount = isMobile ? 6 : 11
    for (let i = 0; i < cloudCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        fog: false,
      })
      const w = 34 + Math.random() * 48
      const geo = new THREE.PlaneGeometry(w, w * (0.32 + Math.random() * 0.16))
      const mesh = new THREE.Mesh(geo, mat)
      const x = (Math.random() - 0.5) * 190
      mesh.position.set(x, 5 + Math.random() * 17, -70 - Math.random() * 60)
      mesh.renderOrder = 1
      scene.add(mesh)
      clouds.push({ mesh, mat, x, speed: 0.5 + Math.random() * 1.4 })
      disposables.push(mat, geo)
    }
    disposables.push(cloudTex)

    // -----------------------------------------------------------------
    // PLANTA
    // -----------------------------------------------------------------
    const seedMat = new THREE.MeshStandardMaterial({ color: 0x6b4a25, roughness: 0.6, metalness: 0.1 })
    const seedGeo = new THREE.SphereGeometry(0.14, 16, 12)
    const seed = new THREE.Mesh(seedGeo, seedMat)
    seed.scale.set(1, 1.3, 1)
    seed.position.y = 0.1
    scene.add(seed)

    // La semilla brilla: es lo único vivo en la oscuridad inicial.
    const seedGlowMat = new THREE.SpriteMaterial({
      map: radialTex,
      color: 0xffd08a,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
    const seedGlow = new THREE.Sprite(seedGlowMat)
    seedGlow.scale.set(2.6, 2.6, 1)
    seedGlow.position.set(0, 0.12, 0)
    scene.add(seedGlow)

    const MAX_H = 5.4

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x6f8f3e, roughness: 0.75 })
    const stemGeo = new THREE.CylinderGeometry(0.042, 0.1, 1, 14)
    stemGeo.translate(0, 0.5, 0)
    const stem = new THREE.Mesh(stemGeo, stemMat)
    stem.scale.y = 0.001
    stem.castShadow = true
    scene.add(stem)

    const NECK_SEG = 6
    const neckGeo = new THREE.CylinderGeometry(0.036, 0.045, 1, 10)
    neckGeo.translate(0, 0.5, 0)
    const neckRoot = new THREE.Group()
    const neckJoints: { joint: THREE.Group; seg: THREE.Mesh }[] = []
    let neckParent: THREE.Group = neckRoot
    for (let i = 0; i < NECK_SEG; i++) {
      const joint = new THREE.Group()
      const seg = new THREE.Mesh(neckGeo, stemMat)
      seg.castShadow = true
      joint.add(seg)
      neckParent.add(joint)
      neckJoints.push({ joint, seg })
      neckParent = joint
    }
    const neckTip = new THREE.Group()
    neckParent.add(neckTip)
    scene.add(neckRoot)
    disposables.push(neckGeo)

    // Hojas con forma de hoja y repartidas en espiral (filotaxis), no en
    // parejas simétricas: es lo que distingue una planta de un adorno.
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x74973f,
      roughness: 0.62,
      side: THREE.DoubleSide,
    })
    const leafGeo = makeLeafGeometry()
    type Leaf = { pivot: THREE.Group; at: number; ang: number; size: number }
    const leaves: Leaf[] = []
    const leafMeshes: THREE.Mesh[] = []
    const leafAts = [0.16, 0.29, 0.42, 0.54, 0.66, 0.76]
    leafAts.forEach((at, i) => {
      const pivot = new THREE.Group()
      pivot.rotation.y = i * 2.399 // ángulo áureo
      const mesh = new THREE.Mesh(leafGeo, leafMat)
      mesh.castShadow = true
      leafMeshes.push(mesh)
      pivot.add(mesh)
      pivot.scale.setScalar(0.001)
      scene.add(pivot)
      leaves.push({ pivot, at, ang: i * 2.399, size: 1.15 - i * 0.09 })
    })
    disposables.push(seedGeo, seedMat, seedGlowMat, stemGeo, stemMat, leafGeo, leafMat)

    // --- Flor ---
    // El escalado de aparición lo maneja flowerRig, más abajo.
    const flower = new THREE.Group()

    // Corazón: disco de semillas en espiral áurea, como una margarita real.
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7d420f,
      emissive: new THREE.Color(0x8a4a08),
      emissiveIntensity: 0.35,
      roughness: 0.78,
    })
    const coreGeo = new THREE.SphereGeometry(0.42, 26, 20)
    const core = new THREE.Mesh(coreGeo, coreMat)
    core.scale.y = 0.42
    core.position.y = 0.03
    flower.add(core)

    const seedMat2 = new THREE.MeshStandardMaterial({
      color: 0xffd77a,
      emissive: new THREE.Color(0xff9c1f),
      emissiveIntensity: 0.5,
      roughness: 0.5,
    })
    // Instanciado: 90 esferitas sueltas serían 90 llamadas de dibujo.
    const seedDotGeo = new THREE.SphereGeometry(0.028, 8, 6)
    const SEEDS = 120
    const seedHead = new THREE.InstancedMesh(seedDotGeo, seedMat2, SEEDS)
    const seedDummy = new THREE.Object3D()
    for (let i = 0; i < SEEDS; i++) {
      const f = i / SEEDS
      const rr = 0.42 * Math.sqrt(f)
      const a = i * 2.39996 // ángulo áureo
      seedDummy.position.set(Math.cos(a) * rr, 0.13 - rr * rr * 0.5, Math.sin(a) * rr)
      seedDummy.scale.setScalar(0.7 + f * 0.6)
      seedDummy.updateMatrix()
      seedHead.setMatrixAt(i, seedDummy.matrix)
    }
    seedHead.instanceMatrix.needsUpdate = true
    flower.add(seedHead)

    const stamenMat = new THREE.MeshStandardMaterial({
      color: 0xffe080,
      emissive: new THREE.Color(0xffaa00),
      emissiveIntensity: 1.0,
      roughness: 0.4,
    })
    // Los estambres sólo asoman cuando la flor ya está abierta: dentro del
    // capullo cerrado se leerían como púas.
    const stamens = new THREE.Group()
    stamens.scale.setScalar(0.001)
    const stamenGeo = new THREE.CylinderGeometry(0.012, 0.016, 0.3, 6)
    const tipGeo = new THREE.SphereGeometry(0.03, 8, 6)
    for (let si = 0; si < 20; si++) {
      const a = (si / 20) * Math.PI * 2
      const r = 0.38
      const k = 0.82 + ((Math.sin(si * 9.13) * 43758.5453) % 1 + 1) % 1 * 0.36
      const stamen = new THREE.Mesh(stamenGeo, stamenMat)
      stamen.position.set(Math.cos(a) * r, 0.15, Math.sin(a) * r)
      stamen.rotation.set(Math.cos(a) * 0.42, 0, -Math.sin(a) * 0.42)
      stamen.scale.y = k
      stamens.add(stamen)
      const tip = new THREE.Mesh(tipGeo, stamenMat)
      tip.position.set(Math.cos(a) * r * 1.28, 0.16 + 0.13 * k, Math.sin(a) * r * 1.28)
      tip.scale.setScalar(0.8 + k * 0.3)
      stamens.add(tip)
    }
    flower.add(stamens)

    // Tres coronas de pétalos con degradado propio: el color plano de un solo
    // material es lo que hacía que la flor pareciera de plástico.
    const petalGeos = [makePetalGeometry(0.16), makePetalGeometry(0.24), makePetalGeometry(0.34)]
    tintPetalGeometry(petalGeos[0], 0x7d1140, 0xdb2b78, 0xff8cbe)
    tintPetalGeometry(petalGeos[1], 0x6b0b34, 0xcb1e6b, 0xfa6ea8)
    tintPetalGeometry(petalGeos[2], 0x55071f, 0xa81050, 0xe74d8f)
    const petalMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      emissive: new THREE.Color(0x8c0f42),
      emissiveIntensity: 0.16,
      roughness: 0.46,
      side: THREE.DoubleSide,
    })
    // El envés de un pétalo es más mate y desaturado que la cara. Con
    // DoubleSide y un solo material la única forma de distinguirlos es acá.
    petalMat.onBeforeCompile = (shader: { fragmentShader: string }) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         if (!gl_FrontFacing) {
           float g = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(g), 0.28) * 0.82;
         }`
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <lights_fragment_end>",
        `#include <lights_fragment_end>
         float petalFres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.6);
         reflectedLight.indirectDiffuse += diffuseColor.rgb * petalFres * 0.85;`
      )
    }

    // Hash determinista: mismo pétalo, mismo desvío, frame a frame.
    const hash = (n: number) => {
      const x = Math.sin(n * 12.9898) * 43758.5453
      return x - Math.floor(x)
    }
    type PetalData = { pivot: THREE.Group; ring: number; idx: number; openJit: number; sway: number }
    const petals: PetalData[] = []
    const petalMeshes: THREE.Mesh[][] = [[], [], []]
    const RINGS = [
      { n: 16, geo: 0, scale: [0.82, 0.5, 1.24] as const, open: 0.42, delay: 0.0 },
      { n: 13, geo: 1, scale: [0.68, 0.46, 0.94] as const, open: 0.28, delay: 0.05 },
      { n: 10, geo: 2, scale: [0.5, 0.42, 0.64] as const, open: 0.1, delay: 0.1 },
    ]
    RINGS.forEach((ring, r) => {
      for (let i = 0; i < ring.n; i++) {
        const jA = hash(r * 31.7 + i * 7.13) - 0.5
        const jB = hash(r * 53.1 + i * 3.77 + 11) - 0.5
        const jC = hash(r * 91.3 + i * 5.41 + 23) - 0.5
        const pivot = new THREE.Group()
        // Reparto desparejo alrededor del eje: ningún pétalo cae en su marca exacta.
        pivot.rotation.y = ((i + r * 0.4) / ring.n) * Math.PI * 2 + jA * 0.16
        const petal = new THREE.Mesh(petalGeos[ring.geo], petalMat)
        petal.scale.set(
          ring.scale[0] * (1 + jB * 0.18),
          ring.scale[1],
          ring.scale[2] * (1 + jC * 0.22)
        )
        // Torsión sobre el eje largo: un pétalo plano se ve troquelado.
        petal.rotation.z = jA * 0.3
        petalMeshes[ring.geo].push(petal)
        pivot.add(petal)
        flower.add(pivot)
        petals.push({ pivot, ring: r, idx: i, openJit: jC * 0.16, sway: 0.8 + hash(i + r * 17) * 0.6 })
      }
    })

    // Receptáculo: el bulbo donde el tallo entra en la cabeza. Sin él, la
    // punta del tallo termina en el aire y la flor se lee como pegada encima.
    const recepMat = new THREE.MeshStandardMaterial({ color: 0x5a7a2a, roughness: 0.72 })
    const recepGeo = new THREE.SphereGeometry(0.3, 18, 12)
    const receptacle = new THREE.Mesh(recepGeo, recepMat)
    receptacle.scale.set(1, 0.72, 1)
    receptacle.position.y = -0.1
    receptacle.castShadow = true
    flower.add(receptacle)

    // Sépalos verdes: sostienen la flor por debajo y le dan volumen real.
    const sepalMat = new THREE.MeshStandardMaterial({
      color: 0x49681f,
      roughness: 0.7,
      side: THREE.DoubleSide,
    })
    const sepalGeo = makePetalGeometry(0.1)
    const sepals = new THREE.Group()
    for (let i = 0; i < 7; i++) {
      const pivot = new THREE.Group()
      pivot.rotation.y = (i / 7) * Math.PI * 2
      pivot.rotation.x = 1.15
      const sp = new THREE.Mesh(sepalGeo, sepalMat)
      sp.scale.set(0.4, 0.42, 0.68)
      pivot.add(sp)
      sepals.add(pivot)
    }
    sepals.position.y = -0.05
    flower.add(sepals)

    const flowerGlowMat = new THREE.SpriteMaterial({
      map: radialTex,
      color: 0xff8ec2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })
    const flowerGlow = new THREE.Sprite(flowerGlowMat)
    flowerGlow.scale.set(7, 7, 1)
    flower.add(flowerGlow)
    // Rig aparte para inclinar la cabeza hacia la cámara sin frenar el giro
    // de los pétalos: una flor vista de canto se lee como una raya.
    const flowerRig = new THREE.Group()
    flowerRig.add(flower)
    // Sólo los pétalos proyectan sombra: el resto de la flor no cambia la
    // silueta y sí multiplicaría el costo del pase de sombras.
    petals.forEach((p) => {
      p.pivot.children.forEach((m: THREE.Object3D) => {
        m.castShadow = true
      })
    })
    neckTip.add(flowerRig)
    disposables.push(
      coreGeo,
      coreMat,
      seedDotGeo,
      seedMat2,
      stamenGeo,
      tipGeo,
      stamenMat,
      petalGeos[0],
      petalGeos[1],
      petalGeos[2],
      petalMat,
      sepalGeo,
      sepalMat,
      recepGeo,
      recepMat,
      flowerGlowMat
    )

    // Pétalos y hojas modelados en Blender (public/models/flower.glb): superficie
    // fina con nervadura, cuenco, borde ondulado y venas en el color por vértice.
    // Llegan después; hasta entonces (o si fallan) quedan las piezas extruidas.
    const PETAL_TINTS = [
      [0x7d1140, 0xdb2b78, 0xff8cbe],
      [0x6b0b34, 0xcb1e6b, 0xfa6ea8],
      [0x55071f, 0xa81050, 0xe74d8f],
    ] as const
    new GLTFLoader().load(
      "/models/flower.glb",
      (gltf) => {
        const geoOf = (name: string) =>
          (gltf.scene.getObjectByName(name) as THREE.Mesh | undefined)?.geometry
        if (disposed) {
          gltf.scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose())
          return
        }
        petalMeshes.forEach((meshes, r) => {
          const geo = geoOf(`petal_${r}`)
          if (!geo) return
          const [base, mid, tip] = PETAL_TINTS[r]
          tintPetalGeometry(geo, base, mid, tip)
          meshes.forEach((m) => (m.geometry = geo))
          disposables.push(geo)
        })
        const leafModel = geoOf("leaf")
        if (leafModel) {
          leafMeshes.forEach((m) => (m.geometry = leafModel))
          leafMat.vertexColors = true
          leafMat.needsUpdate = true
          disposables.push(leafModel)
        }
      },
      undefined,
      () => {}
    )

    // --- Mariposas: llegan cuando la flor se abre ---
    const wingTex = makeWingTexture()
    type Butterfly = {
      group: THREE.Group
      wings: THREE.Mesh[]
      mats: THREE.MeshBasicMaterial[]
      r: number
      a: number
      sp: number
      y: number
      ph: number
    }
    const butterflies: Butterfly[] = []
    const wingGeo = new THREE.PlaneGeometry(0.34, 0.34)
    wingGeo.translate(0.17, 0, 0) // bisagra en el borde interno del ala
    const bfTints = [0xffb45e, 0xff8fb8, 0xffe08a]
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group()
      const wings: THREE.Mesh[] = []
      const mats: THREE.MeshBasicMaterial[] = []
      for (let s = 0; s < 2; s++) {
        const mat = new THREE.MeshBasicMaterial({
          map: wingTex,
          color: bfTints[i],
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
          fog: false,
        })
        const w = new THREE.Mesh(wingGeo, mat)
        w.scale.x = s === 0 ? 1 : -1
        group.add(w)
        wings.push(w)
        mats.push(mat)
        disposables.push(mat)
      }
      scene.add(group)
      butterflies.push({
        group,
        wings,
        mats,
        r: 1.5 + Math.random() * 1.6,
        a: Math.random() * Math.PI * 2,
        sp: 0.35 + Math.random() * 0.3,
        y: (Math.random() - 0.5) * 1.1,
        ph: Math.random() * Math.PI * 2,
      })
    }
    disposables.push(wingGeo, wingTex)

    // -----------------------------------------------------------------
    // PARTÍCULAS
    // -----------------------------------------------------------------
    const pCount = isMobile ? 110 : 260
    const pPos = new Float32Array(pCount * 3)
    const pBase = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const x = (Math.random() - 0.5) * 16
      const y = Math.random() * 9
      const z = (Math.random() - 0.5) * 12 - 1
      pBase[i * 3] = x
      pBase[i * 3 + 1] = y
      pBase[i * 3 + 2] = z
      pPos[i * 3] = x
      pPos[i * 3 + 1] = y
      pPos[i * 3 + 2] = z
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3))
    const pollenMat = new THREE.PointsMaterial({
      size: 0.11,
      map: radialTex,
      color: 0xffd9a0,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(pGeo, pollenMat))
    disposables.push(pGeo, pollenMat)

    // Luciérnagas: orbitan la flor desde que aparece el capullo
    const fCount = isMobile ? 34 : 70
    const fPos = new Float32Array(fCount * 3)
    const fData: { r: number; a: number; sp: number; y: number; bob: number }[] = []
    for (let i = 0; i < fCount; i++) {
      fData.push({
        r: 1.3 + Math.random() * 3.4,
        a: Math.random() * Math.PI * 2,
        sp: (0.18 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1),
        y: (Math.random() - 0.5) * 2.6,
        bob: Math.random() * Math.PI * 2,
      })
    }
    const fGeo = new THREE.BufferGeometry()
    fGeo.setAttribute("position", new THREE.BufferAttribute(fPos, 3))
    const fireflyMat = new THREE.PointsMaterial({
      size: 0.22,
      map: radialTex,
      color: 0xfff0b0,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(fGeo, fireflyMat))
    disposables.push(fGeo, fireflyMat)

    // Pétalos que caen en el clímax
    const dCount = isMobile ? 26 : 60
    const dPos = new Float32Array(dCount * 3)
    const dData: { x: number; y: number; z: number; vy: number; ph: number }[] = []
    for (let i = 0; i < dCount; i++) {
      dData.push({
        x: (Math.random() - 0.5) * 7,
        y: Math.random() * 7,
        z: (Math.random() - 0.5) * 6,
        vy: 0.25 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
      })
    }
    const dGeo = new THREE.BufferGeometry()
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3))
    const petalDustMat = new THREE.PointsMaterial({
      size: 0.2,
      map: radialTex,
      color: 0xffb8d8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(dGeo, petalDustMat))
    disposables.push(dGeo, petalDustMat)

    // -----------------------------------------------------------------
    // BUCLE
    // -----------------------------------------------------------------
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    const clock = new THREE.Clock()
    const lookTarget = new THREE.Vector3(0, 0.4, 0)
    const camLook = new THREE.Vector3(0, 0.4, 0)
    let raf = 0
    let lastTime = 0
    let growth = 0
    let paintedAt = -1
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    const moonKey = new THREE.Color(0x9fb4ff)
    const sunKey = new THREE.Color(0xffdcae)
    const ambNight = new THREE.Color(0x2a3352)
    const ambDay = new THREE.Color(0x6a5a4a)
    const ridgeWarm = new THREE.Color(0xffa46a)
    const tmpCol = new THREE.Color()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (document.hidden) {
        lastTime = clock.getElapsedTime()
        return
      }
      const time = clock.getElapsedTime()
      const dt = Math.min(time - lastTime, 0.05)
      lastTime = time
      windUniform.value = time

      // El 100% de crecimiento llega en el CTA, no en el footer: si no,
      // la floración quedaría tapada por el pie de página.
      const target = Math.min(1, window.scrollY / (maxScroll() * 0.78))
      growth += (target - growth) * Math.min(1, dt * 4.2) // independiente del frame rate

      // --- Amanecer ---
      if (Math.abs(growth - paintedAt) > 0.004) {
        paintSky(growth)
        paintedAt = growth
      }
      const day = smooth(0.05, 0.85, growth)
      const sunY = -3.5 + growth * 17
      sunGlow.position.set(SUN_X, sunY, SUN_Z)
      sunHalo.position.set(SUN_X, sunY, SUN_Z)
      sunBody.position.set(SUN_X, sunY, SUN_Z + 0.5)
      sunGlowMat.opacity = 0.22 + day * 0.34
      sunHaloMat.opacity = 0.05 + day * 0.09
      sunBodyMat.opacity = 0.25 + day * 0.45
      sunGlow.scale.setScalar(16 + day * 10)
      sunHalo.scale.setScalar(52 + day * 18)
      starMat.opacity = 0.9 * (1 - smooth(0.02, 0.42, growth))
      stars.rotation.y = time * 0.004

      key.color.copy(moonKey).lerp(sunKey, day)
      key.intensity = 0.5 + day * 1.5
      key.position.set(SUN_X * 0.5, 2 + day * 8, -6 + day * 10)
      ambient.color.copy(ambNight).lerp(ambDay, day)
      ambient.intensity = 0.45 + day * 0.25
      rim.intensity = 0.25 + day * 0.5
      bounce.intensity = 0.25 + day * 0.5
      if (bloomPass) bloomPass.strength = 0.44 - day * 0.12

      ridges.forEach((r) => {
        tmpCol.copy(r.base).lerp(ridgeWarm, day * 0.55 * r.lift)
        r.mat.color.copy(tmpCol).multiplyScalar(0.45 + day * 0.75)
      })
      // Estos colores multiplican la textura del suelo, por eso van altos.
      landMat.color.setRGB(0.16 + day * 0.62, 0.14 + day * 0.52, 0.1 + day * 0.34)
      soilMat.color.setRGB(0.14 + day * 0.5, 0.12 + day * 0.42, 0.09 + day * 0.28)
      grassMat.color.setRGB(0.16 + day * 0.72, 0.2 + day * 0.78, 0.1 + day * 0.38)
      wfMat.opacity = smooth(0.18, 0.62, growth) * 0.9
      // De noche casi silueta; con el sol aparece el verde de las copas.
      treeMat.color.setRGB(0.22 + day * 0.85, 0.2 + day * 0.8, 0.2 + day * 0.62)
      rockMat.color.setRGB(0.16 + day * 0.5, 0.15 + day * 0.46, 0.15 + day * 0.4)
      // Con el sol alto el aire se limpia: así la cordillera y la flor no se
      // pierden en la bruma justo en el cierre.
      if (scene.fog) (scene.fog as THREE.FogExp2).density = 0.0085 - day * 0.0035
      // Grado de exposición: la noche respira más oscura que la mañana.
      renderer.toneMappingExposure = 0.88 + day * 0.26

      // Rayos: máximos cuando el sol raspa el horizonte, se apagan de día.
      const rayPeak = smooth(0.12, 0.42, growth) * (1 - smooth(0.72, 1.0, growth) * 0.72)
      rayGroup.position.set(SUN_X, sunY, SUN_Z)
      rayGroup.lookAt(camera.position)

      rayMats.forEach((m, i) => {
        m.opacity = rayPeak * (0.07 + 0.06 * Math.sin(time * 0.5 + i * 1.7))
        m.color.copy(cHor).lerp(cLow, 0.4).multiplyScalar(1.6)
      })
      rayGroup.children.forEach((r: THREE.Object3D, i: number) => {
        r.rotation.z += dt * (0.01 + (i % 3) * 0.004)
      })

      // Bandada: entra en diagonal y cruza el valle.
      const flock = smooth(0.3, 0.55, growth) * (1 - smooth(0.9, 1.0, growth))
      const flockX = ((time * 2.4) % 150) - 75
      birds.forEach((b, i) => {
        b.sprite.position.set(flockX + b.ox, 11 + b.oy + Math.sin(time * 0.5 + b.ph) * 0.5, -46)
        const flap = 0.55 + 0.45 * Math.abs(Math.sin(time * 5.5 + b.ph))
        b.sprite.scale.set(1.5, 1.5 * flap, 1)
        b.mat.opacity = flock * 0.85
        b.mat.color.copy(cHor).multiplyScalar(0.22)
      })

      clouds.forEach((cl, i) => {
        cl.mesh.position.x = cl.x + Math.sin(time * 0.012 * cl.speed + i) * 22
        cl.mat.color.copy(cHor).lerp(cLow, 0.35).multiplyScalar(0.55 + day * 1.15)
        cl.mat.opacity = 0.3 + day * 0.35
      })

      hazes.forEach((h, i) => {
        h.mesh.position.x = Math.sin(time * 0.05 * h.speed + i) * 14
        h.mat.opacity = (0.1 + day * 0.22) * (i === 0 ? 1.2 : 1)
      })

      // --- Tallo ---
      const stemTop = growth * MAX_H
      const bud = smooth(0.55, 0.84, growth)
      const bloom = smooth(0.8, 1.0, growth)
      // El tramo de arriba lo toma el cuello curvo, así que el tallo recto
      // termina antes; el receptáculo tapa la unión.
      const neckLen = 1.05 * bud
      const stemLen = Math.max(0.001, stemTop - neckLen)
      stem.scale.y = stemLen
      const sway = Math.sin(time * 0.8) * 0.022 + Math.sin(time * 0.31) * 0.012
      stem.rotation.z = sway
      // Dónde queda realmente la punta del tallo al balancearse. Rotar +Z lleva
      // el eje +Y hacia -X: usar +sway acá era lo que despegaba la flor.
      const tipX = -Math.sin(sway) * stemLen
      const tipY = Math.cos(sway) * stemLen

      // --- Semilla ---
      const germ = smooth(0.0, 0.12, growth)
      seed.scale.set(1 - germ, (1 - germ) * 1.3, 1 - germ)
      seedGlowMat.opacity = (1 - germ) * (0.55 + Math.sin(time * 2.1) * 0.18)
      seedGlow.scale.setScalar(2.4 + Math.sin(time * 1.7) * 0.35)

      // --- Hojas ---
      leaves.forEach((lf, i) => {
        const grow = smooth(lf.at - 0.02, lf.at + 0.14, growth)
        const y = lf.at * stemTop
        lf.pivot.position.set(-Math.sin(sway) * y, Math.cos(sway) * y, 0)
        lf.pivot.scale.setScalar(Math.max(0.001, grow * lf.size * (0.55 + stemTop * 0.13)))
        // El viento levanta y baja cada hoja con su propia fase.
        lf.pivot.rotation.y = lf.ang + Math.sin(time * 0.6 + i) * 0.06
        lf.pivot.rotation.z = 0.42 + Math.sin(time * 1.15 + i * 1.7) * 0.09
      })
      leafMat.color.setRGB(0.16 + day * 0.34, 0.3 + day * 0.36, 0.1 + day * 0.14)
      stemMat.color.setRGB(0.16 + day * 0.3, 0.3 + day * 0.32, 0.1 + day * 0.12)

      // --- Flor ---
      const nod = Math.sin(time * 0.7) * 0.05 * bud
      // --- Cuello ---
      // La inclinación total se reparte entre los segmentos: el tallo se arquea
      // en vez de quebrarse en un solo punto.
      const segLen = neckLen / NECK_SEG
      const headTilt = nod + bloom * 1.05
      neckRoot.position.set(tipX, tipY, 0)
      neckRoot.rotation.z = sway
      neckJoints.forEach(({ joint, seg }, i) => {
        joint.position.y = i === 0 ? 0 : segLen
        // Más curva arriba que abajo, como un tallo que carga el peso de la flor.
        joint.rotation.x = (headTilt / NECK_SEG) * (0.55 + (i / (NECK_SEG - 1)) * 0.9)
        joint.rotation.z = i === 0 ? 0 : Math.sin(time * 0.9 + i * 0.5) * 0.012
        seg.scale.set(1, Math.max(0.001, segLen), 1)
      })
      neckTip.position.y = segLen

      flowerRig.position.set(0, 0, 0)
      flowerRig.scale.setScalar(Math.max(0.001, bud * 1.6))
      flowerRig.rotation.set(0, 0, 0)
      flower.rotation.y = time * 0.12
      // Se abre de adentro hacia afuera y con leve desfase entre pétalos.
      petals.forEach((p) => {
        const ring = RINGS[p.ring]
        const from = 0.74 + ring.delay + p.idx * 0.006
        const b = smooth(from, from + 0.2, growth)
        p.pivot.rotation.x = -Math.PI * 0.5 + b * (Math.PI * 0.5 + ring.open + p.openJit)
        p.pivot.rotation.z = Math.sin(time * 0.95 * p.sway + p.idx * 0.7 + p.ring) * 0.05 * b
      })
      stamens.scale.setScalar(Math.max(0.001, smooth(0.86, 1.0, growth)))
      seedHead.rotation.y = time * 0.05
      coreMat.emissiveIntensity = 0.3 + bloom * 1.1
      seedMat2.emissiveIntensity = 0.4 + bloom * 1.6
      flowerGlowMat.opacity = bloom * 0.55
      flowerGlow.scale.setScalar(5.5 + bloom * 5.5 + Math.sin(time * 1.3) * 0.5)

      // --- Polen ---
      for (let i = 0; i < pCount; i++) {
        const idx = i * 3
        pBase[idx] += Math.sin(time * 0.3 + i) * 0.003
        pBase[idx + 1] += dt * (0.12 + (i % 5) * 0.03)
        if (pBase[idx + 1] > 9.5) pBase[idx + 1] = 0
        pPos[idx] = pBase[idx]
        pPos[idx + 1] = pBase[idx + 1]
        pPos[idx + 2] = pBase[idx + 2]
      }
      pGeo.attributes.position.needsUpdate = true
      pollenMat.opacity = 0.25 + day * 0.3

      // --- Luciérnagas ---
      if (bud > 0.01) {
        for (let i = 0; i < fCount; i++) {
          const f = fData[i]
          f.a += dt * f.sp
          fPos[i * 3] = Math.cos(f.a) * f.r
          fPos[i * 3 + 1] = stemTop + f.y + Math.sin(time * 1.4 + f.bob) * 0.35
          fPos[i * 3 + 2] = Math.sin(f.a) * f.r
        }
        fGeo.attributes.position.needsUpdate = true
      }
      fireflyMat.opacity = bud * (0.55 + Math.sin(time * 2.4) * 0.15)

      // --- Mariposas ---
      const bfIn = smooth(0.86, 1.0, growth)
      butterflies.forEach((bf) => {
        bf.a += dt * bf.sp
        const bx = Math.cos(bf.a) * bf.r
        const bz = Math.sin(bf.a) * bf.r
        bf.group.position.set(bx, stemTop + bf.y + Math.sin(time * 1.9 + bf.ph) * 0.32, bz)
        bf.group.rotation.y = -bf.a + Math.PI / 2
        const flap = Math.sin(time * 9 + bf.ph) * 0.85
        bf.wings[0].rotation.y = flap
        bf.wings[1].rotation.y = -flap
        bf.mats[0].opacity = bfIn * 0.95
        bf.mats[1].opacity = bfIn * 0.95
      })

      // --- Pétalos que caen ---
      if (bloom > 0.01) {
        for (let i = 0; i < dCount; i++) {
          const d = dData[i]
          d.y -= dt * d.vy
          if (d.y < -0.6) d.y = stemTop + 1.5 + Math.random() * 2
          dPos[i * 3] = d.x + Math.sin(time * 0.9 + d.ph) * 0.5
          dPos[i * 3 + 1] = d.y
          dPos[i * 3 + 2] = d.z + Math.cos(time * 0.7 + d.ph) * 0.4
        }
        dGeo.attributes.position.needsUpdate = true
      }
      petalDustMat.opacity = bloom * 0.65

      // --- Cámara: sigue el crecimiento y orbita suave al florecer ---
      // En pantallas angostas las tarjetas ocupan el centro: subimos el punto
      // de mira para que la planta quede por debajo de ellas.
      const framingLift = isMobile ? 0.9 : 0
      const focusY = 1.1 + framingLift + stemTop * (growth < 0.85 ? 0.82 : 0.9)
      const camY = 1.15 + stemTop * 0.58 + bloom * 0.9
      const orbit = Math.sin(time * 0.09) * 2.6 * bloom
      // Retrocede mientras crece y hace un push-in al florecer.
      const camZ = 8.6 + growth * 1.9 - bloom * 2.3
      // Flotación tipo cámara en mano: capas de seno con periodos primos para
      // que nunca se repita el mismo ciclo.
      const floatX = Math.sin(time * 0.37) * 0.09 + Math.sin(time * 0.13) * 0.06
      const floatY = Math.sin(time * 0.29) * 0.07 + Math.sin(time * 0.11) * 0.05
      camera.position.x += (mouseX * 0.9 + orbit + floatX - camera.position.x) * 0.04
      camera.position.y += (camY - mouseY * 0.55 + floatY - camera.position.y) * 0.06
      camera.position.z += (camZ - camera.position.z) * 0.05
      lookTarget.set(0, focusY, 0)
      camLook.lerp(lookTarget, 0.07)
      camera.lookAt(camLook)
      camera.rotation.z += Math.sin(time * 0.21) * 0.006 + bloom * 0.012
      // Un pelo de dolly-zoom en el clímax.
      const targetFov = 50 - bloom * 3.5
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov += (targetFov - camera.fov) * 0.05
        camera.updateProjectionMatrix()
      }

      if (composer) composer.render()
      else renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer?.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
      disposed = true
      treeMeshes.forEach((m) => m.dispose())
      rockMeshes.forEach((m) => m.dispose())
      if (mount && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
      disposables.forEach((d) => d.dispose())
      skyGeo.dispose()
      grass.dispose()
      composer?.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
}

/* =================================================================== */
/*  CONTENIDO                                                          */
/* =================================================================== */

type Etapa = {
  icon: typeof Sprout
  eyebrow: string
  title: string
  body: string
  tags?: readonly string[]
}

const etapas: readonly Etapa[] = [
  {
    icon: Sprout,
    eyebrow: "La semilla",
    title: "Todo empieza por la esencia",
    body: "Antes del logo está la raíz: para qué existís, a quién le hablás y qué te hace distinto. Esa es la semilla de tu marca.",
    tags: ["Propósito", "Audiencia", "Diferencial"],
  },
  {
    icon: Compass,
    eyebrow: "Las raíces",
    title: "Estrategia & naming",
    body: "Definimos posicionamiento, territorio y nombre. Las raíces que sostienen todo lo que se ve.",
    tags: ["Posicionamiento", "Naming", "Tono de voz"],
  },
  {
    icon: Palette,
    eyebrow: "El tallo",
    title: "Sistema visual",
    body: "Logotipo, paleta, tipografías y grilla: un sistema coherente que crece firme, no una pieza suelta.",
    tags: ["Logotipo", "Paleta", "Tipografía"],
  },
  {
    icon: Layers,
    eyebrow: "Las hojas",
    title: "Aplicaciones",
    body: "La marca se despliega en cada punto de contacto: redes, papelería, packaging, web. Crece hacia la luz.",
    tags: ["Redes", "Packaging", "Papelería"],
  },
  {
    icon: BookOpen,
    eyebrow: "El proceso",
    title: "Cuatro semanas de inmersión",
    body: "Diagnóstico, conceptualización, diseño y refinamiento: etapas claras con feedback real en cada paso. Sin sorpresas al final.",
    tags: ["4 semanas", "Feedback por etapa"],
  },
  {
    icon: Package,
    eyebrow: "Todo incluido",
    title: "Tu kit completo de marca",
    body: "Logotipo en todos sus formatos, paleta cromática, tipografías, elementos gráficos y manual de uso. Todo lo que necesitás para crecer consistente.",
    tags: ["Archivos editables", "Manual de uso"],
  },
  {
    icon: TrendingUp,
    eyebrow: "La cosecha",
    title: "Una marca que trabaja sola",
    body: "Una identidad sólida reduce el costo de adquisición, mejora el reconocimiento y hace que cada pieza nueva sea más fácil y rápida de crear.",
  },
  {
    icon: Flower2,
    eyebrow: "La flor",
    title: "Tu marca florece",
    body: "Manual de marca y una identidad reconocible que da frutos: la cosecha de todo el proceso.",
  },
] as const

/** Una etapa: card con parallax propio y número fantasma. */
function EtapaSection({
  etapa,
  index,
  reduce,
  onEnter,
}: {
  etapa: Etapa
  index: number
  reduce: boolean
  onEnter: (i: number) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [70, -70])
  const glow = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0, 1, 0])
  const right = index % 2 === 0
  const Icon = etapa.icon

  return (
    <section
      ref={ref}
      id={`etapa-${index}`}
      className="relative scroll-mt-24 px-6 py-36 lg:px-12 lg:py-52"
      onMouseEnter={() => onEnter(index)}
    >
      <motion.div
        className={right ? "ml-auto max-w-[500px]" : "mr-auto max-w-[500px]"}
        style={reduce ? undefined : { y }}
        initial={reduce ? false : { opacity: 0, y: 60, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10%", amount: 0.3 }}
        transition={{ duration: 1, ease: easePremium }}
        onViewportEnter={() => onEnter(index)}
      >
        <div className="group relative">
          {/* Halo que respira al pasar la etapa */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(255,210,122,0.16),transparent)] blur-2xl"
            style={reduce ? undefined : { opacity: glow }}
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#170f09]/60 p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-500 group-hover:border-[#ffd27a]/35 md:p-11">
            {/* Número fantasma: entero dentro de la tarjeta, el overflow
                oculto lo recortaba a media cifra. */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-6 top-4 select-none font-display text-[4.5rem] leading-none text-white/[0.07] md:text-[6rem]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* Filo superior con gradiente */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd27a]/45 to-transparent"
            />

            <span className="inline-flex rounded-xl border border-[#ffd27a]/25 bg-[#ffd27a]/10 p-3 text-[#ffd9a0] shadow-[0_0_30px_-8px_rgba(255,210,122,0.6)]">
              <Icon className="size-6" aria-hidden />
            </span>
            <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#9ccb5f]/90">
              {etapa.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight md:text-[2.6rem]">
              {etapa.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">{etapa.body}</p>
            {etapa.tags && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {etapa.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/65"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

const HERO_LINE_1 = ["Sembramos", "tu", "marca"]
/** Cada palabra lleva su color: el degradado no sobrevive al transform de la animación. */
const HERO_LINE_2: readonly { w: string; c: string }[] = [
  { w: "y", c: "#9ccb5f" },
  { w: "la", c: "#cfc36c" },
  { w: "vemos", c: "#ffd27a" },
  { w: "florecer", c: "#f2a4c8" },
]

export function IdentidadMarcaClient() {
  const reduceRaw = useReducedMotion()
  const reduce = !!reduceRaw
  const { scrollYProgress } = useScroll()
  const barScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const waHref = getWhatsAppHref("Identidad de marca / Branding")
  const [active, setActive] = useState(0)

  const wordAnim = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: "1.05em" },
          animate: { opacity: 1, y: "0em" },
          transition: { duration: 1.15, delay, ease: easePremium },
        }

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: easePremium },
        }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0812] text-white">
      <GrowthScene />
      <Navigation />

      {/* Viñeta: enfoca la mirada y despega el texto del fondo 3D */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(120%_85%_at_50%_38%,transparent_35%,rgba(6,4,10,0.55)_100%)]"
      />
      {/* Marco fílmico: dos velos que enmarcan el plano y sostienen el texto */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-[#0a0812]/85 via-[#0a0812]/35 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] h-52 bg-gradient-to-t from-[#0a0812]/90 via-[#0a0812]/40 to-transparent"
      />

      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#5c8a36] via-[#ffd27a] to-[#f2a4c8] shadow-[0_0_12px_rgba(255,210,122,0.55)]"
          style={{ scaleX: barScaleX }}
        />
      )}

      {/* Riel de etapas (desktop) */}
      <nav
        aria-label="Etapas del proceso"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {etapas.map((e, i) => (
          <a
            key={e.eyebrow}
            href={`#etapa-${i}`}
            className="group flex items-center gap-3"
            aria-label={e.eyebrow}
            aria-current={active === i ? "true" : undefined}
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                active === i ? "text-[#ffd9a0] opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
              }`}
            >
              {e.eyebrow}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                active === i
                  ? "h-6 w-[3px] bg-[#ffd27a] shadow-[0_0_12px_rgba(255,210,122,0.8)]"
                  : "h-2 w-[3px] bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </a>
        ))}
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section className="relative flex min-h-[108svh] items-center px-6 pt-28 lg:px-12">
        <div className="relative z-10 w-full max-w-[720px]">
          <motion.div {...fadeUp(0)}>
            <Link
              href="/servicios/diseno-grafico"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[13px] text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Diseño gráfico
            </Link>
          </motion.div>

          <motion.p
            {...fadeUp(0.1)}
            className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[#ffd9a0]/90"
          >
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-[#ffd9a0]/70 to-transparent" />
            Servicio · Branding
          </motion.p>

          {/* Cada línea vive en su propia máscara: las palabras suben desde
              abajo del renglón, como en un título de película. */}
          <h1 className="mt-5 font-display text-[clamp(2.8rem,7.4vw,5.6rem)] font-semibold leading-[0.96] tracking-tight text-white drop-shadow-[0_4px_34px_rgba(0,0,0,0.75)]">
            <span className="block overflow-hidden pb-[0.06em]">
              {HERO_LINE_1.map((w, i) => (
                <motion.span
                  key={w}
                  className="mr-[0.24em] inline-block"
                  {...wordAnim(0.18 + i * 0.09)}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="mt-1 block overflow-hidden pb-[0.12em]">
              {HERO_LINE_2.map((word, i) => (
                <motion.span
                  key={word.w}
                  className="mr-[0.24em] inline-block"
                  style={{ color: word.c }}
                  {...wordAnim(0.42 + i * 0.09)}
                >
                  {word.w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            {...fadeUp(0.72)}
            className="mt-7 max-w-[560px] text-lg leading-relaxed text-white/85 drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] md:text-xl"
          >
            De una semilla —tu esencia— hacemos crecer una identidad coherente, reconocible y lista
            para dar frutos. Deslizá: el sol sale y la marca crece con vos.
          </motion.p>

          <motion.div {...fadeUp(0.84)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-full bg-[#ffd27a] px-7 text-base font-semibold text-[#1c140d] shadow-[0_10px_40px_-12px_rgba(255,210,122,0.85)] hover:bg-[#ffdf9a]"
              >
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-5" aria-hidden />
                  Sembrar mi marca
                </a>
              </Button>
            </Magnetic>
            <a
              href="#etapa-0"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-6 text-base text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
            >
              Ver el proceso
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </motion.div>

          <motion.dl {...fadeUp(0.94)} className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
            {[
              { k: "4 semanas", v: "de inmersión" },
              { k: "Kit completo", v: "archivos + manual" },
              { k: "San Juan", v: "y toda Argentina" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-xl text-[#ffd9a0]">{s.k}</dt>
                <dd className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{s.v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div {...fadeUp(1.04)} className="mt-12 flex items-center gap-3 text-sm text-white/55">
            <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-white/15">
              <motion.span
                className="absolute inset-x-0 top-0 block h-4 bg-gradient-to-b from-transparent to-[#9ccb5f]"
                animate={reduce ? undefined : { y: ["-100%", "260%"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            Deslizá para hacerla crecer
          </motion.div>
        </div>
      </section>

      {/* ---------------- Etapas ---------------- */}
      {etapas.map((e, i) => (
        <EtapaSection key={e.eyebrow} etapa={e} index={i} reduce={reduce} onEnter={setActive} />
      ))}

      {/* ---------------- CTA ---------------- */}
      <motion.section
        className="relative px-6 py-40 text-center lg:px-12"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%", amount: 0.25 }}
        transition={{ duration: 0.9, ease: easePremium }}
      >
        <div className="relative mx-auto max-w-2xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-12 -z-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(255,210,122,0.2),transparent)] blur-3xl"
          />
          <div className="overflow-hidden rounded-[2rem] border border-[#ffd27a]/25 bg-[#170f09]/70 p-10 backdrop-blur-xl md:p-14">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd27a]/60 to-transparent"
            />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#9ccb5f]/90">
              La cosecha
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">¿Sembramos la tuya?</h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
              Contanos tu proyecto y diseñamos una identidad con raíces, lista para florecer.
            </p>
            <div className="mt-9 flex justify-center">
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  className="h-12 gap-2 rounded-full bg-[#ffd27a] px-8 text-base font-semibold text-[#1c140d] shadow-[0_10px_40px_-12px_rgba(255,210,122,0.85)] hover:bg-[#ffdf9a]"
                >
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    <WhatsAppMark className="size-5" aria-hidden />
                    Hablar por WhatsApp
                    <ArrowRight className="size-4" aria-hidden />
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.section>

      <FooterSection />
    </main>
  )
}
