import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { clientIp, limit } from "@/lib/rate-limit";
import { cleanText, validateLead } from "@/lib/validation";

export async function POST(req: Request) {
  const { limited, retryAfter } = await limit(`inquiry:${clientIp(req)}`, 8, 60 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { full_name, company, email, phone, service, requirements, message, source } = body;

  const errors = validateLead({ full_name, email, phone });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 400 });
  }

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ ok: false, fallback: true }, { status: 200 });

  const clip = (v: unknown, n: number) => cleanText(v).slice(0, n);
  const { error } = await sb.from("criska_inquiries").insert({
    full_name: clip(full_name, 200),
    company: clip(company, 200),
    email: clip(email, 200).toLowerCase(),
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
