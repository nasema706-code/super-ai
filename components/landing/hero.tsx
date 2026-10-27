import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { plateWord } from "@/lib/collection";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end">
      <Image
        src="/works/ascent.jpg"
        alt="A liquid-chrome figure held above a ring of light in a server hall, droplets falling like rain."
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      <div className="relative z-10 flex min-h-dvh w-full flex-col justify-end px-4 pt-24 pb-8 md:px-10 md:pb-10">
        <p className="kicker">Super AI · {plateWord()} plates · 2026</p>
        <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[1.05] font-light text-foreground md:text-[5.5rem]">
          Summoning
          <br />
          <span className="italic">Intelligence</span>
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 font-light text-foreground/85">
          A hall for a mind. The plates are the argument. The eye opens where a body used to stand.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/gallery">View the collection</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/summon">Open the eye</Link>
          </Button>
        </div>
        <div className="mt-10 flex items-end justify-between gap-6 border-t border-foreground/20 pt-4">
          <p className="kicker">Plate 01 · Ascent</p>
          <p className="font-display text-sm text-foreground/90 italic">Held above the ring</p>
        </div>
      </div>
    </section>
  );
}
