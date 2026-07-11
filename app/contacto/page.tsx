"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import { WhatsAppMark } from "@/components/icons/whatsapp-mark";
import { getWhatsAppHref } from "@/lib/whatsapp";

// === FUNCIONES MATEMÁTICAS Y CONSTANTES GLOBALES ===
const colors = {
    sky: 0xffb7b2,         
    ambient: 0xffe4e1,     
    sun: 0xffaa00,         
    ground: 0x8DA354,      
    mountain: 0x5c7247,    // Mossy, earthy green-brown rock
    pollen: 0xffeedd,      
    rays: 0xfff0dd         // Warm golden sunset rays
};

function getPathX(z: number) {
    return Math.sin(z * 0.04) * 12 + Math.cos(z * 0.015) * 15;
}

function getTerrainHeight(worldX: number, worldZ: number) {
    const localX = worldX;
    const localZ = worldZ + 300; 
    const pathX = getPathX(worldZ);

    let y = Math.sin(localX * 0.1) * 2 + 
            Math.cos(localZ * 0.08) * 3 +
            Math.sin(localX * 0.05 + localZ * 0.05) * 4;
    
    const distanceToPath = Math.abs(worldX - pathX);
    if (distanceToPath < 16) {
        y = y * (distanceToPath / 16);
    }
    return y;
}

function createSnowflakeTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
        gradient.addColorStop(0.6, 'rgba(240, 248, 255, 0.45)');
        gradient.addColorStop(1, 'rgba(240, 248, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
    }
    return new THREE.CanvasTexture(canvas);
}

function createSunGlowTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 235, 210, 1.0)'); // Centro brillante dorado/blanco
        gradient.addColorStop(0.2, 'rgba(255, 190, 120, 0.7)'); // Corona cálida
        gradient.addColorStop(0.5, 'rgba(255, 140, 80, 0.25)'); // Brillo exterior naranja
        gradient.addColorStop(1, 'rgba(255, 140, 80, 0)'); // Desvanecido completo
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
}

function createFireflyTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(235, 255, 120, 1.0)'); // Centro brillante verde-amarillo
        gradient.addColorStop(0.25, 'rgba(180, 255, 80, 0.85)'); // Aura verde-amarilla media
        gradient.addColorStop(0.55, 'rgba(100, 240, 50, 0.35)');  // Borde externo verde brillante suave
        gradient.addColorStop(1, 'rgba(100, 240, 50, 0)');      // Transparente total
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
}

function createMoonTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Disco lunar con halo etéreo
        const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 250, 236, 1.0)');
        gradient.addColorStop(0.30, 'rgba(235, 238, 255, 0.95)');
        gradient.addColorStop(0.40, 'rgba(190, 205, 255, 0.30)');
        gradient.addColorStop(0.70, 'rgba(170, 190, 255, 0.10)');
        gradient.addColorStop(1, 'rgba(170, 190, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        // Cráteres sutiles dentro del disco brillante
        ctx.globalAlpha = 0.14;
        ctx.fillStyle = '#9aa6cc';
        const craters = [
            { x: 56, y: 52, r: 7 },
            { x: 73, y: 66, r: 5 },
            { x: 60, y: 76, r: 3.5 },
            { x: 76, y: 50, r: 4 },
            { x: 48, y: 66, r: 3 }
        ];
        craters.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    return new THREE.CanvasTexture(canvas);
}

function createStreakTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Estela: cola tenue a la izquierda, cabeza brillante a la derecha (+X)
        const gradient = ctx.createLinearGradient(0, 0, 128, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.55, 'rgba(190, 215, 255, 0.35)');
        gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 8);
    }
    return new THREE.CanvasTexture(canvas);
}

function createSoftGlowTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.28)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
}

// Ala ANTERIOR (forewing) de monarca: triangular, barrida hacia adelante, con ápice negro
// y banda de manchas claras. En el canvas: base abajo-izquierda (tórax), ápice arriba-derecha.
// "Arriba" del canvas = hacia la cabeza; "derecha" = hacia la punta del ala.
function createMonarchForewingTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, 256, 256);

        const traceOutline = () => {
            ctx.beginPath();
            ctx.moveTo(14, 206);
            ctx.bezierCurveTo(30, 158, 96, 84, 196, 38);    // margen costal (borde de ataque)
            ctx.bezierCurveTo(220, 27, 242, 28, 240, 52);   // ápice redondeado
            ctx.bezierCurveTo(238, 84, 216, 132, 186, 172); // termen (margen externo) cóncavo
            ctx.bezierCurveTo(166, 197, 124, 216, 84, 222); // hacia el tornus
            ctx.bezierCurveTo(52, 226, 22, 220, 14, 206);   // margen interno (junto al cuerpo)
            ctx.closePath();
        };

        ctx.save();
        traceOutline();
        ctx.clip();

        // Naranja monarca: ámbar profundo en la base, encendido hacia el disco
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
        ctx.quadraticCurveTo(85, 150, 124, 124);  // borde superior de la celda discal
        ctx.moveTo(22, 204);
        ctx.quadraticCurveTo(80, 178, 122, 146);  // borde inferior de la celda discal
        ctx.moveTo(124, 124);
        ctx.quadraticCurveTo(128, 136, 122, 146); // vena discocelular (cierre de la celda)
        ctx.stroke();

        ctx.lineWidth = 3;
        const veins: Array<[number, number, number, number]> = [
            [150, 96, 198, 44],
            [168, 96, 222, 50],
            [176, 110, 234, 70],
            [180, 126, 230, 100],
            [176, 144, 212, 136],
            [168, 162, 194, 166],
            [152, 178, 168, 192],
            [136, 188, 138, 208],
            [110, 196, 104, 216],
            [74, 200, 70, 220]
        ];
        veins.forEach(([cx, cy, tx, ty], idx) => {
            ctx.beginPath();
            const fromTop = idx < 4;
            ctx.moveTo(fromTop ? 124 : 122, fromTop ? 124 : 146);
            ctx.quadraticCurveTo(cx, cy, tx, ty);
            ctx.stroke();
        });

        // Zona apical negra (tercio externo del ala)
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

        // Banda diagonal de manchas anaranjado pálido cruzando el ápice (sello de la monarca)
        ctx.fillStyle = '#ffc46b';
        const apicalSpots: Array<[number, number, number, number, number]> = [
            [170, 78, 11, 6.5, -0.65],
            [190, 64, 10, 6, -0.7],
            [210, 52, 8.5, 5, -0.75],
            [186, 110, 9, 5.5, -0.4],
            [202, 92, 8, 5, -0.55],
            [218, 76, 6.5, 4, -0.7]
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

        // Sombra cálida en la raíz del ala (nace bajo el pelaje del tórax)
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
        outerDots.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 2.6, 0, Math.PI * 2);
            ctx.fill();
        });
        const innerDots: Array<[number, number]> = [
            [226, 72], [216, 97], [203, 123], [187, 148],
            [167, 170], [143, 188], [116, 200], [88, 209]
        ];
        innerDots.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 1.7, 0, Math.PI * 2);
            ctx.fill();
        });
        const apexDots: Array<[number, number]> = [[225, 40], [235, 54], [240, 70]];
        apexDots.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 2.1, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
    return new THREE.CanvasTexture(canvas);
}

// Ala POSTERIOR (hindwing) de monarca: abanico redondeado que se abre hacia atrás-afuera.
// En el canvas: base arriba-izquierda (tórax); "abajo" = hacia la cola.
function createMonarchHindwingTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, 256, 256);

        const traceOutline = () => {
            ctx.beginPath();
            ctx.moveTo(16, 54);
            ctx.bezierCurveTo(64, 34, 120, 30, 158, 40);     // borde anterior (queda bajo el ala delantera)
            ctx.bezierCurveTo(208, 52, 242, 96, 240, 142);   // hombro externo redondeado
            ctx.bezierCurveTo(238, 186, 204, 222, 152, 232); // margen externo en abanico
            ctx.bezierCurveTo(110, 240, 62, 232, 38, 210);   // hacia el ángulo anal
            ctx.bezierCurveTo(18, 192, 10, 110, 16, 54);     // margen anal (junto al abdomen)
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

        // Venas radiando en abanico desde la base
        ctx.strokeStyle = '#170f08';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        const veins: Array<[number, number, number, number]> = [
            [108, 60, 156, 44],
            [128, 74, 204, 64],
            [148, 94, 234, 104],
            [152, 120, 236, 148],
            [146, 146, 218, 192],
            [128, 168, 178, 222],
            [104, 180, 128, 234],
            [76, 184, 80, 230]
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

        // Margen externo negro ancho
        traceOutline();
        ctx.strokeStyle = '#15100b';
        ctx.lineWidth = 24;
        ctx.stroke();

        // Sombra de la raíz (queda bajo el ala anterior y el cuerpo)
        const baseShadow = ctx.createRadialGradient(24, 64, 6, 24, 64, 70);
        baseShadow.addColorStop(0, 'rgba(18,10,5,0.95)');
        baseShadow.addColorStop(1, 'rgba(18,10,5,0)');
        ctx.fillStyle = baseShadow;
        ctx.fillRect(0, 0, 256, 256);

        // Hilera doble de puntitos blancos del margen
        ctx.fillStyle = '#fbf4e4';
        const outerDots: Array<[number, number]> = [
            [232, 110], [233, 138], [226, 166], [212, 192],
            [190, 212], [162, 226], [130, 232], [98, 231], [68, 222], [46, 206]
        ];
        outerDots.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 2.8, 0, Math.PI * 2);
            ctx.fill();
        });
        const innerDots: Array<[number, number]> = [
            [223, 124], [222, 152], [210, 179], [192, 200], [167, 216], [137, 223], [105, 222], [76, 213]
        ];
        innerDots.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
    return new THREE.CanvasTexture(canvas);
}

