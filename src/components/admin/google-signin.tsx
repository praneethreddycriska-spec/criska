"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* Minimal typing for Google Identity Services. */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const btnRef = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID || !btnRef.current) return;

    const handleCredential = async (resp: { credential: string }) => {
      setBusy(true);
      setErr("");
      try {
        const r = await fetch("/api/admin/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: resp.credential }),
        });
        const j = await r.json().catch(() => ({}));
        if (r.ok) {
          router.push(params.get("from") || "/admin");
          router.refresh();
        } else {
          setErr(j.error || "This account is not authorized.");
          setBusy(false);
        }
      } catch {
        setErr("Sign-in failed. Try again.");
        setBusy(false);
      }
    };

    const render = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
        shape: "pill",
      });
    };

    if (window.google) {
      render();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    }
  }, [router, params]);

  if (!CLIENT_ID) return null;

  return (
    <div className="flex flex-col items-center">
      <div ref={btnRef} className={busy ? "pointer-events-none opacity-60" : ""} />
      {busy && <p className="mt-3 text-[13px] text-muted">Verifying your account…</p>}
      {err && <p className="mt-3 text-center text-[13.5px]" style={{ color: "#c0564f" }}>{err}</p>}
    </div>
  );
}

export const GOOGLE_SIGNIN_ENABLED = !!CLIENT_ID;
