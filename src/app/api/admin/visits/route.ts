import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

/** Authed — returns real visit counts (total / today / last 7 days). */
export async function GET() {
  const jar = await cookies();
  if (!(await verifySession(jar.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ total: 0, today: 0, week: 0, available: false });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [total, today, week] = await Promise.all([
      sb.from("criska_visits").select("*", { count: "exact", head: true }),
      sb.from("criska_visits").select("*", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
      sb.from("criska_visits").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
    ]);
    // A missing table returns either an error or a null count (no thrown error).
    if (total.error || total.count === null) {
      return NextResponse.json({ total: 0, today: 0, week: 0, available: false });
    }
    return NextResponse.json({
      total: total.count ?? 0,
      today: today.count ?? 0,
      week: week.count ?? 0,
      available: true,
    });
  } catch {
    // Table not created yet.
    return NextResponse.json({ total: 0, today: 0, week: 0, available: false });
  }
}
