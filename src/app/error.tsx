"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for monitoring; avoids a silent white screen in production.
    if (typeof console !== "undefined") console.error(error);
  }, [error]);

  return (
    <main className="flex-1 grid place-items-center px-6 pb-28 pt-40 text-center">
      <div className="mx-auto max-w-md">
        <p className="font-display text-[64px] leading-none text-accent/90">Oops</p>
        <h1 className="font-display mt-2 text-[28px] leading-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          An unexpected error occurred while loading this page. You can try again or head back home.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="btn-pill btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-pill btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
