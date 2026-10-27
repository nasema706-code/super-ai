import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { parseBindingMessage } from "@/lib/solana/binding-message";

const COOKIE = "sai_binding";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const MESSAGE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Wallet binding.
 * The address is a Solana public key, so the signature can be checked without
 * a custodial login. The cookie is an HMAC the browser cannot forge.
 * Set SESSION_SECRET in production.
 */

function secret() {
  const value = process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production.");
  }
  return "dev-only-super-ai-session-secret";
}

function sign(wallet: string, exp: number) {
  const payload = `${wallet}.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function readToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [wallet, expText, sig] = parts;
  const exp = Number(expText);
  if (!wallet || !Number.isFinite(exp) || exp * 1000 < Date.now()) return null;

  const expected = createHmac("sha256", secret()).update(`${wallet}.${expText}`).digest("base64url");
  const actualBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return wallet;
}

export function verifyBinding(wallet: string, message: string, signature: string) {
  const parsed = parseBindingMessage(message);
  if (!parsed || parsed.wallet !== wallet) return false;

  const skew = Date.now() - parsed.issuedAt;
  if (skew > MESSAGE_WINDOW_MS || skew < -60_000) return false;

  try {
    const owner = new PublicKey(wallet);
    const sig = bs58.decode(signature);
    const ok = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      sig,
      owner.toBytes(),
    );
    return ok;
  } catch {
    return false;
  }
}

export async function readSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const wallet = readToken(token);
  return wallet ? { wallet } : null;
}

export function isGuest(wallet: string) {
  return wallet.startsWith("guest-");
}

/**
 * Temporary open session while wallet connect is switched off.
 * A real binding still replaces this cookie when the signature route is used.
 */
export async function ensureGuestSession() {
  const existing = await readSession();
  if (existing) return existing;
  const wallet = `guest-${crypto.randomUUID()}`;
  await writeSession(wallet);
  return { wallet };
}

export async function writeSession(wallet: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const jar = await cookies();
  jar.set(COOKIE, sign(wallet, exp), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
