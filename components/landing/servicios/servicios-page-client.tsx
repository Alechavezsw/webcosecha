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
  ArrowRight, 
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
  Globe,
  Palette,
  Eye,
  ShoppingBag,
  Zap,
  Users,
  Cloud,
  Calendar
} from 'lucide-react';
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";

// Estructura de datos de los 12 servicios (Incluyendo Compol, Nube y Eventos)
const SERVICES_DATA = [
  {
    id: 0,
    title: "Estrategia 360°",
    category: "Consultoría y Planificación",
    description: "Sincronizamos todos tus canales digitales para potenciar tu marca, captar leads calificados y asegurar el crecimiento sostenible de tu negocio.",
    route: "/servicios/consultoria-estrategica",
    color: "#ff2a6d", // Carmesí
    icon: Target
  },
  {
    id: 1,
    title: "Diseño Web Corporativo",
    category: "Desarrollo y UX/UI",
    description: "Desarrollamos sitios web y aplicaciones web a medida con ultra velocidad de carga, diseño premium adaptado a tu identidad y optimización SEO nativa.",
    route: "/servicios/diseno-web",
    color: "#8b5cf6", // Violeta
    icon: Globe
  },
  {
    id: 2,
    title: "Diseño Gráfico & Branding",
    category: "Identidad de Marca",
    description: "Construimos identidades de marca memorables, logofolios premium, manuales de marca y sistemas visuales profesionales para destacar en tu industria.",
    route: "/servicios/diseno-grafico",
    color: "#f59e0b", // Ámbar
    icon: Palette
  },
  {
    id: 3,
    title: "Publicidad Paga (Paid Ads)",
    category: "Performance y ROI",
    description: "Multiplicamos tus ventas y el retorno de tu inversión mediante campañas hiper-segmentadas en Meta Ads (Instagram/Facebook), Google Ads y LinkedIn B2B.",
    route: "/servicios/publicidad-paga-en-redes",
    color: "#00f3ff", // Cian
    icon: Megaphone
  },
  {
    id: 4,
    title: "Posicionamiento SEO",
    category: "Tráfico Orgánico",
    description: "Llevamos tu sitio web a los primeros puestos de Google de forma orgánica, atrayendo clientes calificados de manera constante y sostenible.",
    route: "/servicios/seo",
    color: "#10b981", // Verde Esmeralda
    icon: Search
  },
  {
    id: 5,
    title: "Gestión de Redes Sociales",
    category: "Comunidad y Engagement",
    description: "Planificamos y gestionamos tus redes con contenido dinámico, diseño atractivo y copys persuasivos para conectar con tu comunidad y fidelizar clientes.",
    route: "/servicios/gestion-de-redes-sociales",
    color: "#ff4b91", // Rosa Coral
    icon: Layers
  },
  {
    id: 6,
    title: "Inteligencia Artificial (IA)",
    category: "Automatización",
    description: "Desarrollamos e integramos agentes inteligentes y chats conversacionales avanzados a medida para automatizar la captación y atención al cliente de tu negocio.",
    route: "/servicios/ia",
    color: "#fbbf24", // Amarillo Eléctrico
    icon: Zap
  },
  {
    id: 7,
    title: "Producción Audiovisual",
    category: "Foto y Video",
    description: "Producimos videos corporativos cinematográficos, reels dinámicos y fotografía profesional en terreno para proyectar el verdadero valor y tamaño de tu empresa.",
    route: "/servicios/foto-y-video",
    color: "#00d2ff", // Azul Hielo
    icon: Eye
  },
  {
    id: 8,
    title: "E-commerce & Tiendas",
    category: "Negocio Digital",
    description: "Creamos tiendas virtuales fluidas y automatizadas con pasarelas de pago integradas, control de inventario y optimización orientada a la venta directa.",
    route: "/servicios/ecommerce",
    color: "#6366f1", // Índigo
    icon: ShoppingBag
  },
  {
    id: 9,
    title: "Comunicación Política (Compol)",
    category: "Estrategia Electoral",
    description: "Diseñamos campañas de comunicación política de alta precisión, analizando datos electorales y gestionando la reputación digital de candidatos y gobiernos.",
    route: "/compol",
    color: "#ef4444", // Rojo Presidencial
    icon: Users
  },
  {
    id: 10,
    title: "Infraestructura & Cloud",
    category: "Servicios en la Nube",
    description: "Migramos, estructuramos y gestionamos tu infraestructura de servidores en la nube (AWS/Google Cloud) para garantizar velocidad, seguridad y escalabilidad ilimitada.",
    route: "/nube",
    color: "#06b6d4", // Cian Claro
    icon: Cloud
  },
  {
    id: 11,
    title: "Producción de Eventos",
    category: "Experiencias Corporativas",
    description: "Producimos eventos corporativos e institucionales de alto impacto, combinando diseño visual inmersivo, sonido premium y logística impecable.",
    route: "/servicios/eventos",
    color: "#ec4899", // Rosa Fuerte
    icon: Calendar
  }
];

