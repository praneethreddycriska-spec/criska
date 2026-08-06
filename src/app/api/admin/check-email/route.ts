import { NextResponse } from "next/server";
import { isEmailAllowed } from "@/lib/admin-emails";
import { isPasswordLoginEnabled } from "@/lib/admin-auth";
import { clientIp, limit } from "@/lib/rate-limit";

/** Step 1 of password login — verifies the email is on the allowlist. Rate-limited. */
export async function POST(req: Request) {
  // Disabled entirely once Google sign-in is live.
  if (!isPasswordLoginEnabled()) {
    return NextResponse.json(
      { error: "Password login is disabled. Please sign in with Google." },
      { status: 403 },
    );
  }

  const { limited, retryAfter } = await limit(`check-email:${clientIp(req)}`, 20, 15 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { allowed: false, error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const { email } = await req.json().catch(() => ({ email: "" }));
  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    return NextResponse.json(
      { allowed: false, error: "This email is not authorized to access the admin portal." },
      { status: 403 },
    );
  }
  return NextResponse.json({ allowed: true });
}
