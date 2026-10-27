import { z } from "zod";
import { getMemoryStore } from "@/lib/memory/store";
import { jsonError, rateLimit } from "@/lib/rate-limit";
import { ensureGuestSession } from "@/lib/solana/session";

const actionSchema = z.object({
  action: z.literal("summon"),
});

export async function GET() {
  const session = await ensureGuestSession();

  const store = await getMemoryStore();
  const profile = await store.touchProfile(session.wallet);
  const messages = await store.listMessages(session.wallet, 40);
  return Response.json({
    profile: {
      summary: profile.summary,
      summonCount: profile.summonCount,
      imagesToday: profile.imagesToday,
      imagesDay: profile.imagesDay,
    },
    messages,
  });
}

export async function POST(request: Request) {
  const session = await ensureGuestSession();

  const limit = rateLimit(`summon:${session.wallet}`, 8, 10 * 60 * 1000);
  if (!limit.ok) return jsonError("The rite was just completed.", 429);

  const parsed = actionSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Unknown memory action.", 400);

  const store = await getMemoryStore();
  const profile = await store.incrementSummon(session.wallet);
  return Response.json({ summonCount: profile.summonCount });
}
