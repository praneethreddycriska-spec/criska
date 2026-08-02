"use client";

import { useState } from "react";
import { JobApplication, ApplicationStatus, ScheduledInterview } from "@/types/ats";
import { printCandidateDossier } from "@/lib/export-utils";
import { InterviewScheduler } from "./interview-scheduler";
import { EmailWorkflowModal } from "./email-workflow-modal";
import { ShareLinkModal } from "./share-link-modal";

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

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!isOpen || !application) return null;

  const handleNotesSave = () => {
    onUpdateNotes(application.id, notes);
  };

  const handleScheduleSuccess = (interview: ScheduledInterview) => {
    onUpdateStatus(application.id, "interviewing");
    const updatedNotes = `${notes}\n\n[Scheduled ${interview.interviewType} on ${interview.date} at ${interview.time}]`;
    setNotes(updatedNotes);
    onUpdateNotes(application.id, updatedNotes);
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
    <>
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

          {/* Quick Action Toolbar */}
          <div className="border-b border-border bg-panel px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="btn-pill btn-ghost !px-3 !py-1 text-[12.5px] bg-paper"
              >
                📅 Schedule Interview
              </button>
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="btn-pill btn-ghost !px-3 !py-1 text-[12.5px] bg-paper"
              >
                ✉️ Email Workflows & Offer
              </button>
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="btn-pill btn-ghost !px-3 !py-1 text-[12.5px] bg-paper"
              >
                🔗 Client Share Link
              </button>
            </div>
            <button
              type="button"
              onClick={() => printCandidateDossier(application)}
              className="text-accent hover:underline font-medium text-[12.5px]"
            >
              🖨️ Print PDF Dossier
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
                  Applied: {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleNotesSave}
                  className="btn-pill btn-primary !px-4 !py-1.5 text-[13px]"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      <InterviewScheduler
        application={application}
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onScheduleSuccess={handleScheduleSuccess}
      />

      <EmailWorkflowModal
        application={application}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />

      <ShareLinkModal
        application={application}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
}
