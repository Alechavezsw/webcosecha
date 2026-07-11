"use client";

const SKETCHFAB_EMBED_URL =
  "https://sketchfab.com/models/c9de125cb9d8407abed1dc8f6a4676a8/embed?autostart=1&transparent=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_controls=0&dnt=1";

type RobotEmbedProps = {
  className?: string;
  title?: string;
};

/** Robot 3D compacto — recorta bordes del widget Sketchfab. */
export function RobotEmbed({
  className = "h-[min(52vw,340px)]",
  title = "Asistente IA Cosecha Creativa",
}: RobotEmbedProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 -top-10 -bottom-14 -left-4 -right-4">
        <iframe
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src={SKETCHFAB_EMBED_URL}
          className="h-full w-full pointer-events-none"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
