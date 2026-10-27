"use client";

/* Three.js objects are mutable by design. Uniforms, materials, and refs are updated in the frame loop. */
/* eslint-disable react-hooks/refs -- Three.js refs are read while attaching materials and written in the frame loop. */

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type StageQuality = "high" | "low";
export type Composition = "hero" | "ritual";

type ProgressRef = { current: number };

function unit(index: number) {
  const x = Math.sin(index * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function Rig({ composition }: { composition: Composition }) {
  const desired = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (composition === "hero") {
      desired.set(-0.55, 1.22, 7.05);
      target.set(1.05, 1.05, 0);
    } else {
      desired.set(0.85, 1.55, 7.05);
      target.set(0, 1.2, 0);
    }
    state.camera.position.lerp(desired, 0.08);
    state.camera.lookAt(target);
  });

  return null;
}

function createCityMaterial() {
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vWorld;
      varying vec3 vNormal;
      void main() {
        #ifdef USE_INSTANCING
          vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        #else
          vec4 world = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(mat3(modelMatrix) * normal);
        #endif
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec3 vWorld;
      varying vec3 vNormal;
      uniform float uTime;
      void main() {
        vec2 cell = floor(vWorld.xy * vec2(5.2, 6.4));
        float n = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
        float wx = smoothstep(0.58, 0.66, fract(vWorld.x * 5.2)) * smoothstep(0.94, 0.86, fract(vWorld.x * 5.2));
        float wy = smoothstep(0.52, 0.6, fract(vWorld.y * 6.4)) * smoothstep(0.92, 0.84, fract(vWorld.y * 6.4));
        float pulse = 0.55 + 0.45 * sin(uTime * 0.45 + n * 9.0);
        vec3 facade = vec3(0.012, 0.012, 0.011);
        vec3 window = vec3(0.96, 0.94, 0.88) * pulse;
        float lit = step(0.72, n);
        vec3 color = mix(facade, window, wx * wy * lit);
        float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.2, 0.98))), 3.0);
        color += vec3(0.035) * rim;
        gl_FragColor = vec4(color, 1.0);
      }
      `,
  });
  material.fog = false;
  return material;
}

function City({ count }: { count: number }) {
  const materialRef = useRef(createCityMaterial());
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const layout = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        let x = (unit(index + 3) - 0.5) * 34;
        if (Math.abs(x) < 2.4) x += x < 0 ? -2.8 : 2.8;
        const height = 1.4 + unit(index + 11) * 7.2;
        const width = 0.45 + unit(index + 19) * 1.15;
        const depth = 0.45 + unit(index + 23) * 0.95;
        return {
          x,
          z: -7.2 - unit(index + 7) * 16,
          height,
          width,
          depth,
        };
      }),
    [count],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    layout.forEach((building, index) => {
      dummy.position.set(building.x, building.height / 2, building.z);
      dummy.scale.set(building.width, building.height, building.depth);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [layout]);

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={materialRef.current}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function createTrailMaterial() {
  const next = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        float lane = fract(vUv.y * 18.0);
        float band = smoothstep(0.47, 0.5, lane) * smoothstep(0.53, 0.5, lane);
        float speed = 0.06 + vUv.y * 0.16;
        float head = fract(vUv.x * (1.6 + vUv.y * 2.2) - uTime * speed);
        float streak = smoothstep(0.0, 0.015, head) * smoothstep(0.16, 0.02, head);
        float fade = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.62, vUv.y);
        float alpha = streak * band * fade * 0.45;
        gl_FragColor = vec4(vec3(0.93, 0.91, 0.86), alpha);
      }
    `,
  });
  next.toneMapped = false;
  return next;
}

