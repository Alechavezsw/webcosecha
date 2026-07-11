"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Search, 
  Layers, 
  Megaphone, 
  Target, 
  Sparkles, 
  TrendingUp, 
  CheckCircle,
  Mail,
  ChevronDown,
  Crosshair,
  Zap,
  BarChart3
} from 'lucide-react';
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function PublicidadPagaClient() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);

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
    const maxScroll = target.scrollHeight - target.clientHeight;
    const currentProg = target.scrollTop / maxScroll;
    scrollProgress.current = currentProg;

    // Calcular sección activa
    const sectionIndex = Math.min(5, Math.floor(currentProg * 6 + 0.15));
    setActiveSection(sectionIndex);
  };

  const sections = [
    { id: 0, title: "Paid Ads & ROI" },
    { id: 1, title: "1. Segmentación" },
    { id: 2, title: "2. Canales Ads" },
    { id: 3, title: "3. Creativos" },
    { id: 4, title: "4. Optimización" },
    { id: 5, title: "5. Escalamiento" }
  ];

  return (
    <div className="w-full h-screen bg-[#010204] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30">
      
      {/* CAPA DE FONDO: Entorno 3D */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none"></div>

      {/* HEADER DE NAVEGACIÓN RETROILUMINADO */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-black/70 px-4 py-2 text-[13px] text-cyan-200/90 backdrop-blur-md transition-all hover:border-cyan-500/60 hover:bg-cyan-950/40 hover:text-white"
        >
          <ArrowLeft className="size-4 text-cyan-400" />
          Volver al inicio
        </Link>
      </div>

      {/* INDICADORES LATERALES DE PROGRESO */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden md:flex flex-col gap-6 items-end">
        <div className="text-[10px] font-mono tracking-[0.2em] text-cyan-400/50 uppercase mb-2">Performance Ads</div>
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => {
              const scrollEl = document.querySelector('.overflow-y-auto');
              if (scrollEl) {
                const height = scrollEl.scrollHeight - scrollEl.clientHeight;
                scrollEl.scrollTo({
                  top: (idx / 5) * height,
                  behavior: 'smooth'
                });
              }
            }}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <span className={`text-[11px] font-mono tracking-wider transition-all duration-300 ${
              activeSection === idx ? 'text-cyan-400 opacity-100 translate-x-0' : 'text-cyan-200/40 opacity-0 translate-x-2 group-hover:opacity-60'
            }`}>
              {sec.title}
            </span>
            <div className={`h-2 rounded-full transition-all duration-500 ${
              activeSection === idx 
                ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(0,243,255,0.8)]' 
                : 'w-2 bg-cyan-100/20 group-hover:bg-cyan-100/40'
            }`} />
          </button>
        ))}
      </div>

      {/* CAPA FRONTAL: Scroll HTML Nativo */}
      <div 
        className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden scroll-smooth"
        onScroll={handleScroll}
      >
        {/* Expandido a 600vh para permitir 6 vistas de cámara distintas */}
        <div style={{ height: '600vh' }} className="relative w-full">
          
          {/* 1. Vista Inicial: Título General */}
          <div className="h-screen w-full flex flex-col items-center justify-center relative sticky top-0 pointer-events-none px-4">
            <div className="max-w-4xl text-center flex flex-col items-center justify-center">
              <span className="mb-4 inline-flex items-center gap-3 font-mono text-xs md:text-sm text-cyan-400 tracking-[0.3em] uppercase">
                <Sparkles className="size-4 animate-pulse text-cyan-400" />
                Cosecha Creativa
              </span>
              <h1 className="cc-hero-title text-center uppercase italic leading-none text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-cyan-300 to-blue-600 drop-shadow-[0_0_35px_rgba(0,243,255,0.4)] sm:text-6xl md:text-8xl">
                Paid Media & Ads
              </h1>
              <p className="mt-6 text-base sm:text-lg md:text-2xl text-cyan-100/80 max-w-2xl text-center px-4 leading-relaxed font-light font-display">
                Multiplicamos la visibilidad de tu marca y aceleramos tus ventas mediante campañas de alto rendimiento en Meta Ads (Instagram/Facebook), Google Ads, YouTube, TikTok y LinkedIn B2B.
              </p>
            </div>
            
            <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-cyan-400/80">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Deslizá lentamente para ver la máquina</span>
              <ChevronDown className="size-5 text-cyan-400" />
            </div>
          </div>

          {/* 2. Suelo / Raíces: Segmentación Precisa */}
          <div className="h-screen w-full flex items-center justify-start px-6 sm:px-16 md:px-32 absolute top-[100vh] pointer-events-none">
            <div className="max-w-xl bg-[#01060e]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-cyan-900/40 pointer-events-auto shadow-[0_0_50px_rgba(0,243,255,0.12)] transition-all duration-500 hover:border-cyan-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center">
                  <Crosshair className="size-5 text-cyan-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold">Paso 01 · Las Raíces</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-[#67e8f9] mb-4 tracking-tight">
                Segmentación Quirúrgica
              </h2>
              <p className="text-cyan-100/85 text-base sm:text-lg leading-relaxed">
                Toda gran campaña nace con datos limpios. Implementamos el <strong className="font-semibold text-white">Píxel de Meta, la API de Conversiones (CAPI) y Google Tag Manager</strong> para trazar el recorrido exacto de tus usuarios sin perder atribución. Construimos audiencias personalizadas, remarketing dinámico y públicos similares basados en compradores reales, para que tus anuncios lleguen únicamente a quienes tienen intención real de compra.
              </p>
            </div>
          </div>

          {/* 3. Ascenso por el tronco: Red de Canales */}
          <div className="h-screen w-full flex items-center justify-end px-6 sm:px-16 md:px-32 absolute top-[200vh] pointer-events-none">
            <div className="max-w-xl bg-[#01060e]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-cyan-900/40 pointer-events-auto shadow-[0_0_50px_rgba(0,243,255,0.12)] transition-all duration-500 hover:border-cyan-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center">
                  <Layers className="size-5 text-cyan-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold">Paso 02 · El Tronco</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-[#67e8f9] mb-4 tracking-tight">
                Ecosistema Multicanal
              </h2>
              <p className="text-cyan-100/85 text-base sm:text-lg leading-relaxed">
                El núcleo por donde fluye la inversión. Sincronizamos campañas inteligentes en <strong className="font-semibold text-white">Google Search, Google Shopping, Performance Max, anuncios de catálogo de Meta y campañas de mensajes directas a WhatsApp Business</strong>. Un ecosistema coordinado que acompaña al usuario en cada etapa de su decisión de compra.
              </p>
            </div>
          </div>

          {/* 4. Parte trasera: Creativos Magnéticos */}
          <div className="h-screen w-full flex items-center justify-start px-6 sm:px-16 md:px-32 absolute top-[300vh] pointer-events-none">
            <div className="max-w-xl bg-[#01060e]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-cyan-900/40 pointer-events-auto shadow-[0_0_50px_rgba(0,243,255,0.12)] transition-all duration-500 hover:border-cyan-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center">
                  <Zap className="size-5 text-cyan-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold">Paso 03 · Las Ramas</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-[#67e8f9] mb-4 tracking-tight">
                Creativos Imantados (UGC)
              </h2>
              <p className="text-cyan-100/85 text-base sm:text-lg leading-relaxed">
                Detenemos el scroll de tu audiencia. Aplicamos la <strong className="font-semibold text-white">estructura AIDA</strong> (Atención, Interés, Deseo, Acción) y creamos contenidos con enfoque de creador — <strong className="font-semibold text-white">UGC</strong> — que rompen la barrera publicitaria convencional. Ganchos potentes en los primeros 3 segundos de cada reel y tests semanales de imágenes, videos y textos para que tus anuncios nunca se desgasten.
              </p>
            </div>
          </div>

          {/* 5. Inmersión en el follaje: Optimización y ROI */}
          <div className="h-screen w-full flex items-center justify-end px-6 sm:px-16 md:px-32 absolute top-[400vh] pointer-events-none">
            <div className="max-w-xl bg-[#01060e]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-cyan-900/40 pointer-events-auto shadow-[0_0_50px_rgba(0,243,255,0.12)] transition-all duration-500 hover:border-cyan-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center">
                  <BarChart3 className="size-5 text-cyan-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold">Paso 04 · El Follaje</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-[#67e8f9] mb-4 tracking-tight">
                Optimización y Retorno (ROAS)
              </h2>
              <p className="text-cyan-100/85 text-base sm:text-lg leading-relaxed">
                Decisiones basadas en datos duros, no en suposiciones. Optimizamos la distribución del presupuesto entre campañas y conjuntos de anuncios, controlamos la frecuencia para no saturar a tu audiencia y analizamos la atribución en detalle. La meta: alcanzar y sostener un <strong className="font-semibold text-white">retorno publicitario (ROAS) superior a 3x</strong>, bajando mes a mes tu costo de adquisición.
              </p>
            </div>
          </div>

          {/* 6. Vista final mirando arriba: Escalamiento */}
          <div className="h-screen w-full flex items-center justify-center absolute top-[500vh] pointer-events-none px-4">
            <div className="text-center max-w-2xl bg-[#010204]/60 backdrop-blur-lg p-8 sm:p-12 rounded-3xl border border-cyan-900/20 shadow-[0_0_60px_rgba(0,243,255,0.08)] pointer-events-auto flex flex-col items-center">
              <div className="size-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-6">
                <CheckCircle className="size-8 text-cyan-400 shadow-sm animate-pulse" />
              </div>
              <h2 className="cc-section-title text-transparent bg-clip-text bg-gradient-to-t from-blue-600 via-cyan-300 to-cyan-100 leading-none md:text-6xl">
                Escalamiento Controlado
              </h2>
              <p className="mt-4 text-cyan-100/80 text-lg leading-relaxed font-light">
                Multiplicamos tus ventas de forma predecible y segura. Escalamos <strong className="font-semibold text-white">en vertical</strong> — aumentos controlados del presupuesto que no reinician el aprendizaje del algoritmo — y <strong className="font-semibold text-white">en horizontal</strong>: nuevas audiencias, nuevos mercados geográficos y nuevas ofertas de gancho.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a 
                  href={getWhatsAppHref("Publicidad paga en redes")}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/30 bg-white hover:bg-cyan-100 text-black px-6 py-3 text-sm font-semibold tracking-wide shadow-[0_15px_30px_-8px_rgba(0,243,255,0.3)] transition-all hover:scale-105 duration-300"
                >
                  <WhatsAppMark className="size-[18px] text-[#25D366]" />
                  Iniciar Campaña por WhatsApp
                </a>
                
                <a 
                  href="mailto:contacto@cosechacreativa.com.ar?subject=Publicidad%20Paga%20en%20Redes"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/30 bg-black/60 px-6 py-3 text-sm font-semibold tracking-wide text-cyan-200/90 hover:text-white hover:border-cyan-500/60 backdrop-blur-sm transition-all hover:scale-105 duration-300"
                >
                  <Mail className="size-4 text-cyan-400" />
                  Escribinos por Email
                </a>
              </div>

              <div className="mt-6">
                <Link 
                  href="/servicios" 
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-cyan-400/60 hover:text-cyan-400 transition-colors duration-300"
                >
                  Ver otros servicios
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
