-- ============================================================
-- CRISKA ATS & ADMIN PORTAL — SUPABASE DATABASE SCHEMA
-- ============================================================

-- 1. ENUMS
CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE application_status AS ENUM (
  'new',
  'under_review',
  'shortlisted',
  'interviewing',
  'hired',
  'rejected'
);

-- 2. JOB POSTINGS TABLE
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Engineering',
  type TEXT NOT NULL DEFAULT 'Full-time',
  location TEXT NOT NULL DEFAULT 'Hyderabad / Remote',
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  screening_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status job_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  portfolio_url TEXT,
  linkedin_url TEXT,
  resume_url TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  screening_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  ats_score INT NOT NULL DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
  ats_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  status application_status NOT NULL DEFAULT 'new',
  admin_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEXES FOR FAST QUERYING, FILTERING & SORTING
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_ats_score ON public.applications(ats_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);

-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow public candidates to read published job postings
CREATE POLICY "Public users can view published job postings"
  ON public.job_postings FOR SELECT
  USING (status = 'published');

-- Allow candidates to submit applications
CREATE POLICY "Anyone can submit a job application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Admin policies (Full Access)
CREATE POLICY "Admins have full access to job postings"
  ON public.job_postings FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to applications"
  ON public.applications FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. STORAGE BUCKET FOR RESUMES
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Candidates can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Public / Admins can view resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

-- 7. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
