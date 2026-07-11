"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ============================================================================
// CAPA 3D INMERSIVA DEL HERO
// Campo de esporas de luz en profundidad que reacciona al mouse, un río de
// polen dorado que fluye en diagonal y mariposas monarca (anatomía real de
// 4 alas) cruzando la escena. Vive entre el video de fondo y el contenido,
// con fondo transparente y pointer-events-none: pura atmósfera.
// ============================================================================

export function createGlowTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.75)");
  gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// Ala ANTERIOR (forewing) de monarca: triangular, barrida hacia adelante,
// con ápice negro y banda de manchas claras
export function createMonarchForewingTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();
  ctx.clearRect(0, 0, 256, 256);

  const traceOutline = () => {
    ctx.beginPath();
    ctx.moveTo(14, 206);
    ctx.bezierCurveTo(30, 158, 96, 84, 196, 38);
    ctx.bezierCurveTo(220, 27, 242, 28, 240, 52);
    ctx.bezierCurveTo(238, 84, 216, 132, 186, 172);
    ctx.bezierCurveTo(166, 197, 124, 216, 84, 222);
    ctx.bezierCurveTo(52, 226, 22, 220, 14, 206);
    ctx.closePath();
  };

  ctx.save();
  traceOutline();
  ctx.clip();

  const grad = ctx.createLinearGradient(20, 210, 235, 55);
  grad.addColorStop(0, "#9c3c08");
  grad.addColorStop(0.25, "#e25822");
  grad.addColorStop(0.55, "#ff8c00");
  grad.addColorStop(1, "#ffa432");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "#170f08";
  ctx.lineCap = "round";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(22, 200);
  ctx.quadraticCurveTo(85, 150, 124, 124);
  ctx.moveTo(22, 204);
  ctx.quadraticCurveTo(80, 178, 122, 146);
  ctx.moveTo(124, 124);
  ctx.quadraticCurveTo(128, 136, 122, 146);
  ctx.stroke();

  ctx.lineWidth = 3;
  const veins: Array<[number, number, number, number]> = [
    [150, 96, 198, 44], [168, 96, 222, 50], [176, 110, 234, 70], [180, 126, 230, 100],
    [176, 144, 212, 136], [168, 162, 194, 166], [152, 178, 168, 192], [136, 188, 138, 208],
    [110, 196, 104, 216], [74, 200, 70, 220]
  ];
  veins.forEach(([cx, cy, tx, ty], idx) => {
    ctx.beginPath();
    const fromTop = idx < 4;
    ctx.moveTo(fromTop ? 124 : 122, fromTop ? 124 : 146);
    ctx.quadraticCurveTo(cx, cy, tx, ty);
    ctx.stroke();
  });

  ctx.fillStyle = "#15100b";
  ctx.beginPath();
  ctx.moveTo(148, 60);
  ctx.bezierCurveTo(178, 76, 196, 104, 192, 150);
  ctx.lineTo(232, 178);
  ctx.lineTo(256, 40);
  ctx.lineTo(196, 0);
  ctx.lineTo(120, 36);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffc46b";
  const apicalSpots: Array<[number, number, number, number, number]> = [
    [170, 78, 11, 6.5, -0.65], [190, 64, 10, 6, -0.7], [210, 52, 8.5, 5, -0.75],
    [186, 110, 9, 5.5, -0.4], [202, 92, 8, 5, -0.55], [218, 76, 6.5, 4, -0.7]
  ];
  apicalSpots.forEach(([x, y, rx, ry, rot]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  });

  traceOutline();
  ctx.strokeStyle = "#15100b";
  ctx.lineWidth = 26;
  ctx.stroke();

  const baseShadow = ctx.createRadialGradient(18, 206, 4, 18, 206, 58);
  baseShadow.addColorStop(0, "rgba(18,10,5,0.9)");
  baseShadow.addColorStop(1, "rgba(18,10,5,0)");
  ctx.fillStyle = baseShadow;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = "#fbf4e4";
  const outerDots: Array<[number, number]> = [
    [234, 64], [228, 88], [217, 114], [203, 140], [186, 164],
    [164, 186], [138, 202], [110, 213], [82, 219], [52, 219]
  ];
  outerDots.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); });
  const innerDots: Array<[number, number]> = [
    [226, 72], [216, 97], [203, 123], [187, 148], [167, 170], [143, 188], [116, 200], [88, 209]
  ];
  innerDots.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fill(); });
  const apexDots: Array<[number, number]> = [[225, 40], [235, 54], [240, 70]];
  apexDots.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.1, 0, Math.PI * 2); ctx.fill(); });

  ctx.restore();
  return new THREE.CanvasTexture(canvas);
}

