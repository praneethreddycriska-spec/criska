-- ============================================================
-- CRISKA — full database schema + seed (idempotent).
-- Run this ONCE in the new project: Supabase Dashboard ->
-- SQL Editor -> New query -> paste all -> Run.
-- Project: zbvvbtzmvxlbmjxepqoy
-- ============================================================

-- ---------- TABLES ----------
create table if not exists criska_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text default '',
  type text default 'Full-time',
  location text default 'Hyderabad',
  description text default '',
  apply_url text default '',
  requirements jsonb not null default '[]'::jsonb,
  screening_questions jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  is_open boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists criska_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text default '',
  date_label text default '',
  location text default '',
  overview text default '',
  image text default '',
  link text default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists criska_leadership (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  role text not null,
  bio text default '',
  image text default '',
  linkedin text default '#',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists criska_contact (
  id int primary key default 1,
  company text not null default 'Criska Business Consulting Pvt. Ltd.',
  office_label text default 'Corporate Office',
  address jsonb not null default '[]'::jsonb,
  phone text default '',
  emails jsonb not null default '[]'::jsonb,
  website text default 'www.criska.in',
  updated_at timestamptz not null default now(),
  constraint criska_contact_singleton check (id = 1)
);

create table if not exists criska_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid,
  job_title text default '',
  full_name text not null,
  email text not null,
  phone text default '',
  current_company text default '',
  linkedin text default '',
  portfolio_url text default '',
  experience_years text default '',
  notice_period text default '',
  project_summary text default '',
  technical_skills jsonb not null default '[]'::jsonb,
  screening_answers jsonb not null default '{}'::jsonb,
  ats_score int not null default 0,
  ats_analysis jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  admin_notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists criska_consultations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text default '',
  company text default '',
  service_interest text default '',
  preferred_date text default '',
  message text default '',
  status text default 'new',
  admin_notes text default '',
  created_at timestamptz not null default now()
);

-- ---------- RLS & POLICIES ----------
alter table criska_jobs enable row level security;
alter table criska_events enable row level security;
alter table criska_leadership enable row level security;
alter table criska_contact enable row level security;
alter table criska_applications enable row level security;
alter table criska_consultations enable row level security;

-- Public reads
create policy "criska_jobs_public_read" on criska_jobs for select using (true);
create policy "criska_events_public_read" on criska_events for select using (true);
create policy "criska_leadership_public_read" on criska_leadership for select using (true);
create policy "criska_contact_public_read" on criska_contact for select using (true);

-- Public inserts
create policy "criska_apps_public_insert" on criska_applications for insert with check (true);
create policy "criska_consultations_public_insert" on criska_consultations for insert with check (true);

-- Service-role full control
create policy "criska_jobs_admin_all" on criska_jobs for all using (true) with check (true);
create policy "criska_events_admin_all" on criska_events for all using (true) with check (true);
create policy "criska_leadership_admin_all" on criska_leadership for all using (true) with check (true);
create policy "criska_contact_admin_all" on criska_contact for all using (true) with check (true);
create policy "criska_apps_admin_all" on criska_applications for all using (true) with check (true);
create policy "criska_consultations_admin_all" on criska_consultations for all using (true) with check (true);

-- ---------- RESUMES BUCKET ----------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

create policy "resumes_insert" on storage.objects for insert with check (bucket_id = 'resumes');
create policy "resumes_select" on storage.objects for select using (bucket_id = 'resumes');