// Genera un pico montañoso realista con nieve física degradada y biselada (soft pillow snow caps)
function generateRealisticPeak(base: number, height: number, mountainMat: THREE.Material, snowMat: THREE.Material) {
    // Mayor resolución geométrica (24x24) para contornos redondeados y suaves, evitando aspecto de papel picado
    const mainGeom = new THREE.ConeGeometry(base, height, 24, 24);
    mainGeom.translate(0, height / 2, 0);
    
    const posAttr = mainGeom.attributes.position;
    const tempV = new THREE.Vector3();
    for (let j = 0; j < posAttr.count; j++) {
        tempV.fromBufferAttribute(posAttr, j);
        const yRatio = tempV.y / height; // 0 a 1
        
        if (yRatio > 0 && yRatio < 1) {
            const angle = Math.atan2(tempV.z, tempV.x);
            // Ruido fractal para dar relieve rocoso irregular
            const ridgeNoise = Math.sin(angle * 5) * (base * 0.12) * (1 - yRatio) +
                               Math.cos(angle * 11) * (base * 0.04) * (1 - yRatio) +
                               Math.sin(tempV.y * 0.2) * (base * 0.06) * (1 - yRatio);
                               
            const currentRadius = Math.sqrt(tempV.x * tempV.x + tempV.z * tempV.z);
            if (currentRadius > 0) {
                const newRadius = currentRadius + ridgeNoise;
                tempV.x = Math.cos(angle) * newRadius;
                tempV.z = Math.sin(angle) * newRadius;
            }
            // Pequeña distorsión vertical para repisas rocosas
            tempV.y += (Math.random() - 0.5) * (height * 0.02);
        }
        posAttr.setXYZ(j, tempV.x, tempV.y, tempV.z);
    }
    mainGeom.computeVertexNormals();
    
    // Variación aleatoria de tonalidad musgosa/rocosa para mayor realismo natural
    const variationColor = new THREE.Color(colors.mountain);
    variationColor.offsetHSL(
        (Math.random() - 0.5) * 0.05, 
        (Math.random() - 0.5) * 0.08, 
        (Math.random() - 0.5) * 0.06
    );
    const customMat = new THREE.MeshStandardMaterial({
        color: variationColor,
        flatShading: true,
        roughness: 0.95
    });

    const peakMesh = new THREE.Mesh(mainGeom, customMat);

    // NUEVA NIEVE DE ALTA FIDELIDAD:
    // Clona la geometría de la montaña, crea una capa física tridimensional con espesor abombado
    // y colapsa los vértices por debajo de la línea de nieve hacia el centro para evitar Z-fighting.
    const snowGeom = mainGeom.clone();
    const snowPosAttr = snowGeom.attributes.position;
    const snowNormAttr = snowGeom.attributes.normal;
    const snowV = new THREE.Vector3();
    const snowN = new THREE.Vector3();
    
    const colorsArray = new Float32Array(snowPosAttr.count * 3);
    
    for (let j = 0; j < snowPosAttr.count; j++) {
        snowV.fromBufferAttribute(snowPosAttr, j);
        if (snowNormAttr) {
            snowN.fromBufferAttribute(snowNormAttr, j);
        } else {
            snowN.set(0, 1, 0);
        }
        
        const yRatio = snowV.y / height;
        const angle = Math.atan2(snowV.z, snowV.x);
        
        // Línea de nieve ondulada natural (elevada al 80% del pico para hacer la nieve mucho más pequeña y discreta)
        const wavySnowline = 0.80 + Math.sin(angle * 5) * 0.03 + Math.cos(angle * 11) * 0.015;
        
        if (yRatio < wavySnowline) {
            // Vértice por debajo de la línea de nieve: lo colapsamos en la punta superior (peak)
            // para evitar que se estiren caras hacia el centro y queden expuestas fuera de la roca.
            snowV.x = 0;
            snowV.z = 0;
            snowV.y = height;
            snowPosAttr.setXYZ(j, snowV.x, snowV.y, snowV.z);
            
            colorsArray[j * 3] = variationColor.r;
            colorsArray[j * 3 + 1] = variationColor.g;
            colorsArray[j * 3 + 2] = variationColor.b;
        } else {
            // Vértice sobre la línea de nieve: Generamos un "copón" o cúpula redondeada (Dome)
            // de alta fidelidad, eliminando la forma puntiaguda del cono.
            const rAtSnowline = base * (1.0 - wavySnowline);
            const yStart = wavySnowline * height;
            
            // Altura de abombamiento superior para redondear el pico
            const domeBulge = base * 0.08 + 0.3;
            const yEnd = height + domeBulge;
            
            // Mapeamos el ratio vertical dentro del copón de nieve (0 a 1)
            const s = (snowV.y - yStart) / (height - yStart);
            const t = Math.min(1.0, Math.max(0.0, s));
            
            // Espesor de nieve física (más grueso en el centro del domo para darle aspecto regordete y tridimensional)
            const maxThickness = base * 0.02 + 0.12; 
            const thickness = 0.08 + Math.sin(t * Math.PI) * maxThickness;
            
            // Ecuación de elipsoide/cúpula redondeada para eliminar el vértice puntiagudo del cono
            const rNew = rAtSnowline * Math.sqrt(1.0 - t * t) + thickness;
            const yNew = yStart + t * (yEnd - yStart);
            
            snowV.x = Math.cos(angle) * rNew;
            snowV.z = Math.sin(angle) * rNew;
            snowV.y = yNew;
            
            snowPosAttr.setXYZ(j, snowV.x, snowV.y, snowV.z);
            
            // Paleta cromática premium con degradados atardecer y sombras:
            const snowTopColor = new THREE.Color(0xfffaf4);    // Blanco cálido sol poniente
            const snowShadowColor = new THREE.Color(0xdbe6f5); // Sombra azul celeste muy suave de ventisquero
            
            const snowColor = new THREE.Color().lerpColors(snowShadowColor, snowTopColor, t);
            const finalColor = new THREE.Color().lerpColors(variationColor, snowColor, Math.max(0.2, t));
            
            colorsArray[j * 3] = finalColor.r;
            colorsArray[j * 3 + 1] = finalColor.g;
            colorsArray[j * 3 + 2] = finalColor.b;
        }
    }
    
    snowGeom.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    snowGeom.computeVertexNormals();

    const snowMesh = new THREE.Mesh(snowGeom, snowMat);
    peakMesh.add(snowMesh);

    return peakMesh;
}

function createBeautifulMountain(base: number, height: number, mountainMat: THREE.Material, snowMat: THREE.Material) {
    const group = new THREE.Group();
    
    // Pico principal realista con nieve física difuminada
    const mainPeak = generateRealisticPeak(base, height, mountainMat, snowMat);
    group.add(mainPeak);

    // Picos secundarios para dar volumen de cordillera escarpada
    const numSidePeaks = 1 + Math.floor(Math.random() * 2);
    for(let i=0; i<numSidePeaks; i++) {
        const sBase = base * (0.4 + Math.random() * 0.3);
        const sHeight = height * (0.4 + Math.random() * 0.4);
        const sPeak = generateRealisticPeak(sBase, sHeight, mountainMat, snowMat);
        
        const angle = Math.random() * Math.PI * 2;
        const dist = base * 0.5;
        sPeak.position.set(Math.cos(angle)*dist, 0, Math.sin(angle)*dist);
        group.add(sPeak);
    }
    return group;
}

