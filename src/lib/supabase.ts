import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { JobPosting, JobApplication, ApplicationStatus } from "@/types/ats";
import {
  getStoredJobs,
  saveStoredJobs,
  getStoredApplications,
  saveStoredApplications,
  submitNewApplication,
} from "./store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all job postings from Supabase or local store
 */
export async function fetchJobs(): Promise<JobPosting[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*, applications(count)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        title: item.title,
        department: item.department,
        type: item.type,
        location: item.location,
        description: item.description,
        requirements: item.requirements || [],
        screeningQuestions: item.screening_questions || [],
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        applicationsCount: item.applications?.[0]?.count || 0,
      }));
    }
  }
  return getStoredJobs();
}

/**
 * Fetch all job applications
 */
export async function fetchApplications(): Promise<JobApplication[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("applications")
      .select("*, job_postings(title)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        jobId: item.job_id,
        jobTitle: item.job_postings?.title || "Role",
        fullName: item.full_name,
        email: item.email,
        phone: item.phone,
        portfolioUrl: item.portfolio_url,
        linkedinUrl: item.linkedin_url,
        resumeUrl: item.resume_url,
        resumeFilename: item.resume_filename,
        screeningAnswers: item.screening_answers || {},
        atsScore: item.ats_score,
        atsAnalysis: item.ats_analysis,
        status: item.status,
        adminNotes: item.admin_notes || "",
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }
  }
  return getStoredApplications();
}

/**
 * Submit job application
 */
export async function createApplication(
  job: JobPosting,
  candidateData: {
    fullName: string;
    email: string;
    phone: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    resumeUrl: string;
    resumeFilename: string;
    screeningAnswers: Record<string, string>;
  }
): Promise<JobApplication> {
  const localApp = submitNewApplication(job, candidateData);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("applications").insert({
        id: localApp.id,
        job_id: job.id,
        full_name: candidateData.fullName,
        email: candidateData.email,
        phone: candidateData.phone,
        portfolio_url: candidateData.portfolioUrl || null,
        linkedin_url: candidateData.linkedinUrl || null,
        resume_url: candidateData.resumeUrl,
        resume_filename: candidateData.resumeFilename,
        screening_answers: candidateData.screeningAnswers,
        ats_score: localApp.atsScore,
        ats_analysis: localApp.atsAnalysis,
        status: "new",
        admin_notes: "",
      });
    } catch (err) {
      console.warn("Supabase insert warning (fallback used):", err);
    }
  }

  return localApp;
}

/**
 * Update candidate application status & admin notes
 */
export async function updateApplicationRecord(
  id: string,
  updates: { status?: ApplicationStatus; adminNotes?: string }
): Promise<void> {
  const apps = getStoredApplications();
  const updatedApps = apps.map((a) =>
    a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
  );
  saveStoredApplications(updatedApps);

  if (isSupabaseConfigured && supabase) {
    const payload: Record<string, unknown> = {};
    if (updates.status) payload.status = updates.status;
    if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;
    await supabase.from("applications").update(payload).eq("id", id);
  }
}

/**
 * Create or update a job posting
 */
export async function saveJobPosting(job: JobPosting): Promise<void> {
  const jobs = getStoredJobs();
  const existingIdx = jobs.findIndex((j) => j.id === job.id);
  let updatedJobs: JobPosting[];

  if (existingIdx >= 0) {
    updatedJobs = jobs.map((j) => (j.id === job.id ? job : j));
  } else {
    updatedJobs = [job, ...jobs];
  }
  saveStoredJobs(updatedJobs);

  if (isSupabaseConfigured && supabase) {
    await supabase.from("job_postings").upsert({
      id: job.id,
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      screening_questions: job.screeningQuestions,
      status: job.status,
    });
  }
}
