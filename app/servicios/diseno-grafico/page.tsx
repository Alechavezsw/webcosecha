import type { Metadata } from "next"
import { DisenoGraficoClient } from "@/components/landing/servicios/diseno-grafico-client"

const ORIGINAL_URL =
  "https://cosechacreativa.com.ar/despierta-tu-marca-con-cosecha-creativa-diseno-grafico-que-impacta-y-vende/" as const

export const metadata: Metadata = {
  title: "Diseño Gráfico | Cosecha Creativa — San Juan",
  description:
    "Diseño gráfico y digital estratégico: redes, publicidad, web, presentaciones e identidad visual para marcas en San Juan.",
  openGraph: {
    title: "Diseño Gráfico | Cosecha Creativa",
    description:
      "Piezas visuales profesionales para comunicar mejor, vender más y destacar en digital.",
    url: ORIGINAL_URL,
  },
}

export default function DisenoGraficoPage() {
  return <DisenoGraficoClient />
}
