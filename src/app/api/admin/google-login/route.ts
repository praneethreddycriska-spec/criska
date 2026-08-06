import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession } from "@/lib/auth";
import { currentSessionFingerprint } from "@/lib/session";
import { isEmailAllowed } from "@/lib/admin-emails";

/**
 * Secure admin sign-in via a Google Identity token.
 * The email is verified by Google (it cannot be spoofed), then checked against
 * the admin allowlist. Any other account is rejected immediately.
 */
export async function POST(req: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "ADMIN_SESSION_SECRET is not set on the server." }, { status: 500 });
  }
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google sign-in is not configured on the server." }, { status: 503 });
  }

  const { credential } = await req.json().catch(() => ({ credential: "" }));
  if (typeof credential !== "string" || !credential) {
    return NextResponse.json({ error: "Missing Google credential." }, { status: 400 });
  }

  // Verify the ID token with Google (validates the signature + expiry for us).
  let payload: { aud?: string; email?: string; email_verified?: string; exp?: string } | null = null;
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!res.ok) throw new Error("token rejected");
    payload = await res.json();
  } catch {
    return NextResponse.json({ error: "Could not verify Google sign-in. Try again." }, { status: 401 });
  }

  const audOk = payload?.aud === clientId;
  const verified = payload?.email_verified === "true" || (payload?.email_verified as unknown) === true;
  const notExpired = payload?.exp ? Number(payload.exp) * 1000 > Date.now() : false;
  const email = (payload?.email || "").toLowerCase();

  if (!audOk || !verified || !notExpired || !email) {
    return NextResponse.json({ error: "Invalid Google sign-in." }, { status: 401 });
  }

  if (!(await isEmailAllowed(email))) {
    return NextResponse.json(
      { error: `${email} is not authorized to access the admin portal.` },
      { status: 403 },
    );
  }

  const token = await signSession(await currentSessionFingerprint());
  const response = NextResponse.json({ ok: true, email });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
