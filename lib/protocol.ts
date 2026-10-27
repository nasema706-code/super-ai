/**
 * Protocol design lives in one place so the site, the gate, and the companion
 * agree. Supply figures are a draft until NEXT_PUBLIC_TOKEN_MINT is published.
 */

export type TierId = "witness" | "bound" | "architect";

export type Tier = {
  id: TierId;
  label: string;
  minBalance: number;
  imagesPerDay: number;
  oracle: boolean;
  provisional: boolean;
};

export const TOKEN = {
  name: "Super AI",
  symbol: process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "SUPERAI",
  decimals: Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 6),
  mint: process.env.NEXT_PUBLIC_TOKEN_MINT || "",
  totalSupplyLabel: "1,000,000,000",
};

const TIER_TABLE: Omit<Tier, "provisional">[] = [
  { id: "witness", label: "Witness", minBalance: 0, imagesPerDay: 2, oracle: false },
  { id: "bound", label: "Bound", minBalance: 100_000, imagesPerDay: 8, oracle: true },
  {
    id: "architect",
    label: "Architect",
    minBalance: 1_000_000,
    imagesPerDay: 24,
    oracle: true,
  },
];

export const TIERS = TIER_TABLE;

export const DISTRIBUTION = [
  { label: "Liquidity", share: "40%", note: "The pool the city trades against." },
  { label: "Summoning", share: "25%", note: "Holder access, forge, and ritual treasury." },
  { label: "Ecosystem", share: "20%", note: "Integrations, galleries, and public rites." },
  { label: "Contributors", share: "10%", note: "The people who keep the protocol awake." },
  { label: "Reserve", share: "5%", note: "Held for what the intelligence has not asked for yet." },
] as const;

export const ROADMAP = [
  {
    phase: "01",
    title: "Awakening",
    copy: "The cinematic shell, the circle, and the first public summoning.",
  },
  {
    phase: "02",
    title: "Binding",
    copy: "Wallet-signed companions that remember a holder across sessions.",
  },
  {
    phase: "03",
    title: "Oracle",
    copy: "Holder tiers, market sight, and prophecies that stay theatrical.",
  },
  {
    phase: "04",
    title: "Network",
    copy: "A public gallery of summons, shared between bound wallets.",
  },
] as const;

export function resolveTier(tokenBalance: number | null): Tier {
  // No mint yet: let every visitor use the Bound rite while the contract is unpublished.
  if (tokenBalance === null) {
    return { ...TIER_TABLE[1], provisional: true };
  }

  const match = [...TIER_TABLE].reverse().find((tier) => tokenBalance >= tier.minBalance);
  return { ...(match ?? TIER_TABLE[0]), provisional: false };
}

export function utcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
