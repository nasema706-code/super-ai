"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FILTERS, PLATES, type Frame, type Motif } from "@/lib/collection";

const WIDE = new Set(["ascent", "exhale", "chorus", "well", "oculus", "river", "council"]);

function frameClass(frame?: Frame) {
  if (frame === "banner") return "aspect-[3/1] w-full bg-black object-contain";
  if (frame === "square") return "aspect-square w-full bg-black object-contain";
  if (frame === "portrait") return "aspect-[2/3] w-full bg-black object-contain";
  return "aspect-[1678/937] w-full object-cover";
}

export function PlateGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const active = FILTERS.find((item) => item.id === filter) ?? FILTERS[0];
  const visible = filter === "all" ? PLATES : PLATES.filter((plate) => plate.motifs.includes(filter as Motif));
  const selected = visible.find((plate) => plate.slug === open) ?? null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the plates">
        {FILTERS.map((item) => {
          const selectedFilter = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selectedFilter}
              onClick={() => {
                setFilter(item.id);
                setOpen(null);
              }}
              className={
                selectedFilter
                  ? "inline-flex h-11 items-center border border-foreground bg-foreground px-4 text-xs tracking-catalog text-background uppercase"
                  : "inline-flex h-11 items-center border border-border px-4 text-xs tracking-catalog text-muted uppercase hover:border-foreground hover:text-foreground"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm font-light text-faint">{active.line}</p>

      {selected ? (
        <article className="mt-8 border border-border">
          <Image
            src={selected.src}
            alt={selected.alt}
            width={selected.frame === "banner" ? 1500 : 1678}
            height={selected.frame === "banner" ? 500 : 937}
            className={frameClass(selected.frame)}
          />
          <div className="grid gap-4 border-t border-border p-5 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="kicker">
                {selected.index} · {selected.chamber}
              </p>
              <h2 className="font-display mt-3 text-4xl font-light italic">{selected.title}</h2>
              <p className="mt-2 text-sm font-light text-muted">{selected.epithet}</p>
            </div>
            <div>
              <p className="text-sm leading-7 font-light text-foreground/85">{selected.excerpt}</p>
              {selected.slug === "oculus" ? (
                <Link href="/summon" className="mt-5 inline-flex h-11 items-center border border-foreground bg-foreground px-5 text-xs tracking-catalog text-background uppercase">
                  Open the eye
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      ) : null}

      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {visible.map((plate) => {
          const wide = plate.frame === "banner" || (filter === "all" && WIDE.has(plate.slug));
          return (
            <li key={plate.slug} className={wide ? "md:col-span-2" : undefined}>
              <button type="button" onClick={() => setOpen(plate.slug)} className="block w-full text-left">
                <Image
                  src={plate.src}
                  alt={plate.alt}
                  width={plate.frame === "banner" ? 1500 : 1678}
                  height={plate.frame === "banner" ? 500 : 937}
                  className={frameClass(plate.frame)}
                />
                <p className="kicker mt-3">
                  {plate.index} · {plate.title}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
