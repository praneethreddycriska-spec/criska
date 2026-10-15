import { NextResponse } from "next/server";
import { getEvents } from "@/lib/data";

// Public: the distinct event categories (tags), used by the nav "Events" dropdown.
// Cached (getEvents is cached + ISR) so this is cheap to call from every page.
export const revalidate = 300;

export async function GET() {
  try {
    const events = await getEvents();
    const seen = new Map<string, string>();
    for (const e of events) {
      const t = (e.tag || "").trim();
      if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
    }
    return NextResponse.json({ categories: Array.from(seen.values()) });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
