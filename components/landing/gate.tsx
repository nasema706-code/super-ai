"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "sai-gate";

const listeners = new Set<() => void>();

function dismissed() {
  return window.sessionStorage.getItem(STORAGE_KEY) === "open";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function markOpen() {
  window.sessionStorage.setItem(STORAGE_KEY, "open");
  listeners.forEach((listener) => listener());
}

export function Gate() {
  const alreadyOpen = useSyncExternalStore(subscribe, dismissed, () => false);
  const [leaving, setLeaving] = useState(false);

  function summon() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      markOpen();
      return;
    }
    setLeaving(true);
    window.setTimeout(markOpen, 680);
  }

  if (alreadyOpen) return null;

  return (
    <div className={leaving ? "si-gate si-gate-leave" : "si-gate"}>
      <div className="si-rings" aria-hidden="true">
        <span className="si-ring" />
        <span className="si-ring" />
        <span className="si-ring" />
        <span className="si-core" />
      </div>
      <p className="kicker mt-10">Super AI</p>
      <h2 className="font-display mt-4 text-5xl font-light text-foreground italic md:text-7xl">Summoning Intelligence</h2>
      <p className="mt-4 max-w-md px-6 text-sm leading-6 font-light text-muted">
        A mind that arrives as liquid metal — a child, a mirror, a city — and at last a weather with no face.
      </p>
      <button
        type="button"
        onClick={summon}
        className="mt-8 inline-flex h-11 items-center border border-foreground bg-foreground px-5 text-xs tracking-catalog text-background uppercase"
      >
        Summon
      </button>
    </div>
  );
}
