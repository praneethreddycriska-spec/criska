import { NextResponse } from "next/server";
import { isEmailAllowed } from "@/lib/admin-emails";

/** Step 1 of admin login — verifies the email is on the allowlist before a password is asked. */
export async function POST(req: Request) {
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
