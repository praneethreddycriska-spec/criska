import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { JobPosting, JobApplication, ApplicationStatus } from "@/types/ats";
import { evaluateApplication } from "./ats-engine";
import {
  getStoredJobs,
  saveStoredJobs,
  getStoredApplications,
  saveStoredApplications,
} from "./store";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** True when public (read) access is configured. */
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("REPLACE_ME") && !anonKey.includes("REPLACE_ME")
);
export const supabaseConfigured = isSupabaseConfigured;

/** True when admin (write) access is configured. */
export const supabaseAdminConfigured = Boolean(
  url &&
    serviceKey &&
    !url.includes("REPLACE_ME") &&
    !serviceKey.includes("REPLACE_ME")
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
   ATS DATA LAYER — backed by real Supabase + local store fallback.
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
  try {
    const res = await fetch(`/api/admin/${table}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    const json = await res.json().catch(() => ({}));
    return json;
  } catch {
    return { data: [], error: "Network / Route error" };
  }
}

/** Fetch all job postings. Tries Supabase first; falls back to local store if empty. */
export async function fetchJobs(): Promise<JobPosting[]> {
  const stored = getStoredJobs();
  if (typeof window === "undefined") {
    const sb = getSupabaseAdmin() ?? getSupabase();
    if (!sb) return stored;
    try {
      const { data, error } = await sb.from("criska_jobs").select("*");
      if (error || !data || data.length === 0) return stored;
      return data.map(jobFromRow);
    } catch {
      return stored;
    }
  }

  const { data } = await adminApi("jobs");
  if (data && Array.isArray(data) && data.length > 0) {
    return data.map(jobFromRow);
  }
  return stored;
}

/** Fetch all candidate applications. Tries Supabase first; falls back to local store. */
export async function fetchApplications(): Promise<JobApplication[]> {
  const stored = getStoredApplications();
  if (typeof window === "undefined") {
    const sb = getSupabaseAdmin();
    if (!sb) return stored;
    try {
      const { data, error } = await sb.from("criska_applications").select("*").order("created_at", { ascending: false });
      if (error || !data || data.length === 0) return stored;
      return data.map(appFromRow);
    } catch {
      return stored;
    }
  }

  const { data } = await adminApi("applications");
  if (data && Array.isArray(data) && data.length > 0) {
    return data.map(appFromRow);
  }
  return stored;
}

/** Create or update a job posting → saves locally and syncs to Supabase. */
export async function saveJobPosting(job: JobPosting): Promise<void> {
  // 1. Update local storage immediately for fast UI feedback
  const existing = getStoredJobs();
  const index = existing.findIndex((j) => j.id === job.id);
  let updatedJobs: JobPosting[];
  if (index >= 0) {
    updatedJobs = [...existing];
    updatedJobs[index] = { ...job, updatedAt: new Date().toISOString() };
  } else {
    const newJob = {
      ...job,
      id: job.id || `job-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
    };
    updatedJobs = [newJob, ...existing];
  }
  saveStoredJobs(updatedJobs);

  // 2. Sync to Supabase in background
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
  const existing = getStoredJobs();
  saveStoredJobs(existing.filter((j) => j.id !== id));
  await adminApi("jobs", { method: "DELETE", body: JSON.stringify({ id }) });
}

/** Update an application's status / admin notes. */
export async function updateApplicationRecord(
  id: string,
  updates: { status?: ApplicationStatus; adminNotes?: string },
): Promise<void> {
  const existing = getStoredApplications();
  const updated = existing.map((app) => {
    if (app.id === id) {
      return {
        ...app,
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.adminNotes !== undefined ? { adminNotes: updates.adminNotes } : {}),
        updatedAt: new Date().toISOString(),
      };
    }
    return app;
  });
  saveStoredApplications(updated);

  const body: any = { id };
  if (updates.status) body.status = updates.status;
  if (updates.adminNotes !== undefined) body.admin_notes = updates.adminNotes;
  await adminApi("applications", { method: "PATCH", body: JSON.stringify(body) });
}

/**
 * Public job application submit → criska_applications (via the public /api/apply).
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
    id: `app-${Date.now()}`,
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

  // Save to local store for instant display
  const existingApps = getStoredApplications();
  saveStoredApplications([app, ...existingApps]);

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
    // Non-fatal — saved locally
  }

  return app;
}
