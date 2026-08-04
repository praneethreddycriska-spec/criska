import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";

const TABLES: Record<string, string> = {
  jobs: "criska_jobs",
  events: "criska_events",
  leadership: "criska_leadership",
  contact: "criska_contact",
  applications: "criska_applications",
};

async function guard() {
  const jar = await cookies();
  const ok = await verifySession(jar.get(SESSION_COOKIE)?.value);
  return ok;
}

function resolve(table: string) {
  return TABLES[table] ?? null;
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
  if (!t) return NextResponse.json({ error: "Unknown table" }, { status: 404 });

  // Reads: prefer the admin (service-role) client; fall back to the anon client
  // for content tables that have public read policies so the dashboard is usable
  // before the service key is set. Applications require the service-role key.
  const sb = getSupabaseAdmin() ?? (table !== "applications" ? getSupabase() : null);
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase service role key not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local to view applications and save changes.", data: [] },
      { status: 200 },
    );
  }

  const order =
    table === "applications"
      ? { col: "created_at", asc: false }
      : table === "contact"
      ? { col: "id", asc: true }
      : { col: "sort", asc: true };
  const { data, error: e } = await sb.from(t).select("*").order(order.col, { ascending: order.asc });
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);
  if (!t) return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  const { sb, error } = await admin();
  if (error) return error;

  const values = await req.json().catch(() => ({}));
  delete values.id;

  if (table === "contact") {
    const { data, error: e } = await sb!
      .from(t)
      .upsert({ ...values, id: 1, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (e) return NextResponse.json({ error: e.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const { data, error: e } = await sb!.from(t).insert(values).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);
  if (!t) return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  const { sb, error } = await admin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const { id, ...values } = body;
  if (table === "contact") {
    const { data, error: e } = await sb!
      .from(t)
      .upsert({ ...values, id: 1, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (e) return NextResponse.json({ error: e.message }, { status: 500 });
    return NextResponse.json({ data });
  }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { data, error: e } = await sb!.from(t).update(values).eq("id", id).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  const t = resolve(table);
  if (!t) return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  const { sb, error } = await admin();
  if (error) return error;

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error: e } = await sb!.from(t).delete().eq("id", id);
  if (e) return NextResponse.json({ error: e.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
