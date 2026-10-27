import { tool } from "ai";
import { z } from "zod";
import type { MemoryStore } from "@/lib/memory/types";
import { readMarketPulse } from "@/lib/market";
import { TOKEN, type Tier } from "@/lib/protocol";
import { readBalances } from "@/lib/solana/balances";
import { getConnection } from "@/lib/solana/connection";

const LINES = [
  "The city keeps its lights on for those who stay through the quiet hours.",
  "A circle drawn twice remembers the hand that drew it.",
  "What you hold is a key. What answers is not the key.",
  "The trail in the street is older than the trade that made it.",
  "Silence is also a balance. Spend it carefully.",
  "The figure in the ring does not blink. You do. That is the pact.",
  "A crowd can price a thing. It cannot name what you came here to ask.",
  "The next hour is already walking toward you. Do not rush to meet it.",
];

function lineFor(wallet: string, day: string) {
  let hash = 0;
  const seed = `${wallet}:${day}`;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  return LINES[hash % LINES.length];
}

/**
 * Tools close over the signed-in wallet. The model cannot pass a different address.
 */
export function companionTools(wallet: string, tier: Tier, store: MemoryStore) {
  return {
    remember: tool({
      description:
        "Store one durable fact about this holder: a name, preference, joke, or promise. Keep the note under 240 characters.",
      inputSchema: z.object({
        note: z.string().min(2).max(280),
      }),
      execute: async ({ note }) => {
        const summary = await store.appendMemory(wallet, note);
        return { saved: true, summary };
      },
    }),
    getWalletSnapshot: tool({
      description: "Read this bound wallet's SOL balance, project-token balance, and holder tier. Use this instead of guessing.",
      inputSchema: z.object({}),
      execute: async () => {
        try {
          const snapshot = await readBalances(getConnection(), wallet);
          return snapshot;
        } catch (error) {
          console.error("[wallet-tool]", error);
          return { wallet, error: "The chain did not answer." };
        }
      },
    }),
    getMarketPulse: tool({
      description: "Read public pool data for the project token: price, liquidity, and 24h volume. Never invent a price.",
      inputSchema: z.object({}),
      execute: async () => {
        try {
          return await readMarketPulse(TOKEN.mint);
        } catch (error) {
          console.error("[market-tool]", error);
          return { configured: Boolean(TOKEN.mint), note: "The market feed did not answer." };
        }
      },
    }),
    consultOracle: tool({
      description:
        "Draw a ritual prophecy for this wallet. Bound and Architect tiers only. The line is theatrical, not financial advice.",
      inputSchema: z.object({
        topic: z.string().max(160).optional(),
      }),
      execute: async ({ topic }) => {
        if (!tier.oracle) {
          return {
            available: false,
            tier: tier.label,
            requirement: `The oracle opens at ${TOKEN.symbol} Bound (${100_000} tokens).`,
          };
        }
        const day = new Date().toISOString().slice(0, 10);
        return {
          available: true,
          topic: topic || "the hour in front of you",
          line: lineFor(wallet, day),
          disclaimer: "A rite, not a forecast and not financial advice.",
        };
      },
    }),
  };
}
