"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PLATES, plateWord } from "@/lib/collection";

const DWELL_MS = 5200;

export function Hero() {
  const frames = PLATES;
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const frame = frames[index];
  const ahead = (index + 1) % frames.length;
  const previous = started ? (index - 1 + frames.length) % frames.length : null;

  useEffect(() => {
    if (frames.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setStarted(true);
      setIndex((current) => (current + 1) % frames.length);
    }, DWELL_MS);
    return () => window.clearInterval(timer);
  }, [frames.length]);

  const slots = Array.from(new Set([previous, index, ahead].filter((slot): slot is number => slot !== null)));

  return (
    <section className="relative flex min-h-dvh items-end" aria-label="Visions, playing in order">
      {slots.map((slot) => {
        const vision = frames[slot];
        const active = slot === index;
        return (
          <Image
            key={vision.slug}
            src={vision.src}
            alt={active ? vision.alt : ""}
            fill
            priority={slot === 0}
            aria-hidden={active ? undefined : true}
            style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0, transition: "opacity 1s ease" }}
            className="object-cover object-center"
          />
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/45" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/80 to-transparent" />
      <div className="relative z-10 flex min-h-dvh w-full flex-col justify-end px-4 pt-24 pb-8 md:px-10 md:pb-10">
        <p className="kicker">Super AI · {plateWord()} visions · 2026</p>
        <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[1.05] font-light text-foreground md:text-[5.5rem]">
          Summoning
          <br />
          <span className="italic">Intelligence</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 font-light text-foreground/85">
          A hall for a mind. The visions are the story. The eye opens where a body used to stand.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/story">Read the story</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/summon">Open the eye</Link>
          </Button>
        </div>
        <div className="mt-10 flex items-end justify-between gap-6 border-t border-foreground/20 pt-4">
          <p className="kicker">
            Vision {frame.index} · {frame.title}
          </p>
          <p className="font-display text-sm text-foreground/90 italic">{frame.epithet}</p>
        </div>
      </div>
    </section>
  );
}
