"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// ============================================================================
// ROBOT COSECHA — asistente 3D procedural, propio (reemplaza al embed de
// Sketchfab: sin iframe, sin marca de agua y sin el cartel "click & hold").
// Cabeza tipo CRT con pantalla viva (ojos que siguen al cursor y parpadean),
// carcasa metálica oscura con acentos de marca, antena que late y un pozo de
// luz con anillos en vez del montículo de pasto. Paleta de la web:
// rosa #eca8d6, violeta #a100f2, cian #67e8f9.
// Respeta prefers-reduced-motion (queda un frame fijo), baja calidad en mobile,
// y sólo anima cuando está en pantalla y la pestaña visible.
// ============================================================================

const ROSA = 0xeca8d6;
const CIAN = 0x67e8f9;
const VIOLETA = 0xa100f2;

/** Caja con cantos redondeados: el bisel es lo que le da el look premium. */
function roundedBoxGeometry(w: number, h: number, d: number, r: number) {
  const rr = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + rr, -h / 2);
  shape.lineTo(w / 2 - rr, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + rr);
  shape.lineTo(w / 2, h / 2 - rr);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - rr, h / 2);
  shape.lineTo(-w / 2 + rr, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - rr);
  shape.lineTo(-w / 2, -h / 2 + rr);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + rr, -h / 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d - 2 * rr,
    bevelEnabled: true,
    bevelThickness: rr,
    bevelSize: rr,
    bevelSegments: 3,
    curveSegments: 8,
  });
  geo.translate(0, 0, -(d - 2 * rr) / 2);
  geo.computeVertexNormals();
  return geo;
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) return new THREE.Texture();
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, "rgba(255,255,255,0.6)");
  g.addColorStop(0.55, "rgba(255,255,255,0.16)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

type FaceState = { lookX: number; lookY: number; blink: number; smile: number; time: number };

/** Cara dibujada en canvas: es lo que hace que el robot parezca vivo. */
function makeFace() {
  const W = 320;
  const H = 208;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  const draw = ({ lookX, lookY, blink, smile, time }: FaceState) => {
    ctx.clearRect(0, 0, W, H);

    // Fondo de pantalla: negro violáceo con brillo interno
    ctx.fillStyle = "#07030f";
    ctx.fillRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W / 2, H / 2, 8, W / 2, H / 2, W * 0.62);
    bg.addColorStop(0, "rgba(103,232,249,0.20)");
    bg.addColorStop(0.55, "rgba(161,0,242,0.13)");
    bg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const ox = lookX * 24;
    const oy = lookY * 14;
    const open = Math.max(0.06, 1 - blink);

    // Ojos: cápsulas cian con halo (se achinan al sonreír)
    ctx.save();
    ctx.shadowColor = "rgba(103,232,249,0.9)";
    ctx.shadowBlur = 26;
    ctx.fillStyle = "#b8f4ff";
    const eyeW = 34;
    const eyeH = 56 * open * (1 - smile * 0.45);
    for (const sx of [-1, 1]) {
      const cx = W / 2 + sx * 66 + ox;
      const cy = H / 2 - 10 + oy;
      const rad = Math.min(eyeW, Math.max(3, eyeH)) / 2;
      ctx.beginPath();
      ctx.roundRect(cx - eyeW / 2, cy - eyeH / 2, eyeW, Math.max(3, eyeH), rad);
      ctx.fill();
    }
    ctx.restore();

    // Boca: arco rosa que se ensancha con la sonrisa
    ctx.save();
    ctx.strokeStyle = "rgba(236,168,214,0.95)";
    ctx.shadowColor = "rgba(236,168,214,0.8)";
    ctx.shadowBlur = 18;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    const my = H / 2 + 52 + oy * 0.5;
    const mw = 32 + smile * 26;
    ctx.moveTo(W / 2 - mw + ox * 0.6, my);
    ctx.quadraticCurveTo(W / 2 + ox * 0.6, my + 8 + smile * 18, W / 2 + mw + ox * 0.6, my);
    ctx.stroke();
    ctx.restore();

    // Scanlines + barrido CRT
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
    const sweep = ((time * 42) % (H + 90)) - 45;
    const sg = ctx.createLinearGradient(0, sweep - 36, 0, sweep + 36);
    sg.addColorStop(0, "rgba(255,255,255,0)");
    sg.addColorStop(0.5, "rgba(180,240,255,0.09)");
    sg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, sweep - 36, W, 72);

    texture.needsUpdate = true;
  };

  return { texture, draw };
}

