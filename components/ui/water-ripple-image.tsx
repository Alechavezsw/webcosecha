"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Params = {
  blueish: number;
  scale: number;
  illumination: number;
  surfaceDistortion: number;
  waterDistortion: number;
  src: string;
};

export type WaterRippleImageProps = Partial<Params> & {
  className?: string;
  alt?: string;
  /** Muestra solo la imagen (sin WebGL) — asegura que la foto se vea aunque falle la textura o el shader. */
  staticOnly?: boolean;
  /** Carga prioritaria (`fetchPriority` / `loading`) en modo estático o fallback. */
  priority?: boolean;
};

type WaterRippleImageGlProps = Omit<WaterRippleImageProps, "staticOnly">;

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  } else {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  }
  float scale_factor = 1.4;
  img_uv *= scale_factor;
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);

  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  float edge_width = .02;
  float edge_alpha = smoothstep(0., edge_width, img_uv.x) * smoothstep(1., 1. - edge_width, img_uv.x);
  edge_alpha *= smoothstep(0., edge_width, img_uv.y) * smoothstep(1., 1. - edge_width, img_uv.y);
  color *= edge_alpha;
  opacity *= edge_alpha;

  gl_FragColor = vec4(color, opacity);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile error: ${info || "unknown"}`);
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${info || "unknown"}`);
  }
  return prog;
}

function WaterRippleStaticImage({
  src,
  className,
  alt,
  priority,
}: {
  src: string;
  className?: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative isolate aspect-[21/9] min-h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40",
        className,
      )}
    >
      {/* Imagen local en `public/`: <img> evita capas extra de next/image y problemas de stacking. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1920}
        height={823}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className="absolute inset-0 z-[1] h-full w-full object-cover"
      />
    </div>
  );
}

function WaterRippleImageGl({
  blueish = 0.55,
  scale = 7,
  illumination = 0.14,
  surfaceDistortion = 0.07,
  waterDistortion = 0.03,
  src = "/games/Gemini_Generated_Image_larv62larv62larv.png",
  className,
  alt = "",
  priority = false,
}: WaterRippleImageGlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const texRef = useRef<WebGLTexture | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [params] = useState<Params>({
    blueish,
    scale,
    illumination,
    surfaceDistortion,
    waterDistortion,
    src,
  });

  const [webglFailed, setWebglFailed] = useState(false);

  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const updateUniforms = (gl: WebGLRenderingContext) => {
    const loc = uniformsRef.current;
    const set = (name: string, v: number) => {
      const L = loc[name];
      if (L) gl.uniform1f(L, v);
    };
    set("u_blueish", params.blueish);
    set("u_scale", params.scale);
    set("u_illumination", params.illumination);
    set("u_surface_distortion", params.surfaceDistortion);
    set("u_water_distortion", params.waterDistortion);
  };

  const setTextureFromImage = (gl: WebGLRenderingContext, image: HTMLImageElement) => {
    if (texRef.current) gl.deleteTexture(texRef.current);
    const texture = gl.createTexture()!;
    texRef.current = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const loc = uniformsRef.current;
    if (loc.u_image_texture) gl.uniform1i(loc.u_image_texture, 0);

    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvas = canvasRef.current!;
    if (loc.u_ratio) gl.uniform1f(loc.u_ratio, canvas.width / canvas.height);
    if (loc.u_img_ratio) gl.uniform1f(loc.u_img_ratio, imgRatio);
  };

  const loadImage = (srcUrl: string, gl: WebGLRenderingContext) =>
    new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      const resolved =
        typeof window !== "undefined" && srcUrl.startsWith("/")
          ? new URL(srcUrl, window.location.origin).href
          : srcUrl;
      if (resolved.startsWith("http")) img.crossOrigin = "anonymous";
      img.onload = () => {
        imgRef.current = img;
        setTextureFromImage(gl, img);
        resolve();
      };
      img.onerror = reject;
      img.src = resolved;
    });

  const resize = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!gl || !canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.max(2, Math.floor(rect.width * dpr));
    const h = Math.max(2, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    const loc = uniformsRef.current;
    if (loc.u_ratio) gl.uniform1f(loc.u_ratio, canvas.width / canvas.height);

    if (imgRef.current && loc.u_img_ratio) {
      const imgRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      gl.uniform1f(loc.u_img_ratio, imgRatio);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    /** No usar `isWebGLAvailable()` global: en algunos equipos el test en canvas auxiliar falla y el canvas real sí obtiene contexto. */
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: "high-performance",
      }) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setWebglFailed(true);
      return;
    }
    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let cancelled = false;

    const onResize = () => resize();
    const ro = new ResizeObserver(() => resize());

    const teardownGl = () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      if (texRef.current && glRef.current) glRef.current.deleteTexture(texRef.current);
      texRef.current = null;
      const g = glRef.current;
      if (g) {
        g.useProgram(null);
        if (programRef.current) g.deleteProgram(programRef.current);
      }
      programRef.current = null;
      glRef.current = null;
    };

    try {
      const program = createProgram(gl, VERT, FRAG);
      programRef.current = program;
      gl.useProgram(program);

      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) continue;
        uniformsRef.current[info.name] = gl.getUniformLocation(program, info.name);
      }

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      updateUniforms(gl);

      window.addEventListener("resize", onResize);
      ro.observe(container);
      resize();

      const render = () => {
        if (cancelled || !glRef.current) return;
        const g = glRef.current;
        const u = uniformsRef.current;
        if (u.u_time) {
          g.uniform1f(u.u_time, performance.now());
        }
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
        animRef.current = requestAnimationFrame(render);
      };

      loadImage(src, gl)
        .then(() => {
          if (cancelled) return;
          resize();
          animRef.current = requestAnimationFrame(render);
        })
        .catch(() => {
          teardownGl();
          setWebglFailed(true);
        });

      return () => {
        cancelled = true;
        teardownGl();
      };
    } catch (e) {
      console.error("[WaterRippleImage]", e);
      setWebglFailed(true);
      return () => {
        cancelled = true;
        teardownGl();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; src is stable for this embed
  }, []);

  if (webglFailed) {
    return (
      <WaterRippleStaticImage
        src={src}
        className={className}
        alt={alt || "Imagen de evento"}
        priority={priority}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[21/9] min-h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50",
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}

export function WaterRippleImage(props: WaterRippleImageProps) {
  const { staticOnly, ...rest } = props;
  if (staticOnly) {
    return (
      <WaterRippleStaticImage
        src={props.src ?? "/games/Gemini_Generated_Image_larv62larv62larv.png"}
        className={props.className}
        alt={props.alt || "Imagen de evento"}
        priority={props.priority}
      />
    );
  }
  return <WaterRippleImageGl {...rest} />;
}
