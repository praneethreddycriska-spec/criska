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
    experience_years,
    notice_period,
    project_summary,
    technical_skills,
  } = body;

  if (!full_name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const skills = Array.isArray(technical_skills)
    ? technical_skills
    : String(technical_skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const sb = getSupabase();
  if (!sb) {
    // DB not configured — tell client to fall back to email.
    return NextResponse.json({ ok: false, fallback: true }, { status: 200 });
  }

  const { error } = await sb.from("criska_applications").insert({
    job_id: job_id || null,
    job_title: job_title || "",
    full_name,
    email,
    phone: phone || "",
    current_company: current_company || "",
    linkedin: linkedin || "",
    experience_years: String(experience_years ?? ""),
    notice_period: notice_period || "",
    project_summary: project_summary || "",
    technical_skills: skills,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
