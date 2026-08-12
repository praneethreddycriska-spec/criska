"use client";

import { useState } from "react";
import { ApplyModal } from "./apply-modal";
import type { Job } from "@/lib/data";

const HR_EMAIL = "info2@criska.in";

function gmailCompose(subject: string, body: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${HR_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function CareersRoles({ jobs, ctaNote }: { jobs: Job[]; ctaNote: string }) {
  const [active, setActive] = useState<Job | null>(null);
  const open = jobs.filter((j) => j.isOpen);

  return (
    <div className="mt-16">
      <div className="eyebrow">Open Positions</div>
      <h2 className="font-display mt-3 text-[30px] leading-tight sm:text-[38px]">Current openings</h2>

      <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-border">
        {open.length === 0 && (
          <div className="bg-surface px-6 py-10 text-center text-[15px] text-muted">
            No open roles right now — but we&apos;d still love to hear from you.
          </div>
        )}
        {open.map((r, i) => (
          <div
            key={r.id}
            className={`flex flex-col gap-4 bg-surface px-6 py-6 sm:flex-row sm:items-start sm:justify-between ${i > 0 ? "border-t border-border" : ""}`}
          >
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-[22px] leading-tight">{r.title}</h3>
                {r.department && (
                  <span className="rounded-full bg-panel px-2.5 py-1 text-[11.5px] text-muted">{r.department}</span>
                )}
              </div>
              <div className="mt-1 text-[13.5px] text-muted">
                {[r.type, r.location].filter(Boolean).join(" · ")}
              </div>
              {r.description && <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{r.description}</p>}
            </div>

            <div className="shrink-0">
              {r.applyUrl ? (
                <a
                  href={r.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill btn-ghost whitespace-nowrap"
                >
                  Apply →
                </a>
              ) : (
                <button
                  onClick={() => setActive(r)}
                  className="btn-pill btn-ghost whitespace-nowrap"
                >
                  Apply →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[var(--radius)] bg-panel p-8 text-center">
        <p className="text-[16px] text-foreground">{ctaNote}</p>
        <button
          type="button"
          onClick={() => {
            const subject = "Resume Submission — Criska";
            const body =
              "Hi Criska team,\n\nI'd like to submit my resume for future opportunities. Please find it attached.\n\nName:\nRole of interest:\nTechnical skills:\n\nThanks,";
            const gmail = gmailCompose(subject, body);
            const win = window.open(gmail, "_blank", "noopener,noreferrer");
            // If the browser blocked the new tab (or no Gmail), fall back to the default mail app.
            if (!win) {
              window.location.href = `mailto:${HR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }
          }}
          className="btn-pill btn-primary mt-5"
        >
          Send us your resume
        </button>
        <p className="mt-4 text-[13.5px] text-muted">
          Prefer your own mail app? Email us at{" "}
          <a href={`mailto:${HR_EMAIL}`} className="text-foreground underline underline-offset-2 hover:text-accent">
            {HR_EMAIL}
          </a>
        </p>
      </div>

      {active && <ApplyModal job={active} onClose={() => setActive(null)} />}
    </div>
  );
}
