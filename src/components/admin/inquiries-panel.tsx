"use client";

import { useCallback, useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dedicated inbox for website form submissions — everything a visitor sends
 * through "Send us a message" (contact) or "Schedule Consultation" lands in
 * criska_inquiries and shows up here.
 */
export function InquiriesPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "contact" | "consultation">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const j = await res.json();
      setRows(Array.isArray(j.data) ? j.data : []);
    } catch {
      setRows([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    await fetch("/api/admin/inquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  const visible = rows.filter((r) => filter === "all" || (r.source || "contact") === filter);
  const counts = {
    all: rows.length,
    contact: rows.filter((r) => (r.source || "contact") === "contact").length,
    consultation: rows.filter((r) => r.source === "consultation").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[26px]">Website Inquiries</h2>
          <p className="mt-1 text-[13.5px] text-muted">
            Everyone who submitted the contact form or scheduled a consultation.
          </p>
        </div>
        <div className="flex gap-2">
          {([["all", "All"], ["contact", "Contact form"], ["consultation", "Consultations"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-[13px] transition-colors ${
                filter === key ? "bg-ink text-on-ink" : "bg-panel text-foreground hover:bg-panel-2"
              }`}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-[14.5px] text-muted">Loading inquiries…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center text-[14.5px] text-muted">
          No inquiries {filter !== "all" ? `from ${filter}` : "yet"}.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{r.full_name}</span>
                    {r.company && <span className="text-[13px] text-muted">· {r.company}</span>}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        r.source === "consultation"
                          ? "bg-accent-soft text-accent"
                          : "bg-panel text-muted"
                      }`}
                    >
                      {r.source === "consultation" ? "Consultation" : "Contact form"}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-muted">
                    <a href={`mailto:${r.email}`} className="hover:text-foreground">{r.email}</a>
                    {r.phone && <a href={`tel:${r.phone}`} className="hover:text-foreground">{r.phone}</a>}
                    {r.service && <span>Service: {r.service}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-[12px] text-faint">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                  </span>
                  <button
                    onClick={() => remove(r.id)}
                    className="rounded-full border border-border px-3 py-1 text-[12.5px] text-[#c0564f] hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {r.requirements && (
                <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-foreground/80">
                  <span className="text-faint">Requirements: </span>{r.requirements}
                </p>
              )}
              {r.message && r.message !== r.requirements && (
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{r.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
