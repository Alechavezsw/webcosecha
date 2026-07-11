"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { DevelopersMouseParticles } from "@/components/landing/developers-mouse-particles";

const easePremium = [0.22, 1, 0.36, 1] as const;

const MotionLink = motion.create(Link);

const pillars = [
  {
    title: "Estrategia digital",
    description:
      "Diseñamos planes de acción claros para posicionar tu marca, atraer clientes y ordenar tu comunicación.",
    href: "/servicios/consultoria-estrategica",
    linkLabel: "Consultoría estratégica",
  },
  {
    title: "Contenido que vende",
    description:
      "Creamos piezas, copys, campañas, reels y mensajes pensados para generar confianza, consultas y ventas.",
    href: "/servicios/gestion-de-redes-sociales",
    linkLabel: "Gestión de redes",
  },
  {
    title: "Webs y sistemas",
    description:
      "Desarrollamos sitios web, landing pages, e-commerce, paneles administrativos y software a medida.",
    href: "/servicios/diseno-web",
    linkLabel: "Diseño web",
  },
  {
    title: "Automatización con IA",
    description:
      "Conectamos agentes inteligentes con WhatsApp, formularios, CRM, planillas y herramientas de tu empresa.",
    href: "/servicios/ia",
    linkLabel: "Cosecha Creativa IA",
  },
] as const;

const headerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
};

const headerChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easePremium },
  },
};

const titleLine: Variants = {
  hidden: { opacity: 0, y: 36, rotateX: -8 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.78, ease: easePremium },
  },
};

const bodyReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easePremium, delay: 0.08 },
  },
};

const pillarGrid: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.18 },
  },
};

const pillarCard: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easePremium },
  },
};

export function DevelopersSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /** Parallax: imagen derecha se mueve más lento que el scroll */
  const imageParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [48, -72],
  );
  const imageParallaxScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [1.06, 1.02, 1],
  );

  /** Ligero contramovimiento del bloque de texto para profundidad */
  const contentShiftY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, -28],
  );

  return (
    <section
      id="developers"
      ref={sectionRef}
      className="cc-aura cc-aura-cyan relative overflow-hidden py-24 lg:py-32"
    >
      {/* Capas decorativas — pulso muy suave */}
      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-[20%] top-[15%] h-[min(55vw,520px)] w-[min(55vw,520px)] rounded-full bg-[#eca8d6]/[0.07] blur-[120px]"
            aria-hidden
            animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute bottom-[10%] right-[5%] h-[min(45vw,400px)] w-[min(45vw,400px)] rounded-full bg-foreground/[0.04] blur-[100px]"
            aria-hidden
            animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}

      <DevelopersMouseParticles containerRef={sectionRef} disabled={reduce === true} />

      {/* Imagen — parallax + fade al entrar */}
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 z-[3] h-[85%] w-[55%]"
        style={{ y: imageParallaxY, scale: imageParallaxScale }}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: easePremium }}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-left-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12"
        style={{ y: contentShiftY }}
      >
        <motion.div
          className="mb-16"
          variants={reduce ? undefined : headerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px", amount: 0.25 }}
        >
          <motion.span
            variants={reduce ? undefined : headerChild}
            className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-muted-foreground"
          >
            <motion.span
              className="h-px w-8 bg-foreground/30"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easePremium }}
            />
            Marketing Digital + IA
          </motion.span>
          <h2 className="sr-only">
            Escalamos tu empresa. O la preparamos para escalar.
          </h2>
          <motion.span
            aria-hidden
            className="block max-w-3xl cursor-default font-display text-2xl leading-[1.1] tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl [perspective:800px]"
            variants={reduce ? undefined : titleLine}
            whileHover={reduce ? {} : { x: 4, transition: { duration: 0.35, ease: easePremium } }}
          >
            Escalamos tu empresa.
          </motion.span>
          <motion.span
            aria-hidden
            className="block max-w-3xl cursor-default font-display text-2xl leading-[1.1] tracking-tight text-muted-foreground sm:text-3xl md:text-4xl lg:text-5xl [perspective:800px]"
            variants={reduce ? undefined : titleLine}
            whileHover={
              reduce
                ? {}
                : {
                    x: 4,
                    color: "var(--foreground)",
                    transition: { duration: 0.35, ease: easePremium },
                  }
            }
          >
            O la preparamos para escalar.
          </motion.span>
        </motion.div>

        <motion.div
          className="max-w-full lg:max-w-[52%]"
          variants={reduce ? undefined : bodyReveal}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, margin: "-50px", amount: 0.2 }}
        >
          <div className="mb-12 max-w-xl space-y-6 text-xl leading-relaxed text-muted-foreground">
            <p>
              Creamos estrategias digitales, sitios web, contenido, automatizaciones y sistemas con
              inteligencia artificial para que tu empresa venda más, trabaje mejor y comunique con
              más claridad.
            </p>
            <p>
              No hacemos marketing suelto. Conectamos estrategia, creatividad y tecnología para
              convertir tu presencia digital en una herramienta real de crecimiento.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-6 gap-y-8 sm:grid-cols-2"
            variants={reduce ? undefined : pillarGrid}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={{ once: true, margin: "-40px" }}
          >
            {pillars.map((pillar) => (
              <MotionLink
                key={pillar.title}
                href={pillar.href}
                scroll
                variants={reduce ? undefined : pillarCard}
                whileHover={
                  reduce
                    ? {}
                    : {
                        y: -4,
                        transition: { duration: 0.28, ease: easePremium },
                      }
                }
                className="group block rounded-xl border border-foreground/[0.06] bg-background/[0.02] p-4 backdrop-blur-[2px] outline-none transition-shadow duration-300 hover:border-foreground/10 hover:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <h3 className="mb-2 font-display text-lg text-foreground md:text-xl">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {pillar.linkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </MotionLink>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
