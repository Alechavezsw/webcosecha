"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Megaphone,
  Rocket,
  Search,
  Share2,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { NosotrosHero } from "@/components/landing/nosotros-hero";
import { NosotrosIaServicesSection } from "@/components/landing/nosotros-ia-services-section";
import { NosotrosPillarsSection } from "@/components/landing/nosotros-pillars-section";
import { NosotrosSolutionsSection } from "@/components/landing/nosotros-solutions-section";
import { FooterSection } from "@/components/landing/footer-section";
import { NosotrosTeamKineticSection } from "@/components/landing/nosotros-team-kinetic";
import { SectionDivider } from "@/components/landing/section-divider";
import { NosotrosAgency3d } from "@/components/landing/nosotros-agency-3d";
import { Ambient3DBackground } from "@/components/landing/ambient-3d";

const easePremium = [0.22, 1, 0.36, 1] as const;

const pillars = [
  {
    icon: Users,
    title: "Equipo multidisciplinario",
    body:
      "Expertos en desarrollo web, aplicaciones, diseño gráfico, fotografía y marketing digital trabajando en conjunto para resultados sólidos.",
  },
  {
    icon: Zap,
    title: "Tecnología de vanguardia",
    body:
      "Stack moderno, IA aplicada a procesos y entregas que escalan con tu negocio.",
  },
  {
    icon: Target,
    title: "Enfoque en resultados",
    body:
      "Soluciones digitales visualmente fuertes y medibles: tráfico, conversiones y presencia de marca.",
  },
];

const iaServices = [
  {
    title: "Desarrollo web",
    body:
      "Sitios y aplicaciones a medida que mejoran la experiencia del usuario y la productividad.",
    icon: Rocket,
  },
  {
    title: "SEO & visibilidad",
    body:
      "Optimización para buscadores y contenido orientado a atraer tráfico orgánico de calidad.",
    icon: Search,
  },
  {
    title: "Publicidad digital",
    body:
      "Campañas en redes y Google Ads pensadas para conversiones y alcance eficiente.",
    icon: Megaphone,
  },
  {
    title: "Fotografía profesional",
    body:
      "Imágenes que reflejan la esencia de tu marca y conectan con tu audiencia.",
    icon: Camera,
  },
  {
    title: "Gestión de redes sociales",
    body:
      "Estrategia y contenido para fortalecer tu presencia en Instagram, Facebook y más.",
    icon: Share2,
  },
];

const solutions = [
  {
    title: "SEO & posicionamiento",
    body:
      "Trabajamos la visibilidad en Google con base técnica y contenidos alineados a tu negocio.",
  },
  {
    title: "Social engagement",
    body:
      "Medimos el compromiso de tu audiencia y ajustamos estrategias para mejorar resultados.",
  },
  {
    title: "Content marketing",
    body:
      "Piezas y narrativas que conectan con tu público y refuerzan autoridad de marca.",
  },
];

const timeline = [
  {
    date: "Dic 2003",
    title: "I-media 86",
    detail: "Inicios en diseño web y proyectos digitales.",
  },
  {
    date: "May 2005",
    title: "SW Diario",
    detail: "Creación del medio y consolidación del equipo editorial y técnico.",
  },
  {
    date: "Jul 2023",
    title: "Cosecha Creativa",
    detail:
      "Fundación en San Juan: estrategia, creatividad y tecnología bajo una misma marca.",
  },
  {
    date: "2024",
    title: "Equipo & nuevas tecnologías",
    detail:
      "Equipo multidisciplinario ampliado; IA y herramientas actuales aplicadas al marketing digital.",
  },
  {
    date: "2026",
    title: "Más tecnología y equipo",
    detail:
      "Profundizamos en procesos digitales, automatización e IA aplicada; el equipo crece con nuevos perfiles para entregar proyectos más veloces y medibles.",
  },
];

const team = [
  {
    id: "ale-chavez",
    name: "Ale Chávez",
    role: "Diseño web · Dirección",
    bio: "Fundador de I-media 86, SW Diario y Cosecha Creativa. Periodismo, comunicación política y fotografía.",
    initials: "AC",
    image: "/ale-chavez.png",
    link: "https://alechavez.cosechacreativa.com.ar/",
  },
  {
    id: "gaby-pizarro",
    name: "Gaby Pizarro",
    role: "Estrategia de marketing",
    bio: "Fundador de REGEM; formación y especialización en marketing en institutos internacionales.",
    initials: "GP",
  },
  {
    id: "luciana-pizarro",
    name: "Luciana Pizarro",
    role: "Community management",
    bio: "Fundadora de PIPIS; contenido y gestión de redes para marcas y campañas.",
    initials: "LP",
  },
  {
    id: "maxi-lopez",
    name: "Maxi López",
    role: "Fotografía",
    bio: "Dirección de cine (ENERC); fundador de MIFOCO.",
    initials: "ML",
  },
  {
    id: "nicolas-chavez",
    name: "Nicolás Chávez",
    role: "Diseño y edición",
    bio: "Piezas visuales y postproducción para web, redes y campañas con criterio editorial unificado.",
    initials: "NC",
  },
  {
    id: "emilia-fuentes",
    name: "Emilia Fuentes",
    role: "Diseño",
    bio: "Identidad visual, interfaces y material gráfico alineado a la voz de cada marca.",
    initials: "EF",
  },
];

