"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useCallback, useEffect, useState } from "react";
import { bindingMessage } from "@/lib/solana/binding-message";

export function useBinding() {
  const { publicKey, signMessage, disconnect, connected } = useWallet();
  const [sessionWallet, setSessionWallet] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/session");
    const body = (await response.json()) as { wallet?: string | null };
    setSessionWallet(body.wallet ?? null);
  }, []);

  useEffect(() => {
    let cancel = false;
    fetch("/api/session")
      .then((response) => response.json())
      .then((body: { wallet?: string | null }) => {
        if (!cancel) setSessionWallet(body.wallet ?? null);
      })
      .catch(() => {
        if (!cancel) setSessionWallet(null);
      });
    return () => {
      cancel = true;
    };
  }, []);

  const address = publicKey?.toBase58() ?? null;
  const bound = Boolean(address && sessionWallet === address);

  const bind = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError("This wallet cannot sign the binding.");
      return false;
    }

    setPending(true);
    setError(null);
    try {
      const issuedAt = Date.now();
      const wallet = publicKey.toBase58();
      const message = bindingMessage(wallet, issuedAt);
      const signature = await signMessage(new TextEncoder().encode(message));
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ wallet, message, signature: bs58.encode(signature) }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error || "The binding was refused.");
      setSessionWallet(wallet);
      return true;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The binding was refused.";
      setError(message);
      return false;
    } finally {
      setPending(false);
    }
  }, [publicKey, signMessage]);

  const release = useCallback(async () => {
    await fetch("/api/session", { method: "DELETE" });
    setSessionWallet(null);
    await disconnect().catch(() => undefined);
  }, [disconnect]);

  return { address, connected, bound, pending, error, bind, release, refresh };
}
