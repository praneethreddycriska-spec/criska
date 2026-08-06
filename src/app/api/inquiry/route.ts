import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { full_name, company, email, phone, service, requirements, message, source } = body;
  if (!full_name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ ok: false, fallback: true }, { status: 200 });

  const clip = (v: unknown, n: number) => String(v || "").slice(0, n);
  const { error } = await sb.from("criska_inquiries").insert({
    full_name: clip(full_name, 200),
    company: clip(company, 200),
    email: clip(email, 200),
    phone: clip(phone, 60),
    service: clip(service, 200),
    requirements: clip(requirements, 4000),
    message: clip(message, 4000),
    source: clip(source || "contact", 40),
    status: "new",
  });

  if (error) {
    // Table not created yet — don't block the user; report soft failure.
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
  return NextResponse.json({ ok: true });
}
