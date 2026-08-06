import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { verifyFreshSession } from "@/lib/session";
import { getAllowedEmails, setAllowedEmails } from "@/lib/admin-emails";

async function requireAdmin() {
  const jar = await cookies();
  return verifyFreshSession(jar.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ emails: await getAllowedEmails() });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { emails } = await req.json().catch(() => ({ emails: [] }));
  if (!Array.isArray(emails)) {
    return NextResponse.json({ error: "emails must be an array." }, { status: 400 });
  }
  try {
    const saved = await setAllowedEmails(emails);
    return NextResponse.json({ emails: saved });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
