"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type KineticLine = {
  text: string;
  /** Clases de la línea (ej. el degradado de la segunda línea del titular). */
  className?: string;
  /**
   * Cómo entra la línea. Con `bg-clip-text` hay que usar "line": partir el
   * texto en palabras mete cajas inline-block dentro del recorte del degradado
   * y el titular puede quedar invisible.
   */
  mode?: "words" | "line";
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const word = {
  hidden: { y: "0.9em", opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Titular que se arma palabra por palabra cuando entra en pantalla: cada una
 * sube desde abajo saliendo de foco, escalonada.
 *
 * Cada línea va en un contenedor con `overflow-hidden` para que las palabras
 * aparezcan *desde detrás del borde* en vez de asomar flotando.
 */
export function KineticHeading({
  lines,
  className,
  as: Tag = "h2",
  id,
}: {
  lines: KineticLine[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {lines.map((line) => (
          <span key={line.text} className={cn("block", line.className)}>
            {line.text}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className}>
      <motion.span
        className="block"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        {lines.map((line) => {
          const words = line.text.split(" ");
          return (
            <span key={line.text} className="block overflow-hidden pb-[0.08em]">
              {line.mode === "line" ? (
                <motion.span variants={word} className={cn("block will-change-transform", line.className)}>
                  {line.text}
                </motion.span>
              ) : (
                <span className={cn("block", line.className)}>
                  {words.map((w, i) => (
                    <span key={`${w}-${i}`} className="inline-block whitespace-pre">
                      <motion.span variants={word} className="inline-block will-change-transform">
                        {w}
                      </motion.span>
                      {i < words.length - 1 ? " " : null}
                    </span>
                  ))}
                </span>
              )}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
