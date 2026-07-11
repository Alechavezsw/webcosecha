"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

const AUTO_PLAY_DURATION = 6000

const AREAS = [
  {
    id: "redes",
    tabId: "01",
    title: "Diseño para redes sociales",
    description:
      "Las redes necesitan contenido constante, pero también una estética clara y reconocible. En Cosecha Creativa diseñamos publicaciones que respetan la identidad de tu marca y ayudan a transmitir mensajes de forma simple, atractiva y profesional. Creamos diseños para informar, promocionar, vender, educar y conectar con tu comunidad.",
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "publicitario",
    tabId: "02",
    title: "Diseño publicitario digital",
    description:
      "Diseñamos piezas pensadas para campañas digitales, promociones, lanzamientos y anuncios pagos. Cada diseño busca captar la atención del público y guiarlo hacia una acción concreta: consultar, comprar, reservar, visitar una web o seguir tu marca. Porque en internet tenés pocos segundos para llamar la atención. Nosotros hacemos que esos segundos trabajen para vos.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "institucional",
    tabId: "03",
    title: "Diseño institucional digital",
    description:
      "También desarrollamos materiales digitales para empresas, profesionales e instituciones que necesitan presentarse de forma clara y profesional. Creamos presentaciones, propuestas comerciales, catálogos, portfolios, placas informativas y piezas institucionales listas para enviar, publicar o compartir.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
  },
] as const

const HASH_IDS = AREAS.map((a) => a.id)

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
}

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

export function DisenoVerticalTabs() {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handleNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % AREAS.length)
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + AREAS.length) % AREAS.length)
  }, [])

  const updateHash = (index: number) => {
    const id = HASH_IDS[index]
    if (typeof window !== "undefined" && window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`)
    }
  }

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setIsPaused(false)
    updateHash(index)
  }

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "")
      const idx = HASH_IDS.indexOf(hash as (typeof HASH_IDS)[number])
      if (idx >= 0) {
        setActiveIndex((prev) => {
          if (prev !== idx) setDirection(idx > prev ? 1 : -1)
          return idx
        })
      }
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [])

  useEffect(() => {
    if (isPaused || reduceMotion) return

    const interval = setInterval(() => {
      handleNext()
    }, AUTO_PLAY_DURATION)

    return () => clearInterval(interval)
  }, [activeIndex, isPaused, reduceMotion, handleNext])

  const active = AREAS[activeIndex]
  const variants = reduceMotion ? fadeVariants : slideVariants

  return (
    <section
      id={active.id}
      className="diseno-section diseno-section-glow scroll-mt-24 px-6 py-16 md:py-20 lg:px-12 lg:py-28"
    >
      <motion.div
        className="mx-auto w-full max-w-[1400px]"
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 flex flex-col justify-center pt-2 lg:order-1 lg:col-span-5">
            <div className="mb-10 space-y-1 md:mb-12">
              <span className="cc-eyebrow-accent ml-0.5 block">
                (Áreas de diseño)
              </span>
              <h2 className="cc-section-title text-balance font-medium tracking-tighter text-white">
                Cómo potenciamos tu marca
              </h2>
            </div>

            <div className="flex flex-col space-y-0">
              {AREAS.map((area, index) => {
                const isActive = activeIndex === index
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 border-t border-white/10 py-6 text-left transition-all duration-500 first:border-0 md:py-8",
                      isActive ? "text-white" : "text-white/45 hover:text-white/80",
                    )}
                  >
                    <div className="absolute top-0 bottom-0 left-[-16px] w-[2px] bg-white/10 md:left-[-24px]">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute top-0 left-0 w-full origin-top bg-[#eca8d6]"
                          initial={{ height: "0%" }}
                          animate={isPaused || reduceMotion ? { height: "0%" } : { height: "100%" }}
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span className="mt-1 text-[9px] font-medium tabular-nums opacity-50 md:text-[10px]">
                      /{area.tabId}
                    </span>

                    <div className="flex flex-1 flex-col gap-2">
                      <span
                        className={cn(
                          "font-display text-2xl font-normal tracking-tight transition-colors duration-500 md:text-3xl lg:text-4xl",
                          isActive && "text-white",
                        )}
                      >
                        {area.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-md pb-2 text-sm leading-relaxed font-normal text-white/65 md:text-base">
                              {area.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="order-1 flex h-full flex-col justify-end lg:order-2 lg:col-span-7">
            <div
              className="group/gallery relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_32px_80px_-24px_rgba(236,168,214,0.35)] md:aspect-4/3 md:rounded-[2.5rem] lg:aspect-[16/11]">
                <div
                  className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(236,168,214,0.12)_0%,transparent_55%)]"
                  aria-hidden
                />

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={
                      reduceMotion
                        ? { opacity: { duration: 0.35 } }
                        : {
                            y: { type: "spring", stiffness: 260, damping: 32 },
                            opacity: { duration: 0.4 },
                          }
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer"
                    onClick={handleNext}
                  >
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/gallery:scale-[1.04]"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority={activeIndex === 0}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                      <p className="cc-eyebrow-accent text-[10px]">
                        {active.tabId} · {active.id}
                      </p>
                      <p className="mt-2 font-display text-xl text-white md:text-2xl">{active.title}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute right-6 bottom-6 z-20 flex gap-2 md:right-8 md:bottom-8 md:gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrev()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 active:scale-90 md:h-12 md:w-12"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 active:scale-90 md:h-12 md:w-12"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
