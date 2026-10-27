"use client";

import { useEffect, useState } from "react";
import type { StageQuality } from "@/components/scene/summon-world";

export function useStageQuality() {
  const [quality, setQuality] = useState<StageQuality>("high");

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const apply = () => setQuality(query.matches ? "low" : "high");
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return quality;
}
