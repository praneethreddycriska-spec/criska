import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when public (read) access is configured. */
export const supabaseConfigured = Boolean(url && anonKey);

/** True when admin (write) access is configured. */
export const supabaseAdminConfigured = Boolean(
  url && serviceKey && serviceKey !== "REPLACE_ME_service_role_key",
);

/** Public/anon client — reads only (RLS enforced). Safe on server & client. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  return createClient(url!, anonKey!, { auth: { persistSession: false } });
}

/**
 * Admin client — uses the service_role key and BYPASSES RLS.
 * SERVER-ONLY. Never import into a client component.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseAdminConfigured) return null;
  return createClient(url!, serviceKey!, { auth: { persistSession: false } });
}
