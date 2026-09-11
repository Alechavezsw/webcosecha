"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Layers, 
  CheckCircle,
  Mail,
  ChevronDown,
  Crosshair,
  Zap,
  BarChart3
} from 'lucide-react';
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";

const PLATFORMS = [
  { name: "Meta Ads", dot: "#0866FF" },
  { name: "Google Ads", dot: "#FBBC05" },
  { name: "TikTok", dot: "#25F4EE" },
  { name: "YouTube", dot: "#FF0033" },
  { name: "LinkedIn", dot: "#0A66C2" },
] as const;

const HERO_STATS = [
  { value: "ROAS 3x+", label: "objetivo" },
  { value: "5 canales", label: "un solo ecosistema" },
  { value: "Semanal", label: "test de creativos" },
] as const;

const STEP_PANELS = [
  {
    id: 1,
    side: "left" as const,
    icon: Crosshair,
    accent: "#67e8f9",
    kicker: "01 · Segmentación",
    title: "Audiencias con intención real",
    body: (
      <>
        Instalamos <strong className="font-semibold text-white">Píxel de Meta, CAPI y Google Tag Manager</strong> para no perder atribución. Remarketing, lookalikes y listas de compradores: tu presupuesto va a quien sí puede comprar.
      </>
    ),
    stats: [
      { k: "Tracking", v: "Píxel · CAPI · GTM" },
      { k: "Audiencias", v: "Remarketing + Lookalikes" },
    ],
  },
  {
    id: 2,
    side: "right" as const,
    icon: Layers,
    accent: "#a78bfa",
    kicker: "02 · Canales",
    title: "Un ecosistema, no avisos sueltos",
    body: (
      <>
        Coordinamos <strong className="font-semibold text-white">Search, Shopping, Performance Max, catálogo de Meta y mensajes a WhatsApp</strong>. El usuario te ve en el momento justo del recorrido de compra.
      </>
    ),
    stats: [
      { k: "Plataformas", v: "Meta · Google · TikTok" },
      { k: "Formatos", v: "Search, Shopping, PMax" },
    ],
  },
  {
    id: 3,
    side: "left" as const,
    icon: Zap,
    accent: "#c084fc",
    kicker: "03 · Creativos",
    title: "Piezas que frenan el scroll",
    body: (
      <>
        Estructura <strong className="font-semibold text-white">AIDA</strong> y formatos <strong className="font-semibold text-white">UGC</strong>: ganchos en 3 segundos, tests semanales de video, imagen y copy para que los anuncios no se quemen.
      </>
    ),
    stats: [
      { k: "Gancho", v: "3 segundos" },
      { k: "Testeo", v: "Semanal · A/B" },
    ],
  },
  {
    id: 4,
    side: "right" as const,
    icon: BarChart3,
    accent: "#eca8d6",
    kicker: "04 · Optimización",
    title: "ROAS que se puede defender",
    body: (
      <>
        Redistribuimos presupuesto, controlamos frecuencia y leemos atribución con rigor. Objetivo: sostener un <strong className="font-semibold text-white">ROAS 3x+</strong> y bajar el costo de adquisición mes a mes.
      </>
    ),
    stats: [
      { k: "Objetivo", v: "ROAS 3x+" },
      { k: "Control", v: "Frecuencia y CPA" },
    ],
  },
];

