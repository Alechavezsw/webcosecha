"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Code2,
  Database,
  FileText,
  Globe,
  LayoutDashboard,
  Palette,
  ShieldAlert,
  Share2,
  Sparkles,
  Users,
  X as XIcon,
  type LucideIcon,
} from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const easePremium = [0.22, 1, 0.36, 1] as const;

/** Copia sin espacios en `public/media/compol-hero.mp4` (evita 404 / rutas rotas). */
const COMPOL_HERO_VIDEO_SRC = "/media/compol-hero.mp4";

const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const heroLine: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: easePremium },
  },
};

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easePremium },
  },
};

const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easePremium },
  },
};

type CompolService = {
  id: string;
  icon: typeof BookOpen;
  title: string;
  body: string;
  detail: string[];
};

const services: CompolService[] = [
  {
    id: "asesoramiento-capacitacion",
    icon: BookOpen,
    title: "Asesoramiento y Capacitación",
    body:
      "Formación personalizada en comunicación estratégica para fortalecer a organizaciones públicas y privadas.",
    detail: [
      "Diseñamos rutas de formación a medida para equipos de comunicación, voceros y mandos medios: manejo de entrevistas, redes, storytelling institucional y protocolos básicos de crisis.",
      "En organizaciones públicas priorizamos claridad, trazabilidad y respeto de los marcos normativos. En el sector privado, agilidad y foco en reputación, stakeholders y oportunidades de negocio.",
      "La modalidad puede ser presencial, híbrida o virtual, con materiales y ejercicios prácticos según el nivel y la agenda del equipo.",
    ],
  },
  {
    id: "estrategia-integral",
    icon: Share2,
    title: "Estrategias de comunicación integral",
    body:
      "Community management y estrategias digitales pensadas para maximizar tu alcance y coherencia de mensaje.",
    detail: [
      "Construimos una matriz de mensajes y un plan editorial que ordena qué decir, cuándo y en qué canal: redes, medios, territorio y comunicaciones internas.",
      "Coordinamos community management, calendarios de contenidos, piezas visuales y reportes mensuales con métricas claras de alcance, engagement y crecimiento.",
      "Nuestro objetivo es que tu mensaje suene igual en todas las plataformas y refuerce una sola idea fuerza a lo largo del tiempo.",
    ],
  },
  {
    id: "investigacion-analisis",
    icon: BarChart3,
    title: "Investigación y análisis",
    body:
      "Sondeos de opinión y metodologías cuantitativas y cualitativas para medir tendencias y ajustar estrategias.",
    detail: [
      "Aplicamos encuestas, entrevistas en profundidad y focus groups para entender percepciones, expectativas y barreras del electorado o de tus audiencias clave.",
      "Combinamos datos duros con escucha en redes sociales para detectar tendencias, contrastar hipótesis y ajustar mensajes en tiempo real.",
      "Entregamos informes accionables: qué decir, a quién y por qué canal, con foco en mover indicadores concretos de campaña o gestión.",
    ],
  },
  {
    id: "produccion-visual",
    icon: Palette,
    title: "Producción visual y digital",
    body:
      "Diseño gráfico y audiovisual: piezas que comunican ideas con fuerza y claridad en campaña y gestión.",
    detail: [
      "Trabajamos identidad visual de campaña, sistema de piezas, motion graphics y videos cortos para redes, plataformas y prensa.",
      "Producimos contenido optimizado para cada formato (vertical, cuadrado, horizontal) sin perder coherencia con la marca política o institucional.",
      "Si lo necesitás, integramos producción audiovisual completa: guión, cámara, edición, color y entrega lista para publicar.",
    ],
  },
  {
    id: "gestion-de-crisis",
    icon: ShieldAlert,
    title: "Gestión de crisis",
    body:
      "Manuales preventivos, comunicación en crisis y seguimiento del impacto para proteger la reputación.",
    detail: [
      "Antes de la crisis, construimos manuales internos, mapas de riesgo y guiones de vocería para que el equipo sepa exactamente cómo reaccionar.",
      "Durante el evento, acompañamos la toma de decisiones comunicacionales: definición de portavoces, mensajes pivot, escucha de redes y coordinación con medios.",
      "Después medimos impacto en reputación y diseñamos un plan de recuperación con acciones específicas para reconstruir confianza.",
    ],
  },
  {
    id: "redaccion-contenido",
    icon: FileText,
    title: "Redacción y creación de contenido",
    body:
      "Mensajes persuasivos, discursos y notas de prensa alineados a tus objetivos políticos u organizacionales.",
    detail: [
      "Escribimos discursos, columnas de opinión, notas de prensa y guiones audiovisuales con foco en claridad, ritmo y memorabilidad.",
      "Cada texto se construye sobre la matriz de mensajes acordada y se adapta al tono del vocero y a la audiencia del canal donde se publica.",
      "Podemos sumar revisión editorial recurrente y un banco de frases listas para entrevistas, redes o eventos.",
    ],
  },
  {
    id: "cobertura-fotografica",
    icon: Camera,
    title: "Cobertura fotográfica profesional",
    body:
      "Eventos, campañas y reuniones con imágenes de alta calidad que refuerzan autenticidad y profesionalismo.",
    detail: [
      "Cubrimos actos, recorridas, reuniones con vecinos y encuentros partidarios con criterio editorial: imágenes que refuercen mensaje, cercanía y gestión.",
      "Entregamos selección editada y formatos optimizados para redes y prensa, en plazos ajustados al ciclo de noticias.",
      "Si el proyecto lo requiere, integramos video corto, reels o cobertura multicámara para eventos centrales.",
    ],
  },
  {
    id: "big-data",
    icon: Database,
    title: "Big data analytics",
    body:
      "Análisis de grandes volúmenes de datos para identificar patrones, tendencias y comportamientos de audiencia.",
    detail: [
      "Procesamos datos de redes, encuestas, padrón y consumo de medios para segmentar audiencias y priorizar territorios o públicos clave.",
      "Construimos dashboards y mapas de calor que permiten ver en un vistazo dónde está la oportunidad y dónde el riesgo de la campaña o gestión.",
      "Toda la analítica se traduce en recomendaciones concretas: qué mensaje testear, en qué barrio, con qué pieza y en qué franja horaria.",
    ],
  },
];

