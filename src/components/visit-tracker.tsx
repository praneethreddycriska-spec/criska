"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fires one visit ping per browser session (real, deduped per session). */
export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    // Don't count admin views as visitor traffic.
    if (pathname?.startsWith("/admin")) return;
    try {
      if (sessionStorage.getItem("criska_visit_tracked")) return;
      sessionStorage.setItem("criska_visit_tracked", "1");
    } catch {
      /* ignore */
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname || "/" }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
