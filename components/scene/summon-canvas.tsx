"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { SummonWorld, type Composition, type StageQuality } from "@/components/scene/summon-world";

type ProgressRef = { current: number };

export function SummonCanvas({
  progressRef,
  composition,
  quality,
}: {
  progressRef: ProgressRef;
  composition: Composition;
  quality: StageQuality;
}) {
  const ritual = composition === "ritual";

  return (
    <Canvas
      className="h-full w-full"
      dpr={quality === "low" ? [1, 1.25] : ritual ? [1, 2] : [1, 1.75]}
      camera={{
        position: ritual ? [0.85, 1.55, 7.05] : [-0.55, 1.22, 7.05],
        fov: ritual ? 26 : 32,
        near: 0.1,
        far: 60,
      }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = ritual ? 1.16 : 1.05;
      }}
    >
      <Suspense fallback={null}>
        <SummonWorld progressRef={progressRef} composition={composition} quality={quality} />
      </Suspense>
    </Canvas>
  );
}
