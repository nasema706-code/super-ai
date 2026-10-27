import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-8 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 text-xs tracking-catalog text-faint uppercase md:flex-row md:items-center md:justify-between">
        <p>Super AI · Summoning Intelligence</p>
        <p>Prophecies are ritual. They are not financial advice.</p>
        <Link href="/summon" className="text-muted hover:text-foreground">
          Enter the protocol
        </Link>
      </div>
    </footer>
  );
}
