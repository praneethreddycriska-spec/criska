/**
 * Session freshness — ties a session to the CURRENT admin password.
 * The fingerprint is derived from the stored password hash, so the moment the
 * password changes every previously-issued session stops validating.
 *
 * Uses plain fetch (no supabase-js) so it runs in the Edge middleware too.
 */
import { parseSession, sessionSign, safeEqual } from "@/lib/auth";

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
        if (h) return `db:${h}`;
      }
    } catch {
      /* fall through to env basis */
    }
  }
  return `env:${process.env.ADMIN_PASSWORD || ""}`;
}

/** Current password fingerprint — embedded in freshly-issued sessions. */
export async function currentSessionFingerprint(): Promise<string> {
  const basis = await currentPasswordBasis();
  const sig = await sessionSign(`fp:${basis}`);
  return sig.slice(0, 32);
}

/**
 * Full session check: signature + expiry + password fingerprint.
 * Returns false for tampered, expired, OR password-superseded sessions.
 */
export async function verifyFreshSession(token: string | undefined | null): Promise<boolean> {
  const claims = await parseSession(token);
  if (!claims) return false;
  const fp = await currentSessionFingerprint();
  return safeEqual(claims.fp, fp);
}
