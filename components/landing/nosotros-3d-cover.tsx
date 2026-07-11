"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Nosotros3dCover() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [webGLSupported, setWebGLSupported] = useState(false);

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

    if (!hasWebGL()) {
      return;
    }
    setWebGLSupported(true);

    if (!mountRef.current) return;

    // --- 1. CONFIGURACIÓN BÁSICA ---
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;

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

      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 1.4), darkMetalMaterial);
      tower.position.set(1.7, 0.6, -0.2);
      tower.castShadow = true;
      desk.add(tower);

      const iphone = new THREE.Group();
      const ipBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.35), darkMetalMaterial);
      const ipScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.33), iphoneScreenMaterial);
      ipScreen.rotation.x = -Math.PI / 2;
      ipScreen.position.y = 0.011;
      iphone.add(ipBody, ipScreen);
      iphone.position.set(-1.2, 1.56, 0);
      iphone.rotation.y = Math.PI / 6;
      desk.add(iphone);

      const cameraDSLR = new THREE.Group();
      const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), darkMetalMaterial);
      camBody.position.y = 0.1;
      const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16), darkMetalMaterial);
      camLens.rotation.x = Math.PI / 2;
      camLens.position.set(0, 0.1, 0.15);
      cameraDSLR.add(camBody, camLens);
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

    let ringLightEmissive: THREE.MeshStandardMaterial;
    const createRingLight = (x: number, z: number) => {
      const ringGroup = new THREE.Group();
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 3), darkMetalMaterial);
      stand.position.y = 1.5;
      ringGroup.add(stand);
      const ringGeo = new THREE.TorusGeometry(0.35, 0.03, 16, 64);
      ringLightEmissive = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 2,
      });
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

    createChair(2, 1.5, Math.PI, chairColor1);
    createChair(-4.5, -1, Math.PI / 1.5, chairColor2);

    createSofa(-8, 5, Math.PI / 2);
    createSofa(-4, 9, Math.PI);

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

    const signGroup = new THREE.Group();
    const signBg = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 0.1), darkMetalMaterial);
    const signGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 1.8), posterMaterial);
    signGlow.position.z = 0.06;
    signGroup.add(signBg, signGlow);
    signGroup.position.set(0, 5.4, -9.9);
    officeGroup.add(signGroup);

    // --- 6. TRAYECTORIAS DE CÁMARA VINCULADAS AL SCROLL ---
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 6, 12),
      new THREE.Vector3(-3, 3.5, 6),
      new THREE.Vector3(2, 3, 2),
      new THREE.Vector3(-4, 2.5, -1),
      new THREE.Vector3(0, 3.5, -4),
      new THREE.Vector3(6, 5, 8),
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, 2, -4),
      new THREE.Vector3(2, 1.8, 0),
      new THREE.Vector3(-6, 2, -2),
      new THREE.Vector3(0, 5.4, -10),
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

      if (ringLightEmissive) {
        ringLightEmissive.emissiveIntensity = 2 + Math.sin(time * 5) * 0.5 + Math.random() * 0.2;
      }

      // Lógica de scroll basada en la posición de scroll de la ventana
      const scrollVal = Math.max(0, Math.min(1, scrollProgress.current));
      cameraPath.getPointAt(scrollVal, vectorDestino);
      targetPath.getPointAt(scrollVal, lookAtDestino);

      // Movimiento Idle (respiración suave de la cámara)
      vectorDestino.x += Math.sin(time * 0.6) * 0.12;
      vectorDestino.y += Math.cos(time * 0.4) * 0.08;

      // Interpolación
      camera.position.lerp(vectorDestino, 0.035);
      currentLookAt.lerp(lookAtDestino, 0.045);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // VINCULAR AL SCROLL DE LA PÁGINA GLOBAL
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = docHeight > 0 ? scrollY / docHeight : 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // AJUSTAR REDIMENSIONADO DE FORMA SEGURA DENTRO DE LA TARJETA
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 z-0 w-full h-full overflow-hidden select-none bg-[#101018] transition-opacity duration-1000 ${
        webGLSupported ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Contenedor del Canvas siempre renderizado para asegurar inicialización de ref en useEffect */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
