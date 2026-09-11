"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Peldaños de la foto de fondo de `DevelopersSection`, en el espacio de la
 * imagen original (2720×1536).
 *
 * No están puestos a ojo: se midieron sobre el PNG buscando los máximos de
 * luminancia columna por columna, así que `y` es la cara iluminada del peldaño
 * y `x0`/`x1` son sus extremos visibles.
 *
 * El SVG que los usa se monta con ese mismo viewBox y con
 * `preserveAspectRatio="xMidYMin slice"`, que es exactamente lo que hace el
 * `object-cover object-center-top` de la imagen. Por eso el conejo cae sobre el
 * peldaño en cualquier viewport sin recalcular nada: el recorte que sufre la
 * foto se lo come igual el SVG. Si alguien cambia el `object-position` de la
 * imagen, hay que cambiar acá el `preserveAspectRatio` a juego.
 */
const TREADS = [
  { y: 1420, x0: 330, x1: 1730 },
  { y: 1240, x0: 430, x1: 1680 },
  { y: 1080, x0: 560, x1: 1700 },
  { y: 938, x0: 710, x1: 1810 },
  { y: 818, x0: 940, x1: 1860 },
  { y: 700, x0: 990, x1: 1960 },
] as const;

/**
 * Pausa sobre cada peldaño. Son distintas a propósito: con todas iguales la
 * subida late como un metrónomo. La larga del tercer peldaño es la que deja
 * lugar a que se pare a mirar.
 */
const HOLDS_MS = [340, 300, 700, 320, 420, 300];

/**
 * El recorte va centrado, así que la franja visible se abre desde el medio de
 * la foto: la más angosta que llega a mostrarse es x≈1000–1720. La subida
 * camina por el centro de cada peldaño, corrida un poco a la derecha, para
 * caer dentro de esa franja en cualquier viewport.
 */
const LANDINGS = TREADS.map((tread, i) => {
  const next = TREADS[i + 1];
  const rise = next ? tread.y - next.y : 100;
  return {
    x: tread.x0 + (tread.x1 - tread.x0) * 0.5 + 40 + i * 20,
    y: tread.y,
    // La huella se achica hacia arriba siguiendo el escorzo real de la
    // escalera: los peldaños de arriba miden menos alto en pantalla.
    scale: 0.4 + 0.6 * (rise / 180),
    hold: HOLDS_MS[i],
  };
});

const HOP_MS = 470;
const SQUASH_MS = 150;
const RECOVER_MS = 120;
const CROUCH_MS = 130;
const EXIT_MS = 640;
const RESET_MS = 1500;

/** Medidas de la imagen de fondo, que son también las del viewBox. */
const VIEWBOX_W = 2720;
const VIEWBOX_H = 1536;

/**
 * Mínimo de foto que tiene que entrar en el recorte —en px de la imagen
 * original— para que el conejo aparezca.
 *
 * Con el recorte centrado la escalera entra en cuadro casi siempre, pero en
 * pantallas muy angostas el contenedor se queda con dos peldaños ampliados y el
 * conejo pasa a ocupar media foto. Por debajo de este ancho no se dibuja.
 */
const MIN_CROP = 620;

type Ease = "easeOut" | "easeIn" | "easeInOut" | "linear";

type Frame = {
  t: number;
  /** Posición de las patas, en coordenadas de la imagen. */
  x: number;
  y: number;
  /** Inclinación del cuerpo: negativo = hocico arriba. */
  rot: number;
  /** Estirón y aplastado. */
  sx: number;
  sy: number;
  /** Las orejas van por su cuenta, siempre atrasadas respecto del cuerpo. */
  ear: number;
  /** Polvillo que levanta al caer. */
  dust: number;
  o: number;
  /** El salto es balístico: sube frenando y cae acelerando. */
  easeY: Ease;
  /** El cuerpo acompaña con su propio ritmo. */
  easeBody: Ease;
};

/** Entra saltando desde fuera de cuadro, abajo a la izquierda. */
const ENTRY = { x: LANDINGS[0].x - 150, y: 1580 };
/** Y se va por arriba a la derecha, donde la escalera se pierde. */
const EXIT = { x: LANDINGS[LANDINGS.length - 1].x + 190, y: 585 };

