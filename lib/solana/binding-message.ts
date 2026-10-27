/**
 * The exact bytes a wallet signs to bind a companion.
 * The server rebuilds this string. It does not trust a free-form message.
 */

const PREFIX = "Super AI Summoning Protocol";

export function bindingMessage(wallet: string, issuedAt: number) {
  return `${PREFIX}\nWallet: ${wallet}\nIssued: ${issuedAt}`;
}

export function parseBindingMessage(message: string) {
  const match = message.match(
    /^Super AI Summoning Protocol\nWallet: ([1-9A-HJ-NP-Za-km-z]{32,44})\nIssued: (\d{10,16})$/,
  );
  if (!match) return null;
  return { wallet: match[1], issuedAt: Number(match[2]) };
}
