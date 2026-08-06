/** Minimal, dependency-free signed-session for the admin panel.
 *  Works in both Node and Edge runtimes (Web Crypto, no Buffer). */

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

export async function signSession(): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  const sig = await hmac(exp);
  return `${exp}.${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = await hmac(exp);
  // constant-ish time compare
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
