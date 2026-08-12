"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CKMark } from "@/components/logo";
import { PasswordInput } from "@/components/password-input";
import { GoogleSignIn, GOOGLE_SIGNIN_ENABLED } from "@/components/admin/google-signin";
import { safeAdminRedirect } from "@/lib/safe-path";

/** Google-only sign in — the sole method once a Google Client ID is configured. */
function GoogleOnly() {
  return (
    <div className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-surface p-8 shadow-[0_30px_80px_-50px_rgba(10,22,34,0.4)]">
      <div className="flex items-center gap-2.5 text-foreground">
        <CKMark className="h-8 w-auto" />
        <span className="text-lg font-semibold uppercase tracking-[0.2em]">Criska</span>
      </div>
      <h1 className="font-display mt-6 text-[26px]">Admin sign in</h1>
      <p className="mt-1 text-[14px] text-muted">
        Sign in with an authorized Google account. Access is restricted — any other
        account is rejected automatically.
      </p>
      <div className="mt-7 flex justify-center">
        <GoogleSignIn />
      </div>
    </div>
  );
}

/** Password fallback — only used when Google sign-in is not configured. */
function PasswordLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.allowed) setStep("password");
      else setErr(j.error || "This email is not authorized.");
    } catch {
      setErr("Could not verify email. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(safeAdminRedirect(params.get("from")));
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={step === "email" ? checkEmail : submit}
      className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-surface p-8 shadow-[0_30px_80px_-50px_rgba(10,22,34,0.4)]"
    >
      <div className="flex items-center gap-2.5 text-foreground">
        <CKMark className="h-8 w-auto" />
        <span className="text-lg font-semibold uppercase tracking-[0.2em]">Criska</span>
      </div>
      <h1 className="font-display mt-6 text-[26px]">Admin sign in</h1>
      <p className="mt-1 text-[14px] text-muted">
        {step === "email"
          ? "Enter your authorized admin email to continue."
          : "Enter the admin password to continue."}
      </p>

      {step === "email" ? (
        <>
          <label className="mt-6 block text-[12.5px] uppercase tracking-[0.12em] text-faint">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:border-foreground"
          />
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[13px] text-muted">{email}</span>
            <button
              type="button"
              onClick={() => { setStep("email"); setErr(""); setPassword(""); }}
              className="text-[12.5px] text-accent underline underline-offset-2"
            >
              Change
            </button>
          </div>
          <label className="mt-4 block text-[12.5px] uppercase tracking-[0.12em] text-faint">Password</label>
          <div className="mt-2">
            <PasswordInput
              value={password}
              onChange={setPassword}
              autoFocus
              className="w-full rounded-xl border border-border bg-paper px-4 py-3 pr-11 text-[15px] text-foreground outline-none focus:border-foreground"
            />
          </div>
        </>
      )}

      {err && <p className="mt-3 text-[13.5px]" style={{ color: "#c0564f" }}>{err}</p>}
      <button type="submit" disabled={loading} className="btn-pill btn-primary mt-6 w-full disabled:opacity-50">
        {loading ? (step === "email" ? "Checking…" : "Signing in…") : step === "email" ? "Continue" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <Suspense fallback={<div className="text-muted text-[14px]">Loading...</div>}>
        {GOOGLE_SIGNIN_ENABLED ? <GoogleOnly /> : <PasswordLogin />}
      </Suspense>
    </div>
  );
}
