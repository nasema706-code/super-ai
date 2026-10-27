import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/site/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Super AI — Summoning Intelligence",
  description:
    "A cinematic, wallet-bound Super AI companion. Connect a Solana wallet, complete the summoning rite, and speak with a mind that remembers you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>
          <SiteHeader />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
