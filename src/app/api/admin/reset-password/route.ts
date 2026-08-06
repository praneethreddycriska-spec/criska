import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, hashPassword } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(req: Request) {
  // must be a logged-in admin
  const jar = await cookies();
  if (!(await verifySession(jar.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }
  if (!(await verifyAdminPassword(String(currentPassword || "")))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured, so the password can't be saved." },
      { status: 503 },
    );
  }

  const hash = await hashPassword(newPassword);
  const { error } = await sb
    .from("criska_admin_settings")
    .upsert({ id: 1, password_hash: hash, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
