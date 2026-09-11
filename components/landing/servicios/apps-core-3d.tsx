"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useInViewport } from "@/hooks/use-in-viewport"

/**
 * Núcleo 3D de la sección «Arquitectura» de /servicios/apps.
 *
 * El texto de esa sección habla de un mismo núcleo al que se conectan base de
 * datos, integraciones y modelos: acá se ve. Es una retícula de celdas dentro
 * de una caja de alambre, atravesada por dos ondas (una que sale del centro y
 * otra diagonal) que la hacen respirar y encienden distintas celdas en ácido.
 *
 * Igual que el campo del hero, todo el enjambre es UN `InstancedMesh`: una sola
 * llamada de dibujo para las 125 celdas, con color por instancia.
 */

const GRID = 5
const COUNT = GRID * GRID * GRID
const STEP = 0.62
const CELL = 0.24

const COLOR_LOW = new THREE.Color("#272E3A")
const COLOR_HIGH = new THREE.Color("#C8FF00")

function CoreLattice({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  /** Posiciones fijas + distancia al centro, que es lo que ordena la onda. */
  const cells = useMemo(() => {
    const out: { x: number; y: number; z: number; d: number }[] = []
    const half = ((GRID - 1) * STEP) / 2
    for (let ix = 0; ix < GRID; ix++) {
      for (let iy = 0; iy < GRID; iy++) {
        for (let iz = 0; iz < GRID; iz++) {
          const x = ix * STEP - half
          const y = iy * STEP - half
          const z = iz * STEP - half
          out.push({ x, y, z, d: Math.sqrt(x * x + y * y + z * z) })
        }
      }
    }
    return out
  }, [])

  /** Primer cuadro también con movimiento reducido: si no, la caja sale vacía. */
  const paint = (t: number) => {
    const mesh = meshRef.current
    if (!mesh) return
    for (let i = 0; i < COUNT; i++) {
      const c = cells[i]
      // Dos ondas: una esférica que sale del centro y otra diagonal más lenta.
      // Con la esférica sola solo se encendía una cáscara por vez y el resto de
      // la retícula quedaba como una mancha negra.
      const radial = Math.sin(c.d * 2.1 - t * 1.6)
      const diagonal = Math.sin((c.x + c.y + c.z) * 1.05 + t * 0.9)
      const pulse = (radial * 0.6 + diagonal * 0.4 + 1) * 0.5
      const s = CELL * (0.4 + pulse * 1.05)

      dummy.position.set(c.x, c.y, c.z)
      dummy.scale.setScalar(s)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Las crestas llegan al ácido; los valles quedan en un gris metálico frío.
      mesh.setColorAt(i, color.copy(COLOR_LOW).lerp(COLOR_HIGH, Math.pow(pulse, 1.5)))
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  useEffect(() => {
    paint(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    paint(t)
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.24
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.18
    }
  })

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(3.1, 3.1, 3.1)), [])
  useEffect(() => () => edges.dispose(), [edges])

  return (
    <group ref={groupRef} rotation={[0.42, 0.7, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors roughness={0.32} metalness={0.35} />
      </instancedMesh>
      {/* Caja de alambre: el límite del núcleo, en la misma línea de 1px del resto. */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#C8FF00" transparent opacity={0.34} />
      </lineSegments>
    </group>
  )
}

export function AppsCore3D({ reducedMotion = false }: { reducedMotion?: boolean }) {
  /** El núcleo vive al final de la página: casi todo el scroll ocurre con él fuera de pantalla. */
  const { ref: hostRef, inView } = useInViewport<HTMLDivElement>("160px")

  return (
    <div ref={hostRef} className="size-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.7, 7.4], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : inView ? "always" : "never"}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} />
        <directionalLight position={[-5, 2, 4]} intensity={0.9} color="#8FA6C4" />
        <pointLight position={[-4, -2, -3]} intensity={46} distance={20} color="#C8FF00" />
        <CoreLattice reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

export default AppsCore3D