-- ---------- SEED: jobs ----------
insert into criska_jobs (title, department, type, location, description, requirements, screening_questions, sort)
select * from (values
  ('AI / Machine Learning Engineer','Artificial Intelligence','Full-time','Hyderabad / Remote','Design and deploy production-grade Generative AI, LLM pipelines, and conversational AI agents for enterprise clients across finance and healthcare.',
   '["Python, PyTorch/TensorFlow & LangChain/LlamaIndex","LLM fine-tuning, RAG architecture & Vector DBs","3+ years building AI/ML applications"]'::jsonb,
   '[{"id":"q-exp","question":"Years of professional experience with AI/ML & LLMs?","type":"number","required":true},{"id":"q-notice","question":"What is your notice period / availability?","type":"select","options":["Immediate","15 Days","30 Days","60+ Days"],"required":true},{"id":"q-project","question":"Briefly describe an AI or LLM application you brought to production.","type":"text","required":true}]'::jsonb, 1),
  ('Cloud & DevOps Engineer','Cloud Infrastructure','Full-time','Hyderabad / Remote','Manage multi-cloud infrastructure (AWS, Azure, GCP), automate CI/CD pipelines with GitHub Actions, and enforce Terraform Infrastructure-as-Code.',
   '["AWS/Azure deep hands-on expertise","Docker, Kubernetes & Terraform IaC","CI/CD automation & monitoring"]'::jsonb,
   '[{"id":"q-exp","question":"Years of experience with Kubernetes and Terraform?","type":"number","required":true},{"id":"q-notice","question":"Notice period / availability?","type":"select","options":["Immediate","15 Days","30 Days","60+ Days"],"required":true}]'::jsonb, 2),
  ('Cybersecurity Analyst','Cybersecurity','Full-time','Hyderabad','Perform vulnerability management, penetration testing, SOC monitoring, and security compliance aligned to ISO 27001, SOC 2, and GDPR.',
   '["SIEM tools, Wireshark, Burp Suite","ISO 27001, SOC 2, HIPAA knowledge","Incident response experience"]'::jsonb,
   '[{"id":"q-cert","question":"Do you hold CEH, CISSP, or equivalent certifications?","type":"select","options":["Yes","In Progress","No"],"required":true},{"id":"q-notice","question":"Notice period / availability?","type":"select","options":["Immediate","15 Days","30 Days","60+ Days"],"required":true}]'::jsonb, 3),
  ('Full-Stack Software Engineer','Software Engineering','Full-time','Hyderabad / Remote','Develop resilient web applications using Next.js, React 19, TypeScript, Node.js, and PostgreSQL with sleek UI/UX aesthetics.',
   '["Next.js, React 19, TypeScript & Tailwind","Node.js backend & REST APIs","PostgreSQL / Supabase"]'::jsonb,
   '[{"id":"q-stack","question":"Rate your expertise with Next.js and TypeScript.","type":"select","options":["Expert (4+ yrs)","Intermediate (2-4 yrs)","Beginner (<2 yrs)"],"required":true},{"id":"q-notice","question":"Notice period / availability?","type":"select","options":["Immediate","15 Days","30 Days","60+ Days"],"required":true}]'::jsonb, 4),
  ('Data Engineer / BI Developer','Data Analytics','Full-time','Hyderabad / Remote','Build data pipelines, warehouses, and BI dashboards on Power BI, Tableau, Snowflake, and Databricks for data-driven decisions.',
   '["Data engineering & warehousing","Power BI / Tableau","SQL & big data"]'::jsonb,
   '[{"id":"q-exp","question":"Years of experience in data engineering / BI?","type":"number","required":true},{"id":"q-notice","question":"Notice period / availability?","type":"select","options":["Immediate","15 Days","30 Days","60+ Days"],"required":true}]'::jsonb, 5),
  ('IT Recruiter / Talent Partner','Talent','Full-time','Hyderabad','Own end-to-end technical recruitment — sourcing, screening, and building strong candidate pipelines across engineering and consulting.',
   '["Technical recruitment experience","Sourcing & screening","ATS familiarity"]'::jsonb,
   '[{"id":"q-exp","question":"Years of IT recruitment experience?","type":"number","required":true},{"id":"q-notice","question":"Notice period / availability?","type":"select","options":["Immediate","15 Days","30 Days","60+ Days"],"required":true}]'::jsonb, 6)
) as v
where not exists (select 1 from criska_jobs);

-- ---------- SEED: events ----------
insert into criska_events (title, tag, date_label, location, overview, sort)
select * from (values
  ('Criska Tech Talk: Generative AI in the Enterprise','Tech Talk','March 2026','Hyderabad Office','An internal knowledge-sharing session on practical Generative AI use cases, LLM integration patterns, and responsible AI governance.',1),
  ('Cybersecurity Awareness Week','Workshop','February 2026','Hyderabad Office','A week of hands-on workshops on secure coding, phishing awareness, and incident response.',2),
  ('Cloud & DevOps Hackathon','Hackathon','January 2026','Hyderabad Office','Cross-functional teams built cloud-native prototypes in 24 hours, competing on automation and delivery speed.',3),
  ('Annual Team Offsite & Innovation Day','Culture','December 2025','Hyderabad','Our yearly offsite for strategy, recognition, and an innovation showcase.',4),
  ('Campus Connect & Recruitment Drive','Hiring','November 2025','Hyderabad','Engaging emerging talent through campus sessions and a recruitment drive.',5),
  ('Festival Celebrations at the Office','Culture','October 2025','Hyderabad Office','Celebrating together — the people-focused culture that makes Criska a great place to work.',6)
) as v
where not exists (select 1 from criska_events);

-- ---------- SEED: leadership ----------
insert into criska_leadership (name, role, bio, linkedin, sort)
select * from (values
  ('','Founder & Managing Director','Sets Criska''s vision, partnerships, and standards of trust and quality.','#',1),
  ('','Chief Technology Officer','Leads solution architecture, engineering, and delivery excellence.','#',2),
  ('','Head of Security & Compliance','Drives our cybersecurity-first approach, ISO standards, and CMMI journey.','#',3),
  ('','Head of People & Talent','Leads staffing, recruitment, and Criska''s people-focused culture.','#',4)
) as v
where not exists (select 1 from criska_leadership);

-- ---------- SEED: contact ----------
insert into criska_contact (id, company, office_label, address, phone, emails, website) values
(1,'Criska Business Consulting Pvt. Ltd.','Corporate Office',
 '["H No 1-98/5/2A, Spacion Business Towers","Madhapur, Shaikpet","Hyderabad, Rangareddy","Telangana — 500081"]'::jsonb,
 '+91 8121485444',
 '["info@criska.in","hr@criskasecurity.com"]'::jsonb,
 'www.criska.in')
on conflict (id) do nothing;
