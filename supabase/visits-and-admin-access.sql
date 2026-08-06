-- ============================================================
-- Criska — Visitor counting + Admin access allowlist
-- Run this once in the Supabase SQL Editor for project
-- zbvvbtzmvxlbmjxepqoy.
-- Safe to re-run (idempotent).
-- ============================================================

-- 1) Real visitor counter -----------------------------------
create table if not exists public.criska_visits (
  id         bigserial primary key,
  path       text,
  created_at timestamptz not null default now()
);

create index if not exists criska_visits_created_idx
  on public.criska_visits (created_at);

alter table public.criska_visits enable row level security;
-- Writes/reads go through the server (service-role key), which
-- bypasses RLS. No anon policies are required, so none are added.

-- 2) Admin access allowlist ---------------------------------
-- criska_admin_settings already exists (id, password_hash, updated_at).
-- Add the allowlist column and seed the two authorized emails.
alter table public.criska_admin_settings
  add column if not exists allowed_emails jsonb
  not null default '["praneethreddy.criska@gmail.com","vivekshaganti@gmail.com"]'::jsonb;

update public.criska_admin_settings
   set allowed_emails = '["praneethreddy.criska@gmail.com","vivekshaganti@gmail.com"]'::jsonb
 where id = 1
   and (allowed_emails is null or jsonb_array_length(allowed_emails) = 0);
