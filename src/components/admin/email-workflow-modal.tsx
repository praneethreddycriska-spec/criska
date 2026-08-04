"use client";

import { useState } from "react";
import { JobApplication } from "@/types/ats";

export function EmailWorkflowModal({
  application,
  isOpen,
  onClose,
}: {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [templateType, setTemplateType] = useState<"interview" | "rejection" | "offer">("offer");
  const [startDate, setStartDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10));
  const [compensation, setCompensation] = useState("₹24,00,000 per annum");
  const [reportingManager, setReportingManager] = useState("VP of Engineering");
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10));

  if (!isOpen || !application) return null;

  const generateEmailBody = () => {
    if (templateType === "offer") {
      return `OFFER OF EMPLOYMENT — CRISKA BUSINESS CONSULTING

Dear ${application.fullName},

We are delighted to extend a formal offer of employment for the position of ${application.jobTitle} at Criska Business Consulting Pvt. Ltd.

Key Terms of Offer:
- Role Title: ${application.jobTitle}
- Total Annual Compensation: ${compensation}
- Target Start Date: ${startDate}
- Reporting Manager: ${reportingManager}
- Office Location: Corporate Office, Madhapur, Hyderabad / Remote

Please review this offer and sign your acceptance by ${deadline}.

We look forward to welcoming you to the Criska team!

Best regards,
Talent Acquisition Team
Criska Business Consulting Pvt. Ltd.`;
    }

    if (templateType === "interview") {
      return `INTERVIEW INVITATION — CRISKA BUSINESS CONSULTING

Dear ${application.fullName},

Thank you for your application for the ${application.jobTitle} role at Criska. Based on your profile and ATS evaluation, we would like to invite you for a technical interview.

We will share the calendar invite link shortly. Please ensure your video and microphone are ready for the session.

Best regards,
Criska Recruitment Team`;
    }

    return `APPLICATION STATUS UPDATE — CRISKA BUSINESS CONSULTING

Dear ${application.fullName},

Thank you for applying for the ${application.jobTitle} position at Criska Business Consulting.

After reviewing your profile against our current role requirements, we have decided to pursue other candidates whose experience more closely matches our immediate needs.

We appreciate your interest in Criska and wish you every success in your career journey.

Sincerely,
Criska Talent Acquisition`;
  };

  const emailBody = generateEmailBody();

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    alert("Email text copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="fixed inset-0 bg-black/65 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <span className="eyebrow">Automated Email Workflows</span>
            <h2 className="font-display text-[22px] leading-tight text-foreground">{application.fullName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:bg-panel hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Template Switcher */}
          <div className="flex gap-2 border-b border-border pb-3">
            <button
              type="button"
              onClick={() => setTemplateType("offer")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${
                templateType === "offer" ? "bg-ink text-on-ink" : "bg-panel text-muted"
              }`}
            >
              💼 Offer Letter Draft
            </button>
            <button
              type="button"
              onClick={() => setTemplateType("interview")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${
                templateType === "interview" ? "bg-ink text-on-ink" : "bg-panel text-muted"
              }`}
            >
              🗣️ Interview Invite
            </button>
            <button
              type="button"
              onClick={() => setTemplateType("rejection")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${
                templateType === "rejection" ? "bg-ink text-on-ink" : "bg-panel text-muted"
              }`}
            >
              ✉️ Rejection Notice
            </button>
          </div>

          {/* Offer Letter Fields */}
          {templateType === "offer" && (
            <div className="grid grid-cols-2 gap-3 bg-panel p-4 rounded-xl border border-border">
              <div>
                <label className="block text-[11.5px] uppercase text-faint mb-1">Annual CTC</label>
                <input
                  type="text"
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                  className="w-full rounded-lg border border-border bg-paper px-3 py-1.5 text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase text-faint mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-paper px-3 py-1.5 text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase text-faint mb-1">Reporting Manager</label>
                <input
                  type="text"
                  value={reportingManager}
                  onChange={(e) => setReportingManager(e.target.value)}
                  className="w-full rounded-lg border border-border bg-paper px-3 py-1.5 text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase text-faint mb-1">Acceptance Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-border bg-paper px-3 py-1.5 text-[13px]"
                />
              </div>
            </div>
          )}

          {/* Generated Text Area */}
          <div>
            <label className="block text-[12px] uppercase text-faint mb-1">Generated Email Body</label>
            <textarea
              rows={8}
              readOnly
              value={emailBody}
              className="w-full rounded-xl border border-border bg-paper p-3 text-[13.5px] font-mono text-foreground outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={handleCopy} className="btn-pill btn-ghost text-[13px]">
              📋 Copy Text
            </button>
            <a
              href={`mailto:${application.email}?subject=${encodeURIComponent(
                `Criska ${templateType.toUpperCase()}: ${application.jobTitle}`
              )}&body=${encodeURIComponent(emailBody)}`}
              className="btn-pill btn-primary text-[13.5px]"
            >
              ✉️ Send via Email Client →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
