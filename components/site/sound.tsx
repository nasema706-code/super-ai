"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const SRC = "/audio/birth-of-super-ai.mp3";
const KEY = "sai-sound";

export function SiteSound() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.72;

    const silenced = () => window.sessionStorage.getItem(KEY) === "off";

    const start = () => {
      if (silenced()) return;
      void audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };

    const unlock = () => {
      start();
      window.removeEventListener("pointerdown", unlock);
    };

    if (!silenced()) {
      void audio.play().then(
        () => setPlaying(true),
        () => window.addEventListener("pointerdown", unlock),
      );
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  function toggle(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      window.sessionStorage.setItem(KEY, "off");
      setPlaying(false);
      return;
    }
    window.sessionStorage.setItem(KEY, "on");
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="auto" />
      <button
        type="button"
        onPointerDown={toggle}
        aria-pressed={playing}
        className="fixed right-4 bottom-4 z-[80] inline-flex h-11 items-center border border-border bg-background/80 px-4 text-xs tracking-catalog text-muted uppercase backdrop-blur-md hover:border-foreground hover:text-foreground"
      >
        {playing ? "Stop" : "Play"}
      </button>
    </>
  );
}
