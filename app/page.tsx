import type { Metadata } from "next"
import { Navigation } from "@/components/landing/navigation";
import { Ambient3DBackground } from "@/components/landing/ambient-3d";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ServicesSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { SecuritySection } from "@/components/landing/security-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ProjectsSection } from "@/components/landing/projects-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { KineticMarquee } from "@/components/landing/kinetic-marquee";
import { SectionBand } from "@/components/landing/section-band";
import { SectionDivider } from "@/components/landing/section-divider";
import { ScrollProgress } from "@/components/landing/scroll-progress";

export const metadata: Metadata = {
  title: "Cosecha Creativa | Agencia de Marketing Digital y Diseño Web en San Juan",
  description:
    "Agencia de marketing digital en San Juan: gestión de redes, diseño web, SEO, publicidad, branding, IA y automatizaciones. Estrategia creativa con resultados medibles.",
  alternates: {
    canonical: "https://cosechacreativa.com.ar",
  },
  openGraph: {
    title: "Cosecha Creativa | Marketing digital y diseño web en San Juan",
    description:
      "Estrategia, creatividad y tecnología para potenciar tu presencia digital. Redes, web, SEO, IA y automatizaciones.",
    url: "https://cosechacreativa.com.ar",
  },
}

/**
 * Ritmo de la home.
 *
 * Cada sección va envuelta en una *banda* con superficie y profundidad propias
 * (ver `SectionBand` y el bloque final de `globals.css`): antes todo compartía
 * el mismo negro con aura y el scroll se leía como un solo bloque. El recorrido
 * alterna planos —atmósfera, papel elevado, losa hundida, hueco, pozo— y nunca
 * repite superficie en dos bandas seguidas, así que cada borde entre secciones
 * ya es un corte visible por sí mismo y los `SectionDivider` de 1px dejaron de
 * hacer falta salvo antes del footer.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Espacio 3D que acompaña toda la home: la cámara viaja con el scroll */}
      <Ambient3DBackground />

      <Navigation />
      <ScrollProgress />

      {/* Hero y Features comparten la atmósfera del 3D, así que no llevan banda
          propia. La junta entre los dos es una sola: el hero funde a negro en sus
          últimos 192px y cierra con una hairline; Features arranca justo ahí. */}
      <HeroSection />
      <FeaturesSection />

      <SectionBand surface="bone">
        <HowItWorksSection />
      </SectionBand>

      <SectionBand surface="slab">
        <ServicesSection />
      </SectionBand>

      <SectionBand surface="void">
        {/* Variante "content": métricas de agencia en español y carrusel de piezas
            reales. La variante "ai" que traía la plantilla eran datos de SaaS
            inventados y en inglés. */}
        <MetricsSection variant="content" />
      </SectionBand>

      <KineticMarquee />

      <SectionBand surface="deep">
        <IntegrationsSection />
      </SectionBand>

      <SectionBand surface="slab">
        <SecuritySection />
      </SectionBand>

      <SectionBand surface="void">
        <DevelopersSection />
      </SectionBand>

      <SectionBand surface="well">
        <TestimonialsSection />
      </SectionBand>

      <SectionBand surface="void">
        <ProjectsSection />
      </SectionBand>

      <SectionBand surface="signature">
        <CtaSection />
      </SectionBand>

      <SectionDivider color="dark" />

      <FooterSection />
    </main>
  );
}
