"use client";

/* Three.js objects are mutable by design. Uniforms, materials, and refs are updated in the frame loop. */
/* eslint-disable react-hooks/refs -- Three.js refs are read while attaching materials and written in the frame loop. */

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
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
      desired.set(0, 1.12, 5.65);
      target.set(0, 1.02, 0);
    }
    state.camera.position.lerp(desired, 0.08);
    state.camera.lookAt(target);
  });

  return null;
}

function createCityMaterial() {
  return new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vWorld;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          varying vec3 vWorld;
          uniform float uTime;
          void main() {
            vec2 cell = floor(vWorld.xy * vec2(2.4, 3.2));
            float n = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
            float windowX = step(0.58, fract(vWorld.x * 2.4));
            float windowY = step(0.48, fract(vWorld.y * 3.2));
            float pulse = 0.72 + 0.28 * sin(uTime * 0.7 + n * 9.0);
            vec3 base = vec3(0.012, 0.014, 0.02);
            vec3 glow = mix(vec3(0.55, 0.78, 0.95), vec3(0.95, 0.9, 0.75), step(0.82, n));
            vec3 color = mix(base, glow * pulse, windowX * windowY * step(0.38, n));
            gl_FragColor = vec4(color, 1.0);
          }
        `,
  });
}

function City({ count }: { count: number }) {
  const materialRef = useRef(createCityMaterial());

  const buildings = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      let x = (unit(index + 3) - 0.5) * 26;
      if (Math.abs(x) < 1.8) x += x < 0 ? -2 : 2;
      const height = 0.7 + unit(index + 11) * 3.8;
      return {
        key: index,
        position: [x, height / 2, -6.5 - unit(index + 7) * 8] as [number, number, number],
        args: [0.38 + unit(index + 19) * 0.85, height, 0.38 + unit(index + 23) * 0.7] as [
          number,
          number,
          number,
        ],
      };
    });
  }, [count]);

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
      {buildings.map((building) => (
        <mesh key={building.key} position={building.position} material={materialRef.current}>
          <boxGeometry args={building.args} />
        </mesh>
      ))}
    </group>
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
          float lane = fract(vUv.y * 14.0);
          float band = smoothstep(0.46, 0.5, lane) * smoothstep(0.54, 0.5, lane);
          float speed = 0.08 + vUv.y * 0.22;
          float head = fract(vUv.x * (1.4 + vUv.y * 2.0) - uTime * speed);
          float streak = smoothstep(0.0, 0.02, head) * smoothstep(0.22, 0.02, head);
          float fade = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
          vec3 color = vec3(0.72, 0.9, 1.0) * streak * band * fade;
          gl_FragColor = vec4(color, streak * band * fade);
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
    <mesh rotation={[-Math.PI / 2.15, 0, 0]} position={[0, 0.01, 0.4]} material={materialRef.current}>
      <planeGeometry args={[30, 16]} />
    </mesh>
  );
}

function Particles({ count, progressRef }: { count: number; progressRef: ProgressRef }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const theta = unit(index + 1) * Math.PI * 2;
      const phi = Math.acos(2 * unit(index + 17) - 1);
      const radius = 1.5 + unit(index + 29) * 3.4;
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.cos(phi) * radius * 0.62 + 1.05;
      const z = Math.sin(phi) * Math.sin(theta) * radius;
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
      color: "#e7fbff",
      size: 0.03,
      transparent: true,
      opacity: 0.85,
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
      const spin = time * (0.05 + converge * 0.12) + index * 0.01;
      position.setXYZ(
        index,
        THREE.MathUtils.lerp(sx, Math.cos(spin) * 1.35, converge) + Math.sin(time + index) * 0.01,
        THREE.MathUtils.lerp(sy, 1.05 + Math.sin(spin * 0.7) * 0.35, converge),
        THREE.MathUtils.lerp(sz, Math.sin(spin) * 0.85, converge),
      );
    }
    position.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
}

function Rings({ progressRef }: { progressRef: ProgressRef }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const progress = progressRef.current;
    const speed = 0.15 + progress * 0.55;
    group.current.rotation.z = state.clock.elapsedTime * speed;
    group.current.rotation.x = Math.PI / 2.15 + Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    const scale = 0.82 + smoothstep(0.2, 1, progress) * 0.28;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={[0, 1.05, 0]}>
      <mesh>
        <torusGeometry args={[1.35, 0.012, 24, 180]} />
        <meshBasicMaterial color="#f4fdff" transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.62, 0.005, 16, 160]} />
        <meshBasicMaterial
          color="#9adfff"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Fragments({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        key: index,
        radius: 1.8 + unit(index + 5) * 1.1,
        speed: 0.12 + unit(index + 9) * 0.18,
        offset: unit(index + 2) * Math.PI * 2,
        y: 0.7 + unit(index + 15) * 1.3,
        kind: index % 3,
        scale: 0.08 + unit(index + 21) * 0.12,
      })),
    [count],
  );

  useFrame((state) => {
    const root = group.current;
    if (!root) return;
    root.children.forEach((child, index) => {
      const piece = pieces[index];
      const angle = state.clock.elapsedTime * piece.speed + piece.offset;
      child.position.set(Math.cos(angle) * piece.radius, piece.y + Math.sin(angle * 1.4) * 0.18, Math.sin(angle) * piece.radius * 0.55);
      child.rotation.x = angle;
      child.rotation.y = angle * 0.6;
    });
  });

  return (
    <group ref={group}>
      {pieces.map((piece) => (
        <mesh key={piece.key} scale={piece.scale}>
          {piece.kind === 0 ? <icosahedronGeometry args={[1, 0]} /> : null}
          {piece.kind === 1 ? <octahedronGeometry args={[1, 0]} /> : null}
          {piece.kind === 2 ? <boxGeometry args={[1, 1, 1]} /> : null}
          <meshStandardMaterial
            color="#c5ced8"
            metalness={1}
            roughness={0.25}
            wireframe={piece.kind !== 1}
          />
        </mesh>
      ))}
    </group>
  );
}

function createMetal() {
  return new THREE.MeshStandardMaterial({
    color: "#d5dbe4",
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.4,
    transparent: true,
  });
}

function Figure({ progressRef, composition }: { progressRef: ProgressRef; composition: Composition }) {
  const group = useRef<THREE.Group>(null);
  const metalRef = useRef(createMetal());

  useFrame((state) => {
    const root = group.current;
    if (!root) return;
    const appear = smoothstep(0.28, 0.92, progressRef.current);
    metalRef.current.opacity = 0.08 + appear * 0.92;
    const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    root.position.y = breathe;
    root.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    root.scale.setScalar(0.2 + appear * 0.8);
  });

  return (
    <group ref={group} position={[composition === "hero" ? 1.2 : 0, 0, 0]}>
      <mesh position={[0, 1.72, 0]} material={metalRef.current} castShadow>
        <sphereGeometry args={[0.22, 48, 48]} />
      </mesh>
      <mesh position={[0, 1.72, 0.2]}>
        <boxGeometry args={[0.26, 0.018, 0.02]} />
        <meshBasicMaterial color="#f4fdff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.46, 0]} material={metalRef.current}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 24]} />
      </mesh>
      <mesh position={[0, 1.12, 0]} material={metalRef.current}>
        <capsuleGeometry args={[0.24, 0.42, 8, 24]} />
      </mesh>
      <mesh position={[0, 1.2, 0.2]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshBasicMaterial color="#e9fdff" toneMapped={false} />
      </mesh>
      <mesh position={[-0.42, 1.28, 0]} rotation={[0, 0, 0.9]} material={metalRef.current}>
        <capsuleGeometry args={[0.07, 0.34, 6, 16]} />
      </mesh>
      <mesh position={[0.42, 1.28, 0]} rotation={[0, 0, -0.9]} material={metalRef.current}>
        <capsuleGeometry args={[0.07, 0.34, 6, 16]} />
      </mesh>
      <mesh position={[-0.12, 0.48, 0]} material={metalRef.current}>
        <capsuleGeometry args={[0.08, 0.46, 6, 16]} />
      </mesh>
      <mesh position={[0.12, 0.48, 0]} material={metalRef.current}>
        <capsuleGeometry args={[0.08, 0.46, 6, 16]} />
      </mesh>
    </group>
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
  return (
    <>
      <color attach="background" args={["#05060c"]} />
      <fog attach="fog" args={["#05060c", 8, 22]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 6, 5]} intensity={2.6} color="#f7f8fb" />
      <directionalLight position={[5, 2, -4]} intensity={1.5} color="#9adfff" />
      <pointLight position={[0, 1.5, 1.2]} intensity={4} distance={8} color="#e7fbff" />
      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3.2} position={[0, 4, 2]} scale={[8, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2} position={[-4, 1.5, -1]} scale={[4, 4, 1]} color="#b7e7ff" />
          <Lightformer form="ring" intensity={1.4} position={[3, 1, 2]} scale={[3, 3, 1]} color="#d5dde6" />
        </Environment>
      </Suspense>
      <Rig composition={composition} />
      <City count={quality === "low" ? 16 : 32} />
      <Trails />
      <Particles count={quality === "low" ? 180 : 640} progressRef={progressRef} />
      <Rings progressRef={progressRef} />
      <Fragments count={quality === "low" ? 5 : 8} />
      <Figure progressRef={progressRef} composition={composition} />
      {quality === "high" ? (
        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.62} intensity={0.48} mipmapBlur />
        </EffectComposer>
      ) : null}
    </>
  );
}
