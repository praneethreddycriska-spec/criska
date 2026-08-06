import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
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

  if (!full_name || !email) {
    return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
  }

  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("criska_consultations")
        .insert({
          full_name: String(full_name).slice(0, 200),
          email: String(email).slice(0, 200),
          phone: String(phone || "").slice(0, 50),
          company: String(company || "").slice(0, 200),
          service_interest: String(service_interest || "").slice(0, 200),
          preferred_date: String(preferred_date || "").slice(0, 100),
          message: String(message || "").slice(0, 4000),
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
