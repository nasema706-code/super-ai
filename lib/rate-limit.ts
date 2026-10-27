/**
 * Process-local limiter for AI and binding routes.
 * On Vercel, each instance has its own map. Swap this for Upstash Redis
 * (or a similar shared store) before the protocol is public.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type LimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count, retryAfterSeconds: 0 };
}

export function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "local";
}

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ error: message, ...extra }, { status });
}
