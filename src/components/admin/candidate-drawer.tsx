"use client";

import { useState } from "react";
import { JobApplication, ApplicationStatus } from "@/types/ats";

export function CandidateDrawer({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
}: {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState(application?.adminNotes || "");
  const [showEmailDraft, setShowEmailDraft] = useState(false);

  if (!isOpen || !application) return null;

  const handleNotesSave = () => {
    onUpdateNotes(application.id, notes);
  };

  const statusColors: Record<ApplicationStatus, string> = {
    new: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    under_review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    shortlisted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    interviewing: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    hired: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      {/* Slide-over Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-surface border-l border-border h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/90 px-6 py-4 backdrop-blur-md">
          <div>
            <span className="eyebrow">Candidate Profile & ATS Breakdown</span>
            <h2 className="font-display text-[24px] leading-tight text-foreground">{application.fullName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:bg-panel hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Status & ATS Score Card */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* ATS Match Score */}
            <div className="rounded-2xl border border-border bg-panel p-5 text-center">
              <span className="text-[12px] uppercase tracking-[0.14em] text-faint">Automated ATS Score</span>
              <div className="font-display mt-1 text-[44px] leading-none text-foreground tabular-nums">
                {application.atsScore}%
              </div>
              <span className="mt-2 inline-block rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent">
                {application.atsAnalysis?.recommendation || "Evaluated Candidate"}
              </span>
            </div>

            {/* Application Pipeline Status */}
            <div className="rounded-2xl border border-border bg-panel p-5 flex flex-col justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-[0.14em] text-faint">Pipeline Status</span>
                <div className="mt-2">
                  <select
                    value={application.status}
                    onChange={(e) => onUpdateStatus(application.id, e.target.value as ApplicationStatus)}
                    className={`w-full rounded-xl border px-3 py-2 text-[14px] font-medium outline-none transition ${
                      statusColors[application.status]
                    }`}
                  >
                    <option value="new">🆕 New</option>
                    <option value="under_review">🔍 Under Review</option>
                    <option value="shortlisted">⭐ Shortlisted</option>
                    <option value="interviewing">🗣️ Interviewing</option>
                    <option value="hired">✅ Hired</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 text-[12px] text-faint">
                Applied on: {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-[12.5px] uppercase tracking-[0.14em] text-faint mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-[14px]">
              <div>
                <span className="text-muted block text-[12px]">Email:</span>
                <a href={`mailto:${application.email}`} className="text-foreground hover:underline font-medium">{application.email}</a>
              </div>
              <div>
                <span className="text-muted block text-[12px]">Phone:</span>
                <a href={`tel:${application.phone}`} className="text-foreground hover:underline font-medium">{application.phone}</a>
              </div>
              {application.linkedinUrl && (
                <div>
                  <span className="text-muted block text-[12px]">LinkedIn:</span>
                  <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">View LinkedIn Profile ↗</a>
                </div>
              )}
              {application.portfolioUrl && (
                <div>
                  <span className="text-muted block text-[12px]">Portfolio / GitHub:</span>
                  <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">View Portfolio ↗</a>
                </div>
              )}
            </div>

            {/* Resume Download Action */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[13px] text-muted truncate">Attachment: {application.resumeFilename}</span>
              <a
                href={application.resumeUrl}
                download={application.resumeFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-primary !px-4 !py-2 text-[13px]"
              >
                📥 View / Download Resume
              </a>
            </div>
          </div>

          {/* ATS Analysis Breakdown */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <h3 className="text-[12.5px] uppercase tracking-[0.14em] text-faint">ATS Match Breakdown</h3>

            <p className="text-[14.5px] leading-relaxed text-muted bg-panel p-3.5 rounded-xl border border-border">
              {application.atsAnalysis?.matchSummary || "Analysis pending."}
            </p>

            {/* Matched & Missing Skills */}
            <div className="space-y-3">
              <div>
                <span className="text-[12px] font-medium text-foreground block mb-2">Skills & Requirements Matched:</span>
                <div className="flex flex-wrap gap-1.5">
                  {application.atsAnalysis?.skillsMatched?.length ? (
                    application.atsAnalysis.skillsMatched.map((s) => (
                      <span key={s} className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1 text-[12px]">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[12px] text-muted italic">No explicit requirement matches found.</span>
                  )}
                </div>
              </div>

              {application.atsAnalysis?.skillsMissing && application.atsAnalysis.skillsMissing.length > 0 && (
                <div>
                  <span className="text-[12px] font-medium text-foreground block mb-2">Requirements Unmatched / Missing:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {application.atsAnalysis.skillsMissing.map((s) => (
                      <span key={s} className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 px-3 py-1 text-[12px]">
                        ! {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Strengths & Red Flags */}
            {(application.atsAnalysis?.strengths?.length || application.atsAnalysis?.redFlags?.length) ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                {application.atsAnalysis?.strengths?.length > 0 && (
                  <div className="rounded-xl bg-panel p-3 border border-border">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-emerald-500 font-semibold block mb-1">Key Strengths</span>
                    <ul className="text-[12.5px] text-muted space-y-1">
                      {application.atsAnalysis.strengths.map((str, idx) => (
                        <li key={idx}>• {str}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {application.atsAnalysis?.redFlags?.length > 0 && (
                  <div className="rounded-xl bg-panel p-3 border border-border">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-red-500 font-semibold block mb-1">Evaluation Flags</span>
                    <ul className="text-[12.5px] text-muted space-y-1">
                      {application.atsAnalysis.redFlags.map((flag, idx) => (
                        <li key={idx}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Screening Answers */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-[12.5px] uppercase tracking-[0.14em] text-faint mb-3">Screening Questions & Responses</h3>
            {Object.keys(application.screeningAnswers || {}).length === 0 ? (
              <p className="text-[13.5px] text-muted italic">No screening question responses submitted.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(application.screeningAnswers).map(([qKey, ans]) => (
                  <div key={qKey} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="text-[12.5px] font-medium text-foreground block">{qKey}:</span>
                    <span className="text-[13.5px] text-muted block mt-0.5">{ans}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Evaluation Notes */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-[12.5px] uppercase tracking-[0.14em] text-faint mb-2">Internal Admin Notes</h3>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview feedback, salary negotiation notes, or evaluation comments…"
              className="w-full rounded-xl border border-border bg-paper p-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
            />
            <div className="mt-3 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowEmailDraft((prev) => !prev)}
                className="text-[13px] text-accent hover:underline font-medium"
              >
                ✉️ {showEmailDraft ? "Hide Email Draft" : "Generate Candidate Response Draft"}
              </button>
              <button
                type="button"
                onClick={handleNotesSave}
                className="btn-pill btn-primary !px-4 !py-1.5 text-[13px]"
              >
                Save Notes
              </button>
            </div>

            {/* Email Draft Modal / Preview */}
            {showEmailDraft && (
              <div className="mt-4 rounded-xl border border-border bg-panel p-4 text-[13px] space-y-2">
                <span className="font-medium text-foreground block">Email Draft ({application.status.toUpperCase()}):</span>
                <div className="bg-paper p-3 rounded-lg border border-border text-muted font-mono whitespace-pre-wrap">
                  {`Subject: Update regarding your application at Criska - ${application.jobTitle}\n\nHi ${application.fullName},\n\nThank you for taking the time to apply for the ${application.jobTitle} position at Criska Business Consulting.\n\nWe have reviewed your profile and ATS alignment score. ${
                    application.status === "shortlisted" || application.status === "interviewing"
                      ? "We are impressed by your background and would like to invite you for an initial interview."
                      : "We appreciate your interest in Criska and will keep your resume on file for upcoming opportunities."
                  }\n\nBest regards,\nCriska Talent Acquisition Team`}
                </div>
                <a
                  href={`mailto:${application.email}?subject=${encodeURIComponent(
                    `Criska Application Update: ${application.jobTitle}`
                  )}`}
                  className="inline-block text-accent hover:underline font-medium"
                >
                  Send via Default Email Client →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
