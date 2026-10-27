"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
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
  return (
    <Canvas
      className="h-full w-full"
      dpr={quality === "low" ? [1, 1.2] : [1, 1.7]}
      camera={{ position: composition === "hero" ? [-0.55, 1.22, 7.05] : [0, 1.12, 5.65], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.08;
      }}
    >
      <Suspense fallback={null}>
        <SummonWorld progressRef={progressRef} composition={composition} quality={quality} />
      </Suspense>
    </Canvas>
  );
}
