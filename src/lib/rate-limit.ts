import { Redis } from "@upstash/redis";

/** ---- In-memory fallback (per server instance) ---- */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Synchronous in-memory limiter — used when Upstash isn't configured. */
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > max) {
    return { limited: true, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { limited: false, retryAfter: 0 };
}

/** ---- Upstash Redis (shared across all serverless instances, survives redeploys) ---- */
let redis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

/** True when a distributed (Redis) limiter is active rather than the local fallback. */
export function isDistributedRateLimit(): boolean {
  return getRedis() !== null;
}

/**
 * Distributed fixed-window rate limit. Uses Upstash Redis when configured,
 * otherwise falls back to the in-memory limiter. Fails OPEN (to in-memory) on
 * any Redis error so a Redis blip never locks admins out.
 */
export async function limit(
  bucket: string,
  max: number,
  windowMs: number,
): Promise<{ limited: boolean; retryAfter: number }> {
  const r = getRedis();
  if (!r) return rateLimit(bucket, max, windowMs);
  const key = `rl:${bucket}`;
  const ttlSec = Math.ceil(windowMs / 1000);
  try {
    const count = await r.incr(key);
    if (count === 1) await r.expire(key, ttlSec);
    if (count > max) {
      const ttl = await r.ttl(key);
      return { limited: true, retryAfter: ttl > 0 ? ttl : ttlSec };
    }
    return { limited: false, retryAfter: 0 };
  } catch {
    return rateLimit(bucket, max, windowMs);
  }
}
