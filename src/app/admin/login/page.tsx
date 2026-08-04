"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CKMark } from "@/components/logo";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push(params.get("from") || "/admin");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-surface p-8 shadow-[0_30px_80px_-50px_rgba(10,22,34,0.4)]">
      <div className="flex items-center gap-2.5 text-foreground">
        <CKMark className="h-8 w-auto" />
        <span className="text-lg font-semibold uppercase tracking-[0.2em]">Criska</span>
      </div>
      <h1 className="font-display mt-6 text-[26px]">Admin sign in</h1>
      <p className="mt-1 text-[14px] text-muted">Enter the admin password to manage site content.</p>

      <label className="mt-6 block text-[12.5px] uppercase tracking-[0.12em] text-faint">Password</label>
      <input
        type="password"
        value={password}
        autoFocus
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:border-foreground"
      />
      {err && <p className="mt-3 text-[13.5px]" style={{ color: "#c0564f" }}>{err}</p>}
      <button type="submit" disabled={loading} className="btn-pill btn-primary mt-6 w-full disabled:opacity-50">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <Suspense fallback={<div className="text-muted text-[14px]">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
