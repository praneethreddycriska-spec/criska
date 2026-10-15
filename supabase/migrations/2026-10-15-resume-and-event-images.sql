-- Run this once in the Supabase SQL Editor (safe to re-run; uses IF NOT EXISTS).
-- Adds: resume upload URL on applications, and a multi-image array on events.
-- The app code works before AND after this runs, but these features only fully
-- persist once the columns exist.

-- 1) Resume upload URL stored per application (file lives in the public `resumes` bucket).
alter table criska_applications
  add column if not exists resume_url text default '';

-- 2) Multiple images per event (ordered). The old single `image` column is kept
--    for backward compatibility; the app reads `images` first and falls back to it.
alter table criska_events
  add column if not exists images jsonb not null default '[]'::jsonb;

-- 3) Resume files are stored in a public Storage bucket named `resumes`.
--    If it doesn't exist yet (uploads fail with "Bucket not found"), create it.
--    Easiest: Supabase Dashboard → Storage → New bucket → name "resumes" → Public.
--    Or via SQL:
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Public read is covered by the bucket being public; uploads go through the
-- service role (which bypasses RLS), so no extra object policy is required.
-- (Optional, only if you later upload with the anon key instead of service role:)
--   create policy "resumes_insert" on storage.objects for insert with check (bucket_id = 'resumes');
--   create policy "resumes_select" on storage.objects for select using (bucket_id = 'resumes');
