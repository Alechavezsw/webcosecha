'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Camión minero de acarreo en 3D, modelado en Blender
 * (scripts/blender/truck.py → public/models/truck.glb).
 *
 * Con el scroll entra a la escena andando de izquierda a derecha (las ruedas
 * giran según la distancia recorrida y levanta polvo), frena, gira para
 * mostrar el frente en tres cuartos y prende los faros. Canvas transparente
 * sobre la foto de la mina, con sombra proyectada en el piso.
 *
 * El modelo trae oclusión ambiental y tierra horneadas en el color por
 * vértice (COLOR_0): three las multiplica sobre cada material.
 */

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const WHEEL_R = 2.0;

function makeSoftTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(c);
}

/** Haz de luz del faro: cono abierto con degradado a lo largo, aditivo. */
function makeBeam() {
  const geo = new THREE.ConeGeometry(2.6, 16, 24, 1, true);
  geo.translate(0, -8, 0);
  geo.rotateZ(Math.PI / 2); // el vértice en el faro, abriéndose hacia +X
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uOn: { value: 0 } },
    vertexShader: `
      varying float vAlong;
      void main() {
        vAlong = clamp(position.x / 16.0, 0.0, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float uOn;
      varying float vAlong;
      void main() {
        float a = pow(1.0 - vAlong, 2.2) * 0.22 * uOn;
        gl_FragColor = vec4(1.0, 0.86, 0.6, a);
      }`,
  });
  return new THREE.Mesh(geo, mat);
}

