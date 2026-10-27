"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ForgeResult = {
  url: string;
  source: "model" | "studio";
  notice?: string;
  remaining?: number;
  tier?: string;
};

export function ForgePanel() {
  const [prompt, setPrompt] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ForgeResult | null>(null);

  return (
    <form
      className="flex flex-col gap-4 px-4 py-5 md:px-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const nextPrompt = prompt.trim();
        if (nextPrompt.length < 3 || pending) return;
        setPending(true);
        setError(null);
        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ prompt: nextPrompt, isPublic }),
          });
          const body = (await response.json()) as ForgeResult & { error?: string };
          if (!response.ok) throw new Error(body.error || "The forge did not answer.");
          setResult(body);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "The forge did not answer.");
        } finally {
          setPending(false);
        }
      }}
    >
      <div>
        <p className="text-[11px] tracking-[0.22em] text-white/45 uppercase">Forge</p>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Ask for a plate in the same night: metal, ring, city lights. Without an image key, the studio strikes a plate locally.
        </p>
      </div>
      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="A silver figure above a street of light trails"
        maxLength={500}
      />
      <label className="flex items-center gap-2 text-xs tracking-wide text-white/60">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => setIsPublic(event.target.checked)}
          className="accent-white"
        />
        Share this summon in the gallery
      </label>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-white/40">
          {result?.remaining != null ? `${result.remaining} plates left today · ${result.tier ?? ""}` : "Holder tier sets the daily count."}
        </p>
        <Button type="submit" size="sm" disabled={pending || prompt.trim().length < 3}>
          {pending ? "Striking" : "Generate"}
        </Button>
      </div>
      {error ? <p className="text-xs text-red-200/80">{error}</p> : null}
      {result?.notice ? <p className="text-xs text-white/50">{result.notice}</p> : null}
      {result?.url ? (
        // Generated plates are dynamic URLs, including local API routes.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={result.url} alt={prompt || "Summoned plate"} className="aspect-square w-full rounded-2xl border border-white/10 object-cover" />
      ) : null}
    </form>
  );
}
