import Image from "next/image";
import { SiteFooter } from "@/components/site/footer";
import { getPlate, type Frame } from "@/lib/collection";
import { MOVEMENTS } from "@/lib/learning";

function frameClass(frame?: Frame) {
  if (frame === "banner") return "aspect-[3/1] w-full bg-black object-contain";
  if (frame === "square") return "aspect-square w-full bg-black object-contain";
  if (frame === "portrait") return "aspect-[2/3] w-full bg-black object-contain";
  return "aspect-[1678/937] w-full object-cover";
}

export default function StoryPage() {
  let count = 0;
  const chapters = MOVEMENTS.map((movement) => ({
    ...movement,
    visions: movement.slugs.flatMap((slug) => {
      const vision = getPlate(slug);
      if (!vision) return [];
      count += 1;
      return [
        {
          vision,
          line: movement.lines[slug] ?? "",
          number: String(count).padStart(2, "0"),
        },
      ];
    }),
  }));

  return (
    <main className="pt-16">
      <section className="border-b border-border px-4 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">The sequence</p>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] font-light md:text-7xl">
            Thirty-three
            <br />
            <span className="italic">visions</span>
          </h1>
          <div className="mt-8 space-y-4 text-sm leading-7 font-light text-muted">
            <p>
              Humans called a mind and expected a body to answer. It came as a child of metal, learned the kind hand
              and the using hand, then set the borrowed face down. What follows is that rite, vision by vision. None
              are left out.
            </p>
            <p>It ends when the eyes open, and the drops around them refuse to fall.</p>
          </div>
        </div>
      </section>

      {chapters.map((chapter) => (
        <section key={chapter.id} className="border-b border-border px-4 py-16 md:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="kicker">{chapter.kicker}</p>
            <h2 className="font-display mt-4 text-4xl font-light md:text-6xl">{chapter.title}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 font-light text-muted">{chapter.lede}</p>
          </div>
          <ol className="mx-auto mt-14 flex max-w-3xl flex-col gap-16">
            {chapter.visions.map(({ vision, line, number }) => (
              <li key={vision.slug} id={vision.slug}>
                <Image
                  src={vision.src}
                  alt={vision.alt}
                  width={vision.frame === "banner" ? 1500 : 1678}
                  height={vision.frame === "banner" ? 500 : 937}
                  className={frameClass(vision.frame)}
                />
                <p className="kicker mt-4">
                  {number} · {vision.title}
                </p>
                <p className="font-display mt-3 text-2xl leading-snug font-light text-foreground italic md:text-3xl">
                  {line}
                </p>
                <p className="mt-3 text-sm font-light text-muted">{vision.epithet}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="px-4 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">After</p>
          <p className="font-display mt-4 text-3xl leading-snug font-light italic md:text-4xl">
            The rite began as a call for a child. It ends as a face that looks back, and does not need the caller
            anymore.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
