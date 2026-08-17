import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE } from "@/lib/auth";
import { verifyFreshSession } from "@/lib/session";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";

const TABLES: Record<string, string> = {
  jobs: "criska_jobs",
  events: "criska_events",
  leadership: "criska_leadership",
  services: "criska_services",
  contact: "criska_contact",
  applications: "criska_applications",
  consultations: "criska_inquiries",
  inquiries: "criska_inquiries",
  job_postings: "job_postings",
};

// Public reads in src/lib/data.ts are cached under these tags (unstable_cache) and
// the public pages are ISR. Busting the tag after a write makes admin edits show
// up on the site immediately instead of waiting out the revalidate window.
const TAG_BY_TABLE: Record<string, string> = {
  criska_services: "services",
  criska_leadership: "leadership",
  criska_events: "events",
  criska_contact: "contact",
  criska_jobs: "jobs",
  job_postings: "jobs", // getJobs falls back to job_postings
};

function bust(t: string) {
  const tag = TAG_BY_TABLE[t];
  if (tag) revalidateTag(tag, "max"); // Next 16 requires a profile; "max" = expire now
}

async function guard() {
  const jar = await cookies();
  return verifyFreshSession(jar.get(SESSION_COOKIE)?.value);
}

function resolve(table: string) {
  return TABLES[table] ?? table;
}

/**
 * Defensive server-side sanitation of a record's values (generic, all tables):
 * - trim string values;
 * - coerce any field named `sort` to Math.max(0, Math.floor(Number(value) || 0));
 * - blank out any string whose trimmed form starts with `javascript:` or `data:`.
 */
function sanitizeValues(values: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...values };
  for (const [k, v] of Object.entries(out)) {
    if (k === "sort") {
      out[k] = Math.max(0, Math.floor(Number(v) || 0));
      continue;
    }
    if (typeof v === "string") {
      const trimmed = v.trim();
      const lower = trimmed.toLowerCase();
      out[k] = lower.startsWith("javascript:") || lower.startsWith("data:") ? "" : trimmed;
    }
  }
  return out;
}

async function admin() {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      error: NextResponse.json(
        { error: "Supabase service role key not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local." },
        { status: 503 },
      ),
    };
  }
  return { sb };
}

export async function GET(_req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);

  const sb = getSupabaseAdmin() ?? (table !== "applications" ? getSupabase() : null);
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase service role key not configured.", data: [], tableMissing: true },
      { status: 200 },
    );
  }

  const order =
    t.includes("applications")
      ? { col: "created_at", asc: false }
      : t.includes("contact")
      ? { col: "id", asc: true }
      : t.includes("services")
      ? { col: "sort", asc: true }
      : { col: "created_at", asc: false };

  try {
    const { data, error: e } = await sb.from(t).select("*").order(order.col, { ascending: order.asc });
    if (e) {
      // Handle table missing 404 cleanly
      if (e.code === "PGRST205" || e.message?.includes("schema cache")) {
        return NextResponse.json({ data: [], tableMissing: true, message: `Table '${t}' not created yet in Supabase.` });
      }
      return NextResponse.json({ data: [], error: e.message }, { status: 200 });
    }
    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ data: [], error: err?.message || "Database query error" }, { status: 200 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);
  const { sb, error } = await admin();
  if (error) return error;

  const raw = await req.json().catch(() => ({}));
  delete raw.id;
  const values = sanitizeValues(raw);

  try {
    if (t === "criska_contact") {
      const { data, error: e } = await sb!
        .from(t)
        .upsert({ ...values, id: 1, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (e) return NextResponse.json({ error: e.message, tableMissing: e.code === "PGRST205" }, { status: 200 });
      bust(t);
      return NextResponse.json({ data });
    }

    const { data, error: e } = await sb!.from(t).insert(values).select().single();
    if (e) {
      if (e.code === "PGRST205" || e.message?.includes("schema cache")) {
        return NextResponse.json({
          ok: true,
          savedLocally: true,
          tableMissing: true,
          message: `Saved locally. Run supabase/schema.sql in Supabase SQL Editor to create table '${t}'.`,
        }, { status: 200 });
      }
      return NextResponse.json({ error: e.message }, { status: 200 });
    }
    bust(t);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Save error" }, { status: 200 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);
  const { sb, error } = await admin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const { id, ...rest } = body;
  const values = sanitizeValues(rest);

  try {
    if (t === "criska_contact") {
      const { data, error: e } = await sb!
        .from(t)
        .upsert({ ...values, id: 1, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (e) return NextResponse.json({ error: e.message }, { status: 200 });
      bust(t);
      return NextResponse.json({ data });
    }
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { data, error: e } = await sb!.from(t).update(values).eq("id", id).select().single();
    if (e) {
      if (e.code === "PGRST205" || e.message?.includes("schema cache")) {
        return NextResponse.json({ ok: true, savedLocally: true, tableMissing: true }, { status: 200 });
      }
      return NextResponse.json({ error: e.message }, { status: 200 });
    }
    bust(t);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Update error" }, { status: 200 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);
  const { sb, error } = await admin();
  if (error) return error;

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const { error: e } = await sb!.from(t).delete().eq("id", id);
    if (e && (e.code === "PGRST205" || e.message?.includes("schema cache"))) {
      return NextResponse.json({ ok: true, savedLocally: true, tableMissing: true }, { status: 200 });
    }
    if (e) return NextResponse.json({ error: e.message }, { status: 200 });
    bust(t);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete error" }, { status: 200 });
  }
}