export function CosechaRobot({
  className = "h-[min(56vw,300px)]",
  title = "Asistente IA de Cosecha Creativa",
}: {
  className?: string;
  title?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl") && !probe.getContext("experimental-webgl")) return;
    } catch {
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let w = mount.clientWidth || 320;
    let h = mount.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 60);
    camera.position.set(0, 0.4, 6.9);
    camera.lookAt(0, 0.12, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 1.85));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    mount.appendChild(renderer.domElement);

    // Reflejos reales en el metal, sin cargar ningún HDR externo
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    let composer: EffectComposer | null = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.32, 0.55, 0.58));
      composer.addPass(new OutputPass());
    }

    // ---------------------------------------------------------------- materiales
    const shell = new THREE.MeshStandardMaterial({
      color: 0x221a30,
      metalness: 0.88,
      roughness: 0.3,
      envMapIntensity: 0.72,
    });
    const shellLight = new THREE.MeshStandardMaterial({
      color: 0x2b2338,
      metalness: 0.7,
      roughness: 0.42,
      envMapIntensity: 0.66,
    });
    const accentRosa = new THREE.MeshStandardMaterial({
      color: ROSA,
      metalness: 0.5,
      roughness: 0.3,
      emissive: ROSA,
      emissiveIntensity: 0.22,
    });
    const accentCian = new THREE.MeshStandardMaterial({
      color: CIAN,
      metalness: 0.4,
      roughness: 0.25,
      emissive: CIAN,
      emissiveIntensity: 1.0,
    });
    const bezel = new THREE.MeshStandardMaterial({
      color: 0x0d0a16,
      metalness: 0.6,
      roughness: 0.55,
    });
    // Manos mate: en cian emisivo el bloom las volvía dos manchas que le
    // ganaban a la cara. El brillo queda reservado a antena, núcleo y pantalla.
    const accentHand = new THREE.MeshStandardMaterial({
      color: 0x8fa2b8,
      metalness: 0.35,
      roughness: 0.62,
      envMapIntensity: 0.5,
    });
    const materials = [shell, shellLight, accentRosa, accentCian, accentHand, bezel];
    const geometries: THREE.BufferGeometry[] = [];
    const track = <T extends THREE.BufferGeometry>(g: T) => {
      geometries.push(g);
      return g;
    };

    // ------------------------------------------------------------------- robot
    const robot = new THREE.Group();
    robot.position.y = -0.15;
    scene.add(robot);

    const torso = new THREE.Mesh(track(roundedBoxGeometry(1.14, 1.06, 0.74, 0.2)), shell);
    torso.position.y = 0.08;
    robot.add(torso);

    // Placa frontal + núcleo cian que late
    const chestPlate = new THREE.Mesh(track(roundedBoxGeometry(0.72, 0.62, 0.06, 0.14)), shellLight);
    chestPlate.position.set(0, 0.1, 0.37);
    robot.add(chestPlate);

    const core = new THREE.Mesh(track(new THREE.TorusGeometry(0.16, 0.035, 12, 28)), accentCian);
    core.position.set(0, 0.12, 0.42);
    robot.add(core);
    const coreDot = new THREE.Mesh(track(new THREE.SphereGeometry(0.07, 16, 16)), accentRosa);
    coreDot.position.set(0, 0.12, 0.42);
    robot.add(coreDot);

    // Cadera + patitas colgando (flota, no se apoya en el pasto)
    const hip = new THREE.Mesh(track(roundedBoxGeometry(0.78, 0.22, 0.56, 0.1)), shellLight);
    hip.position.y = -0.5;
    robot.add(hip);

    const legGeo = track(new THREE.CapsuleGeometry(0.11, 0.34, 6, 14));
    const footGeo = track(roundedBoxGeometry(0.3, 0.14, 0.42, 0.06));
    const legs: THREE.Group[] = [];
    for (const sx of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(sx * 0.26, -0.6, 0);
      const shin = new THREE.Mesh(legGeo, shell);
      shin.position.y = -0.24;
      leg.add(shin);
      const foot = new THREE.Mesh(footGeo, shellLight);
      foot.position.set(0, -0.5, 0.06);
      leg.add(foot);
      robot.add(leg);
      legs.push(leg);
    }

    // Brazos
    const shoulderGeo = track(new THREE.SphereGeometry(0.15, 18, 18));
    const armGeo = track(new THREE.CapsuleGeometry(0.095, 0.42, 6, 14));
    const handGeo = track(new THREE.SphereGeometry(0.13, 18, 18));
    const arms: THREE.Group[] = [];
    for (const sx of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(sx * 0.74, 0.3, 0);
      arm.add(new THREE.Mesh(shoulderGeo, shellLight));
      const limb = new THREE.Mesh(armGeo, shell);
      limb.position.y = -0.34;
      arm.add(limb);
      const hand = new THREE.Mesh(handGeo, accentHand);
      hand.position.y = -0.63;
      arm.add(hand);
      robot.add(arm);
      arms.push(arm);
    }

    // Cabeza CRT
    const head = new THREE.Group();
    head.position.y = 1.06;
    robot.add(head);

    const neck = new THREE.Mesh(track(new THREE.CylinderGeometry(0.13, 0.16, 0.24, 16)), shellLight);
    neck.position.y = -0.56;
    head.add(neck);

    const skull = new THREE.Mesh(track(roundedBoxGeometry(1.36, 1.06, 0.9, 0.2)), shell);
    head.add(skull);

    const screenFrame = new THREE.Mesh(track(roundedBoxGeometry(1.16, 0.86, 0.06, 0.15)), bezel);
    screenFrame.position.z = 0.48;
    head.add(screenFrame);

    const face = makeFace();
    const screenMat = new THREE.MeshBasicMaterial({
      map: face.texture,
      transparent: true,
      toneMapped: false,
    });
    const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(1.04, 0.74)), screenMat);
    screen.position.z = 0.53;
    head.add(screen);

    // Perillas laterales
    const knobGeo = track(new THREE.CylinderGeometry(0.1, 0.12, 0.12, 18));
    for (const sx of [-1, 1]) {
      const knob = new THREE.Mesh(knobGeo, accentRosa);
      knob.rotation.z = Math.PI / 2;
      knob.position.set(sx * 0.7, -0.09, 0.05);
      head.add(knob);
    }

    // Antena
    const antenna = new THREE.Group();
    antenna.position.set(-0.38, 0.52, 0);
    head.add(antenna);
    const rod = new THREE.Mesh(track(new THREE.CylinderGeometry(0.028, 0.034, 0.44, 10)), shellLight);
    rod.position.y = 0.22;
    antenna.add(rod);
    const bulb = new THREE.Mesh(track(new THREE.SphereGeometry(0.085, 16, 16)), accentCian);
    bulb.position.y = 0.47;
    antenna.add(bulb);

    const glowTex = makeGlowTexture();
    const bulbHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: CIAN,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    bulbHalo.scale.setScalar(0.85);
    bulbHalo.position.y = 0.47;
    antenna.add(bulbHalo);

    // -------------------------------------------------------- pozo de luz + anillos
    const wellMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      color: ROSA,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const well = new THREE.Mesh(track(new THREE.PlaneGeometry(3.2, 3.2)), wellMat);
    well.rotation.x = -Math.PI / 2;
    well.position.y = -1.72;
    scene.add(well);

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? CIAN : ROSA,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.62, 0.68, 64)), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.7 + i * 0.002;
      ring.userData.phase = i / 3;
      scene.add(ring);
      rings.push(ring);
    }

    // Polvo de datos que sube
    const dustCount = isMobile ? 40 : 80;
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 4.2;
      dustPos[i * 3 + 1] = -1.7 + Math.random() * 3.7;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
      dustSpeed[i] = 0.14 + Math.random() * 0.28;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        map: glowTex,
        color: 0xf3d7ea,
        size: 0.09,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(dust);

    // ------------------------------------------------------------------- luces
    scene.add(new THREE.HemisphereLight(0xb9a7ff, 0x140a1c, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(2.4, 3.2, 3.4);
    scene.add(key);
    const rimRosa = new THREE.PointLight(ROSA, 7, 12, 2);
    rimRosa.position.set(-2.6, 1.4, 1.6);
    scene.add(rimRosa);
    const rimCian = new THREE.PointLight(CIAN, 6, 12, 2);
    rimCian.position.set(2.7, 0.2, -1.4);
    scene.add(rimCian);
    const bounce = new THREE.PointLight(VIOLETA, 3.5, 8, 2);
    bounce.position.set(0, -1.5, 1.2);
    scene.add(bounce);

    // -------------------------------------------------------------- interacción
    let pointerX = 0;
    let pointerY = 0;
    let hover = 0;
    let hoverTarget = 0;
    const onPointerMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      pointerX = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      pointerY = THREE.MathUtils.clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    };
    const onEnter = () => {
      hoverTarget = 1;
    };
    const onLeave = () => {
      hoverTarget = 0;
      pointerX = 0;
      pointerY = 0;
    };
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerenter", onEnter);
    mount.addEventListener("pointerleave", onLeave);

    // --------------------------------------------------------------------- loop
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    let lookX = 0;
    let lookY = 0;
    let blink = 0;
    let nextBlink = 2 + Math.random() * 3;
    let elapsed = 0;

    const render = () => {
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      const t = elapsed;

      hover += (hoverTarget - hover) * 0.08;
      lookX += (pointerX - lookX) * 0.09;
      lookY += (pointerY - lookY) * 0.09;

      // Parpadeo esporádico
      nextBlink -= dt;
      if (nextBlink <= 0) {
        blink = 1;
        nextBlink = 2.4 + Math.random() * 3.6;
      }
      blink = Math.max(0, blink - dt * 7);

      face.draw({ lookX, lookY: lookY * 0.8, blink, smile: hover, time: t });

      // Flota e inclina la cabeza hacia el cursor
      robot.position.y = -0.15 + Math.sin(t * 1.25) * 0.075;
      robot.rotation.y = lookX * 0.34 + Math.sin(t * 0.4) * 0.05;
      robot.rotation.z = -lookX * 0.05;
      head.rotation.y = lookX * 0.3;
      head.rotation.x = lookY * 0.2 + Math.sin(t * 0.9) * 0.015;

      // Brazos: colgando y, con el cursor encima, saluda con el derecho
      // OJO con los signos: z negativo ABRE el brazo izquierdo y positivo el
      // derecho. Invertidos, los brazos se meten detrás del torso y no se ven.
      const swing = Math.sin(t * 1.15) * 0.09;
      arms[0].rotation.z = -(0.24 + swing);
      arms[0].rotation.x = -swing * 0.5;
      const wave = hover * (2.5 + Math.sin(t * 7.5) * 0.38);
      arms[1].rotation.z = 0.24 + swing + wave;
      arms[1].rotation.x = -swing * 0.5;

      // Patitas colgando con inercia
      legs[0].rotation.x = Math.sin(t * 1.05) * 0.1;
      legs[1].rotation.x = Math.sin(t * 1.05 + 0.7) * 0.1;

      // Antena y núcleo latiendo
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.1);
      accentCian.emissiveIntensity = 0.85 + pulse * 0.85 + hover * 0.5;
      bulbHalo.scale.setScalar(0.72 + pulse * 0.24 + hover * 0.12);
      antenna.rotation.z = Math.sin(t * 1.6) * 0.09;
      core.rotation.z += dt * 1.1;
      coreDot.scale.setScalar(0.9 + pulse * 0.18);
      rimRosa.intensity = 6.4 + pulse * 2.2;

      // Pozo de luz + ondas
      wellMat.opacity = 0.26 + pulse * 0.07 + hover * 0.06;
      rings.forEach((ring) => {
        const p = (t * 0.3 + (ring.userData.phase as number)) % 1;
        ring.scale.setScalar(0.5 + p * 3.1);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.2;
      });

      // Polvo ascendente
      const dp = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dp[i * 3 + 1] += dt * dustSpeed[i];
        if (dp[i * 3 + 1] > 2.1) {
          dp[i * 3 + 1] = -1.7;
          dp[i * 3] = (Math.random() - 0.5) * 4.2;
          dp[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
        }
        dp[i * 3] += Math.sin(t * 0.6 + i) * dt * 0.05;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Cámara con parallax muy suave
      camera.position.x += (lookX * 0.4 - camera.position.x) * 0.045;
      camera.position.y += (0.4 - lookY * 0.28 - camera.position.y) * 0.045;
      camera.lookAt(0, 0.12, 0);

      render();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reduced) return;
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reduced) {
      // Sin movimiento: un solo frame, cara serena
      face.draw({ lookX: 0, lookY: 0, blink: 0, smile: 0.35, time: 0 });
      render();
    } else {
      start();
    }

    // Sólo gasta GPU cuando se ve
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      w = mount.clientWidth || w;
      h = mount.clientHeight || h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer?.setSize(w, h);
      if (reduced) render();
    });
    ro.observe(mount);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerenter", onEnter);
      mount.removeEventListener("pointerleave", onLeave);
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      screenMat.dispose();
      wellMat.dispose();
      rings.forEach((r) => (r.material as THREE.Material).dispose());
      (dust.material as THREE.Material).dispose();
      bulbHalo.material.dispose();
      face.texture.dispose();
      glowTex.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      composer?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(120%_100%_at_50%_0%,rgba(161,0,242,0.16),rgba(0,0,0,0.55)_58%,rgba(0,0,0,0.75))] ${className}`}
      role="img"
      aria-label={title}
    >
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
