import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 text-[11px] tracking-[0.16em] text-white/45 uppercase md:flex-row md:items-center md:justify-between">
        <p>Super AI · Summoning Intelligence</p>
        <p>Prophecies are ritual. They are not financial advice.</p>
        <Link href="/summon" className="text-white/70 hover:text-white">
          Enter the protocol
        </Link>
      </div>
    </footer>
  );
}
