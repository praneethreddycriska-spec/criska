import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { clientIp, limit } from "@/lib/rate-limit";
import { cleanText, validateLead, safeHttpUrl } from "@/lib/validation";

export async function POST(req: Request) {
  const { limited, retryAfter } = await limit(`apply:${clientIp(req)}`, 8, 60 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

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
    resume_url,
    experience_years,
    notice_period,
    project_summary,
    technical_skills,
    screening_answers,
    ats_score,
    ats_analysis,
  } = body;

  const errors = validateLead({ full_name, email, phone });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 400 });
  }

  const skills = Array.isArray(technical_skills)
    ? technical_skills.slice(0, 60).map((s) => String(s).slice(0, 80))
    : String(technical_skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const sb = getSupabase();
  if (!sb) {
    // Not configured → fail honestly so the apply modal surfaces an error +
    // fallback instead of showing "Application Received" while nothing is saved.
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }

  // Plain insert (no RETURNING) — the anon role has INSERT but not SELECT on
  // criska_applications (privacy), so a .select() here would trip RLS.
  const record: Record<string, unknown> = {
    job_id: job_id || null,
    job_title: job_title || "",
    full_name: cleanText(full_name).slice(0, 200),
    email: cleanText(email).slice(0, 200).toLowerCase(),
    phone: String(phone || "").slice(0, 60),
    current_company: String(current_company || "").slice(0, 200),
    linkedin: safeHttpUrl(linkedin).slice(0, 400),
    portfolio_url: safeHttpUrl(portfolio_url).slice(0, 400),
    resume_url: safeHttpUrl(resume_url).slice(0, 600),
    experience_years: String(experience_years ?? "").slice(0, 20),
    notice_period: String(notice_period || "").slice(0, 60),
    project_summary: String(project_summary || "").slice(0, 4000),
    technical_skills: skills,
    screening_answers: screening_answers && typeof screening_answers === "object" ? screening_answers : {},
    ats_score: Number.isFinite(ats_score) ? ats_score : 0,
    ats_analysis: ats_analysis && typeof ats_analysis === "object" ? ats_analysis : {},
    status: "new",
  };

  let { error } = await sb.from("criska_applications").insert(record);
  // If the resume_url column hasn't been added yet (migration not run), retry
  // once without it so the application still saves rather than being rejected.
  if (error && /resume_url/i.test(error.message || "")) {
    const { resume_url: _omit, ...withoutResume } = record;
    void _omit;
    ({ error } = await sb.from("criska_applications").insert(withoutResume));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
