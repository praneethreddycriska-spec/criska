/** Minimal, dependency-free signed-session for the admin panel.
 *  Works in both Node and Edge runtimes (Web Crypto, no Buffer).
 *
 *  Token format:  `<exp>.<fp>.<sig>`
 *    exp = expiry epoch ms
 *    fp  = password fingerprint (changes whenever the admin password changes,
 *          so a password reset invalidates every previously-issued session)
 *    sig = HMAC-SHA256("<exp>.<fp>") keyed by ADMIN_SESSION_SECRET
 */

export const SESSION_COOKIE = "criska_admin";
const TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
const SECRET = process.env.ADMIN_SESSION_SECRET || "criska-dev-secret-change-me";

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

/** Public signing helper (used to derive the password fingerprint). */
export async function sessionSign(data: string): Promise<string> {
  return hmac(data);
}

/**
 * Hash of an admin password — SHA-256 over a FIXED application salt + password.
 * Deliberately NOT keyed by ADMIN_SESSION_SECRET so a DB-stored password works
 * across environments (local & Vercel) regardless of their session secrets.
 */
const PW_SALT = "criska-admin-pw-v1";
export async function hashPassword(password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(`${PW_SALT}:${password}`));
  return b64url(new Uint8Array(digest));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Issue a session bound to the given password fingerprint. */
export async function signSession(fingerprint: string): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  const payload = `${exp}.${fingerprint}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export type SessionClaims = { exp: number; fp: string };

/** Verify signature + expiry (cheap, no DB). Returns claims or null. */
export async function parseSession(token: string | undefined | null): Promise<SessionClaims | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [exp, fp, sig] = parts;
  if (!exp || !fp || !sig) return null;
  if (!Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return null;
  const expected = await hmac(`${exp}.${fp}`);
  if (!safeEqual(expected, sig)) return null;
  return { exp: Number(exp), fp };
}

/** Backwards-compatible boolean — signature + expiry only (no freshness check). */
export async function verifySession(token: string | undefined | null): Promise<boolean> {
  return (await parseSession(token)) !== null;
}
