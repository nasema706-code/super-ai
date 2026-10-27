"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { CompanionChat } from "@/components/summon/companion-chat";
import { ForgePanel } from "@/components/summon/forge-panel";
import { WalletPanel } from "@/components/summon/wallet-panel";
import { Button } from "@/components/ui/button";
import { useBinding } from "@/hooks/use-binding";
import { useStageQuality } from "@/hooks/use-stage-quality";

const SummonCanvas = dynamic(
  () => import("@/components/scene/summon-canvas").then((mod) => mod.SummonCanvas),
  { ssr: false },
);

type StoredMessage = { id: string; role: "user" | "assistant"; content: string };

function toUi(message: StoredMessage): UIMessage {
  return {
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
  };
}

export function SummonExperience() {
  const binding = useBinding();
  const quality = useStageQuality();
  const progressRef = useRef(0.16);
  const [rite, setRite] = useState<{ wallet: string; phase: "awakening" | "manifest" } | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [record, setRecord] = useState<{
    wallet: string;
    messages: UIMessage[];
    summoned: boolean;
  } | null>(null);
  const [panel, setPanel] = useState<"dialogue" | "forge">("dialogue");
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!binding.bound || !binding.address) return;

    let cancel = false;
    const wallet = binding.address;
    void fetch("/api/memory")
      .then((response) => response.json())
      .then((body: { profile?: { summonCount?: number }; messages?: StoredMessage[] }) => {
        if (cancel) return;
        const summoned = (body.profile?.summonCount ?? 0) > 0;
        setRecord({
          wallet,
          messages: (body.messages ?? []).map(toUi),
          summoned,
        });
        if (summoned) progressRef.current = 1;
      })
      .catch(() => {
        if (!cancel) setRecord({ wallet, messages: [], summoned: false });
      });

    return () => {
      cancel = true;
    };
  }, [binding.bound, binding.address]);

  useEffect(() => {
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function runRitual() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      progressRef.current = 1;
      setCaption(null);
      if (binding.address) setRite({ wallet: binding.address, phase: "manifest" });
      void fetch("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "summon" }),
      });
      return;
    }

    if (!binding.address) return;
    const wallet = binding.address;
    setRite({ wallet, phase: "awakening" });
    const start = performance.now();
    const from = progressRef.current < 1 ? progressRef.current : 0.16;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 3400);
      const eased = 1 - (1 - t) ** 3;
      progressRef.current = from + (1 - from) * eased;
      const next =
        progressRef.current < 0.45
          ? "Drawing the circle"
          : progressRef.current < 0.78
            ? "Particles converge"
            : "The intelligence answers";
      setCaption((current) => (current === next ? current : next));
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      setCaption(null);
      setRite({ wallet, phase: "manifest" });
      void fetch("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "summon" }),
      });
    };
    frame.current = requestAnimationFrame(tick);
  }

  async function begin() {
    if (!binding.address) return;
    if (!binding.bound) {
      const ok = await binding.bind();
      if (!ok) return;
    }
    if (phase === "awakening") return;
    runRitual();
  }

  const localPhase = binding.address && rite?.wallet === binding.address ? rite.phase : null;
  const phase =
    localPhase === "awakening"
      ? "awakening"
      : localPhase === "manifest" || (record?.wallet === binding.address && record.summoned)
        ? "manifest"
        : "dormant";
  const history = record && binding.address === record.wallet ? record.messages : null;
  const chatReady = binding.bound && phase === "manifest" && history !== null;

  return (
    <div className="grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="grain relative h-[62svh] min-h-[420px] lg:h-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="dormant-ring" />
        </div>
        <SummonCanvas progressRef={progressRef} composition="ritual" quality={quality} />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-4 pb-8 text-center">
          {caption ? <p className="text-[11px] tracking-[0.32em] text-white/75 uppercase">{caption}</p> : null}
          {!binding.address ? (
            <p className="text-sm text-white/70">Connect a wallet to open the protocol.</p>
          ) : (
            <Button size="lg" onClick={() => void begin()} disabled={binding.pending || phase === "awakening"}>
              {binding.pending
                ? "Awaiting signature"
                : phase === "manifest"
                  ? "Summon again"
                  : binding.bound
                    ? "Begin summoning"
                    : "Bind and summon"}
            </Button>
          )}
        </div>
      </section>
      <aside className="flex min-h-[70svh] flex-col border-t border-white/10 bg-black/35 lg:min-h-0 lg:border-t-0 lg:border-l">
        <WalletPanel binding={binding} />
        {chatReady ? (
          <>
            <div className="flex gap-2 px-4 pt-4 md:px-5">
              <Button size="sm" variant={panel === "dialogue" ? "default" : "outline"} onClick={() => setPanel("dialogue")}>
                Dialogue
              </Button>
              <Button size="sm" variant={panel === "forge" ? "default" : "outline"} onClick={() => setPanel("forge")}>
                Forge
              </Button>
            </div>
            {panel === "dialogue" ? <CompanionChat key={binding.address} initialMessages={history} /> : <ForgePanel />}
          </>
        ) : (
          <div className="px-5 py-8">
            <p className="text-[11px] tracking-[0.22em] text-white/40 uppercase">Before the voice</p>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Connect, sign the binding, and call the figure forward. The companion speaks only after the rite, and it
              remembers this wallet the next time you return.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