export default function TruckScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    try {
      const t = document.createElement('canvas');
      if (!t.getContext('webgl2') && !t.getContext('webgl')) return;
    } catch {
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = (mount.closest('section') as HTMLElement | null) ?? mount;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Reflejos para la pintura: sin entorno el amarillo se ve plástico.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.26;

    const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 400);

    // Luz de tarde polvorienta. Sol alto y rasante desde atrás a la izquierda:
    // el costado que se ve queda en media luz y gana volumen.
    scene.add(new THREE.HemisphereLight(0xffe6c4, 0x2a1d12, 0.35));
    // Sol alto adelante a la izquierda (del lado de la cámara): marca volúmenes
    // en el costado que se ve. Desde atrás el costado quedaba plano, de juguete.
    const sun = new THREE.DirectionalLight(0xffd9a8, 2.6);
    sun.position.set(-22, 30, 24);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 18, bottom: -18, near: 1, far: 90 });
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.04;
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xffb347, 2.2); // contraluz: delinea bordes
    rim.position.set(20, 10, -18);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xcfd8ff, 0.35);
    fill.position.set(10, 6, 30);
    scene.add(fill);

    // El piso no se ve: sólo recibe la sombra, que cae sobre la foto.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220),
      new THREE.ShadowMaterial({ opacity: 0.5, color: 0x1a1006 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Sombra de contacto: aunque el sol cambie, las ruedas siempre apoyan.
    const softTex = makeSoftTexture();
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(19, 12),
      new THREE.MeshBasicMaterial({ map: softTex, color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false })
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.02;
    scene.add(contact);

    const truck = new THREE.Group();
    scene.add(truck);
    const wheels: THREE.Object3D[] = [];
    const beams: THREE.Mesh[] = [];
    const headMats: THREE.MeshStandardMaterial[] = [];

    // Polvo que levantan las ruedas traseras al andar.
    const DUST = 260;
    const dustPos = new Float32Array(DUST * 3);
    const dustVel = new Float32Array(DUST * 3);
    const dustLife = new Float32Array(DUST).fill(0);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustAlpha = new Float32Array(DUST);
    dustGeo.setAttribute('alpha', new THREE.BufferAttribute(dustAlpha, 1));
    const dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uMap: { value: softTex }, uScale: { value: 1 } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        uniform float uScale;
        void main() {
          vAlpha = alpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uScale * (2.2 + (1.0 - alpha) * 5.0) * 120.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D uMap;
        varying float vAlpha;
        void main() {
          vec4 t = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(0.78, 0.64, 0.47, t.a * vAlpha * 0.5);
        }`,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);
    let dustCursor = 0;
    const emitDust = (x: number, z: number, speed: number) => {
      const i = dustCursor;
      dustCursor = (dustCursor + 1) % DUST;
      dustPos[i * 3] = x + (Math.random() - 0.5) * 1.2;
      dustPos[i * 3 + 1] = 0.3 + Math.random() * 0.6;
      dustPos[i * 3 + 2] = z + (Math.random() - 0.5) * 1.6;
      dustVel[i * 3] = -speed * (0.25 + Math.random() * 0.3) + (Math.random() - 0.5) * 0.6;
      dustVel[i * 3 + 1] = 0.6 + Math.random() * 1.2;
      dustVel[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
      dustLife[i] = 1;
    };

    let disposed = false;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      '/models/truck.glb',
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) {
            m.castShadow = true;
            m.receiveShadow = true;
            const mats = Array.isArray(m.material) ? m.material : [m.material];
            mats.forEach((mt) => {
              const sm = mt as THREE.MeshStandardMaterial;
              if (sm.name === 'light_head') headMats.push(sm);
            });
          }
          if (/^wheel_[A-Z]+[a-z]?$/.test(o.name)) wheels.push(o);
        });
        truck.add(model);
        // Haces de los faros: salen del frente de la plataforma (ver truck.py).
        [3.5, -3.5].forEach((z) => {
          const b = makeBeam();
          b.position.set(7.35, 4.45, z);
          b.rotation.z = -0.08; // apuntan un poco hacia el piso
          truck.add(b);
          beams.push(b);
        });
      },
      undefined,
      () => {}
    );

    // --- Recorrido atado al scroll -------------------------------------
    // p = 0 cuando la sección asoma abajo, 1 cuando termina de salir arriba.
    let p = reduce ? 0.7 : 0;
    const target = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh - r.top) / (vh + r.height));
    };
    let wide = true;
    // Estado físico del camión: posición, velocidad, cabeceo y giro suavizados.
    let x = reduce ? 0 : -46;
    let v = 0;
    let pitch = 0;
    let turnT = reduce ? 1 : 0;

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      wide = w >= 1280;
      dustMat.uniforms.uScale.value = renderer.getPixelRatio() * (h / 900);
      camera.updateProjectionMatrix();
    };
    resize();

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    const lookAt = new THREE.Vector3();

    const frame = () => {
      raf = running ? requestAnimationFrame(frame) : 0;
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      if (!reduce) p += (target() - p) * 0.08;

      // Es un camión cargado de 600 t: el scroll marca adónde tiene que llegar,
      // pero el camión acelera y frena de a poco y no pasa de ~25 km/h. La
      // entrada ocupa casi todo el paso por la sección (p 0.05 → 0.66).
      const drive = smooth(0.05, 0.66, p);
      const finalX = wide ? 8 : 0;
      const goalX = THREE.MathUtils.lerp(-46, finalX, drive);
      const MAX_V = 7; // m/s
      const MAX_A = 2.2; // m/s²: arranque y frenado pesados
      const wantV = THREE.MathUtils.clamp((goalX - x) * 0.6, -MAX_V, MAX_V);
      const prevV = v;
      v += THREE.MathUtils.clamp(wantV - v, -MAX_A * dt, MAX_A * dt);
      x += v * dt;
      if (reduce) {
        x = goalX; // sin animación: ya estacionado
        v = 0;
      }
      const accel = (v - prevV) / Math.max(dt, 1e-3);
      const speed = v;
      truck.position.x = x;
      // El giro hacia cámara recién empieza cuando el camión terminó de frenar.
      const parked = 1 - clamp(Math.abs(goalX - x) / 4) * clamp(Math.abs(v) / 1.5);
      turnT += ((smooth(0.5, 0.82, p) * parked) - turnT) * Math.min(1, dt * 0.9);
      const turn = turnT;
      truck.rotation.y = -turn * 0.62;
      // Suspensión pesada: balanceo lento y profundo al andar; al acelerar la
      // trompa sube y al frenar cabecea hacia adelante (la carga empuja).
      const roll = Math.abs(v) / MAX_V;
      truck.position.y = Math.sin(time * 3.2) * 0.07 * roll + Math.sin(time * 31) * 0.006;
      pitch += (THREE.MathUtils.clamp(accel * 0.012, -0.025, 0.025) - pitch) * Math.min(1, dt * 3);
      truck.rotation.z = pitch + Math.sin(time * 2.1 + 1) * 0.004 * roll;
      contact.position.set(x - 0.6, 0.02, 0);
      contact.rotation.z = truck.rotation.y;

      // Ruedas: giran exactamente lo que avanza el camión.
      const spin = -x / WHEEL_R;
      wheels.forEach((w) => (w.rotation.z = spin));

      // Polvo detrás de las ruedas traseras cuando anda.
      if (Math.abs(speed) > 1) {
        const n = Math.min(4, Math.ceil(Math.abs(speed) * 0.35));
        for (let k = 0; k < n; k++) emitDust(x - 3.6, k % 2 ? 3.4 : -3.4, speed);
      }
      for (let i = 0; i < DUST; i++) {
        if (dustLife[i] <= 0) {
          dustAlpha[i] = 0;
          continue;
        }
        dustLife[i] -= dt * 0.55;
        dustPos[i * 3] += dustVel[i * 3] * dt;
        dustPos[i * 3 + 1] += dustVel[i * 3 + 1] * dt;
        dustPos[i * 3 + 2] += dustVel[i * 3 + 2] * dt;
        dustVel[i * 3 + 1] *= 0.985;
        dustAlpha[i] = Math.max(0, dustLife[i]);
      }
      dustGeo.attributes.position.needsUpdate = true;
      dustGeo.attributes.alpha.needsUpdate = true;

      // Faros: se prenden cuando el camión ya giró hacia cámara.
      const lights = smooth(0.1, 0.6, turn) * (0.92 + Math.sin(time * 13) * 0.02);
      headMats.forEach((m) => (m.emissiveIntensity = 1 + lights * 8));
      beams.forEach((b) => ((b.material as THREE.ShaderMaterial).uniforms.uOn.value = lights));

      // Cámara baja, casi a la altura de las ruedas, acompañando el giro.
      // Mirar por encima del camión lo baja en el cuadro: apoya sobre la
      // tierra de la foto y no queda detrás del panel de texto.
      const orbit = turn * 0.18;
      const camDist = wide ? 64 : 74;
      camera.position.set(
        (wide ? finalX - 18 : -4) + Math.sin(orbit) * camDist,
        5.2 + (1 - drive) * 1.5,
        Math.cos(orbit) * camDist
      );
      lookAt.set(wide ? finalX - 18 : 0, wide ? 8 : 12, 0);
      camera.lookAt(lookAt);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '150px 0px' });
    io.observe(mount);
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh || (o as THREE.Points).isPoints) {
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mt) => mt?.dispose());
        }
      });
      softTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
