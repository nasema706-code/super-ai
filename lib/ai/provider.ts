import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";

/**
 * Language-model switch.
 *
 * AI_PROVIDER=xai|anthropic|openai forces a provider.
 * Otherwise the first configured key wins, in that same order.
 * AI_MODEL overrides the default id for the chosen provider.
 *
 * Image generation is separate: xAI and OpenAI expose image models.
 * Anthropic chats, then the forge falls through to whichever image key exists,
 * and finally to the local studio plate in lib/ai/studio-plate.ts.
 */

export type ProviderId = "xai" | "anthropic" | "openai";

const DEFAULT_MODELS: Record<ProviderId, string> = {
  xai: "grok-4.5",
  anthropic: "claude-sonnet-5",
  openai: "gpt-5.4-mini",
};

export function resolveProvider(): ProviderId | null {
  const forced = process.env.AI_PROVIDER?.toLowerCase();
  if (forced === "xai" || forced === "anthropic" || forced === "openai") {
    return forced;
  }
  if (process.env.XAI_API_KEY) return "xai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

export function languageModel() {
  const provider = resolveProvider();
  const override = process.env.AI_MODEL;

  if (provider === "xai" && process.env.XAI_API_KEY) {
    return { provider, model: xai(override || DEFAULT_MODELS.xai) };
  }
  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return { provider, model: anthropic(override || DEFAULT_MODELS.anthropic) };
  }
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return { provider, model: openai(override || DEFAULT_MODELS.openai) };
  }
  return null;
}

export function imageModel() {
  const preferred = (process.env.IMAGE_PROVIDER || process.env.AI_PROVIDER || "").toLowerCase();
  const override = process.env.IMAGE_MODEL;

  if (preferred === "openai" && process.env.OPENAI_API_KEY) {
    return { provider: "openai" as const, model: openai.image(override || "gpt-image-1") };
  }
  if (preferred === "xai" && process.env.XAI_API_KEY) {
    return { provider: "xai" as const, model: xai.image(override || "grok-imagine-image") };
  }
  if (process.env.XAI_API_KEY) {
    return { provider: "xai" as const, model: xai.image("grok-imagine-image") };
  }
  if (process.env.OPENAI_API_KEY) {
    return { provider: "openai" as const, model: openai.image("gpt-image-1") };
  }
  return null;
}
