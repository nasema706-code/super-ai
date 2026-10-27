"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70svh] flex-col items-start justify-center px-6 pt-16">
      <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Interrupted</p>
      <h1 className="font-display mt-3 text-4xl">The protocol stalled.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-white/60">{error.message}</p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