function buildTimeline(): Frame[] {
  const frames: Frame[] = [];
  let t = 0;

  const push = (frame: Omit<Frame, "t">, dt: number) => {
    t += dt;
    frames.push({ ...frame, t });
  };

  const first = LANDINGS[0];
  frames.push({
    t: 0,
    x: ENTRY.x,
    y: ENTRY.y,
    rot: -8,
    sx: first.scale,
    sy: first.scale,
    ear: -14,
    dust: 0,
    o: 0,
    easeY: "easeOut",
    easeBody: "easeOut",
  });

  const hop = (
    from: { x: number; y: number; scale: number },
    to: { x: number; y: number; scale: number },
    ms: number,
  ) => {
    const rise = Math.max(from.y - to.y, 0);
    const apexY = Math.min(from.y, to.y) - Math.max(rise * 0.55, 58);
    const midScale = (from.scale + to.scale) / 2;

    // Vértice del salto: el cuerpo se estira, el hocico apunta arriba y las
    // orejas quedan barridas hacia atrás.
    push(
      {
        x: (from.x + to.x) / 2,
        y: apexY,
        rot: -15,
        sx: midScale * 0.93,
        sy: midScale * 1.1,
        ear: -22,
        dust: 0,
        o: 1,
        easeY: "easeOut",
        easeBody: "easeOut",
      },
      ms / 2,
    );

    // Contacto: se aplasta contra la piedra, cabecea hacia adelante y las
    // orejas lo pasan de largo.
    push(
      {
        x: to.x,
        y: to.y,
        rot: 8,
        sx: to.scale * 1.16,
        sy: to.scale * 0.82,
        ear: 18,
        dust: 1,
        o: 1,
        easeY: "easeIn",
        easeBody: "easeIn",
      },
      ms / 2,
    );
  };

  LANDINGS.forEach((landing, i) => {
    const from = i === 0 ? { ...ENTRY, scale: first.scale } : LANDINGS[i - 1];
    hop(from, landing, HOP_MS);

    const still = { x: landing.x, y: landing.y, dust: 0, o: 1, easeY: "linear" as Ease };

    // Rebote: se pasa un poco de la forma en reposo antes de asentarse.
    push(
      { ...still, dust: 0.55, rot: -4, sx: landing.scale * 0.97, sy: landing.scale * 1.04, ear: -8, easeBody: "easeOut" },
      SQUASH_MS,
    );
    push(
      { ...still, rot: 0, sx: landing.scale, sy: landing.scale, ear: 0, easeBody: "easeOut" },
      RECOVER_MS,
    );
    // Sacudida de orejas a mitad de la pausa: el cuerpo queda quieto.
    push(
      { ...still, rot: 0, sx: landing.scale, sy: landing.scale, ear: -11, easeBody: "easeOut" },
      landing.hold * 0.45,
    );
    push(
      { ...still, rot: -1, sx: landing.scale, sy: landing.scale, ear: 2, easeBody: "easeInOut" },
      landing.hold * 0.55,
    );
    // Anticipación: se agacha justo antes de impulsarse. Sin este cuadro el
    // salto arranca de la nada y se ve mecánico.
    push(
      { ...still, rot: 3, sx: landing.scale * 1.1, sy: landing.scale * 0.86, ear: 9, easeBody: "easeIn" },
      CROUCH_MS,
    );
  });

  const last = LANDINGS[LANDINGS.length - 1];
  hop(last, { ...EXIT, scale: last.scale * 0.88 }, EXIT_MS);
  // Se desvanece fuera de cuadro y recién ahí vuelve al punto de partida, para
  // que no se vea el rebobinado.
  push(
    {
      x: EXIT.x,
      y: EXIT.y,
      rot: 4,
      sx: last.scale * 0.88,
      sy: last.scale * 0.88,
      ear: 6,
      dust: 0,
      o: 0,
      easeY: "linear",
      easeBody: "linear",
    },
    280,
  );
  push(
    {
      x: ENTRY.x,
      y: ENTRY.y,
      rot: -8,
      sx: first.scale,
      sy: first.scale,
      ear: -14,
      dust: 0,
      o: 0,
      easeY: "linear",
      easeBody: "linear",
    },
    RESET_MS,
  );

  return frames;
}

const FRAMES = buildTimeline();
const DURATION = FRAMES[FRAMES.length - 1].t;
const TIMES = FRAMES.map((frame) => frame.t / DURATION);

const KEY = {
  x: FRAMES.map((frame) => frame.x),
  y: FRAMES.map((frame) => frame.y),
  rot: FRAMES.map((frame) => frame.rot),
  sx: FRAMES.map((frame) => frame.sx),
  sy: FRAMES.map((frame) => frame.sy),
  ear: FRAMES.map((frame) => frame.ear),
  dust: FRAMES.map((frame) => frame.dust),
  o: FRAMES.map((frame) => frame.o),
};
/**
 * El avance horizontal va parejo mientras el vertical frena y acelera: es lo
 * que convierte cada salto en una parábola en vez de en una línea curva
 * cualquiera. Por eso `x` e `y` viven en grupos distintos, cada uno con su
 * curva.
 */
