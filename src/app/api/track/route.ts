import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/** Public endpoint — records one site visit. Soft-fails until the table exists. */
export async function POST(req: Request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ ok: false });
  const { path } = await req.json().catch(() => ({ path: "" }));
  try {
    await sb.from("criska_visits").insert({ path: String(path || "").slice(0, 300) });
  } catch {
    /* table may not exist yet */
  }
  return NextResponse.json({ ok: true });
}
