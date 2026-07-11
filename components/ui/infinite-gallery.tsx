'use client';

import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
	/** Fade in range as percentage of depth range (0-1) */
	fadeIn: {
		start: number;
		end: number;
	};
	/** Fade out range as percentage of depth range (0-1) */
	fadeOut: {
		start: number;
		end: number;
	};
}

interface BlurSettings {
	/** Blur in range as percentage of depth range (0-1) */
	blurIn: {
		start: number;
		end: number;
	};
	/** Blur out range as percentage of depth range (0-1) */
	blurOut: {
		start: number;
		end: number;
	};
	/** Maximum blur amount (0-10, higher values = more blur) */
	maxBlur: number;
}

interface InfiniteGalleryProps {
	images: ImageItem[];
	/** Speed multiplier applied to scroll delta (default: 1) */
	speed?: number;
	/** Spacing between images along Z in world units (default: 2.5) */
	zSpacing?: number;
	/** Number of visible planes (default: clamp to images.length, min 8) */
	visibleCount?: number;
	/** Near/far distances for opacity/blur easing (default: { near: 0.5, far: 12 }) */
	falloff?: { near: number; far: number };
	/** Fade in/out settings with ranges based on depth range percentage */
	fadeSettings?: FadeSettings;
	/** Blur in/out settings with ranges based on depth range percentage */
	blurSettings?: BlurSettings;
	/** Optional className for outer container */
	className?: string;
	/** Optional style for outer container */
	style?: React.CSSProperties;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	x: number;
	y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

// Custom shader material for blur, opacity, and cloth folding effects
const createClothMaterial = () => {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			map: { value: null },
			opacity: { value: 1.0 },
			blurAmount: { value: 0.0 },
			scrollForce: { value: 0.0 },
			time: { value: 0.0 },
			isHovered: { value: 0.0 },
		},
		vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Create smooth curving based on scroll force
        float curveIntensity = scrollForce * 0.3;
        
        // Base curve across the plane based on distance from center
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        
        // Add gentle cloth-like ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        
        // Flag waving effect when hovered - mathematically computed using step to avoid branching
        float hoverFactor = step(0.5, isHovered);
        float wavePhase = pos.x * 3.0 + time * 8.0;
        float waveAmplitude = sin(wavePhase) * 0.1;
        float dampening = smoothstep(-0.5, 0.5, pos.x);
        float flagWave = waveAmplitude * dampening;
        
        // Add secondary smaller waves for more realistic flag motion
        float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
        flagWave = (flagWave + secondaryWave) * hoverFactor;
        
        // Apply Z displacement for curving effect (inverted) with cloth ripples and flag wave
        pos.z -= (curve + clothEffect + flagWave);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vec4 color = texture2D(map, vUv);
        
        // Highly optimized, loop-free, compile-safe 5-tap box blur
        if (blurAmount > 0.0) {
          vec2 texelSize = vec2(0.0015, 0.0015) * blurAmount;
          vec4 blurred = color * 0.40;
          blurred += texture2D(map, vUv + vec2(-texelSize.x, -texelSize.y)) * 0.15;
          blurred += texture2D(map, vUv + vec2(texelSize.x, -texelSize.y)) * 0.15;
          blurred += texture2D(map, vUv + vec2(-texelSize.x, texelSize.y)) * 0.15;
          blurred += texture2D(map, vUv + vec2(texelSize.x, texelSize.y)) * 0.15;
          color = blurred;
        }
        
        // Add subtle lighting effect based on curving
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
	});
};

function ImagePlane({
	texture,
	position,
	scale,
	material,
	meshRef,
	onPointerOver,
	onPointerOut,
}: {
	texture: THREE.Texture;
	position: [number, number, number];
	scale: [number, number, number];
	material: THREE.MeshBasicMaterial;
	meshRef: React.RefObject<THREE.Mesh | null>;
	onPointerOver: () => void;
	onPointerOut: () => void;
}) {
	useEffect(() => {
		if (material && texture) {
			material.map = texture;
			material.needsUpdate = true;
		}
	}, [material, texture]);

	return (
		<mesh
			ref={meshRef}
			position={position}
			scale={scale}
			material={material}
			onPointerOver={onPointerOver}
			onPointerOut={onPointerOut}
		>
			<planeGeometry args={[1, 1, 32, 32]} />
		</mesh>
	);
}

