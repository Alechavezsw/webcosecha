"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Túnel de historias: la sección queda fijada mientras se scrollea y la cámara
 * viaja por dentro de una espiral de piezas reales. Es CSS 3D (no WebGL) para
 * que las imágenes se vean nítidas y sigan siendo <img> del documento.
 *
 * El scroll se lee del rect de la sección, así que funciona igual con Lenis o
 * con el scroll nativo. Sólo anima mientras la sección está en pantalla.
 */

/** Separación en profundidad entre piezas consecutivas (px). */
const GAP_Z = 300;
/** Giro entre piezas consecutivas: ~7 piezas por vuelta de espiral. */
const STEP_ANGLE = 0.9;
/** Profundidad desde la que arranca la cámara: el túnel se ve por detrás del título. */
const START_Z = -1300;

export function StoriesTunnel({ images, header }: { images: readonly string[]; header: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const n = images.length;
    const travel = n * GAP_Z + 1700;
    let raf = 0;
    let running = false;
    let shown = 0;
    // Valores suavizados: el scroll ya tiene inercia, esto le saca el serrucho.
    let p = 0;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;

    const progress = () => {
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };
    p = progress();

    const frame = () => {
      raf = running ? requestAnimationFrame(frame) : 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      // Radio elíptico: más ancho que alto, para que la espiral llene pantallas apaisadas.
      const rx = mobile ? w * 0.36 : Math.min(w * 0.38, 620);
      const ry = mobile ? h * 0.26 : Math.min(h * 0.34, 340);

      p += (progress() - p) * 0.18;
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;

      const camZ = START_Z + p * travel;
      const twist = p * 2.2;
      let nearest = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const z = -i * GAP_Z + camZ; // > 0: ya pasó junto a la cámara
        if (z > 900 || z < -4200) {
          if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
          continue;
        }
        if (el.style.visibility === "hidden") el.style.visibility = "visible";
        const a = i * STEP_ANGLE + twist;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        // Aparece desde la niebla del fondo y se desvanece antes de chocar con la cámara.
        const fadeIn = Math.min(1, Math.max(0, (z + 4200) / 1600));
        const fadeOut = Math.min(1, Math.max(0, (720 - z) / 420));
        const op = fadeIn * fadeOut;
        // Cada pieza mira apenas hacia el eje: se lee de frente pero arma la pared del túnel.
        const ry_ = -Math.cos(a) * 22;
        const rx_ = Math.sin(a) * 14;
        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry_}deg) rotateX(${rx_}deg)`;
        el.style.opacity = op.toFixed(3);
        // Brillo por profundidad: lo lejano se apaga, lo cercano se enciende.
        const lum = 0.35 + 0.65 * Math.min(1, Math.max(0, (z + 3000) / 2800));
        el.style.filter = `brightness(${lum.toFixed(3)})`;
        const d = Math.abs(z - 250);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      }

      // La cámara se asoma hacia donde apunta el mouse.
      stage.style.perspectiveOrigin = `${50 + mx * 6}% ${50 + my * 6}%`;

      const head = headerRef.current;
      if (head) {
        // El título está adelante al principio y se disuelve cuando entramos.
        const k = Math.min(1, Math.max(0, (p - 0.04) / 0.16));
        head.style.opacity = (1 - k).toFixed(3);
        head.style.transform = `translate3d(0, ${-k * 40}px, 0) scale(${1 + k * 0.18})`;
        head.style.filter = k > 0.01 ? `blur(${(k * 10).toFixed(1)}px)` : "";
        head.style.visibility = k >= 1 ? "hidden" : "visible";
      }
      if (nearest !== shown && counterRef.current) {
        shown = nearest;
        counterRef.current.textContent = String(nearest + 1).padStart(2, "0");
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      rootMargin: "200px 0px",
    });
    io.observe(root);

    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Un primer cuadro aunque todavía no esté a la vista: sin esto las piezas
    // arrancan apiladas en el centro hasta que el observer dispare.
    running = true;
    frame();
    running = false;

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [images]);

  return (
    <div ref={rootRef} className="relative" style={{ height: `${Math.round(images.length * 11 + 120)}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Punto de fuga: la luz al fondo del túnel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_38%_34%_at_50%_50%,rgba(236,168,214,0.16)_0%,rgba(161,0,242,0.06)_45%,transparent_75%)]"
        />
        <div
          ref={stageRef}
          aria-hidden
          className="absolute inset-0 [perspective:900px] [transform-style:preserve-3d]"
        >
          <div className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
            {images.map((src, i) => (
              <div
                key={src}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute -ml-[clamp(60px,9vw,100px)] -mt-[clamp(107px,16vw,178px)] h-[clamp(214px,32vw,356px)] w-[clamp(120px,18vw,200px)] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] will-change-transform"
                style={{ visibility: "hidden" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" decoding="async" draggable={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Bordes que funden el túnel con la banda de arriba y la de abajo. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div
          ref={headerRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 will-change-transform sm:px-6"
        >
          {/* Sombra detrás del título: el túnel ya se mueve atrás y no compite con la lectura. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_22%_50%,rgba(8,6,10,0.85)_0%,rgba(8,6,10,0.4)_55%,transparent_80%)]"
          />
          <div className="pointer-events-auto relative mx-auto w-full max-w-[1400px] lg:px-12">{header}</div>
        </div>

        {/* Contador de piezas y progreso del recorrido. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="tabular-nums">
            <span ref={counterRef} className="text-[#eca8d6]">
              01
            </span>{" "}
            / {String(images.length).padStart(2, "0")}
          </span>
          <span className="relative h-px w-28 overflow-hidden bg-white/15">
            <span ref={barRef} className="absolute inset-0 origin-left bg-[#eca8d6]" style={{ transform: "scaleX(0)" }} />
          </span>
          <span className="hidden uppercase tracking-[0.25em] sm:inline">Piezas reales</span>
        </div>
      </div>
    </div>
  );
}
