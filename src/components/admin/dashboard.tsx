"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageInput } from "./image-input";

/* eslint-disable @typescript-eslint/no-explicit-any */

type FieldType = "text" | "textarea" | "number" | "bool" | "url" | "image" | "lines" | "tags" | "select";
type Field = { key: string; label: string; type: FieldType; help?: string; options?: { value: string; label: string }[] };

type TabDef = {
  key: string;
  table: string;
  label: string;
  singleton?: boolean;
  readonly?: boolean;
  titleKey?: string;
  fields: Field[];
};

const ICON_OPTIONS = [
  { value: "ai", label: "AI / Generative AI" },
  { value: "cloud", label: "Cloud" },
  { value: "security", label: "Cybersecurity" },
  { value: "code", label: "Software / Code" },
  { value: "mobile", label: "Mobile" },
  { value: "product", label: "Product" },
  { value: "data", label: "Data / Analytics" },
  { value: "devops", label: "DevOps" },
  { value: "digital", label: "Digital" },
  { value: "infra", label: "Infrastructure" },
  { value: "enterprise", label: "Enterprise" },
  { value: "staffing", label: "Staffing" },
  { value: "bpo", label: "BPO" },
  { value: "consulting", label: "Consulting" },
  { value: "managed", label: "Managed Services" },
];

