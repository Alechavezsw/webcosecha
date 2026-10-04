"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Camera,
  Gauge,
  Handshake,
  Megaphone,
  MessageCircle,
  Rocket,
  Search,
  Share2,
  Target,
  Users,
} from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { NosotrosHero } from "@/components/landing/nosotros-hero";
import { NosotrosMarquee } from "@/components/landing/nosotros-marquee";
import { NosotrosStatsBand } from "@/components/landing/nosotros-stats-band";
import { NosotrosIaServicesSection } from "@/components/landing/nosotros-ia-services-section";
import { NosotrosProcessSection } from "@/components/landing/nosotros-process-section";
import { NosotrosPrinciplesSection } from "@/components/landing/nosotros-principles-section";
import { NosotrosTimelineSection } from "@/components/landing/nosotros-timeline-section";
import { FooterSection } from "@/components/landing/footer-section";
import { NosotrosTeamKineticSection } from "@/components/landing/nosotros-team-kinetic";
import { SectionDivider } from "@/components/landing/section-divider";
import { NosotrosAgency3d } from "@/components/landing/nosotros-agency-3d";
import { Ambient3DBackground } from "@/components/landing/ambient-3d";

const easePremium = [0.22, 1, 0.36, 1] as const;

const WHATSAPP_URL = "https://wa.me/542645468012";

const marqueeItems = [
  "Inteligencia artificial",
  "Desarrollo web",
  "SEO",
  "Publicidad digital",
  "Redes sociales",
  "Fotografía",
  "Automatización",
  "Comunicación política",
];

const stats = [
  {
    value: 20,
    prefix: "+",
    label: "Años de trayectoria",
    detail: "Desde 2003 haciendo web y comunicación en San Juan.",
  },
  {
    value: 6,
    label: "Especialistas in-house",
    detail: "Dirección, marketing, comunidad, fotografía y diseño.",
  },
  {
    value: 14,
    label: "Servicios activos",
    detail: "De IA aplicada y desarrollo a redes, foto e infraestructura.",
  },
  {
    value: 3,
    label: "Marcas fundadas",
    detail: "I-media 86, SW Diario y Cosecha Creativa.",
  },
];

/** "Por qué nosotros": capacidades + criterio, en una sola lista editorial. */
const principles = [
  {
    icon: Users,
    title: "Un solo equipo, de punta a punta",
    body:
      "Estrategia, diseño, desarrollo, contenido y fotografía en la misma mesa. Un interlocutor y una factura, sin coordinar tres proveedores.",
  },
  {
    icon: Target,
    title: "Primero el negocio, después la tecnología",
    body:
      "Antes de proponer un desarrollo, una campaña o un agente de IA, entendemos qué problema comercial resuelve y cómo se va a medir.",
  },
  {
    icon: Gauge,
    title: "Lo que no se mide, no se mejora",
    body:
      "Cada proyecto sale con la medición configurada desde el día uno. Preferimos un número incómodo antes que un informe decorativo.",
  },
  {
    icon: Handshake,
    title: "Decimos que no cuando corresponde",
    body:
      "Si tu sitio funciona, no te vendemos uno nuevo. Si el presupuesto no alcanza para hacerlo bien, lo decimos antes de empezar.",
  },
];

const iaServices = [
  {
    title: "Inteligencia artificial aplicada",
    body:
      "Agentes que atienden por WhatsApp y por la web, automatizaciones que eliminan la carga manual y reportes que se arman solos.",
    icon: Bot,
    href: "/servicios/ia",
    tags: ["Agentes de IA", "n8n", "WhatsApp Business", "Reportes"],
  },
  {
    title: "Desarrollo web",
    body: "Sitios y aplicaciones a medida, rápidos por diseño y pensados para convertir.",
    icon: Rocket,
    href: "/servicios/diseno-web",
  },
  {
    title: "SEO & posicionamiento",
    body: "Base técnica sana y contenido que responde lo que tus clientes escriben en Google.",
    icon: Search,
    href: "/servicios/seo",
  },
  {
    title: "Publicidad digital",
    body: "Campañas en Google y Meta con conversiones medidas y costo por consulta bajo control.",
    icon: Megaphone,
    href: "/servicios/publicidad-paga-en-redes",
  },
  {
    title: "Redes y contenido",
    body: "Calendario trimestral, producción por lotes y una voz de marca que se sostiene.",
    icon: Share2,
    href: "/servicios/gestion-de-redes-sociales",
  },
  {
    title: "Foto y video",
    body: "Producción propia: producto, equipo, obra y piezas para campañas.",
    icon: Camera,
    href: "/servicios/foto-y-video",
  },
];

const processSteps = [
  {
    title: "Escuchamos",
    body: "Una reunión para entender el negocio, no para mostrarte un portfolio.",
    meta: "Semana 1",
  },
  {
    title: "Diagnosticamos",
    body: "Revisamos web, redes y procesos, y te devolvemos por escrito qué falla y qué va primero.",
    meta: "Semana 1 y 2",
  },
  {
    title: "Proponemos",
    body: "Plan con alcance, plazos y precio cerrado. Sin horas que aparecen a mitad de camino.",
    meta: "Semana 2",
  },
  {
    title: "Ejecutamos",
    body: "Entregas parciales para que veas avances y corrijas a tiempo.",
    meta: "Según proyecto",
  },
  {
    title: "Medimos",
    body: "Consultas, costo por consulta y evolución. Si algo no rinde, se cambia.",
    meta: "Mes a mes",
  },
];

