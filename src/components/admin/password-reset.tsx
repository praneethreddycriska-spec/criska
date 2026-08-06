"use client";

import { useState } from "react";

export function AdminPasswordReset() {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) return setMsg({ ok: false, text: "New passwords don't match." });
    if (next.length < 8) return setMsg({ ok: false, text: "New password must be at least 8 characters." });
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: cur, newPassword: next }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Failed to update password.");
      setMsg({ ok: true, text: "Password updated. Use it next time you sign in." });
      setCur(""); setNext(""); setConfirm("");
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-border bg-surface px-4 py-2.5 text-[13px] font-medium text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] hover:bg-panel"
      >
        🔑 Reset password
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form
            onSubmit={submit}
            className="relative z-10 w-full max-w-sm rounded-[var(--radius)] border border-border bg-surface p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[22px]">Reset admin password</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted hover:text-foreground">✕</button>
            </div>
            <p className="mt-1 text-[13px] text-muted">Saved securely to the database — used the next time anyone signs in.</p>

            <label className="mt-5 block text-[12px] uppercase tracking-[0.12em] text-faint">Current password</label>
            <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} required
              className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-foreground" />

            <label className="mt-4 block text-[12px] uppercase tracking-[0.12em] text-faint">New password (min 8)</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required
              className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-foreground" />

            <label className="mt-4 block text-[12px] uppercase tracking-[0.12em] text-faint">Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
              className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-[15px] text-foreground outline-none focus:border-foreground" />

            {msg && (
              <p className="mt-3 text-[13.5px]" style={{ color: msg.ok ? "#3e9c7c" : "#c0564f" }}>{msg.text}</p>
            )}

            <button type="submit" disabled={busy} className="btn-pill btn-primary mt-6 w-full disabled:opacity-50">
              {busy ? "Saving…" : "Update password"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
