import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SiteFooter } from "@/components/site/footer";

export default function GalleryPage() {
  return (
    <main className="pt-16">
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">Summons</p>
          <h1 className="font-display mt-4 text-5xl leading-none metal-text md:text-7xl">Public plates</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
            Plates a holder chose to share. Private summons stay with the wallet that called them.
          </p>
          <div className="mt-10">
            <GalleryGrid />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
