"use client"

import { Suspense, lazy, useEffect, useState } from "react"
import type { Application, SplineEvent } from "@splinetool/runtime"
import { isWebGLAvailable } from "@/lib/webgl-support"
import { cn } from "@/lib/utils"

const Spline = lazy(() => import("@splinetool/react-spline"))

function SplineWebGLFallback({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Vista 3D no disponible: este navegador o vista previa no permite WebGL"
      className={cn(
        "flex min-h-[260px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300/90 bg-gradient-to-b from-gray-100/90 to-gray-50/80 px-6 py-10 text-center",
        className,
      )}
    >
      <p className="max-w-sm text-[14px] leading-relaxed text-gray-600">
        La escena 3D necesita{" "}
        <span className="font-medium text-gray-800">WebGL</span>. En algunas vistas previas
        embebidas, modo sandbox o sin GPU accesible el navegador lo bloquea.
      </p>
      <p className="text-[13px] text-gray-500">
        Abrí la página en Chrome o Edge en tu escritorio para ver el modelo.
      </p>
    </div>
  )
}

function SplineLoadingFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl bg-gray-100/50",
        className,
      )}
    >
      <span className="loader" aria-hidden />
      <span className="sr-only">Cargando escena 3D…</span>
    </div>
  )
}

export interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (app: Application) => void
  onSplineMouseDown?: (e: SplineEvent) => void
  onSplineMouseHover?: (e: SplineEvent) => void
}

export function SplineScene({
  scene,
  className,
  onLoad,
  onSplineMouseDown,
  onSplineMouseHover,
}: SplineSceneProps) {
  const [webglOk, setWebglOk] = useState<boolean | null>(null)

  useEffect(() => {
    setWebglOk(isWebGLAvailable())
  }, [])

  if (webglOk === false) {
    return <SplineWebGLFallback className={className} />
  }

  if (webglOk === null) {
    return <SplineLoadingFallback className={className} />
  }

  return (
    <Suspense fallback={<SplineLoadingFallback className={className} />}>
      <Spline
        scene={scene}
        className={className}
        onLoad={onLoad}
        onSplineMouseDown={onSplineMouseDown}
        onSplineMouseHover={onSplineMouseHover}
      />
    </Suspense>
  )
}