const timeline = [
  {
    date: "Dic 2003",
    title: "I-media 86",
    detail: "Los primeros sitios web, cuando en la provincia casi nadie veía internet como canal comercial.",
  },
  {
    date: "May 2005",
    title: "SW Diario",
    detail: "El medio digital propio: redacción, producción y tecnología. Ahí se formó el núcleo del equipo.",
  },
  {
    date: "Jul 2023",
    title: "Cosecha Creativa",
    detail: "Estrategia, creatividad y tecnología bajo una misma marca y un mismo método.",
  },
  {
    date: "2024",
    title: "Equipo y nuevas tecnologías",
    detail: "Se suman diseño, fotografía y comunidad. La IA entra al día a día de los proyectos.",
  },
  {
    date: "2026",
    title: "Más tecnología, más equipo",
    detail: "Agentes de IA en producción, automatizaciones con n8n e infraestructura propia.",
    current: true,
  },
];

const team = [
  {
    id: "ale-chavez",
    name: "Ale Chávez",
    role: "Diseño web · Dirección",
    bio: "Fundador de I-media 86, SW Diario y Cosecha Creativa. Periodismo, comunicación política y fotografía.",
    initials: "AC",
    image: "/_lite/ale-chavez.webp",
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
];

export function NosotrosPageClient() {
  const reduce = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050506] text-white antialiased">
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

      {/* Recorrido de color: rosa (hero) → plata (datos) → violeta → cian →
          esmeralda → cobre → rosa (equipo). Cada divisor anuncia el color
          de la sección que viene, para que el corte se lea al hacer scroll. */}

      {/* Cinta en movimiento: separa el bloque de apertura del cuerpo. */}
      <NosotrosMarquee items={marqueeItems} />

      {/* Plata — datos duros, sin color de marca */}
      <NosotrosStatsBand stats={stats} />
      <SectionDivider color="purple" />

      {/* Violeta + trama de puntos */}
      <NosotrosPrinciplesSection principles={principles} />
      <SectionDivider color="cyan" />

      {/* Cian + rayas diagonales */}
      <NosotrosIaServicesSection services={iaServices} />
      <SectionDivider color="emerald" />

      {/* Esmeralda + grilla técnica */}
      <NosotrosProcessSection steps={processSteps} />
      <SectionDivider color="copper" />

      {/* Cobre sepia + campo de estrellas */}
      <NosotrosTimelineSection items={timeline} />
      <SectionDivider color="rose" />

      {/* Rosa + líneas horizontales */}
      <NosotrosTeamKineticSection members={team} />
      <SectionDivider color="purple-rose" />

      {/* Usina Creativa: motor interactivo 3D con forma de agencia */}
      <NosotrosAgency3d />
      <SectionDivider color="dark" />

      {/* CTA */}
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: easePremium }}
        className="relative overflow-hidden py-16 md:py-24"
      >
        {/* Cierre: recoge los cinco colores del recorrido en un solo bloque. */}
        <div className="pointer-events-none absolute inset-0 bg-[#08050f]/85" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_120%,rgba(236,168,214,0.30),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_8%_-10%,rgba(184,82,33,0.20),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_92%_-10%,rgba(139,92,246,0.20),transparent_60%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#eca8d6]/30 bg-gradient-to-br from-[#eca8d6]/18 via-[#0a0710]/70 to-violet-900/35 px-7 py-11 backdrop-blur-md md:px-14 md:py-14">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#eca8d6]/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#8b5cf6]/25 blur-3xl"
              aria-hidden
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]">
                  Siguiente paso
                </p>
                <h2 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.92] tracking-tight sm:text-5xl lg:text-[3.8rem]">
                  Contanos qué
                  <span className="italic text-[#eca8d6]"> querés resolver</span>
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/72 md:text-[17px]">
                  La primera reunión y el diagnóstico no tienen costo: te decimos qué haríamos y
                  cuánto sale, sin vueltas.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/#contacto"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-900 transition hover:bg-white/90"
                  >
                    Ir a contacto
                    <ArrowUpRight className="h-5 w-5" aria-hidden />
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:border-[#eca8d6]/45 hover:bg-white/10"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden />
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {[
                    { k: "Respuesta", v: "Menos de 24 h hábiles" },
                    { k: "Diagnóstico inicial", v: "Sin costo" },
                    { k: "Presupuesto", v: "Alcance y precio cerrado" },
                    { k: "Dónde estamos", v: "San Juan, Argentina" },
                  ].map((row) => (
                    <li key={row.k} className="flex items-baseline justify-between gap-4 py-4">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40">
                        {row.k}
                      </span>
                      <span className="text-right text-[14.5px] text-white/80">{row.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <SectionDivider color="dark" />

      <FooterSection />
    </main>
  );
}
