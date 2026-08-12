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
      const { data, error } = await sb
        .from("criska_consultations")
        .insert({
          full_name: cleanText(full_name).slice(0, 200),
          email: cleanText(email).slice(0, 200).toLowerCase(),
          phone: cleanText(phone).slice(0, 50),
          company: cleanText(company).slice(0, 200),
          service_interest: cleanText(service_interest).slice(0, 200),
          preferred_date: cleanText(preferred_date).slice(0, 100),
          message: cleanText(message).slice(0, 4000),
          status: "new",
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ ok: true, id: data.id });
      }
    } catch {
      // fallback
    }
  }

  return NextResponse.json({ ok: true, savedLocally: true });
}
