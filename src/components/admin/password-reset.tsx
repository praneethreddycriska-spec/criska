"use client";

import { useEffect, useState } from "react";
import { PasswordInput } from "@/components/password-input";

export function AdminPasswordReset() {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Allowed admin emails
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [emailBusy, setEmailBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/allowed-emails")
      .then((r) => r.json())
      .then((j) => { if (Array.isArray(j.emails)) setEmails(j.emails); })
      .catch(() => {});
  }, [open]);

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

  async function saveEmails(nextList: string[]) {
    setEmailBusy(true);
    setEmailMsg(null);
    try {
      const res = await fetch("/api/admin/allowed-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: nextList }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Failed to save.");
      setEmails(j.emails || nextList);
      setEmailMsg({ ok: true, text: "Access list updated." });
    } catch (err) {
      setEmailMsg({ ok: false, text: (err as Error).message });
    } finally {
      setEmailBusy(false);
    }
  }

  function addEmail(e: React.FormEvent) {
    e.preventDefault();
    const val = newEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return setEmailMsg({ ok: false, text: "Enter a valid email." });
    if (emails.includes(val)) return setEmailMsg({ ok: false, text: "Already on the list." });
    setNewEmail("");
    saveEmails([...emails, val]);
  }

  function removeEmail(target: string) {
    if (emails.length <= 1) return setEmailMsg({ ok: false, text: "At least one admin email is required." });
    saveEmails(emails.filter((e) => e !== target));
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-border bg-surface px-4 py-2.5 text-[13px] font-medium text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] hover:bg-panel"
      >
        🔐 Admin security
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[var(--radius)] border border-border bg-surface p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[22px]">Admin security</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted hover:text-foreground">✕</button>
            </div>

            {/* Change password */}
            <form onSubmit={submit}>
              <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">Change password</h3>
              <label className="mt-4 block text-[12px] uppercase tracking-[0.12em] text-faint">Current password</label>
              <div className="mt-2"><PasswordInput value={cur} onChange={setCur} required /></div>

              <label className="mt-4 block text-[12px] uppercase tracking-[0.12em] text-faint">New password (min 8)</label>
              <div className="mt-2"><PasswordInput value={next} onChange={setNext} required /></div>

              <label className="mt-4 block text-[12px] uppercase tracking-[0.12em] text-faint">Confirm new password</label>
              <div className="mt-2"><PasswordInput value={confirm} onChange={setConfirm} required /></div>

              {msg && <p className="mt-3 text-[13.5px]" style={{ color: msg.ok ? "#3e9c7c" : "#c0564f" }}>{msg.text}</p>}
              <button type="submit" disabled={busy} className="btn-pill btn-primary mt-5 w-full disabled:opacity-50">
                {busy ? "Saving…" : "Update password"}
              </button>
            </form>

            <div className="my-6 border-t border-border" />

            {/* Allowed admin emails */}
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">Who can access admin</h3>
            <p className="mt-1 text-[12.5px] text-muted">Only these emails can sign in to the admin portal.</p>

            <ul className="mt-4 space-y-2">
              {emails.map((e) => (
                <li key={e} className="flex items-center justify-between rounded-xl border border-border bg-paper px-3.5 py-2.5">
                  <span className="text-[14px] text-foreground">{e}</span>
                  <button
                    type="button"
                    onClick={() => removeEmail(e)}
                    disabled={emailBusy}
                    className="text-[12.5px] text-muted hover:text-[#c0564f] disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {emails.length === 0 && <li className="text-[13px] text-muted">Loading…</li>}
            </ul>

            <form onSubmit={addEmail} className="mt-3 flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="add-admin@example.com"
                className="flex-1 rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
              />
              <button type="submit" disabled={emailBusy} className="btn-pill btn-ghost whitespace-nowrap disabled:opacity-50">
                Add
              </button>
            </form>
            {emailMsg && <p className="mt-3 text-[13.5px]" style={{ color: emailMsg.ok ? "#3e9c7c" : "#c0564f" }}>{emailMsg.text}</p>}
          </div>
        </div>
      )}
    </>
  );
}
