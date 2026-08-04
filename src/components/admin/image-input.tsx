"use client";

import { useState } from "react";

export function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Upload failed");
      onChange(j.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-panel">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-faint">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <input
            type="url"
            placeholder="Paste an image URL…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-paper px-3 py-2 text-[14px] text-foreground outline-none focus:border-foreground"
          />
          <div className="mt-2 flex items-center gap-3">
            <label className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground transition-colors hover:bg-panel">
              {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
            </label>
            {value && (
              <button type="button" onClick={() => onChange("")} className="text-[13px] text-muted hover:text-foreground">
                Remove
              </button>
            )}
          </div>
          {err && <p className="mt-1.5 text-[12.5px]" style={{ color: "#c0564f" }}>{err}</p>}
        </div>
      </div>
    </div>
  );
}
