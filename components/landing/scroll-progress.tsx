"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra de progreso de lectura fija arriba — misma receta que las páginas de servicios. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#eca8d6] via-[#a100f2] to-[#67e8f9]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
