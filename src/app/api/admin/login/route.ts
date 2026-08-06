import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession } from "@/lib/auth";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { isEmailAllowed } from "@/lib/admin-emails";

/** In-memory brute-force protection (per-IP, per-instance). */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 6;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now < rec.resetAt && rec.count >= MAX_FAILS) {
    const retry = Math.ceil((rec.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retry) } },
    );
  }

  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SESSION_SECRET is not set on the server." },
      { status: 500 },
    );
  }

  // Server-side re-check of the email allowlist (never trust the client's step 1).
  if (!(await isEmailAllowed(email))) {
    const cur = rec && now < rec.resetAt ? rec : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    attempts.set(ip, cur);
    return NextResponse.json(
      { error: "This email is not authorized to access the admin portal." },
      { status: 403 },
    );
  }

  const ok = typeof password === "string" && password.length > 0 && (await verifyAdminPassword(password));
  if (!ok) {
    const cur = rec && now < rec.resetAt ? rec : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    attempts.set(ip, cur);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await signSession();
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
