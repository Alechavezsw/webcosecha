"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PortfolioGalleryImage {
  src: string;
  alt: string;
  title?: string;
}

export interface PortfolioGalleryProps {
  title?: string;
  archiveButton?: {
    text: string;
    href: string;
  };
  images?: PortfolioGalleryImage[];
  className?: string;
  /** Altura máxima base para el escalonado 3D (desktop). */
  maxHeight?: number;
  spacing?: string;
  onImageClick?: (index: number) => void;
  pauseOnHover?: boolean;
  /** @deprecated Usar dos copias internas para el marquee; se conserva por compatibilidad. */
  marqueeRepeat?: number;
  /** Sin título, sin botón y layout más compacto (solo galería). */
  hideHeader?: boolean;
  sectionId?: string;
}

export function PortfolioGallery({
  title = "Browse my library",
  archiveButton = {
    text: "View gallery",
    href: "/work",
  },
  images: customImages,
  className,
  maxHeight = 120,
  spacing = "-space-x-72 md:-space-x-80",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat: _marqueeRepeat = 4,
  hideHeader = false,
  sectionId,
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const defaultImages: PortfolioGalleryImage[] = [
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
      alt: "SaaS Dashboard Design",
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
      alt: "Web Development",
    },
    {
      src: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop&q=80",
      alt: "E-Commerce Platform",
    },
    {
      src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&q=80",
      alt: "Mobile App Design",
    },
    {
      src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=80",
      alt: "Brand Identity",
    },
    {
      src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&q=80",
      alt: "Marketing Campaign",
    },
    {
      src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80",
      alt: "Product Photography",
    },
    {
      src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop&q=80",
      alt: "Packaging Design",
    },
    {
      src: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop&q=80",
      alt: "Tech Innovation",
    },
    {
      src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=80",
      alt: "Future Vision",
    },
  ];

  const images = customImages ?? defaultImages;

  return (
    <section
      aria-label={hideHeader ? "Galería de capturas" : title}
      id={sectionId}
      className={cn(
        "relative px-4",
        hideHeader ? "min-h-0 py-0" : "min-h-screen py-20",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-background/50 backdrop-blur-sm",
          hideHeader &&
            "max-w-[min(100%,1320px)] border-0 bg-transparent shadow-none backdrop-blur-none",
        )}
      >
        {!hideHeader ? (
          <div className="relative z-10 px-8 pb-8 pt-16 text-center">
            <h2 className="mb-8 text-balance text-4xl font-bold text-foreground md:text-6xl">{title}</h2>

            <Link
              href={archiveButton.href}
              className="group mb-20 inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <span>{archiveButton.text}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : null}

        <div
          className={cn(
            "relative hidden overflow-hidden md:block",
            hideHeader ? "h-[340px] -mb-[140px]" : "h-[400px] -mb-[200px]",
          )}
        >
          <div
            className={cn(
              "flex items-end justify-center pb-8",
              hideHeader ? "pt-24" : "pt-40",
              spacing,
            )}
          >
            {images.map((image, index) => {
              const totalImages = images.length;
              const middle = Math.floor(totalImages / 2);
              const distanceFromMiddle = Math.abs(index - middle);
              const staggerOffset = maxHeight - distanceFromMiddle * 20;

              const zIndex = totalImages - index;

              const isHovered = hoveredIndex === index;
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

              const yOffset = isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset;

              return (
                <motion.div
                  key={`${image.src}-${index}`}
                  className="group flex-shrink-0 cursor-pointer"
                  style={{ zIndex }}
                  initial={{
                    transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`,
                    opacity: 0,
                  }}
                  animate={{
                    transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onClick={() => onImageClick?.(index)}
                >
                  <div
                    className="relative aspect-video w-64 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105 md:w-80 lg:w-96"
                    style={{
                      boxShadow: `
                        rgba(0, 0, 0, 0.01) 0.796192px 0px 0.796192px 0px,
                        rgba(0, 0, 0, 0.03) 2.41451px 0px 2.41451px 0px,
                        rgba(0, 0, 0, 0.08) 6.38265px 0px 6.38265px 0px,
                        rgba(0, 0, 0, 0.25) 20px 0px 20px 0px
                      `,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="h-full w-full object-cover object-left-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className={cn("relative block overflow-hidden pb-8 md:hidden", hideHeader && "pb-4")}>
          <div
            className={cn(
              "group flex w-max gap-4 p-2 marquee",
              pauseOnHover && "hover:[animation-play-state:paused]",
            )}
          >
            {[0, 1].map((dup) =>
              images.map((image, index) => (
                <div
                  key={`${dup}-${image.src}-${index}`}
                  className="group w-[min(16rem,72vw)] shrink-0 cursor-pointer"
                  onClick={() => onImageClick?.(index)}
                >
                  <div
                    className="relative aspect-video w-full overflow-hidden rounded-lg transition-transform duration-300 group-active:scale-[1.02]"
                    style={{
                      boxShadow: `
                        rgba(0, 0, 0, 0.01) 0.796192px 0px 0.796192px 0px,
                        rgba(0, 0, 0, 0.03) 2.41451px 0px 2.41451px 0px,
                        rgba(0, 0, 0, 0.08) 6.38265px 0px 6.38265px 0px,
                        rgba(0, 0, 0, 0.25) 20px 0px 20px 0px
                      `,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="h-full w-full object-cover object-left-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
