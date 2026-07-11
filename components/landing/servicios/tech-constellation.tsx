"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// ============================================================================
// CONSTELACIÓN DE DATOS — capa 3D elegante compartida por las páginas de servicios
// tech (/servicios/ia, /servicios/apps...). Red neuronal abstracta: nodos de luz
// suaves conectados por líneas finas que se forman y disuelven según la cercanía,
// más un polvo estelar de fondo. Glow contenido (bloom desktop), la cámara desciende
// con el scroll (parallax de profundidad) y todo acompaña al cursor con suavidad.
// Look limpio, premium y coherente. Respeta prefers-reduced-motion, se escala en
// mobile y pausa con la pestaña oculta.
// ============================================================================

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return new THREE.Texture();
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.85)");
  g.addColorStop(0.5, "rgba(255,255,255,0.32)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

export function TechConstellation({
  /** 5 colores (hex) para los nodos; las líneas heredan el color de los nodos. */
  paletteHex = [0x67e8f9, 0xa5b4fc, 0xc4b5fd, 0xe879f9, 0xdbeafe],
  dustColorHex = 0x9fc6ff,
  fogColorHex = 0x03030c,
}: {
  paletteHex?: number[];
  dustColorHex?: number;
  fogColorHex?: number;
} = {}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    try {
      const test = document.createElement("canvas");
      if (!test.getContext("webgl") && !test.getContext("experimental-webgl")) return;
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogColorHex, 0.018);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      160
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 1.85));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // Bloom suave (solo desktop): da un halo refinado, no saturado
    let composer: EffectComposer | null = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.5, // strength: glow elegante
          0.62, // radius
          0.22 // threshold: solo los nodos brillan, el fondo queda limpio
        )
      );
      composer.addPass(new OutputPass());
    }

    const glowTex = makeGlowTexture();

    // Paleta configurable (default = marca tech fría). Se garantizan 5 entradas.
    const baseHex =
      paletteHex.length >= 5
        ? paletteHex.slice(0, 5)
        : [...paletteHex, 0xdbeafe, 0xdbeafe, 0xdbeafe, 0xdbeafe, 0xdbeafe].slice(0, 5);
    const palette = baseHex.map((h) => new THREE.Color(h));
    const pickColor = (i: number) => {
      // Mayoría fría, fucsia esporádico → elegante
      const r = (i * 0.61803398875) % 1;
      if (r > 0.86) return palette[3];
      if (r > 0.62) return palette[2];
      if (r > 0.4) return palette[1];
      if (r > 0.18) return palette[0];
      return palette[4];
    };

    const SPAN_X = 19;
    const SPAN_Y = 12;
    const Z_MIN = -24;
    const Z_MAX = -1;

    // --- NODOS (puntos de luz) ---
    const N = isMobile ? 34 : 64;
    const nodePos = new Float32Array(N * 3);
    const nodeBase = new Float32Array(N * 3);
    const nodeCol = new Float32Array(N * 3);
    const nodePhase = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = (Math.random() - 0.5) * SPAN_X * 2;
      const y = (Math.random() - 0.5) * SPAN_Y * 2;
      const z = Z_MIN + Math.random() * (Z_MAX - Z_MIN);
      nodeBase[i * 3] = x;
      nodeBase[i * 3 + 1] = y;
      nodeBase[i * 3 + 2] = z;
      nodePos[i * 3] = x;
      nodePos[i * 3 + 1] = y;
      nodePos[i * 3 + 2] = z;
      const c = pickColor(i);
      nodeCol[i * 3] = c.r;
      nodeCol[i * 3 + 1] = c.g;
      nodeCol[i * 3 + 2] = c.b;
      nodePhase[i] = Math.random() * Math.PI * 2;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.5,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    nodes.frustumCulled = false;
    scene.add(nodes);

    // --- LÍNEAS entre nodos cercanos (red que se forma y disuelve) ---
    const MAX_SEG = isMobile ? 160 : 360;
    const linePos = new Float32Array(MAX_SEG * 2 * 3);
    const lineCol = new Float32Array(MAX_SEG * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.36,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.frustumCulled = false;
    scene.add(lines);
    const LINK_DIST = 4.4;

    // --- POLVO ESTELAR de fondo (profundidad) ---
    const dustCount = isMobile ? 90 : 200;
    const dustPos = new Float32Array(dustCount * 3);
    const dustBase = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const x = (Math.random() - 0.5) * SPAN_X * 2.4;
      const y = (Math.random() - 0.5) * SPAN_Y * 2.4;
      const z = -30 + Math.random() * 30;
      dustBase[i * 3] = x;
      dustBase[i * 3 + 1] = y;
      dustBase[i * 3 + 2] = z;
      dustPos[i * 3] = x;
      dustPos[i * 3 + 1] = y;
      dustPos[i * 3 + 2] = z;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.12,
      map: glowTex,
      color: dustColorHex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);

    // --- Interacción ---
    let mouseX = 0;
    let mouseY = 0;
    let cursorActive = false;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      cursorActive = true;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Cursor proyectado al mundo (raycast a un plano dentro de la nube) → la red lo "sigue"
    const raycaster = new THREE.Raycaster();
    const cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 8); // plano z = -8
    const mouseNDC = new THREE.Vector2();
    const cursorWorld = new THREE.Vector3(9999, 9999, 9999);
    const CURSOR_LINK = 6.5;

    const SCROLL_FACTOR = 0.0055;
    let camY = 0;

    const clock = new THREE.Clock();
    let raf = 0;
    let lastTime = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (document.hidden) {
        lastTime = clock.getElapsedTime();
        return;
      }
      const time = clock.getElapsedTime();
      const dt = Math.min(time - lastTime, 0.05);
      lastTime = time;

      const sy = window.scrollY;
      const targetCamY = -sy * SCROLL_FACTOR;
      camY += (targetCamY - camY) * 0.06;

      if (cursorActive) {
        mouseNDC.set(mouseX, -mouseY);
        raycaster.setFromCamera(mouseNDC, camera);
        raycaster.ray.intersectPlane(cursorPlane, cursorWorld);
      }

      // Deriva suave de los nodos + reciclaje vertical alrededor de la cámara
      for (let i = 0; i < N; i++) {
        const idx = i * 3;
        nodeBase[idx] += Math.sin(time * 0.25 + nodePhase[i]) * 0.006;
        nodeBase[idx + 1] += Math.cos(time * 0.22 + nodePhase[i]) * 0.005 + 0.004;
        if (nodeBase[idx + 1] > camY + SPAN_Y) nodeBase[idx + 1] -= SPAN_Y * 2;
        if (nodeBase[idx + 1] < camY - SPAN_Y) nodeBase[idx + 1] += SPAN_Y * 2;
        nodePos[idx] = nodeBase[idx];
        nodePos[idx + 1] = nodeBase[idx + 1];
        nodePos[idx + 2] = nodeBase[idx + 2];
      }
      nodeGeo.attributes.position.needsUpdate = true;
      nodeMat.size = 0.46 + 0.08 * Math.sin(time * 1.4);

      // Reconstruir la red (líneas) entre nodos cercanos, con fade por distancia
      let seg = 0;
      for (let i = 0; i < N && seg < MAX_SEG; i++) {
        const ax = nodePos[i * 3];
        const ay = nodePos[i * 3 + 1];
        const az = nodePos[i * 3 + 2];
        for (let j = i + 1; j < N && seg < MAX_SEG; j++) {
          const dx = ax - nodePos[j * 3];
          const dy = ay - nodePos[j * 3 + 1];
          const dz = az - nodePos[j * 3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < LINK_DIST * LINK_DIST) {
            const d = Math.sqrt(d2);
            const b = Math.pow(1 - d / LINK_DIST, 1.5) * 0.9; // brillo por cercanía
            const o = seg * 6;
            linePos[o] = ax;
            linePos[o + 1] = ay;
            linePos[o + 2] = az;
            linePos[o + 3] = nodePos[j * 3];
            linePos[o + 4] = nodePos[j * 3 + 1];
            linePos[o + 5] = nodePos[j * 3 + 2];
            // color mezcla de ambos nodos
            for (let k = 0; k < 2; k++) {
              const src = k === 0 ? i : j;
              lineCol[o + k * 3] = nodeCol[src * 3] * b;
              lineCol[o + k * 3 + 1] = nodeCol[src * 3 + 1] * b;
              lineCol[o + k * 3 + 2] = nodeCol[src * 3 + 2] * b;
            }
            seg++;
          }
        }
      }
      // Líneas que conectan los nodos cercanos al CURSOR → la red "sigue" el puntero
      if (cursorActive) {
        for (let i = 0; i < N && seg < MAX_SEG; i++) {
          const dx = nodePos[i * 3] - cursorWorld.x;
          const dy = nodePos[i * 3 + 1] - cursorWorld.y;
          const dz = nodePos[i * 3 + 2] - cursorWorld.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < CURSOR_LINK * CURSOR_LINK) {
            const b = Math.pow(1 - Math.sqrt(d2) / CURSOR_LINK, 1.4);
            const o = seg * 6;
            linePos[o] = nodePos[i * 3];
            linePos[o + 1] = nodePos[i * 3 + 1];
            linePos[o + 2] = nodePos[i * 3 + 2];
            linePos[o + 3] = cursorWorld.x;
            linePos[o + 4] = cursorWorld.y;
            linePos[o + 5] = cursorWorld.z;
            lineCol[o] = nodeCol[i * 3] * b;
            lineCol[o + 1] = nodeCol[i * 3 + 1] * b;
            lineCol[o + 2] = nodeCol[i * 3 + 2] * b;
            lineCol[o + 3] = b;
            lineCol[o + 4] = b;
            lineCol[o + 5] = b;
            seg++;
          }
        }
      }
      lineGeo.setDrawRange(0, seg * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Polvo: deriva ascendente lenta + reciclaje
      for (let i = 0; i < dustCount; i++) {
        const idx = i * 3;
        dustBase[idx + 1] += dt * (0.25 + (i % 4) * 0.06);
        if (dustBase[idx + 1] > camY + SPAN_Y * 1.2) dustBase[idx + 1] -= SPAN_Y * 2.4;
        dustPos[idx] = dustBase[idx];
        dustPos[idx + 1] = dustBase[idx + 1];
        dustPos[idx + 2] = dustBase[idx + 2];
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Cámara: desciende, acompaña al cursor con suavidad, respira
      const targetCamX = mouseX * 1.3 + Math.sin(time * 0.22) * 0.25;
      camera.position.x += (targetCamX - camera.position.x) * 0.035;
      camera.position.y = camY - mouseY * 0.7 + Math.cos(time * 0.2) * 0.18;
      camera.lookAt(mouseX * 0.5, camY - mouseY * 0.3, -8);

      if (composer) composer.render();
      else renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer?.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      if (mount && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      composer?.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      dustGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}
