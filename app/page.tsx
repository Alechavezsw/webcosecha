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

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Espacio 3D que acompaña toda la home: la cámara viaja con el scroll */}
      <Ambient3DBackground />

      <Navigation />
      <ScrollProgress />

      <HeroSection />

      <FeaturesSection />
      <SectionDivider color="purple-rose" />

      <HowItWorksSection />
      <SectionDivider color="cyan" />

      <ServicesSection />
      <SectionDivider color="emerald" />

      <MetricsSection />
      <SectionDivider color="purple-cyan" />

      <IntegrationsSection />
      <SectionDivider color="purple" />

      <SecuritySection />
      <SectionDivider color="cyan" />

      <DevelopersSection />
      <SectionDivider color="rose" />

      <TestimonialsSection />
      <SectionDivider color="purple" />

      <ProjectsSection />
      <SectionDivider color="copper" />

      <CtaSection />
      <SectionDivider color="dark" />

      <FooterSection />
    </main>
  );
}