function Trails() {
  const materialRef = useRef(createTrailMaterial());

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -1.2]} material={materialRef.current}>
      <planeGeometry args={[36, 22]} />
    </mesh>
  );
}

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(243,243,241,1)");
  glow.addColorStop(0.35, "rgba(243,243,241,0.55)");
  glow.addColorStop(1, "rgba(243,243,241,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Particles({ count, progressRef }: { count: number; progressRef: ProgressRef }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const theta = unit(index + 1) * Math.PI * 2;
      const phi = Math.acos(2 * unit(index + 17) - 1);
      const radius = 1.6 + unit(index + 29) * 3.2;
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.cos(phi) * radius * 0.55 + 1.15;
      const z = Math.sin(phi) * Math.sin(theta) * radius * 0.72;
      seeds.set([x, y, z], index * 3);
      positions.set([x, y, z], index * 3);
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    next.setAttribute("seed", new THREE.BufferAttribute(seeds, 3));
    return next;
  }, [count]);

  const material = useMemo(() => {
    const next = new THREE.PointsMaterial({
      color: "#f3f3f1",
      map: createParticleTexture(),
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    next.toneMapped = false;
    return next;
  }, []);

  useFrame((state) => {
    const progress = progressRef.current;
    const converge = smoothstep(0.12, 0.88, progress);
    const time = state.clock.elapsedTime;
    const position = geometry.getAttribute("position") as THREE.BufferAttribute;
    const seed = geometry.getAttribute("seed") as THREE.BufferAttribute;
    for (let index = 0; index < count; index += 1) {
      const sx = seed.getX(index);
      const sy = seed.getY(index);
      const sz = seed.getZ(index);
      const spin = time * (0.04 + converge * 0.08) + index * 0.01;
      position.setXYZ(
        index,
        THREE.MathUtils.lerp(sx, Math.cos(spin) * 1.15, converge) + Math.sin(time + index) * 0.008,
        THREE.MathUtils.lerp(sy, 1.15 + Math.sin(spin * 0.7) * 0.28, converge),
        THREE.MathUtils.lerp(sz, Math.sin(spin) * 0.55, converge),
      );
    }
    position.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
}

function Rings({ progressRef }: { progressRef: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const root = group.current;
    if (!root) return;
    const progress = progressRef.current;
    const speed = 0.08 + progress * 0.22;
    const time = state.clock.elapsedTime;
    root.rotation.y = time * speed * 0.35;
    root.rotation.x = 0.95 + Math.sin(time * 0.12) * 0.04;
    const scale = 0.92 + smoothstep(0.2, 1, progress) * 0.12;
    root.scale.setScalar(scale);
    if (inner.current) inner.current.rotation.z = -time * speed * 1.4;
  });

  return (
    <group ref={group} position={[0, 1.35, 0]}>
      <mesh>
        <torusGeometry args={[0.92, 0.004, 24, 256]} />
        <meshStandardMaterial color="#f7f6f2" metalness={1} roughness={0.2} emissive="#f3f3f1" emissiveIntensity={0.22} />
      </mesh>
      <mesh ref={inner} rotation={[0.7, 0.25, 0.15]}>
        <torusGeometry args={[1.22, 0.0025, 16, 220]} />
        <meshStandardMaterial color="#f4f3ef" metalness={1} roughness={0.28} emissive="#f3f3f1" emissiveIntensity={0.12} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function createMetal() {
  return new THREE.MeshPhysicalMaterial({
    color: "#f7f5ef",
    metalness: 1,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.8,
    transparent: true,
  });
}

function createTorso() {
  const profile: Array<[number, number]> = [
    [0, 0],
    [0.09, 0],
    [0.11, 0.08],
    [0.075, 0.32],
    [0.1, 0.7],
    [0.13, 0.98],
    [0.17, 1.18],
    [0.145, 1.34],
    [0.21, 1.5],
    [0.19, 1.62],
    [0.07, 1.74],
    [0.12, 1.82],
    [0.155, 1.96],
    [0.145, 2.08],
    [0.05, 2.16],
    [0, 2.2],
  ];
  return new THREE.LatheGeometry(
    profile.map(([radius, y]) => new THREE.Vector2(radius, y)),
    80,
  );
}

function Figure({ progressRef, composition }: { progressRef: ProgressRef; composition: Composition }) {
  const group = useRef<THREE.Group>(null);
  const metalRef = useRef(createMetal());
  const torso = useMemo(() => createTorso(), []);

  useFrame((state) => {
    const root = group.current;
    if (!root) return;
    const appear = smoothstep(0.28, 0.92, progressRef.current);
    const opacity = 0.15 + appear * 0.85;
    metalRef.current.opacity = opacity;
    metalRef.current.transparent = opacity < 0.98;
    metalRef.current.depthWrite = opacity > 0.35;
    const breathe = Math.sin(state.clock.elapsedTime * 0.7) * 0.01;
    root.position.y = breathe;
    root.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.06;
    root.scale.setScalar(0.35 + appear * 0.65);
  });

  const metal = metalRef.current;

  return (
    <group ref={group} position={[composition === "hero" ? 1.15 : 0, 0, 0]}>
      <mesh geometry={torso} material={metal} />
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[0.18 * side, 1.38, 0.02]} rotation={[0.15, 0, 1.05 * side]} material={metal}>
          <capsuleGeometry args={[0.055, 0.34, 24, 40]} />
        </mesh>
      ))}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
      <planeGeometry args={[48, 48]} />
      <meshStandardMaterial color="#070707" metalness={0.2} roughness={0.92} />
    </mesh>
  );
}

export function SummonWorld({
  progressRef,
  composition,
  quality,
}: {
  progressRef: ProgressRef;
  composition: Composition;
  quality: StageQuality;
}) {
  const high = quality === "high";

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 14, 34]} />
      <ambientLight intensity={0.08} />
      <directionalLight position={[-3.2, 5.5, 4.2]} intensity={2.4} color="#fffaf4" />
      <directionalLight position={[4.5, 2.2, -2]} intensity={1.35} color="#f3f3f1" />
      <directionalLight position={[0.2, 1.4, 5]} intensity={0.55} color="#f7f4ee" />
      <Suspense fallback={null}>
        <Environment resolution={high ? 512 : 64}>
          <Lightformer form="rect" intensity={6} position={[0, 4.2, 0.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[12, 8, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={8} position={[-2.4, 1.8, 3.2]} scale={[5, 7, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={4.5} position={[2.8, 1.4, 2.6]} scale={[4, 6, 1]} color="#f4f1ea" />
          <Lightformer form="rect" intensity={2.2} position={[0, 1.3, -3.2]} scale={[8, 5, 1]} color="#d5d3cb" />
        </Environment>
      </Suspense>
      <Rig composition={composition} />
      <Floor />
      <City count={high ? 64 : 24} />
      <Trails />
      <Particles count={high ? 520 : 160} progressRef={progressRef} />
      <Rings progressRef={progressRef} />
      <Figure progressRef={progressRef} composition={composition} />
      {high ? (
        <EffectComposer enableNormalPass={false} multisampling={4}>
          <Bloom luminanceThreshold={0.92} intensity={0.28} mipmapBlur />
        </EffectComposer>
      ) : null}
    </>
  );
}