// Ala POSTERIOR (hindwing) de monarca: abanico redondeado hacia atrás-afuera
export function createMonarchHindwingTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();
  ctx.clearRect(0, 0, 256, 256);

  const traceOutline = () => {
    ctx.beginPath();
    ctx.moveTo(16, 54);
    ctx.bezierCurveTo(64, 34, 120, 30, 158, 40);
    ctx.bezierCurveTo(208, 52, 242, 96, 240, 142);
    ctx.bezierCurveTo(238, 186, 204, 222, 152, 232);
    ctx.bezierCurveTo(110, 240, 62, 232, 38, 210);
    ctx.bezierCurveTo(18, 192, 10, 110, 16, 54);
    ctx.closePath();
  };

  ctx.save();
  traceOutline();
  ctx.clip();

  const grad = ctx.createRadialGradient(40, 70, 10, 130, 130, 170);
  grad.addColorStop(0, "#a84410");
  grad.addColorStop(0.3, "#ec6c12");
  grad.addColorStop(0.7, "#ff9322");
  grad.addColorStop(1, "#ffab3c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "#170f08";
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  const veins: Array<[number, number, number, number]> = [
    [108, 60, 156, 44], [128, 74, 204, 64], [148, 94, 234, 104], [152, 120, 236, 148],
    [146, 146, 218, 192], [128, 168, 178, 222], [104, 180, 128, 234], [76, 184, 80, 230]
  ];
  veins.forEach(([cx, cy, tx, ty]) => {
    ctx.beginPath();
    ctx.moveTo(46, 78);
    ctx.quadraticCurveTo(cx, cy, tx, ty);
    ctx.stroke();
  });

  ctx.fillStyle = "#15100b";
  ctx.beginPath();
  ctx.ellipse(118, 152, 8, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();

  traceOutline();
  ctx.strokeStyle = "#15100b";
  ctx.lineWidth = 24;
  ctx.stroke();

  const baseShadow = ctx.createRadialGradient(24, 64, 6, 24, 64, 70);
  baseShadow.addColorStop(0, "rgba(18,10,5,0.95)");
  baseShadow.addColorStop(1, "rgba(18,10,5,0)");
  ctx.fillStyle = baseShadow;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = "#fbf4e4";
  const outerDots: Array<[number, number]> = [
    [232, 110], [233, 138], [226, 166], [212, 192], [190, 212],
    [162, 226], [130, 232], [98, 231], [68, 222], [46, 206]
  ];
  outerDots.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.fill(); });
  const innerDots: Array<[number, number]> = [
    [223, 124], [222, 152], [210, 179], [192, 200], [167, 216], [137, 223], [105, 222], [76, 213]
  ];
  innerDots.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill(); });

  ctx.restore();
  return new THREE.CanvasTexture(canvas);
}

