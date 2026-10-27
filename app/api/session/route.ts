import { z } from "zod";
import { jsonError, rateLimit, clientAddress } from "@/lib/rate-limit";
import { verifyBinding, clearSession, readSession, writeSession } from "@/lib/solana/session";

const bodySchema = z.object({
  wallet: z.string().min(32).max(44),
  message: z.string().min(20).max(240),
  signature: z.string().min(64).max(200),
});

export async function GET() {
  try {
    const session = await readSession();
    return Response.json({ wallet: session?.wallet ?? null });
  } catch (error) {
    console.error("[session]", error);
    return jsonError("The binding could not be read.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`bind:${clientAddress(request)}`, 12, 10 * 60 * 1000);
    if (!limit.ok) return jsonError("Too many binding attempts.", 429);

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("The binding message was incomplete.", 400);

    const { wallet, message, signature } = parsed.data;
    if (!verifyBinding(wallet, message, signature)) {
      return jsonError("The signature did not match this wallet.", 401);
    }

    await writeSession(wallet);
    return Response.json({ wallet });
  } catch (error) {
    console.error("[session]", error);
    return jsonError("The binding could not be kept.", 500);
  }
}

export async function DELETE() {
  await clearSession();
  return Response.json({ wallet: null });
}
