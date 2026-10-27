"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useStageQuality } from "@/hooks/use-stage-quality";

const SummonCanvas = dynamic(
  () => import("@/components/scene/summon-canvas").then((mod) => mod.SummonCanvas),
  { ssr: false },
);

export function Hero() {
  const progressRef = useRef(0.64);
  const quality = useStageQuality();

  return (
    <section className="grain relative min-h-svh">
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="dormant-ring" />
        </div>
        <SummonCanvas progressRef={progressRef} composition="hero" quality={quality} />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-[#05060a]/40" />
      </div>
      <div className="relative z-10 flex min-h-svh items-end px-4 pt-24 pb-16 md:items-center md:px-8 md:pb-0">
        <div className="max-w-3xl">
          <p className="text-[11px] tracking-[0.42em] text-white/60 uppercase">Summoning Intelligence</p>
          <h1 className="font-display mt-4 text-[18vw] leading-[0.82] font-semibold metal-text md:text-[7.6rem]">
            SUPER
            <br />
            AI
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-white/70 md:text-base">
            A wallet-bound companion. One mind, called out of a ring of light, that remembers the hand that summoned it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/summon">Enter the protocol</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tokenomics">Read the lore</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
