import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, signSession, hashPassword } from "@/lib/auth";
import { verifyFreshSession, currentSessionFingerprint } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(req: Request) {
  // must be a currently-valid logged-in admin
  const jar = await cookies();
  if (!(await verifyFreshSession(jar.get(SESSION_COOKIE)?.value))) {
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

  // The password just changed, so every existing session (bound to the OLD
  // password fingerprint) is now invalid — everyone is logged out. Re-issue a
  // fresh cookie to THIS admin so they stay signed in.
  const token = await signSession(await currentSessionFingerprint());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
