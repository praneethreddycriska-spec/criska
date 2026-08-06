import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const {
    job_id,
    job_title,
    full_name,
    email,
    phone,
    current_company,
    linkedin,
    portfolio_url,
    experience_years,
    notice_period,
    project_summary,
    technical_skills,
    screening_answers,
    ats_score,
    ats_analysis,
  } = body;

  if (!full_name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // basic length guards
  if (String(full_name).length > 200 || String(email).length > 200) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  const skills = Array.isArray(technical_skills)
    ? technical_skills.slice(0, 60).map((s) => String(s).slice(0, 80))
    : String(technical_skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ ok: false, fallback: true }, { status: 200 });
  }

  // Plain insert (no RETURNING) — the anon role has INSERT but not SELECT on
  // criska_applications (privacy), so a .select() here would trip RLS.
  const { error } = await sb.from("criska_applications").insert({
    job_id: job_id || null,
    job_title: job_title || "",
    full_name: String(full_name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone || "").slice(0, 60),
    current_company: String(current_company || "").slice(0, 200),
    linkedin: String(linkedin || "").slice(0, 400),
    portfolio_url: String(portfolio_url || "").slice(0, 400),
    experience_years: String(experience_years ?? "").slice(0, 20),
    notice_period: String(notice_period || "").slice(0, 60),
    project_summary: String(project_summary || "").slice(0, 4000),
    technical_skills: skills,
    screening_answers: screening_answers && typeof screening_answers === "object" ? screening_answers : {},
    ats_score: Number.isFinite(ats_score) ? ats_score : 0,
    ats_analysis: ats_analysis && typeof ats_analysis === "object" ? ats_analysis : {},
    status: "new",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
