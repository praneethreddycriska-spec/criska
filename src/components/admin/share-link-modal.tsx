"use client";

import { useState } from "react";
import { JobApplication } from "@/types/ats";

export function ShareLinkModal({
  application,
  isOpen,
  onClose,
}: {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !application) return null;

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${application.id}`
    : `/share/${application.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="fixed inset-0 bg-black/65 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[var(--radius)] border border-border bg-surface p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">Client Share Link</span>
            <h3 className="font-display text-[22px] text-foreground">{application.fullName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted hover:bg-panel"
          >
            ✕
          </button>
        </div>

        <p className="text-[14px] text-muted">
          Generate a secure, view-only candidate dossier link for external clients or hiring decision makers.
        </p>

        <div className="rounded-xl border border-border bg-panel p-3">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-[13px] text-foreground font-mono outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-pill btn-primary text-[13.5px] w-full"
          >
            {copied ? "✓ Link Copied to Clipboard!" : "🔗 Copy Share Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