const coverageBullets = [
  {
    title: "¿Qué ofrecemos?",
    body:
      "Eventos políticos y gubernamentales: desde grandes actos hasta reuniones estratégicas, reflejando la esencia de cada actividad.",
  },
  {
    title: "¿Cómo lo hacemos?",
    body:
      "Estilo profesional y personalizado: adaptamos el enfoque al tono y los objetivos de tu campaña u organización.",
  },
  {
    title: "Especialización",
    body:
      "Comunicación política: destacamos valores y mensajes clave a través de la imagen y el relato.",
  },
  {
    title: "Equipo técnico",
    body:
      "Cámaras, lentes e iluminación profesional para resultados impecables en entornos exigentes.",
  },
  {
    title: "Enfoque estratégico",
    body:
      "No solo registramos: creamos contenido visual que refuerza tus objetivos comunicacionales.",
  },
] as const;

const politicaTechCapabilities: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Code2,
    title: "Desarrollo a medida",
    body: "Aplicaciones web y automatizaciones alineadas a tu operación política o institucional.",
  },
  {
    icon: ClipboardList,
    title: "Encuestas en línea",
    body: "Flujos multietapa, lógica condicional y captura segura de respuestas para campañas y estudios.",
  },
  {
    icon: Globe,
    title: "Webs de campaña e institucionales",
    body: "Sitios rápidos, claros y medibles: propuesta, agenda, prensa y conversión a contacto o adhesión.",
  },
  {
    icon: Users,
    title: "Focus groups",
    body: "Soporte digital para guiones, registro de insights y materiales para el equipo de estrategia.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards con métricas",
    body: "Visualización en vivo de indicadores: participación, cortes demográficos y lectura de tendencias.",
  },
];

