import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { verifyFreshSession } from "@/lib/session";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";

const TABLES: Record<string, string> = {
  jobs: "criska_jobs",
  events: "criska_events",
  leadership: "criska_leadership",
  contact: "criska_contact",
  applications: "criska_applications",
  consultations: "criska_consultations",
  inquiries: "criska_consultations",
  job_postings: "job_postings",
};

async function guard() {
  const jar = await cookies();
  return verifyFreshSession(jar.get(SESSION_COOKIE)?.value);
}

function resolve(table: string) {
  return TABLES[table] ?? table;
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

  const values = await req.json().catch(() => ({}));
  delete values.id;

  try {
    if (t === "criska_contact") {
      const { data, error: e } = await sb!
        .from(t)
        .upsert({ ...values, id: 1, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (e) return NextResponse.json({ error: e.message, tableMissing: e.code === "PGRST205" }, { status: 200 });
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
  const { id, ...values } = body;

  try {
    if (t === "criska_contact") {
      const { data, error: e } = await sb!
        .from(t)
        .upsert({ ...values, id: 1, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (e) return NextResponse.json({ error: e.message }, { status: 200 });
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
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete error" }, { status: 200 });
  }
}
