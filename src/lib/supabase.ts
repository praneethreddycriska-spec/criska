import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { JobPosting, JobApplication, ApplicationStatus } from "@/types/ats";
import { evaluateApplication } from "./ats-engine";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** True when public (read) access is configured. */
export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabaseConfigured = isSupabaseConfigured;

/** True when admin (write) access is configured. */
export const supabaseAdminConfigured = Boolean(
  url && serviceKey && serviceKey !== "REPLACE_ME_service_role_key",
);

/** Public/anon client instance. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: false } })
  : null;

/** Public/anon client — reads only (RLS enforced). Safe on server & client. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Admin client — uses the service_role key and BYPASSES RLS.
 * SERVER-ONLY. Never import into a client component.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseAdminConfigured) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/* ============================================================
   ATS DATA LAYER — backed by the real `criska_*` tables.
   Reads/writes go through the cookie-protected /api/admin routes
   (which use the service_role key server-side). These run in the
   browser inside the authenticated admin dashboard.
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

function jobFromRow(r: any): JobPosting {
  return {
    id: r.id,
    title: r.title ?? "",
    department: r.department ?? "",
    type: r.type ?? "Full-time",
    location: r.location ?? "",
    description: r.description ?? "",
    requirements: Array.isArray(r.requirements) ? r.requirements : [],
    screeningQuestions: Array.isArray(r.screening_questions) ? r.screening_questions : [],
    status: (r.status as JobPosting["status"]) || (r.is_open ? "published" : "closed"),
    createdAt: r.created_at ?? new Date().toISOString(),
    updatedAt: r.created_at ?? undefined,
    applicationsCount: r.applicationsCount ?? 0,
  };
}

function appFromRow(r: any): JobApplication {
  return {
    id: r.id,
    jobId: r.job_id ?? "",
    jobTitle: r.job_title ?? "Role",
    fullName: r.full_name ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    portfolioUrl: r.portfolio_url ?? "",
    linkedinUrl: r.linkedin ?? "",
    technicalSkills: Array.isArray(r.technical_skills) ? r.technical_skills : [],
    screeningAnswers: r.screening_answers ?? {},
    atsScore: r.ats_score ?? 0,
    atsAnalysis: r.ats_analysis ?? {},
    status: (r.status as ApplicationStatus) || "new",
    adminNotes: r.admin_notes ?? "",
    createdAt: r.created_at ?? new Date().toISOString(),
    updatedAt: r.created_at ?? undefined,
  };
}

async function adminApi(table: string, init?: RequestInit) {
  const res = await fetch(`/api/admin/${table}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

/** Fetch all job postings (real criska_jobs). Works on server & in the browser. */
export async function fetchJobs(): Promise<JobPosting[]> {
  if (typeof window === "undefined") {
    const sb = getSupabaseAdmin() ?? getSupabase();
    if (!sb) return [];
    const { data } = await sb.from("criska_jobs").select("*").order("sort");
    return (data || []).map(jobFromRow);
  }
  const { data } = await adminApi("jobs");
  return (data || []).map(jobFromRow);
}

/** Fetch all applications (real criska_applications). Server uses service role. */
export async function fetchApplications(): Promise<JobApplication[]> {
  if (typeof window === "undefined") {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("criska_applications")
      .select("*")
      .order("created_at", { ascending: false });
    return (data || []).map(appFromRow);
  }
  const { data } = await adminApi("applications");
  return (data || []).map(appFromRow);
}

/** Create or update a job posting → criska_jobs (also keeps is_open in sync). */
export async function saveJobPosting(job: JobPosting): Promise<void> {
  const values = {
    title: job.title,
    department: job.department,
    type: job.type,
    location: job.location,
    description: job.description,
    requirements: job.requirements ?? [],
    screening_questions: job.screeningQuestions ?? [],
    status: job.status,
    is_open: job.status === "published",
  };
  if (job.id && isUuid(job.id)) {
    await adminApi("jobs", { method: "PATCH", body: JSON.stringify({ id: job.id, ...values }) });
  } else {
    await adminApi("jobs", { method: "POST", body: JSON.stringify(values) });
  }
}

/** Delete a job posting. */
export async function deleteJobPosting(id: string): Promise<void> {
  await adminApi("jobs", { method: "DELETE", body: JSON.stringify({ id }) });
}

/** Update an application's status / admin notes. */
export async function updateApplicationRecord(
  id: string,
  updates: { status?: ApplicationStatus; adminNotes?: string },
): Promise<void> {
  const body: any = { id };
  if (updates.status) body.status = updates.status;
  if (updates.adminNotes !== undefined) body.admin_notes = updates.adminNotes;
  await adminApi("applications", { method: "PATCH", body: JSON.stringify(body) });
}

/**
 * Public job application submit → criska_applications (via the public /api/apply,
 * which uses the anon INSERT policy). Computes the ATS score client-side for the
 * confirmation screen.
 */
export async function createApplication(
  job: JobPosting,
  candidateData: {
    fullName: string;
    email: string;
    phone: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    technicalSkills?: string[];
    screeningAnswers: Record<string, string>;
  },
): Promise<JobApplication> {
  const atsAnalysis = evaluateApplication(job, {
    fullName: candidateData.fullName,
    technicalSkills: candidateData.technicalSkills,
    screeningAnswers: candidateData.screeningAnswers,
    linkedinUrl: candidateData.linkedinUrl,
    portfolioUrl: candidateData.portfolioUrl,
  });

  const app: JobApplication = {
    id: `pending-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    fullName: candidateData.fullName,
    email: candidateData.email,
    phone: candidateData.phone,
    portfolioUrl: candidateData.portfolioUrl,
    linkedinUrl: candidateData.linkedinUrl,
    technicalSkills: candidateData.technicalSkills || [],
    screeningAnswers: candidateData.screeningAnswers,
    atsScore: atsAnalysis.overallScore,
    atsAnalysis,
    status: "new",
    adminNotes: "",
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: isUuid(job.id) ? job.id : null,
        job_title: job.title,
        full_name: candidateData.fullName,
        email: candidateData.email,
        phone: candidateData.phone,
        linkedin: candidateData.linkedinUrl || "",
        portfolio_url: candidateData.portfolioUrl || "",
        technical_skills: candidateData.technicalSkills || [],
        screening_answers: candidateData.screeningAnswers || {},
        ats_score: atsAnalysis.overallScore,
        ats_analysis: atsAnalysis,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (json?.id) app.id = json.id;
  } catch {
    // Non-fatal — the confirmation still shows; the record just wasn't stored.
  }

  return app;
}