export function NosotrosPageClient() {
  const reduce = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050506] text-white antialiased">
      <Navigation />

      {/* Campo bioluminiscente 3D (esporas + monarcas) detrás de TODA la página,
          igual que la home — unifica la estética del jardín nocturno. */}
      <Ambient3DBackground heroCover={false} />

      {/* Aurora moving spotlights in background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
        <div className="absolute top-[-5%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,168,214,0.14)_0%,transparent_70%)] blur-3xl animate-first" />
        <div className="absolute top-[20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(161,0,242,0.11)_0%,transparent_70%)] blur-3xl animate-second" />
        <div className="absolute top-[45%] left-[-5%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.11)_0%,transparent_70%)] blur-3xl animate-third" />
        <div className="absolute bottom-[20%] right-[-5%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,82,33,0.12)_0%,transparent_70%)] blur-3xl animate-fourth" />
        <div className="absolute bottom-[-5%] left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,168,214,0.14)_0%,transparent_70%)] blur-3xl animate-fifth" />
      </div>

      <NosotrosHero />
      <SectionDivider color="copper" />

      <NosotrosPillarsSection pillars={pillars} />
      <SectionDivider color="purple-rose" />

      <NosotrosIaServicesSection services={iaServices} />
      <SectionDivider color="cyan" />

      <NosotrosSolutionsSection solutions={solutions} />
      <SectionDivider color="purple" />

      {/* Results */}
      <motion.section 
        initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: easePremium }}
        className="relative overflow-hidden py-16 md:py-24"
      >
        {/* Glow ambient background style */}
        <div className="pointer-events-none absolute inset-0 bg-[#05030a]/45" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(161,0,242,0.12),transparent_70%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden />
        
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Resultados en el tiempo correcto
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/72 md:text-[17px]">
            Entendemos que el tiempo cuenta. Trabajamos con estrategias claras para impulsar el
            crecimiento de tu negocio en meses, no en promesas vacías.
          </p>
        </div>
      </motion.section>
      <SectionDivider color="purple-cyan" />

      {/* Timeline */}
      <motion.section 
        initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: easePremium }}
        className="relative overflow-hidden py-20 md:py-28"
      >
        {/* Glow ambient background style */}
        <div className="pointer-events-none absolute inset-0 bg-[#05030a]/45" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(103,232,249,0.08),transparent_65%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[720px] px-6 lg:px-12">
          <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/85">
            Nuestra línea de tiempo
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-semibold md:text-4xl">
            Más de dos décadas evolucionando
          </h2>
          <div className="relative mt-14 border-l border-white/10 pl-8 md:pl-10">
            {timeline.map((item, i) => (
              <motion.div
                key={item.title + item.date}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative pb-12 last:pb-0"
              >
                <span className="absolute -left-[21px] top-1.5 flex h-3 w-3 rounded-full border-2 border-[#eca8d6]/80 bg-[#050506] md:-left-[25px]" />
                <p className="font-mono text-sm text-[#eca8d6]/90">{item.date}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      <SectionDivider color="rose" />

      <NosotrosTeamKineticSection members={team} />
      <SectionDivider color="copper" />

      {/* Usina Creativa: Motor interactivo 3D con forma de agencia */}
      <NosotrosAgency3d />
      <SectionDivider color="purple-rose" />

      {/* CTA */}
      <motion.section 
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: easePremium }}
        className="relative overflow-hidden py-20 md:py-28"
      >
        {/* Glow ambient background style */}
        <div className="pointer-events-none absolute inset-0 bg-[#05030a]/45" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(184,82,33,0.10),transparent_65%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-12">
          <div className="rounded-[1.75rem] border border-[#eca8d6]/25 bg-gradient-to-br from-[#eca8d6]/15 via-transparent to-violet-900/20 px-8 py-12 md:px-14 md:py-14">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              ¿Tu marca en el siguiente nivel?
            </h2>
            <p className="mt-4 max-w-xl text-[15px] text-white/75">
              Contanos tu proyecto: estrategia, web, redes o campañas. Respondemos con propuesta
              clara.
            </p>
            <Link
              href="/#contacto"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-gray-900 transition hover:bg-white/90"
            >
              Ir a contacto
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.section>
      <SectionDivider color="dark" />

      <FooterSection />
    </main>
  );
}
