import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession } from "@/lib/auth";

/**
 * In-memory brute-force protection (per-IP).
 * Note: resets on server restart and is per-instance. For multi-instance
 * production, back this with a shared store (e.g. Upstash Redis).
 */
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILS = 6;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Constant-time string comparison to avoid timing leaks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
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

  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Admin auth is not fully configured on the server (ADMIN_PASSWORD / ADMIN_SESSION_SECRET)." },
      { status: 500 },
    );
  }

  if (typeof password !== "string" || !safeEqual(password, expected)) {
    // record the failed attempt
    const cur = rec && now < rec.resetAt ? rec : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    attempts.set(ip, cur);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // success — clear any failure record
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
