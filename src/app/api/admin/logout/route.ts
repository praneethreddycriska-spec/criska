import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, parseSession } from "@/lib/auth";
import { revokeSession } from "@/lib/session";

export async function POST() {
  // Revoke the token server-side so it can't be replayed after logout, then
  // clear the cookie in the browser.
  const jar = await cookies();
  const claims = await parseSession(jar.get(SESSION_COOKIE)?.value);
  if (claims) await revokeSession(claims.jti, claims.exp);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
