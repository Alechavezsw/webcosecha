"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  createGlowTexture,
  createMonarchForewingTexture,
  createMonarchHindwingTexture,
} from "@/components/landing/hero-3d";

// ============================================================================
// FONDO 3D AMBIENTAL DE TODA LA HOME
// Un único canvas fijo detrás de todo el contenido: la cámara desciende por un
// campo infinito de esporas de luz a medida que se scrollea (paralaje 3D real),
// con mariposas monarca cruzando a lo largo de todo el recorrido y repulsión
// de partículas alrededor del cursor. Se pinta solo cuando el hero (que tiene
// su propia capa) deja de cubrir la pantalla.
// ============================================================================

export function Ambient3DBackground({
  heroCover = true,
}: {
  /** Si true (home), no pinta mientras el hero opaco cubre el viewport. En páginas
   *  sin hero a pantalla completa (p. ej. /nosotros) pasar false para pintar desde arriba. */
  heroCover?: boolean;
} = {}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    try {
      const testCanvas = document.createElement("canvas");
      if (!testCanvas.getContext("webgl") && !testCanvas.getContext("experimental-webgl")) return;
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05030a, 0.03);

    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      110
    );
    camera.position.set(0, 0, 13);

    // Sin antialias: la escena es todo sprites difusos con blending aditivo,
    // el MSAA no aporta y cuesta caro en GPU (este canvas pinta toda la home).
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const glowTex = createGlowTexture();

    scene.add(new THREE.AmbientLight(0xffe4f0, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffd9b0, 1.3);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);

    // --- CAMPO INFINITO DE ESPORAS (se recicla verticalmente alrededor de la cámara) ---
    type SporeSystem = {
      points: THREE.Points;
      mat: THREE.PointsMaterial;
      base: Float32Array;
      offset: Float32Array;
      count: number;
      twinkleSpeed: number;
      baseSize: number;
      baseOpacity: number;
    };

    // Volumen relativo a la cámara: ±SPAN_Y alrededor de camY
    const SPAN_X = 30;
    const SPAN_Y = 16;
    const Z_MIN = -30;
    const Z_MAX = 6;

    const mkSporeSystem = (
      count: number,
      color: string,
      baseSize: number,
      twinkleSpeed: number,
      baseOpacity = 0.8,
      zMin = Z_MIN,
      zMax = Z_MAX
    ): SporeSystem => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const base = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        base[i * 3] = (Math.random() - 0.5) * SPAN_X * 2;
        base[i * 3 + 1] = (Math.random() - 0.5) * SPAN_Y * 2;
        base[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);
        positions[i * 3] = base[i * 3];
        positions[i * 3 + 1] = base[i * 3 + 1];
        positions[i * 3 + 2] = base[i * 3 + 2];
      }
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size: baseSize,
        color,
        map: glowTex,
        transparent: true,
        opacity: baseOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, mat, base, offset: new Float32Array(count * 3), count, twinkleSpeed, baseSize, baseOpacity };
    };

    const sporeScale = isMobile ? 0.45 : 1;
    const sporeSystems: SporeSystem[] = [
      mkSporeSystem(Math.round(360 * sporeScale), "#eca8d6", 0.48, 2.4),
      mkSporeSystem(Math.round(220 * sporeScale), "#9d6bff", 0.4, 3.2),
      mkSporeSystem(Math.round(150 * sporeScale), "#67e8f9", 0.34, 4.0),
      mkSporeSystem(Math.round(130 * sporeScale), "#ffd27a", 0.4, 2.9), // luciérnagas doradas
      // Capa cercana NÍTIDA: pocas esporas chicas pasando junto a la cámara
      // (profundidad sin el desenfoque que no gustó)
      mkSporeSystem(Math.round(isMobile ? 12 : 26), "#f0c8e4", 0.6, 2.0, 0.9, 1.5, 6.5),
    ];

    // --- NEBULOSAS DE PROFUNDIDAD (halos enormes al fondo, parallax lento) ---
    type Nebula = { sprite: THREE.Sprite; baseX: number; baseY: number; parallax: number; pulse: number; baseOpacity: number };
    const nebulas: Nebula[] = [];
    const nebulaDefs: Array<[number, number, number, number]> = isMobile
      ? [
          [0xa100f2, 30, 0.085, -26],
          [0xeca8d6, 24, 0.07, -22],
          [0x67e8f9, 20, 0.05, -24],
        ]
      : [
          [0xa100f2, 34, 0.1, -26],
          [0xeca8d6, 26, 0.085, -22],
          [0x67e8f9, 22, 0.055, -24],
          [0x7b2fd6, 30, 0.09, -28],
          [0xff9ecb, 20, 0.06, -20],
        ];
    nebulaDefs.forEach(([color, scale, opacity, z], i) => {
      const mat = new THREE.SpriteMaterial({
        map: glowTex,
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(scale);
      sprite.position.z = z;
      scene.add(sprite);
      nebulas.push({
        sprite,
        baseX: (i / nebulaDefs.length - 0.5) * SPAN_X * 1.6 + (Math.random() - 0.5) * 6,
        baseY: (Math.random() - 0.5) * SPAN_Y * 2,
        parallax: 0.45 + Math.random() * 0.25,
        pulse: 0.1 + Math.random() * 0.15,
        baseOpacity: opacity,
      });
    });

    // --- LUCIÉRNAGAS ERRANTES (deriva propia, parpadeo doble real, esquivan el cursor) ---
    type Firefly = {
      sprite: THREE.Sprite;
      mat: THREE.SpriteMaterial;
      bx: number; by: number; bz: number;
      ox: number; oy: number;
      f1: number; f2: number; f3: number;
      phi: number;
      maxOp: number;
      blinkRate: number;
      baseScale: number;
    };
    const fireflies: Firefly[] = [];
    const fireflyColors = [0xffd27a, 0x5ef3c8, 0xffd27a, 0xeca8d6, 0xffb35c, 0x5ef3c8, 0xffd27a, 0xf0b6ff];
    const numFireflies = isMobile ? 5 : 12;
    for (let i = 0; i < numFireflies; i++) {
      const mat = new THREE.SpriteMaterial({
        map: glowTex,
        color: fireflyColors[i % fireflyColors.length],
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      const baseScale = 0.35 + Math.random() * 0.65;
      sprite.scale.setScalar(baseScale);
      scene.add(sprite);
      fireflies.push({
        sprite,
        mat,
        bx: (Math.random() - 0.5) * 28,
        by: (Math.random() - 0.5) * 11,
        bz: -9 + Math.random() * 12, // algunas pasan bien cerca de la cámara
        ox: 0,
        oy: 0,
        f1: 0.25 + Math.random() * 0.35,
        f2: 0.2 + Math.random() * 0.3,
        f3: 0.15 + Math.random() * 0.25,
        phi: Math.random() * Math.PI * 2,
        maxOp: 0.5 + Math.random() * 0.35,
        blinkRate: 0.09 + Math.random() * 0.08,
        baseScale,
      });
    }

    // --- ESPORAS FUGACES (estelas nítidas que cruzan el campo de tanto en tanto) ---
    type Streak = {
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      active: boolean;
      x: number; y: number; z: number;
      vx: number; vy: number;
      life: number;
      maxLife: number;
      nextAt: number;
    };
    const streakGeom = new THREE.PlaneGeometry(1, 1);
    const streakColors = [0xffe9f6, 0xffd27a, 0xd8b4ff];
    const streaks: Streak[] = [];
    const numStreaks = isMobile ? 2 : 3;
    for (let i = 0; i < numStreaks; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: glowTex,
        color: streakColors[i % streakColors.length],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(streakGeom, mat);
      mesh.visible = false;
      scene.add(mesh);
      streaks.push({
        mesh, mat,
        active: false,
        x: 0, y: 0, z: 0,
        vx: 0, vy: 0,
        life: 0,
        maxLife: 1,
        nextAt: 2 + Math.random() * 6,
      });
    }

    // --- MARIPOSAS MONARCA acompañando todo el recorrido ---
    const monarchForeTex = createMonarchForewingTexture();
    const monarchHindTex = createMonarchHindwingTexture();

    const bForeGeom = new THREE.PlaneGeometry(0.42, 0.36);
    bForeGeom.rotateX(-Math.PI / 2);
    bForeGeom.translate(0.21, 0.004, -0.07);
    const bHindGeom = new THREE.PlaneGeometry(0.34, 0.34);
    bHindGeom.rotateX(-Math.PI / 2);
    bHindGeom.translate(0.155, -0.004, 0.07);
    const bBodyGeom = new THREE.CylinderGeometry(0.012, 0.02, 0.3, 6);
    bBodyGeom.rotateX(Math.PI / 2);
    const bHeadGeom = new THREE.SphereGeometry(0.024, 8, 8);
    const bBodyMat = new THREE.MeshStandardMaterial({ color: 0x140d07, roughness: 0.95 });

    const bHaloGeom = new THREE.PlaneGeometry(0.95, 0.95);
    const bHaloMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      color: 0xffa54d,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mkWingMat = (tex: THREE.Texture, tint: number | null, emissiveCol: number) =>
      new THREE.MeshStandardMaterial({
        map: tex,
        color: tint !== null ? new THREE.Color(tint) : new THREE.Color(0xffffff),
        emissive: new THREE.Color(emissiveCol),
        emissiveMap: tex,
        emissiveIntensity: 0.9,
        side: THREE.DoubleSide,
        roughness: 0.45,
        alphaTest: 0.35,
      });
    const wingVariants = [
      { fore: mkWingMat(monarchForeTex, null, 0xff5a00), hind: mkWingMat(monarchHindTex, null, 0xff5a00) },
      { fore: mkWingMat(monarchForeTex, 0xffd700, 0xff8c00), hind: mkWingMat(monarchHindTex, 0xffd700, 0xff8c00) },
      { fore: mkWingMat(monarchForeTex, 0xf0b6ff, 0xa100f2), hind: mkWingMat(monarchHindTex, 0xf0b6ff, 0xa100f2) },
    ];

    type Butterfly = {
      group: THREE.Group;
      rootL: THREE.Group;
      rootR: THREE.Group;
      halo: THREE.Mesh;
      dir: number;
      speed: number;
      baseY: number;
      z: number;
      offset: number;
      phase: number;
      energy: number;
      gliding: boolean;
      modeUntil: number;
    };

    const butterflies: Butterfly[] = [];
    const numButterflies = isMobile ? 3 : 6;
    for (let i = 0; i < numButterflies; i++) {
      const group = new THREE.Group();
      const variant = wingVariants[i % wingVariants.length];

      const mkSide = (sign: number) => {
        const root = new THREE.Group();
        const fore = new THREE.Mesh(bForeGeom, variant.fore);
        const hind = new THREE.Mesh(bHindGeom, variant.hind);
        root.add(fore, hind);
        root.position.x = sign * 0.012;
        root.scale.x = sign;
        return root;
      };
      const rootL = mkSide(1);
      const rootR = mkSide(-1);

      const body = new THREE.Mesh(bBodyGeom, bBodyMat);
      const head = new THREE.Mesh(bHeadGeom, bBodyMat);
      head.position.set(0, 0, -0.16);
      const halo = new THREE.Mesh(bHaloGeom, bHaloMat);
      halo.position.y = 0.04;

      group.add(rootL, rootR, body, head, halo);

      const dir = Math.random() > 0.5 ? 1 : -1;
      group.scale.setScalar(1.4 + Math.random() * 1.0);
      const baseY = (Math.random() - 0.5) * 8;
      const z = -3 - Math.random() * 8;
      group.position.set(dir * -(18 + Math.random() * 10), baseY, z);

      butterflies.push({
        group, rootL, rootR, halo,
        dir,
        speed: 1.2 + Math.random() * 0.9,
        baseY,
        z,
        offset: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        energy: 1,
        gliding: false,
        modeUntil: Math.random() * 1.5,
      });
      scene.add(group);
    }

    // --- INTERACCIÓN Y SCROLL ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const raycaster = new THREE.Raycaster();
    const interactPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 4);
    const mouseNDC = new THREE.Vector2();
    const mouseWorld = new THREE.Vector3(9999, 9999, 9999);

    // La cámara desciende por el campo según el scroll de la página
    const SCROLL_FACTOR = 0.0052;
    let camY = 0;

    // Velocidad de scroll suavizada: alimenta el ladeo de cámara, el FOV y el
    // brillo de las esporas para que el descenso se sienta como un vuelo.
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let bank = 0;

    const clock = new THREE.Clock();
    let animationFrameId: number;
    let lastTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // El hero (con su propia capa 3D y video opaco) cubre el inicio: no pintar debajo
      if (heroCover) {
        const heroCovers = window.scrollY < window.innerHeight * 0.28;
        if (heroCovers) {
          lastTime = clock.getElapsedTime();
          lastScrollY = window.scrollY;
          return;
        }
      }

      const time = clock.getElapsedTime();
      const dt = Math.min(time - lastTime, 0.05);
      lastTime = time;

      // Descenso suavizado por el campo de esporas
      const targetCamY = -window.scrollY * SCROLL_FACTOR;
      camY += (targetCamY - camY) * 0.07;

      // Velocidad de scroll (px/s) suavizada → 0..1
      const sy = window.scrollY;
      const rawVel = (sy - lastScrollY) / Math.max(dt, 1e-3);
      lastScrollY = sy;
      scrollVel += (rawVel - scrollVel) * 0.08;
      const speed01 = Math.min(Math.abs(scrollVel) / 2400, 1);

      mouseNDC.set(mouseX, -mouseY);
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(interactPlane, mouseWorld);

      sporeSystems.forEach((sys, sIdx) => {
        const positions = sys.points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sys.count; i++) {
          const idx = i * 3;
          const fs = 0.3 + ((i + sIdx * 7) % 6) * 0.1;

          sys.base[idx] += Math.sin(time * fs + sys.base[idx + 1] * 0.09) * 0.012;
          sys.base[idx + 1] += Math.cos(time * fs * 0.8 + sys.base[idx] * 0.07) * 0.008 + 0.003;
          sys.base[idx + 2] += Math.sin(time * fs * 0.6 + i) * 0.005;

          // Reciclaje del volumen ALREDEDOR de la cámara (campo infinito al scrollear)
          if (sys.base[idx + 1] > camY + SPAN_Y) sys.base[idx + 1] -= SPAN_Y * 2;
          if (sys.base[idx + 1] < camY - SPAN_Y) sys.base[idx + 1] += SPAN_Y * 2;
          if (sys.base[idx] > SPAN_X) sys.base[idx] = -SPAN_X;
          if (sys.base[idx] < -SPAN_X) sys.base[idx] = SPAN_X;

          // Repulsión elástica alrededor del cursor
          const dx = sys.base[idx] + sys.offset[idx] - mouseWorld.x;
          const dy = sys.base[idx + 1] + sys.offset[idx + 1] - mouseWorld.y;
          const dz = sys.base[idx + 2] - mouseWorld.z;
          const distSq = dx * dx + dy * dy + dz * dz * 0.25;
          if (distSq < 16) {
            const dist = Math.sqrt(distSq) || 0.001;
            const force = ((4 - dist) / 4) * 0.12;
            sys.offset[idx] += (dx / dist) * force;
            sys.offset[idx + 1] += (dy / dist) * force;
          }
          sys.offset[idx] *= 0.94;
          sys.offset[idx + 1] *= 0.94;

          positions[idx] = sys.base[idx] + sys.offset[idx];
          positions[idx + 1] = sys.base[idx + 1] + sys.offset[idx + 1];
          positions[idx + 2] = sys.base[idx + 2];
        }
        sys.points.geometry.attributes.position.needsUpdate = true;
        sys.mat.size =
          sys.baseSize * (0.82 + 0.28 * Math.sin(time * sys.twinkleSpeed + sIdx * 2.1)) * (1 + speed01 * 0.3);
        sys.mat.opacity = Math.min(sys.baseOpacity * (1 + speed01 * 0.3), 1);
      });

      // Nebulosas: siguen a la cámara con parallax lento (fondo con profundidad
      // infinita) y respiran apenas
      nebulas.forEach((n, i) => {
        const wrapSpan = SPAN_Y * 2.4;
        let relY = (n.baseY - camY * (1 - n.parallax)) % wrapSpan;
        if (relY > wrapSpan / 2) relY -= wrapSpan;
        if (relY < -wrapSpan / 2) relY += wrapSpan;
        n.sprite.position.x = n.baseX + Math.sin(time * 0.05 + i * 1.7) * 2.5;
        n.sprite.position.y = camY + relY;
        n.sprite.material.opacity = n.baseOpacity * (0.85 + 0.15 * Math.sin(time * n.pulse + i * 2.3));
      });

      // Luciérnagas errantes: deriva orgánica + parpadeo doble (como las reales:
      // oscuras la mayor parte del ciclo, dos destellos rápidos) + huyen del cursor
      fireflies.forEach((f, i) => {
        const px = f.bx + Math.sin(time * f.f1 + f.phi) * 3.4 + Math.sin(time * f.f2 * 1.7 + i) * 1.2;
        const py = camY + f.by + Math.sin(time * f.f2 + f.phi * 2) * 2.2;

        const dx = px + f.ox - mouseWorld.x;
        const dy = py + f.oy - mouseWorld.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 12) {
          const dist = Math.sqrt(distSq) || 0.001;
          const force = ((3.5 - dist) / 3.5) * 0.14;
          f.ox += (dx / dist) * force;
          f.oy += (dy / dist) * force;
        }
        f.ox *= 0.95;
        f.oy *= 0.95;

        f.sprite.position.set(px + f.ox, py + f.oy, f.bz + Math.sin(time * f.f3 + f.phi) * 2.4);

        const cyc = (time * f.blinkRate + f.phi) % 1;
        const flash =
          Math.exp(-Math.pow((cyc - 0.14) * 20, 2)) + 0.8 * Math.exp(-Math.pow((cyc - 0.32) * 20, 2));
        const glow = Math.min(flash, 1);
        f.mat.opacity = f.maxOp * (0.07 + 0.93 * glow);
        f.sprite.scale.setScalar(f.baseScale * (0.85 + 0.4 * glow));
      });

      // Esporas fugaces: nacen cada tanto en un borde, cruzan en diagonal con
      // estela alargada y se apagan (envolvente senoidal de opacidad)
      streaks.forEach((st) => {
        if (!st.active) {
          if (time >= st.nextAt) {
            st.active = true;
            st.mesh.visible = true;
            st.life = 0;
            st.maxLife = 0.9 + Math.random() * 0.6;
            const fromLeft = Math.random() > 0.5;
            st.x = fromLeft ? -SPAN_X * 0.9 : SPAN_X * 0.9;
            st.y = camY + (Math.random() - 0.5) * SPAN_Y * 1.4;
            st.z = -14 + Math.random() * 10;
            const speed = 26 + Math.random() * 14;
            const angle = (Math.random() - 0.5) * 0.7; // mayormente horizontal
            st.vx = (fromLeft ? 1 : -1) * Math.cos(angle) * speed;
            st.vy = Math.sin(angle) * speed * 0.6;
            st.mesh.rotation.z = Math.atan2(st.vy, st.vx);
          }
          return;
        }
        st.life += dt;
        st.x += st.vx * dt;
        st.y += st.vy * dt;
        st.mesh.position.set(st.x, st.y, st.z);
        const life01 = st.life / st.maxLife;
        const env = Math.sin(Math.PI * Math.min(life01, 1));
        st.mat.opacity = env * 0.75;
        st.mesh.scale.set(3.6 + env * 2.2, 0.09 + env * 0.05, 1);
        if (life01 >= 1) {
          st.active = false;
          st.mesh.visible = false;
          st.nextAt = time + 3.5 + Math.random() * 7;
        }
      });

      // Mariposas: cruce lateral a la altura de la cámara + vuelo real
      butterflies.forEach((b) => {
        if (time > b.modeUntil) {
          b.gliding = !b.gliding;
          b.modeUntil = time + (b.gliding ? 0.5 + Math.random() * 1.0 : 0.55 + Math.random() * 0.85);
        }
        const targetEnergy = b.gliding ? 0 : 1;
        b.energy += (targetEnergy - b.energy) * (targetEnergy > b.energy ? 0.16 : 0.06);
        b.phase += dt * (Math.PI * 2) * (1.2 + 7.5 * b.energy);

        b.group.position.x += b.dir * b.speed * dt;
        const hoverY = Math.sin(time * 0.7 + b.offset) * 0.7
          + Math.sin(b.phase - Math.PI / 2) * 0.1 * b.energy
          - (1 - b.energy) * 0.5;
        b.group.position.y = camY + b.baseY + hoverY;
        b.group.position.z = b.z + Math.sin(time * 0.5 + b.offset) * 1.5;

        if (b.dir > 0 && b.group.position.x > 23) {
          b.group.position.x = -23;
          b.baseY = (Math.random() - 0.5) * 8;
        } else if (b.dir < 0 && b.group.position.x < -23) {
          b.group.position.x = 23;
          b.baseY = (Math.random() - 0.5) * 8;
        }

        b.group.rotation.y = b.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        b.group.rotation.z = Math.sin(time * 1.8 + b.offset) * 0.18 * (0.4 + 0.6 * b.energy);
        b.group.rotation.x = -0.2 * b.energy + Math.sin(time * 4.2 + b.offset) * 0.05 * b.energy;

        const sRaw = Math.sin(b.phase);
        const stroke = sRaw >= 0 ? Math.pow(sRaw, 0.78) : -Math.pow(-sRaw, 1.35);
        const flap = stroke * b.energy + (1 - b.energy) * (0.5 + Math.sin(time * 5.0 + b.offset) * 0.04);
        b.rootL.rotation.z = flap;
        b.rootR.rotation.z = -flap;

        b.halo.lookAt(camera.position);
      });

      // Cámara: desciende con el scroll, acompaña al cursor, respira
      const targetCamX = mouseX * 1.5 + Math.sin(time * 0.3) * 0.3;
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y = camY - mouseY * 0.8 + Math.cos(time * 0.25) * 0.2;
      camera.lookAt(mouseX * 0.7, camY - mouseY * 0.4, -7);

      // Vuelo: ladeo sutil según la dirección del scroll + FOV que se abre con
      // la velocidad (sensación de acelerar por el campo). lookAt resetea la
      // rotación, así que el ladeo se aplica después.
      const targetBank = -Math.sign(scrollVel) * speed01 * 0.05 - mouseX * 0.015;
      bank += (targetBank - bank) * 0.06;
      camera.rotation.z += bank;
      const targetFov = 58 + speed01 * 6;
      if (Math.abs(targetFov - camera.fov) > 0.01) {
        camera.fov += (targetFov - camera.fov) * 0.07;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // heroCover es un literal constante por página (no cambia en runtime); el closure
    // lo captura una sola vez. Dejamos el array vacío para que su tamaño sea siempre
    // constante y no dispare el warning de React al hacer hot-reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