const politicaTechEjemplos = [
  {
    href: "https://compol.cosechacreativa.com.ar/index.html",
    title: "Encuesta Legislativas San Juan",
    description:
      "Experiencia pública de encuesta: datos sociodemográficos, intención de voto y evaluación de gestión.",
    tag: "Encuesta en vivo",
  },
  {
    href: "https://compol.cosechacreativa.com.ar/resultados.html",
    title: "Resultados en vivo",
    description:
      "Panel con totales, distribución por edad, intención de voto y evaluaciones de gestión actualizadas.",
    tag: "Dashboard",
  },
  {
    href: "https://sarmientoreclamos.com.ar/",
    title: "Sarmiento Reclamos",
    description:
      "Mapa interactivo para reportar incidencias en el departamento, microencuestas de gestión y utilidades para vecinos (cortes programados, clima).",
    tag: "Mapa ciudadano",
  },
] as const;

const marqueeWords = [
  "Comunicación política",
  "Campañas",
  "Gestión de crisis",
  "Big data",
  "Cobertura fotográfica",
  "Estrategia digital",
  "San Juan",
  "Compol",
] as const;

function CompolAmbientOrbs({ reduce }: { reduce: boolean }) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 180]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 12]);
  const s1 = useSpring(y1, { stiffness: 45, damping: 28 });
  const s2 = useSpring(y2, { stiffness: 42, damping: 26 });
  const s3 = useSpring(y3, { stiffness: 50, damping: 30 });
  const sr = useSpring(rotate, { stiffness: 40, damping: 28 });

  if (reduce) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[5%] top-[8%] h-[min(48vw,440px)] w-[min(48vw,440px)] rounded-full bg-[#eca8d6]/12 blur-[110px]" />
        <div className="absolute right-[2%] top-[18%] h-[min(42vw,400px)] w-[min(42vw,400px)] rounded-full bg-violet-600/18 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[min(36vw,320px)] w-[min(36vw,320px)] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(236,168,214,0.09),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        style={{ y: s1, rotate: sr }}
        className="absolute -left-[18%] top-[6%] h-[min(58vw,540px)] w-[min(58vw,540px)] rounded-full bg-[#eca8d6]/[0.14] blur-[110px]"
      />
      <motion.div
        style={{ y: s2 }}
        className="absolute -right-[12%] top-[22%] h-[min(50vw,460px)] w-[min(50vw,460px)] rounded-full bg-violet-600/22 blur-[100px]"
      />
      <motion.div
        style={{ y: s3 }}
        className="absolute bottom-[6%] left-[28%] h-[min(44vw,400px)] w-[min(44vw,400px)] rounded-full bg-cyan-500/12 blur-[120px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(236,168,214,0.11),transparent_52%)]" />
      <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}

