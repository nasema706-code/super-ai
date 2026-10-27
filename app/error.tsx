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
      <p className="kicker">Interrupted</p>
      <h1 className="font-display mt-4 text-5xl font-light">The protocol stalled.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 font-light text-muted">{error.message}</p>
      <Button className="mt-8" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
