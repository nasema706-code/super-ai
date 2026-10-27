"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import type { Adapter } from "@solana/wallet-adapter-base";
import { useEffect, useMemo, useState } from "react";
import { solanaRpcUrl } from "@/lib/solana/rpc";
import "@solana/wallet-adapter-react-ui/styles.css";

const CONFIG = { commitment: "confirmed" as const };

/**
 * Phantom and Solflare are registered directly.
 * The bundled `@solana/wallet-adapter-wallets` package pulls install scripts
 * that fail on Windows, so extra adapters should be added here one package at a time.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => solanaRpcUrl(), []);
  const [wallets, setWallets] = useState<Adapter[]>([]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [{ PhantomWalletAdapter }, { SolflareWalletAdapter }] = await Promise.all([
        import("@solana/wallet-adapter-phantom"),
        import("@solana/wallet-adapter-solflare"),
      ]);
      if (!active) return;
      setWallets([new PhantomWalletAdapter(), new SolflareWalletAdapter()]);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint} config={CONFIG}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
