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
  // El escenario fijado reemplaza la lista salvo con movimiento reducido.
  const drum = !reduceMotion;
  const COUNT_WORDS = ["Cero", "Un", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho"];
  const countWord = COUNT_WORDS[members.length] ?? String(members.length);

  return (
    <section className="relative overflow-x-clip bg-[#0d0710]/85 py-16 md:py-24">
      {/* Fondo rosa + líneas horizontales: cierra el recorrido volviendo al color de marca. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_-10%,rgba(236,168,214,0.24),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_8%_100%,rgba(236,168,214,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:100%_36px]"
        aria-hidden
      />
      {/* La línea del corte la dibuja el <SectionDivider color="rose"> de arriba. */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(236,168,214,0.06),transparent_55%)]" />

        <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#eca8d6]">
            Equipo
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[2.6rem] font-semibold leading-[0.92] tracking-tight sm:text-6xl lg:text-[5rem]">
            Las
            <span className="italic text-[#eca8d6]"> personas</span>{" "}
            <span className="block text-white/30">detrás de cada proyecto</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-[17px]">
            {countWord} perfiles complementarios: dirección y desarrollo, estrategia de marketing,
            comunidad, fotografía y diseño.{" "}
            <span className="text-white/40">
              {drum ? "Deslizá para conocerlos." : "Pasá el cursor sobre cada nombre para conocerlos."}
            </span>
          </p>

          {!drum && (
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
          )}
        </div>
      </div>

      {drum && <TeamDrum members={members} />}

      {showFloatCard && !drum && (
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
                className="relative w-80 overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0c] shadow-[0_24px_80px_-32px_rgba(236,168,214,0.35)]"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <TeamPreviewMedia member={activeMember} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/20 to-transparent" />
                </div>
                <div className="w-full border-t border-white/10 p-4">
                  <p className="font-display text-lg font-semibold leading-tight text-white">
                    {activeMember.name}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#eca8d6]/95">
                    {activeMember.role}
                  </p>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">
                    {activeMember.bio}
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

/** Giro entre nombres consecutivos del tambor (grados). */
const DRUM_STEP = 26;

/**
 * Escenario del equipo: la sección queda fijada y los nombres giran en un
 * tambor 3D con el scroll. El que pasa por el frente se enciende y la ficha
 * de la derecha cambia a esa persona. Una lista con hover no se descubre en
 * celular y en escritorio pide adivinar que hay algo detrás del nombre.
 */
function TeamDrum({ members }: { members: NosotrosTeamMember[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const n = members.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    let running = false;
    let shown = -1;
    let t = 0;
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const target = () => {
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      return { p, t: clamp((p - 0.04) / 0.86) * (n - 1) };
    };
    t = target().t;

    const frame = () => {
      raf = running ? requestAnimationFrame(frame) : 0;
      const tg = target();
      t += (tg.t - t) * 0.14;
      const radius = window.innerWidth < 768 ? 150 : 260;
      for (let i = 0; i < n; i++) {
        const el = nameRefs.current[i];
        if (!el) continue;
        const d = i - t;
        const ad = Math.abs(d);
        el.style.transform = `translate3d(0, -50%, 0) rotateX(${(-d * DRUM_STEP).toFixed(2)}deg) translateZ(${radius}px)`;
        el.style.opacity = clamp(1 - ad * 0.36).toFixed(3);
        // El del frente en rosa pleno; el resto se apaga hacia gris.
        const lit = clamp(1 - ad * 1.6);
        el.style.color = `rgba(${Math.round(255 - lit * 19)}, ${Math.round(255 - lit * 87)}, ${Math.round(255 - lit * 41)}, ${(0.28 + lit * 0.72).toFixed(3)})`;
        el.style.filter = ad > 0.6 ? `blur(${Math.min(4, (ad - 0.6) * 2.4).toFixed(2)}px)` : "";
        el.style.pointerEvents = ad < 0.5 ? "auto" : "none";
      }
      if (barRef.current) barRef.current.style.transform = `scaleY(${tg.p.toFixed(4)})`;
      const a = Math.min(n - 1, Math.max(0, Math.round(t)));
      if (a !== shown) {
        shown = a;
        setActive(a);
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!e.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(root);
    running = true;
    frame();
    running = false;
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [n]);

  const member = members[active];

  return (
    <div ref={rootRef} className="relative" style={{ height: `${n * 70 + 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-6 px-6 md:gap-10 lg:grid-cols-12 lg:px-12">
          {/* Tambor de nombres. */}
          {/* Los extremos del tambor se funden con máscara: el fondo de la sección
              es translúcido, así que un degradado de color se vería como una caja. */}
          <div className="relative h-[34svh] [mask-image:linear-gradient(to_bottom,transparent,black_28%,black_72%,transparent)] [perspective:1100px] md:h-[60svh] lg:col-span-7">
            {/* Franja de foco: marca la posición del frente del tambor. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 h-[4.5rem] -translate-y-1/2 border-y border-[#eca8d6]/15 bg-[linear-gradient(90deg,rgba(236,168,214,0.07),transparent_70%)] md:h-28"
            />
            <div
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{ transform: `translateZ(${-260}px)` }}
            >
              {members.map((m, i) => (
                <div
                  key={m.id}
                  ref={(el) => {
                    nameRefs.current[i] = el;
                  }}
                  className="absolute inset-x-0 top-1/2 flex items-baseline gap-4 [backface-visibility:hidden] will-change-transform md:gap-8"
                >
                  <span className="font-mono text-xs tabular-nums opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[2.4rem] font-semibold leading-none tracking-tight sm:text-6xl lg:text-[5.4rem]">
                    {m.link ? (
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {m.name}
                      </a>
                    ) : (
                      m.name
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ficha de la persona del frente. */}
          <div className="relative lg:col-span-5">
            <div className="absolute -left-6 top-0 hidden h-full w-px bg-white/10 lg:block" aria-hidden>
              <span ref={barRef} className="absolute inset-0 origin-top bg-[#eca8d6]" style={{ transform: "scaleY(0)" }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 24, rotateY: -12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, rotateY: 10, filter: "blur(8px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 900 }}
                className="overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0c]/90 shadow-[0_30px_90px_-40px_rgba(236,168,214,0.45)]"
              >
                <div className="relative h-40 w-full overflow-hidden sm:h-56 md:h-64">
                  <TeamPreviewMedia member={member} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/10 to-transparent" />
                  <span className="absolute bottom-3 right-4 font-mono text-[11px] tabular-nums text-white/55">
                    {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5 md:p-7">
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#eca8d6]">
                    {member.role}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold leading-tight text-white md:text-3xl">
                    {member.name}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/65 md:text-[15px]">{member.bio}</p>
                  {member.link && (
                    <a
                      href={member.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#eca8d6] transition-colors hover:text-white"
                    >
                      Conocer más
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
