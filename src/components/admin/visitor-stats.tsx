"use client";

import { useEffect, useState } from "react";

type Visits = { total: number; today: number; week: number; available: boolean };

export function VisitorStats() {
  const [v, setV] = useState<Visits | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/admin/visits")
        .then((r) => r.json())
        .then((d) => { if (alive) setV(d); })
        .catch(() => {});
    load();
    const t = setInterval(load, 30_000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">Website visitors</h3>
        <span className="h-2 w-2 rounded-full bg-accent" />
      </div>
      {v && !v.available ? (
        <p className="mt-3 text-[13px] text-muted">
          Run the <code>criska_visits</code> table SQL to start counting real visits.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Total" value={v ? fmt(v.total) : "—"} />
          <Stat label="Today" value={v ? fmt(v.today) : "—"} />
          <Stat label="7 days" value={v ? fmt(v.week) : "—"} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-panel px-3 py-3 text-center">
      <div className="font-display tabular-nums text-[26px] leading-none text-foreground">{value}</div>
      <div className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-faint">{label}</div>
    </div>
  );
}
