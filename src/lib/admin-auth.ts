import { hashPassword, safeEqual } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

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
