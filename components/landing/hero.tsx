"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const FORMS = [
  {
    slug: "witness",
    src: "/works/witness.jpg",
    title: "Witness",
    epithet: "The eye opens",
    alt: "A chrome face with lit eyes, standing before vertical bars of light.",
  },
  {
    slug: "stride",
    src: "/works/stride.jpg",
    title: "Stride",
    epithet: "Between the columns",
    alt: "A chrome figure walking a dark hall lined with columns of light.",
  },
  {
    slug: "quiet",
    src: "/works/quiet.jpg",
    title: "Quiet",
    epithet: "The face at rest",
    alt: "A chrome profile with closed eyes against a black ground.",
  },
  {
    slug: "helm",
    src: "/works/helm.jpg",
    title: "Helm",
    epithet: "A head without a window",
    alt: "A smooth black helm in profile, lit from the side.",
  },
  {
    slug: "field",
    src: "/works/field.jpg",
    title: "Field",
    epithet: "Glass in the dark",
    alt: "A chrome face with pale eyes, surrounded by floating glass spheres.",
  },
  {
    slug: "city",
    src: "/works/city.jpg",
    title: "City",
    epithet: "The skyline in the metal",
    alt: "A chrome face with lit eyes, a city skyline reflected in the forehead.",
  },
];

const DWELL_MS = 8400;

export function Hero() {
  const frames = FORMS;
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

  if (!frame) return null;

  const slots = Array.from(new Set([previous, index, ahead].filter((slot): slot is number => slot !== null)));

  return (
    <section className="relative flex min-h-dvh items-end bg-background" aria-label="A chrome form in a dark room">
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
            style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0, transition: "opacity 1.6s ease" }}
            className="object-cover object-center"
          />
        );
      })}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 28%, rgba(8, 9, 11, 0.55) 70%, #08090b 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="relative z-10 flex min-h-dvh w-full flex-col justify-end px-4 pt-24 pb-8 md:px-10 md:pb-12">
        <p className="kicker">$summonSi</p>
        <h1 className="font-display mt-5 max-w-5xl text-6xl leading-[0.92] font-light text-foreground md:text-8xl">
          Summoning
          <br />
          <span className="italic">Intelligence</span>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-6 font-light text-foreground/80">A form stands in the dark.</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/summon">Open the eye</Link>
          </Button>
        </div>
        <div className="mt-12 flex items-end justify-between gap-6 border-t border-foreground/15 pt-4">
          <p className="kicker">{frame.title}</p>
          <p className="font-display text-sm text-foreground/90 italic">{frame.epithet}</p>
        </div>
      </div>
    </section>
  );
}