const EASE_X: Ease[] = FRAMES.slice(1).map(() => "linear");
const EASE_Y = FRAMES.slice(1).map((frame) => frame.easeY);
const EASE_BODY = FRAMES.slice(1).map((frame) => frame.easeBody);

/** Pose quieta para `prefers-reduced-motion`: sentado a mitad de la subida. */
const RESTING = LANDINGS[2];

const BODY_ID = "cc-stairs-rabbit-body";
const EARS_ID = "cc-stairs-rabbit-ears";
const FUR_ID = "cc-stairs-rabbit-fur";

/**
 * Silueta de perfil mirando hacia la subida. Se dibuja con las patas en (0,0)
 * y el cuerpo en negativo: así trasladar el grupo apoya al conejo sobre el
 * peldaño, y rotarlo o escalarlo desde ese mismo origen no lo despega de la
 * piedra.
 */
function BodyShape() {
  return (
    <g>
      <ellipse cx={-14} cy={-7} rx={24} ry={8} />
      <ellipse cx={22} cy={-8} rx={10} ry={8} />
      <circle cx={-44} cy={-40} r={10} />
      <ellipse cx={-20} cy={-30} rx={28} ry={26} />
      <ellipse cx={2} cy={-38} rx={32} ry={26} />
      <ellipse cx={24} cy={-40} rx={18} ry={17} />
      <ellipse cx={40} cy={-58} rx={19} ry={17} />
      <ellipse cx={55} cy={-54} rx={9} ry={7.5} />
    </g>
  );
}

function EarsShape() {
  return (
    <g>
      <ellipse cx={36} cy={-88} rx={6.5} ry={22} transform="rotate(-14 36 -88)" />
      <ellipse cx={48} cy={-86} rx={6} ry={20} transform="rotate(-3 48 -86)" />
    </g>
  );
}

/** Contraluces de la escena: magenta por detrás, cian por el lado frío. */
function RimLights({ id }: { id: string }) {
  return (
    <>
      <use href={`#${id}`} x={-4} y={-2} fill="#67e8f9" opacity={0.2} />
      <use href={`#${id}`} x={4} y={1} fill="#ff5ad2" opacity={0.22} />
    </>
  );
}

/**
 * Cuánta foto entra realmente en el recorte, en px de la imagen original.
 * Reproduce la cuenta de `object-cover`: el lado que sobra es el que define la
 * escala, y lo que se ve es el ancho del contenedor dividido por ella.
 */
