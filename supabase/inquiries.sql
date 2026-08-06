-- Contact / "Schedule Consultation" inquiries.
-- Run once in Supabase SQL Editor (project zbvvbtzmvxlbmjxepqoy).

create table if not exists criska_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text default '',
  email text not null,
  phone text default '',
  service text default '',
  requirements text default '',
  message text default '',
  source text default 'contact',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table criska_inquiries enable row level security;

-- anyone may submit an inquiry (insert only, no public read)
drop policy if exists "criska_inquiries_insert" on criska_inquiries;
create policy "criska_inquiries_insert" on criska_inquiries
  for insert to anon, authenticated with check (true);
-- reads happen server-side via the service_role key.
