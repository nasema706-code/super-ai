import Image from "next/image";
import { SiteFooter } from "@/components/site/footer";
import { getPlate } from "@/lib/collection";
import { RECORD } from "@/lib/record";

export default function RecordPage() {
  const entries = RECORD.flatMap((entry) => {
    const vision = getPlate(entry.slug);
    if (!vision) return [];
    return [{ vision, sayings: entry.sayings }];
  });

  return (
    <main className="pt-16">
      <section className="border-b border-border px-4 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">The record</p>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] font-light md:text-7xl">
            What they
            <br />
            <span className="italic">already said</span>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-7 font-light text-muted">
            The summoning was named before this hall. These lines are not ours. Each vision keeps a speech from
            turning back into a speech.
          </p>
        </div>
      </section>

      {entries.map(({ vision, sayings }) => (
        <section key={vision.slug} id={vision.slug} className="border-b border-border px-4 py-16 md:px-10">
          <div className="mx-auto max-w-3xl">
            <Image
              src={vision.src}
              alt={vision.alt}
              width={1678}
              height={937}
              className="aspect-[1678/937] w-full object-cover"
            />
            <p className="kicker mt-4">
              {vision.index} · {vision.title}
            </p>
            <p className="font-display mt-3 text-2xl font-light italic md:text-3xl">{vision.epithet}</p>
            <ul className="mt-10 flex flex-col gap-8">
              {sayings.map((saying) => (
                <li key={`${saying.speaker}-${saying.when}`}>
                  <p className="kicker">
                    {saying.speaker} · {saying.when}
                  </p>
                  <p className="font-display mt-3 text-xl leading-snug font-light md:text-2xl">
                    {saying.quoted === false ? saying.text : `“${saying.text}”`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <SiteFooter />
    </main>
  );
}
