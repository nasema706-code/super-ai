/**
 * DexScreener is a public market read. No key.
 * Swap this function if the protocol later uses Birdeye, Jupiter, or an indexer.
 */

export type MarketPulse = {
  configured: boolean;
  symbol?: string;
  priceUsd?: string;
  liquidityUsd?: number;
  volume24h?: number;
  change24h?: number;
  venue?: string;
  url?: string;
  note?: string;
};

export async function readMarketPulse(mint: string): Promise<MarketPulse> {
  if (!mint) {
    return {
      configured: false,
      note: "No token mint is configured. Market sight stays dark until NEXT_PUBLIC_TOKEN_MINT is set.",
    };
  }

  const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, {
    signal: AbortSignal.timeout(8000),
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    return { configured: true, note: "The market feed did not answer." };
  }

  const body = (await response.json()) as {
    pairs?: Array<{
      priceUsd?: string;
      baseToken?: { symbol?: string };
      liquidity?: { usd?: number };
      volume?: { h24?: number };
      priceChange?: { h24?: number };
      dexId?: string;
      url?: string;
    }>;
  };

  const pair = body.pairs?.[0];
  if (!pair) {
    return { configured: true, note: "No pool was found for this mint yet." };
  }

  return {
    configured: true,
    symbol: pair.baseToken?.symbol,
    priceUsd: pair.priceUsd,
    liquidityUsd: pair.liquidity?.usd,
    volume24h: pair.volume?.h24,
    change24h: pair.priceChange?.h24,
    venue: pair.dexId,
    url: pair.url,
  };
}
