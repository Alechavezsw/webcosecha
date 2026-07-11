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
  ChevronDown
} from 'lucide-react';
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function ConsultoriaEstrategicaClient() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    // --- 1. CONFIGURACIÓN BÁSICA DE THREE.JS ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030001');
    scene.fog = new THREE.FogExp2('#030001', 0.04);

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

    // Post-procesado: Bloom cinematográfico — hace florecer pétalos, flores y el
    // corazón del árbol de estrategia. Solo desktop (GPU).
    let composer: EffectComposer | null = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.8,  // strength
          0.72, // radius
          0.1   // threshold: brilla lo emisivo, calma el tronco oscuro
        )
      );
      composer.addPass(new OutputPass());
    }

    // --- 2. GENERADOR DE TEXTURAS PROCEDURALES (Resplandor) ---
    const createGlowingParticleTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };
    const particleTexture = createGlowingParticleTexture();

    // --- 3. MATERIALES Y LUCES ---
    const hojasColor = new THREE.Color("#ff2a6d");
    const hojasSecundariasColor = new THREE.Color("#ff7b9c");
    
    const troncoMaterial = new THREE.MeshStandardMaterial({ 
      color: '#1a0505', 
      roughness: 0.95, 
      metalness: 0.05,
      bumpScale: 0.02
    });

    scene.add(new THREE.AmbientLight('#ffb3c6', 0.05));
    
    const dirLight = new THREE.DirectionalLight('#ffffff', 0.3);
    dirLight.position.set(8, 15, -5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    
    const ptLight = new THREE.PointLight(hojasColor, 32, 15);
    ptLight.position.set(0, 6, 0);
    scene.add(ptLight);

    // --- 4. TERRENO REALISTA ---
    const groundGeo = new THREE.PlaneGeometry(50, 50, 128, 128);
    const pos = groundGeo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 1.5;
      z += Math.sin(x * 0.8) * Math.cos(y * 0.5) * 0.4;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: '#140509',
      roughness: 0.42,
      metalness: 0.62,
      emissive: new THREE.Color('#1c0410'),
      emissiveIntensity: 0.3,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Mismo relieve que el suelo, para que las grillas lo abracen (topográfico)
    const terrainZ = (x: number, y: number) =>
      Math.sin(x * 0.2) * Math.cos(y * 0.2) * 1.5 + Math.sin(x * 0.8) * Math.cos(y * 0.5) * 0.4;
    const displaceToTerrain = (geo: THREE.PlaneGeometry, lift: number) => {
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setZ(i, terrainZ(p.getX(i), p.getY(i)) + lift);
      }
      p.needsUpdate = true;
    };

    // Grilla de luz rosa (tipo Tron) que SIGUE el relieve del terreno — aditiva, brilla con el bloom
    const gridGeo = new THREE.PlaneGeometry(50, 50, 64, 64);
    displaceToTerrain(gridGeo, 0.05);
    const gridMat = new THREE.MeshBasicMaterial({
      color: '#ff3d7f',
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    scene.add(grid);

    // Grilla fina de detalle (también topográfica, muy tenue)
    const gridFineGeo = new THREE.PlaneGeometry(50, 50, 140, 140);
    displaceToTerrain(gridFineGeo, 0.03);
    const gridFineMat = new THREE.MeshBasicMaterial({
      color: '#c01858',
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const gridFine = new THREE.Mesh(gridFineGeo, gridFineMat);
    gridFine.rotation.x = -Math.PI / 2;
    scene.add(gridFine);

    // Pozo de luz rosa bajo el árbol (disco aditivo plano con textura de glow radial)
    const poolGeo = new THREE.CircleGeometry(10, 56);
    const poolMat = new THREE.MeshBasicMaterial({
      map: particleTexture,
      color: '#ff5a8c',
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const floorPool = new THREE.Mesh(poolGeo, poolMat);
    floorPool.rotation.x = -Math.PI / 2;
    floorPool.position.y = 0.08;
    scene.add(floorPool);

    // Anillos de energía que se expanden desde la base (ondas de datos / "estrategia irradiando")
    const energyRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; offset: number }[] = [];
    const ringWaveGeo = new THREE.RingGeometry(0.9, 1.0, 96);
    const NUM_RINGS = 4;
    for (let i = 0; i < NUM_RINGS; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: '#ff3d7f',
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

    // --- 5. SISTEMA DE PARTÍCULAS ---
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
        speeds[i] = Math.random() * 0.015 + 0.005;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

      const material = new THREE.PointsMaterial({
        size: size,
        color: color,
        map: particleTexture,
        transparent: true,
        opacity: isFalling ? 0.6 : 0.9,
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
      const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 8, 1, false);
      geo.translate(0, height / 2, 0);
      
      const mesh = new THREE.Mesh(geo, troncoMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);

      if (level > 0) {
        const numBranches = level === 3 ? 3 : (2 + Math.floor(Math.random() * 2));
        for (let i = 0; i < numBranches; i++) {
          const branchGroup = new THREE.Group();
          branchGroup.position.y = height * (0.6 + Math.random() * 0.4);
          branchGroup.rotation.y = (Math.PI * 2 / numBranches) * i + (Math.random() - 0.5);
          branchGroup.rotation.z = Math.random() * 0.6 + 0.2;
          
          mesh.add(branchGroup);
          buildBranch(branchGroup, radiusTop, radiusTop * 0.65, height * (0.7 + Math.random()*0.2), level - 1);
        }
      } else {
        const leavesColor = Math.random() > 0.5 ? hojasColor : hojasSecundariasColor;
        const leafCluster = createParticles(180, 2.3, leavesColor, 0.3, false);
        (leafCluster.material as THREE.PointsMaterial).opacity = 0.55;
        leafCluster.position.y = height;
        mesh.add(leafCluster);
      }
    };

    const baseTree = new THREE.Group();
    baseTree.position.y = -0.1; // anclado al suelo (antes flotaba a y=1)
    treeGroup.add(baseTree);
    buildBranch(baseTree, 0.45, 0.3, 4, 3);

    const fallingPetals = createParticles(500, 15, hojasColor, 0.2, true);
    fallingPetals.position.set(0, 6, 0);
    scene.add(fallingPetals);

    // Corazón brillante en la copa — destino final de la cámara, glow aditivo pulsante
    const coreGlowMat = new THREE.SpriteMaterial({
      map: particleTexture,
      color: new THREE.Color('#ff7ba8'),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreGlow = new THREE.Sprite(coreGlowMat);
    coreGlow.scale.set(3, 3, 1);
    coreGlow.position.set(0, 6.4, 0); // bajado para acompañar la copa ya anclada
    scene.add(coreGlow);

    // --- 7. FLORES BIOLUMINISCENTES EN EL SUELO ---
    const flores: THREE.Mesh[] = [];
    const florGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const florMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: hojasSecundariasColor, emissiveIntensity: 2 });

    for (let i = 0; i < 80; i++) {
      const flor = new THREE.Mesh(florGeo, florMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      let y = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 1.5;
      y += Math.sin(x * 0.8) * Math.cos(z * 0.5) * 0.4;
      
      const scale = Math.random() * 0.5 + 0.5;
      flor.position.set(x, y + 0.05, z);
      flor.scale.set(scale, scale, scale);
      flor.userData = { baseX: x, baseY: y + 0.05 }; 
      scene.add(flor);
      flores.push(flor);

      if (Math.random() > 0.8) {
        const miniLight = new THREE.PointLight(hojasSecundariasColor, 2, 1.5);
        flor.add(miniLight);
      }
    }

    // --- 8. TRAYECTORIAS DE CÁMARA CINEMATOGRÁFICAS ---
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2, 16),     // 0% - Frente, lejos
      new THREE.Vector3(7, 1.5, 9),    // 20% - Acercándose por la derecha, a ras de suelo
      new THREE.Vector3(8, 5, 0),      // 40% - Subiendo por el lateral derecho
      new THREE.Vector3(2, 6, -7),     // 60% - Parte trasera del árbol, ramas medias
      new THREE.Vector3(-4, 7, -2),    // 80% - Sumergiéndose en el follaje por la izquierda
      new THREE.Vector3(-1, 8.5, 1)    // 100% - En el corazón brillante mirando las hojas
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4, 0),      // 0% - Mirando al centro
      new THREE.Vector3(0, 2.5, 0),    // 20% - Mirando las raíces
      new THREE.Vector3(0, 5, 0),      // 40% - Mirando ramas medias
      new THREE.Vector3(0, 6, 0),      // 60% - Mirando hacia arriba al follaje
      new THREE.Vector3(0, 7, 0),      // 80% - Mirando el núcleo
      new THREE.Vector3(0, 12, 0)      // 100% - Mirando al cielo a través de las ramas
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

      // Corazón pulsante en la copa (destino final de la cámara) — sutil
      coreGlow.material.opacity = 0.32 + Math.sin(time * 1.6) * 0.14;
      const cs = 2.7 + Math.sin(time * 1.2) * 0.5;
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
        flor.position.y = flor.userData.baseY + Math.sin(time * 2 + flor.userData.baseX) * 0.08;
      });

      // Animación de partículas
      allParticleSystems.forEach(pts => {
        const positions = pts.geometry.attributes.position.array as Float32Array;
        const speeds = pts.geometry.attributes.speed.array as Float32Array;
        
        if (pts.userData.isFalling) {
          for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] -= speeds[i];
            if (positions[i * 3 + 1] < -2) {
              positions[i * 3 + 1] = 10; // Reiniciar más alto
            }
          }
          pts.geometry.attributes.position.needsUpdate = true;
        } else {
          pts.rotation.y = Math.sin(time * 0.2) * 0.05;
          pts.rotation.z = Math.cos(time * 0.3) * 0.02;
        }
      });

      // --- CÁMARA CINEMÁTICA ---
      const scrollVal = Math.max(0, Math.min(1, scrollProgress.current));
      cameraPath.getPointAt(scrollVal, vectorDestino);
      targetPath.getPointAt(scrollVal, lookAtDestino);

      const idleX = Math.sin(time * 0.4) * 0.3;
      const idleY = Math.cos(time * 0.3) * 0.2;
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
    { id: 0, title: "Estrategia 360°" },
    { id: 1, title: "1. Diagnóstico" },
    { id: 2, title: "2. Estructura Web" },
    { id: 3, title: "3. Captación Multicanal" },
    { id: 4, title: "4. Embudo de Conversión" },
    { id: 5, title: "5. Evolución Continua" }
  ];

  return (
    <div className="w-full h-screen bg-[#030001] text-white overflow-hidden relative font-sans selection:bg-pink-500/30">
      
      {/* CAPA DE FONDO: Entorno 3D */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none"></div>

      {/* HEADER DE NAVEGACIÓN RETROILUMINADO */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-black/70 px-4 py-2 text-[13px] text-pink-200/90 backdrop-blur-md transition-all hover:border-pink-500/60 hover:bg-pink-950/40 hover:text-white"
        >
          <ArrowLeft className="size-4 text-pink-400" />
          Volver al inicio
        </Link>
      </div>

      {/* INDICADORES LATERALES DE PROGRESO */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden md:flex flex-col gap-6 items-end">
        <div className="text-[10px] font-mono tracking-[0.2em] text-pink-400/50 uppercase mb-2">Estrategia 360</div>
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
              activeSection === idx ? 'text-pink-400 opacity-100 translate-x-0' : 'text-pink-200/40 opacity-0 translate-x-2 group-hover:opacity-60'
            }`}>
              {sec.title}
            </span>
            <div className={`h-2 rounded-full transition-all duration-500 ${
              activeSection === idx 
                ? 'w-8 bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(255,42,109,0.8)]' 
                : 'w-2 bg-pink-100/20 group-hover:bg-pink-100/40'
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
              <span className="mb-4 inline-flex items-center gap-3 font-mono text-xs md:text-sm text-pink-400 tracking-[0.3em] uppercase">
                <Sparkles className="size-4 animate-pulse text-pink-500" />
                Cosecha Creativa
              </span>
              <h1 className="cc-hero-title text-center uppercase italic leading-none text-transparent bg-clip-text bg-gradient-to-b from-pink-100 via-pink-300 to-rose-600 drop-shadow-[0_0_35px_rgba(255,42,109,0.45)] sm:text-6xl md:text-8xl">
                Estrategia 360°
              </h1>
              <p className="mt-6 text-base sm:text-lg md:text-2xl text-pink-100/80 max-w-2xl text-center px-4 leading-relaxed font-light font-display">
                Sincronizamos todos tus canales digitales para potenciar tu marca, captar leads calificados y asegurar tu crecimiento sostenible.
              </p>
            </div>
            
            <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-pink-400/80">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Deslizá lentamente para explorar</span>
              <ChevronDown className="size-5 text-pink-500" />
            </div>
          </div>

          {/* 2. Suelo / Raíces: Diagnóstico y Auditoría */}
          <div className="h-screen w-full flex items-center justify-start px-6 sm:px-16 md:px-32 absolute top-[100vh] pointer-events-none">
            <div className="max-w-lg bg-[#0a0204]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-pink-900/40 pointer-events-auto shadow-[0_0_50px_rgba(255,42,109,0.15)] transition-all duration-500 hover:border-pink-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-pink-950/50 border border-pink-500/40 flex items-center justify-center">
                  <Search className="size-5 text-pink-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-pink-400 font-bold">Paso 01 · Las Raíces</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-rose-400 mb-4 tracking-tight">
                Auditoría y Diagnóstico
              </h2>
              <p className="text-pink-100/85 text-base sm:text-lg leading-relaxed">
                Toda gran estrategia nace bajo la superficie. Analizamos en profundidad tu punto de partida, el comportamiento de tu audiencia ideal y la huella digital de tus competidores. Descubrimos las palabras clave y oportunidades latentes para plantar una base de crecimiento indestructible.
              </p>
            </div>
          </div>

          {/* 3. Ascenso por el tronco: Posicionamiento SEO & Web */}
          <div className="h-screen w-full flex items-center justify-end px-6 sm:px-16 md:px-32 absolute top-[200vh] pointer-events-none">
            <div className="max-w-lg bg-[#0a0204]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-pink-900/40 pointer-events-auto shadow-[0_0_50px_rgba(255,42,109,0.15)] transition-all duration-500 hover:border-pink-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-pink-950/50 border border-pink-500/40 flex items-center justify-center">
                  <Layers className="size-5 text-pink-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-pink-400 font-bold">Paso 02 · El Tronco</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-rose-400 mb-4 tracking-tight">
                Estructura Web & SEO
              </h2>
              <p className="text-pink-100/85 text-base sm:text-lg leading-relaxed">
                El canal principal por donde fluye tu negocio. Diseñamos y desarrollamos sitios web corporativos de alta velocidad, optimizados para SEO técnico. Generamos contenido de alto impacto para que tu marca se posicione orgánicamente en Google, convirtiéndose en el pilar central de tu captación.
              </p>
            </div>
          </div>

          {/* 4. Parte trasera oculta: Canales & Publicidad */}
          <div className="h-screen w-full flex items-center justify-start px-6 sm:px-16 md:px-32 absolute top-[300vh] pointer-events-none">
            <div className="max-w-lg bg-[#0a0204]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-pink-900/40 pointer-events-auto shadow-[0_0_50px_rgba(255,42,109,0.15)] transition-all duration-500 hover:border-pink-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-pink-950/50 border border-pink-500/40 flex items-center justify-center">
                  <Megaphone className="size-5 text-pink-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-pink-400 font-bold">Paso 03 · Las Ramas</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-rose-400 mb-4 tracking-tight">
                Publicidad Multicanal
              </h2>
              <p className="text-pink-100/85 text-base sm:text-lg leading-relaxed">
                Extendemos tu alcance hacia donde está tu audiencia. Diseñamos y gestionamos campañas altamente segmentadas en Google Ads, Meta Ads (Instagram/Facebook) y LinkedIn B2B. Llevamos tu mensaje directamente a los tomadores de decisiones de manera precisa, rentable y escalable.
              </p>
            </div>
          </div>

          {/* 5. Inmersión en el follaje: Conversión & Leads */}
          <div className="h-screen w-full flex items-center justify-end px-6 sm:px-16 md:px-32 absolute top-[400vh] pointer-events-none">
            <div className="max-w-lg bg-[#0a0204]/75 backdrop-blur-lg p-6 sm:p-10 rounded-3xl border border-pink-900/40 pointer-events-auto shadow-[0_0_50px_rgba(255,42,109,0.15)] transition-all duration-500 hover:border-pink-500/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-pink-950/50 border border-pink-500/40 flex items-center justify-center">
                  <Target className="size-5 text-pink-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-pink-400 font-bold">Paso 04 · El Follaje</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-rose-400 mb-4 tracking-tight">
                Embudos de Conversión
              </h2>
              <p className="text-pink-100/85 text-base sm:text-lg leading-relaxed">
                El fruto de una estrategia integrada. Diseñamos embudos de venta y automatizaciones personalizadas para nutrir a tus visitantes y transformarlos en clientes fieles. Sincronizamos tus plataformas con tu CRM para garantizar que cada oportunidad de negocio sea atendida al instante.
              </p>
            </div>
          </div>

          {/* 6. Vista final mirando arriba: Cierre / Contacto */}
          <div className="h-screen w-full flex items-center justify-center absolute top-[500vh] pointer-events-none px-4">
            <div className="text-center max-w-2xl bg-[#030001]/60 backdrop-blur-lg p-8 sm:p-12 rounded-3xl border border-pink-900/20 shadow-[0_0_60px_rgba(255,42,109,0.08)] pointer-events-auto flex flex-col items-center">
              <div className="size-16 rounded-2xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-center mb-6">
                <CheckCircle className="size-8 text-pink-500 shadow-sm animate-pulse" />
              </div>
              <h2 className="cc-section-title text-transparent bg-clip-text bg-gradient-to-t from-rose-600 via-pink-300 to-pink-100 leading-none md:text-6xl">
                Evolución 360°
              </h2>
              <p className="mt-4 text-pink-100/80 text-lg leading-relaxed font-light">
                Medición en tiempo real, análisis profundo de datos y optimización constante. Cerramos el ciclo asegurando que tu estrategia digital evolucione y se adapte permanentemente a las exigencias del mercado.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a 
                  href={getWhatsAppHref("Estrategia 360°")}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-500/30 bg-white hover:bg-pink-100 text-black px-6 py-3 text-sm font-semibold tracking-wide shadow-[0_15px_30px_-8px_rgba(255,42,109,0.3)] transition-all hover:scale-105 duration-300"
                >
                  <WhatsAppMark className="size-[18px] text-[#25D366]" />
                  Iniciar por WhatsApp
                </a>
                
                <a 
                  href="mailto:contacto@cosechacreativa.com.ar?subject=Estrategia%20360"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-500/30 bg-black/60 px-6 py-3 text-sm font-semibold tracking-wide text-pink-200/90 hover:text-white hover:border-pink-500/60 backdrop-blur-sm transition-all hover:scale-105 duration-300"
                >
                  <Mail className="size-4 text-pink-400" />
                  Escribinos por Email
                </a>
              </div>

              <div className="mt-6">
                <Link 
                  href="/servicios" 
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-pink-400/60 hover:text-pink-400 transition-colors duration-300"
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
