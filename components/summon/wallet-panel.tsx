"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBalances } from "@/hooks/use-balances";
import { formatTokenAmount, shortAddress } from "@/lib/utils";

type BindingState = {
  address: string | null;
  bound: boolean;
  pending: boolean;
  error: string | null;
  bind: () => Promise<boolean>;
  release: () => Promise<void>;
};

export function WalletPanel({ binding }: { binding: BindingState }) {
  const { snapshot, error, loading } = useBalances();

  return (
    <div className="border-b border-border px-4 py-5 md:px-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kicker">Bound wallet</p>
          <p className="mt-2 font-mono text-sm text-foreground">
            {binding.address ? shortAddress(binding.address) : "No wallet connected"}
          </p>
        </div>
        <Badge>{snapshot?.tier.label ?? "Unbound"}</Badge>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="kicker">SOL</dt>
          <dd className="mt-2 font-light text-foreground">{loading ? "Reading…" : snapshot ? snapshot.sol.toFixed(3) : "—"}</dd>
        </div>
        <div>
          <dt className="kicker">{snapshot?.tokenSymbol ?? "Token"}</dt>
          <dd className="mt-2 font-light text-foreground">
            {!snapshot?.tokenConfigured
              ? "Mint unset"
              : snapshot.tokenAmount == null
                ? "—"
                : formatTokenAmount(snapshot.tokenAmount)}
          </dd>
        </div>
      </dl>
      {snapshot?.tier.provisional ? (
        <p className="mt-3 text-xs leading-5 font-light text-faint">
          The mint is unpublished, so the gate is open at Bound while you build.
        </p>
      ) : null}
      {error ? <p className="mt-3 text-xs text-red-200/80">{error}</p> : null}
      {binding.error ? <p className="mt-3 text-xs text-red-200/80">{binding.error}</p> : null}
      <div className="mt-4 flex gap-2">
        {binding.address && !binding.bound ? (
          <Button size="sm" onClick={() => void binding.bind()} disabled={binding.pending}>
            {binding.pending ? "Awaiting signature" : "Bind wallet"}
          </Button>
        ) : null}
        {binding.bound ? (
          <Button size="sm" variant="ghost" onClick={() => void binding.release()}>
            Release
          </Button>
        ) : null}
      </div>
    </div>
  );
}
