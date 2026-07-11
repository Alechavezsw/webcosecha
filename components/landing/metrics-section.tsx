"use client";

import { DISENO_STORIES_IMAGES } from "@/lib/diseno-stories-images";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type MetricsSectionVariant = "ai" | "content";

const aiMetrics = [
  {
    value: 12847392,
    suffix: "",
    prefix: "",
    label: "Tasks completed today",
    sublabel: "by 23,847 active agents",
  },
  {
    value: 99,
    suffix: ".99%",
    prefix: "",
    label: "Availability",
    sublabel: "across all regions",
  },
  {
    value: 340,
    suffix: "ms",
    prefix: "<",
    label: "Average execution",
    sublabel: "p99 latency",
  },
];

const contentMetrics = [
  {
    value: 2840,
    suffix: "+",
    prefix: "",
    label: "Piezas diseñadas",
    sublabel: "stories, feeds y campañas al mes",
  },
  {
    value: 12,
    suffix: "",
    prefix: "",
    label: "Formatos activos",
    sublabel: "story · feed · carrusel · reel",
  },
  {
    value: 48,
    suffix: "h",
    prefix: "<",
    label: "Entrega express",
    sublabel: "piezas urgentes en agenda",
  },
];

/** Vista rápida: un destacado por ecosistema; el resto en modal (sin duplicados). */
const MODELS_PREVIEW = [
  "OpenAI GPT-5.5",
  "Anthropic Claude Opus 4.7",
  "Google Gemini 3.1 Pro",
  "Meta Llama 4 Maverick",
  "DeepSeek-V4-Pro-Max",
];

const FORMATS_PREVIEW = [
  "Stories",
  "Feed",
  "Carruseles",
  "Reels",
  "Banners",
];

const ALL_FORMATS = [
  ...new Set([
    ...FORMATS_PREVIEW,
    "Ads",
    "WhatsApp",
    "Landing",
    "Catálogo",
    "Presentaciones",
    "Email marketing",
    "Menú digital",
    "Packaging",
    "Señalética",
    "Editorial",
  ]),
];

const ALL_MODELS = [
  ...new Set([
    ...MODELS_PREVIEW,
    "OpenAI GPT-5.5 Pro",
    "OpenAI GPT-5.4",
    "OpenAI GPT Image 2",
    "OpenAI o4-mini",
    "OpenAI GPT-4.1",
    "Anthropic Claude Sonnet 4.6",
    "Anthropic Claude Mythos Preview",
    "Anthropic Claude 3.7 Sonnet",
    "Google Gemini 3.1 Flash-Lite",
    "Google Gemini 3.1 Deep Think",
    "Google Gemini 3 Flash",
    "Google Gemini 2.5 Flash",
    "Google Gemma 4 31B",
    "Google Gemma 4 26B-A4B",
    "Meta Llama 4 Scout",
    "DeepSeek-V4-Flash-Max",
    "DeepSeek R1",
    "Alibaba Qwen3.6-35B-A3B",
    "Alibaba Qwen3.6-27B",
    "Moonshot Kimi K2.6",
    "Mistral Medium 3",
    "Mistral Small 3",
    "Mixtral 8x22B",
    "xAI Grok 4",
    "Perplexity Sonar Reasoning Pro",
    "Cohere Command R+",
    "Amazon Nova Premier",
    "IBM Granite 4",
    "Snowflake Arctic",
    "NVIDIA Nemotron",
    "Microsoft Phi-4",
    "Databricks DBRX",
    "Together Llama 3.1 405B",
    "01.AI Yi Large",
    "Writer Palmyra X5",
    "Stable LM 2",
  ]),
];