export function ServiciosPageClient() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);

  // Form states for the Contact Card (Section 12)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Estrategia 360°');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  const handleRestart = () => {
    const scrollEl = document.getElementById('bosque-scroll');
    if (scrollEl) {
      scrollEl.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // --- 1. CONFIGURACIÓN BÁSICA DE THREE.JS ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020104');
    scene.fog = new THREE.FogExp2('#020104', 0.02); // Niebla misteriosa

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 190);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Post-procesado con Bloom cinematográfico: hace estallar luces, hojas y criaturas
    // bioluminiscentes (solo desktop para cuidar GPUs móviles)
    let composer: EffectComposer | null = null;
    if (window.innerWidth >= 768) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.55,  // strength: realza el neón del bosque sin lavar las cards
        0.75,  // radius
        0.72   // threshold
      ));
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

    const createFireflyTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(235, 255, 120, 1.0)'); // Centro brillante verde-amarillo
      gradient.addColorStop(0.25, 'rgba(180, 255, 80, 0.85)'); // Aura verde-amarilla media
      gradient.addColorStop(0.55, 'rgba(100, 240, 50, 0.35)');  // Borde externo verde brillante suave
      gradient.addColorStop(1, 'rgba(100, 240, 50, 0)');      // Transparente total
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    // Ala ANTERIOR (forewing) de monarca: triangular, barrida hacia adelante, con ápice negro
    // y banda de manchas claras. Base abajo-izquierda (tórax), ápice arriba-derecha.
    const createMonarchForewingTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      ctx.clearRect(0, 0, 256, 256);

      const traceOutline = () => {
        ctx.beginPath();
        ctx.moveTo(14, 206);
        ctx.bezierCurveTo(30, 158, 96, 84, 196, 38);    // margen costal (borde de ataque)
        ctx.bezierCurveTo(220, 27, 242, 28, 240, 52);   // ápice redondeado
        ctx.bezierCurveTo(238, 84, 216, 132, 186, 172); // termen cóncavo
        ctx.bezierCurveTo(166, 197, 124, 216, 84, 222); // hacia el tornus
        ctx.bezierCurveTo(52, 226, 22, 220, 14, 206);   // margen interno
        ctx.closePath();
      };

      ctx.save();
      traceOutline();
      ctx.clip();

      const grad = ctx.createLinearGradient(20, 210, 235, 55);
      grad.addColorStop(0, '#9c3c08');
      grad.addColorStop(0.25, '#e25822');
      grad.addColorStop(0.55, '#ff8c00');
      grad.addColorStop(1, '#ffa432');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      // Venación real: celda discal alargada y venas radiando hacia ápice y termen
      ctx.strokeStyle = '#170f08';
      ctx.lineCap = 'round';
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

      // Zona apical negra con la banda diagonal de manchas claras de la monarca
      ctx.fillStyle = '#15100b';
      ctx.beginPath();
      ctx.moveTo(148, 60);
      ctx.bezierCurveTo(178, 76, 196, 104, 192, 150);
      ctx.lineTo(232, 178);
      ctx.lineTo(256, 40);
      ctx.lineTo(196, 0);
      ctx.lineTo(120, 36);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffc46b';
      const apicalSpots: Array<[number, number, number, number, number]> = [
        [170, 78, 11, 6.5, -0.65], [190, 64, 10, 6, -0.7], [210, 52, 8.5, 5, -0.75],
        [186, 110, 9, 5.5, -0.4], [202, 92, 8, 5, -0.55], [218, 76, 6.5, 4, -0.7]
      ];
      apicalSpots.forEach(([x, y, rx, ry, rot]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
        ctx.fill();
      });

      // Margen negro grueso (el clip deja visible solo la banda interior)
      traceOutline();
      ctx.strokeStyle = '#15100b';
      ctx.lineWidth = 26;
      ctx.stroke();

      const baseShadow = ctx.createRadialGradient(18, 206, 4, 18, 206, 58);
      baseShadow.addColorStop(0, 'rgba(18,10,5,0.9)');
      baseShadow.addColorStop(1, 'rgba(18,10,5,0)');
      ctx.fillStyle = baseShadow;
      ctx.fillRect(0, 0, 256, 256);

      // Doble hilera de puntitos blancos dentro de la banda marginal
      ctx.fillStyle = '#fbf4e4';
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
    };

    // Ala POSTERIOR (hindwing) de monarca: abanico redondeado que se abre hacia atrás-afuera
    const createMonarchHindwingTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
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
      grad.addColorStop(0, '#a84410');
      grad.addColorStop(0.3, '#ec6c12');
      grad.addColorStop(0.7, '#ff9322');
      grad.addColorStop(1, '#ffab3c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      ctx.strokeStyle = '#170f08';
      ctx.lineCap = 'round';
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

      // Mancha androconial del macho sobre la vena central
      ctx.fillStyle = '#15100b';
      ctx.beginPath();
      ctx.ellipse(118, 152, 8, 5, -0.5, 0, Math.PI * 2);
      ctx.fill();

      traceOutline();
      ctx.strokeStyle = '#15100b';
      ctx.lineWidth = 24;
      ctx.stroke();

      const baseShadow = ctx.createRadialGradient(24, 64, 6, 24, 64, 70);
      baseShadow.addColorStop(0, 'rgba(18,10,5,0.95)');
      baseShadow.addColorStop(1, 'rgba(18,10,5,0)');
      ctx.fillStyle = baseShadow;
      ctx.fillRect(0, 0, 256, 256);

      ctx.fillStyle = '#fbf4e4';
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
    };

    // Luna llena con cráteres y halo etéreo
    const createMoonTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 250, 236, 1.0)');
      gradient.addColorStop(0.30, 'rgba(235, 238, 255, 0.95)');
      gradient.addColorStop(0.40, 'rgba(190, 205, 255, 0.30)');
      gradient.addColorStop(0.70, 'rgba(170, 190, 255, 0.10)');
      gradient.addColorStop(1, 'rgba(170, 190, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#9aa6cc';
      const craters = [
        { x: 56, y: 52, r: 7 }, { x: 73, y: 66, r: 5 }, { x: 60, y: 76, r: 3.5 },
        { x: 76, y: 50, r: 4 }, { x: 48, y: 66, r: 3 }
      ];
      craters.forEach(c => { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      return new THREE.CanvasTexture(canvas);
    };

    // Estela de estrella fugaz: cola tenue a la izquierda, cabeza brillante a la derecha
    const createStreakTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 8;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      const gradient = ctx.createLinearGradient(0, 0, 128, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.55, 'rgba(190, 215, 255, 0.35)');
      gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 8);
      return new THREE.CanvasTexture(canvas);
    };

    // --- 3. MATERIALES COMUNES ---
    const troncoMaterial = new THREE.MeshStandardMaterial({ 
      color: '#0e0b0e', 
      roughness: 0.9, 
      metalness: 0.1
    });

    scene.add(new THREE.AmbientLight('#ffb3c6', 0.02));
    
    // Luces principales del bosque
    const dirLight1 = new THREE.DirectionalLight('#ffffff', 0.25);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);
    
    const dirLight2 = new THREE.DirectionalLight('#00f0ff', 0.1);
    dirLight2.position.set(-10, 20, -10);
    scene.add(dirLight2);

    // --- 3.5. CIELO NOCTURNO VIVO (cúpula shader: estrellas + vía láctea + aurora) ---
    const skyGeom = new THREE.SphereGeometry(150, 32, 24);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vDir;

        float hash21(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec3 d = normalize(vDir);
          float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);

          // Degradado de noche profunda: horizonte violeta-rosado del bosque neón a cénit negro
          vec3 col = mix(vec3(0.10, 0.03, 0.12), vec3(0.045, 0.018, 0.075), smoothstep(0.0, 0.25, h));
          col = mix(col, vec3(0.012, 0.006, 0.03), smoothstep(0.25, 0.6, h));
          col = mix(col, vec3(0.004, 0.002, 0.012), smoothstep(0.6, 1.0, h));

          // Banda de vía láctea diagonal, tenue y granulada
          float band = exp(-pow((d.x * 0.8 + d.y - 0.55) * 2.6, 2.0));
          float grain = hash21(floor(d.xz * 240.0 + d.y * 90.0));
          col += vec3(0.10, 0.085, 0.14) * band * (0.4 + 0.6 * grain) * smoothstep(0.05, 0.3, d.y);

          // Estrellas titilantes
          float starMask = smoothstep(0.02, 0.22, d.y);
          vec2 sp = d.xz / (d.y + 0.65);
          vec2 grid = sp * 110.0;
          vec2 cell = floor(grid);
          float r = hash21(cell);
          if (r > 0.988 && starMask > 0.001) {
            vec2 f = fract(grid) - 0.5;
            float core = 1.0 - smoothstep(0.05, 0.32, length(f));
            float twk = 0.55 + 0.45 * sin(uTime * (1.5 + hash21(cell + 3.7) * 3.5) + hash21(cell * 1.93) * 6.2831);
            col += vec3(0.85, 0.92, 1.0) * core * twk * starMask;
          }

          // Aurora boreal ondulante (verde esmeralda a violeta, paleta del bosque)
          float aurBand = smoothstep(0.18, 0.40, h) * (1.0 - smoothstep(0.55, 0.9, h));
          float wave = sin(d.x * 5.0 + uTime * 0.22 + sin(d.z * 3.0 + uTime * 0.15) * 1.8);
          float wave2 = sin(d.x * 9.0 - uTime * 0.17 + d.z * 4.0);
          float aur = max(0.0, wave * 0.7 + wave2 * 0.3) * aurBand;
          vec3 aurCol = mix(vec3(0.15, 0.85, 0.55), vec3(0.55, 0.30, 0.95), 0.5 + 0.5 * sin(uTime * 0.08 + d.x * 2.0));
          col += aurCol * aur * 0.11;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });
    const skyMesh = new THREE.Mesh(skyGeom, skyMat);
    skyMesh.renderOrder = -2;
    skyMesh.frustumCulled = false;
    scene.add(skyMesh);

    // Luna acompañando el vuelo (sprite a distancia fija de la cámara)
    const moonTex = createMoonTexture();
    const moonMat = new THREE.SpriteMaterial({
      map: moonTex,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false
    });
    const moonSprite = new THREE.Sprite(moonMat);
    moonSprite.scale.set(22, 22, 1);
    scene.add(moonSprite);
    const moonDirVec = new THREE.Vector3(-0.42, 0.55, -0.72).normalize();

    // Pool de estrellas fugaces reutilizables
    const streakTex = createStreakTexture();
    const shootingStars: THREE.Sprite[] = [];
    for (let i = 0; i < 3; i++) {
      const starMat = new THREE.SpriteMaterial({
        map: streakTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false
      });
      const star = new THREE.Sprite(starMat);
      star.scale.set(13, 0.55, 1);
      star.visible = false;
      star.userData = {
        active: false,
        nextAt: 3 + Math.random() * 6,
        life: 0,
        maxLife: 1.3,
        vel: new THREE.Vector3()
      };
      scene.add(star);
      shootingStars.push(star);
    }

    // --- 4. TERRENO DEL BOSQUE ---
    const groundGeo = new THREE.PlaneGeometry(120, 300, 128, 128);
    const pos = groundGeo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2.2;
      z += Math.sin(x * 0.5) * Math.cos(y * 0.3) * 0.5;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({ 
      color: '#030206', 
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -75; // Centrado en el bosque más profundo
    ground.receiveShadow = true;
    scene.add(ground);

    // --- 5. PARTÍCULAS AMBIENTALES (Esporas del bosque) ---
    const forestParticlesGeo = new THREE.BufferGeometry();
    const particleCount = 1200;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 85;
      particlePositions[i * 3 + 1] = Math.random() * 15;
      particlePositions[i * 3 + 2] = -Math.random() * 240 + 20;
    }

    forestParticlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const fireflyTex = createFireflyTexture();
    const forestParticlesMat = new THREE.PointsMaterial({
      size: 0.65,      // Tamaño más discreto y sutil
      color: '#d4ff55', // Hermosa tonalidad verde-amarilla luciérnaga clásica
      map: fireflyTex || undefined,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const forestParticles = new THREE.Points(forestParticlesGeo, forestParticlesMat);
    scene.add(forestParticles);

    // Altura del terreno (misma fórmula que la deformación del plano)
    const terrainHeightAt = (x: number, z: number): number => {
      let y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2.2;
      y += Math.sin(x * 0.5) * Math.cos(z * 0.3) * 0.5;
      return y;
    };

    // --- 5.2. SENDERO DE POLEN DORADO (guía luminosa del vuelo entre los árboles) ---
    const trailCount = 420;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount; i++) {
      const t = i / trailCount;
      const z = 18 - t * 216; // De la entrada al árbol gigante
      const x = Math.sin(z * 0.08) * 1.6 + (Math.random() - 0.5) * 1.7;
      trailPositions[i * 3] = x;
      trailPositions[i * 3 + 1] = terrainHeightAt(x, z) + 0.18 + Math.random() * 0.35;
      trailPositions[i * 3 + 2] = z;
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      size: 0.34,
      color: '#ffd27a',
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pollenTrail = new THREE.Points(trailGeo, trailMat);
    scene.add(pollenTrail);

    // --- 5.5. HONGOS BIOLUMINISCENTES (vida mágica al ras del suelo) ---
    const mushroomPalette = ['#00f3ff', '#a78bfa', '#ff4b91', '#34d399'];
    const mushroomMats = mushroomPalette.map(col => new THREE.MeshStandardMaterial({
      color: '#1a1320',
      emissive: new THREE.Color(col),
      emissiveIntensity: 1.6,
      roughness: 0.4
    }));
    const mushroomStemMat = new THREE.MeshStandardMaterial({ color: '#262033', roughness: 0.9 });
    const capGeo = new THREE.SphereGeometry(0.16, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    const stemGeo = new THREE.CylinderGeometry(0.035, 0.05, 0.22, 6);
    stemGeo.translate(0, 0.11, 0);

    for (let i = 0; i < 42; i++) {
      const z = 12 - Math.random() * 200;
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (2.2 + Math.random() * 6.5);
      const y = terrainHeightAt(x, z);

      const cluster = new THREE.Group();
      cluster.position.set(x, y, z);
      const numShrooms = 1 + Math.floor(Math.random() * 3);
      const mat = mushroomMats[Math.floor(Math.random() * mushroomMats.length)];
      for (let m = 0; m < numShrooms; m++) {
        const shroom = new THREE.Group();
        const stem = new THREE.Mesh(stemGeo, mushroomStemMat);
        const cap = new THREE.Mesh(capGeo, mat);
        cap.position.y = 0.2;
        cap.scale.set(1, 0.75, 1);
        shroom.add(stem, cap);
        const s = 0.5 + Math.random() * 0.9;
        shroom.scale.set(s, s, s);
        shroom.position.set((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5);
        shroom.rotation.z = (Math.random() - 0.5) * 0.3;
        cluster.add(shroom);
      }
      scene.add(cluster);
    }

    // --- 6. CONEJOS CIBERNÉTICOS BIOLUMINISCENTES (Hopping fauna) ---
    const createCyberRabbit = (colorHex: string): THREE.Group => {
      const rabbit = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 1.8,
        roughness: 0.1,
        metalness: 0.9
      });
      
      // Cuerpo elipsoidal
      const bodyGeo = new THREE.SphereGeometry(0.18, 8, 8);
      bodyGeo.scale(1.4, 1, 1);
      const body = new THREE.Mesh(bodyGeo, material);
      body.position.y = 0.18;
      rabbit.add(body);
      
      // Cabeza
      const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const head = new THREE.Mesh(headGeo, material);
      head.position.set(0.18, 0.32, 0);
      rabbit.add(head);
      
      // Orejas largas
      const earGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 4);
      earGeo.translate(0, 0.09, 0);
      
      const leftEar = new THREE.Mesh(earGeo, material);
      leftEar.position.set(0.14, 0.38, -0.04);
      leftEar.rotation.z = -0.35;
      leftEar.rotation.x = -0.15;
      rabbit.add(leftEar);
      
      const rightEar = new THREE.Mesh(earGeo, material);
      rightEar.position.set(0.14, 0.38, 0.04);
      rightEar.rotation.z = -0.35;
      rightEar.rotation.x = 0.15;
      rabbit.add(rightEar);
      
      // Cola pequeña
      const tailGeo = new THREE.SphereGeometry(0.04, 4, 4);
      const tail = new THREE.Mesh(tailGeo, material);
      tail.position.set(-0.2, 0.2, 0);
      rabbit.add(tail);
      
      return rabbit;
    };

    const conejos: THREE.Group[] = [];
    const rabbitColors = ['#ff2a6d', '#00f3ff', '#a78bfa', '#fbbf24', '#ef4444', '#ec4899'];
    
    for (let i = 0; i < 6; i++) {
      const rabbit = createCyberRabbit(rabbitColors[i % rabbitColors.length]);
      rabbit.position.set(
        (Math.random() - 0.5) * 20,
        0,
        -180 + i * 32 // Distribuidos a lo largo de todo el bosque expandido
      );
      const sc = Math.random() * 0.3 + 0.7;
      rabbit.scale.set(sc, sc, sc);
      
      rabbit.userData = {
        speed: Math.random() * 0.035 + 0.05,
        hopSpeed: Math.random() * 1.5 + 4.5,
        hopOffset: Math.random() * Math.PI * 2,
        baseX: rabbit.position.x
      };
      
      scene.add(rabbit);
      conejos.push(rabbit);
    }

    // --- 6.5. MARIPOSAS MÁGICAS GLOWING ---
    const butterfliesGroup = new THREE.Group();
    scene.add(butterfliesGroup);

    // Texturas anatómicas de monarca (ala anterior + posterior)
    const monarchForeTex = createMonarchForewingTexture();
    const monarchHindTex = createMonarchHindwingTexture();

    // Alas horizontales (plano XZ) con pivote en la raíz: el aleteo rota alrededor
    // del eje del cuerpo, como en una mariposa real
    const bForeGeom = new THREE.PlaneGeometry(0.42, 0.36);
    bForeGeom.rotateX(-Math.PI / 2);
    bForeGeom.translate(0.21, 0.004, -0.07);
    const bHindGeom = new THREE.PlaneGeometry(0.34, 0.34);
    bHindGeom.rotateX(-Math.PI / 2);
    bHindGeom.translate(0.155, -0.004, 0.07);

    // Cuerpo realista: tórax adelante grueso, abdomen afinándose hacia atrás
    const bBodyGeom = new THREE.CylinderGeometry(0.012, 0.02, 0.3, 6);
    bBodyGeom.rotateX(Math.PI / 2);
    const bBodyMat = new THREE.MeshStandardMaterial({ color: 0x0a0705, roughness: 0.95 });
    const bHeadGeom = new THREE.SphereGeometry(0.024, 8, 8);

    // Halos de luz de hada
    const bHaloTex = createFireflyTexture();
    const bHaloGeom = new THREE.PlaneGeometry(0.85, 0.85);
    const bHaloMat = new THREE.MeshBasicMaterial({
      map: bHaloTex || undefined,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    // Variantes cromáticas: cada una con material de ala anterior y posterior
    const mkWingMat = (tex: THREE.Texture, tint: number | null, emissiveCol: number) =>
      new THREE.MeshStandardMaterial({
        map: tex,
        color: tint !== null ? new THREE.Color(tint) : new THREE.Color(0xffffff),
        emissive: new THREE.Color(emissiveCol),
        emissiveMap: tex,
        emissiveIntensity: 1.6,
        side: THREE.DoubleSide,
        roughness: 0.4,
        alphaTest: 0.35
      });
    const bflyVariants = [
      // Monarca Fuego Clásica
      { fore: mkWingMat(monarchForeTex, null, 0xff4500), hind: mkWingMat(monarchHindTex, null, 0xff4500) },
      // Monarca de Oro Cálido
      { fore: mkWingMat(monarchForeTex, 0xffd700, 0xff8c00), hind: mkWingMat(monarchHindTex, 0xffd700, 0xff8c00) },
      // Monarca Cian Etérea
      { fore: mkWingMat(monarchForeTex, 0x88e8ff, 0x0088ff), hind: mkWingMat(monarchHindTex, 0x88e8ff, 0x0088ff) }
    ];

    // Spawneo de 16 mariposas distribuidas por todo el recorrido de servicios (-220 a 10)
    for (let i = 0; i < 16; i++) {
      const bGroup = new THREE.Group();
      const variant = bflyVariants[Math.floor(Math.random() * bflyVariants.length)];

      // Cada lado: ala anterior + posterior colgadas de un pivote en el tórax.
      // El lado derecho es el espejo (scale.x = -1) del izquierdo.
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
      body.position.y = -0.01;
      const bHead = new THREE.Mesh(bHeadGeom, bBodyMat);
      bHead.position.set(0, 0, -0.16);

      // Halo de aura luminosa
      const halo = new THREE.Mesh(bHaloGeom, bHaloMat);
      halo.position.y = 0.04;

      bGroup.add(rootL, rootR, body, bHead, halo);

      const z = -200 + i * 14 + (Math.random() - 0.5) * 8; // distribuidas a lo largo de Z
      const x = (Math.random() - 0.5) * 16; // Cerca del sendero
      const y = terrainHeightAt(x, z) + 1.2 + Math.random() * 3.5;

      bGroup.position.set(x, y, z);
      bGroup.userData = {
        offset: Math.random() * Math.PI * 2,
        baseX: x,
        baseY: y,
        baseZ: z,
        rootL,
        rootR,
        halo,
        // Estado individual de vuelo real: ráfagas de aleteo y planeos
        phase: Math.random() * Math.PI * 2,
        energy: 1,
        gliding: false,
        modeUntil: Math.random() * 1.5
      };
      butterfliesGroup.add(bGroup);
    }

    // --- 7. GENERADOR DE ÁRBOLES FRACTALES ---
    const allLeafSystems: THREE.Points[] = [];
    const forestGroup = new THREE.Group();
    scene.add(forestGroup);

    const buildBranch = (
      parent: THREE.Object3D,
      radiusBottom: number,
      radiusTop: number,
      height: number,
      level: number,
      leavesColorHex: string
    ) => {
      const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 8, 1, false);
      geo.translate(0, height / 2, 0);
      
      const mesh = new THREE.Mesh(geo, troncoMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);

      if (level > 0) {
        const numBranches = level === 3 ? 3 : 2;
        for (let i = 0; i < numBranches; i++) {
          const branchGroup = new THREE.Group();
          branchGroup.position.y = height * (0.65 + Math.random() * 0.35);
          branchGroup.rotation.y = (Math.PI * 2 / numBranches) * i + (Math.random() - 0.4);
          branchGroup.rotation.z = Math.random() * 0.5 + 0.22;
          
          mesh.add(branchGroup);
          buildBranch(
            branchGroup, 
            radiusTop, 
            radiusTop * 0.65, 
            height * (0.7 + Math.random() * 0.18), 
            level - 1, 
            leavesColorHex
          );
        }
      } else {
        // Hojas del árbol
        const color = new THREE.Color(leavesColorHex);
        const leafGeo = new THREE.BufferGeometry();
        const count = 180;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          const radius = 2.2 * Math.cbrt(Math.random());
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = radius * Math.cos(phi);
        }

        leafGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const leafMat = new THREE.PointsMaterial({
          size: 0.36,
          color: color,
          map: particleTexture,
          transparent: true,
          opacity: 0.88,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          alphaTest: 0.01
        });

        const points = new THREE.Points(leafGeo, leafMat);
        points.position.y = height;
        mesh.add(points);
        allLeafSystems.push(points);
      }
    };

    // --- 8. SPAWNEO DE ÁRBOLES EN EL BOSQUE (12 ÁRBOLES) ---
    const treePositions = [
      { x: 0, z: 0 },       // Estrategia 360 (Carmesí)
      { x: -5.5, z: -16 },   // Web (Violeta)
      { x: 5.5, z: -32 },    // Diseño Gráfico (Ámbar)
      { x: -6, z: -48 },    // Publicidad Paga (Cian)
      { x: 6, z: -64 },     // SEO (Verde)
      { x: -5.5, z: -80 },   // Redes (Coral)
      { x: 5.5, z: -96 },    // IA (Oro)
      { x: -6, z: -112 },   // Producción Audiovisual (Azul Hielo)
      { x: 6, z: -128 },    // E-commerce (Índigo)
      { x: -5.5, z: -144 },  // Compol (Rojo Presidencial)
      { x: 5.5, z: -160 },   // Nube (Cian Claro)
      { x: 0, z: -176 }      // Eventos (Rosa Fuerte)
    ];

    treePositions.forEach((pos, idx) => {
      const service = SERVICES_DATA[idx];
      const treeGroup = new THREE.Group();
      
      let groundY = Math.sin(pos.x * 0.1) * Math.cos(pos.z * 0.1) * 2.2;
      groundY += Math.sin(pos.x * 0.5) * Math.cos(pos.z * 0.3) * 0.5;

      treeGroup.position.set(pos.x, groundY + 0.4, pos.z);
      forestGroup.add(treeGroup);

      buildBranch(treeGroup, 0.42, 0.28, 3.8, 3, service.color);

      // Luz puntual en el follaje
      const ptLight = new THREE.PointLight(service.color, 45, 12);
      ptLight.position.set(0, 5, 0);
      treeGroup.add(ptLight);

      // Nodos brillantes en el suelo
      const nodeGeo = new THREE.SphereGeometry(0.05, 6, 6);
      const nodeMat = new THREE.MeshBasicMaterial({ color: service.color });
      for (let j = 0; j < 8; j++) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const angle = Math.random() * Math.PI * 2;
        const rad = 1.0 + Math.random() * 2.2;
        node.position.set(Math.cos(angle) * rad, -0.4, Math.sin(angle) * rad);
        node.scale.setScalar(Math.random() * 0.6 + 0.4);
        treeGroup.add(node);
      }
    });

    // --- 8.5. SPAWNEO DEL ÁRBOL GIGANTE (Árbol de la Vida / Contacto) ---
    const giantTreeGroup = new THREE.Group();
    const giantTreeZ = -196;
    let giantGroundY = Math.sin(0 * 0.1) * Math.cos(giantTreeZ * 0.1) * 2.2;
    giantGroundY += Math.sin(0 * 0.5) * Math.cos(giantTreeZ * 0.3) * 0.5;

    giantTreeGroup.position.set(0, giantGroundY + 0.4, giantTreeZ);
    forestGroup.add(giantTreeGroup);

    // Creamos la estructura fractal del Árbol Gigante con nivel 4, altura 15, ramas extendidas
    buildBranch(giantTreeGroup, 1.4, 0.95, 15.0, 4, "#10b981"); // Verde esmeralda mágico de base

    // Añadimos luces de colores de los servicios dentro de la copa del árbol gigante
    const colorsList = ["#ff2a6d", "#8b5cf6", "#f59e0b", "#00f3ff", "#10b981", "#fbbf24", "#ec4899"];
    colorsList.forEach((col, cIdx) => {
      const ptLight = new THREE.PointLight(col, 50, 18);
      const angle = (cIdx / colorsList.length) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 2.0;
      ptLight.position.set(
        Math.cos(angle) * radius,
        9.0 + Math.random() * 4.0,
        Math.sin(angle) * radius
      );
      giantTreeGroup.add(ptLight);
    });

    // Swarm localizado de luciérnagas doradas revoloteando alrededor del árbol gigante
    const giantParticlesGeo = new THREE.BufferGeometry();
    const giantParticleCount = 200;
    const giantParticlePositions = new Float32Array(giantParticleCount * 3);
    for (let i = 0; i < giantParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6.0 * Math.cbrt(Math.random());
      giantParticlePositions[i * 3] = Math.cos(angle) * radius;
      giantParticlePositions[i * 3 + 1] = 7.0 + Math.random() * 9.0;
      giantParticlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    giantParticlesGeo.setAttribute('position', new THREE.BufferAttribute(giantParticlePositions, 3));
    
    const giantParticlesMat = new THREE.PointsMaterial({
      size: 0.75,
      color: '#f59e0b',
      map: fireflyTex || undefined,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const giantParticles = new THREE.Points(giantParticlesGeo, giantParticlesMat);
    giantTreeGroup.add(giantParticles);

    // --- 8.7. PARALLAX DE MOUSE (la cámara acompaña sutilmente al cursor) ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 9. BUCLE DE ANIMACIÓN ---
    const clock = new THREE.Clock();
    const currentLookAt = new THREE.Vector3(0, 3.5, -12);
    let animationFrameId: number;
    let lastTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const dt = Math.min(time - lastTime, 0.05);
      lastTime = time;

      // Cielo, luna y estrellas fugaces acompañan a la cámara (distancia infinita aparente)
      skyMesh.position.copy(camera.position);
      skyMat.uniforms.uTime.value = time;
      moonSprite.position.copy(camera.position).addScaledVector(moonDirVec, 120);

      shootingStars.forEach((star) => {
        const sud = star.userData;
        const starMat = star.material as THREE.SpriteMaterial;
        if (!sud.active) {
          if (time > sud.nextAt) {
            sud.active = true;
            star.visible = true;
            sud.life = 0;
            const skyDir = new THREE.Vector3(
              (Math.random() - 0.5) * 1.4,
              0.5 + Math.random() * 0.5,
              -1
            ).normalize();
            star.position.copy(camera.position).addScaledVector(skyDir, 110);
            sud.vel.set(
              (0.3 + Math.random() * 0.7) * (Math.random() < 0.5 ? -1 : 1),
              -(0.25 + Math.random() * 0.3),
              0
            ).normalize().multiplyScalar(38 + Math.random() * 22);
          }
        } else {
          sud.life += dt;
          star.position.addScaledVector(sud.vel, dt);
          const lifeRatio = Math.min(1, sud.life / sud.maxLife);
          starMat.opacity = Math.sin(lifeRatio * Math.PI) * 0.9;

          // Alinear la estela con su trayectoria en pantalla
          const p1 = star.position.clone().project(camera);
          const p2 = star.position.clone().addScaledVector(sud.vel, 0.1).project(camera);
          starMat.rotation = Math.atan2(p2.y - p1.y, (p2.x - p1.x) * camera.aspect);

          if (lifeRatio >= 1) {
            sud.active = false;
            star.visible = false;
            sud.nextAt = time + 5 + Math.random() * 9;
          }
        }
      });

      // Respiración del sendero de polen y pulso de los hongos bioluminiscentes
      trailMat.size = 0.3 + Math.sin(time * 2.1) * 0.07 + Math.cos(time * 0.7) * 0.04;
      mushroomMats.forEach((mat, mIdx) => {
        mat.emissiveIntensity = 1.35 + Math.sin(time * 1.6 + mIdx * 1.9) * 0.55;
      });

      // Animación de partículas del bosque (luciérnagas bioluminiscentes)
      const positions = forestParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const floatSpeed = 0.35 + (i % 6) * 0.12;
        
        // Movimiento orgánico flotante tridimensional en el bosque
        positions[idx] += Math.sin(time * floatSpeed + positions[idx + 1] * 0.08) * 0.02 + Math.sin(time * 0.08 + i) * 0.004;
        positions[idx + 1] += Math.cos(time * floatSpeed * 0.85 + positions[idx] * 0.08) * 0.015 + 0.006; // deriva ascendente
        positions[idx + 2] += Math.cos(time * floatSpeed * 1.15 + positions[idx] * 0.08) * 0.02;
        
        // Mantener dentro del volumen del bosque y reiniciar abajo si suben demasiado
        if (positions[idx + 1] > 18.0) {
          positions[idx + 1] = 0.2;
        }
      }
      forestParticles.geometry.attributes.position.needsUpdate = true;

      // Parpadeo orgánico bioluminiscente de las luciérnagas
      if (forestParticles) {
        const fireflyMat = forestParticles.material as THREE.PointsMaterial;
        // Parpadeo variable multionda (más sutil y pequeño)
        fireflyMat.size = 0.55 + Math.sin(time * 3.2) * 0.22 * (0.65 + Math.cos(time * 0.85) * 0.35);
      }

      // --- ANIMACIÓN DE CONEJOS EN EL SUELO ---
      conejos.forEach(rabbit => {
        rabbit.position.z += rabbit.userData.speed;
        
        // Salto sinusoidal
        const hop = Math.abs(Math.sin(time * rabbit.userData.hopSpeed + rabbit.userData.hopOffset)) * 0.42;
        
        // Altura del suelo en (x, z)
        let rx = rabbit.position.x;
        let rz = rabbit.position.z;
        let groundY = Math.sin(rx * 0.1) * Math.cos(rz * 0.1) * 2.2;
        groundY += Math.sin(rx * 0.5) * Math.cos(rz * 0.3) * 0.5;
        
        rabbit.position.y = groundY + hop;

        // Cabeceo del conejo al saltar
        rabbit.rotation.x = Math.sin(time * rabbit.userData.hopSpeed + rabbit.userData.hopOffset) * 0.15;
        
        // Rotar para mirar hacia adelante
        rabbit.rotation.y = Math.PI * 0.5 + Math.sin(time * 0.6) * 0.15;

        // Resetear al salir (ampliado para cubrir los 12 árboles)
        if (rabbit.position.z > 20) {
          rabbit.position.z = -188;
          rabbit.position.x = (Math.random() - 0.5) * 20;
        }
      });

      // --- ANIMACIÓN DE MARIPOSAS MONARCA (vuelo real: ráfagas de aleteo + planeos) ---
      if (butterfliesGroup) {
        butterfliesGroup.children.forEach(b => {
          const ud = b.userData;

          // Ráfagas de aleteo y planeos desincronizados por mariposa
          if (time > ud.modeUntil) {
            ud.gliding = !ud.gliding;
            ud.modeUntil = time + (ud.gliding ? 0.5 + Math.random() * 1.1 : 0.55 + Math.random() * 0.85);
          }
          const bTargetEnergy = ud.gliding ? 0 : 1;
          ud.energy += (bTargetEnergy - ud.energy) * (bTargetEnergy > ud.energy ? 0.16 : 0.06);
          ud.phase += dt * (Math.PI * 2) * (1.2 + 8.0 * ud.energy);

          // Desplazamiento caótico multi-frecuencia en X y Z (vuelo errático de mariposa real)
          const wanderX = Math.sin(time * 0.9 + ud.offset) * 2.8 + Math.cos(time * 2.3 + ud.offset * 1.3) * 0.7 + Math.sin(time * 5.2) * 0.12;
          const wanderZ = Math.cos(time * 0.8 + ud.offset) * 2.8 + Math.sin(time * 1.9 + ud.offset * 1.3) * 0.7 + Math.cos(time * 4.6) * 0.12;

          // Altura: rebota con cada batida y se deja caer suavemente al planear
          const hoverY = Math.sin(time * 0.6 + ud.offset) * 0.8
            + Math.sin(ud.phase - Math.PI / 2) * 0.12 * ud.energy
            - (1 - ud.energy) * 0.55;

          const posX = ud.baseX + wanderX;
          const posZ = ud.baseZ + wanderZ;
          const posY = ud.baseY + hoverY;

          // Cálculo de velocidad instantánea derivando la posición futura cercana (time + 0.05)
          const nextTime = time + 0.05;
          const nextWanderX = Math.sin(nextTime * 0.9 + ud.offset) * 2.8 + Math.cos(nextTime * 2.3 + ud.offset * 1.3) * 0.7 + Math.sin(nextTime * 5.2) * 0.12;
          const nextWanderZ = Math.cos(nextTime * 0.8 + ud.offset) * 2.8 + Math.sin(nextTime * 1.9 + ud.offset * 1.3) * 0.7 + Math.cos(nextTime * 4.6) * 0.12;

          const dx = nextWanderX - wanderX;
          const dz = nextWanderZ - wanderZ;

          b.position.set(posX, posY, posZ);

          // Orientar la cabeza (-Z local) hacia el rumbo de vuelo
          const targetAngle = Math.atan2(dx, dz);
          b.rotation.y = targetAngle + Math.PI;

          // Banking en giros; el cabeceo inquieto solo durante las ráfagas de aleteo
          const turnRate = Math.sin(time * 2.2 + ud.offset);
          b.rotation.z = turnRate * 0.3 * (0.4 + 0.6 * ud.energy);
          b.rotation.x = -0.22 * ud.energy + Math.sin(time * 4.8 + ud.offset) * 0.06 * ud.energy;

          // Batida asimétrica compartida por las 4 alas; en planeo, alas en V dihedral
          const sRaw = Math.sin(ud.phase);
          const stroke = sRaw >= 0 ? Math.pow(sRaw, 0.78) : -Math.pow(-sRaw, 1.35);
          const flap = stroke * ud.energy + (1 - ud.energy) * (0.5 + Math.sin(time * 5.0 + ud.offset) * 0.04);
          ud.rootL.rotation.z = flap;
          ud.rootR.rotation.z = -flap;

          // Orientar el halo brillante a la cámara (billboarding)
          if (ud.halo) {
            ud.halo.lookAt(camera.position);
          }
        });
      }

      // Viento digital del follaje
      allLeafSystems.forEach((pts, i) => {
        pts.rotation.y = Math.sin(time * 0.3 + i) * 0.04;
        pts.rotation.z = Math.cos(time * 0.2 + i) * 0.02;
      });

      // Animación de esporas del árbol gigante
      if (giantParticles) {
        giantParticles.rotation.y = time * 0.1;
        const giantPositions = giantParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < giantParticleCount; i++) {
          const idx = i * 3;
          giantPositions[idx + 1] += Math.sin(time * 0.4 + i) * 0.003;
        }
        giantParticles.geometry.attributes.position.needsUpdate = true;
      }

      // --- TRAYECTORIA DE CÁMARA POR EL BOSQUE expandido ---
      const scrollVal = Math.max(0, Math.min(1, scrollProgress.current));
      
      if (scrollVal < 0.91667) {
        // --- SECCIONES 0 A 11 (Bosque Horizontal) ---
        const normalizedScroll = scrollVal / 0.91667;
        const zPos = 18 - normalizedScroll * 194; // Vuela de 18 a -176 (árbol 12)
        
        let xTarget = 0;
        if (normalizedScroll > 0.03 && normalizedScroll < 0.97) {
          const virtualIdx = normalizedScroll * 11;
          const baseIdx = Math.floor(virtualIdx);
          const nextIdx = Math.min(11, baseIdx + 1);
          const alpha = virtualIdx - baseIdx;
          xTarget = THREE.MathUtils.lerp(treePositions[baseIdx].x, treePositions[nextIdx].x, alpha);
          xTarget = xTarget * 0.55;
        }

        const idleX = Math.sin(time * 0.4) * 0.22;
        const idleY = Math.cos(time * 0.3) * 0.15;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, xTarget + idleX + mouseX * 1.2, 0.035);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.8 + idleY - mouseY * 0.7, 0.035);
        
        // Punto de mirada
        const lookZ = zPos - 14;
        let lookX = 0;
        if (normalizedScroll < 0.95) {
          const lookIdx = Math.min(11, Math.floor(normalizedScroll * 11 + 0.8));
          lookX = treePositions[lookIdx].x;
        }
        
        currentLookAt.lerp(new THREE.Vector3(lookX + mouseX * 3.0, 3.2 - mouseY * 1.6, lookZ), 0.04);
      } else {
        // --- SECCIÓN 12: CONTACTO (Escalar el Árbol Gigante) ---
        const climbProgress = (scrollVal - 0.91667) / (1 - 0.91667);
        
        // La cámara vuela más adentro y escala el tronco del árbol
        const zPos = -176 - climbProgress * 7.0; // Se acerca de -176 a -183
        const yPos = 3.8 + climbProgress * 10.2;  // Escala de 3.8 a 14.0
        const xPos = THREE.MathUtils.lerp(camera.position.x, 0, 0.05); // Se centra

        camera.position.x = xPos;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, yPos, 0.035);
        
        // Mirar hacia la copa estrellada del árbol gigante
        const lookX = 0;
        const lookY = 3.2 + climbProgress * 11.3; // Apunta hacia arriba (14.5)
        const lookZ = -196;

        currentLookAt.lerp(new THREE.Vector3(lookX, lookY, lookZ), 0.04);
      }
      
      camera.lookAt(currentLookAt);

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
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
      window.removeEventListener('mousemove', handleMouseMove);
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
    const scrollTop = target.scrollTop;
    const clientHeight = target.clientHeight;
    
    // Determinar sección activa de forma robusta dividiendo directamente por clientHeight (100vh)
    const sectionIndex = Math.min(12, Math.floor(scrollTop / clientHeight + 0.15));
    setActiveSection(sectionIndex);

    const maxScroll = target.scrollHeight - target.clientHeight;
    scrollProgress.current = scrollTop / maxScroll;
  };

  return (
    <div className="w-full h-screen bg-[#020104] text-white overflow-hidden relative font-sans selection:bg-pink-500/30">
      
      {/* CAPA DE FONDO: Entorno 3D */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none"></div>

      {/* HEADER NAVEGACIÓN */}
      <div className="fixed top-6 left-6 z-50 pointer-events-auto flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[13px] text-white/90 backdrop-blur-md transition-all hover:border-white/20 hover:bg-zinc-900/60 hover:text-white"
        >
          <ArrowLeft className="size-4 text-white/70" />
          Volver al inicio
        </Link>
      </div>

      {/* HERO DE ENTRADA AL BOSQUE (se desvanece al empezar a volar) */}
      <div
        className={`fixed left-1/2 top-[14%] -translate-x-1/2 z-40 flex flex-col items-center text-center gap-3 pointer-events-none px-6 w-full max-w-3xl transition-all duration-1000 ${
          activeSection === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#a7f3d0]/80 px-4 py-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm">
          Nuestros Servicios
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-semibold tracking-tight bg-gradient-to-b from-white via-emerald-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(52,211,153,0.25)]">
          El Bosque Digital
        </h1>
        <p className="text-sm sm:text-base text-white/70 font-light max-w-md leading-relaxed">
          Volá de noche entre doce árboles vivos: cada uno guarda un servicio
          para hacer crecer tu marca. Al fondo te espera el Árbol de la Vida.
        </p>
      </div>

      {/* Viñeta cinematográfica */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(2,1,4,0.35) 84%, rgba(2,1,4,0.6) 100%)' }}
      />

      {/* INDICADORES LATERALES DE PROGRESO */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden md:flex flex-col gap-3 items-end max-h-[85vh] overflow-y-auto pr-1">
        <div className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase mb-2">Ecosistema Forestal</div>
        {SERVICES_DATA.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => {
              const scrollEl = document.getElementById('bosque-scroll');
              if (scrollEl) {
                scrollEl.scrollTo({
                  top: idx * scrollEl.clientHeight,
                  behavior: 'smooth'
                });
              }
            }}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <span className={`text-[10px] font-mono tracking-wider transition-all duration-300 ${
              activeSection === idx ? 'text-white opacity-100 translate-x-0' : 'text-white/30 opacity-0 translate-x-2 group-hover:opacity-60'
            }`} style={{ color: activeSection === idx ? sec.color : undefined }}>
              {sec.title}
            </span>
            <div className={`h-1.5 rounded-full transition-all duration-500 ${
              activeSection === idx 
                ? 'w-6 shadow-[0_0_8px_rgba(255,255,255,0.7)]' 
                : 'w-1.5 bg-white/10 group-hover:bg-white/30'
            }`} style={{ backgroundColor: activeSection === idx ? sec.color : undefined }} />
          </button>
        ))}
        {/* Indicador número 13 para la sección de Contacto */}
        <button
          onClick={() => {
            const scrollEl = document.getElementById('bosque-scroll');
            if (scrollEl) {
              scrollEl.scrollTo({
                top: 12 * scrollEl.clientHeight,
                behavior: 'smooth'
              });
            }
          }}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <span className={`text-[10px] font-mono tracking-wider transition-all duration-300 ${
            activeSection === 12 ? 'text-[#34d399] opacity-100 translate-x-0' : 'text-white/30 opacity-0 translate-x-2 group-hover:opacity-60'
          }`}>
            Contacto
          </span>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${
            activeSection === 12 
              ? 'w-6 bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.7)]' 
              : 'w-1.5 bg-white/10 group-hover:bg-white/30'
          }`} />
        </button>
      </div>

      {/* CAPA FRONTAL: Scroll HTML Nativo */}
      <div
        id="bosque-scroll"
        className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden scroll-smooth"
        onScroll={handleScroll}
      >
        {/* Expandido a 1300vh para permitir las 12 vistas de servicios + la sección de contacto */}
        <div style={{ height: '1300vh' }} className="relative w-full">
          
          {/* SECCIONES ABSOLUTAS QUE APARECEN CON EL SCROLL */}
          {SERVICES_DATA.map((srv, idx) => {
            const IconComponent = srv.icon;
            
            let alignmentClass = "justify-center";
            if (idx > 0 && idx < 11) {
              alignmentClass = idx % 2 === 1 ? "justify-start px-6 sm:px-16 md:px-32" : "justify-end px-6 sm:px-16 md:px-32";
            }

            return (
              <div 
                key={srv.id}
                style={{ top: `${idx * 100}vh` }}
                className={`h-screen w-full flex items-end pb-12 sm:pb-20 md:pb-24 ${alignmentClass} absolute pointer-events-none`}
              >
                <div 
                  className={`max-w-xl w-full bg-[#030105]/80 backdrop-blur-lg p-6 sm:p-10 rounded-[2rem] border pointer-events-auto transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.65)] ${
                    activeSection === idx 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                  }`}
                  style={{ 
                    borderColor: activeSection === idx ? `${srv.color}35` : 'rgba(255,255,255,0.06)',
                    boxShadow: activeSection === idx ? `0 0 50px ${srv.color}08` : undefined
                  }}
                >
                  <div className="flex items-center gap-3.5 mb-5">
                    <div 
                      className="size-11 rounded-2xl flex items-center justify-center border transition-colors duration-500"
                      style={{ 
                        backgroundColor: `${srv.color}12`, 
                        borderColor: `${srv.color}45` 
                      }}
                    >
                      <IconComponent className="size-5.5" style={{ color: srv.color }} />
                    </div>
                    <span 
                      className="font-mono text-xs uppercase tracking-[0.25em] font-semibold"
                      style={{ color: srv.color }}
                    >
                      {srv.category}
                    </span>
                  </div>

                  <h2 className="cc-section-title mb-4 uppercase italic text-white sm:text-4xl">
                    {srv.title}
                  </h2>
                  
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                    {srv.description}
                  </p>

                  <div className="flex flex-wrap gap-4 items-center">
                    <Link
                      href={srv.route}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide text-black transition-all hover:scale-105 duration-300"
                      style={{ backgroundColor: srv.color }}
                    >
                      Explorar Servicio
                      <ArrowRight className="size-4" />
                    </Link>
                    
                    <a
                      href={getWhatsAppHref(`Servicio: ${srv.title}`)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      <WhatsAppMark className="size-[17px] text-[#25D366]" />
                      Consultar
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* SECCIÓN 13: FICHA DE CONTACTO & ÁRBOL DE LA VIDA */}
          <div 
            style={{ top: '1200vh' }}
            className="h-screen w-full flex items-center justify-center absolute pointer-events-none"
          >
            <div 
              className={`max-w-2xl w-full bg-[#030105]/75 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border pointer-events-auto transition-all duration-700 shadow-[0_0_80px_rgba(0,0,0,0.8)] mx-4 sm:mx-6 ${
                activeSection === 12 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
              }`}
              style={{ 
                borderColor: activeSection === 12 ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255,255,255,0.06)',
                boxShadow: activeSection === 12 ? '0 0 60px rgba(52, 211, 153, 0.08)' : undefined
              }}
            >
              {isSubmitted ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
                    <CheckCircle className="size-10 text-[#34d399]" />
                  </div>
                  <h2 className="cc-section-title mb-4 uppercase italic text-white">
                    ¡Cosecha Iniciada!
                  </h2>
                  <p className="text-white/70 text-base max-w-md mx-auto mb-10 leading-relaxed">
                    Tu mensaje fue enviado con éxito. Nuestro equipo analizará tu proyecto y se pondrá en contacto en menos de 24 horas.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 text-sm font-semibold tracking-wide rounded-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                    >
                      Enviar otro mensaje
                    </button>
                    <button
                      onClick={handleRestart}
                      className="px-6 py-3 text-sm font-semibold tracking-wide rounded-full bg-[#34d399] text-black hover:scale-105 transition-all duration-300"
                    >
                      Volver a recorrer el bosque
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="size-11 rounded-2xl flex items-center justify-center border border-[#34d399]/40 bg-[#34d399]/10">
                      <Sparkles className="size-5.5 text-[#34d399]" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#34d399]">
                      Ecosistema Digital
                    </span>
                  </div>

                  <h2 className="cc-section-title mb-3 uppercase italic text-white sm:text-4xl">
                    Cosechemos Juntos
                  </h2>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                    Dejanos tu mensaje para empezar a diseñar, automatizar y hacer crecer tu ecosistema digital.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Nombre</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tu nombre completo"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#34d399]/40 transition-all pointer-events-auto"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#34d399]/40 transition-all pointer-events-auto"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Servicio de Interés</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#34d399]/40 transition-all pointer-events-auto"
                      >
                        {SERVICES_DATA.map((srv) => (
                          <option key={srv.id} value={srv.title} className="bg-[#030105] text-white">
                            {srv.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Mensaje</label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Contanos sobre tu proyecto, objetivos o ideas..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#34d399]/40 transition-all pointer-events-auto resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#34d399] px-6 py-3 text-sm font-semibold tracking-wide text-black transition-all hover:scale-105 duration-300 disabled:opacity-50 disabled:scale-100"
                      >
                        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                        <ArrowRight className="size-4" />
                      </button>

                      <a
                        href={getWhatsAppHref(`¡Hola! Me interesa conversar sobre el servicio de ${service}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.08]"
                      >
                        <WhatsAppMark className="size-[17px] text-[#25D366]" />
                        Escribir por WhatsApp
                      </a>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* INDICACIÓN FLOTANTE DE INICIO */}
          {activeSection === 0 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center animate-bounce text-white/60">
              <span className="text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">Deslizá lentamente para volar por el bosque</span>
              <ChevronDown className="size-5" />
            </div>
          )}

          {/* CIERRE DEL RECORRIDO EN EL ÚLTIMO ÁRBOL */}
          {activeSection === 11 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Cosecha Creativa · Todos los derechos reservados</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
