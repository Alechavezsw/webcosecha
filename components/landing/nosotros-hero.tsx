"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Nosotros3dCover } from "./nosotros-3d-cover";

const easePremium = [0.22, 1, 0.36, 1] as const;

/** Imagen en `public/` */
const HERO_IMAGE_SRC = "/nosotros-cover.png";

export function NosotrosHero({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <section className={cn("relative pt-24 pb-20 md:pt-32 md:pb-28", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(236,168,214,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_60%,rgba(124,58,237,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-12">
        {/* Banda visual: ocupa todo el ancho del contenedor y se ve claramente */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easePremium }}
          className="relative aspect-[20/12] w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_32px_100px_-48px_rgba(0,0,0,0.95)] sm:aspect-[2.2/1] md:aspect-[2.5/1] md:min-h-[260px] lg:min-h-[300px]"
        >
          {/* Componente 3D interactivo vinculado al scroll global */}
          <Nosotros3dCover />

          {/* Imagen de fondo / fallback elegante para SEO y cuando WebGL está cargando/no disponible */}
          <Image
            src={HERO_IMAGE_SRC}
            alt="Equipo y trabajo creativo en Cosecha Creativa, San Juan"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-[center_28%] pointer-events-none -z-10"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/35 to-transparent md:from-[#050506]/90 md:via-black/25 z-10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-10" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 z-10" />
        </motion.div>

        {/* Tarjeta superpuesta (vidrio) */}
        <Card
          className={cn(
            "relative z-20 -mt-10 gap-0 overflow-hidden border border-white/15 bg-[#070709]/90 py-0 text-white shadow-[0_28px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:-mt-14 md:-mt-20 md:mx-auto md:max-w-[920px]",
          )}
        >
          <CardHeader className="space-y-4 px-6 pb-2 pt-8 md:px-10 md:pt-10 lg:px-12">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-[#eca8d6]/90">
              Nosotros
            </p>
            <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              Innovación y tecnología para tu negocio
            </h1>
            <p className="max-w-xl pt-1 text-sm text-white/55 md:text-[15px]">
              Estrategia, diseño y desarrollo desde San Juan.
            </p>
          </CardHeader>

          <CardContent className="space-y-3 px-6 pb-2 pt-1 md:px-10 lg:px-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: easePremium }}
              className="max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
            >
              <p>
                Cada proyecto es único. Diseñamos soluciones a medida para las necesidades reales de tu
                empresa. Desde San Juan acompañamos a marcas que quieren crecer en el entorno digital.
              </p>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-4 border-t border-white/10 bg-black/20 px-6 py-8 md:px-10 lg:px-12">
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                className="h-auto min-h-11 rounded-full border-0 bg-[#eca8d6] px-7 py-3.5 text-base font-semibold text-gray-900 shadow-[0_20px_60px_-28px_rgba(236,168,214,0.55)] hover:bg-[#f0bcdf]"
              >
                <Link href="/#contacto">
                  Hablar con el equipo
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto min-h-11 rounded-full border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                <Link href="/servicios/consultoria-estrategica">Servicios</Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
