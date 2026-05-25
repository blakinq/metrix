/**
 * Best-effort rate limit. Uses Upstash if configured, otherwise an in-memory
 * sliding window suitable for single-instance dev/MVP. See §23.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const upstashLimiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(300, "1 m"),
      analytics: false,
      prefix: "metrix:ingest",
    })
  : null;

const upstashDashboardLimiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: false,
      prefix: "metrix:dash",
    })
  : null;

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { success: false, remaining: 0 };
  entry.count += 1;
  return { success: true, remaining: max - entry.count };
}

export async function rateLimitIngest(siteId: string, ipKey: string) {
  const key = `${siteId}:${ipKey}`;
  if (upstashLimiter) {
    const r = await upstashLimiter.limit(key);
    return { success: r.success, remaining: r.remaining };
  }
  return memoryLimit(`ingest:${key}`, 300, 60_000);
}

export async function rateLimitDashboard(userId: string) {
  if (upstashDashboardLimiter) {
    const r = await upstashDashboardLimiter.limit(userId);
    return { success: r.success, remaining: r.remaining };
  }
  return memoryLimit(`dash:${userId}`, 100, 60_000);
}