export function Hero3DLayer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // WebGL disponible: si no, la capa simplemente no se monta (el video queda)
    try {
      const testCanvas = document.createElement("canvas");
      if (!testCanvas.getContext("webgl") && !testCanvas.getContext("experimental-webgl")) return;
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.026); // profundidad atmosférica

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 1.5, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.75));
    renderer.setClearColor(0x000000, 0); // transparente: el video respira debajo
    mount.appendChild(renderer.domElement);

    const glowTex = createGlowTexture();

    // --- LUCES (solo para las mariposas, los Points son aditivos) ---
    scene.add(new THREE.AmbientLight(0xffe4f0, 0.55));
    const keyLight = new THREE.DirectionalLight(0xffd9b0, 1.4);
    keyLight.position.set(6, 8, 10);
    scene.add(keyLight);

    // --- CAMPO DE ESPORAS EN PROFUNDIDAD (3 sistemas, paleta de marca) ---
    // Cada sistema guarda su drift y reacciona a la repulsión del cursor
    type SporeSystem = {
      points: THREE.Points;
      mat: THREE.PointsMaterial;
      base: Float32Array;       // posiciones de reposo
      offset: Float32Array;     // desplazamiento acumulado por repulsión
      count: number;
      twinkleSpeed: number;
      baseSize: number;
    };

    const VOLUME = { x: 30, yMin: -7, yMax: 11, zMin: -34, zMax: 5 };

    const mkSporeSystem = (
      count: number,
      color: string,
      baseSize: number,
      twinkleSpeed: number
    ): SporeSystem => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const base = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        base[i * 3] = (Math.random() - 0.5) * VOLUME.x * 2;
        base[i * 3 + 1] = VOLUME.yMin + Math.random() * (VOLUME.yMax - VOLUME.yMin);
        base[i * 3 + 2] = VOLUME.zMin + Math.random() * (VOLUME.zMax - VOLUME.zMin);
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
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, mat, base, offset: new Float32Array(count * 3), count, twinkleSpeed, baseSize };
    };

    const sporeScale = isMobile ? 0.5 : 1;
    const sporeSystems: SporeSystem[] = [
      mkSporeSystem(Math.round(180 * sporeScale), "#eca8d6", 0.44, 2.6), // rosa de marca
      mkSporeSystem(Math.round(110 * sporeScale), "#9d6bff", 0.38, 3.4), // violeta
      mkSporeSystem(Math.round(70 * sporeScale), "#67e8f9", 0.32, 4.1),  // cian
    ];

    // --- RÍO DE POLEN DORADO (corriente de cosecha cruzando el hero) ---
    // Curva diagonal desde abajo-izquierda-cerca hacia arriba-derecha-lejos
    const riverCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-24, -5.5, 2),
      new THREE.Vector3(-7, -2.5, -8),
      new THREE.Vector3(8, 1.5, -14),
      new THREE.Vector3(26, 7.5, -26)
    );
    const riverCount = isMobile ? 60 : 120;
    const riverGeo = new THREE.BufferGeometry();
    const riverPositions = new Float32Array(riverCount * 3);
    const riverT = new Float32Array(riverCount);      // progreso sobre la curva
    const riverRad = new Float32Array(riverCount * 2); // offset radial (ángulo, radio)
    for (let i = 0; i < riverCount; i++) {
      riverT[i] = Math.random();
      riverRad[i * 2] = Math.random() * Math.PI * 2;
      riverRad[i * 2 + 1] = Math.pow(Math.random(), 1.6) * 1.7;
    }
    riverGeo.setAttribute("position", new THREE.BufferAttribute(riverPositions, 3));
    const riverMat = new THREE.PointsMaterial({
      size: 0.32,
      color: "#ffd27a",
      map: glowTex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const riverPoints = new THREE.Points(riverGeo, riverMat);
    scene.add(riverPoints);

    // --- MARIPOSAS MONARCA (anatomía real de 4 alas, las mismas del sitio) ---
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
      opacity: 0.22,
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
      dir: number;          // 1: izquierda→derecha, -1: derecha→izquierda
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
    const numButterflies = isMobile ? 2 : 3;
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
      const scale = 1.5 + Math.random() * 1.1;
      group.scale.setScalar(scale);
      const baseY = -1.5 + Math.random() * 5;
      const z = -3 - Math.random() * 9;
      group.position.set(dir * -(20 + Math.random() * 8), baseY, z);

      butterflies.push({
        group, rootL, rootR, halo,
        dir,
        speed: 1.3 + Math.random() * 0.9,
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

    // --- INTERACCIÓN: parallax de cámara + repulsión de esporas ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const raycaster = new THREE.Raycaster();
    const interactPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 4); // plano z = -4
    const mouseNDC = new THREE.Vector2();
    const mouseWorld = new THREE.Vector3(9999, 9999, 9999);

    // --- PAUSA FUERA DE VIEWPORT (no quemar GPU al scrollear la landing) ---
    let isInView = true;
    const observer = new IntersectionObserver(
      (entries) => { isInView = entries[0]?.isIntersecting ?? true; },
      { threshold: 0.02 }
    );
    observer.observe(mount);

    // --- BUCLE ---
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let lastTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isInView) return; // hero fuera de pantalla: frame gratis

      const time = clock.getElapsedTime();
      const dt = Math.min(time - lastTime, 0.05);
      lastTime = time;

      // Cursor proyectado al plano de interacción
      mouseNDC.set(mouseX, -mouseY);
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(interactPlane, mouseWorld);

      // Esporas: drift orgánico + twinkle + repulsión suave del cursor
      sporeSystems.forEach((sys, sIdx) => {
        const positions = sys.points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sys.count; i++) {
          const idx = i * 3;
          const fs = 0.3 + ((i + sIdx * 7) % 6) * 0.1;

          // Deriva de reposo (flotación en corrientes lentas)
          sys.base[idx] += Math.sin(time * fs + sys.base[idx + 1] * 0.09) * 0.012;
          sys.base[idx + 1] += Math.cos(time * fs * 0.8 + sys.base[idx] * 0.07) * 0.009 + 0.004;
          sys.base[idx + 2] += Math.sin(time * fs * 0.6 + i) * 0.006;

          // Wrap del volumen
          if (sys.base[idx + 1] > VOLUME.yMax) sys.base[idx + 1] = VOLUME.yMin;
          if (sys.base[idx] > VOLUME.x) sys.base[idx] = -VOLUME.x;
          if (sys.base[idx] < -VOLUME.x) sys.base[idx] = VOLUME.x;

          // Repulsión radial alrededor del cursor (solo cerca del plano interactivo)
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
          // Las esporas regresan elásticamente a su deriva
          sys.offset[idx] *= 0.94;
          sys.offset[idx + 1] *= 0.94;

          positions[idx] = sys.base[idx] + sys.offset[idx];
          positions[idx + 1] = sys.base[idx + 1] + sys.offset[idx + 1];
          positions[idx + 2] = sys.base[idx + 2];
        }
        sys.points.geometry.attributes.position.needsUpdate = true;
        sys.mat.size = sys.baseSize * (0.82 + 0.28 * Math.sin(time * sys.twinkleSpeed + sIdx * 2.1));
      });

      // Río de polen: cada partícula avanza por la curva y reaparece al final
      const rPos = riverPoints.geometry.attributes.position.array as Float32Array;
      const tangent = new THREE.Vector3();
      const normal = new THREE.Vector3();
      const binormal = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < riverCount; i++) {
        riverT[i] += dt * 0.045 * (0.7 + (i % 5) * 0.12);
        if (riverT[i] > 1) riverT[i] -= 1;
        const p = riverCurve.getPoint(riverT[i]);
        riverCurve.getTangent(riverT[i], tangent);
        normal.crossVectors(tangent, up).normalize();
        binormal.crossVectors(normal, tangent).normalize();
        const ang = riverRad[i * 2] + time * 0.5;
        const rad = riverRad[i * 2 + 1] * (1 + Math.sin(time * 1.2 + i) * 0.18);
        rPos[i * 3] = p.x + normal.x * Math.cos(ang) * rad + binormal.x * Math.sin(ang) * rad;
        rPos[i * 3 + 1] = p.y + normal.y * Math.cos(ang) * rad + binormal.y * Math.sin(ang) * rad;
        rPos[i * 3 + 2] = p.z + normal.z * Math.cos(ang) * rad + binormal.z * Math.sin(ang) * rad;
      }
      riverPoints.geometry.attributes.position.needsUpdate = true;
      riverMat.size = 0.28 + Math.sin(time * 2.4) * 0.05;

      // Mariposas: cruce lateral + vuelo real (ráfagas de aleteo / planeos)
      butterflies.forEach((b) => {
        if (time > b.modeUntil) {
          b.gliding = !b.gliding;
          b.modeUntil = time + (b.gliding ? 0.5 + Math.random() * 1.0 : 0.55 + Math.random() * 0.85);
        }
        const targetEnergy = b.gliding ? 0 : 1;
        b.energy += (targetEnergy - b.energy) * (targetEnergy > b.energy ? 0.16 : 0.06);
        b.phase += dt * (Math.PI * 2) * (1.2 + 7.5 * b.energy);

        // Avance lateral con vaivén vertical ligado al aleteo
        b.group.position.x += b.dir * b.speed * dt;
        const hoverY = Math.sin(time * 0.7 + b.offset) * 0.7
          + Math.sin(b.phase - Math.PI / 2) * 0.1 * b.energy
          - (1 - b.energy) * 0.5;
        b.group.position.y = b.baseY + hoverY;
        b.group.position.z = b.z + Math.sin(time * 0.5 + b.offset) * 1.6;

        // Respawn al cruzar el hero completo
        if (b.dir > 0 && b.group.position.x > 24) {
          b.group.position.x = -24;
          b.baseY = -1.5 + Math.random() * 5;
        } else if (b.dir < 0 && b.group.position.x < -24) {
          b.group.position.x = 24;
          b.baseY = -1.5 + Math.random() * 5;
        }

        // Orientación: cabeza (-Z local) hacia el rumbo, con banking suave
        b.group.rotation.y = b.dir > 0 ? -Math.PI / 2 + Math.PI : Math.PI / 2 + Math.PI;
        b.group.rotation.z = Math.sin(time * 1.8 + b.offset) * 0.18 * (0.4 + 0.6 * b.energy);
        b.group.rotation.x = -0.2 * b.energy + Math.sin(time * 4.2 + b.offset) * 0.05 * b.energy;

        // Batida asimétrica de las 4 alas; planeo en V dihedral
        const sRaw = Math.sin(b.phase);
        const stroke = sRaw >= 0 ? Math.pow(sRaw, 0.78) : -Math.pow(-sRaw, 1.35);
        const flap = stroke * b.energy + (1 - b.energy) * (0.5 + Math.sin(time * 5.0 + b.offset) * 0.04);
        b.rootL.rotation.z = flap;
        b.rootR.rotation.z = -flap;

        b.halo.lookAt(camera.position);
      });

      // Parallax de cámara siguiendo al cursor (respiración + profundidad)
      const targetCamX = mouseX * 1.6 + Math.sin(time * 0.32) * 0.3;
      const targetCamY = 1.5 - mouseY * 1.0 + Math.cos(time * 0.27) * 0.2;
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(mouseX * 0.8, 0.6 - mouseY * 0.5, -8);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      aria-hidden
    />
  );
}
