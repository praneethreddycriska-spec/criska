"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventCarousel } from "@/components/event-carousel";
import type { EventItem } from "@/lib/data";

/**
 * Events grid + on-page category filter. Categories are derived dynamically from
 * the events' own tags, so any tag an admin sets (Birthday, Anniversary, Tech
 * Talk, …) appears automatically. The active category is mirrored in the URL
 * (?category=) so the nav dropdown can deep-link straight to a filtered view.
 */
export function EventsExplorer({ items }: { items: EventItem[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = (params.get("category") || "").trim();

  const categories = useMemo(() => {
    const seen = new Map<string, string>(); // lowercased -> display
    for (const e of items) {
      const t = (e.tag || "").trim();
      if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
    }
    return Array.from(seen.values());
  }, [items]);

  const filtered = useMemo(() => {
    if (!active) return items;
    return items.filter((e) => (e.tag || "").trim().toLowerCase() === active.toLowerCase());
  }, [items, active]);

  const setCategory = (cat: string) => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    if (cat) sp.set("category", cat);
    else sp.delete("category");
    const qs = sp.toString();
    router.replace(qs ? `/events?${qs}` : "/events", { scroll: false });
  };

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <Chip label="All" active={!active} onClick={() => setCategory("")} />
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              active={active.toLowerCase() === c.toLowerCase()}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-border bg-surface p-12 text-center text-muted">
          No events in <strong className="text-foreground">{active}</strong> yet.{" "}
          <button type="button" onClick={() => setCategory("")} className="text-accent underline underline-offset-2">
            View all events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ev) => (
            <article
              key={ev.id}
              className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-all duration-300 hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-panel">
                <EventCarousel images={ev.images} alt={ev.title} />
                {ev.tag && (
                  <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-paper/90 px-3 py-1 text-[11.5px] font-medium tracking-wide text-foreground backdrop-blur">
                    {ev.tag}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-2 text-[12.5px] text-faint">
                  <span>{ev.date}</span>
                  {ev.location && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{ev.location}</span>
                    </>
                  )}
                </div>
                <h2 className="font-display mt-3 text-[23px] leading-tight">{ev.title}</h2>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{ev.overview}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-[13.5px] transition-colors ${
        active
          ? "border-transparent bg-ink text-on-ink"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
