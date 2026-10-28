import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlate, plateWord } from "@/lib/collection";

export function Hero() {
  const vision = getPlate("unbound");
  if (!vision) return null;

  return (
    <section className="relative flex min-h-dvh items-end">
      <Image
        src={vision.src}
        alt={vision.alt}
        fill
        priority
        className="object-cover object-[center_58%]"
      />
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
            Vision {vision.index} · {vision.title}
          </p>
          <p className="font-display text-sm text-foreground/90 italic">{vision.epithet}</p>
        </div>
      </div>
    </section>
  );
}
