import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { resolveTier, TOKEN, type Tier } from "@/lib/protocol";

export type WalletSnapshot = {
  wallet: string;
  sol: number;
  tokenSymbol: string;
  tokenMint: string | null;
  tokenAmount: number | null;
  tokenConfigured: boolean;
  tier: Tier;
  readError?: string;
};

function asLamports(value: unknown) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "value" in value) {
    return asLamports((value as { value: unknown }).value);
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * Shared by the wallet panel (browser RPC) and the companion tools (server RPC).
 * Point NEXT_PUBLIC_SOLANA_RPC_URL at a provider with browser CORS if the panel
 * reads the chain directly.
 */
export async function readBalances(
  connection: Connection,
  wallet: string,
): Promise<WalletSnapshot> {
  const owner = new PublicKey(wallet);
  const lamports = asLamports(await connection.getBalance(owner));
  const sol = lamports / LAMPORTS_PER_SOL;

  if (!TOKEN.mint) {
    return {
      wallet,
      sol,
      tokenSymbol: TOKEN.symbol,
      tokenMint: null,
      tokenAmount: null,
      tokenConfigured: false,
      tier: resolveTier(null),
    };
  }

  let mint: PublicKey;
  try {
    mint = new PublicKey(TOKEN.mint);
  } catch {
    return {
      wallet,
      sol,
      tokenSymbol: TOKEN.symbol,
      tokenMint: TOKEN.mint,
      tokenAmount: null,
      tokenConfigured: true,
      tier: resolveTier(0),
      readError: "Token mint is not a valid address.",
    };
  }

  const accounts = await connection.getParsedTokenAccountsByOwner(owner, { mint });
  const raw = accounts.value[0]?.account.data.parsed?.info?.tokenAmount?.uiAmount;
  const tokenAmount = raw == null ? 0 : Number(raw);

  return {
    wallet,
    sol,
    tokenSymbol: TOKEN.symbol,
    tokenMint: TOKEN.mint,
    tokenAmount: Number.isFinite(tokenAmount) ? tokenAmount : 0,
    tokenConfigured: true,
    tier: resolveTier(Number.isFinite(tokenAmount) ? tokenAmount : 0),
  };
}
