import { getSupabaseAdmin } from "@/lib/supabase";

/** Fallback allowlist — used until `criska_admin_settings.allowed_emails` exists / is set. */
export const DEFAULT_ALLOWED_EMAILS = [
  "praneethreddy.criska@gmail.com",
  "vivekshaganti@gmail.com",
];

function normalize(email: unknown): string {
  return String(email ?? "").trim().toLowerCase();
}

/** Returns the list of admin emails allowed to sign in (lower-cased). */
export async function getAllowedEmails(): Promise<string[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      const { data } = await sb
        .from("criska_admin_settings")
        .select("allowed_emails")
        .eq("id", 1)
        .maybeSingle();
      const list = data?.allowed_emails;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalize).filter(Boolean);
      }
    } catch {
      /* column may not exist yet — fall through to default */
    }
  }
  return DEFAULT_ALLOWED_EMAILS.map(normalize);
}

export async function isEmailAllowed(email: unknown): Promise<boolean> {
  const e = normalize(email);
  if (!e) return false;
  const allowed = await getAllowedEmails();
  return allowed.includes(e);
}

/** Persists a new allowlist. Returns the saved list, or throws on failure. */
export async function setAllowedEmails(emails: unknown[]): Promise<string[]> {
  const clean = Array.from(
    new Set((emails || []).map(normalize).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))),
  );
  if (clean.length === 0) throw new Error("At least one valid email is required.");
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  const { error } = await sb
    .from("criska_admin_settings")
    .upsert({ id: 1, allowed_emails: clean, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  return clean;
}