const TABS: TabDef[] = [
  {
    key: "leadership", table: "leadership", label: "Meet the Board", titleKey: "role",
    fields: [
      { key: "name", label: "Name", type: "text", help: "Leave blank to show the role only" },
      { key: "role", label: "Role / Title", type: "text" },
      { key: "bio", label: "Short bio (text below the photo)", type: "textarea" },
      { key: "image", label: "Photo", type: "image", help: "Upload to Cloudinary or paste an image URL" },
      { key: "linkedin", label: "LinkedIn URL", type: "url" },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "events", table: "events", label: "Events", titleKey: "title",
    fields: [
      { key: "title", label: "Event Title", type: "text" },
      { key: "tag", label: "Tag", type: "text", help: "e.g. Tech Talk, Workshop" },
      { key: "date_label", label: "Date", type: "text", help: "e.g. March 2026" },
      { key: "location", label: "Location", type: "text" },
      { key: "overview", label: "Overview", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      { key: "link", label: "Link (optional)", type: "url" },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "services", table: "services", label: "Services", titleKey: "title",
    fields: [
      { key: "title", label: "Service Title", type: "text" },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, help: "Icon shown in the card" },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "includes", label: "Includes (comma separated)", type: "tags", help: "The capability chips" },
      { key: "extra_label", label: "Extra group label (optional)", type: "text", help: "e.g. Platforms, Compliance, Business Benefits" },
      { key: "extra_items", label: "Extra group items (comma separated)", type: "tags" },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "contact", table: "contact", label: "Contact Details", singleton: true,
    fields: [
      { key: "company", label: "Company", type: "text" },
      { key: "office_label", label: "Office Label", type: "text" },
      { key: "address", label: "Address (one line per row)", type: "lines" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "emails", label: "Emails (comma separated)", type: "tags" },
      { key: "website", label: "Website", type: "text" },
    ],
  },
  {
    key: "inquiries", table: "inquiries", label: "Inquiries", readonly: true, fields: [],
  },
];

export function AdminDashboard() {
  const router = useRouter();
  const [tabKey, setTabKey] = useState("leadership");
  const tab = TABS.find((t) => t.key === tabKey)!;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/${tab.table}`);
    const j = await res.json();
    setRows(j.data || []);
    setLoading(false);
    if (tab.singleton) setEditing(j.data?.[0] || {});
    else setEditing(null);
  }, [tab.table, tab.singleton]);

  useEffect(() => { load(); }, [load]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function save(values: any) {
    const method = values.id ? "PATCH" : "POST";
    const res = await fetch(`/api/admin/${tab.table}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const j = await res.json();
    if (!res.ok) { flash(j.error || "Save failed"); return; }
    flash("Saved");
    await load();
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/${tab.table}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const j = await res.json();
    if (!res.ok) { flash(j.error || "Delete failed"); return; }
    flash("Deleted");
    await load();
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
          <div className="font-display text-[20px]">Site Content</div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-[14px] text-muted hover:text-foreground">← ATS Portal</a>
            <a href="/" target="_blank" className="text-[14px] text-muted hover:text-foreground">View site ↗</a>
            <button onClick={logout} className="btn-pill btn-ghost !py-2 !px-4 text-[14px]">Log out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTabKey(t.key)}
              className={`rounded-full px-4 py-2 text-[14px] transition-colors ${t.key === tabKey ? "bg-ink text-on-ink" : "bg-panel text-foreground hover:bg-panel-2"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {toast && (
          <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 text-[14px] text-foreground">{toast}</div>
        )}

        <div className="mt-6">
          {loading ? (
            <p className="text-[15px] text-muted">Loading…</p>
          ) : tab.readonly ? (
            <InquiriesTable rows={rows} />
          ) : tab.singleton ? (
            <RecordForm tab={tab} initial={editing || {}} onSave={save} singleton />
          ) : editing !== null ? (
            <div>
              <button onClick={() => setEditing(null)} className="mb-4 text-[14px] text-muted hover:text-foreground">← Back to list</button>
              <RecordForm tab={tab} initial={editing} onSave={async (v) => { await save(v); setEditing(null); }} />
            </div>
          ) : (
            <CollectionList tab={tab} rows={rows} onAdd={() => setEditing({})} onEdit={setEditing} onDelete={remove} />
          )}
        </div>
      </div>
    </div>
  );
}

function CollectionList({ tab, rows, onAdd, onEdit, onDelete }: { tab: TabDef; rows: any[]; onAdd: () => void; onEdit: (r: any) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[24px]">{tab.label} <span className="text-muted">({rows.length})</span></h2>
        <button onClick={onAdd} className="btn-pill btn-primary !py-2.5 !px-5 text-[14px]">+ Add new</button>
      </div>
      <div className="mt-5 overflow-hidden rounded-[var(--radius)] border border-border">
        {rows.length === 0 && <div className="bg-surface px-5 py-8 text-center text-[14px] text-muted">Nothing yet. Click “Add new”.</div>}
        {rows.map((r, i) => (
          <div key={r.id} className={`flex items-center justify-between gap-4 bg-surface px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="min-w-0">
              <div className="truncate font-medium text-foreground">{r[tab.titleKey || "title"] || "(untitled)"}</div>
              <div className="truncate text-[13px] text-muted">
                {tab.key === "jobs" && [r.department, r.location, r.is_open ? "Open" : "Closed"].filter(Boolean).join(" · ")}
                {tab.key === "events" && [r.tag, r.date_label].filter(Boolean).join(" · ")}
                {tab.key === "leadership" && r.name}
                {tab.key === "services" && (Array.isArray(r.includes) ? `${r.includes.length} capabilities` : "")}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => onEdit(r)} className="rounded-full border border-border px-3.5 py-1.5 text-[13px] hover:bg-panel">Edit</button>
              <button onClick={() => onDelete(r.id)} className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-[#c0564f] hover:bg-panel">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordForm({ tab, initial, onSave, singleton }: { tab: TabDef; initial: any; onSave: (v: any) => Promise<void> | void; singleton?: boolean }) {
  const [values, setValues] = useState<any>(() => normalize(tab, initial));
  const [saving, setSaving] = useState(false);
  useEffect(() => { setValues(normalize(tab, initial)); }, [tab, initial]);

  const set = (k: string, v: any) => setValues((s: any) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(denormalize(tab, values));
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="rounded-[var(--radius)] border border-border bg-surface p-6 md:p-8">
      {!singleton && <h2 className="font-display mb-6 text-[24px]">{values.id ? "Edit" : "New"} {tab.label.replace(/s$/, "")}</h2>}
      {singleton && <h2 className="font-display mb-6 text-[24px]">{tab.label}</h2>}
      <div className="grid gap-5 sm:grid-cols-2">
        {tab.fields.map((f) => (
          <div key={f.key} className={f.type === "textarea" || f.type === "lines" || f.type === "image" ? "sm:col-span-2" : ""}>
            <label className="text-[12.5px] uppercase tracking-[0.1em] text-faint">{f.label}</label>
            {f.type === "textarea" && (
              <textarea rows={3} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
            )}
            {f.type === "lines" && (
              <textarea rows={4} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
            )}
            {f.type === "image" && (
              <div className="mt-2"><ImageInput value={values[f.key] ?? ""} onChange={(url) => set(f.key, url)} /></div>
            )}
            {f.type === "bool" && (
              <div className="mt-2">
                <button type="button" onClick={() => set(f.key, !values[f.key])} className={`flex h-7 w-12 items-center rounded-full px-1 transition-colors ${values[f.key] ? "bg-ink" : "bg-panel-2"}`}>
                  <span className={`h-5 w-5 rounded-full bg-surface transition-transform ${values[f.key] ? "translate-x-5" : ""}`} />
                </button>
              </div>
            )}
            {(f.type === "text" || f.type === "url" || f.type === "tags") && (
              <input type={f.type === "url" ? "url" : "text"} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
            )}
            {f.type === "select" && (
              <select value={values[f.key] ?? (f.options?.[0]?.value ?? "")} onChange={(e) => set(f.key, e.target.value)} className={inputCls}>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {f.type === "number" && (
              <input type="number" value={values[f.key] ?? 0} onChange={(e) => set(f.key, Number(e.target.value))} className={inputCls} />
            )}
            {f.help && <p className="mt-1 text-[12px] text-muted">{f.help}</p>}
          </div>
        ))}
      </div>
      <button type="submit" disabled={saving} className="btn-pill btn-primary mt-7 disabled:opacity-50">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

function InquiriesTable({ rows }: { rows: any[] }) {
  return (
    <div>
      <h2 className="font-display text-[24px]">Inquiries <span className="text-muted">({rows.length})</span></h2>
      <p className="mt-1 text-[13.5px] text-muted">Messages from the Contact / Schedule Consultation form.</p>
      {rows.length === 0 ? (
        <p className="mt-4 text-[15px] text-muted">No inquiries yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-[var(--radius)] border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium text-foreground">
                  {r.full_name}{r.company ? <span className="text-muted"> · {r.company}</span> : null}
                </div>
                <div className="text-[12.5px] text-faint">{r.created_at ? new Date(r.created_at).toLocaleString() : ""}</div>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-muted">
                <a href={`mailto:${r.email}`} className="hover:text-foreground">{r.email}</a>
                {r.phone && <span>{r.phone}</span>}
                {r.service && <span>Service: {r.service}</span>}
                {r.source && <span className="rounded-full bg-panel px-2 py-0.5 text-[11.5px]">{r.source}</span>}
              </div>
              {r.requirements && <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/80"><span className="text-faint">Requirements: </span>{r.requirements}</p>}
              {r.message && <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputCls = "mt-2 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-[14.5px] text-foreground outline-none focus:border-foreground";

function normalize(tab: TabDef, r: any) {
  const v: any = { ...r };
  for (const f of tab.fields) {
    if (f.type === "lines") v[f.key] = Array.isArray(r[f.key]) ? r[f.key].join("\n") : (r[f.key] ?? "");
    if (f.type === "tags") v[f.key] = Array.isArray(r[f.key]) ? r[f.key].join(", ") : (r[f.key] ?? "");
    if (f.type === "bool") v[f.key] = r[f.key] ?? true;
    if (f.type === "number") v[f.key] = r[f.key] ?? 0;
    if (f.type === "select") v[f.key] = r[f.key] ?? f.options?.[0]?.value ?? "";
  }
  return v;
}

function denormalize(tab: TabDef, v: any) {
  const out: any = { ...v };
  for (const f of tab.fields) {
    if (f.type === "lines") out[f.key] = String(v[f.key] || "").split("\n").map((s) => s.trim()).filter(Boolean);
    if (f.type === "tags") out[f.key] = String(v[f.key] || "").split(",").map((s) => s.trim()).filter(Boolean);
  }
  return out;
}
