"use client";

import { useState } from "react";

/**
 * Multi-image input for events. Holds an ordered array of image URLs: upload one
 * or several files (Cloudinary via /api/upload), paste a URL, reorder, or remove.
 * The first image is used as the card's primary/cover.
 */
export function MultiImageInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const urls = Array.isArray(value) ? value : [];
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [urlDraft, setUrlDraft] = useState("");

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setErr("");
    const added: string[] = [];
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Upload failed");
        added.push(j.url);
      }
      onChange([...urls, ...added]);
    } catch (e) {
      if (added.length) onChange([...urls, ...added]);
      setErr((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const addUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    onChange([...urls, u]);
    setUrlDraft("");
  };
  const removeAt = (i: number) => onChange(urls.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= urls.length) return;
    const next = [...urls];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="rounded-lg border border-border bg-paper p-3">
      {urls.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((u, i) => (
            <div key={`${u}-${i}`} className="group relative overflow-hidden rounded-lg border border-border bg-panel">
              <div className="aspect-[4/3] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" className="h-full w-full object-cover" />
              </div>
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-on-ink">Cover</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/55 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button type="button" aria-label="Move left" onClick={() => move(i, -1)} disabled={i === 0} className="rounded bg-white/15 px-1.5 text-[12px] text-white disabled:opacity-30">←</button>
                  <button type="button" aria-label="Move right" onClick={() => move(i, 1)} disabled={i === urls.length - 1} className="rounded bg-white/15 px-1.5 text-[12px] text-white disabled:opacity-30">→</button>
                </div>
                <button type="button" aria-label="Remove" onClick={() => removeAt(i)} className="rounded bg-white/15 px-1.5 text-[12px] text-white">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground transition-colors hover:bg-panel">
          {uploading ? "Uploading…" : "Upload image(s)"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={uploading} />
        </label>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="url"
            placeholder="…or paste an image URL"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
            className="min-w-0 flex-1 rounded-lg border border-border bg-paper px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground"
          />
          <button type="button" onClick={addUrl} className="rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground hover:bg-panel">Add</button>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-muted">{urls.length} image{urls.length === 1 ? "" : "s"} · first is the cover · drag order with ← →</p>
      {err && <p className="mt-1.5 text-[12.5px]" style={{ color: "#c0564f" }}>{err}</p>}
    </div>
  );
}
