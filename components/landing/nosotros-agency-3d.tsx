"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useReducedMotion } from "framer-motion";
import { Monitor, Users, Video, Award } from "lucide-react";

const easePremium = [0.22, 1, 0.36, 1] as const;

export function NosotrosAgency3d() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [webGLSupported, setWebGLSupported] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // --- VERIFICAR SOPORTE WEBGL ---
    const hasWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    if (!hasWebGL()) return;
    setWebGLSupported(true);

    if (!mountRef.current) return;

    // --- 1. CONFIGURACIÓN BÁSICA ---
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#101018");
    scene.fog = new THREE.FogExp2("#101018", 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 150);

    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. GENERADOR DE TEXTURAS CON TEXTO ---
    const createScreenTexture = (text1: string, text2: string | null, color: string, isVertical = false) => {
      const canvas = document.createElement("canvas");
      canvas.width = isVertical ? 256 : 512;
      canvas.height = isVertical ? 512 : 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      ctx.fillStyle = "#05050a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${isVertical ? "35px" : "50px"} "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = color;

      if (text2) {
        ctx.fillText(text1, canvas.width / 2, canvas.height / 2 - 25);
        ctx.fillText(text2, canvas.width / 2, canvas.height / 2 + 25);
      } else {
        ctx.fillText(text1, canvas.width / 2, canvas.height / 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    };

    const createPosterTexture = (text: string, color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 70px "Segoe UI", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = color;
      ctx.shadowBlur = 25;
      ctx.fillStyle = color;

      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    };

    // --- 3. MATERIALES ---
    const woodMaterial = new THREE.MeshStandardMaterial({ color: "#8b5a2b", roughness: 0.8 });
    const darkMetalMaterial = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.4, metalness: 0.9 });
    const silverMetalMaterial = new THREE.MeshStandardMaterial({ color: "#e0e0e0", roughness: 0.3, metalness: 0.8 });
    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#1a1a24", roughness: 0.95 });
    const floorMaterial = new THREE.MeshStandardMaterial({ color: "#0a0a10", roughness: 0.8 });

    // --- NUEVOS MATERIALES COLORIDOS PARA MUEBLES ---
    const sofaColor = new THREE.MeshStandardMaterial({ color: "#7b2fd6", roughness: 0.3 });
    const sofaCushion = new THREE.MeshStandardMaterial({ color: "#eca8d6", roughness: 0.5 });
    const chairColor1 = new THREE.MeshStandardMaterial({ color: "#67e8f9", roughness: 0.3, metalness: 0.1 });
    const chairColor2 = new THREE.MeshStandardMaterial({ color: "#ffd27a", roughness: 0.3, metalness: 0.1 });

    const pcScreenMaterial = new THREE.MeshBasicMaterial({ map: createScreenTexture("COSECHA", "CREATIVA", "#67e8f9") });
    const macScreenMaterial = new THREE.MeshBasicMaterial({ map: createScreenTexture("Cosecha", "Creativa", "#eca8d6") });
    const iphoneScreenMaterial = new THREE.MeshBasicMaterial({ map: createScreenTexture("APP", "MÓVIL", "#67e8f9", true) });
    const posterMaterial = new THREE.MeshBasicMaterial({ map: createPosterTexture("COSECHA CREATIVA", "#ffd27a") });

    // --- 4. ILUMINACIÓN MULTICOLOR ---
    scene.add(new THREE.AmbientLight("#ffffff", 0.2));

    const dirLight = new THREE.DirectionalLight("#ffffff", 0.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const neonOrange = new THREE.PointLight("#ffa54d", 30, 15);
    neonOrange.position.set(-5, 5, -5);
    scene.add(neonOrange);

    const neonCyan = new THREE.PointLight("#67e8f9", 25, 15);
    neonCyan.position.set(6, 4, 2);
    scene.add(neonCyan);

    const neonPink = new THREE.PointLight("#eca8d6", 25, 15);
    neonPink.position.set(-2, 6, 5);
    scene.add(neonPink);

    // --- 5. CONSTRUCCIÓN DE LA OFICINA ---
    const officeGroup = new THREE.Group();
    scene.add(officeGroup);

    // Suelo y Paredes
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    officeGroup.add(floor);

    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(40, 12, 0.5), wallMaterial);
    wall1.position.set(0, 6, -10);
    wall1.receiveShadow = true;
    officeGroup.add(wall1);

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 40), wallMaterial);
    wall2.position.set(-15, 6, 0);
    wall2.receiveShadow = true;
    officeGroup.add(wall2);

    // --- CONSTRUCTORES DE MOBILIARIO Y PROPS ---
    const createDesk = (x: number, z: number, rotY: number) => {
      const desk = new THREE.Group();
      const top = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 2.2), woodMaterial);
      top.position.y = 1.5;
      top.castShadow = true;
      top.receiveShadow = true;
      desk.add(top);

      const legGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
      const positions = [
        [-2.1, -1],
        [2.1, -1],
        [-2.1, 1],
        [2.1, 1],
      ];
      positions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeo, darkMetalMaterial);
        leg.position.set(pos[0], 0.75, pos[1]);
        leg.castShadow = true;
        desk.add(leg);
      });
      desk.position.set(x, 0, z);
      desk.rotation.y = rotY;
      officeGroup.add(desk);
      return desk;
    };

    const createPCSetup = (desk: THREE.Group) => {
      // Monitor
      const monitorBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.3), darkMetalMaterial);
      monitorBase.position.set(0, 1.55, -0.6);
      desk.add(monitorBase);
      const monitorStand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.05), darkMetalMaterial);
      monitorStand.position.set(0, 1.8, -0.65);
      desk.add(monitorStand);
      const monitorScreen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.05), darkMetalMaterial);
      monitorScreen.position.set(0, 2.1, -0.6);
      desk.add(monitorScreen);

      const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), pcScreenMaterial);
      screenGlow.position.set(0, 2.1, -0.57);
      desk.add(screenGlow);

      // Torre
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 1.4), darkMetalMaterial);
      tower.position.set(1.7, 0.6, -0.2);
      tower.castShadow = true;
      desk.add(tower);

      // IPHONE
      const iphone = new THREE.Group();
      const ipBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.35), darkMetalMaterial);
      const ipScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.33), iphoneScreenMaterial);
      ipScreen.rotation.x = -Math.PI / 2;
      ipScreen.position.y = 0.011;
      iphone.add(ipBody);
      iphone.add(ipScreen);
      iphone.position.set(-1.2, 1.56, 0);
      iphone.rotation.y = Math.PI / 6;
      desk.add(iphone);

      // CÁMARA DSLR
      const cameraDSLR = new THREE.Group();
      const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), darkMetalMaterial);
      camBody.position.y = 0.1;
      const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16), darkMetalMaterial);
      camLens.rotation.x = Math.PI / 2;
      camLens.position.set(0, 0.1, 0.15);
      cameraDSLR.add(camBody);
      cameraDSLR.add(camLens);
      cameraDSLR.position.set(-1.8, 1.55, -0.2);
      cameraDSLR.rotation.y = -Math.PI / 4;
      desk.add(cameraDSLR);
    };

    const createMacBook = (desk: THREE.Group) => {
      const macGroup = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.6), silverMetalMaterial);
      macGroup.add(base);
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.02), silverMetalMaterial);
      screen.position.set(0, 0.25, -0.3);
      screen.rotation.x = -0.2;
      macGroup.add(screen);
      const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.45), macScreenMaterial);
      screenGlow.position.set(0, 0.25, -0.28);
      screenGlow.rotation.x = -0.2;
      macGroup.add(screenGlow);

      macGroup.position.set(0, 1.55, 0);
      macGroup.rotation.y = Math.PI / 8;
      desk.add(macGroup);
    };

    // ARO DE LUZ / RING LIGHT
    let ringLightEmissive: THREE.MeshStandardMaterial;
    const createRingLight = (x: number, z: number) => {
      const ringGroup = new THREE.Group();
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 3), darkMetalMaterial);
      stand.position.y = 1.5;
      ringGroup.add(stand);
      const ringGeo = new THREE.TorusGeometry(0.35, 0.03, 16, 64);
      ringLightEmissive = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2 });
      const ring = new THREE.Mesh(ringGeo, ringLightEmissive);
      ring.position.y = 3.2;
      ringGroup.add(ring);

      const centerLight = new THREE.PointLight("#ffffff", 2, 5);
      centerLight.position.y = 3.2;
      ringGroup.add(centerLight);

      ringGroup.position.set(x, 0, z);
      ringGroup.rotation.y = Math.PI / 4;
      officeGroup.add(ringGroup);
    };

    // PROYECTOR Y HAZ DE LUZ
    const createProjector = () => {
      const projGroup = new THREE.Group();
      const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), darkMetalMaterial);
      mount.position.y = 5.75;
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.4), silverMetalMaterial);
      body.position.y = 5.4;
      projGroup.add(mount);
      projGroup.add(body);

      projGroup.position.set(0, 0, 2);
      officeGroup.add(projGroup);
      return null;
    };

    // --- CONSTRUCTORES DE SILLAS Y SOFÁS ---
    const createChair = (x: number, z: number, rotY: number, material: THREE.Material) => {
      const chair = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), material);
      seat.position.y = 0.8;
      seat.castShadow = true;
      chair.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.15), material);
      back.position.set(0, 1.4, -0.5);
      back.castShadow = true;
      chair.add(back);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), darkMetalMaterial);
      stem.position.y = 0.4;
      chair.add(stem);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 5), darkMetalMaterial);
      base.position.y = 0.05;
      chair.add(base);

      chair.position.set(x, 0, z);
      chair.rotation.y = rotY;
      officeGroup.add(chair);
    };

    const createSofa = (x: number, z: number, rotY: number) => {
      const sofa = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 1.5), sofaColor);
      base.position.y = 0.2;
      base.castShadow = true;
      sofa.add(base);

      const seat1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.3), sofaCushion);
      seat1.position.set(-0.95, 0.5, 0.1);
      seat1.castShadow = true;
      sofa.add(seat1);

      const seat2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 1.3), sofaCushion);
      seat2.position.set(0.95, 0.5, 0.1);
      seat2.castShadow = true;
      sofa.add(seat2);

      const back = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.4), sofaColor);
      back.position.set(0, 1.0, -0.55);
      back.castShadow = true;
      sofa.add(back);

      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 1.5), sofaColor);
      arm1.position.set(-1.8, 0.8, 0);
      arm1.castShadow = true;
      sofa.add(arm1);

      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 1.5), sofaColor);
      arm2.position.set(1.8, 0.8, 0);
      arm2.castShadow = true;
      sofa.add(arm2);

      sofa.position.set(x, 0, z);
      sofa.rotation.y = rotY;
      officeGroup.add(sofa);
    };

    const mainDesk = createDesk(2, 0, 0);
    createPCSetup(mainDesk);

    const sideDesk = createDesk(-6, -2, Math.PI / 2.5);
    createMacBook(sideDesk);

    createRingLight(-4, -4);
    const projectorBeam = createProjector();

    // Agregamos el mobiliario vibrante a la escena
    createChair(2, 1.5, Math.PI, chairColor1);
    createChair(-4.5, -1, Math.PI / 1.5, chairColor2);

    // Sala de Espera
    createSofa(-8, 5, Math.PI / 2);
    createSofa(-4, 9, Math.PI);

    // Plantas low poly
    const createPlant = (x: number, z: number) => {
      const plantGroup = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.8, 16), silverMetalMaterial);
      pot.position.y = 0.4;
      pot.castShadow = true;
      plantGroup.add(pot);
      const leafMat = new THREE.MeshStandardMaterial({ color: "#5ef3c8", flatShading: true });
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), leafMat);
        leaf.position.set((Math.random() - 0.5) * 0.5, 0.8 + Math.random() * 0.8, (Math.random() - 0.5) * 0.5);
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        leaf.castShadow = true;
        plantGroup.add(leaf);
      }
      plantGroup.position.set(x, 0, z);
      officeGroup.add(plantGroup);
    };
    createPlant(-8, -6);
    createPlant(6, -8);
    createPlant(-3, 6);

    // Afiche principal proyectado en la pared
    const signGroup = new THREE.Group();
    const signBg = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 0.1), darkMetalMaterial);
    const signGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 1.8), posterMaterial);
    signGlow.position.z = 0.06;
    signGroup.add(signBg);
    signGroup.add(signGlow);
    signGroup.position.set(0, 5.4, -9.9);
    officeGroup.add(signGroup);

    // --- 6. TRAYECTORIAS DE CÁMARA (VINCULADAS AL SCROLL DE LA SECCIÓN) ---
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 6, 12),
      new THREE.Vector3(-3, 3.5, 6),
      new THREE.Vector3(2, 3, 2),      // Mirando Desk PC, Cámara y iPhone
      new THREE.Vector3(-4, 2.5, -1),  // Rodeando el Aro de luz y la Mac
      new THREE.Vector3(0, 3.5, -4),   // Pasando BAJO el haz del proyector
      new THREE.Vector3(6, 5, 8),
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, 2, -4),
      new THREE.Vector3(2, 1.8, 0),    // Target PC/iPhone
      new THREE.Vector3(-6, 2, -2),    // Target Mac/Aro Luz
      new THREE.Vector3(0, 5.4, -10),  // Target Proyección
      new THREE.Vector3(-3, 3, -3),
    ]);

    // --- 7. BUCLE DE ANIMACIÓN ---
    const clock = new THREE.Clock();
    const vectorDestino = new THREE.Vector3();
    const lookAtDestino = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 3, 0);
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Animaciones constantes
      if (ringLightEmissive) {
        ringLightEmissive.emissiveIntensity = 2 + Math.sin(time * 5) * 0.5 + Math.random() * 0.2;
      }

      // Lógica de scroll interpolada
      const scrollVal = Math.max(0, Math.min(1, scrollProgress.current));
      cameraPath.getPointAt(scrollVal, vectorDestino);
      targetPath.getPointAt(scrollVal, lookAtDestino);

      // Movimiento Idle + Mouse Parallax
      const mouseX = mousePosition.current.x * 0.35;
      const mouseY = mousePosition.current.y * 0.25;

      vectorDestino.x += Math.sin(time * 0.6) * 0.15 + mouseX;
      vectorDestino.y += Math.cos(time * 0.4) * 0.1 + mouseY;

      // Interpolación suave
      camera.position.lerp(vectorDestino, 0.038);
      currentLookAt.lerp(lookAtDestino, 0.048);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePosition.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // VINCULAR SCROLL LOCAL DE LA SECCIÓN
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // La animación empieza cuando la sección asoma por abajo de la pantalla
      // Y termina cuando la sección se retira por el tope de la pantalla
      const totalScrollableDist = viewHeight + rect.height;
      const currentScrollPos = viewHeight - rect.top;

      const progress = Math.max(0, Math.min(1, currentScrollPos / totalScrollableDist));
      scrollProgress.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 bg-[#050508]/40"
    >
      {/* Fondo digital e iluminación ambiental */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(161,0,242,0.04),transparent_75%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:56px_56px]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* PANEL IZQUIERDO: Contenido explicativo e interactivo */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-4">
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#eca8d6]/80"
              >
                La Usina de Cosecha
              </motion.span>
              <motion.h2
                initial={reduce ? false : { opacity: 0, y: 15 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: easePremium }}
                className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
              >
                Diseño, estrategia y <span className="bg-gradient-to-r from-[#67e8f9] via-[#eca8d6] to-[#ffd27a] bg-clip-text text-transparent">código</span>
              </motion.h2>
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                whileInView={reduce ? undefined : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="text-base leading-relaxed text-white/60"
              >
                Nuestra oficina no es solo un espacio físico; es el entorno donde convergen nuestras disciplinas. Diseñamos sistemas interactivos complejos, producimos contenidos multimedia premium y delineamos estrategias de crecimiento digital con una visión integradora y local.
              </motion.p>
            </div>

            {/* Ficha técnica y estadísticas rápidas */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4.5"
              >
                <div className="flex items-center gap-2 text-[#67e8f9]">
                  <span className="font-display text-xs font-medium uppercase tracking-wider">Estudio</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">Full-Stack</p>
                <p className="mt-1 text-2xs text-white/45">Interfaces y sistemas complejos</p>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4.5"
              >
                <div className="flex items-center gap-2 text-[#eca8d6]">
                  <span className="font-display text-xs font-medium uppercase tracking-wider">Cultura</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">Co-Working</p>
                <p className="mt-1 text-2xs text-white/45">Fusión creativa sin silos</p>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4.5"
              >
                <div className="flex items-center gap-2 text-[#ffd27a]">
                  <span className="font-display text-xs font-medium uppercase tracking-wider">Medios</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">Multimedia</p>
                <p className="mt-1 text-2xs text-white/45">Cámaras, luces, dirección</p>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4.5"
              >
                <div className="flex items-center gap-2 text-[#ffa54d]">
                  <span className="font-display text-xs font-medium uppercase tracking-wider">Metas</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">Tracción</p>
                <p className="mt-1 text-2xs text-white/45">Estrategia orientada a ROI</p>
              </motion.div>
            </div>
          </div>

          {/* PANEL DERECHO: Canvas 3D de la Oficina de Agencia */}
          <div className="relative aspect-square w-full lg:col-span-7">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Resplandor radial de fondo */}
              <div className="absolute h-[90%] w-[90%] rounded-full bg-gradient-to-tr from-[#eca8d6]/8 via-[#67e8f9]/6 to-transparent blur-3xl pointer-events-none" />
              
              {/* Canvas 3D - Siempre renderizado para asegurar inicialización de la ref en el useEffect */}
              <div
                ref={mountRef}
                className={`absolute inset-0 h-full w-full pointer-events-auto rounded-2xl overflow-hidden border border-white/10 bg-[#101018] shadow-[0_32px_90px_-40px_rgba(0,0,0,0.85)] transition-opacity duration-1000 ${
                  webGLSupported ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />

              {/* Fallback si no hay soporte WebGL */}
              {!webGLSupported && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md">
                  <h3 className="font-display text-lg font-semibold text-[#eca8d6]">Estudio Digital 3D</h3>
                  <p className="mt-2 text-xs text-white/55">
                    Utilizamos simulaciones espaciales en 3D para modelar nuestra oficina de co-working creativa. Activa la aceleración por hardware para experimentarla en tiempo real.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
