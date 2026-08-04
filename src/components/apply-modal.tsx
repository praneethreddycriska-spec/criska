"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JobPosting, JobApplication } from "@/types/ats";
import { createApplication } from "@/lib/supabase";
import { parseResumeData } from "@/lib/resume-parser";

export type ApplyJob = { id: string; title: string };

export function ApplyModal({
  job,
  isOpen = true,
  onClose,
}: {
  job: JobPosting | ApplyJob | null;
  isOpen?: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  if (!isOpen || !job) return null;

  const fullJob: JobPosting = (job && "department" in job) ? (job as JobPosting) : {
    id: job?.id || "",
    title: job?.title || "",
    department: "Engineering",
    type: "Full-time",
    location: "Remote / Hybrid",
    description: "Job opportunity at Criska.",
    requirements: ["Relevant experience"],
    screeningQuestions: [],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setFileError("Please upload a PDF or DOC/DOCX document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10MB limit.");
      return;
    }

    setFileError("");
    setResumeFile(file);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setScreeningAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setFileError("Please attach your resume to complete your application.");
      return;
    }

    setLoading(true);

    try {
      const fakeObjectUrl = URL.createObjectURL(resumeFile);
      const parsedResume = parseResumeData(fullName, resumeFile.name, screeningAnswers);

      const newApp = await createApplication(fullJob, {
        fullName,
        email,
        phone,
        linkedinUrl,
        portfolioUrl,
        resumeUrl: fakeObjectUrl,
        resumeFilename: resumeFile.name,
        screeningAnswers,
      });

      newApp.parsedResume = parsedResume;

      setSubmittedApp(newApp);
      setStep(4);
    } catch (err) {
      console.error("Submission failed:", err);
      setFileError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setLinkedinUrl("");
    setPortfolioUrl("");
    setScreeningAnswers({});
    setResumeFile(null);
    setFileError("");
    setSubmittedApp(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <span className="eyebrow">Apply for Position</span>
              <h2 className="font-display text-[22px] leading-tight text-foreground">{job.title}</h2>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:bg-panel hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8">
            {step === 4 && submittedApp ? (
              <div className="text-center py-6">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-display mt-5 text-[28px]">Application Received</h3>
                <p className="mt-2 text-[15px] text-muted max-w-md mx-auto">
                  Thank you for applying to <strong className="text-foreground">{job.title}</strong> at Criska. Your profile has been scanned and filed in our ATS.
                </p>

                {/* Score & Match badge */}
                <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-border bg-panel p-4 px-6">
                  <span className="text-[12px] uppercase tracking-[0.14em] text-faint">Automated ATS Score Match</span>
                  <div className="font-display mt-1 text-[36px] text-foreground tabular-nums">
                    {submittedApp.atsScore}%
                  </div>
                  <span className="mt-1 rounded-full bg-accent-soft px-3 py-1 text-[12px] font-medium text-accent">
                    {submittedApp.atsAnalysis.recommendation}
                  </span>
                </div>

                <div className="mt-8 flex justify-center">
                  <button type="button" onClick={resetAndClose} className="btn-pill btn-primary">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Progress Indicators */}
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                  <div className="flex gap-2 text-[13px]">
                    <span className={`px-3 py-1 rounded-full font-medium ${step === 1 ? "bg-ink text-on-ink" : "bg-panel text-muted"}`}>
                      1. Contact Info
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium ${step === 2 ? "bg-ink text-on-ink" : "bg-panel text-muted"}`}>
                      2. Screening Qs
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium ${step === 3 ? "bg-ink text-on-ink" : "bg-panel text-muted"}`}>
                      3. Resume Upload
                    </span>
                  </div>
                </div>

                {/* Step 1: Contact Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                          Portfolio / GitHub URL
                        </label>
                        <input
                          type="url"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Screening Questions */}
                {step === 2 && (
                  <div className="space-y-5">
                    {fullJob.screeningQuestions.length === 0 ? (
                      <p className="text-muted text-[15px] italic py-4">No additional screening questions for this position.</p>
                    ) : (
                      fullJob.screeningQuestions.map((q) => (
                        <div key={q.id}>
                          <label className="block text-[13.5px] font-medium text-foreground mb-1.5">
                            {q.question} {q.required && <span className="text-red-500">*</span>}
                          </label>
                          {q.type === "select" ? (
                            <select
                              required={q.required}
                              value={screeningAnswers[q.id] || ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                            >
                              <option value="" disabled>Select option…</option>
                              {q.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={q.type === "number" ? "number" : "text"}
                              required={q.required}
                              value={screeningAnswers[q.id] || ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              placeholder="Your response…"
                              className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Step 3: Resume Upload */}
                {step === 3 && (
                  <div className="space-y-4">
                    <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                      Upload Resume (PDF, DOCX · Max 10MB) <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-paper hover:border-accent transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload-input"
                      />
                      <label htmlFor="resume-upload-input" className="cursor-pointer flex flex-col items-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-panel text-accent mb-3">
                          📄
                        </div>
                        {resumeFile ? (
                          <div>
                            <span className="font-medium text-[15px] text-foreground block">{resumeFile.name}</span>
                            <span className="text-[13px] text-muted">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Change file</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-medium text-[15px] text-foreground block">Click to select or drag resume file</span>
                            <span className="text-[13px] text-muted">Supports PDF, DOC, DOCX up to 10MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                    {fileError && <p className="text-red-500 text-[13px] mt-1">{fileError}</p>}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                      className="btn-pill btn-ghost text-[14px]"
                    >
                      Back
                    </button>
                  ) : <div />}

                  {step < 3 ? (
                    <button
                      type="button"
                      disabled={step === 1 && (!fullName || !email || !phone)}
                      onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                      className="btn-pill btn-primary text-[14px] disabled:opacity-50"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !resumeFile}
                      className="btn-pill btn-primary text-[14px] disabled:opacity-50"
                    >
                      {loading ? "Scanning & Submitting…" : "Submit Application"}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
