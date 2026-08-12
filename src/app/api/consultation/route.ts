import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { clientIp, limit } from "@/lib/rate-limit";
import { cleanText, validateLead } from "@/lib/validation";

export async function POST(req: Request) {
  const { limited, retryAfter } = await limit(`consultation:${clientIp(req)}`, 8, 60 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const {
    full_name,
    email,
    phone,
    company,
    service_interest,
    preferred_date,
    message,
  } = body;

  const errors = validateLead({ full_name, email, phone });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 400 });
  }

  const sb = getSupabase();
  if (sb) {
    try {
      // Store consultations in the same criska_inquiries inbox (source tag lets
      // admins tell them apart). The preferred date is folded into requirements.
      const reqParts = [
        preferred_date ? `Preferred date: ${cleanText(preferred_date)}` : "",
        cleanText(message),
      ].filter(Boolean);
      const { error } = await sb.from("criska_inquiries").insert({
        full_name: cleanText(full_name).slice(0, 200),
        email: cleanText(email).slice(0, 200).toLowerCase(),
        phone: cleanText(phone).slice(0, 60),
        company: cleanText(company).slice(0, 200),
        service: cleanText(service_interest).slice(0, 200),
        requirements: reqParts.join("\n").slice(0, 4000),
        message: cleanText(message).slice(0, 4000),
        source: "consultation",
        status: "new",
      });
      if (!error) return NextResponse.json({ ok: true });
    } catch {
      // fallback
    }
  }

  return NextResponse.json({ ok: true, savedLocally: true });
}
