"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useInViewport } from "@/hooks/use-in-viewport"

/**
 * Campo 3D del hero de /servicios/apps.
 *
 * Una grilla de barras extruidas que ondula: la metáfora es un dashboard de
 * datos visto desde adentro. Es WebGL real (no un video ni una imagen), así que
 * responde al puntero y da la profundidad que el resto del sitio resuelve con
 * degradados planos — que es justamente lo que esta página no quiere parecer.
 *
 * Todo se dibuja con UN `InstancedMesh`: una sola draw call para todas las
 * barras. El color por instancia va de la tinta del fondo al verde ácido según
 * la altura, así solo las crestas «encienden» y el resto queda casi negro.
 */

const SPACING = 0.52
const BAR = 0.34
/** Altura máxima de la onda; la barra se escala en Y desde su base. */
const AMPLITUDE = 2.6

const COLOR_LOW = new THREE.Color("#0E1014")
const COLOR_HIGH = new THREE.Color("#C8FF00")

/**
 * En pantallas chicas se reduce la grilla y se abre el campo de visión: menos
 * instancias que animar por cuadro y el mismo encuadre en vertical.
 */
const LAYOUT = {
  compact: { grid: 26, y: 2.6, z: 10.5, fov: 58, lookY: 1.1 },
  wide: { grid: 42, y: 3.4, z: 11, fov: 38, lookY: 1.3 },
} as const

type Layout = (typeof LAYOUT)[keyof typeof LAYOUT]

/**
 * Puntero global normalizado (-1..1). No usamos `state.pointer` de R3F porque
 * el contenido del hero se dibuja encima del canvas y le roba los eventos:
 * escuchando en `window` el campo sigue al cursor por toda la sección.
 */
function useWindowPointer() {
  const ref = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])
  return ref
}

function BarField({ grid, reducedMotion }: { grid: number; reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { viewport } = useThree()

  /** Puntero en coordenadas del mundo, suavizado hacia el objetivo. */
  const pointer = useRef({ x: 0, z: 0 })
  const input = useWindowPointer()

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const count = grid * grid

  /** Caja con la base en y=0: escalar en Y la estira hacia arriba, no hacia los dos lados. */
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(BAR, 1, BAR)
    g.translate(0, 0.5, 0)
    return g
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  /** Posiciones fijas de cada barra, recalculadas solo si cambia la densidad. */
  const cells = useMemo(() => {
    const out: { x: number; z: number; d: number }[] = []
    const half = ((grid - 1) * SPACING) / 2
    for (let ix = 0; ix < grid; ix++) {
      for (let iz = 0; iz < grid; iz++) {
        const x = ix * SPACING - half
        const z = iz * SPACING - half
        out.push({ x, z, d: Math.sqrt(x * x + z * z) })
      }
    }
    return out
  }, [grid])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const t = reducedMotion ? 0 : state.clock.elapsedTime * 0.55

    // El puntero llega normalizado (-1..1); lo llevamos al plano del campo.
    const tx = input.current.x * viewport.width * 0.5
    const tz = -input.current.y * viewport.height * 0.5
    pointer.current.x += (tx - pointer.current.x) * 0.06
    pointer.current.z += (tz - pointer.current.z) * 0.06

    for (let i = 0; i < count; i++) {
      const c = cells[i]

      // Onda base: dos senos cruzados + una onda radial que sale del centro.
      const wave =
        Math.sin(c.x * 0.42 + t) * Math.cos(c.z * 0.42 - t * 0.8) * 0.5 +
        Math.sin(c.d * 0.55 - t * 1.15) * 0.5

      // Bulto suave bajo el cursor: acerca la interacción sin romper la onda.
      // Distancia al cuadrado: la gaussiana del bulto ya usa pd², así nos
      // ahorramos una raíz por barra y por cuadro.
      const dx = c.x - pointer.current.x
      const dz = c.z - pointer.current.z
      const bump = Math.exp(-(dx * dx + dz * dz) / 6) * 1.5

      const n = Math.max(0.04, (wave + 1) * 0.5 + bump * 0.5)
      const h = 0.12 + n * AMPLITUDE

      dummy.position.set(c.x, 0, c.z)
      dummy.scale.set(1, h, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Solo las crestas se encienden: la curva mantiene el campo oscuro.
      const lit = Math.min(1, Math.pow(n, 2.3) * 1.45)
      mesh.setColorAt(i, color.copy(COLOR_LOW).lerp(COLOR_HIGH, lit))
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    // `key` fuerza un mesh nuevo al cambiar la densidad: `count` es fijo por instancia.
    <instancedMesh key={grid} ref={meshRef} args={[geometry, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial vertexColors roughness={0.55} metalness={0.15} />
    </instancedMesh>
  )
}

/** Cámara suavizada hacia el puntero; el encuadre base lo define el layout. */
function Rig({ layout, reducedMotion }: { layout: Layout; reducedMotion: boolean }) {
  const { camera } = useThree()
  const input = useWindowPointer()

  useEffect(() => {
    camera.position.set(0, layout.y, layout.z)
    camera.lookAt(0, layout.lookY, -6)
  }, [camera, layout])

  useFrame(() => {
    if (reducedMotion) return
    const tx = input.current.x * 2.2
    const ty = layout.y - input.current.y * 1.1
    camera.position.x += (tx - camera.position.x) * 0.04
    camera.position.y += (ty - camera.position.y) * 0.04
    camera.lookAt(0, layout.lookY, -6)
  })

  return null
}

export function AppsHeroField({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [compact, setCompact] = useState(false)
  /** El hero deja de dibujar apenas sale de pantalla: es el bucle más caro de la página. */
  const { ref: hostRef, inView } = useInViewport<HTMLDivElement>("120px")

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const layout = compact ? LAYOUT.compact : LAYOUT.wide

  return (
    <div ref={hostRef} className="size-full">
      <Canvas
        dpr={[1, compact ? 1.25 : 1.5]}
        camera={{ position: [0, layout.y, layout.z], fov: layout.fov }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        // Con movimiento reducido alcanza con un cuadro: no hay bucle de render.
        frameloop={reducedMotion ? "demand" : inView ? "always" : "never"}
      >
        {/* La niebla toma el color del fondo de la página, así el campo se
            desvanece en el horizonte en vez de cortarse con una línea dura. */}
        <fog attach="fog" args={["#050506", 9, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 10, 4]} intensity={2.1} color="#ffffff" />
        <pointLight position={[-6, 3, -4]} intensity={70} distance={30} color="#C8FF00" />
        {/* Piso técnico: refuerza la perspectiva sin sumar geometría pesada. */}
        <gridHelper args={[layout.grid * SPACING, layout.grid, "#23232B", "#15151A"]} position={[0, 0.01, 0]} />
        <BarField grid={layout.grid} reducedMotion={reducedMotion} />
        <Rig layout={layout} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

export default AppsHeroField