function GalleryScene({
	images,
	speed = 1,
	visibleCount = 8,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.15 },
		fadeOut: { start: 0.85, end: 0.95 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.9, end: 1.0 },
		maxBlur: 3.0,
	},
}: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
	// Performance optimization: use refs instead of state to prevent 60fps React re-renders
	const scrollVelocityRef = useRef(0);
	const autoPlayRef = useRef(true);
	const lastInteraction = useRef(Date.now());

	// Normalize images to objects
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: '' } : img
			),
		[images]
	);

	// Load textures
	const textures = useTexture(normalizedImages.map((img) => img.src));
	console.log("3D Gallery Scene: normalizedImages paths:", normalizedImages.map(img => img.src));
	console.log("3D Gallery Scene: loaded textures length:", textures.length);

	// Set sRGB color space to prevent washed out / whitish overexposure
	useEffect(() => {
		textures.forEach((texture) => {
			if (texture) {
				texture.colorSpace = THREE.SRGBColorSpace || 'srgb';
				if ('encoding' in texture) {
					(texture as any).encoding = 3001; // THREE.sRGBEncoding
				}
				texture.needsUpdate = true;
			}
		});
	}, [textures]);

	// Create materials pool
	const materials = useMemo(
		() => Array.from({ length: visibleCount }, () => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide })),
		[visibleCount]
	);

	// Create stable mesh refs
	const meshRefs = useRef<React.RefObject<THREE.Mesh | null>[]>([]);
	if (meshRefs.current.length !== visibleCount) {
		meshRefs.current = Array.from({ length: visibleCount }, () => ({ current: null }));
	}

	const spatialPositions = useMemo(() => {
		const positions: { x: number; y: number }[] = [];
		const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET;
		const maxVerticalOffset = MAX_VERTICAL_OFFSET;

		for (let i = 0; i < visibleCount; i++) {
			// Create varied distribution patterns for both axes using golden angle and offsets
			const horizontalAngle = (i * 2.618) % (Math.PI * 2);
			const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);

			const horizontalRadius = (i % 3) * 1.2;
			const verticalRadius = ((i + 1) % 4) * 0.8;

			const x = (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) / 3;
			const y = (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

			positions.push({ x, y });
		}
		console.log("3D Gallery Scene: computed spatialPositions:", positions);
		return positions;
	}, [visibleCount]);

	const totalImages = normalizedImages.length;
	const depthRange = DEFAULT_DEPTH_RANGE;

	// Initialize plane data
	const planesData = useRef<PlaneData[]>(
		Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}))
	);

	useEffect(() => {
		planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z:
				visibleCount > 0
					? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
					: 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}));
	}, [depthRange, spatialPositions, totalImages, visibleCount]);

	// Handle scroll input
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			scrollVelocityRef.current += event.deltaY * 0.008 * speed;
			autoPlayRef.current = false;
			lastInteraction.current = Date.now();
		},
		[speed]
	);

	// Handle keyboard input
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				scrollVelocityRef.current -= 1.8 * speed;
				autoPlayRef.current = false;
				lastInteraction.current = Date.now();
			} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				scrollVelocityRef.current += 1.8 * speed;
				autoPlayRef.current = false;
				lastInteraction.current = Date.now();
			}
		},
		[speed]
	);

	// Handle touch drag
	const touchStartRef = useRef<number | null>(null);

	const handleTouchStart = useCallback((event: TouchEvent) => {
		if (event.touches[0]) {
			touchStartRef.current = event.touches[0].clientY;
			autoPlayRef.current = false;
			lastInteraction.current = Date.now();
		}
	}, []);

	const handleTouchMove = useCallback((event: TouchEvent) => {
		if (touchStartRef.current !== null && event.touches[0]) {
			const deltaY = touchStartRef.current - event.touches[0].clientY;
			scrollVelocityRef.current += deltaY * 0.015 * speed;
			touchStartRef.current = event.touches[0].clientY;
			lastInteraction.current = Date.now();
		}
	}, [speed]);

	const handleTouchEnd = useCallback(() => {
		touchStartRef.current = null;
	}, []);

	useEffect(() => {
		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.addEventListener('wheel', handleWheel, { passive: false });
			canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
			canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
			canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
			document.addEventListener('keydown', handleKeyDown);

			return () => {
				canvas.removeEventListener('wheel', handleWheel);
				canvas.removeEventListener('touchstart', handleTouchStart);
				canvas.removeEventListener('touchmove', handleTouchMove);
				canvas.removeEventListener('touchend', handleTouchEnd);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [handleWheel, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

	// Auto-play logic
	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - lastInteraction.current > 3500) {
				autoPlayRef.current = true;
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useFrame((state, delta) => {
		// Apply auto-play
		if (autoPlayRef.current) {
			scrollVelocityRef.current += 0.25 * delta;
		}

		// Damping
		scrollVelocityRef.current *= 0.95;

		// Update time uniform for all materials (if custom shader is active in future)
		const time = state.clock.getElapsedTime();
		
		// Log scene physics and coordinates once every 120 frames (approx. every 2 seconds)
		if (Math.floor(time * 60) % 120 === 0) {
			console.log("3D Gallery useFrame tick. Uptime=" + time.toFixed(2) + "s, Velocity=" + scrollVelocityRef.current.toFixed(4));
			console.log("3D Gallery active meshes state:", planesData.current.map(p => ({
				planeIdx: p.index,
				coords: "[" + p.x.toFixed(2) + ", " + p.y.toFixed(2) + ", " + (p.z - depthRange/2).toFixed(2) + "]",
				imageIdx: p.imageIndex
			})));
		}

		// Update plane positions
		const imageAdvance =
			totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
		const totalRange = depthRange;

		planesData.current.forEach((plane, i) => {
			let newZ = plane.z + scrollVelocityRef.current * delta * 10;
			let wrapsForward = 0;
			let wrapsBackward = 0;

			if (newZ >= totalRange) {
				wrapsForward = Math.floor(newZ / totalRange);
				newZ -= totalRange * wrapsForward;
			} else if (newZ < 0) {
				wrapsBackward = Math.ceil(-newZ / totalRange);
				newZ += totalRange * wrapsBackward;
			}

			if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
				plane.imageIndex =
					(plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
			}

			if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
				const step = plane.imageIndex - wrapsBackward * imageAdvance;
				plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
			}

			plane.z = ((newZ % totalRange) + totalRange) % totalRange;
			plane.x = spatialPositions[i]?.x ?? 0;
			plane.y = spatialPositions[i]?.y ?? 0;

			// Update the Three.js mesh position directly (preventing any React re-renders)
			const mesh = meshRefs.current[i]?.current;
			if (mesh) {
				const worldZ = plane.z - totalRange / 2;
				mesh.position.set(plane.x, plane.y, worldZ);
			}

			// Calculate opacity based on fade settings
			const normalizedPosition = plane.z / totalRange; // 0 to 1
			let opacity = 1;

			if (
				normalizedPosition >= fadeSettings.fadeIn.start &&
				normalizedPosition <= fadeSettings.fadeIn.end
			) {
				const fadeInProgress =
					(normalizedPosition - fadeSettings.fadeIn.start) /
					(fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
				opacity = fadeInProgress;
			} else if (normalizedPosition < fadeSettings.fadeIn.start) {
				opacity = 0;
			} else if (
				normalizedPosition >= fadeSettings.fadeOut.start &&
				normalizedPosition <= fadeSettings.fadeOut.end
			) {
				const fadeOutProgress =
					(normalizedPosition - fadeSettings.fadeOut.start) /
					(fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
				opacity = 1 - fadeOutProgress;
			} else if (normalizedPosition > fadeSettings.fadeOut.end) {
				opacity = 0;
			}

			opacity = Math.max(0, Math.min(1, opacity));

			// Calculate blur based on blur settings
			let blur = 0;

			if (
				normalizedPosition >= blurSettings.blurIn.start &&
				normalizedPosition <= blurSettings.blurIn.end
			) {
				const blurInProgress =
					(normalizedPosition - blurSettings.blurIn.start) /
					(blurSettings.blurIn.end - blurSettings.blurIn.start);
				blur = blurSettings.maxBlur * (1 - blurInProgress);
			} else if (normalizedPosition < blurSettings.blurIn.start) {
				blur = blurSettings.maxBlur;
			} else if (
				normalizedPosition >= blurSettings.blurOut.start &&
				normalizedPosition <= blurSettings.blurOut.end
			) {
				const blurOutProgress =
					(normalizedPosition - blurSettings.blurOut.start) /
					(blurSettings.blurOut.end - blurSettings.blurOut.start);
				blur = blurSettings.maxBlur * blurOutProgress;
			} else if (normalizedPosition > blurSettings.blurOut.end) {
				blur = blurSettings.maxBlur;
			}

			blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

			// Update material directly
			const material = materials[i];
			if (material) {
				material.opacity = opacity;

				// Swaps texture on the fly when plane wraps
				const texture = textures[plane.imageIndex];
				if (texture && material.map !== texture) {
					material.map = texture;
					material.needsUpdate = true;
				}
			}
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{planesData.current.map((plane, i) => {
				const texture = textures[plane.imageIndex];
				const material = materials[i];
				const meshRef = meshRefs.current[i];

				if (!texture || !material || !meshRef) return null;

				const worldZ = plane.z - depthRange / 2;

				// Calculate scale to maintain aspect ratio and prevent overlaps
				const aspect = texture.image
					? texture.image.width / texture.image.height
					: 1;
				let scaleWidth = 2.0;
				let scaleHeight = 2.0;
				if (aspect > 1) {
					scaleWidth = Math.min(2.8, 1.8 * aspect);
					scaleHeight = scaleWidth / aspect;
				} else {
					scaleHeight = Math.min(2.8, 1.8 / aspect);
					scaleWidth = scaleHeight * aspect;
				}
				const scale: [number, number, number] = [scaleWidth, scaleHeight, 1];

				return (
					<ImagePlane
						key={plane.index}
						texture={texture}
						position={[plane.x, plane.y, worldZ]}
						scale={scale}
						material={material}
						meshRef={meshRef}
						onPointerOver={() => {
							if (material && material.uniforms) {
								material.uniforms.isHovered.value = 1.0;
							}
						}}
						onPointerOut={() => {
							if (material && material.uniforms) {
								material.uniforms.isHovered.value = 0.0;
							}
						}}
					/>
				);
			})}
		</>
	);
}

// Fallback component for when WebGL is not available
function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === 'string' ? { src: img, alt: 'Fotografía Cosecha' } : img
			),
		[images]
	);

	return (
		<div className="flex flex-col items-center justify-center w-full min-h-[400px] border border-white/10 rounded-2xl bg-zinc-950/80 p-8 backdrop-blur-md">
			<p className="text-zinc-400 text-sm mb-6 text-center font-mono">
				GALERÍA ESTÁTICA (MODO COMPATIBILIDAD)
			</p>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto w-full pr-2">
				{normalizedImages.map((img, i) => (
					<div key={i} className="group relative overflow-hidden rounded-xl aspect-square border border-white/5 bg-zinc-900">
						<img
							src={img.src || '/placeholder.svg'}
							alt={img.alt || 'Fotografía Profesional'}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
							<span className="text-xs text-white font-mono">{img.alt || 'Cosecha Creativa'}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default function InfiniteGallery({
	images,
	className = 'h-96 w-full',
	style,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.25 },
		fadeOut: { start: 0.4, end: 0.43 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.4, end: 0.43 },
		maxBlur: 8.0,
	},
}: InfiniteGalleryProps) {
	const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Check WebGL support
		try {
			const canvas = document.createElement('canvas');
			const gl =
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			setWebglSupported(!!gl);
		} catch (e) {
			setWebglSupported(false);
		}
	}, []);

	// Server-side rendering safe fallback
	if (!mounted || webglSupported === null) {
		return (
			<div className={`${className} flex items-center justify-center bg-black`} style={style}>
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-[#eca8d6]" />
					<p className="text-xs text-zinc-500 font-mono tracking-wider">Cargando Galería 3D...</p>
				</div>
			</div>
		);
	}

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<FallbackGallery images={images} />
			</div>
		);
	}

	return (
		<div className={`${className} relative overflow-hidden`} style={style}>
			<Canvas
				camera={{ position: [0, 0, 0], fov: 55 }}
				gl={{ antialias: true, alpha: true }}
				className="w-full h-full cursor-grab active:cursor-grabbing"
			>
				<Suspense fallback={null}>
					<GalleryScene
						images={images}
						fadeSettings={fadeSettings}
						blurSettings={blurSettings}
					/>
				</Suspense>
			</Canvas>
			<Loader
				containerStyles={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
				innerStyles={{ background: '#eca8d6' }}
				barStyles={{ background: 'linear-gradient(90deg, #eca8d6 0%, #d68ec3 100%)', height: '4px' }}
				dataStyles={{ color: '#white', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.1em' }}
				dataInterpolation={(p) => `CARGANDO GALERÍA 3D... ${p.toFixed(0)}%`}
			/>
		</div>
	);
}
