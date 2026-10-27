import { generateImage } from "ai";
import { z } from "zod";
import { imageModel } from "@/lib/ai/provider";
import { studioPlate } from "@/lib/ai/studio-plate";
import { getMemoryStore } from "@/lib/memory/store";
import { resolveTier, TOKEN, utcDay } from "@/lib/protocol";
import { clientAddress, jsonError, rateLimit } from "@/lib/rate-limit";
import { readBalances } from "@/lib/solana/balances";
import { getConnection } from "@/lib/solana/connection";
import { readSession } from "@/lib/solana/session";
import { saveMedia } from "@/lib/storage/media";

export const maxDuration = 60;

const bodySchema = z.object({
  prompt: z.string().trim().min(3).max(500),
  isPublic: z.boolean().optional(),
});

const STYLE =
  "Cinematic nighttime scene, black and silver, a metallic humanoid inside a thin glowing ring, floating geometric fragments, distant city light trails, cool cyan highlights, premium photograph, no text, no logo, no watermark.";

/**
 * Image forge.
 * Uses an image model when XAI or OpenAI is configured.
 * Otherwise (or on failure) it strikes a local studio plate so the flow still completes.
 * Daily allowance follows the holder tier. Studio plates do not spend that allowance.
 */
export async function POST(request: Request) {
  try {
    const session = await readSession();
    if (!session) return jsonError("Bind a wallet before striking a plate.", 401);

    const burst = rateLimit(`forge:${session.wallet}:${clientAddress(request)}`, 8, 10 * 60 * 1000);
    if (!burst.ok) {
      return jsonError("The forge is cooling.", 429, { retryAfterSeconds: burst.retryAfterSeconds });
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Describe the plate in a few words.", 400);

    const store = await getMemoryStore();
    const profile = await store.touchProfile(session.wallet);
    const day = utcDay();
    let tier = resolveTier(TOKEN.mint ? 0 : null);
    try {
      tier = (await readBalances(getConnection(), session.wallet)).tier;
    } catch (error) {
      console.error("[forge-balance]", error);
    }

    const used = profile.imagesDay === day ? profile.imagesToday : 0;
    const selected = imageModel();
    if (selected && used >= tier.imagesPerDay) {
      return jsonError("Today's plates are spent. The forge opens again tomorrow.", 429, {
        tier: tier.label,
        remaining: 0,
      });
    }

    let bytes: Uint8Array<ArrayBufferLike> = studioPlate(parsed.data.prompt);
    let mediaType = "image/svg+xml";
    let source: "model" | "studio" = "studio";
    let notice = "Studio plate. Add XAI_API_KEY or OPENAI_API_KEY to strike a model image.";

    if (selected) {
      try {
        const result = await generateImage({
          model: selected.model,
          prompt: `${STYLE} Subject: ${parsed.data.prompt}`,
          aspectRatio: "1:1",
        });
        bytes = result.image.uint8Array;
        mediaType = result.image.mediaType || "image/png";
        source = "model";
        notice = "";
      } catch (error) {
        console.error("[forge-model]", error);
        notice = "The image model did not answer. A studio plate was struck instead.";
      }
    }

    const id = crypto.randomUUID();
    const media = await saveMedia(id, bytes, mediaType);
    if (source === "model") await store.consumeImageCredit(session.wallet, day);
    await store.addSummon({
      id,
      wallet: session.wallet,
      prompt: parsed.data.prompt,
      mediaType,
      storagePath: media.storagePath,
      isPublic: Boolean(parsed.data.isPublic),
      createdAt: new Date().toISOString(),
    });

    const spent = source === "model" ? used + 1 : used;
    return Response.json({
      id,
      url: media.url,
      source,
      notice: notice || undefined,
      tier: tier.label,
      remaining: Math.max(0, tier.imagesPerDay - spent),
    });
  } catch (error) {
    console.error("[forge]", error);
    return jsonError("The forge could not strike this plate.", 500);
  }
}
