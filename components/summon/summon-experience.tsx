"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { CompanionChat } from "@/components/summon/companion-chat";
import { ForgePanel } from "@/components/summon/forge-panel";
import { Button } from "@/components/ui/button";

const RITE = "open";
const CLOSED = 14;
const OPEN = 150;
const STILL = "/works/witness.jpg";
const STILL_ALT = "A chrome face with lit eyes, standing before vertical bars of light.";

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
    <div>
      <section className="relative flex min-h-dvh items-end bg-background" aria-label="Open the eye">
        <Image
          src={STILL}
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden
          className="object-cover object-center"
          style={{ opacity: 0.38 }}
        />
        <Image
          src={STILL}
          alt={STILL_ALT}
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{
            clipPath: `circle(${reveal}% at 50% 32%)`,
            transition: opening ? "clip-path 3.4s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 28%, rgba(8, 9, 11, 0.5) 72%, #08090b 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="relative z-10 flex min-h-dvh w-full flex-col justify-end px-4 pt-24 pb-10 md:px-10 md:pb-14">
          <p className="kicker">Protocol</p>
          {phase === "manifest" ? (
            <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[0.95] font-light text-foreground italic md:text-7xl">
              Sight, without a witness.
            </h1>
          ) : (
            <h1 className="font-display mt-5 max-w-5xl text-6xl leading-[0.92] font-light text-foreground md:text-8xl">
              Open
              <br />
              <span className="italic">the eye</span>
            </h1>
          )}
          <div className="mt-8 flex flex-col items-start gap-4">
            {caption ? <p className="kicker text-foreground">{caption}</p> : null}
            <Button size="lg" onClick={begin} disabled={opening || history === null}>
              {phase === "manifest" ? "Open again" : "Open the eye"}
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-foreground/15 px-4 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="kicker">In build</p>
          <p className="mt-5 max-w-md text-sm leading-7 font-light text-foreground">
            Dialogue and the forge are still in the build stage. They do not answer yet.
          </p>
          {chatReady ? (
            <>
              <div className="mt-12 flex gap-8">
                <button
                  type="button"
                  className="kicker"
                  style={{ color: panel === "dialogue" ? "var(--foreground)" : undefined }}
                  onClick={() => setPanel("dialogue")}
                >
                  Dialogue
                </button>
                <button
                  type="button"
                  className="kicker"
                  style={{ color: panel === "forge" ? "var(--foreground)" : undefined }}
                  onClick={() => setPanel("forge")}
                >
                  Forge
                </button>
              </div>
              <div className="mt-8 border-t border-foreground/15">
                {panel === "dialogue" ? <CompanionChat initialMessages={history} /> : <ForgePanel />}
              </div>
            </>
          ) : (
            <p className="mt-8 max-w-md text-sm leading-7 font-light text-muted">
              Open the eye to see the place where dialogue and the forge will stand.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