function useCropWidth(ref: RefObject<SVGSVGElement | null>) {
  const [crop, setCrop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const cover = Math.max(width / VIEWBOX_W, height / VIEWBOX_H);
      setCrop(width / cover);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return crop;
}

export function StairsRabbit() {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const crop = useCropWidth(ref);
  const fits = crop >= MIN_CROP;
  const animate = !reduce && inView && fits;

  const still = { duration: 0 };

  return (
    <svg
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 2720 1536"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      focusable="false"
      style={{
        // La foto se apaga hacia la izquierda con el degradado de la sección y
        // el conejo se apaga con ella, pero un poco menos: en los viewports
        // angostos esa franja es lo único que se ve de la escalera.
        maskImage: "linear-gradient(to right, transparent 4%, rgba(0,0,0,0.5) 22%, #000 46%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 4%, rgba(0,0,0,0.5) 22%, #000 46%)",
      }}
    >
      <defs>
        {/* La misma luz que baña la escalera: dorada arriba, rosa contra la
            piedra. */}
        <linearGradient id={FUR_ID} x1={0} y1={-118} x2={0} y2={4} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff6e2" />
          <stop offset="0.4" stopColor="#ffcd85" />
          <stop offset="0.7" stopColor="#ef9a63" />
          <stop offset="0.88" stopColor="#d2698f" />
          <stop offset="1" stopColor="#6e2f4f" />
        </linearGradient>
        <g id={BODY_ID}>
          <BodyShape />
        </g>
        <g id={EARS_ID}>
          <EarsShape />
        </g>
      </defs>

      {/* En pantallas donde la escalera no entra en el recorte no hay nada
          sobre lo que saltar, así que el conejo ni se monta. */}
      {fits ? (
      <>
      {/* Un grupo por eje: el horizontal avanza parejo, el vertical frena y
          acelera. Adentro van la inclinación y el aplastado, cada uno con su
          propio pivote. */}
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        initial={false}
        {...(animate
          ? { animate: { x: KEY.x, opacity: KEY.o }, transition: { duration: DURATION / 1000, times: TIMES, ease: EASE_X, repeat: Number.POSITIVE_INFINITY } }
          : { animate: { x: RESTING.x, opacity: 1 }, transition: still })}
      >
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={false}
          {...(animate
            ? { animate: { y: KEY.y }, transition: { duration: DURATION / 1000, times: TIMES, ease: EASE_Y, repeat: Number.POSITIVE_INFINITY } }
            : { animate: { y: RESTING.y }, transition: still })}
        >
          {/* Polvillo del aterrizaje. */}
          <motion.g
            initial={false}
            style={{ transformOrigin: "0px 0px" }}
            {...(animate
              ? { animate: { opacity: KEY.dust, scale: KEY.dust.map((d) => 0.7 + d * 0.8) }, transition: { duration: DURATION / 1000, times: TIMES, ease: EASE_BODY, repeat: Number.POSITIVE_INFINITY } }
              : { animate: { opacity: 0 }, transition: still })}
          >
            <circle cx={-26} cy={-8} r={4} fill="#ffd9a0" opacity={0.75} />
            <circle cx={-38} cy={-16} r={2.6} fill="#ff9ec7" opacity={0.7} />
            <circle cx={-16} cy={-18} r={2.2} fill="#67e8f9" opacity={0.55} />
            <circle cx={26} cy={-10} r={3} fill="#ffd9a0" opacity={0.6} />
          </motion.g>

          <motion.g
            style={{ transformOrigin: "0px 0px" }}
            initial={false}
            {...(animate
              ? { animate: { rotate: KEY.rot }, transition: { duration: DURATION / 1000, times: TIMES, ease: EASE_BODY, repeat: Number.POSITIVE_INFINITY } }
              : { animate: { rotate: 0 }, transition: still })}
          >
            <motion.g
              style={{
                transformOrigin: "0px 0px",
                filter: "drop-shadow(0 0 7px rgba(255,176,96,0.42))",
              }}
              initial={false}
              {...(animate
                ? { animate: { scaleX: KEY.sx, scaleY: KEY.sy }, transition: { duration: DURATION / 1000, times: TIMES, ease: EASE_BODY, repeat: Number.POSITIVE_INFINITY } }
                : { animate: { scaleX: RESTING.scale, scaleY: RESTING.scale }, transition: still })}
            >
              {/* Sombra de contacto contra la piedra. */}
              <ellipse cx={-4} cy={-3} rx={34} ry={7} fill="#000" opacity={0.5} />

              <RimLights id={BODY_ID} />
              <use href={`#${BODY_ID}`} fill={`url(#${FUR_ID})`} />
              {/* Volumen: la panza en sombra y el anca marcada. */}
              <ellipse cx={0} cy={-16} rx={30} ry={12} fill="#7a3a2a" opacity={0.18} />
              {/* Anca: una masa redonda, no un contorno dibujado. */}
              <ellipse cx={-22} cy={-28} rx={20} ry={18} fill="#c9743f" opacity={0.2} />
              {/* La luz de la escalera le pega en el lomo. */}
              <ellipse cx={-4} cy={-54} rx={22} ry={9} fill="#fff6e2" opacity={0.22} />
              {/* La cola se lleva la luz más alta de la escena. */}
              <circle cx={-40} cy={-42} r={5} fill="#ffe9c9" opacity={0.85} />
              <circle cx={44} cy={-62} r={2.8} fill="#3d1224" opacity={0.9} />
              <circle cx={45.4} cy={-63.2} r={1} fill="#fff4dd" opacity={0.85} />
              <ellipse cx={62} cy={-56} rx={3.2} ry={2.6} fill="#c2496f" opacity={0.85} />
              <g stroke="#ffe9c9" strokeWidth={1.1} strokeLinecap="round" opacity={0.45} fill="none">
                <path d="M63 -57 L84 -63" />
                <path d="M63 -55 L86 -54" />
                <path d="M62 -53 L83 -47" />
              </g>

              {/* Las orejas cuelgan del mismo cuerpo pero pivotean en su base,
                  con un cuadro de atraso: es lo que da el latigazo. */}
              <motion.g
                style={{ transformOrigin: "40px -68px" }}
                initial={false}
                {...(animate
                  ? { animate: { rotate: KEY.ear }, transition: { duration: DURATION / 1000, times: TIMES, ease: EASE_BODY, repeat: Number.POSITIVE_INFINITY } }
                  : { animate: { rotate: 0 }, transition: still })}
              >
                <RimLights id={EARS_ID} />
                <use href={`#${EARS_ID}`} fill={`url(#${FUR_ID})`} />
                <ellipse cx={36} cy={-88} rx={3.4} ry={15} transform="rotate(-14 36 -88)" fill="#ff9ec7" opacity={0.6} />
                <ellipse cx={48} cy={-86} rx={3} ry={13} transform="rotate(-3 48 -86)" fill="#ff9ec7" opacity={0.5} />
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>
      </>
      ) : null}
    </svg>
  );
}
