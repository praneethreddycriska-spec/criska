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

-- The `resumes` storage bucket + its public insert/select policies already exist
-- in schema.sql. If this is a fresh project, run schema.sql first.
