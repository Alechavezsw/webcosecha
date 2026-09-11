/**
 * Pulsos de luz que recorren los filamentos de la foto de `IntegrationsSection`
 * (las dos manos de musgo que se tocan con hilos de luz).
 *
 * Los trazos no están dibujados a ojo: se midieron sobre el PNG buscando los
 * máximos de luminancia columna por columna entre x=860 y x=1660, que es el
 * tramo donde los hilos van por el aire. Por eso las polilíneas caen justo
 * encima de la luz que ya trae la foto.
 *
 * El SVG usa el viewBox de la imagen original y se monta con el
 * `preserveAspectRatio` por defecto: como la imagen va `w-full h-auto`, su caja
 * tiene exactamente la misma proporción y el mapeo es 1:1 en cualquier ancho.
 *
 * Va en `mix-blend-mode: screen`, así que sólo puede sumar luz: el pulso se lee
 * como energía viajando por el hilo que ya está en la foto, no como una línea
 * nueva pegada encima.
 */
const VIEWBOX_W = 2494;
const VIEWBOX_H = 1199;

const polyline = (points: readonly (readonly [number, number])[]) =>
  `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")}`;

const FILAMENTS = [
  {
    /** El hilo que baja desde la mano izquierda, toca fondo y vuelve a subir. */
    d: polyline([
      [860, 625],
      [980, 613],
      [1100, 627],
      [1180, 650],
      [1260, 691],
      [1340, 739],
      [1420, 765],
      [1460, 754],
      [1500, 733],
      [1540, 706],
      [1580, 672],
      [1625, 632],
    ]),
    duration: "3.6s",
    delay: "0s",
  },
  {
    /** La diagonal larga, la que cruza a la otra y llega más arriba. */
    d: polyline([
      [860, 651],
      [900, 665],
      [1020, 680],
      [1100, 717],
      [1180, 739],
      [1260, 700],
      [1340, 658],
      [1420, 605],
      [1500, 574],
      [1580, 559],
      [1660, 535],
    ]),
    duration: "4.6s",
    delay: "-1.7s",
  },
  {
    /** El hilo corto de arriba, el que termina en punta libre. */
    d: polyline([
      [860, 639],
      [940, 617],
      [1020, 614],
      [1100, 627],
      [1180, 619],
      [1220, 599],
      [1272, 586],
    ]),
    duration: "3.1s",
    delay: "-2.4s",
  },
] as const;

export function ConnectionFilaments() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      aria-hidden="true"
      focusable="false"
    >
      {FILAMENTS.map((filament) => (
        <g key={filament.d}>
          {/* El halo primero y el núcleo encima: el pulso tiene que quemar en
              el centro y desparramar luz alrededor, como el resto de la foto. */}
          <path
            className="cc-filament cc-filament-halo"
            d={filament.d}
            pathLength={1}
            style={{ animationDuration: filament.duration, animationDelay: filament.delay }}
          />
          <path
            className="cc-filament cc-filament-core"
            d={filament.d}
            pathLength={1}
            style={{ animationDuration: filament.duration, animationDelay: filament.delay }}
          />
        </g>
      ))}
    </svg>
  );
}