// Crea árboles realistas estilizados (tipo coníferas / pinos y árboles frondosos de copa redonda) con nieve
function createRealisticTree(height: number, trunkMat: THREE.Material, foliageMat: THREE.Material, snowMat: THREE.Material) {
    const treeGroup = new THREE.Group();
    
    // Tronco
    const trunkHeight = height * 0.35;
    const trunkRadius = height * 0.06;
    const trunkGeom = new THREE.CylinderGeometry(trunkRadius * 0.5, trunkRadius, trunkHeight, 5);
    trunkGeom.translate(0, trunkHeight / 2, 0);
    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    treeGroup.add(trunk);
    
    // Copa (pino o frondoso aleatoriamente)
    const treeType = Math.random() > 0.45 ? "pino" : "frondoso";
    
    if (treeType === "pino") {
        const numLayers = 3;
        const baseFoliageRadius = height * 0.28;
        const layerHeight = height * 0.32;
        
        for (let i = 0; i < numLayers; i++) {
            const layerRadius = baseFoliageRadius * (1 - i * 0.25);
            const layerGeom = new THREE.ConeGeometry(layerRadius, layerHeight, 5);
            layerGeom.translate(0, layerHeight / 2, 0);
            
            // Perturbación orgánica de las hojas
            const posAttr = layerGeom.attributes.position;
            for (let j = 0; j < posAttr.count; j++) {
                if (posAttr.getY(j) > 0.1) {
                    posAttr.setX(j, posAttr.getX(j) + (Math.random() - 0.5) * (layerRadius * 0.15));
                    posAttr.setZ(j, posAttr.getZ(j) + (Math.random() - 0.5) * (layerRadius * 0.15));
                }
            }
            layerGeom.computeVertexNormals();
            
            const layerMesh = new THREE.Mesh(layerGeom, foliageMat);
            layerMesh.position.y = trunkHeight + (i * layerHeight * 0.55);
            treeGroup.add(layerMesh);

            // Gorrito de nieve redondo en el tope del pino
            if (i === numLayers - 1) {
                const snowCapGeom = new THREE.SphereGeometry(layerRadius * 0.72, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
                snowCapGeom.scale(1, 1.3, 1);
                const snowCap = new THREE.Mesh(snowCapGeom, snowMat);
                snowCap.position.set(0, layerMesh.position.y + layerHeight * 0.65, 0);
                treeGroup.add(snowCap);
            }
        }
    } else {
        // Árbol frondoso (esferas de follaje orgánicas de baja poligonalidad)
        const numSpheres = 4 + Math.floor(Math.random() * 3);
        const foliageRadius = height * 0.22;
        const foliageCenterY = trunkHeight + foliageRadius;
        
        for (let i = 0; i < numSpheres; i++) {
            const sphereGeom = new THREE.IcosahedronGeometry(foliageRadius * (0.75 + Math.random() * 0.35), 1);
            const sphere = new THREE.Mesh(sphereGeom, foliageMat);
            
            const angle = Math.random() * Math.PI * 2;
            const dist = foliageRadius * 0.35 * Math.random();
            sphere.position.set(
                Math.cos(angle) * dist,
                foliageCenterY + (Math.random() - 0.5) * (foliageRadius * 0.4),
                Math.sin(angle) * dist
            );
            treeGroup.add(sphere);

            // Capitas de nieve esféricas arriba de algunas esferas del follaje
            if (Math.random() > 0.5) {
                const snowCapGeom = new THREE.SphereGeometry(foliageRadius * 0.55, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
                const snowCap = new THREE.Mesh(snowCapGeom, snowMat);
                snowCap.position.set(sphere.position.x, sphere.position.y + foliageRadius * 0.38, sphere.position.z);
                treeGroup.add(snowCap);
            }
        }
    }
    
    return treeGroup;
}

export default function ContactoPage() {
    const mountRef = useRef<HTMLDivElement>(null);
    const twilightBgRef = useRef<HTMLDivElement>(null);
    const dayBgRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const cardTiltRef = useRef<HTMLDivElement>(null);
    const sheenRef = useRef<HTMLDivElement>(null);
    const [showCard, setShowCard] = React.useState(false);

    // Tilt 3D interactivo de la tarjeta de contacto (sigue al mouse)
    const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardTiltRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `rotateY(${(px * 10).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg)`;
        const sheen = sheenRef.current;
        if (sheen) {
            sheen.style.opacity = '1';
            sheen.style.background = `radial-gradient(460px circle at ${((px + 0.5) * 100).toFixed(1)}% ${((py + 0.5) * 100).toFixed(1)}%, rgba(255,235,205,0.16), transparent 62%)`;
        }
    };
    const resetCardTilt = () => {
        if (cardTiltRef.current) cardTiltRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
        if (sheenRef.current) sheenRef.current.style.opacity = '0';
    };

    // Vista de cámara activa: 0 = Vuelo (chase), 1 = Cine (lateral), 2 = Aérea
    const [viewMode, setViewMode] = React.useState(0);
    const viewModeRef = useRef(0);
    const applyView = (mode: number) => {
        viewModeRef.current = mode;
        setViewMode(mode);
    };

    useEffect(() => {
        if (!mountRef.current) return;

        // Verificar soporte de WebGL de antemano
        const hasWebGL = () => {
            try {
                const canvas = document.createElement('canvas');
                return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
            } catch (e) {
                return false;
            }
        };

        if (!hasWebGL()) {
            console.warn("WebGL no está soportado en este navegador. Se mostrará el fondo estático degradado.");
            setShowCard(true);
            return;
        }

        // Variables de escena
        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, animationFrameId: number;
        let particles: THREE.Points, snowPoints: THREE.Points, lensSnowPoints: THREE.Points, terrain: THREE.Mesh, floraGroup: THREE.Group, mountainGroup: THREE.Group, raysGroup: THREE.Group, butterfliesGroup: THREE.Group;
        let butterflyGroup: THREE.Group, butterflyMeshGroup: THREE.Group;
        let guideWingRootL: THREE.Group, guideWingRootR: THREE.Group, guideHindL: THREE.Mesh, guideHindR: THREE.Mesh;
        let monarchForeTex: THREE.CanvasTexture | null = null, monarchHindTex: THREE.CanvasTexture | null = null;
        let cloudyMountainGroup: THREE.Group, cloudsGroup: THREE.Group;
        let treesGroup: THREE.Group, sunGlowGroup: THREE.Group;
        let trailGroup: THREE.Group;
        let hemiLight: THREE.HemisphereLight, dirLight: THREE.DirectionalLight;
        let snowMat: THREE.MeshStandardMaterial, giantSnowMat: THREE.MeshStandardMaterial;
        let sunGlowMesh: THREE.Mesh;
        let skyMesh: THREE.Mesh, skyMat: THREE.ShaderMaterial;
        let moonSprite: THREE.Sprite;
        let shootingStars: THREE.Sprite[] = [];
        let butterflyLight: THREE.PointLight;
        let composer: EffectComposer | null = null;
        let sharedSparkGeom: THREE.DodecahedronGeometry;
        const sunDirVec = new THREE.Vector3(0.22, 0.34, -0.91).normalize();
        const moonDirVec = new THREE.Vector3(-0.48, 0.50, -0.72).normalize();
        // Mirada suavizada de cámara (permite paneos cinematográficos al cambiar de vista)
        const lookTarget = new THREE.Vector3(0, 3, 10);
        const lookDesired = new THREE.Vector3();

        // Variables de interacción
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let scrollDepth = 0, targetScrollDepth = 0;
        let lastNearEnd = false;
        let turnFactor = 0;
        let lastTrailSpawnTime = 0;
        let trickStart = -1;
        // Estado del vuelo real de la mariposa guía (ráfagas de aleteo / planeos)
        let guideFlapPhase = 0;
        let guideEnergy = 1;
        let guideGliding = false;
        let guideModeUntil = 0;
        
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        const clock = new THREE.Clock();

        // Inicialización
        function init() {
            scene = new THREE.Scene();
            // Dejar el fondo transparente para traslucir el degradado épico de atardecer CSS
            scene.background = null;
            scene.fog = new THREE.FogExp2(0x32254f, 0.009); // Neblina de atardecer índigo-violácea muy suave 

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
            camera.position.set(0, 5, 20); 

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 1.75));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;

            if (mountRef.current) {
                mountRef.current.appendChild(renderer.domElement);
            }

            // Post-procesado con Bloom cinematográfico (solo desktop para cuidar GPUs móviles)
            if (window.innerWidth >= 768) {
                composer = new EffectComposer(renderer);
                composer.addPass(new RenderPass(scene, camera));
                const bloomPass = new UnrealBloomPass(
                    new THREE.Vector2(window.innerWidth, window.innerHeight),
                    0.42,  // strength: sutil, realza luciérnagas, sol y alas emisivas
                    0.7,   // radius
                    0.78   // threshold
                );
                composer.addPass(bloomPass);
                composer.addPass(new OutputPass());
            }

            // Listeners
            window.addEventListener('mousemove', onDocumentMouseMove);
            window.addEventListener('wheel', onDocumentWheel, { passive: true });
            window.addEventListener('touchstart', onDocumentTouchStart, { passive: true });
            window.addEventListener('touchmove', onDocumentTouchMove, { passive: true });
            window.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('resize', onWindowResize);

            createEnvironment();
            createGuideButterfly();
            animate();
        }

        function createEnvironment() {
            // Luces
            hemiLight = new THREE.HemisphereLight(0xffffff, 0x886666, 0.7);
            hemiLight.position.set(0, 50, 0);
            scene.add(hemiLight);

            dirLight = new THREE.DirectionalLight(colors.sun, 1.5);
            // Alineada con el sol visible en el cielo (contraluz dorado de atardecer)
            dirLight.position.set(30, 42, -55);
            scene.add(dirLight);

            // Terreno
            const terrainGeometry = new THREE.PlaneGeometry(400, 800, 80, 160);
            terrainGeometry.rotateX(-Math.PI / 2); 

            const positionAttribute = terrainGeometry.attributes.position;
            const terrainColors = new Float32Array(positionAttribute.count * 3);
            const groundColor = new THREE.Color(colors.ground);
            const deepValleyColor = new THREE.Color(0x3e4d26); // Verde oscuro boscoso húmedo
            const terrainSnowColor = new THREE.Color(0xfffaf0);  // Nieve atardecer cálida
            const vertex = new THREE.Vector3();
            for (let i = 0; i < positionAttribute.count; i++) {
                vertex.fromBufferAttribute(positionAttribute, i);
                const worldX = vertex.x;
                const worldZ = vertex.z - 300; 
                
                const y = getTerrainHeight(worldX, worldZ);
                positionAttribute.setY(i, y);

                // Gradiente topográfico realista multietapa
                let finalColor = new THREE.Color(colors.ground);
                
                if (y < 0.0) {
                    // Valle profundo (vaguadas y lechos del río): musgoso y umbrío
                    const t = Math.min(1.0, Math.abs(y) / 8.0);
                    finalColor.lerpColors(groundColor, deepValleyColor, t * 0.7);
                } else if (y > 2.5) {
                    // Crestas y cumbres del terreno: nieve cálida expuesta al sol
                    const t = Math.min(1.0, (y - 2.5) / 4.8);
                    const smoothT = Math.sin(t * Math.PI / 2);
                    finalColor.lerpColors(groundColor, terrainSnowColor, smoothT * 0.72);
                }

                terrainColors[i * 3] = finalColor.r;
                terrainColors[i * 3 + 1] = finalColor.g;
                terrainColors[i * 3 + 2] = finalColor.b;
            }
            terrainGeometry.setAttribute('color', new THREE.BufferAttribute(terrainColors, 3));
            terrainGeometry.computeVertexNormals();

            const terrainMaterial = new THREE.MeshStandardMaterial({
                vertexColors: true, roughness: 0.9, flatShading: true 
            });

            terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
            terrain.position.z = -300; 
            scene.add(terrain);

            // Montañas (Con nieve física difuminada y base enterrada para que no floten!)
            mountainGroup = new THREE.Group();
            scene.add(mountainGroup);
            
            const mountainMat = new THREE.MeshStandardMaterial({ color: colors.mountain, flatShading: true, roughness: 0.95 });
            snowMat = new THREE.MeshStandardMaterial({
                vertexColors: true, // Habilitar soporte de colores degradados por vértice
                flatShading: false,
                roughness: 0.9, 
                metalness: 0.0,
                emissive: new THREE.Color(0x2d1815), // Emisión cálida de atardecer
                emissiveIntensity: 0.35
            });
            
            for (let i = 0; i < 100; i++) {
                const z = (Math.random() - 0.5) * 800 - 300;
                const pathX = getPathX(z);
                const side = Math.random() > 0.5 ? 1 : -1;
                const offset = 45 + Math.random() * 80; 
                const x = pathX + (side * offset);

                const base = 20 + Math.random() * 30;
                const height = 40 + Math.random() * 80;
                const y = getTerrainHeight(x, z);

                const mountain = createBeautifulMountain(base, height, mountainMat, snowMat);
                // Enterrar la base de la montaña 6 unidades dentro del terreno para evitar que flote
                mountain.position.set(x, y - 6.0, z);
                mountain.rotation.y = Math.random() * Math.PI;

                mountain.scale.set(1, 1, 1); 
                mountain.userData = { targetScale: 1, currentScale: 1, active: true, speed: 0.03 };
                mountainGroup.add(mountain);
            }

            // Montaña Nublada Final (Enterrada 22 unidades!)
            cloudyMountainGroup = new THREE.Group();
            const endZ = -600;
            const endX = getPathX(endZ);
            const endY = getTerrainHeight(endX, endZ);
            
            const giantMtnMat = new THREE.MeshStandardMaterial({ color: 0x48583b, roughness: 0.95, flatShading: true });
            giantSnowMat = new THREE.MeshStandardMaterial({ 
                vertexColors: true, 
                flatShading: false, 
                roughness: 0.9, 
                metalness: 0.0,
                emissive: new THREE.Color(0x221110), // Emisión atardecer gigante
                emissiveIntensity: 0.35
            });
            const giantMtn = generateRealisticPeak(150, 280, giantMtnMat, giantSnowMat);
            cloudyMountainGroup.add(giantMtn);
            
            // Enterrar montaña final
            cloudyMountainGroup.position.set(endX, endY - 22.0, endZ);

            cloudsGroup = new THREE.Group();
            const cloudGeom = new THREE.IcosahedronGeometry(25, 1);
            const cloudMat = new THREE.MeshStandardMaterial({ color: 0xfff5ea, roughness: 1, transparent: true, opacity: 0.9, flatShading: true });
            
            for (let i = 0; i < 60; i++) {
                const cloud = new THREE.Mesh(cloudGeom, cloudMat);
                const angle = Math.random() * Math.PI * 2;
                const radius = 60 + Math.random() * 80;
                const h = 80 + Math.random() * 120; 
                
                cloud.position.set(Math.cos(angle) * radius, h, Math.sin(angle) * radius);
                cloud.scale.set(1 + Math.random()*1.5, 0.5 + Math.random()*0.5, 1 + Math.random()*1.5);
                cloud.rotation.y = Math.random() * Math.PI;
                cloudsGroup.add(cloud);
            }
            cloudyMountainGroup.add(cloudsGroup);
            scene.add(cloudyMountainGroup);

            // Bosque de Árboles (Pinos y Árboles Frondosos enterrados 1.2 unidades)
            treesGroup = new THREE.Group();
            scene.add(treesGroup);
            
            const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e2e, roughness: 0.95, flatShading: true });
            const treeFoliageMats = [
                new THREE.MeshStandardMaterial({ color: 0x2d521d, roughness: 0.9, flatShading: true }), 
                new THREE.MeshStandardMaterial({ color: 0x3d6e2a, roughness: 0.9, flatShading: true }), 
                new THREE.MeshStandardMaterial({ color: 0x1f3c12, roughness: 0.95, flatShading: true }), 
                new THREE.MeshStandardMaterial({ color: 0x477832, roughness: 0.9, flatShading: true })  
            ];

            for (let i = 0; i < 200; i++) {
                const z = (Math.random() - 0.5) * 800 - 300;
                const pathX = getPathX(z);
                const side = Math.random() > 0.5 ? 1 : -1;
                const offset = 18 + Math.random() * 60; 
                const x = pathX + (side * offset);
                const y = getTerrainHeight(x, z);

                const height = 6 + Math.random() * 9;
                const folMat = treeFoliageMats[Math.floor(Math.random() * treeFoliageMats.length)];
                const tree = createRealisticTree(height, treeTrunkMat, folMat, snowMat);
                // Enterrar 1.2 unidades para enraizar perfectamente
                const tScale = Math.random() * 0.4 + 0.8;
                tree.position.set(x, y - 1.2, z);
                tree.scale.set(tScale, tScale, tScale); 
                tree.userData = {
                    targetScale: tScale,
                    currentScale: tScale,
                    active: true,
                    isTree: true,
                    speed: Math.random() * 0.03 + 0.015,
                    baseRotX: tree.rotation.x,
                    baseRotZ: tree.rotation.z
                };
                treesGroup.add(tree);
            }

            // Flora Abundante (500 Flores enterradas 0.4 unidades)
            floraGroup = new THREE.Group();
            scene.add(floraGroup);

            const stemMat = new THREE.MeshStandardMaterial({ color: 0x6a8a3e, flatShading: true, roughness: 0.8 });
            const leafMat = new THREE.MeshStandardMaterial({ color: 0x5a7a2e, flatShading: true, roughness: 0.8 });
            const redMat = new THREE.MeshStandardMaterial({ color: 0xF44336, flatShading: true }); 
            const blueMat = new THREE.MeshStandardMaterial({ color: 0xB3E5FC, flatShading: true }); 
            const yellowMat = new THREE.MeshStandardMaterial({ color: 0xFFC107, flatShading: true }); 
            const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x2E4D30, flatShading: true }); 
            
            const tallStemGeom = new THREE.CylinderGeometry(0.12, 0.18, 1, 6);
            tallStemGeom.translate(0, 0.5, 0); 
            
            const bigLeafGeom = new THREE.SphereGeometry(0.6, 8, 8);
            bigLeafGeom.scale(1, 0.1, 2);

            for (let i = 0; i < 500; i++) { 
                const z = (Math.random() - 0.5) * 800 - 300; 
                const pathX = getPathX(z);
                const side = Math.random() > 0.5 ? 1 : -1;
                const offset = 8 + Math.random() * 45; 
                const x = pathX + (side * offset);
                const y = getTerrainHeight(x, z);
                
                const flowerType = Math.floor(Math.random() * 4); 
                const flower = new THREE.Group();
                // Enterrar 0.4 unidades
                flower.position.set(x, y - 0.4, z); 
                const fScale = Math.random() * 0.6 + 0.8;
                flower.scale.set(fScale, fScale, fScale);
                flower.userData = { targetScale: fScale, currentScale: fScale, active: true, speed: Math.random() * 0.03 + 0.01 };
                
                const height = Math.random() * 2 + 3;
                const stem = new THREE.Mesh(tallStemGeom, stemMat);
                stem.scale.set(1, height, 1);
                flower.add(stem); 

                if (flowerType === 0) { 
                    const headGroup = new THREE.Group();
                    headGroup.position.set(0, height, 0);
                    const core = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), redMat);
                    core.scale.set(1, 1.2, 1);
                    headGroup.add(core);

                    const numPetals = 6;
                    const flatPetalGeom = new THREE.SphereGeometry(0.5, 8, 8);
                    for(let p=0; p<numPetals; p++) {
                        const petal = new THREE.Mesh(flatPetalGeom, blueMat);
                        petal.scale.set(1.2, 1.6, 0.3);
                        const angle = (p / numPetals) * Math.PI * 2;
                        petal.position.set(Math.cos(angle)*0.6, -0.3, Math.sin(angle)*0.6);
                        petal.rotation.y = -angle;
                        petal.rotation.x = -Math.PI / 8;
                        headGroup.add(petal);
                    }
                    flower.add(headGroup);

                    for(let l=0; l<2; l++) {
                        const leaf = new THREE.Mesh(bigLeafGeom, leafMat);
                        leaf.position.set(0, height * 0.3, 0);
                        leaf.rotation.x = Math.PI / 4;
                        leaf.rotation.y = Math.PI * l + (Math.random()-0.5);
                        flower.add(leaf);
                    }

                } else if (flowerType === 1) { 
                    const createStripedBud = () => {
                        const bud = new THREE.Group();
                        const budBase = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), yellowMat);
                        bud.add(budBase);
                        const stripes = 5;
                        const stripeGeom = new THREE.SphereGeometry(0.62, 8, 12, 0, Math.PI/5);
                        for(let s=0; s<stripes; s++) {
                            const stripe = new THREE.Mesh(stripeGeom, redMat);
                            stripe.rotation.y = (s / stripes) * Math.PI * 2;
                            bud.add(stripe);
                        }
                        return bud;
                    };

                    const mainBud = createStripedBud();
                    mainBud.position.set(0, height, 0);
                    flower.add(mainBud);

                    for(let l=0; l<3; l++) {
                        const leaf = new THREE.Mesh(bigLeafGeom, redMat); 
                        leaf.scale.set(0.5, 0.1, 0.8);
                        leaf.position.set(0, height * 0.8, 0);
                        leaf.rotation.x = Math.PI / 3;
                        leaf.rotation.y = (Math.PI*2/3)*l;
                        flower.add(leaf);
                    }

                } else if (flowerType === 2) { 
                    const headGroup = new THREE.Group();
                    headGroup.position.set(0, height, 0);
                    headGroup.rotation.x = Math.PI / 6 + Math.random()*0.2; 
                    headGroup.rotation.y = Math.random() * Math.PI * 2;

                    const center = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 12), darkGreenMat);
                    center.rotation.x = Math.PI / 2;
                    headGroup.add(center);

                    const numPetals = 12;
                    const daisyPetal = new THREE.CylinderGeometry(0.18, 0.05, 1.2, 6);
                    for(let p=0; p<numPetals; p++) {
                        const pMat = (p % 2 === 0) ? redMat : darkGreenMat;
                        const petal = new THREE.Mesh(daisyPetal, pMat);
                        const angle = (p / numPetals) * Math.PI * 2;
                        petal.position.set(Math.cos(angle)*0.7, Math.sin(angle)*0.7, 0);
                        petal.rotation.z = angle + Math.PI/2;
                        petal.scale.set(1, 1, 0.3); 
                        headGroup.add(petal);
                    }
                    flower.add(headGroup);

                } else { 
                    for(let l=0; l<4; l++) {
                        const leaf = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 6), leafMat);
                        leaf.position.set(0, height * (0.2 + l*0.22), 0);
                        leaf.rotation.x = Math.PI / 10 + (Math.random()-0.5)*0.2;
                        leaf.rotation.z = (Math.random()-0.5)*0.3;
                        flower.add(leaf);
                    }

                    const topGroup = new THREE.Group();
                    topGroup.position.set(0, height, 0);
                    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2), darkGreenMat);
                    topGroup.add(bowl);

                    const barGeom = new THREE.CylinderGeometry(0.06, 0.08, 1.8, 4);
                    for(let c=0; c<12; c++) {
                        const angle = (c/12) * Math.PI * 2;
                        const bar = new THREE.Mesh(barGeom, darkGreenMat);
                        bar.position.set(Math.cos(angle)*0.6, 0.8, Math.sin(angle)*0.6);
                        bar.rotation.y = -angle;
                        bar.rotation.x = Math.PI / 8; 
                        topGroup.add(bar);
                    }
                    
                    const pollenGeom = new THREE.SphereGeometry(0.12, 4, 4);
                    for(let p=0; p<18; p++) {
                        const pollen = new THREE.Mesh(pollenGeom, yellowMat);
                        pollen.position.set((Math.random()-0.5)*1.5, 0.5 + Math.random()*1.5, (Math.random()-0.5)*1.5);
                        topGroup.add(pollen);
                    }
                    flower.add(topGroup);
                }
                
                flower.rotation.y = Math.random() * Math.PI * 2;
                flower.rotation.x = (Math.random() - 0.5) * 0.15;
                flower.rotation.z = (Math.random() - 0.5) * 0.15;
                
                flower.userData.baseRotX = flower.rotation.x;
                flower.userData.baseRotZ = flower.rotation.z;
                floraGroup.add(flower);
            }

            // Pradera Tupida (1800 parches de Pasto enterrados 0.2 unidades)
            const grassGeom = new THREE.ConeGeometry(0.15, 1.2, 3);
            grassGeom.translate(0, 0.6, 0); 
            const grassMat = new THREE.MeshStandardMaterial({ color: 0x7c9642, flatShading: true, roughness: 0.9 });
            
            for (let i = 0; i < 1800; i++) {
                const z = (Math.random() - 0.5) * 800 - 300; 
                const pathX = getPathX(z);
                const side = Math.random() > 0.5 ? 1 : -1;
                const offset = 3 + Math.random() * 45; 
                const x = pathX + (side * offset);
                const y = getTerrainHeight(x, z);

                const grass = new THREE.Mesh(grassGeom, grassMat);
                // Enterrar 0.2 unidades
                grass.position.set(x, y - 0.2, z);
                grass.rotation.y = Math.random() * Math.PI;
                grass.rotation.x = (Math.random() - 0.5) * 0.4;
                grass.rotation.z = (Math.random() - 0.5) * 0.4;
                const gScale = Math.random() * 1 + 0.5;
                grass.scale.set(gScale, gScale, gScale);
                
                grass.userData = { 
                    targetScale: gScale, 
                    currentScale: gScale, active: true, speed: Math.random() * 0.05 + 0.02,
                    baseRotX: grass.rotation.x, baseRotZ: grass.rotation.z
                };
                floraGroup.add(grass);
            }

            // Mariposas
            butterfliesGroup = new THREE.Group();
            scene.add(butterfliesGroup);

            // Texturas anatómicas de monarca compartidas por todas las mariposas de la escena
            monarchForeTex = createMonarchForewingTexture();
            monarchHindTex = createMonarchHindwingTexture();

            // Alas horizontales (plano XZ) con pivote en la raíz: el aleteo rota alrededor
            // del eje del cuerpo, como en una mariposa real (no planos verticales)
            const bForeGeom = new THREE.PlaneGeometry(0.42, 0.36);
            bForeGeom.rotateX(-Math.PI / 2);
            bForeGeom.translate(0.21, 0.004, -0.07);
            const bHindGeom = new THREE.PlaneGeometry(0.34, 0.34);
            bHindGeom.rotateX(-Math.PI / 2);
            bHindGeom.translate(0.155, -0.004, 0.07);

            // Cuerpo realista: tórax adelante grueso, abdomen afinándose hacia atrás
            const bBodyGeom = new THREE.CylinderGeometry(0.012, 0.02, 0.3, 6);
            bBodyGeom.rotateX(Math.PI / 2);
            const bBodyMat = new THREE.MeshStandardMaterial({ color: 0x150f08, roughness: 0.95 });
            const bHeadGeom = new THREE.SphereGeometry(0.024, 8, 8);

            // Halos de luz de hada
            const bHaloTex = createFireflyTexture();
            const bHaloGeom = new THREE.PlaneGeometry(0.9, 0.9);
            const bHaloMat = new THREE.MeshBasicMaterial({
                map: bHaloTex || undefined,
                transparent: true,
                opacity: 0.65,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });

            // Variantes cromáticas: cada una necesita material de ala anterior y posterior
            const mkValleyWingMat = (tex: THREE.CanvasTexture | null, tint: number | null, emissiveCol: number) =>
                new THREE.MeshStandardMaterial({
                    map: tex || undefined,
                    color: tint !== null ? new THREE.Color(tint) : new THREE.Color(0xffffff),
                    emissive: new THREE.Color(emissiveCol),
                    emissiveMap: tex || undefined,
                    emissiveIntensity: 1.5,
                    side: THREE.DoubleSide,
                    roughness: 0.4,
                    alphaTest: 0.35
                });
            const bflyVariants = [
                // Monarca Fuego Clásica
                { fore: mkValleyWingMat(monarchForeTex, null, 0xff4500), hind: mkValleyWingMat(monarchHindTex, null, 0xff4500) },
                // Monarca de Oro Cálido
                { fore: mkValleyWingMat(monarchForeTex, 0xffd700, 0xff8c00), hind: mkValleyWingMat(monarchHindTex, 0xffd700, 0xff8c00) },
                // Monarca Cian Etérea
                { fore: mkValleyWingMat(monarchForeTex, 0x88e8ff, 0x0088ff), hind: mkValleyWingMat(monarchHindTex, 0x88e8ff, 0x0088ff) }
            ];

            for (let i = 0; i < 14; i++) {
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
                halo.position.y = 0.05;

                bGroup.add(rootL, rootR, body, bHead, halo);

                const z = (Math.random() - 0.5) * 800 - 300;
                const x = getPathX(z) + (Math.random() - 0.5) * 40;
                const y = getTerrainHeight(x, z) + 1.5 + Math.random() * 4;

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

            // Halos de Sol Ultra Realistas (Shader de Volumen de Luz con Shimmer)
            raysGroup = new THREE.Group();
            scene.add(raysGroup);

            const rayGeom = new THREE.CylinderGeometry(1, 15, 140, 16, 1, true);
            rayGeom.translate(0, -70, 0); // Pivote arriba

            const rayShaderMat = new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: new THREE.Color(0xffebd2) }, // Halo dorado suave
                    uTime: { value: 0 },
                    uSpeed: { value: 1.0 },
                    uOffset: { value: 0.0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uTime;
                    uniform float uSpeed;
                    uniform float uOffset;
                    varying vec2 vUv;
                    void main() {
                        // Atenuación suave hacia la base (vUv.y es 0 abajo, 1 arriba)
                        float verticalFade = pow(vUv.y, 2.0);
                        
                        // Centello crepuscular sutil
                        float shimmer = 0.65 + 0.35 * sin(uTime * 1.6 * uSpeed + uOffset + vUv.x * 6.28);
                        
                        // Suavizado en bordes radiales locales
                        float sideFade = sin(vUv.x * 3.14159);
                        
                        float alpha = 0.012 * verticalFade * shimmer * sideFade;
                        gl_FragColor = vec4(uColor, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });

            for (let i = 0; i < 5; i++) {
                const mat = rayShaderMat.clone();
                mat.uniforms.uSpeed.value = 0.4 + Math.random() * 0.8;
                mat.uniforms.uOffset.value = Math.random() * 10;
                
                const ray = new THREE.Mesh(rayGeom, mat);
                const z = (Math.random() - 0.5) * 800 - 300;
                const x = getPathX(z) + (Math.random() - 0.5) * 35;
                
                ray.position.set(x, 70, z); 
                ray.rotation.z = Math.PI / 9 + (Math.random() - 0.5) * 0.05;
                ray.rotation.x = Math.PI / 11 + (Math.random() - 0.5) * 0.05;
                raysGroup.add(ray);
            }

            // Halo Solar Atmosférico Ultra Realista (Filtro Solar Suave y Esponjoso)
            sunGlowGroup = new THREE.Group();
            scene.add(sunGlowGroup);
            
            const sunTex = createSunGlowTexture();
            const sunGlowGeom = new THREE.PlaneGeometry(160, 160);
            const sunGlowMat = new THREE.MeshBasicMaterial({
                map: sunTex || undefined,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false,
                fog: false // Sin esto, la niebla exponencial apaga el sol por completo a esta distancia
            });
            sunGlowMesh = new THREE.Mesh(sunGlowGeom, sunGlowMat);
            sunGlowMesh.position.set(100, 160, -420);
            sunGlowGroup.add(sunGlowMesh);

            // Partículas de polen flotantes
            const particleCount = 1000;
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesPositions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i+=3) {
                particlesPositions[i] = (Math.random() - 0.5) * 150;     
                particlesPositions[i+1] = Math.random() * 30;            
                particlesPositions[i+2] = (Math.random() - 0.5) * 200 - 40; 
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
            
            const fireflyTex = createFireflyTexture();
            const particlesMaterial = new THREE.PointsMaterial({ 
                color: 0xd4ff55, // Hermosa tonalidad verde-amarilla luciérnaga clásica
                size: 0.65,      // Tamaño más discreto y sutil
                map: fireflyTex || undefined,
                transparent: true, 
                opacity: 0.95, 
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);

            // Sistema de Nieve Cayendo Ultra Inmersivo (Partículas de Nieve Tridimensionales)
            const snowCount = 2000;
            const snowGeometry = new THREE.BufferGeometry();
            const snowPositions = new Float32Array(snowCount * 3);
            const snowSpeeds = new Float32Array(snowCount);
            const snowWiggleSpeeds = new Float32Array(snowCount);
            const snowOffsets = new Float32Array(snowCount);

            // Rango tridimensional alrededor de la cámara
            for (let i = 0; i < snowCount; i++) {
                snowPositions[i*3] = (Math.random() - 0.5) * 120;   // X
                snowPositions[i*3+1] = Math.random() * 40;         // Y
                snowPositions[i*3+2] = (Math.random() - 0.5) * 160; // Z
                
                snowSpeeds[i] = 0.05 + Math.random() * 0.08;      // Velocidad de caída
                snowWiggleSpeeds[i] = 0.8 + Math.random() * 1.5;   // Velocidad de oscilación
                snowOffsets[i] = Math.random() * Math.PI * 2;     // Desplazamiento inicial de fase
            }

            snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
            
            const snowTex = createSnowflakeTexture();
            const snowMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.55,
                map: snowTex || undefined,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            snowPoints = new THREE.Points(snowGeometry, snowMaterial);
            scene.add(snowPoints);

            // Grupo para el rastro de polen dorado
            trailGroup = new THREE.Group();
            scene.add(trailGroup);

            // Sistema de Nieve Cercana (Lente / Bokeh Foregrounds)
            const lensSnowCount = 120;
            const lensSnowGeometry = new THREE.BufferGeometry();
            const lensSnowPositions = new Float32Array(lensSnowCount * 3);
            
            for (let i = 0; i < lensSnowCount; i++) {
                // Distribuidos muy cerca de la línea de vuelo del espectador
                lensSnowPositions[i*3] = (Math.random() - 0.5) * 25; // X
                lensSnowPositions[i*3+1] = (Math.random() - 0.5) * 15 + 4; // Y
                lensSnowPositions[i*3+2] = (Math.random() - 0.5) * 50; // Z
            }
            lensSnowGeometry.setAttribute('position', new THREE.BufferAttribute(lensSnowPositions, 3));
            
            const lensSnowMat = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 2.2, // Grandes, simulando desenfoque Bokeh en primer plano
                map: snowTex || undefined,
                transparent: true,
                opacity: 0.38,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            lensSnowPoints = new THREE.Points(lensSnowGeometry, lensSnowMat);
            scene.add(lensSnowPoints);

            // Geometría compartida para todas las chispas (evita crear/destruir geometría por partícula)
            sharedSparkGeom = new THREE.DodecahedronGeometry(0.09, 0);

            // === CÚPULA DE CIELO PROCEDURAL (degradado + estrellas titilantes + aurora + halo solar) ===
            const skyGeom = new THREE.SphereGeometry(700, 32, 24);
            skyMat = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uDay: { value: 0 },
                    uSunDir: { value: sunDirVec.clone() }
                },
                vertexShader: `
                    varying vec3 vDir;
                    void main() {
                        vDir = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float uTime;
                    uniform float uDay;
                    uniform vec3 uSunDir;
                    varying vec3 vDir;

                    float hash21(vec2 p) {
                        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                    }

                    void main() {
                        vec3 d = normalize(vDir);
                        float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);

                        // Degradado crepuscular (réplica del fondo CSS original)
                        vec3 tw = mix(vec3(0.486, 0.298, 0.259), vec3(0.337, 0.200, 0.322), smoothstep(0.0, 0.16, h));
                        tw = mix(tw, vec3(0.196, 0.145, 0.310), smoothstep(0.16, 0.40, h));
                        tw = mix(tw, vec3(0.145, 0.071, 0.286), smoothstep(0.40, 0.62, h));
                        tw = mix(tw, vec3(0.082, 0.035, 0.165), smoothstep(0.62, 0.82, h));
                        tw = mix(tw, vec3(0.035, 0.012, 0.071), smoothstep(0.82, 1.0, h));

                        // Degradado diurno brillante
                        vec3 day = mix(vec3(0.941, 0.976, 1.0), vec3(0.561, 0.820, 1.0), smoothstep(0.02, 0.30, h));
                        day = mix(day, vec3(0.306, 0.635, 1.0), smoothstep(0.30, 0.60, h));
                        day = mix(day, vec3(0.102, 0.451, 0.910), smoothstep(0.60, 1.0, h));

                        vec3 col = mix(tw, day, uDay);

                        // Halo solar integrado al cielo
                        float sunDot = max(dot(d, uSunDir), 0.0);
                        vec3 sunCol = mix(vec3(1.0, 0.58, 0.30), vec3(1.0, 0.95, 0.85), uDay);
                        col += sunCol * (pow(sunDot, 24.0) * 1.25 + pow(sunDot, 6.0) * 0.28);

                        // Estrellas titilantes (solo de noche y sobre el horizonte)
                        float night = 1.0 - uDay;
                        float starMask = smoothstep(0.03, 0.25, d.y) * night;
                        if (starMask > 0.001) {
                            vec2 sp = d.xz / (d.y + 0.65);
                            vec2 grid = sp * 120.0;
                            vec2 cell = floor(grid);
                            float r = hash21(cell);
                            if (r > 0.991) {
                                vec2 f = fract(grid) - 0.5;
                                float core = 1.0 - smoothstep(0.05, 0.30, length(f));
                                float twk = 0.55 + 0.45 * sin(uTime * (1.5 + hash21(cell + 3.7) * 3.5) + hash21(cell * 1.93) * 6.2831);
                                col += vec3(0.85, 0.92, 1.0) * core * twk * starMask;
                            }
                        }

                        // Aurora boreal sutil ondulante
                        float aurBand = smoothstep(0.20, 0.42, h) * (1.0 - smoothstep(0.55, 0.92, h));
                        float wave = sin(d.x * 5.0 + uTime * 0.22 + sin(d.z * 3.0 + uTime * 0.15) * 1.8);
                        float wave2 = sin(d.x * 9.0 - uTime * 0.17 + d.z * 4.0);
                        float aur = max(0.0, wave * 0.7 + wave2 * 0.3) * aurBand;
                        vec3 aurCol = mix(vec3(0.15, 0.85, 0.55), vec3(0.55, 0.30, 0.95), 0.5 + 0.5 * sin(uTime * 0.08 + d.x * 2.0));
                        col += aurCol * aur * 0.085 * night;

                        gl_FragColor = vec4(col, 1.0);
                    }
                `,
                side: THREE.BackSide,
                depthWrite: false
            });
            skyMesh = new THREE.Mesh(skyGeom, skyMat);
            skyMesh.renderOrder = -2;
            skyMesh.frustumCulled = false;
            scene.add(skyMesh);

            // === LUNA con cráteres y halo (se desvanece al amanecer) ===
            const moonTex = createMoonTexture();
            const moonMat = new THREE.SpriteMaterial({
                map: moonTex || undefined,
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                fog: false
            });
            moonSprite = new THREE.Sprite(moonMat);
            moonSprite.scale.set(46, 46, 1);
            scene.add(moonSprite);

            // === ESTRELLAS FUGACES (pool de 3, reutilizables) ===
            const streakTex = createStreakTexture();
            shootingStars = [];
            for (let i = 0; i < 3; i++) {
                const starMat = new THREE.SpriteMaterial({
                    map: streakTex || undefined,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    fog: false
                });
                const star = new THREE.Sprite(starMat);
                star.scale.set(26, 1.1, 1);
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

        }

        function createGuideButterfly() {
            butterflyGroup = new THREE.Group();
            butterflyMeshGroup = new THREE.Group();
            butterflyGroup.add(butterflyMeshGroup);

            // Alas con las texturas anatómicas compartidas. Emisión moderada para que
            // las venas y manchas de la textura no se laven con el bloom.
            const foreTex = monarchForeTex || createMonarchForewingTexture();
            const hindTex = monarchHindTex || createMonarchHindwingTexture();
            const mkGuideWingMat = (tex: THREE.CanvasTexture | null) => new THREE.MeshStandardMaterial({
                map: tex || undefined,
                emissive: new THREE.Color(0xff5a00),
                emissiveMap: tex || undefined,
                emissiveIntensity: 0.85,
                side: THREE.DoubleSide,
                roughness: 0.45,
                alphaTest: 0.35
            });
            const foreMat = mkGuideWingMat(foreTex);
            const hindMat = mkGuideWingMat(hindTex);

            // 4 alas extendidas en horizontal como una monarca real en vuelo:
            // anteriores barridas hacia adelante, posteriores en abanico hacia atrás,
            // solapadas (la posterior pasa por debajo de la anterior)
            const foreGeom = new THREE.PlaneGeometry(1.0, 0.85);
            foreGeom.rotateX(-Math.PI / 2);
            foreGeom.translate(0.5, 0.006, -0.16);
            const hindGeom = new THREE.PlaneGeometry(0.8, 0.8);
            hindGeom.rotateX(-Math.PI / 2);
            hindGeom.translate(0.36, -0.006, 0.16);

            const mkWingSide = (sign: number) => {
                const root = new THREE.Group();
                const fore = new THREE.Mesh(foreGeom, foreMat);
                const hind = new THREE.Mesh(hindGeom, hindMat);
                root.add(fore, hind);
                root.position.set(sign * 0.03, 0.02, -0.06);
                root.scale.x = sign; // lado derecho espejado
                return { root, hind };
            };
            const sideL = mkWingSide(1);
            const sideR = mkWingSide(-1);
            guideWingRootL = sideL.root;
            guideWingRootR = sideR.root;
            guideHindL = sideL.hind;
            guideHindR = sideR.hind;

            // Cuerpo real de monarca: tórax robusto, abdomen esbelto que cae apenas
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x16100a, roughness: 0.9 });
            const shinyBlackMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.8 });
            const whitePupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const whiteDotMat = new THREE.MeshBasicMaterial({ color: 0xf5efe2 });

            const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), bodyMat);
            thorax.scale.set(1, 1, 1.55);
            thorax.position.set(0, 0.01, -0.1);

            const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 9), bodyMat);
            abdomen.scale.set(1, 0.95, 2.9);
            abdomen.position.set(0, -0.012, 0.17);
            abdomen.rotation.x = -0.14; // cola levemente caída

            // Moteado blanco característico del tórax de la monarca
            const dotGeom = new THREE.SphereGeometry(0.011, 5, 5);
            const dotPositions: Array<[number, number, number]> = [
                [0.05, 0.062, -0.2], [-0.05, 0.062, -0.2],
                [0.074, 0.025, -0.12], [-0.074, 0.025, -0.12],
                [0.05, 0.06, -0.02], [-0.05, 0.06, -0.02]
            ];
            const thoraxDots = dotPositions.map(([dx, dy, dz]) => {
                const dot = new THREE.Mesh(dotGeom, whiteDotMat);
                dot.position.set(dx, dy, dz);
                return dot;
            });

            const head = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), bodyMat);
            head.position.set(0, 0.025, -0.3);

            // Ojitos amigables (conserva el encanto del guía anterior, más discretos)
            const eyeGeom = new THREE.SphereGeometry(0.04, 10, 10);
            const pupilGeom = new THREE.SphereGeometry(0.015, 6, 6);
            const eyeR = new THREE.Mesh(eyeGeom, shinyBlackMat);
            eyeR.position.set(0.048, 0.018, -0.05);
            const pupilR = new THREE.Mesh(pupilGeom, whitePupilMat);
            pupilR.position.set(0.016, 0.013, -0.027);
            eyeR.add(pupilR);
            head.add(eyeR);
            const eyeL = new THREE.Mesh(eyeGeom, shinyBlackMat);
            eyeL.position.set(-0.048, 0.018, -0.05);
            const pupilL = new THREE.Mesh(pupilGeom, whitePupilMat);
            pupilL.position.set(-0.016, 0.013, -0.027);
            eyeL.add(pupilL);
            head.add(eyeL);

            // Antenas curvadas hacia adelante con puntitas luminosas
            const antGeom = new THREE.CylinderGeometry(0.007, 0.004, 0.4, 4);
            antGeom.translate(0, 0.2, 0);
            const antTipGeom = new THREE.SphereGeometry(0.018, 6, 6);
            const antTipMat = new THREE.MeshBasicMaterial({ color: 0xffd27f });

            const antL = new THREE.Mesh(antGeom, bodyMat);
            antL.position.set(-0.04, 0.07, -0.33);
            antL.rotation.x = -Math.PI / 3.2;
            antL.rotation.z = Math.PI / 9;
            const tipL = new THREE.Mesh(antTipGeom, antTipMat);
            tipL.position.set(0, 0.4, 0);
            antL.add(tipL);

            const antR = new THREE.Mesh(antGeom, bodyMat);
            antR.position.set(0.04, 0.07, -0.33);
            antR.rotation.x = -Math.PI / 3.2;
            antR.rotation.z = -Math.PI / 9;
            const tipR = new THREE.Mesh(antTipGeom, antTipMat);
            tipR.position.set(0, 0.4, 0);
            antR.add(tipR);

            // Halo de hada suave (sprite con billboard automatico)
            const haloTex = createSoftGlowTexture();
            const haloMat = new THREE.SpriteMaterial({
                map: haloTex || undefined,
                color: 0xffa54d,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const halo = new THREE.Sprite(haloMat);
            halo.scale.set(2.6, 2.6, 1);
            halo.position.set(0, 0.1, 0);

            butterflyMeshGroup.add(guideWingRootL, guideWingRootR, thorax, abdomen, ...thoraxDots, head, antL, antR);
            butterflyGroup.add(halo);
            butterflyMeshGroup.rotation.y = Math.PI; // Inclinación hacia adelante

            // Luz tenue de luciérnaga: apenas acaricia el pasto cercano, sin encandilar
            butterflyLight = new THREE.PointLight(0xffc98a, 8, 16, 2.0);
            butterflyLight.position.set(0, 0.3, 0);
            butterflyGroup.add(butterflyLight);

            butterflyGroup.position.set(0, 5, 10);
            butterflyGroup.scale.set(1.6, 1.6, 1.6);
            scene.add(butterflyGroup);
        }

        // Manejadores de Eventos
        function onDocumentMouseMove(event: MouseEvent) {
            mouseX = (event.clientX - windowHalfX) / windowHalfX;
            mouseY = (event.clientY - windowHalfY) / windowHalfY;
        }
        function onDocumentWheel(event: WheelEvent) {
            targetScrollDepth += event.deltaY * 0.06;
            if (targetScrollDepth < -20) targetScrollDepth = -20;
            if (targetScrollDepth > 500) targetScrollDepth = 500; 
        }
        function onWindowResize() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer?.setSize(window.innerWidth, window.innerHeight);
        }
        function onDocumentTouchStart(event: TouchEvent) {
            if (event.touches.length > 0) {
                mouseX = (event.touches[0].pageX - windowHalfX) / windowHalfX;
                mouseY = (event.touches[0].pageY - windowHalfY) / windowHalfY;
            }
        }
        function onDocumentTouchMove(event: TouchEvent) {
            if (event.touches.length > 0) {
                mouseX = (event.touches[0].pageX - windowHalfX) / windowHalfX;
                mouseY = (event.touches[0].pageY - windowHalfY) / windowHalfY;
                targetScrollDepth -= (event.touches[0].pageY - windowHalfY) * 0.05;
                if (targetScrollDepth < -20) targetScrollDepth = -20;
                if (targetScrollDepth > 500) targetScrollDepth = 500;
            }
        }

        // Explosión de chispas doradas con velocidad y gravedad propias
        function spawnBurst(center: THREE.Vector3, count: number, speed: number, color: number = 0xffdf66) {
            if (!trailGroup || !sharedSparkGeom) return;
            for (let i = 0; i < count; i++) {
                const sparkMat = new THREE.MeshBasicMaterial({
                    color: Math.random() < 0.25 ? 0xfff6e0 : color,
                    transparent: true,
                    opacity: 0.95,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                const spark = new THREE.Mesh(sharedSparkGeom, sparkMat);
                const baseScale = 0.7 + Math.random() * 0.9;
                spark.scale.set(baseScale, baseScale, baseScale);
                spark.position.copy(center);
                const vel = new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.2,
                    Math.random() - 0.5
                ).normalize().multiplyScalar(speed * (0.4 + Math.random() * 0.8));
                spark.userData = { age: 0, maxAge: 50 + Math.random() * 40, vel, shared: true, baseScale };
                trailGroup.add(spark);
            }
            // Tope de partículas vivas para no degradar FPS con clicks frenéticos
            while (trailGroup.children.length > 340) {
                const oldest = trailGroup.children[0] as THREE.Mesh;
                trailGroup.remove(oldest);
                (oldest.material as THREE.Material).dispose();
                if (!oldest.userData.shared) oldest.geometry.dispose();
            }
        }

        function onKeyDown(event: KeyboardEvent) {
            // Teclas 1 / 2 / 3 cambian la vista de cámara
            if (event.key === '1' || event.key === '2' || event.key === '3') {
                const mode = Number(event.key) - 1;
                viewModeRef.current = mode;
                setViewMode(mode);
            }
        }

        function onPointerDown(event: PointerEvent) {
            // Ignorar clicks sobre la UI (tarjeta, botones, links)
            const target = event.target as HTMLElement | null;
            if (target && target.closest('[data-ui]')) return;
            if (!camera) return;

            const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
            const ndcY = -(event.clientY / window.innerHeight) * 2 + 1;
            const worldPoint = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
            const dir = worldPoint.sub(camera.position).normalize();
            const burstPoint = camera.position.clone().addScaledVector(dir, 13);

            spawnBurst(burstPoint, 24, 5.5);
            // La mariposa celebra con una pirueta de barril
            trickStart = clock.elapsedTime;
        }

        // Loop principal
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.05);
            const time = clock.elapsedTime;

            scrollDepth += (targetScrollDepth - scrollDepth) * 0.05;
            const currentZ = 30 - scrollDepth;
            const currentPathX = getPathX(currentZ);

            // Control de visibilidad de la tarjeta
            const nearEnd = scrollDepth > 400;
            if (nearEnd !== lastNearEnd) {
                lastNearEnd = nearEnd;
                setShowCard(nearEnd);
            }

            // --- SISTEMA DE VISTAS DE CÁMARA (Vuelo / Cine / Aérea) ---
            // Al llegar al final siempre volvemos a la vista de vuelo para encuadrar la tarjeta
            const effectiveView = turnFactor > 0.25 ? 0 : viewModeRef.current;
            const bob = Math.sin(time * 0.85) * 0.25; // Respiración suave de vuelo
            const pathBank = THREE.MathUtils.clamp(
                (getPathX(currentZ - 8) - getPathX(currentZ + 8)) * 0.02,
                -0.18, 0.18
            );

            let targetZ = currentZ;
            let bankAmt = pathBank + mouseX * 0.05;

            if (effectiveView === 1 && butterflyGroup) {
                // Vista cinematográfica: travelling lateral que sigue a la mariposa desde el costado
                const sideZ = currentZ - 7;
                targetX = getPathX(currentZ - 12) + 13 + mouseX * 2;
                targetY = Math.max(6.5 + mouseY * 1.5, getTerrainHeight(targetX, sideZ) + 3.5) + bob * 0.5;
                targetZ = sideZ;
                lookDesired.set(
                    butterflyGroup.position.x,
                    butterflyGroup.position.y + 0.3,
                    butterflyGroup.position.z
                );
                bankAmt = mouseX * 0.03;
            } else if (effectiveView === 2) {
                // Vista aérea: panorámica alta del valle completo
                targetX = currentPathX + mouseX * 10;
                targetY = 24 + mouseY * 5 + bob;
                targetZ = currentZ + 4;
                const aheadZ = currentZ - 32;
                lookDesired.set(getPathX(aheadZ), 2, aheadZ);
                bankAmt = pathBank * 0.5 + mouseX * 0.04;
            } else {
                // Vista de vuelo clásica (chase), con banking en las curvas del sendero
                targetX = currentPathX + mouseX * 8;
                targetY = mouseY * 4 + 8 + bob;
                const aheadZ = currentZ - 20;
                lookDesired.set(getPathX(aheadZ) + (targetX - currentPathX) * 0.3, 3, aheadZ);
            }

            camera.position.x += (targetX - camera.position.x) * 0.025;
            camera.position.y += (targetY - camera.position.y) * 0.025;
            camera.position.z += (targetZ - camera.position.z) * 0.08;

            // Roll de banking + paneo suavizado de la mirada (las transiciones de vista quedan cinematográficas)
            camera.up.set(Math.sin(bankAmt), Math.cos(bankAmt), 0);
            lookTarget.lerp(lookDesired, 0.06);
            camera.lookAt(lookTarget);

            // --- CIELO, LUNA Y SOL (siempre a distancia infinita, siguen a la cámara) ---
            if (skyMesh && skyMat) {
                skyMesh.position.copy(camera.position);
                skyMat.uniforms.uTime.value = time;
                skyMat.uniforms.uDay.value = turnFactor;
            }
            if (moonSprite) {
                moonSprite.position.copy(camera.position).addScaledVector(moonDirVec, 600);
                (moonSprite.material as THREE.SpriteMaterial).opacity = (1.0 - turnFactor) * 0.9;
            }
            if (sunGlowMesh) {
                sunGlowMesh.position.copy(camera.position).addScaledVector(sunDirVec, 520);
            }

            // --- ESTRELLAS FUGACES ---
            shootingStars.forEach((star) => {
                const ud = star.userData;
                const starMat = star.material as THREE.SpriteMaterial;
                if (!ud.active) {
                    if (time > ud.nextAt && turnFactor < 0.5) {
                        ud.active = true;
                        star.visible = true;
                        ud.life = 0;
                        const skyDir = new THREE.Vector3(
                            (Math.random() - 0.5) * 1.4,
                            0.5 + Math.random() * 0.5,
                            -1
                        ).normalize();
                        star.position.copy(camera.position).addScaledVector(skyDir, 430);
                        ud.vel.set(
                            (0.3 + Math.random() * 0.7) * (Math.random() < 0.5 ? -1 : 1),
                            -(0.25 + Math.random() * 0.3),
                            0
                        ).normalize().multiplyScalar(150 + Math.random() * 90);
                    }
                } else {
                    ud.life += dt;
                    star.position.addScaledVector(ud.vel, dt);
                    const lifeRatio = Math.min(1, ud.life / ud.maxLife);
                    starMat.opacity = Math.sin(lifeRatio * Math.PI) * (1.0 - turnFactor) * 0.9;

                    // Rotar la estela para alinearla con su trayectoria en pantalla
                    const p1 = star.position.clone().project(camera);
                    const p2 = star.position.clone().addScaledVector(ud.vel, 0.1).project(camera);
                    starMat.rotation = Math.atan2(p2.y - p1.y, (p2.x - p1.x) * camera.aspect);

                    if (lifeRatio >= 1) {
                        ud.active = false;
                        star.visible = false;
                        ud.nextAt = time + 5 + Math.random() * 9;
                    }
                }
            });

            // --- OVERLAYS DOM (hero y barra de progreso, sin re-render de React) ---
            if (heroRef.current) {
                const heroOpacity = Math.max(0, 1 - scrollDepth / 55);
                heroRef.current.style.opacity = heroOpacity.toFixed(3);
                heroRef.current.style.transform = `translate(-50%, ${(-scrollDepth * 0.5).toFixed(1)}px)`;
            }
            if (progressFillRef.current) {
                const progress = THREE.MathUtils.clamp((scrollDepth / 500) * 100, 0, 100);
                progressFillRef.current.style.height = `${progress.toFixed(1)}%`;
            }

            if (butterflyGroup) {
                // === VUELO REAL DE MARIPOSA: ráfagas de aleteo alternadas con planeos ===
                // Alternancia de modos con duraciones aleatorias naturales
                if (time > guideModeUntil) {
                    guideGliding = !guideGliding;
                    guideModeUntil = time + (guideGliding
                        ? 0.45 + Math.random() * 1.0   // planeo
                        : 0.6 + Math.random() * 0.9);  // ráfaga de batidas
                }
                // Al saludar frente a la cámara revolotea sin pausa
                const guideTargetEnergy = (!guideGliding || turnFactor > 0.5) ? 1 : 0;
                guideEnergy += (guideTargetEnergy - guideEnergy) * (guideTargetEnergy > guideEnergy ? 0.14 : 0.055);

                // La frecuencia de batida acompaña a la energía (arranque suave, ráfaga rápida)
                guideFlapPhase += dt * (Math.PI * 2) * (1.0 + 7.5 * guideEnergy + turnFactor * 1.5);

                // Batida asimétrica: bajada potente, subida más lenta (como una mariposa real)
                const strokeRaw = Math.sin(guideFlapPhase);
                const stroke = strokeRaw >= 0 ? Math.pow(strokeRaw, 0.78) : -Math.pow(-strokeRaw, 1.35);

                // En planeo las alas quedan elevadas en V (dihedral) con un temblor mínimo del viento
                const dihedral = 0.52 + Math.sin(time * 6.3) * 0.035;
                const flapAngle = stroke * 1.05 * guideEnergy + (1 - guideEnergy) * dihedral;

                guideWingRootL.rotation.z = flapAngle;
                guideWingRootR.rotation.z = -flapAngle;

                // Las alas posteriores siguen a las anteriores con un pequeño retraso elástico
                const hindLag = Math.sin(guideFlapPhase - 0.55) * 0.16 * guideEnergy;
                guideHindL.rotation.z = hindLag;
                guideHindR.rotation.z = hindLag;

                // Animación de giro suave e interactiva al final del scroll
                const targetTurnFactor = scrollDepth > 400 ? 1.0 : 0.0;
                turnFactor += (targetTurnFactor - turnFactor) * 0.04;

                // --- INTERPOLACIÓN DINÁMICA A DÍA BRILLANTE (TRANSICIÓN AL LLEGAR AL FINAL) ---
                // 1. Fondos CSS (opacidades cruzadas)
                if (twilightBgRef.current) twilightBgRef.current.style.opacity = (1.0 - turnFactor).toString();
                if (dayBgRef.current) dayBgRef.current.style.opacity = turnFactor.toString();

                // 2. Color de la Neblina (Fog)
                if (scene && scene.fog) {
                    const twilightFogColor = new THREE.Color(0x32254f);
                    const dayFogColor = new THREE.Color(0xaeddfa); // Suave azul cielo diurno brillante
                    scene.fog.color.lerpColors(twilightFogColor, dayFogColor, turnFactor);
                }

                // 3. Intensidad y Color de las Luces
                if (hemiLight) {
                    hemiLight.intensity = THREE.MathUtils.lerp(0.6, 1.2, turnFactor);
                }
                if (dirLight) {
                    const twilightSunColor = new THREE.Color(colors.sun);
                    const daySunColor = new THREE.Color(0xfff7e6); // Sol diurno cálido y brillante
                    dirLight.color.lerpColors(twilightSunColor, daySunColor, turnFactor);
                    dirLight.intensity = THREE.MathUtils.lerp(1.5, 2.5, turnFactor);
                }

                // 4. Emisión de Nieve (se apaga gradualmente al hacerse de día)
                if (snowMat) {
                    snowMat.emissiveIntensity = THREE.MathUtils.lerp(0.35, 0.05, turnFactor);
                }
                if (giantSnowMat) {
                    giantSnowMat.emissiveIntensity = THREE.MathUtils.lerp(0.35, 0.05, turnFactor);
                }

                // 5. Brillo del Sol e Uniformes de Rayos Crepusculares
                if (sunGlowMesh && sunGlowMesh.material) {
                    (sunGlowMesh.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(0.85, 0.65, turnFactor);
                }
                if (raysGroup && raysGroup.children) {
                    raysGroup.children.forEach((ray: THREE.Object3D) => {
                        const mat = (ray as THREE.Mesh).material as THREE.ShaderMaterial;
                        if (mat && mat.uniforms && mat.uniforms.uColor) {
                            const twilightRayColor = new THREE.Color(0xffebd2);
                            const dayRayColor = new THREE.Color(0xffffff);
                            mat.uniforms.uColor.value.lerpColors(twilightRayColor, dayRayColor, turnFactor);
                        }
                    });
                }

                let guideTargetZ = camera.position.z - 12 + Math.sin(time * 1.0) * 1.8;
                let guidePathX = getPathX(guideTargetZ);
                let guideTargetX = guidePathX + Math.sin(time * 1.2) * 3 + Math.sin(time * 3.1) * 0.5;
                // Rebote de vuelo real: gana altura con cada ráfaga de aleteo y se deja caer al planear
                const flapBob = guideEnergy * Math.sin(guideFlapPhase - Math.PI / 2) * 0.16 - (1 - guideEnergy) * 0.85;
                let guideTargetY = getTerrainHeight(guideTargetX, guideTargetZ) + 4.0 + Math.sin(time * 2.0) * 0.8 + flapBob;

                if (turnFactor > 0.001) {
                    // Desplazar a la mariposa a la izquierda de la tarjeta central (-3.8 unidades)
                    // y acercarla un poco más para que se le aprecie el rostro amigable
                    const endHoverX = camera.position.x - 3.8 + Math.sin(time * 1.5) * 0.5;
                    const endHoverY = camera.position.y - 1.2 + Math.cos(time * 1.0) * 0.4;
                    const endHoverZ = camera.position.z - 9.0 + Math.sin(time * 0.8) * 0.6;
                    
                    guideTargetX = THREE.MathUtils.lerp(guideTargetX, endHoverX, turnFactor);
                    guideTargetY = THREE.MathUtils.lerp(guideTargetY, endHoverY, turnFactor);
                    guideTargetZ = THREE.MathUtils.lerp(guideTargetZ, endHoverZ, turnFactor);
                }

                butterflyGroup.position.x += (guideTargetX - butterflyGroup.position.x) * 0.05;
                butterflyGroup.position.y += (guideTargetY - butterflyGroup.position.y) * 0.05;
                butterflyGroup.position.z += (guideTargetZ - butterflyGroup.position.z) * 0.05;

                const futureTime = time + 0.5;
                const futureZ = butterflyGroup.position.z - 8; 
                const futurePathX = getPathX(futureZ);
                const futureX = futurePathX + Math.sin(futureTime * 1.2) * 3; 
                const futureY = getTerrainHeight(futureX, futureZ) + 4.0 + Math.sin(futureTime * 2.0) * 1.0; 

                let targetLookX = futureX;
                let targetLookY = futureY;
                let targetLookZ = futureZ;

                if (turnFactor > 0.001) {
                    // Apuntar directamente a la posición de la cámara (el espectador)
                    const camLookX = camera.position.x;
                    const camLookY = camera.position.y - 0.5;
                    const camLookZ = camera.position.z;
                    
                    targetLookX = THREE.MathUtils.lerp(futureX, camLookX, turnFactor);
                    targetLookY = THREE.MathUtils.lerp(futureY, camLookY, turnFactor);
                    targetLookZ = THREE.MathUtils.lerp(futureZ, camLookZ, turnFactor);
                }

                butterflyGroup.lookAt(targetLookX, targetLookY, targetLookZ);
                
                // Rotaciones de inclinación (pitch y roll) suaves
                const movementX = (guideTargetX - butterflyGroup.position.x);
                const movementY = (guideTargetY - butterflyGroup.position.y);
                
                // Al girar hacia la cámara reducimos la inclinación para posar erguida
                const rollScale = 0.15 * (1.0 - turnFactor * 0.6);
                const pitchScale = 0.15 * (1.0 - turnFactor * 0.6);

                // Postura real: cuerpo colgado nariz-arriba durante las ráfagas de aleteo,
                // horizontal al planear (rotation.x negativo = nariz arriba)
                const basePitch = -THREE.MathUtils.lerp(0.04, 0.3, guideEnergy) * (1.0 - turnFactor * 0.7)
                    - Math.sin(guideFlapPhase) * 0.05 * guideEnergy;

                butterflyMeshGroup.rotation.z = Math.max(-0.25, Math.min(0.25, movementX * rollScale));
                butterflyMeshGroup.rotation.x = basePitch + Math.max(-0.22, Math.min(0.22, -movementY * pitchScale));

                if (turnFactor > 0.8) {
                    // Bailecito feliz y juguetón al saludar (pequeño balanceo lateral tierno)
                    butterflyMeshGroup.rotation.z += Math.sin(time * 6.5) * 0.05;
                    butterflyMeshGroup.rotation.y += Math.cos(time * 5.0) * 0.04;
                }

                // Pirueta de barril al hacer click (giro completo de 360° suavizado)
                if (trickStart >= 0) {
                    const trickT = (time - trickStart) / 0.7;
                    if (trickT < 1) {
                        const eased = trickT * trickT * (3 - 2 * trickT);
                        butterflyMeshGroup.rotation.z += eased * Math.PI * 2;
                    } else {
                        trickStart = -1;
                    }
                }

                // La aura de luz de la mariposa pierde protagonismo cuando amanece
                if (butterflyLight) {
                    butterflyLight.intensity = THREE.MathUtils.lerp(8, 2.5, turnFactor);
                }

                // Generar rastro de polen/brillo de nieve dorada
                if (trailGroup && time - lastTrailSpawnTime > 0.035) {
                    lastTrailSpawnTime = time;

                    const sparkMat = new THREE.MeshBasicMaterial({
                        color: 0xffdf66,
                        transparent: true,
                        opacity: 0.95,
                        blending: THREE.AdditiveBlending
                    });
                    const spark = new THREE.Mesh(sharedSparkGeom, sparkMat);
                    const baseScale = 0.7 + Math.random() * 0.65;
                    spark.scale.set(baseScale, baseScale, baseScale);

                    const guidePos = new THREE.Vector3();
                    butterflyGroup.getWorldPosition(guidePos);

                    spark.position.set(
                        guidePos.x + (Math.random() - 0.5) * 0.3,
                        guidePos.y + (Math.random() - 0.5) * 0.3,
                        guidePos.z + 0.4 + (Math.random() * 0.3)
                    );

                    spark.userData = { age: 0, maxAge: 45 + Math.random() * 35, shared: true, baseScale };
                    trailGroup.add(spark);
                }
            }

            // Animar y desvanecer el rastro de polen y las explosiones de chispas
            if (trailGroup) {
                for (let i = trailGroup.children.length - 1; i >= 0; i--) {
                    const spark = trailGroup.children[i] as THREE.Mesh;
                    const mat = spark.material as THREE.MeshBasicMaterial;

                    spark.userData.age += 1;
                    const ratio = spark.userData.age / spark.userData.maxAge;

                    if (ratio >= 1.0) {
                        trailGroup.remove(spark);
                        if (!spark.userData.shared) spark.geometry.dispose();
                        mat.dispose();
                    } else {
                        if (spark.userData.vel) {
                            // Chispas de explosión: vuelan con su propia velocidad, frenan y caen
                            spark.position.addScaledVector(spark.userData.vel, dt);
                            spark.userData.vel.multiplyScalar(0.955);
                            spark.userData.vel.y -= 6 * dt;
                        } else {
                            // Rastro pasivo: deriva suave hacia abajo por gravedad y viento
                            spark.position.y -= 0.008;
                            spark.position.x += Math.sin(time * 2.0 + i) * 0.004;
                        }

                        // Achicar y desvanecer gradualmente
                        const fade = (1.0 - ratio) * (spark.userData.baseScale || 1.0);
                        spark.scale.set(fade, fade, fade);
                        mat.opacity = (1.0 - ratio) * 0.95;
                    }
                }
            }

            if (cloudsGroup) {
                cloudsGroup.rotation.y += 0.0015;
            }

            // Animar niebla baja en el valle - Eliminado para limpieza visual

            if (butterfliesGroup) {
                butterfliesGroup.children.forEach((b: THREE.Object3D) => {
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

                    // Orientar el halo brillante a la cámara
                    if (ud.halo) {
                        ud.halo.lookAt(camera.position);
                    }
                });
            }

            // Oscilación diferenciada (Flores, Montañas y Árboles)
            const elements = [...floraGroup.children, ...mountainGroup.children, ...treesGroup.children];
            elements.forEach((obj) => {
                if (obj.userData.baseRotX !== undefined) {
                    const isTree = obj.userData.isTree === true;
                    
                    // Ráfaga interactiva: la mariposa dobla el pasto y flores al volar cerca
                    let guideBendingX = 0;
                    let guideBendingZ = 0;
                    
                    if (!isTree && butterflyGroup) {
                        const distToGuideX = obj.position.x - butterflyGroup.position.x;
                        const distToGuideZ = obj.position.z - butterflyGroup.position.z;
                        const distToGuideSq = distToGuideX * distToGuideX + distToGuideZ * distToGuideZ;
                        
                        if (distToGuideSq < 36.0) { // Dentro de 6 unidades
                            const distToGuide = Math.sqrt(distToGuideSq);
                            const force = (1.0 - distToGuide / 6.0) * 0.28;
                            // Empujamos el pasto hacia afuera radialmente
                            guideBendingX = (distToGuideX / distToGuide) * force;
                            guideBendingZ = (distToGuideZ / distToGuide) * force;
                        }
                    }
                    
                    if (isTree) {
                        // Los árboles oscilan de forma muy lenta y sutil simulando inercia pesada del viento
                        obj.rotation.x = obj.userData.baseRotX + Math.sin(time * 0.35 + obj.position.x * 0.04) * 0.015;
                        obj.rotation.z = obj.userData.baseRotZ + Math.cos(time * 0.3 + obj.position.z * 0.04) * 0.012;
                    } else {
                        // Las flores y el pasto oscilan de forma flexible, sumándole el empuje interactivo de la mariposa
                        obj.rotation.x = obj.userData.baseRotX + Math.sin(time * 1.5 + obj.position.x) * 0.06 + guideBendingX;
                        obj.rotation.z = obj.userData.baseRotZ + Math.cos(time * 1.2 + obj.position.z) * 0.06 + guideBendingZ;
                    }
                }
            });

            // Actualizar tiempo y balancear suavemente los rayos crepusculares (atmósfera viva)
            raysGroup.children.forEach((ray: THREE.Object3D, index: number) => {
                const rayMesh = ray as THREE.Mesh;
                const mat = rayMesh.material as THREE.ShaderMaterial;
                if (mat.uniforms && mat.uniforms.uTime) {
                    mat.uniforms.uTime.value = time;
                }
                // Oscilación de paralaje sutil del haz de luz
                rayMesh.rotation.z = Math.PI / 9 + Math.sin(time * 0.12 + index) * 0.025;
                rayMesh.rotation.x = Math.PI / 11 + Math.cos(time * 0.08 + index) * 0.018;
            });

            // Orientar halos de sol siempre hacia la cámara (Billboarding)
            if (sunGlowGroup) {
                sunGlowGroup.children.forEach((glow: THREE.Object3D) => {
                    glow.lookAt(camera.position);
                });
            }

            const positions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                const fIdx = i / 3;
                const floatSpeed = 0.35 + (fIdx % 5) * 0.12;
                
                // Movimiento inmersivo e irregular de enjambre (luciérnagas)
                positions[i] += Math.sin(time * floatSpeed + positions[i+1]*0.08) * 0.035 + Math.sin(time * 0.08 + fIdx) * 0.006; 
                positions[i+1] += Math.cos(time * floatSpeed * 0.75 + positions[i]*0.08) * 0.022 + 0.009; // deriva lenta ascendente
                positions[i+2] += Math.cos(time * floatSpeed * 1.15 + positions[i]*0.08) * 0.035;     
                
                // Retorno cíclico suave al llegar al techo de altura
                if (positions[i+1] > 32.0) {
                    positions[i+1] = 0.5;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Centelleo/Parpadeo orgánico bioluminiscente de las luciérnagas
            if (particles) {
                const pollenMat = particles.material as THREE.PointsMaterial;
                // Parpadeo variable multionda (más sutil y pequeño)
                pollenMat.size = 0.55 + Math.sin(time * 3.2) * 0.22 * (0.65 + Math.cos(time * 0.85) * 0.35);
            }

            // Animar la nieve cayendo inmersiva
            if (snowPoints) {
                const snowPos = snowPoints.geometry.attributes.position.array as Float32Array;
                for (let i = 0; i < 2000; i++) {
                    const idx = i * 3;
                    
                    // Caída vertical con variaciones basadas en el índice
                    const speed = 0.05 + ((i % 10) / 10) * 0.08;
                    const wiggleSpeed = 0.8 + ((i % 7) / 7) * 1.5;
                    const offset = (i % 5) * (Math.PI / 2.5);
                    
                    snowPos[idx + 1] -= speed;
                    
                    // Oscilación lateral (viento suave en 3D)
                    snowPos[idx] += Math.sin(time * wiggleSpeed + offset) * 0.018;
                    snowPos[idx + 2] += Math.cos(time * 0.5 * wiggleSpeed + offset) * 0.012;
                    
                    // Si cae por debajo del nivel del terreno o se queda detrás de la cámara, 
                    // la reubicamos adelante en el túnel de vuelo para mantener densidad constante.
                    const px = snowPos[idx];
                    const py = snowPos[idx + 1];
                    const pz = snowPos[idx + 2];
                    const terrainH = getTerrainHeight(px, pz);
                    
                    if (py < terrainH - 1.0 || pz > camera.position.z + 15.0) {
                        snowPos[idx] = camera.position.x + ((Math.random() - 0.5) * 110);
                        snowPos[idx + 1] = camera.position.y + 12.0 + (Math.random() * 22.0);
                        snowPos[idx + 2] = camera.position.z - 75.0 - (Math.random() * 85.0);
                    }
                }
                snowPoints.geometry.attributes.position.needsUpdate = true;
            }

            // Animar nieve bokeh en el lente (primer plano cinematográfico)
            if (lensSnowPoints) {
                const lensPos = lensSnowPoints.geometry.attributes.position.array as Float32Array;
                for (let i = 0; i < 120; i++) {
                    const idx = i * 3;
                    
                    const speed = 0.08 + ((i % 8) / 8) * 0.12; 
                    const wiggleSpeed = 1.2 + ((i % 5) / 5) * 1.5;
                    const offset = (i % 4) * (Math.PI / 2.0);
                    
                    lensPos[idx + 1] -= speed;
                    lensPos[idx] += Math.sin(time * wiggleSpeed + offset) * 0.03;
                    
                    const py = lensPos[idx + 1];
                    const pz = lensPos[idx + 2];
                    
                    if (py < camera.position.y - 10.0 || pz > camera.position.z + 5.0) {
                        lensPos[idx] = camera.position.x + ((Math.random() - 0.5) * 25.0);
                        lensPos[idx + 1] = camera.position.y + 10.0 + (Math.random() * 10.0);
                        lensPos[idx + 2] = camera.position.z - 35.0 - (Math.random() * 30.0);
                    }
                }
                lensSnowPoints.geometry.attributes.position.needsUpdate = true;
            }

            if (composer) {
                composer.render();
            } else {
                renderer.render(scene, camera);
            }
        }

        // Ejecutar inicialización
        init();

        // Cleanup al desmontar el componente de React
        return () => {
            window.removeEventListener('mousemove', onDocumentMouseMove);
            window.removeEventListener('wheel', onDocumentWheel);
            window.removeEventListener('touchstart', onDocumentTouchStart);
            window.removeEventListener('touchmove', onDocumentTouchMove);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onWindowResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            if (mountRef.current && renderer && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            composer?.dispose();
            renderer?.dispose();
        };

    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden select-none">
            {/* Fondo Atardecer Espacial/Twilight */}
            <div 
                ref={twilightBgRef}
                className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none z-0"
                style={{ 
                    background: 'linear-gradient(to bottom, #090312 0%, #15092a 30%, #251249 55%, #32254f 75%, #563352 90%, #7c4c42 100%)',
                    opacity: 1
                }} 
            />
            {/* Fondo Día Brillante/Daytime */}
            <div 
                ref={dayBgRef}
                className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none z-0"
                style={{ 
                    background: 'linear-gradient(to bottom, #1a73e8 0%, #4ea2ff 35%, #8fd1ff 65%, #ccebff 85%, #f0f9ff 100%)',
                    opacity: 0
                }} 
            />
            {/* Contenedor del Canvas de Three.js */}
            <div ref={mountRef} className="absolute inset-0 z-10" />

            {/* Viñeta cinematográfica */}
            <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 52%, rgba(8,4,18,0.30) 82%, rgba(5,2,12,0.55) 100%)' }}
            />

            {/* Título Hero de bienvenida (se desvanece al empezar a volar) */}
            <div
                ref={heroRef}
                className="absolute left-1/2 top-[16%] z-30 flex flex-col items-center text-center gap-3 pointer-events-none px-6 w-full max-w-3xl"
                style={{ transform: 'translate(-50%, 0px)' }}
            >
                <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#ffeedd]/80 px-4 py-1.5 rounded-full border border-white/15 bg-black/20 backdrop-blur-sm">
                    Contacto
                </span>
                <h1 className="text-4xl sm:text-6xl font-display font-semibold tracking-tight bg-gradient-to-b from-white via-amber-100 to-rose-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(255,180,120,0.25)]">
                    Volá hacia nosotros
                </h1>
                <p className="text-sm sm:text-base text-white/70 font-light max-w-md leading-relaxed">
                    Seguí a la mariposa monarca por el valle y encontranos al final del sendero.
                </p>
            </div>

            {/* Barra de progreso del vuelo (desktop) */}
            <div className={`hidden md:flex absolute right-7 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2.5 pointer-events-none transition-opacity duration-700 ${showCard ? "opacity-0" : "opacity-100"}`}>
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/50" style={{ writingMode: 'vertical-rl' }}>Vuelo</span>
                <div className="relative h-[32vh] w-[3px] rounded-full bg-white/15 overflow-hidden">
                    <div
                        ref={progressFillRef}
                        className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-amber-200 via-rose-300 to-emerald-200 shadow-[0_0_12px_rgba(255,210,150,0.8)]"
                        style={{ height: '0%' }}
                    />
                </div>
                <span className="text-xs">🌼</span>
            </div>

            {/* Botón de regreso a la página principal */}
            <a
                href="/"
                data-ui
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md border border-white/10 text-white font-medium text-sm transition-all duration-300 shadow-lg cursor-pointer active:scale-95 animate-fade-in"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al inicio</span>
            </a>

            {/* Hint de Scroll */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-mono uppercase tracking-[0.15em] flex items-center gap-2 pointer-events-none transition-all duration-500 ${
                showCard ? "opacity-0 translate-y-4" : "opacity-100 animate-bounce"
            }`}>
                <span>Scroll para volar 🦋 · Click para magia ✨</span>
            </div>

            {/* Selector de vistas de cámara */}
            <div data-ui className={`absolute bottom-24 right-4 sm:bottom-8 sm:right-6 z-30 flex flex-col sm:flex-row gap-2 transition-opacity duration-500 ${showCard ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                {[
                    { id: 0, label: '🦋 Vuelo' },
                    { id: 1, label: '🎬 Cine' },
                    { id: 2, label: '🌄 Aérea' },
                ].map(v => (
                    <button
                        key={v.id}
                        onClick={() => applyView(v.id)}
                        className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider backdrop-blur-md border transition-all duration-300 active:scale-95 cursor-pointer ${
                            viewMode === v.id
                                ? "bg-white/25 border-white/40 text-white shadow-[0_0_18px_rgba(255,210,150,0.35)]"
                                : "bg-black/25 border-white/10 text-white/70 hover:bg-black/45 hover:text-white"
                        }`}
                    >
                        {v.label}
                    </button>
                ))}
            </div>

            {/* Tarjeta de Contacto Premium Glassmorphic con Tilt 3D */}
            <div
                data-ui
                className={`absolute left-1/2 top-1/2 z-40 w-[90%] max-w-[460px] select-none transition-all duration-700 ease-out ${
                    showCard
                        ? "opacity-100 -translate-x-1/2 -translate-y-1/2 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-x-1/2 -translate-y-[45%] scale-95 pointer-events-none"
                }`}
                style={{ perspective: '1200px' }}
            >
                <div className="animate-card-float">
                    <div
                        ref={cardTiltRef}
                        onMouseMove={handleCardTilt}
                        onMouseLeave={resetCardTilt}
                        className="relative rounded-3xl p-[1.5px] transition-transform duration-200 ease-out will-change-transform"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,214,165,0.55), rgba(255,255,255,0.12) 30%, rgba(167,139,250,0.40) 65%, rgba(255,183,178,0.50))',
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 32px 100px -28px rgba(0,0,0,0.75), 0 0 60px -18px rgba(255,190,120,0.25)'
                        }}
                    >
                        <div className="relative max-h-[88vh] overflow-y-auto p-6 sm:p-7 rounded-3xl bg-[#140d20]/70 backdrop-blur-xl text-white flex flex-col items-center text-center gap-4.5 scrollbar-thin">
                            {/* Brillo especular que sigue al cursor */}
                            <div ref={sheenRef} className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 z-10" />

                            <div className="flex flex-col items-center text-center gap-1.5 w-full">
                                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ffeedd]/90">Háblanos</span>
                                <h1 className="text-3xl font-display font-semibold tracking-tight text-white">Cosecha Creativa</h1>

                                {/* Sketchfab 3D Embed of the Butterfly (Cropped to hide free-tier logos/watermarks/buttons) */}
                                <div className="sketchfab-embed-wrapper w-full h-[140px] rounded-2xl overflow-hidden border border-white/10 my-2 shadow-inner bg-[#0c0a0f]/40 relative">
                                    <iframe
                                        title="Mariposa"
                                        className="absolute border-0"
                                        style={{
                                            top: '-54px',
                                            left: '-4%',
                                            width: '108%',
                                            height: 'calc(100% + 132px)'
                                        }}
                                        allowFullScreen
                                        allow="autoplay; fullscreen; xr-spatial-tracking"
                                        src="https://sketchfab.com/models/1bdceea4939b4f3c8d4a09a8f0e8d6a6/embed?autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_watermark=0&ui_animations=0"
                                    />
                                </div>

                                <p className="text-sm text-white/80 leading-relaxed font-sans font-light mt-1">
                                    Sembrá tus ideas digitales con nosotros. Conversemos sobre cómo expandir tu presencia digital, impulsar tu marca o diseñar tus próximas aplicaciones.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 mt-2 w-full">
                                <a
                                    href={getWhatsAppHref("Contacto General")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-2xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20bd5a] hover:shadow-[0_12px_32px_-8px_rgba(37,211,102,0.55)] transition-all duration-300 active:scale-[0.98] overflow-hidden"
                                >
                                    <WhatsAppMark className="w-5 h-5 shrink-0 text-white" />
                                    <span className="truncate">Escribinos por WhatsApp</span>
                                </a>

                                <a
                                    href="mailto:ventas@cosechacreativa.com.ar?subject=Consulta desde la web"
                                    className="flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-[13px] sm:text-sm transition-all duration-300 backdrop-blur-sm active:scale-[0.98] overflow-hidden"
                                >
                                    <Mail className="w-4 h-4 shrink-0 text-[#ffeedd]" />
                                    <span className="truncate">ventas@cosechacreativa.com.ar</span>
                                </a>
                            </div>

                            <div className="flex flex-col items-center gap-3 mt-4 pt-4 border-t border-white/10 text-xs text-white/60 w-full">
                                <div className="flex items-center gap-1.5 justify-center">
                                    <MapPin className="w-3.5 h-3.5 text-[#ffeedd]" />
                                    <span>San Juan, Argentina</span>
                                </div>
                                <div className="text-[10px] font-mono tracking-wider opacity-75 mt-1">
                                    Usa el Scroll / Mouse 🌸
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes card-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-7px); }
                }
                .animate-card-float {
                    animation: card-float 7s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
