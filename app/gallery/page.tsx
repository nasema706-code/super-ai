import Link from "next/link";
import { PlateGrid } from "@/components/gallery/plate-grid";
import { SiteFooter } from "@/components/site/footer";
import { plateWord } from "@/lib/collection";

export default function GalleryPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-border px-4 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="kicker">The collection</p>
            <h1 className="font-display mt-4 text-5xl leading-[0.95] font-light md:text-7xl">{plateWord()} visions</h1>
          </div>
          <p className="max-w-sm text-sm leading-6 font-light text-muted md:justify-self-end">
            The archive, by number. The story that uses every vision is told in order on{" "}
            <Link href="/story" className="text-foreground underline decoration-border underline-offset-4">
              its own page
            </Link>
            .
          </p>
        </div>
      </section>
      <section className="px-4 py-12 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <PlateGrid />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