function MarqueeStrip({ reduce }: { reduce: boolean }) {
  const doubled = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords];

  if (reduce) {
    return (
      <div className="border-y border-white/[0.08] bg-black/25 py-5 backdrop-blur-md">
        <p className="cc-eyebrow-accent mx-auto max-w-[1100px] px-6 text-center text-[11px] text-white/35 lg:px-12">
          {marqueeWords.join(" · ")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-y border-white/[0.08] bg-black/25 py-5 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0a0a0c] to-transparent" />
      <motion.div
        className="flex w-max gap-10 px-4"
        animate={{ x: [0, -1400] }}
        transition={{
          x: { duration: 42, repeat: Infinity, ease: "linear" },
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex items-center gap-10 font-display text-[clamp(1.1rem,2.5vw,1.35rem)] font-medium tracking-tight text-white/[0.22]"
          >
            <span className="whitespace-nowrap">{word}</span>
            <span className="text-[#eca8d6]/50" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ServicesAnimatedBackdrop({ reduce }: { reduce: boolean }) {
  if (reduce) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[20%] top-[-30%] h-[min(100vw,560px)] w-[min(100vw,560px)] rounded-full bg-[#eca8d6]/10 blur-[100px]" />
        <div className="absolute -right-[15%] bottom-[-25%] h-[min(90vw,480px)] w-[min(90vw,480px)] rounded-full bg-violet-600/14 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_30%,rgba(236,168,214,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-[28%] top-[-35%] h-[min(110vw,620px)] w-[min(110vw,620px)] rounded-full bg-[#eca8d6]/[0.13] blur-[120px]"
        animate={{
          x: [0, 42, -18, 0],
          y: [0, 28, 12, 0],
          scale: [1, 1.06, 1.02, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[22%] top-[10%] h-[min(95vw,540px)] w-[min(95vw,540px)] rounded-full bg-violet-600/20 blur-[115px]"
        animate={{
          x: [0, -36, 24, 0],
          y: [0, 48, -20, 0],
          scale: [1, 1.05, 1, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="absolute bottom-[-30%] left-[15%] h-[min(85vw,500px)] w-[min(85vw,500px)] rounded-full bg-fuchsia-500/[0.11] blur-[130px]"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, -40, 10, 0],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_20%,rgba(236,168,214,0.12),transparent_50%)]"
        animate={{ opacity: [0.55, 0.95, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.26] [background-image:linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] [background-size:56px_56px]" />
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
  reduce,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerParent}
      className="max-w-3xl"
    >
      {kicker ? (
        <motion.p
          variants={staggerItem}
          className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-[#eca8d6]/90"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#eca8d6]" aria-hidden />
          {kicker}
        </motion.p>
      ) : null}
      <motion.h2
        variants={staggerItem}
        className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.65rem]"
      >
        <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h2>
      {subtitle ? (
        <motion.p variants={staggerItem} className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

const COMPOL_GALLERY_IMAGES = [
  "/media/compol-gallery/compol-1.jpg",
  "/media/compol-gallery/compol-2.jpg",
  "/media/compol-gallery/compol-3.jpg",
  "/media/compol-gallery/compol-4.jpg",
] as const;

const COBERTURAS_GALLERY_IMAGES = [
  "/compol/28_1x_shots_so.png",
  "/compol/304_1x_shots_so.png",
  "/compol/392_1x_shots_so.png",
  "/compol/446_1x_shots_so.png",
  "/compol/625_1x_shots_so.png",
  "/compol/713_1x_shots_so.png",
] as const;

function CompolGallery({
  images,
  reduce,
  lightboxAriaLabel = "Vista ampliada de la galería",
}: {
  images: readonly string[];
  reduce: boolean;
  lightboxAriaLabel?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const open = (i: number) => setSelectedIndex(i);
  const close = () => setSelectedIndex(null);

  const goNext = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };
  const goPrev = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setSelectedIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, images.length]);

  const getFlex = (i: number) => {
    if (reduce || hoveredIndex === null) return 1;
    return hoveredIndex === i ? 2.2 : 0.6;
  };

  return (
    <>
      <div className="flex h-72 w-full gap-2 md:h-96">
        {images.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#eca8d6]/60"
            style={{ flex: 1 }}
            animate={{ flex: getFlex(i) }}
            transition={{ duration: 0.5, ease: easePremium }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(i)}
            onBlur={() => setHoveredIndex(null)}
            onClick={() => open(i)}
            aria-label={`Ampliar imagen ${i + 1} de ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <motion.div
              className="pointer-events-none absolute inset-0 bg-black"
              initial={false}
              animate={{ opacity: hoveredIndex === i ? 0.05 : 0.4 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxAriaLabel}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:border-[#eca8d6]/40 hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Cerrar"
            >
              <XIcon className="h-5 w-5" aria-hidden />
            </button>

            {images.length > 1 ? (
              <button
                type="button"
                className="absolute left-3 z-10 rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:border-[#eca8d6]/40 hover:bg-white/10 md:left-6"
                onClick={goPrev}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
            ) : null}

            <motion.div
              key={selectedIndex}
              className="relative flex max-h-[88vh] w-full max-w-5xl items-center justify-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: easePremium }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedIndex]}
                alt=""
                className="max-h-[88vh] w-auto max-w-full rounded-lg object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
              />
            </motion.div>

            {images.length > 1 ? (
              <button
                type="button"
                className="absolute right-3 z-10 rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:border-[#eca8d6]/40 hover:bg-white/10 md:right-6"
                onClick={goNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function CompolPageClient() {
  const reduce = useReducedMotion();
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceModal, setServiceModal] = useState<CompolService | null>(null);
  const serviceCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (serviceCloseTimerRef.current) clearTimeout(serviceCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = true;
    if (reduce) {
      v.pause();
      return;
    }
    const tryPlay = () => {
      void v.play().catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, [reduce]);

  function openServiceModal(item: CompolService) {
    if (serviceCloseTimerRef.current) {
      clearTimeout(serviceCloseTimerRef.current);
      serviceCloseTimerRef.current = null;
    }
    setServiceModal(item);
    setServiceDialogOpen(true);
  }

  function handleServiceDialogOpenChange(next: boolean) {
    setServiceDialogOpen(next);
    if (!next) {
      serviceCloseTimerRef.current = setTimeout(() => {
        setServiceModal(null);
        serviceCloseTimerRef.current = null;
      }, 240);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0c] text-white antialiased">
      <CompolAmbientOrbs reduce={Boolean(reduce)} />

      <div className="relative z-10">
        <Navigation />

        {/* Hero */}
        <section className="relative min-h-[88vh] overflow-hidden px-6 pb-20 pt-28 md:min-h-[90vh] md:pb-28 md:pt-32 lg:px-12">
          <video
            ref={heroVideoRef}
            className="pointer-events-none absolute inset-0 z-0 min-h-full w-full min-w-full object-cover"
            src={COMPOL_HERO_VIDEO_SRC}
            autoPlay={!reduce}
            muted
            loop={!reduce}
            playsInline
            preload="auto"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[#0a0a0c]/70"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0c]/85 via-[#0a0a0c]/55 to-[#0a0a0c]/90"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_100%_70%_at_50%_120%,rgba(236,168,214,0.08),transparent_45%)]" />

          <div className="relative z-10 mx-auto flex min-h-[calc(88vh-8rem)] max-w-[1100px] flex-col justify-center md:min-h-[calc(90vh-9rem)]">
            <motion.div
              variants={heroContainer}
              initial={reduce ? false : "hidden"}
              animate={reduce ? undefined : "show"}
              className="relative"
            >
              <motion.div variants={heroLine} className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#eca8d6]/25 bg-[#eca8d6]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#eca8d6]">
                  Compol
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/50">
                  San Juan · Argentina
                </span>
              </motion.div>

              <motion.h1
                variants={heroLine}
                className="mt-8 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.05] tracking-tight"
              >
                <span className="bg-gradient-to-br from-white via-white to-white/55 bg-clip-text text-transparent">
                  Comunicación política
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#eca8d6] via-[#f5cce6] to-violet-300/90 bg-clip-text text-transparent">
                  que se siente y se ve
                </span>
              </motion.h1>

              <motion.p
                variants={heroLine}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl md:leading-relaxed"
              >
                Estrategia, narrativa, datos y producción visual para campañas, gestión pública y equipos
                que necesitan claridad, velocidad y impacto.
              </motion.p>

              <motion.div
                variants={heroLine}
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
              >
                <Button
                  asChild
                  className="h-auto min-h-12 rounded-full border-0 bg-gradient-to-r from-[#eca8d6] to-[#e89bcb] px-8 py-4 text-base font-semibold text-gray-900 shadow-[0_24px_70px_-28px_rgba(236,168,214,0.55)] transition hover:scale-[1.02] hover:shadow-[0_28px_80px_-24px_rgba(236,168,214,0.65)] active:scale-[0.99]"
                >
                  <a href="#contacto-compol">
                    Coordinar una reunión
                    <ArrowUpRight className="h-5 w-5" aria-hidden />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                variants={heroLine}
                className="mt-14 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-10 sm:max-w-2xl sm:gap-6"
              >
                {[
                  { n: "8+", l: "líneas de servicio" },
                  { n: "360°", l: "comunicación" },
                  { n: "24/7", l: "enfoque campaña" },
                ].map((stat) => (
                  <div key={stat.l} className="text-left">
                    <p className="font-display text-2xl font-semibold text-white md:text-3xl">{stat.n}</p>
                    <p className="mt-1 text-xs text-white/45 md:text-sm">{stat.l}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {!reduce ? (
              <motion.a
                href="#equipo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6, ease: easePremium }}
                className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/35 hover:text-white/60"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.25em]">Explorar</span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-6 w-6" aria-hidden />
                </motion.span>
              </motion.a>
            ) : null}
          </div>
        </section>

        <MarqueeStrip reduce={Boolean(reduce)} />

        {/* Equipo */}
        <section id="equipo" className="scroll-mt-28 border-t border-white/10 bg-[#06040d]/75 px-6 py-20 md:py-28 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <SectionTitle
              reduce={Boolean(reduce)}
              kicker="Equipo"
              title="Tenemos equipo"
              subtitle="Especialistas en comunicación política, gubernamental y de campaña."
            />
            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-80px" }}
              variants={sectionReveal}
              className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 shadow-[0_40px_100px_-50px_rgba(236,168,214,0.35)] backdrop-blur-xl md:p-12"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#eca8d6]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
              <p className="relative max-w-3xl text-[15px] leading-relaxed text-white/80 md:text-[17px] md:leading-[1.68]">
                En <strong className="font-semibold text-white">Cosecha Creativa</strong> contamos con un
                equipo especializado en comunicación política, gubernamental y de campaña, comprometido en
                ofrecer <strong className="font-semibold text-[#eca8d6]">soluciones efectivas</strong> para
                alcanzar tus objetivos estratégicos. Desde fortalecer tu presencia política hasta desarrollar
                campañas exitosas, estamos contigo en cada paso del camino.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Galería */}
        <section
          id="galeria"
          className="scroll-mt-28 border-t border-white/10 px-6 py-20 md:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-[1100px]">
            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-80px" }}
              variants={sectionReveal}
            >
              <CompolGallery images={COMPOL_GALLERY_IMAGES} reduce={Boolean(reduce)} />
            </motion.div>
          </div>
        </section>

        {/* Servicios */}
        <section className="relative overflow-hidden border-t border-white/10 px-6 py-20 md:py-28 lg:px-12">
          <ServicesAnimatedBackdrop reduce={Boolean(reduce)} />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0c]/88 via-[#0a0a0c]/45 to-[#0a0a0c]/92"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-[1100px]">
            <SectionTitle
              reduce={Boolean(reduce)}
              kicker="Servicios"
              title="Todo lo que tu mensaje necesita"
              subtitle={
                <>
                  Líneas de trabajo alineadas a la oferta de{" "}
                  <a
                    href="https://cosechacreativa.com.ar/compol/"
                    className="text-[#eca8d6] underline decoration-[#eca8d6]/35 underline-offset-2 transition hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Compol
                  </a>
                  .
                </>
              }
            />

            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerParent}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((item) => (
                <motion.article
                  key={item.id}
                  variants={staggerItem}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          y: -10,
                          transition: { type: "spring", stiffness: 420, damping: 22 },
                        }
                  }
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6",
                    "shadow-[0_28px_90px_-52px_rgba(236,168,214,0.28)] backdrop-blur-md",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => openServiceModal(item)}
                    aria-label={`Ver detalle de ${item.title}`}
                    className="absolute inset-0 z-[3] cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#eca8d6]/60"
                  />
                  <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />

                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.08, rotate: [0, -4, 4, 0] }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="relative mb-4 inline-flex rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-3.5 text-[#eca8d6] shadow-inner"
                  >
                    <item.icon className="h-5 w-5" aria-hidden />
                  </motion.div>
                  <h3 className="relative font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-white/65">{item.body}</p>
                  <div className="relative mt-5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#eca8d6]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Ver en detalle <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Coberturas */}
        <section id="coberturas" className="scroll-mt-28 border-t border-white/10 px-6 py-20 md:py-28 lg:px-12">
          <div className="mx-auto max-w-[1100px]">
            <SectionTitle
              reduce={Boolean(reduce)}
              kicker="Coberturas"
              title="Una imagen vale más que mil palabras"
              subtitle="Cobertura fotográfica profesional para el ámbito político y organizacional."
            />

            <motion.p
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true }}
              variants={sectionReveal}
              className="mt-8 max-w-3xl text-[15px] leading-relaxed text-white/75 md:text-[17px] md:leading-[1.65]"
            >
              Nos adaptamos a tus necesidades para que los momentos clave de tus eventos y campañas queden con
              la mejor calidad visual, con un enfoque que refuerza tu narrativa.
            </motion.p>

            <div className="mt-12 space-y-4">
              {coverageBullets.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={reduce ? false : "hidden"}
                  whileInView={reduce ? undefined : "show"}
                  viewport={{ once: true, margin: "-30px" }}
                  variants={sectionReveal}
                  transition={{ delay: i * 0.06 }}
                  whileHover={reduce ? undefined : { x: 8, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                  className="group relative flex gap-5 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent px-5 py-5 backdrop-blur-sm transition-colors hover:border-[#eca8d6]/25 md:gap-8 md:px-8 md:py-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#eca8d6]/25 bg-[#eca8d6]/10 font-display text-sm font-bold text-[#eca8d6] transition group-hover:scale-110 group-hover:bg-[#eca8d6]/20 md:h-12 md:w-12 md:text-base">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white transition group-hover:text-[#eca8d6]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-[15px]">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
              variants={sectionReveal}
              className="mt-16"
            >
              <CompolGallery
                images={COBERTURAS_GALLERY_IMAGES}
                reduce={Boolean(reduce)}
                lightboxAriaLabel="Vista ampliada de la galería de coberturas"
              />
            </motion.div>
          </div>
        </section>

        {/* Tecnología / software político */}
        <section
          id="tecnologia-politica"
          className="scroll-mt-28 border-t border-white/10 bg-[#06040d]/70 px-6 py-20 md:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-[1100px]">
            <SectionTitle
              reduce={Boolean(reduce)}
              kicker="Tecnología"
              title="Software para la política"
              subtitle="Encuestas, webs, focus groups y tableros con métricas: diseñamos y desarrollamos productos digitales para medir, comunicar y decidir con datos."
            />

            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerParent}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {politicaTechCapabilities.map((item) => (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md md:p-6"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/[0.06] via-transparent to-[#eca8d6]/[0.08] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative mb-3 inline-flex rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-3 text-[#eca8d6] shadow-inner">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="relative font-display text-base font-semibold text-white md:text-lg">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/62">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-40px" }}
              variants={sectionReveal}
              className="mt-14"
            >
              <p className="cc-eyebrow-accent text-center text-[11px] font-semibold text-white/40">
                Ejemplos en producción
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {politicaTechEjemplos.map((demo) => (
                  <motion.a
                    key={demo.href}
                    href={demo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 shadow-[0_24px_70px_-40px_rgba(236,168,214,0.25)] transition-colors hover:border-[#eca8d6]/35 md:p-7"
                  >
                    <span className="inline-flex w-fit rounded-full border border-[#eca8d6]/25 bg-[#eca8d6]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#eca8d6]">
                      {demo.tag}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white transition group-hover:text-[#eca8d6] md:text-xl">
                      {demo.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{demo.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#eca8d6]">
                      Abrir en nueva pestaña
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="contacto-compol"
          className="relative scroll-mt-28 border-t border-white/10 px-6 py-24 md:py-32 lg:px-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06040d] via-black to-black" />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eca8d6]/[0.12] blur-[120px]"
            animate={
              reduce
                ? undefined
                : {
                    scale: [1, 1.08, 1],
                    opacity: [0.35, 0.5, 0.35],
                  }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionReveal}
            className="relative mx-auto max-w-[640px] text-center"
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              ¿Por qué contactarnos?
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-white/72 md:text-[17px] md:leading-relaxed">
              Si sos candidato, funcionario o parte de un equipo político, en{" "}
              <strong className="text-white">Cosecha Creativa</strong> te ayudamos a construir y fortalecer
              tu mensaje con estrategias efectivas de comunicación.
            </p>

            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true }}
              variants={staggerParent}
              className="mt-12 flex flex-col items-stretch gap-3 sm:items-center"
            >
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
                <motion.a
                  variants={staggerItem}
                  href="tel:+5492645468012"
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#eca8d6]/40 hover:bg-white/10"
                >
                  Llamar 264 546-8012
                </motion.a>
                <motion.a
                  variants={staggerItem}
                  href={getWhatsAppHref("Compol — comunicación política")}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#eca8d6] to-[#d946ef] px-8 py-3.5 text-sm font-bold text-gray-900 shadow-[0_20px_50px_-20px_rgba(236,168,214,0.5)]"
                >
                  WhatsApp
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </motion.a>
              </div>

              <motion.a
                variants={staggerItem}
                href="mailto:compol@cosechacreativa.com.ar"
                className="text-sm font-medium text-[#eca8d6] underline decoration-[#eca8d6]/40 underline-offset-4 transition hover:text-white"
              >
                compol@cosechacreativa.com.ar
              </motion.a>
              <motion.a
                variants={staggerItem}
                href="https://www.instagram.com/cosecha.creativa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 transition hover:text-white"
              >
                @cosecha.creativa
              </motion.a>
              <motion.div variants={staggerItem}>
                <Link
                  href="/#contacto"
                  className="mt-2 inline-block text-sm text-white/40 underline-offset-4 transition hover:text-white/80 hover:underline"
                >
                  Formulario general del sitio
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <Dialog open={serviceDialogOpen} onOpenChange={handleServiceDialogOpenChange}>
          <DialogContent
            key={serviceModal?.id ?? "compol-service-dialog"}
            showCloseButton
            className={cn(
              "!flex !flex-col z-[502] w-[calc(100%-1.25rem)] max-w-lg gap-0 overflow-hidden border border-white/20 bg-[#18161f] p-0 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_32px_120px_-24px_rgba(0,0,0,0.75)] sm:rounded-2xl",
              "min-h-[min(52vh,420px)] max-h-[min(92vh,760px)]",
              "[&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:bg-white/15 [&_[data-slot=dialog-close]]:hover:text-white",
            )}
          >
            {serviceModal ? (
              <>
                <div className="shrink-0 border-b border-white/15 px-6 pb-4 pt-6 pr-14">
                  <DialogHeader className="space-y-3 text-left">
                    <div className="inline-flex items-center gap-3">
                      <span className="inline-flex rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-2.5 text-[#eca8d6] shadow-inner">
                        <serviceModal.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#eca8d6]">
                        Servicio Compol
                      </p>
                    </div>
                    <DialogTitle className="font-display text-xl leading-snug !text-white sm:text-2xl">
                      {serviceModal.title}
                    </DialogTitle>
                    <DialogDescription className="!text-white/70 text-left text-sm leading-relaxed">
                      {serviceModal.body}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="min-h-[200px] flex-1 overflow-y-auto overscroll-contain px-6 py-5">
                  <div className="space-y-4">
                    {serviceModal.detail.map((paragraph, i) => (
                      <p key={i} className="text-[15px] leading-relaxed text-white/90">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <DialogFooter className="shrink-0 gap-3 border-t border-white/15 bg-black/40 px-6 py-4 sm:flex-row sm:justify-end sm:space-x-0">
                  <Button
                    className="w-full bg-gradient-to-r from-[#eca8d6] to-[#e89bcb] font-semibold text-gray-900 hover:opacity-95 sm:w-auto"
                    asChild
                  >
                    <Link
                      href="#contacto-compol"
                      onClick={() => handleServiceDialogOpenChange(false)}
                    >
                      Consultar por este servicio
                    </Link>
                  </Button>
                </DialogFooter>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        <FooterSection />
      </div>
    </main>
  );
}
