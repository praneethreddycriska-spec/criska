import { hashPassword, safeEqual } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Whether password (email + passcode) login is allowed at all.
 * Once Google sign-in is configured, the password path is DISABLED server-side
 * — the only way in is a Google-verified allowlisted account. A break-glass env
 * var (`ADMIN_ALLOW_PASSWORD_LOGIN=true`) re-enables it if Google ever fails.
 */
export function isPasswordLoginEnabled(): boolean {
  const googleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!googleConfigured) return true; // no Google yet → password is the only way in
  return process.env.ADMIN_ALLOW_PASSWORD_LOGIN === "true"; // break-glass override
}

/** Returns the stored password hash from the DB, or "" if none / unavailable. */
export async function getStoredPasswordHash(): Promise<string> {
  const sb = getSupabaseAdmin();
  if (!sb) return "";
  try {
    const { data } = await sb
      .from("criska_admin_settings")
      .select("password_hash")
      .eq("id", 1)
      .maybeSingle();
    return (data?.password_hash as string) || "";
  } catch {
    return "";
  }
}

/** True if `password` matches the current admin password (DB hash first, else env). */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await getStoredPasswordHash();
  if (hash) return safeEqual(await hashPassword(password), hash);
  const env = process.env.ADMIN_PASSWORD || "";
  if (!env) return false;
  return safeEqual(password, env);
}
