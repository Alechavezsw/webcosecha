import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Cosecha Creativa — Agencia de marketing digital en San Juan"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(145deg, #050505 0%, #120818 45%, #1a0a14 70%, #0a0a0a 100%)",
          color: "white",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#eca8d6",
            }}
          />
          San Juan · Argentina
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Cosecha Creativa
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.25,
              maxWidth: 900,
              color: "rgba(255,255,255,0.78)",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 400,
            }}
          >
            Agencia de marketing digital, diseño web, SEO e inteligencia artificial
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>cosechacreativa.com.ar</span>
          <span style={{ color: "#eca8d6" }}>Estrategia · Creatividad · Tecnología</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
