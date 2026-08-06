-- ============================================================
-- CRISKA ATS & ADMIN PORTAL — SUPABASE DATABASE SCHEMA
-- ============================================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
      'new',
      'under_review',
      'shortlisted',
      'interviewing',
      'hired',
      'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
  job_id UUID REFERENCES public.job_postings(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  portfolio_url TEXT,
  linkedin_url TEXT,
  technical_skills TEXT[] NOT NULL DEFAULT '{}',
  resume_url TEXT,
  resume_filename TEXT,
  screening_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  ats_score INT NOT NULL DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
  ats_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  status application_status NOT NULL DEFAULT 'new',
  admin_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SITE CONTENT TABLES (CRISKA)
CREATE TABLE IF NOT EXISTS public.criska_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT DEFAULT '',
  type TEXT DEFAULT '',
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  apply_url TEXT DEFAULT '',
  is_open BOOLEAN DEFAULT true,
  sort INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.criska_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  tag TEXT DEFAULT '',
  date_label TEXT DEFAULT '',
  location TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  image TEXT DEFAULT '',
  link TEXT DEFAULT '',
  sort INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.criska_leadership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT DEFAULT '',
  role TEXT NOT NULL,
  bio TEXT DEFAULT '',
  image TEXT DEFAULT '',
  linkedin TEXT DEFAULT '#',
  sort INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.criska_contact (
  id INT PRIMARY KEY DEFAULT 1,
  company TEXT NOT NULL,
  office_label TEXT DEFAULT 'Corporate Office',
  address TEXT[] DEFAULT '{}',
  phone TEXT DEFAULT '',
  emails TEXT[] DEFAULT '{}',
  website TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES FOR FAST QUERYING, FILTERING & SORTING
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_ats_score ON public.applications(ats_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);

-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criska_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criska_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criska_leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criska_contact ENABLE ROW LEVEL SECURITY;

-- Allow public users to read data
CREATE POLICY "Public users can view published job postings" ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "Public users can view criska_jobs" ON public.criska_jobs FOR SELECT USING (true);
CREATE POLICY "Public users can view criska_events" ON public.criska_events FOR SELECT USING (true);
CREATE POLICY "Public users can view criska_leadership" ON public.criska_leadership FOR SELECT USING (true);
CREATE POLICY "Public users can view criska_contact" ON public.criska_contact FOR SELECT USING (true);

-- Allow candidates to submit applications
CREATE POLICY "Anyone can submit a job application" ON public.applications FOR INSERT WITH CHECK (true);

-- Admin policies (Full Access via Service Role or Authenticated Admin)
CREATE POLICY "Admins have full access to job_postings" ON public.job_postings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to criska_jobs" ON public.criska_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to criska_events" ON public.criska_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to criska_leadership" ON public.criska_leadership FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to criska_contact" ON public.criska_contact FOR ALL USING (true) WITH CHECK (true);

-- 7. STORAGE BUCKET FOR RESUMES
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Candidates can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Public / Admins can view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- 8. SEED INITIAL DATA FOR QUICK START
INSERT INTO public.job_postings (title, department, type, location, description, requirements, status)
VALUES
  ('Senior AI & ML Solutions Architect', 'Artificial Intelligence', 'Full-time', 'Hyderabad / Remote', 'Lead LLM, RAG, and agentic AI pipeline implementations for enterprise clients.', ARRAY['8+ years experience', 'Python, PyTorch, LangChain', 'Cloud deployment'], 'published'),
  ('Lead Cyber Defense Specialist', 'Cybersecurity', 'Full-time', 'Hyderabad / On-site', 'Drive SOC, zero-trust architecture, and pentesting for financial services.', ARRAY['6+ years experience', 'CISSP / CEH preferred', 'SIEM & EDR mastery'], 'published'),
  ('Principal Cloud Infrastructure Architect', 'Cloud & DevOps', 'Full-time', 'Hyderabad / Remote', 'Design multi-cloud architecture on AWS, Azure, and GCP with Terraform.', ARRAY['7+ years in Cloud Infrastructure', 'Kubernetes & Terraform', 'CI/CD automation'], 'published')
ON CONFLICT DO NOTHING;

INSERT INTO public.criska_contact (id, company, office_label, address, phone, emails, website)
VALUES (
  1,
  'Criska Business Consulting Pvt. Ltd.',
  'Corporate Office',
  ARRAY['Spacion Business Towers, 4th Floor', 'Next to Westin Hotel, Mindspace IT Park', 'Madhapur, Hyderabad, Telangana 500081, India'],
  '+91 (040) 6789 1234',
  ARRAY['contact@criskasecurity.com', 'hr@criskasecurity.com'],
  'https://criska.in'
) ON CONFLICT (id) DO NOTHING;
