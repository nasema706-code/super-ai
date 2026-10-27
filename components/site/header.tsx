"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-[11px] tracking-[0.16em] text-white/70 uppercase">
        Connect
      </span>
    ),
  },
);

const links = [
  { href: "/summon", label: "Protocol" },
  { href: "/tokenomics", label: "Lore" },
  { href: "/gallery", label: "Gallery" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="font-display text-sm tracking-[0.28em] text-white">
          SUPER AI
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.22em] text-white/65 uppercase transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none text-[11px] tracking-[0.18em] text-white/70 uppercase">
              Menu
            </summary>
            <div className="absolute right-0 mt-3 flex w-40 flex-col gap-3 rounded-2xl border border-white/10 bg-black/90 p-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs tracking-[0.16em] text-white/80 uppercase">
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
