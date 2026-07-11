/**
 * Whether WebGL appears usable in this environment (GPU disabled, sandboxed preview,
 * remote desktop without GPU, etc. often yield null or "Disabled" vendor/renderer).
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false

  try {
    const canvas = document.createElement("canvas")
    const opts = { failIfMajorPerformanceCaveat: false } as const
    const gl =
      canvas.getContext("webgl2", opts) ||
      canvas.getContext("webgl", opts) ||
      canvas.getContext("experimental-webgl")

    if (!gl) return false

    const vendor = gl.getParameter(gl.VENDOR)
    const renderer = gl.getParameter(gl.RENDERER)
    if (vendor === "Disabled" || renderer === "Disabled") return false

    const debug = gl.getExtension("WEBGL_debug_renderer_info")
    if (debug) {
      const unmaskedVendor = gl.getParameter(debug.UNMASKED_VENDOR_WEBGL)
      const unmaskedRenderer = gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
      if (
        typeof unmaskedVendor === "string" &&
        unmaskedVendor.toLowerCase().includes("disabled")
      ) {
        return false
      }
      if (
        typeof unmaskedRenderer === "string" &&
        unmaskedRenderer.toLowerCase().includes("disabled")
      ) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}