function AnimatedNumber({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [isScrambling, setIsScrambling] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2500;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * end));
            setIsScrambling(progress < 0.8);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  const displayValue = count.toLocaleString();

  return (
    <div ref={ref} className="inline-flex items-baseline">
      <span className="text-muted-foreground mr-1">{prefix}</span>
      <span className="tabular-nums">
        {displayValue.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-150 ${
              isScrambling && char !== "," ? "blur-[1px]" : ""
            }`}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="text-muted-foreground">{suffix}</span>
    </div>
  );
}

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pausa fuera de viewport: la grilla no se dibuja si no se ve
    let isInView = true;
    const io = new IntersectionObserver(
      ([entry]) => { isInView = entry?.isIntersecting ?? true; },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const render = () => {
      if (!isInView) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);
      const gridSize = 60;
      const time = timeRef.current;
      // Paleta de marca para los nodos de la grilla (rosa, violeta, cian)
      const palette = [
        [236, 168, 214], // #eca8d6 rosa
        [161, 0, 242],   // #a100f2 violeta
        [103, 232, 249], // #67e8f9 cian
      ];
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const wave = Math.sin(x * 0.01 + y * 0.01 + time) * 0.5 + 0.5;
          const size = 1 + wave * 2;
          // El color recorre la paleta a lo largo de la grilla, latiendo lentamente
          const hueT = (Math.sin(x * 0.004 + y * 0.006 + time * 0.3) * 0.5 + 0.5) * (palette.length - 1);
          const lo = Math.floor(hueT);
          const hi = Math.min(lo + 1, palette.length - 1);
          const f = hueT - lo;
          const r = Math.round(palette[lo][0] + (palette[hi][0] - palette[lo][0]) * f);
          const g = Math.round(palette[lo][1] + (palette[hi][1] - palette[lo][1]) * f);
          const b = Math.round(palette[lo][2] + (palette[hi][2] - palette[lo][2]) * f);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.05 + wave * 0.05})`;
          ctx.fill();
        }
      }
      const pulseY = (time * 30) % height;
      ctx.strokeStyle = "rgba(236, 168, 214, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, pulseY);
      ctx.lineTo(width, pulseY);
      ctx.stroke();
      timeRef.current += 0.02;
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function DotGraph({
  color = "white",
  height = 32,
  freq1 = 0.35,
  freq2 = 0.12,
  freqT = 0.7,
  speed = 0.025,
  baseline = 0.3,
  amplitude = 0.5,
}: {
  color?: string;
  height?: number;
  freq1?: number;
  freq2?: number;
  freqT?: number;
  speed?: number;
  baseline?: number;
  amplitude?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(Math.random() * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.offsetWidth || 300;
    const H = height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Pausa fuera de viewport (hay varios DotGraph en la sección)
    let isInView = true;
    const io = new IntersectionObserver(
      ([entry]) => { isInView = entry?.isIntersecting ?? true; },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const render = () => {
      if (!isInView) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      const t = timeRef.current;
      const cols = Math.floor(W / 8);

      for (let i = 0; i < cols; i++) {
        const raw = baseline + amplitude * Math.sin(i * freq1 + t) * Math.cos(i * freq2 + t * freqT);
        const v = Math.max(0, Math.min(1, raw));
        const dotY = H - 4 - v * (H - 8);
        const x = i * 8 + 4;
        const alpha = 0.15 + v * 0.55;
        const r = 1.5 + v * 1.2;

        ctx.beginPath();
        ctx.arc(x, dotY, r, 0, Math.PI * 2);
        ctx.fillStyle = color === "green"
          ? `rgba(236, 168, 214, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      timeRef.current += speed;
      frameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [color, height, freq1, freq2, freqT, speed, baseline, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: `${height}px`, display: "block" }}
    />
  );
}

function StoriesShowcase() {
  const track = [...DISENO_STORIES_IMAGES, ...DISENO_STORIES_IMAGES];

  return (
    <div className="relative -mx-6 overflow-hidden lg:-mx-12">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-3 py-1 [animation-duration:50s] hover:[animation-play-state:paused]">
        {track.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-[min(42vh,380px)] w-[min(22vw,168px)] shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricsSection({ variant = "ai" }: { variant?: MetricsSectionVariant }) {
  const isContent = variant === "content";
  const metrics = isContent ? contentMetrics : aiMetrics;
  const [time, setTime] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateParallax = () => {
      const el = graphRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setParallaxY(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const centerOffset = rect.top + rect.height * 0.5 - viewH * 0.5;
      setParallaxY(centerOffset * -0.12);
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <section ref={sectionRef} className="cc-aura cc-aura-gold relative py-32 lg:py-40 overflow-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 mb-20 lg:mb-32">
          <div className="lg:col-span-8 lg:col-start-1">
            <div
              className={`mb-6 flex items-center gap-4 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-300 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isVisible ? "40ms" : "0ms" }}
            >
              <span className="flex items-center gap-2 rounded-md bg-[#eca8d6]/10 px-3 py-1 font-mono text-xs text-[#eca8d6] shadow-[0_0_24px_-8px_rgba(236,168,214,0.35)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#eca8d6]" />
                {isContent ? "EN PRODUCCIÓN" : "LIVE"}
              </span>
              <span className="font-mono text-sm text-muted-foreground tabular-nums">
                {time
                  ? isContent
                    ? `${time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} ART`
                    : `${time.toLocaleTimeString("en-GB")} UTC`
                  : ""}
              </span>
            </div>

            <h2 className={`max-w-3xl text-3xl font-display tracking-tight leading-[1.05] transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:blur-none sm:text-4xl md:text-5xl lg:text-6xl ${
              isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-10 opacity-0 blur-[10px]"
            }`}
              style={{ transitionDelay: isVisible ? "120ms" : "0ms" }}
            >
              <span className="block w-fit cursor-default text-foreground hover:font-bold">
                {isContent ? "Generamos contenido" : "Números en vivo"}
              </span>
              <span className="block w-fit cursor-default text-muted-foreground hover:font-bold hover:text-foreground">
                {isContent
                  ? "que tu marca publica cada día."
                  : "de nuestros sistemas con IA corriendo."}
              </span>
            </h2>
          </div>
        </div>

        {/* Organic graph image — parallax inmersivo */}
        <div
          ref={graphRef}
          className={`relative mb-0 w-full overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75)] transition-[opacity,transform] duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-300 ${
            isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.985] opacity-0"
          }`}
          style={{ transitionDelay: isVisible ? "220ms" : "0ms" }}
        >
          {isContent ? (
            <StoriesShowcase />
          ) : (
            <>
              <div className="relative aspect-[3/1] min-h-[200px] w-full overflow-hidden sm:min-h-[240px] lg:min-h-[280px]">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/real-time-graph-INFmn3u0MlUwvNPynoIhwxtPaPjxM5.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-0 top-[-12%] h-[124%] w-full object-cover object-center will-change-transform"
                  style={{ transform: `translate3d(0, ${parallaxY}px, 0) scale(1.1)` }}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eca8d6]/30 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -inset-x-8 bottom-0 h-24 translate-y-1/2 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(236,168,214,0.12)_0%,transparent_70%)] blur-2xl"
                aria-hidden
              />
            </>
          )}
        </div>

        {/* Metrics grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Large metric */}
          <div
            className={`border border-foreground/10 bg-foreground/[0.02] p-10 transition-[opacity,transform,box-shadow] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-300 lg:col-span-1 lg:p-14 ${
              isVisible ? "translate-y-0 opacity-100 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)]" : "translate-y-14 opacity-0"
            }`}
            style={{ transitionDelay: isVisible ? "320ms" : "0ms" }}
          >
            <div className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight mb-4 whitespace-nowrap overflow-hidden">
              <AnimatedNumber end={metrics[0].value} suffix={metrics[0].suffix} prefix={metrics[0].prefix} />
            </div>
            <div className="mb-6">
              <DotGraph color="white" height={36} freq1={0.28} freq2={0.09} freqT={0.5} speed={0.018} baseline={0.35} amplitude={0.55} />
            </div>
            <div className="text-lg text-foreground mb-2">{metrics[0].label}</div>
            <div className="text-sm text-muted-foreground font-mono">{metrics[0].sublabel}</div>
          </div>

          {/* Metrics */}
          {metrics.slice(1).map((metric, index) => (
            <div
              key={metric.label}
              className={`flex flex-col items-start justify-between gap-6 border border-foreground/10 bg-foreground/[0.02] p-8 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-14 opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${440 + index * 130}ms` : "0ms",
              }}
            >
              <div className="w-full">
                <div className="text-sm text-muted-foreground font-mono mb-2">{metric.sublabel}</div>
                <div className="text-base text-foreground mb-3">{metric.label}</div>
                <DotGraph
                  color={index === 0 ? "green" : "white"}
                  height={24}
                  freq1={index === 0 ? 0.45 : 0.22}
                  freq2={index === 0 ? 0.18 : 0.07}
                  freqT={index === 0 ? 1.1 : 0.4}
                  speed={index === 0 ? 0.032 : 0.015}
                  baseline={index === 0 ? 0.4 : 0.25}
                  amplitude={index === 0 ? 0.45 : 0.6}
                />
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-display tracking-tight w-full">
                <AnimatedNumber end={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom ticker + catálogo modal */}
        <Dialog>
          <div
            className={`mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-foreground/10 pt-8 font-mono text-sm text-muted-foreground transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: isVisible ? "580ms" : "0ms" }}
          >
            {(isContent ? FORMATS_PREVIEW : MODELS_PREVIEW).map((name) => (
              <span key={name} className="transition-colors duration-300 hover:text-foreground">
                {name}
              </span>
            ))}
            <DialogTrigger asChild>
              <button
                type="button"
                className="border border-[#eca8d6]/35 bg-[#eca8d6]/5 px-3 py-1.5 font-mono text-[#eca8d6] transition-[background-color,border-color,transform] duration-300 hover:border-[#eca8d6]/55 hover:bg-[#eca8d6]/10 hover:text-[#eca8d6] active:scale-[0.98]"
              >
                +
                {(isContent ? ALL_FORMATS : ALL_MODELS).length -
                  (isContent ? FORMATS_PREVIEW : MODELS_PREVIEW).length}{" "}
                {isContent ? "formatos más" : "modelos más"}
              </button>
            </DialogTrigger>
          </div>
          <DialogContent className="flex max-h-[85vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden border border-white/15 bg-zinc-950 p-0 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] sm:max-w-3xl">
            <DialogHeader className="border-b border-white/10 px-6 py-5 text-left">
              <DialogTitle className="font-display text-xl text-white">
                {isContent ? "Formatos de contenido" : "Catálogo de modelos"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isContent
                  ? "Piezas que diseñamos y adaptamos a la identidad de tu marca para redes y campañas."
                  : "Referencias de familias LLM / multimodal usadas en integraciones y agentes. Lista orientativa."}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto px-6 py-5">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(isContent ? ALL_FORMATS : ALL_MODELS).map((name) => (
                  <li
                    key={name}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-foreground/95 transition-colors hover:border-[#eca8d6]/25 hover:bg-white/[0.06]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
