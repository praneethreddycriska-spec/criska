/**
 * Session freshness — ties a session to the CURRENT admin password.
 * The fingerprint is derived from the stored password hash, so the moment the
 * password changes every previously-issued session stops validating.
 *
 * Uses plain fetch (no supabase-js) so it runs in the Edge middleware too.
 */
import { parseSession, sessionSign, safeEqual, USING_DEFAULT_SECRET } from "@/lib/auth";

// Remembers the last DB-derived basis so a TRANSIENT Supabase failure doesn't
// silently flip the fingerprint to the env basis and invalidate every live
// session (random logouts). Only a successful fetch updates it.
let lastDbBasis: string | null = null;

/** Reads the value the fingerprint is derived from (DB password hash, else env). */
async function currentPasswordBasis(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      const r = await fetch(
        `${url}/rest/v1/criska_admin_settings?select=password_hash&id=eq.1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
      );
      if (r.ok) {
        const rows = await r.json();
        const h = rows?.[0]?.password_hash;
        if (h) {
          lastDbBasis = `db:${h}`;
          return lastDbBasis;
        }
      }
    } catch {
      /* transient failure — fall through to the last known-good DB basis */
    }
    // The DB is the configured source of truth. If this read failed transiently
    // but we have a known-good basis, reuse it rather than flipping to env: and
    // bouncing a validly-signed-in admin to the login page.
    if (lastDbBasis) return lastDbBasis;
  }
  return `env:${process.env.ADMIN_PASSWORD || ""}`;
}

/** Current password fingerprint — embedded in freshly-issued sessions. */
export async function currentSessionFingerprint(): Promise<string> {
  const basis = await currentPasswordBasis();
  const sig = await sessionSign(`fp:${basis}`);
  return sig.slice(0, 32);
}

/* ---- Per-session revocation denylist (logout) ----
 * Uses Upstash Redis when configured (shared across all serverless instances,
 * survives redeploys); falls back to an in-memory set per instance. A revoked
 * jti only needs to be remembered until the token would expire anyway. */
const revokedMem = new Map<string, number>(); // jti -> expiry ms

async function upstash(command: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;
  try {
    const r = await fetch(`${url}/${command.map(encodeURIComponent).join("/")}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!r.ok) return undefined;
    return (await r.json())?.result;
  } catch {
    return undefined;
  }
}

/** Revoke a session id until it would have expired. Called on logout. */
export async function revokeSession(jti: string, expMs: number): Promise<void> {
  if (!jti) return;
  revokedMem.set(jti, expMs);
  const ttl = Math.max(1, Math.ceil((expMs - Date.now()) / 1000));
  await upstash(["SET", `revoked:${jti}`, "1", "EX", String(ttl)]);
}

async function isRevoked(jti: string): Promise<boolean> {
  const now = Date.now();
  for (const [k, exp] of revokedMem) if (exp <= now) revokedMem.delete(k);
  if (revokedMem.has(jti)) return true;
  const v = await upstash(["GET", `revoked:${jti}`]);
  return v === "1" || v === 1;
}

/**
 * Full session check: signature + expiry + password fingerprint + not revoked.
 * Returns false for tampered, expired, password-superseded, OR logged-out sessions.
 */
export async function verifyFreshSession(token: string | undefined | null): Promise<boolean> {
  // Fail closed in production if the session secret was never configured — a
  // default-key signature is public knowledge and therefore forgeable.
  if (USING_DEFAULT_SECRET && process.env.NODE_ENV === "production") return false;
  const claims = await parseSession(token);
  if (!claims) return false;
  if (await isRevoked(claims.jti)) return false;
  const fp = await currentSessionFingerprint();
  return safeEqual(claims.fp, fp);
}
