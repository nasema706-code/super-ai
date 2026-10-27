"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import type { WalletSnapshot } from "@/lib/solana/balances";
import { readBalances } from "@/lib/solana/balances";

export function useBalances() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const [snapshot, setSnapshot] = useState<WalletSnapshot | null>(null);
  const [error, setError] = useState<{ address: string; message: string } | null>(null);

  useEffect(() => {
    if (!address) return;
    let cancel = false;
    const wallet = address;
    readBalances(connection, wallet)
      .then((next) => {
        if (cancel) return;
        setSnapshot(next);
        setError(next.readError ? { address: wallet, message: next.readError } : null);
      })
      .catch((caught) => {
        if (cancel) return;
        setError({
          address: wallet,
          message: caught instanceof Error ? caught.message : "Balance unavailable.",
        });
      });

    return () => {
      cancel = true;
    };
  }, [connection, address]);

  const active = address && snapshot?.wallet === address ? snapshot : null;
  const activeError = error?.address === address ? error.message : null;

  return {
    snapshot: active,
    error: activeError,
    loading: Boolean(address) && !active && !activeError,
  };
}
