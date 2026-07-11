"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { ArrowLeft, ArrowRight, Sprout, Compass, Palette, Layers, Flower2, Package, TrendingUp, BookOpen } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Button } from "@/components/ui/button"
import { WhatsAppMark } from "@/components/icons/whatsapp-mark"
import { getWhatsAppHref } from "@/lib/whatsapp"
import { Magnetic } from "@/components/layout/magnetic"

const easePremium = [0.22, 1, 0.36, 1] as const

/** Piezas reales de marca que "florecen" al final. */
const BRAND_PIECES: { src: string; w: number; h: number }[] = [
  { src: "/diseno-portfolio/logofolio-1895_page-0003.jpg", w: 1.7, h: 2.3 },
  { src: "/MOCUP/carrusel_01.jpg", w: 1.8, h: 2.2 },
  { src: "/diseno-portfolio/logofolio-1895_page-0008.jpg", w: 1.7, h: 2.3 },
  { src: "/MOCUP/carrusel-difusores_09.jpg", w: 2.3, h: 1.85 },
  { src: "/MOCUP/carrusel-1080x1350_02.jpg", w: 1.8, h: 2.2 },
]

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

function makeBgTexture() {
  const c = document.createElement("canvas")
  c.width = 8
  c.height = 256
  const ctx = c.getContext("2d")
  if (!ctx) return new THREE.Texture()
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0, "#2e2b47") // arriba: dusk azul-violáceo
  g.addColorStop(0.4, "#5e4358") // malva
  g.addColorStop(0.66, "#a35f3f") // naranja cálido
  g.addColorStop(0.82, "#d99a55") // horizonte dorado (donde está el sol)
  g.addColorStop(1, "#3a2616") // base tierra
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 8, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Escena de crecimiento: semilla → tallo → hojas → flor, guiada por el scroll. */
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
    scene.background = makeBgTexture()
    scene.fog = new THREE.FogExp2(0x4a3526, 0.02)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 120)
    camera.position.set(0, 1.4, 9)

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 1.85))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    mount.appendChild(renderer.domElement)

    let composer: EffectComposer | null = null
    if (!isMobile) {
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.32, 0.7, 0.62)
      )
      composer.addPass(new OutputPass())
    }

    const radialTex = makeRadialTexture()

    // --- Luz cálida de estudio ---
    scene.add(new THREE.AmbientLight(0x6a5a50, 0.55))
    const key = new THREE.DirectionalLight(0xffe6c0, 1.5)
    key.position.set(-5, 9, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff9a5a, 0.55)
    rim.position.set(4, 4, -6)
    scene.add(rim)

    // --- Tierra (montículo) ---
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x29200f, roughness: 1 })
    const soil = new THREE.Mesh(new THREE.SphereGeometry(3.2, 40, 20), soilMat)
    soil.scale.set(1, 0.22, 1)
    soil.position.y = -0.62
    scene.add(soil)

    // --- Tierra que se extiende hasta el horizonte ---
    const land = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0x271c10, roughness: 1 })
    )
    land.rotation.x = -Math.PI / 2
    land.position.y = -0.66
    scene.add(land)

    // --- Sol cálido sobre el horizonte (detrás de las montañas) ---
    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialTex,
        color: 0xffe0a0,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      })
    )
    sunGlow.scale.set(24, 24, 1)
    sunGlow.position.set(-9, 6, -80)
    scene.add(sunGlow)
    const sunBody = new THREE.Mesh(
      new THREE.CircleGeometry(2.7, 48),
      new THREE.MeshBasicMaterial({ color: 0xffeac0, fog: false })
    )
    sunBody.position.set(-9, 6, -79.5)
    scene.add(sunBody)

    // --- Montañas en capas (siluetas con profundidad) ---
    const ridgeNoise = (x: number, s: number) => {
      const v =
        (Math.sin(x * 0.045 + s) * 0.5 + 0.5) * 0.6 +
        (Math.sin(x * 0.12 + s * 1.7) * 0.5 + 0.5) * 0.3 +
        (Math.sin(x * 0.3 + s) * 0.5 + 0.5) * 0.1
      return Math.max(0, Math.min(1, v))
    }
    const makeRidge = (W: number, segs: number, z: number, baseY: number, peak: number, color: number, seed: number) => {
      const H = peak + 8
      const geo = new THREE.PlaneGeometry(W, H, segs, 1)
      const p = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        if (p.getY(i) > 0) p.setY(i, baseY + 0.3 + ridgeNoise(p.getX(i), seed) * peak)
        else p.setY(i, baseY - 8)
      }
      p.needsUpdate = true
      geo.computeVertexNormals()
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, fog: true }))
      m.position.set(0, 0, z)
      scene.add(m)
    }
    makeRidge(220, 90, -74, -1.0, 5.2, 0x70513a, 4.1) // lejana (la niebla la aclara)
    makeRidge(180, 90, -56, -1.2, 4.2, 0x3c2b1e, 1.3) // media
    makeRidge(160, 90, -40, -1.4, 3.2, 0x1e150d, 8.7) // cercana (la más oscura)

    // --- Semilla ---
    const seedMat = new THREE.MeshStandardMaterial({ color: 0x6b4a25, roughness: 0.6, metalness: 0.1 })
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), seedMat)
    seed.scale.set(1, 1.3, 1)
    seed.position.y = 0.1
    scene.add(seed)

    const MAX_H = 5.4

    // --- Tallo (cilindro escalado en Y) ---
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4e7a32, roughness: 0.7 })
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.1, 1, 10)
    stemGeo.translate(0, 0.5, 0) // base en y=0
    const stem = new THREE.Mesh(stemGeo, stemMat)
    stem.scale.y = 0.001
    scene.add(stem)

    // --- Hojas (esferas aplanadas que aparecen al crecer) ---
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x5c8a36, roughness: 0.6, side: THREE.DoubleSide })
    const leafGeo = new THREE.SphereGeometry(0.5, 12, 8)
    type Leaf = { mesh: THREE.Mesh; at: number; side: number }
    const leaves: Leaf[] = []
    const leafAts = [0.22, 0.38, 0.54, 0.7]
    leafAts.forEach((at, i) => {
      const mesh = new THREE.Mesh(leafGeo, leafMat)
      const side = i % 2 === 0 ? 1 : -1
      mesh.scale.set(0.001, 0.001, 0.001)
      scene.add(mesh)
      leaves.push({ mesh, at, side })
    })

    // --- Flor (capullo que se abre radialmente al scrollear) ---
    // Cada pétalo está en (0,0,z) en espacio local del pivot; cuando pivot.rotation.x = -π/2
    // los pétalos apuntan hacia arriba (capullo cerrado). Al abrir a ~0.3rad quedan levemente
    // inclinados hacia afuera y abajo, como una flor real.
    const flower = new THREE.Group()
    flower.scale.setScalar(0.001)

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffcf6a,
      emissive: new THREE.Color(0xffb13a),
      emissiveIntensity: 0.6,
      roughness: 0.4,
    })
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.30, 20, 16), coreMat)
    flower.add(core)

    // Estambres dorados
    const stamenMat = new THREE.MeshStandardMaterial({
      color: 0xffe080,
      emissive: new THREE.Color(0xffaa00),
      emissiveIntensity: 1.0,
      roughness: 0.4,
    })
    for (let si = 0; si < 7; si++) {
      const a = (si / 7) * Math.PI * 2
      const stamen = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.35, 5), stamenMat)
      stamen.position.set(Math.cos(a) * 0.16, 0.18, Math.sin(a) * 0.16)
      flower.add(stamen)
    }

    const petalGeoBase = new THREE.SphereGeometry(0.5, 14, 10)

    // Pétalos exteriores: escala (ancho, grosor, largo) — el largo apunta en Z del pivot
    const outerPetalMat = new THREE.MeshStandardMaterial({
      color: 0xf0a0c5,
      emissive: new THREE.Color(0xb84080),
      emissiveIntensity: 0.22,
      roughness: 0.5,
      side: THREE.DoubleSide,
    })
    // Pétalos interiores: más pequeños, color más claro
    const innerPetalMat = new THREE.MeshStandardMaterial({
      color: 0xfcc8e0,
      emissive: new THREE.Color(0xe07ab8),
      emissiveIntensity: 0.3,
      roughness: 0.45,
      side: THREE.DoubleSide,
    })

    type PetalData = { pivot: THREE.Group; isInner: boolean; idx: number }
    const petals: PetalData[] = []
    const NUM_OUTER = 8
    const NUM_INNER = 8

    for (let i = 0; i < NUM_OUTER; i++) {
      const pivot = new THREE.Group()
      pivot.rotation.y = (i / NUM_OUTER) * Math.PI * 2
      const petal = new THREE.Mesh(petalGeoBase, outerPetalMat)
      // Petal shape: ancho en X, muy delgado en Y, largo en Z (dirección radial)
      petal.scale.set(0.36, 0.09, 0.88)
      petal.position.set(0, 0, 0.58)
      pivot.add(petal)
      flower.add(pivot)
      petals.push({ pivot, isInner: false, idx: i })
    }
    for (let i = 0; i < NUM_INNER; i++) {
      const pivot = new THREE.Group()
      pivot.rotation.y = ((i + 0.5) / NUM_INNER) * Math.PI * 2 // offset de ángulo
      const petal = new THREE.Mesh(petalGeoBase, innerPetalMat)
      petal.scale.set(0.22, 0.07, 0.56)
      petal.position.set(0, 0, 0.36)
      pivot.add(petal)
      flower.add(pivot)
      petals.push({ pivot, isInner: true, idx: i })
    }
    scene.add(flower)

    // --- Polen cálido (sutil) ---
    const pCount = isMobile ? 80 : 180
    const pPos = new Float32Array(pCount * 3)
    const pBase = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = Math.random() * 8
      const z = (Math.random() - 0.5) * 8 - 1
      pBase[i * 3] = x
      pBase[i * 3 + 1] = y
      pBase[i * 3 + 2] = z
      pPos[i * 3] = x
      pPos[i * 3 + 1] = y
      pPos[i * 3 + 2] = z
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3))
    const pollen = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.1,
        map: radialTex,
        color: 0xffd9a0,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    scene.add(pollen)

    // --- Carteles con piezas de marca: florecen al final ---
    const loader = new THREE.TextureLoader()
    type Panel = { group: THREE.Group; mat: THREE.MeshBasicMaterial; angle: number; radius: number }
    const panels: Panel[] = []
    BRAND_PIECES.forEach((piece, i) => {
      const group = new THREE.Group()
      const mat = new THREE.MeshBasicMaterial({ color: 0x2a2018, transparent: true, opacity: 0, toneMapped: true })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(piece.w, piece.h), mat)
      group.add(mesh)
      loader.load(
        piece.src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          mat.map = tex
          mat.color.set(0xffffff)
          mat.needsUpdate = true
        },
        undefined,
        () => {}
      )
      scene.add(group)
      panels.push({ group, mat, angle: (i / BRAND_PIECES.length) * Math.PI * 2, radius: 3.4 })
    })

    // --- Interacción ---
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("mousemove", onMouseMove)

    const clock = new THREE.Clock()
    const lookTarget = new THREE.Vector3(0, 0.4, 0)
    const camLook = new THREE.Vector3(0, 0.4, 0)
    let raf = 0
    let lastTime = 0
    let growth = 0
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const smooth = (a: number, b: number, t: number) => {
      const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
      return x * x * (3 - 2 * x)
    }

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (document.hidden) {
        lastTime = clock.getElapsedTime()
        return
      }
      const time = clock.getElapsedTime()
      const dt = Math.min(time - lastTime, 0.05)
      lastTime = time

      const target = Math.min(1, window.scrollY / maxScroll())
      growth += (target - growth) * 0.08

      // Tallo crece
      const stemTop = growth * MAX_H
      stem.scale.y = Math.max(0.001, stemTop)
      const sway = Math.sin(time * 0.8) * 0.02
      stem.rotation.z = sway

      // Semilla se "abre" (se achica) al germinar
      const germ = smooth(0.0, 0.12, growth)
      seed.scale.set(1 - germ, (1 - germ) * 1.3, 1 - germ)

      // Hojas: aparecen cuando el tallo pasa su altura
      leaves.forEach((lf) => {
        const grow = smooth(lf.at - 0.02, lf.at + 0.12, growth)
        const y = lf.at * stemTop
        lf.mesh.position.set(lf.side * 0.08 + sway * y, y, 0)
        const s = grow
        lf.mesh.scale.set(lf.side * 0.85 * s, 0.3 * s, 0.05 * s)
        lf.mesh.rotation.z = lf.side * (0.5 + 0.3 * Math.sin(time * 1.1 + lf.at))
        lf.mesh.rotation.y = lf.side * 0.3
      })

      // Flor: capullo aparece (0.58→0.86); pétalos se abren radialmente (0.82→1)
      // Cuando pivot.rotation.x = -π/2 ≈ -1.57: pétalos apuntan ARRIBA (capullo cerrado)
      // Cuando pivot.rotation.x =  0.32: pétalos levemente inclinados hacia abajo (flor abierta)
      const bud = smooth(0.58, 0.86, growth)
      const bloom = smooth(0.82, 1.0, growth)
      flower.position.set(sway * stemTop, stemTop + 0.12 * bud, 0)
      flower.scale.setScalar(Math.max(0.001, bud))
      flower.rotation.y = time * 0.14
      petals.forEach((p) => {
        if (p.isInner) {
          // Interiores se abren antes y un poco menos
          const ib = smooth(0.78, 0.97, growth)
          p.pivot.rotation.x = -Math.PI * 0.5 + ib * (Math.PI * 0.5 + 0.18)
        } else {
          // Exteriores con mínimo escalonamiento (idx=0 abre primero)
          const b = smooth(0.82 + p.idx * 0.012, 1.0, growth)
          p.pivot.rotation.x = -Math.PI * 0.5 + b * (Math.PI * 0.5 + 0.32)
        }
      })
      coreMat.emissiveIntensity = 0.5 + bloom * 2.8

      // Carteles de marca: florecen al final, en arco alrededor de la flor
      panels.forEach((pn) => {
        const appear = smooth(0.84, 1.0, growth)
        pn.mat.opacity = appear * 0.96
        const a = pn.angle + time * 0.05
        pn.group.position.set(
          Math.cos(a) * pn.radius,
          stemTop + 0.2 + Math.sin(time * 0.6 + pn.angle) * 0.2,
          Math.sin(a) * pn.radius - 0.5
        )
        pn.group.lookAt(camera.position)
        pn.group.scale.setScalar(0.6 + appear * 0.4)
      })

      // Polen flota
      for (let i = 0; i < pCount; i++) {
        const idx = i * 3
        pBase[idx] += Math.sin(time * 0.3 + i) * 0.003
        pBase[idx + 1] += dt * (0.12 + (i % 5) * 0.03)
        if (pBase[idx + 1] > 8.5) pBase[idx + 1] = 0
        pPos[idx] = pBase[idx]
        pPos[idx + 1] = pBase[idx + 1]
        pPos[idx + 2] = pBase[idx + 2]
      }
      pGeo.attributes.position.needsUpdate = true

      // Cámara: sube y acompaña la parte que está creciendo
      const focusY = 0.3 + stemTop * (growth < 0.85 ? 0.85 : 0.92)
      const camY = 1.2 + stemTop * 0.55
      const camZ = 8.5 + growth * 1.5
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.04
      camera.position.y += (camY - mouseY * 0.5 - camera.position.y) * 0.06
      camera.position.z += (camZ - camera.position.z) * 0.05
      lookTarget.set(0, focusY, 0)
      camLook.lerp(lookTarget, 0.07)
      camera.lookAt(camLook)

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
      if (mount && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
      composer?.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
}