function StepPanel({
  step,
  reduce,
  active,
}: {
  step: (typeof STEP_PANELS)[number]
  reduce: boolean | null
  active: boolean
}) {
  const Icon = step.icon
  const isLeft = step.side === "left"
  const accent = step.accent

  return (
    <div
      className="pointer-events-none absolute inset-x-0 flex h-screen w-full items-center px-5 sm:px-10 md:px-16 lg:px-24"
      style={{ top: `${step.id * 100}vh` }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 44, x: isLeft ? -28 : 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-auto group relative z-20 w-full max-w-[28rem] md:max-w-[31rem] ${
          isLeft ? "mr-auto md:mr-0" : "ml-auto"
        }`}
      >
        {/* Scrim para no mezclar texto con el 3D */}
        <div
          className="pointer-events-none absolute -inset-8 -z-20 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(1,6,14,0.94)_0%,rgba(1,6,14,0.6)_55%,transparent_80%)] blur-sm"
          aria-hidden
        />
        {/* Halo del paso activo */}
        <div
          className="pointer-events-none absolute -inset-4 -z-10 blur-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(58% 58% at 50% 50%, ${accent}33 0%, transparent 72%)`,
            opacity: active ? 1 : 0,
          }}
          aria-hidden
        />
        {/* Halo de hover */}
        <div
          className="pointer-events-none absolute -inset-4 -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: `radial-gradient(58% 58% at 50% 50%, ${accent}33 0%, transparent 72%)` }}
          aria-hidden
        />

        {/* Borde en degradé */}
        <div
          className="relative p-px shadow-[0_28px_90px_-30px_rgba(0,0,0,0.92)] transition-transform duration-500 group-hover:-translate-y-1"
          style={{
            background: `linear-gradient(${isLeft ? "135deg" : "225deg"}, ${accent}99 0%, rgba(255,255,255,0.10) 38%, rgba(255,255,255,0.03) 100%)`,
          }}
        >
          <div className="relative overflow-hidden bg-[#04070d]/95 p-6 backdrop-blur-xl sm:p-8">
            {/* Trama de datos */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:26px_26px]"
              aria-hidden
            />
            {/* Número fantasma */}
            <span
              className="pointer-events-none absolute -right-1 -top-7 select-none font-display text-[7rem] font-semibold leading-none tracking-tighter opacity-[0.08] sm:text-[8.5rem]"
              style={{ color: accent }}
              aria-hidden
            >
              {String(step.id).padStart(2, "0")}
            </span>

            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex size-11 items-center justify-center border"
                  style={{
                    borderColor: `${accent}59`,
                    background: `${accent}1a`,
                    boxShadow: `0 0 26px -6px ${accent}80`,
                  }}
                >
                  <Icon className="size-[18px]" style={{ color: accent }} aria-hidden />
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.26em]"
                  style={{ color: `${accent}e6` }}
                >
                  {step.kicker}
                </span>
              </div>

              <h2 className="font-display text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2.15rem]">
                {step.title}
              </h2>

              <motion.div
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 h-px w-32 origin-left"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                aria-hidden
              />

              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/70 sm:text-base">
                {step.body}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
                {step.stats.map((s) => (
                  <div key={s.k} className="bg-[#04070d] px-4 py-3">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-[13px] font-medium leading-snug text-white/85">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Esquinas tipo HUD */}
            <span
              className="pointer-events-none absolute left-0 top-0 size-3 border-l border-t"
              style={{ borderColor: accent }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-0 right-0 size-3 border-b border-r"
              style={{ borderColor: accent }}
              aria-hidden
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function PublicidadPagaClient() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    // --- 1. CONFIGURACIÓN BÁSICA DE THREE.JS ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#010204');
    scene.fog = new THREE.FogExp2('#010204', 0.04);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 150);
    
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Post-procesado: Bloom cinematográfico — hace ESTALLAR de luz los datos, las
    // partículas aditivas y los nodos emisivos del árbol. Solo desktop (GPU).
    let composer: EffectComposer | null = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.85, // strength
          0.72, // radius
          0.1   // threshold: deja brillar lo emisivo, mantiene el metal oscuro
        )
      );
      composer.addPass(new OutputPass());
    }

    // --- 2. GENERADOR DE TEXTURAS PROCEDURALES (Resplandor Cuadrado/Digital) ---
    const createDigitalParticleTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      
      // Resplandor radial con un toque cuadrado de datos
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 243, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(217, 0, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };
    const particleTexture = createDigitalParticleTexture();

    // --- 3. MATERIALES Y LUCES ---
    const hojasColor = new THREE.Color("#00f3ff"); // Cian eléctrico
    const hojasSecundariasColor = new THREE.Color("#d000ff"); // Violeta/Magenta de datos
    
    // Tronco de cromo oscuro/metalizado
    const troncoMaterial = new THREE.MeshStandardMaterial({ 
      color: '#080c10', 
      roughness: 0.25, 
      metalness: 0.9,
      emissive: '#002530',
      emissiveIntensity: 0.15
    });

    scene.add(new THREE.AmbientLight('#00a2ff', 0.06));
    
    const dirLight = new THREE.DirectionalLight('#ffffff', 0.4);
    dirLight.position.set(-8, 15, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    
    const ptLight = new THREE.PointLight(hojasColor, 28, 15);
    ptLight.position.set(0, 6, 0);
    scene.add(ptLight);

    // --- 4. TERRENO HOLOGRÁFICO CON REJILLA ---
    const groundGeo = new THREE.PlaneGeometry(50, 50, 128, 128);
    const pos = groundGeo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 1.2;
      z += Math.sin(x * 0.7) * Math.cos(y * 0.4) * 0.3;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: '#04121f',
      roughness: 0.42,
      metalness: 0.62,
      emissive: new THREE.Color('#001722'),
      emissiveIntensity: 0.3,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Mismo relieve que el suelo, para que las grillas lo abracen (topográfico)
    const terrainZ = (x: number, y: number) =>
      Math.sin(x * 0.15) * Math.cos(y * 0.15) * 1.2 + Math.sin(x * 0.7) * Math.cos(y * 0.4) * 0.3;
    const displaceToTerrain = (geo: THREE.PlaneGeometry, lift: number) => {
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setZ(i, terrainZ(p.getX(i), p.getY(i)) + lift);
      }
      p.needsUpdate = true;
    };

    // Rejilla de datos que SIGUE el relieve del terreno (topográfica) — aditiva, brilla con el bloom
    const gridGeo = new THREE.PlaneGeometry(50, 50, 64, 64);
    displaceToTerrain(gridGeo, 0.05);
    const gridMat = new THREE.MeshBasicMaterial({
      color: '#22e0ff',
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    scene.add(grid);

    // Rejilla fina de detalle (también topográfica, muy tenue)
    const gridFineGeo = new THREE.PlaneGeometry(50, 50, 140, 140);
    displaceToTerrain(gridFineGeo, 0.03);
    const gridFineMat = new THREE.MeshBasicMaterial({
      color: '#0e7da0',
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const gridFine = new THREE.Mesh(gridFineGeo, gridFineMat);
    gridFine.rotation.x = -Math.PI / 2;
    scene.add(gridFine);

    // Pozo de luz cian bajo el árbol (disco aditivo plano con glow radial)
    const poolGeo = new THREE.CircleGeometry(10, 56);
    const poolMat = new THREE.MeshBasicMaterial({
      map: particleTexture,
      color: '#5ad6ff',
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const floorPool = new THREE.Mesh(poolGeo, poolMat);
    floorPool.rotation.x = -Math.PI / 2;
    floorPool.position.y = 0.08;
    scene.add(floorPool);

    // Anillos de energía que se expanden desde la base (ondas de datos)
    const energyRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; offset: number }[] = [];
    const ringWaveGeo = new THREE.RingGeometry(0.9, 1.0, 96);
    const NUM_RINGS = 4;
    for (let i = 0; i < NUM_RINGS; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: '#22e0ff',
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(ringWaveGeo, mat);
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.12;
      scene.add(m);
      energyRings.push({ mesh: m, mat, offset: i / NUM_RINGS });
    }

    // --- 5. SISTEMA DE PARTÍCULAS (Haces de Datos Drifteando) ---
    const allParticleSystems: THREE.Points[] = [];
    const createParticles = (
      count: number,
      spread: number,
      color: THREE.Color,
      size: number,
      isFalling: boolean
    ): THREE.Points => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const radius = spread * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        speeds[i] = Math.random() * 0.02 + 0.008; // Datos más veloces e instantáneos
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

      const material = new THREE.PointsMaterial({
        size: size,
        color: color,
        map: particleTexture,
        transparent: true,
        opacity: isFalling ? 0.5 : 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        alphaTest: 0.01
      });

      const points = new THREE.Points(geometry, material);
      points.userData = { isFalling, spreadRadius: spread };
      allParticleSystems.push(points);
      return points;
    };

    // --- 6. ÁRBOL FRACTAL RECURSIVO ---
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    const buildBranch = (
      parent: THREE.Object3D,
      radiusBottom: number,
      radiusTop: number,
      height: number,
      level: number
    ) => {
      // Ramas un poco más anguladas para dar un look menos orgánico y más cibernético
      const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 6, 1, false);
      geo.translate(0, height / 2, 0);
      
      const mesh = new THREE.Mesh(geo, troncoMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);

      if (level > 0) {
        const numBranches = level === 3 ? 3 : (2 + Math.floor(Math.random() * 2));
        for (let i = 0; i < numBranches; i++) {
          const branchGroup = new THREE.Group();
          branchGroup.position.y = height * (0.65 + Math.random() * 0.35);
          branchGroup.rotation.y = (Math.PI * 2 / numBranches) * i + (Math.random() - 0.5);
          branchGroup.rotation.z = Math.random() * 0.5 + 0.25; // Ángulo más definido
          
          mesh.add(branchGroup);
          buildBranch(branchGroup, radiusTop, radiusTop * 0.62, height * (0.68 + Math.random()*0.18), level - 1);
        }
      } else {
        const leavesColor = Math.random() > 0.55 ? hojasColor : hojasSecundariasColor;
        const leafCluster = createParticles(150, 2.1, leavesColor, 0.3, false);
        (leafCluster.material as THREE.PointsMaterial).opacity = 0.5;
        leafCluster.position.y = height;
        mesh.add(leafCluster);
      }
    };

    const baseTree = new THREE.Group();
    baseTree.position.y = -0.1; // anclado al suelo (antes flotaba a y=1)
    treeGroup.add(baseTree);
    buildBranch(baseTree, 0.45, 0.28, 4, 3);

    // Partículas que flotan hacia arriba (Representa tráfico / conversiones ascendentes)
    const risingData = createParticles(400, 16, hojasColor, 0.22, true);
    risingData.position.set(0, -2, 0); // Empiezan abajo
    scene.add(risingData);

    // Segundo flujo de datos en magenta (más profundidad y color)
    const risingData2 = createParticles(260, 13, hojasSecundariasColor, 0.2, true);
    risingData2.position.set(0, -3, 0);
    scene.add(risingData2);

    // Corazón brillante en la copa — el destino final de la cámara, glow aditivo que pulsa
    const coreGlowMat = new THREE.SpriteMaterial({
      map: particleTexture,
      color: new THREE.Color('#7df0ff'),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreGlow = new THREE.Sprite(coreGlowMat);
    coreGlow.scale.set(2.8, 2.8, 1);
    coreGlow.position.set(0, 6.4, 0); // bajado para acompañar la copa ya anclada
    scene.add(coreGlow);

    // --- 7. NODOS DE DATOS BIOLUMINISCENTES EN EL SUELO (Flores Cuadradas/Cúbicas) ---
    const flores: THREE.Mesh[] = [];
    const florGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const florMat = new THREE.MeshStandardMaterial({ 
      color: '#ffffff', 
      emissive: hojasSecundariasColor, 
      emissiveIntensity: 2.5 
    });

    for (let i = 0; i < 90; i++) {
      const flor = new THREE.Mesh(florGeo, florMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.6 + Math.random() * 7.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      let y = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 1.2;
      y += Math.sin(x * 0.7) * Math.cos(z * 0.4) * 0.3;
      
      const scale = Math.random() * 0.6 + 0.4;
      flor.position.set(x, y + 0.04, z);
      flor.scale.set(scale, scale, scale);
      flor.userData = { baseX: x, baseY: y + 0.04 }; 
      scene.add(flor);
      flores.push(flor);

      if (Math.random() > 0.82) {
        const miniLight = new THREE.PointLight(hojasSecundariasColor, 2.5, 1.4);
        flor.add(miniLight);
      }
    }

    // --- 8. TRAYECTORIAS DE CÁMARA (Trayectoria Inversa/Espejada a la de Estrategia) ---
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2, 16),     // 0% - Frente, lejos
      new THREE.Vector3(-7, 1.5, 9),   // 20% - Acercándose por la IZQUIERDA
      new THREE.Vector3(-8, 5, 0),     // 40% - Subiendo por el lateral izquierdo
      new THREE.Vector3(-2, 6, -7),    // 60% - Parte trasera del árbol
      new THREE.Vector3(4, 7, -2),     // 80% - Sumergiéndose en el follaje por la derecha
      new THREE.Vector3(0, 8.5, 1)     // 100% - En el corazón brillante de cian
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4, 0),      
      new THREE.Vector3(0, 2.2, 0),    
      new THREE.Vector3(0, 5, 0),      
      new THREE.Vector3(0, 6, 0),      
      new THREE.Vector3(0, 7.5, 0),    
      new THREE.Vector3(0, 11, 0)      
    ]);

    // --- 9. BUCLE DE ANIMACIÓN ---
    const clock = new THREE.Clock();
    const vectorDestino = new THREE.Vector3();
    const lookAtDestino = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 4, 0);
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;
      const time = clock.getElapsedTime();

      // Corazón pulsante en la copa (el destino final de la cámara) — sutil
      coreGlow.material.opacity = 0.28 + Math.sin(time * 1.6) * 0.12;
      const cs = 2.6 + Math.sin(time * 1.2) * 0.4;
      coreGlow.scale.set(cs, cs, 1);

      // Piso vivo: anillos de energía que se expanden + pozo y grilla que pulsan
      energyRings.forEach((r) => {
        const t = (time * 0.16 + r.offset) % 1;
        const radius = 1 + t * 12;
        r.mesh.scale.set(radius, radius, 1);
        r.mat.opacity = (1 - t) * 0.4;
      });
      floorPool.material.opacity = 0.2 + Math.sin(time * 1.3) * 0.1;
      gridMat.opacity = 0.16 + Math.sin(time * 0.8) * 0.05;

      // Animación de flores del suelo
      flores.forEach(flor => {
        flor.position.y = flor.userData.baseY + Math.sin(time * 2.2 + flor.userData.baseX) * 0.07;
      });

      // Animación de partículas (Las partículas caen pero para Paid Ads las hacemos ASCENDER)
      allParticleSystems.forEach(pts => {
        const positions = pts.geometry.attributes.position.array as Float32Array;
        const speeds = pts.geometry.attributes.speed.array as Float32Array;
        
        if (pts.userData.isFalling) {
          // Tráfico ascendente
          for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] += speeds[i]; // + para subir
            if (positions[i * 3 + 1] > 12) {
              positions[i * 3 + 1] = -2; // Reiniciar abajo
            }
          }
          pts.geometry.attributes.position.needsUpdate = true;
        } else {
          pts.rotation.y = Math.sin(time * 0.25) * 0.06;
          pts.rotation.z = Math.cos(time * 0.35) * 0.03;
        }
      });

      // --- CÁMARA CINEMÁTICA ---
      const scrollVal = Math.max(0, Math.min(1, scrollProgress.current));
      cameraPath.getPointAt(scrollVal, vectorDestino);
      targetPath.getPointAt(scrollVal, lookAtDestino);

      const idleX = Math.sin(time * 0.5) * 0.35;
      const idleY = Math.cos(time * 0.4) * 0.22;
      vectorDestino.x += idleX;
      vectorDestino.y += idleY;

      camera.position.lerp(vectorDestino, 0.03);
      currentLookAt.lerp(lookAtDestino, 0.04);
      camera.lookAt(currentLookAt);

      if (composer) composer.render();
      else renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer?.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      composer?.dispose();
      renderer.dispose();
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = Math.max(1, target.scrollHeight - target.clientHeight);
    const currentProg = target.scrollTop / maxScroll;
    scrollProgress.current = currentProg;
    setProgress(currentProg);

    // Hero se apaga antes de que entre el primer paso (evita superposición)
    setHeroOpacity(Math.max(0, 1 - currentProg * 7.5));

    const sectionIndex = Math.min(5, Math.floor(currentProg * 6 + 0.12));
    setActiveSection(sectionIndex);
  };

  const sections = [
    { id: 0, title: "Inicio" },
    { id: 1, title: "Segmentación" },
    { id: 2, title: "Canales" },
    { id: 3, title: "Creativos" },
    { id: 4, title: "Optimización" },
    { id: 5, title: "Escalar" },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#010204] font-sans text-white selection:bg-cyan-500/30">
      
      {/* CAPA DE FONDO: Entorno 3D */}
      <div ref={mountRef} className="pointer-events-none absolute inset-0 z-0" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/50"
        aria-hidden
      />
      {/* Viñeta lateral: separa el texto del 3D sin tapar la escena */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_38%,rgba(1,2,4,0.55)_100%)]"
        aria-hidden
      />

      {/* BARRA DE PROGRESO */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/[0.06]" aria-hidden>
        <div
          className="h-full bg-gradient-to-r from-cyan-300 via-[#c084fc] to-[#eca8d6] shadow-[0_0_14px_rgba(236,168,214,0.65)]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* HEADER */}
      <div className="pointer-events-auto fixed left-4 top-5 z-50 flex items-center gap-3 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[13px] text-white/80 backdrop-blur-md transition-all hover:border-[#eca8d6]/40 hover:bg-black/70 hover:text-white"
        >
          <ArrowLeft className="size-4 text-[#eca8d6]" />
          Volver al inicio
        </Link>
      </div>

      {/* INDICADORES LATERALES */}
      <div className="pointer-events-auto fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-5 md:flex lg:right-8">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
          Paid Ads
        </div>
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => {
              const scrollEl = document.querySelector(".ads-scroll-layer");
              if (scrollEl) {
                const height = scrollEl.scrollHeight - scrollEl.clientHeight;
                scrollEl.scrollTo({
                  top: (idx / 5) * height,
                  behavior: "smooth",
                });
              }
            }}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <span
              className={`font-mono text-[11px] tracking-wider transition-all duration-300 ${
                activeSection === idx
                  ? "translate-x-0 text-[#eca8d6] opacity-100"
                  : "translate-x-2 text-white/35 opacity-0 group-hover:opacity-70"
              }`}
            >
              {sec.title}
            </span>
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeSection === idx
                  ? "w-7 bg-gradient-to-r from-[#eca8d6] to-cyan-400 shadow-[0_0_12px_rgba(236,168,214,0.55)]"
                  : "w-1.5 bg-white/20 group-hover:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>

      {/* SCROLL LAYER */}
      <div
        className="ads-scroll-layer absolute inset-0 z-10 overflow-x-hidden overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
      >
        <div style={{ height: "600vh" }} className="relative w-full">
          
          {/* HERO — absolute (no sticky) para que no se monte sobre los pasos */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex h-screen w-full flex-col items-center justify-center px-5"
            style={{
              opacity: heroOpacity,
              visibility: heroOpacity < 0.04 ? "hidden" : "visible",
              transition: "opacity 80ms linear",
            }}
            aria-hidden={heroOpacity < 0.2}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex max-w-3xl flex-col items-center text-center ${
                heroOpacity > 0.28 ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              <div
                className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(5,8,15,0.88)_0%,rgba(5,8,15,0.45)_50%,transparent_75%)]"
                aria-hidden
              />
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#eca8d6] sm:text-xs">
                Cosecha Creativa · San Juan
              </p>
              <h1 className="font-display text-[clamp(2.5rem,8.5vw,5.25rem)] leading-[0.94] tracking-tight text-white">
                Publicidad paga
                <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-[#eca8d6] to-cyan-300 bg-clip-text text-transparent">
                  en redes
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/68 sm:mt-6 sm:text-lg">
                Inversión que se transforma en ventas medibles. Creativos que cortan el ruido
                y reportes que se entienden.
              </p>

              <div className="mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-2">
                {PLATFORMS.map((p, i) => (
                  <motion.span
                    key={p.name}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.55 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="group/chip inline-flex items-center gap-2 border border-white/14 bg-black/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:text-white sm:text-[11px]"
                  >
                    <span
                      className="size-1.5 rounded-full transition-shadow duration-300"
                      style={{ background: p.dot, boxShadow: `0 0 8px ${p.dot}` }}
                      aria-hidden
                    />
                    {p.name}
                  </motion.span>
                ))}
              </div>

              <motion.dl
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 hidden w-full max-w-lg grid-cols-3 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid"
              >
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="bg-[#04070d]/85 px-3 py-3 text-center backdrop-blur-sm">
                    <dt className="font-display text-[15px] font-semibold leading-none text-white">
                      {s.value}
                    </dt>
                    <dd className="mt-1.5 font-mono text-[9px] uppercase leading-tight tracking-[0.16em] text-white/40">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </motion.dl>

              <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center">
                <a
                  href={getWhatsAppHref("Publicidad paga en redes — quiero una campaña")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_16px_40px_-12px_rgba(37,211,102,0.45)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <WhatsAppMark className="size-[18px] text-[#25D366]" />
                  Hablar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const scrollEl = document.querySelector(".ads-scroll-layer");
                    if (scrollEl) {
                      const height = scrollEl.scrollHeight - scrollEl.clientHeight;
                      scrollEl.scrollTo({ top: height / 5, behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/45 px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-all hover:border-[#eca8d6]/45 hover:text-white"
                >
                  Ver el método
                  <ChevronDown className="size-4 opacity-70" />
                </button>
              </div>
            </motion.div>

            <div
              className="absolute bottom-8 flex flex-col items-center text-white/40"
              style={{ opacity: Math.min(1, heroOpacity * 1.2) }}
            >
              <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em]">
                Deslizá para entrar
              </span>
              <ChevronDown className="size-5 animate-bounce text-cyan-300/70" />
            </div>
          </div>

          {STEP_PANELS.map((step) => (
            <StepPanel
              key={step.id}
              step={step}
              reduce={reduce}
              active={activeSection === step.id}
            />
          ))}

          {/* CIERRE */}
          <div
            id="ads-escalar"
            className="pointer-events-none absolute inset-x-0 top-[500vh] z-20 flex h-screen w-full items-center justify-center px-5"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative flex max-w-2xl flex-col items-center text-center"
            >
              <div
                className="pointer-events-none absolute -inset-x-12 -inset-y-10 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(5,8,15,0.94)_0%,rgba(5,8,15,0.55)_55%,transparent_78%)]"
                aria-hidden
              />
              <span className="mb-5 flex size-14 items-center justify-center border border-[#eca8d6]/40 bg-[#eca8d6]/12">
                <CheckCircle className="size-7 text-[#eca8d6]" />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300/85">
                05 · Escalamiento
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-white">
                Crecer sin quemar el algoritmo
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
                Escalamos en vertical con aumentos controlados de presupuesto, y en horizontal con
                nuevas audiencias, plazas y ofertas de gancho.
              </p>

              <dl className="mt-8 grid w-full max-w-lg grid-cols-3 gap-px overflow-hidden border border-white/10 bg-white/10">
                {[
                  { v: "ROAS 3x+", k: "meta sostenida" },
                  { v: "CPA en baja", k: "mes a mes" },
                  { v: "Reportes", k: "que se entienden" },
                ].map((s) => (
                  <div key={s.k} className="bg-[#04070d]/85 px-3 py-4 text-center backdrop-blur-sm">
                    <dt className="font-display text-[15px] font-semibold leading-none text-white sm:text-base">
                      {s.v}
                    </dt>
                    <dd className="mt-1.5 font-mono text-[9px] uppercase leading-tight tracking-[0.16em] text-white/40">
                      {s.k}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={getWhatsAppHref("Publicidad paga en redes")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                >
                  <WhatsAppMark className="size-[18px] text-[#25D366]" />
                  Iniciar campaña
                </a>
                <a
                  href="mailto:contacto@cosechacreativa.com.ar?subject=Publicidad%20Paga%20en%20Redes"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/50 px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
                >
                  <Mail className="size-4 text-[#eca8d6]" />
                  Escribinos
                </a>
              </div>

              <Link
                href="/servicios"
                className="mt-7 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-[#eca8d6]"
              >
                Ver otros servicios
                <ArrowUpRight className="size-3.5" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
