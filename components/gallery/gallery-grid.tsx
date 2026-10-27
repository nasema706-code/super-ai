"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  prompt: string;
  url: string;
  walletPreview: string;
  createdAt: string;
};

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    void fetch("/api/gallery")
      .then((response) => response.json())
      .then((body: { items?: GalleryItem[]; error?: string }) => {
        if (cancel) return;
        if (body.error) setError(body.error);
        setItems(body.items ?? []);
      })
      .catch(() => {
        if (!cancel) setError("The gallery did not open.");
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (!items) {
    return <p className="text-sm font-light text-muted">Opening the archive…</p>;
  }

  if (error) return <p className="text-sm text-red-200/80">{error}</p>;

  if (items.length === 0) {
    return (
      <p className="max-w-lg text-sm leading-6 font-light text-muted">
        No public summons yet. Strike a plate in the forge, and choose to share it.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure key={item.id} className="overflow-hidden border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.prompt} className="aspect-[1678/937] w-full object-cover" />
          <figcaption className="space-y-2 border-t border-border p-4">
            <p className="font-display text-lg leading-7 font-light">{item.prompt}</p>
            <p className="font-mono text-[11px] text-faint">{item.walletPreview}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