const etapas = [
  {
    icon: Sprout,
    eyebrow: "La semilla",
    title: "Todo empieza por la esencia",
    body: "Antes del logo está la raíz: para qué existís, a quién le hablás y qué te hace distinto. Esa es la semilla de tu marca.",
  },
  {
    icon: Compass,
    eyebrow: "Las raíces",
    title: "Estrategia & naming",
    body: "Definimos posicionamiento, territorio y nombre. Las raíces que sostienen todo lo que se ve.",
  },
  {
    icon: Palette,
    eyebrow: "El tallo",
    title: "Sistema visual",
    body: "Logotipo, paleta, tipografías y grilla: un sistema coherente que crece firme, no una pieza suelta.",
  },
  {
    icon: Layers,
    eyebrow: "Las hojas",
    title: "Aplicaciones",
    body: "La marca se despliega en cada punto de contacto: redes, papelería, packaging, web. Crece hacia la luz.",
  },
  {
    icon: BookOpen,
    eyebrow: "El proceso",
    title: "Cuatro semanas de inmersión",
    body: "Diagnóstico, conceptualización, diseño y refinamiento: etapas claras con feedback real en cada paso. Sin sorpresas al final.",
  },
  {
    icon: Package,
    eyebrow: "Todo incluido",
    title: "Tu kit completo de marca",
    body: "Logotipo en todos sus formatos, paleta cromática, tipografías, elementos gráficos y manual de uso. Todo lo que necesitás para crecer consistente.",
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

export function IdentidadMarcaClient() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const barScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const waHref = getWhatsAppHref("Identidad de marca / Branding")

  const reveal = {
    initial: reduce ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" as const, amount: 0.25 },
    transition: { duration: 0.9, ease: easePremium },
  } as const

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#1c140d] text-white">
      <GrowthScene />
      <Navigation />

      {!reduce && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#5c8a36] via-[#ffd27a] to-[#f2a4c8] shadow-[0_0_12px_rgba(255,210,122,0.55)]"
          style={{ scaleX: barScaleX }}
        />
      )}

      {/* Hero */}
      <section className="relative flex min-h-[110vh] items-center px-6 pt-28 lg:px-12">
        <div className="relative z-10 w-full max-w-[640px]">
          <Link
            href="/servicios/diseno-grafico"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[13px] text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Diseño gráfico
          </Link>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-[#ffd9a0]/90">
            Servicio · Branding
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.98] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            Sembramos tu marca
            <span className="mt-1 block bg-gradient-to-r from-[#9ccb5f] via-[#ffd27a] to-[#f2a4c8] bg-clip-text text-transparent">
              y la vemos florecer
            </span>
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-white/85 drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] md:text-xl">
            De una semilla —tu esencia— hacemos crecer una identidad coherente, reconocible y lista
            para dar frutos. Deslizá y mirala crecer.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-full bg-[#ffd27a] px-7 text-base font-semibold text-[#1c140d] hover:bg-[#ffdf9a]"
              >
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppMark className="size-5" aria-hidden />
                  Sembrar mi marca
                </a>
              </Button>
            </Magnetic>
          </div>
          <p className="mt-12 inline-flex items-center gap-2 text-sm text-white/55">
            <span className="size-1.5 animate-pulse rounded-full bg-[#9ccb5f]" aria-hidden />
            Deslizá para hacerla crecer
          </p>
        </div>
      </section>

      {/* Etapas de crecimiento */}
      {etapas.map((e) => (
        <motion.section key={e.eyebrow} className="relative px-6 py-44 lg:px-12 lg:py-56" {...reveal}>
          <div className="ml-auto max-w-[480px] rounded-[2rem] border border-white/12 bg-[#1c140d]/55 p-8 backdrop-blur-xl md:p-10">
            <span className="inline-flex rounded-xl border border-[#ffd27a]/25 bg-[#ffd27a]/10 p-3 text-[#ffd9a0]">
              <e.icon className="size-6" aria-hidden />
            </span>
            <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#9ccb5f]/90">
              {e.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">{e.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/72">{e.body}</p>
          </div>
        </motion.section>
      ))}

      {/* CTA */}
      <motion.section className="relative px-6 py-40 text-center lg:px-12" {...reveal}>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#ffd27a]/25 bg-[#1c140d]/65 p-10 backdrop-blur-xl md:p-14">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">¿Sembramos la tuya?</h2>
          <p className="mt-4 text-lg text-white/70">
            Contanos tu proyecto y diseñamos una identidad con raíces, lista para florecer.
          </p>
          <div className="mt-9 flex justify-center">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-full bg-[#ffd27a] px-8 text-base font-semibold text-[#1c140d] hover:bg-[#ffdf9a]"
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
      </motion.section>

      <FooterSection />
    </main>
  )
}
