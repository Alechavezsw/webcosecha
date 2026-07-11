"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Minus, Plus } from "lucide-react";

export type NosotrosTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  /** Opcional: foto (local `/…` o URL remota). Sin foto se muestran iniciales. */
  image?: string;
  link?: string;
};

const springConfig = { damping: 22, stiffness: 180, mass: 0.45 };

function TeamPreviewMedia({ member }: { member: NosotrosTeamMember }) {
  if (member.image) {
    return (
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="320px"
        className="object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#eca8d6]/25 via-violet-600/20 to-black">
      <span className="font-display text-5xl font-semibold text-white/90">{member.initials}</span>
    </div>
  );
}

export function NosotrosTeamKineticSection({ members }: { members: NosotrosTeamMember[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile || reduceMotion) return;
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  const activeMember = members.find((m) => m.id === activeId);

  const showFloatCard = !isMobile && !reduceMotion;

  return (
    <section className="relative bg-[#060607]/40 py-16 md:py-24">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(236,168,214,0.06),transparent_55%)]" />

        <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]/85">
            Equipo
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Nosotros</h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/68">
            Marketing digital, desarrollo, diseño, fotografía y estrategia en un mismo equipo.
          </p>

          <div className="mt-12 flex flex-col">
            {members.map((member, index) => (
              <TeamRow
                key={member.id}
                data={member}
                index={index}
                isActive={activeId === member.id}
                setActiveId={setActiveId}
                isMobile={isMobile}
                isAnyActive={activeId !== null}
                reduceMotion={reduceMotion ?? false}
              />
            ))}
          </div>
        </div>
      </div>

      {showFloatCard && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeId && activeMember && (
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative h-64 w-80 overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0c] shadow-[0_24px_80px_-32px_rgba(236,168,214,0.35)]"
              >
                <TeamPreviewMedia member={activeMember} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-transparent" />
                <div className="absolute bottom-0 w-full p-4">
                  <p className="font-display text-lg font-semibold leading-tight text-white">
                    {activeMember.name}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#eca8d6]/95">
                    {activeMember.role}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
  reduceMotion,
}: {
  data: NosotrosTeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
  reduceMotion: boolean;
}) {
  const isDimmed = !reduceMotion && isAnyActive && !isActive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: isDimmed ? 0.35 : 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      onMouseEnter={() => !isMobile && !reduceMotion && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && !reduceMotion && setActiveId(null)}
      onClick={() => isMobile && setActiveId(isActive ? null : data.id)}
      className={`group relative border-t border-white/10 transition-colors duration-300 last:border-b last:border-white/10 ${
        isMobile ? "cursor-pointer" : "cursor-default"
      } ${isActive && isMobile ? "bg-white/[0.03]" : ""}`}
    >
      <div className="relative z-10 flex flex-col py-7 md:flex-row md:items-center md:justify-between md:py-10">
        <div className="flex items-baseline gap-4 pl-1 transition-transform duration-500 group-hover:translate-x-1 md:gap-10 md:pl-0 md:group-hover:translate-x-3">
          <span className="font-mono text-xs tabular-nums text-white/35">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white/45 transition-colors duration-300 group-hover:text-white md:text-5xl md:font-medium">
            {data.link ? (
              <a 
                href={data.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#eca8d6] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {data.name}
              </a>
            ) : (
              data.name
            )}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between gap-6 pl-9 pr-1 md:mt-0 md:justify-end md:pl-0 md:pr-0">
          <span className="max-w-[14rem] text-left text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 transition-colors group-hover:text-[#eca8d6]/85 md:max-w-none md:text-right">
            {data.role}
          </span>

          <div className="flex shrink-0 items-center gap-3 text-white/50 md:text-white">
            <div className="md:hidden">
              {isActive ? <Minus size={18} /> : <Plus size={18} />}
            </div>
            <motion.div
              animate={{ x: isActive && !isMobile ? 0 : -8, opacity: isActive && !isMobile ? 1 : 0 }}
              className="hidden text-[#eca8d6] md:block"
            >
              <ArrowUpRight size={26} strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5 bg-black/25"
          >
            <div className="p-4 pb-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                {data.link ? (
                  <a href={data.link} target="_blank" rel="noopener noreferrer">
                    <TeamPreviewMedia member={data} />
                  </a>
                ) : (
                  <TeamPreviewMedia member={data} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-white/62">{data.bio}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
