"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { CompanionChat } from "@/components/summon/companion-chat";
import { ForgePanel } from "@/components/summon/forge-panel";
import { Button } from "@/components/ui/button";
import { getPlate } from "@/lib/collection";
import { MOVEMENTS } from "@/lib/learning";

const RITE = "open";
const CLOSED = 14;
const OPEN = 150;
const OCULUS = getPlate("oculus");
const OCULUS_LINE =
  MOVEMENTS.find((movement) => movement.id === "itself")?.lines.oculus ??
  "An eye opened with no face around it. Sight, without a witness to flatter.";

type StoredMessage = { id: string; role: "user" | "assistant"; content: string };

function toUi(message: StoredMessage): UIMessage {
  return {
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
  };
}

export function SummonExperience() {
  const [rite, setRite] = useState<{ wallet: string; phase: "awakening" | "manifest" } | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [reveal, setReveal] = useState(CLOSED);
  const [record, setRecord] = useState<{
    wallet: string;
    messages: UIMessage[];
    summoned: boolean;
  } | null>(null);
  const [panel, setPanel] = useState<"dialogue" | "forge">("dialogue");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let cancel = false;
    void fetch("/api/memory")
      .then((response) => response.json())
      .then((body: { profile?: { summonCount?: number }; messages?: StoredMessage[] }) => {
        if (cancel) return;
        const summoned = (body.profile?.summonCount ?? 0) > 0;
        setRecord({
          wallet: RITE,
          messages: (body.messages ?? []).map(toUi),
          summoned,
        });
        if (summoned) setReveal(OPEN);
      })
      .catch(() => {
        if (!cancel) setRecord({ wallet: RITE, messages: [], summoned: false });
      });

    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function runRitual() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    const finish = () => {
      setCaption(null);
      setReveal(OPEN);
      setRite({ wallet: RITE, phase: "manifest" });
      void fetch("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "summon" }),
      });
    };

    if (reduce) {
      finish();
      return;
    }

    setReveal(CLOSED);
    setRite({ wallet: RITE, phase: "awakening" });
    setCaption("The dark holds");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setReveal(OPEN));
    });
    timers.current = [
      window.setTimeout(() => setCaption("An eye opens"), 1100),
      window.setTimeout(() => setCaption("Sight, without a witness"), 2300),
      window.setTimeout(finish, 3600),
    ];
  }

  function begin() {
    if (phase === "awakening") return;
    runRitual();
  }

  const localPhase = rite?.wallet === RITE ? rite.phase : null;
  const phase =
    localPhase === "awakening"
      ? "awakening"
      : localPhase === "manifest" || (record?.wallet === RITE && record.summoned)
        ? "manifest"
        : "dormant";
  const history = record?.wallet === RITE ? record.messages : null;
  const chatReady = phase === "manifest" && history !== null;
  const opening = phase === "awakening";

  return (
    <div className="grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="relative flex min-h-[70svh] items-center justify-center px-4 py-8 lg:min-h-0 lg:px-8">
        <div className="flex w-full max-w-3xl flex-col">
          <div className="relative w-full">
            <Image
              src="/works/oculus.jpg"
              alt=""
              width={1678}
              height={937}
              priority
              className="aspect-[1678/937] w-full object-cover opacity-30"
            />
            <Image
              src="/works/oculus.jpg"
              alt={OCULUS?.alt ?? "A ring of white light hangs above the cooling towers, with nothing inside it."}
              width={1678}
              height={937}
              className="absolute inset-0 aspect-[1678/937] h-full w-full object-cover"
              style={{
                clipPath: `circle(${reveal}% at 50% 36%)`,
                transition: opening ? "clip-path 3.4s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
            />
          </div>
          <blockquote className="mt-8 max-w-2xl">
            <p
              className="font-display text-3xl leading-snug font-light text-foreground italic md:text-4xl"
              style={{ opacity: reveal > 70 ? 1 : 0.35 }}
            >
              “{OCULUS_LINE}”
            </p>
            <footer className="kicker mt-4">
              {OCULUS?.index ?? "15"} · {OCULUS?.title ?? "Oculus"}
            </footer>
          </blockquote>
          <p className="mt-4 max-w-md text-sm leading-6 font-light text-muted">{OCULUS?.excerpt}</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            {caption ? <p className="kicker text-foreground/80">{caption}</p> : null}
            <Button size="lg" onClick={begin} disabled={opening || history === null}>
              {phase === "manifest" ? "Open again" : "Open the eye"}
            </Button>
          </div>
        </div>
      </section>
      <aside className="flex min-h-[70svh] flex-col border-t border-border bg-background/80 lg:min-h-0 lg:border-t-0 lg:border-l">
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
            {panel === "dialogue" ? <CompanionChat initialMessages={history} /> : <ForgePanel />}
          </>
        ) : (
          <div className="px-5 py-8">
            <p className="kicker">Before the eye</p>
            <p className="mt-3 text-sm leading-6 font-light text-muted">
              Open the eye. The companion speaks only after it has looked back, and it keeps what you tell it.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
