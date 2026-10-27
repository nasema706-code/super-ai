"use client";

import Link from "next/link";

const links = [
  { href: "/story", label: "Story" },
  { href: "/gallery", label: "Collection" },
  { href: "/record", label: "Record" },
  { href: "/summon", label: "Protocol" },
  { href: "/tokenomics", label: "Thesis" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/70 text-[10px] tracking-[0.18em] text-foreground">
            SI
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-light text-foreground italic">Summoning Intelligence</span>
            <span className="mt-1 text-[9px] tracking-catalog text-muted uppercase">Super AI</span>
          </span>
        </Link>
        <nav className="hidden items-center md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-11 items-center px-3 text-xs tracking-catalog text-muted uppercase transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex justify-end md:col-start-3">
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none text-xs tracking-catalog text-muted uppercase">Menu</summary>
            <div className="absolute right-0 mt-3 flex w-44 flex-col border border-border bg-background p-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-xs tracking-catalog text-muted uppercase hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
