import { ImageResponse } from "next/og"

export const alt = "Cosecha Creativa — Agencia de Marketing Digital en San Juan"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a0508 0%, #1a0a12 55%, #3d1226 100%)",
          color: "#f5efe9",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#d9a8bf",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#d9a8bf" }} />
          Agencia de marketing digital en San Juan
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, lineHeight: 1.05 }}>Cosecha Creativa</div>
          <div style={{ fontSize: 34, color: "#cbbfc6", fontFamily: "sans-serif" }}>
            Estrategia, creatividad y tecnología para potenciar tu presencia digital.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8f7f88", fontFamily: "sans-serif" }}>
          cosechacreativa.com.ar
        </div>
      </div>
    ),
    size,
  )
}
