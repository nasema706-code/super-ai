import { convertToModelMessages, isStepCount, streamText, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/ai/personality";
import { languageModel } from "@/lib/ai/provider";
import { companionTools } from "@/lib/ai/tools";
import { getMemoryStore } from "@/lib/memory/store";
import { resolveTier, TOKEN } from "@/lib/protocol";
import { clientAddress, jsonError, rateLimit } from "@/lib/rate-limit";
import { readBalances } from "@/lib/solana/balances";
import { getConnection } from "@/lib/solana/connection";
import { ensureGuestSession, isGuest } from "@/lib/solana/session";

export const maxDuration = 60;

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

/**
 * Streaming companion.
 * The wallet comes from the signed session cookie, never from the request body.
 * Memory is the long-term summary plus the recent thread stored for this wallet.
 */
export async function POST(request: Request) {
  try {
    const session = await ensureGuestSession();

    const limit = rateLimit(`chat:${session.wallet}:${clientAddress(request)}`, 24, 10 * 60 * 1000);
    if (!limit.ok) {
      return jsonError("The companion needs a moment of quiet.", 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = (await request.json()) as { messages?: UIMessage[] };
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return jsonError("Missing messages.", 400);
    }

    const messages = body.messages.slice(-20);
    const latest = messages.at(-1);
    const latestText = latest ? messageText(latest) : "";
    if (!latest || latest.role !== "user" || !latestText) {
      return jsonError("Send a message.", 400);
    }

    const model = languageModel();
    if (!model) {
      return jsonError(
        "No language model key is configured. Add XAI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.",
        503,
      );
    }

    const store = await getMemoryStore();
    const profile = await store.touchProfile(session.wallet);
    const prior = await store.listMessages(session.wallet, 8);
    const lastStored = prior.at(-1);
    if (!(lastStored?.role === "user" && lastStored.content === latestText)) {
      await store.appendMessage({
        id: crypto.randomUUID(),
        wallet: session.wallet,
        role: "user",
        content: latestText,
        createdAt: new Date().toISOString(),
      });
    }

    let tier = resolveTier(TOKEN.mint ? 0 : null);
    if (!isGuest(session.wallet)) {
      try {
        const snapshot = await readBalances(getConnection(), session.wallet);
        tier = snapshot.tier;
      } catch (error) {
        console.error("[chat-balance]", error);
      }
    }

    const result = streamText({
      model: model.model,
      system: buildSystemPrompt(profile, tier),
      messages: await convertToModelMessages(messages),
      tools: companionTools(session.wallet, tier, store),
      stopWhen: isStepCount(4),
      onFinish: async ({ text }) => {
        const content = text.trim();
        if (!content) return;
        try {
          await store.appendMessage({
            id: crypto.randomUUID(),
            wallet: session.wallet,
            role: "assistant",
            content,
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error("[chat-memory]", error);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat]", error);
    const message = error instanceof Error ? error.message : "The companion could not answer.";
    return jsonError(message, 500);
  }
}
