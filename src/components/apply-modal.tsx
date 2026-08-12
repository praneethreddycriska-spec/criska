"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JobPosting, JobApplication } from "@/types/ats";
import { createApplication } from "@/lib/supabase";
import { parseResumeData } from "@/lib/resume-parser";
import { cleanText, isBlank, validateLead, type FieldErrors } from "@/lib/validation";
import { PhoneField, toE164 } from "@/components/phone-field";

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
  const [phoneCountry, setPhoneCountry] = useState("IN");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [technicalSkills, setTechnicalSkills] = useState("");
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const clearError = (k: string) => setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));

  if (!isOpen || !job) return null;

  // Validate the contact step before advancing (name, email, phone required).
  const goToScreening = () => {
    const e164 = toE164(phoneCountry, phone);
    const errs = validateLead({ full_name: fullName, email, phone: e164 });
    if (isBlank(phone)) errs.phone = "Please enter your phone number.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

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

  const handleAnswerChange = (questionId: string, value: string) => {
    setScreeningAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = technicalSkills.split(",").map((s) => s.trim()).filter(Boolean);
    if (skills.length === 0) {
      setFileError("Please list at least one technical skill to complete your application.");
      return;
    }

    setLoading(true);

    try {
      const parsedResume = parseResumeData(fullName, skills.join(" "), screeningAnswers);

      const newApp = await createApplication(fullJob, {
        fullName: cleanText(fullName),
        email: cleanText(email).toLowerCase(),
        phone: toE164(phoneCountry, phone),
        linkedinUrl: cleanText(linkedinUrl),
        portfolioUrl: cleanText(portfolioUrl),
        technicalSkills: skills,
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
    setPhoneCountry("IN");
    setLinkedinUrl("");
    setPortfolioUrl("");
    setScreeningAnswers({});
    setTechnicalSkills("");
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
                  Thank you for applying to <strong className="text-foreground">{job.title}</strong> at Criska. Your application has been submitted successfully and our talent acquisition team will review your profile.
                </p>

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
                      3. Technical Skills
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
                        value={fullName}
                        aria-invalid={!!errors.full_name}
                        onChange={(e) => { setFullName(e.target.value); clearError("full_name"); }}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full rounded-xl border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 ${errors.full_name ? "border-[#c0564f] focus:ring-[#c0564f]/30" : "border-border focus:ring-accent/30"}`}
                      />
                      {errors.full_name && <p className="mt-1 text-[12.5px]" style={{ color: "#c0564f" }}>{errors.full_name}</p>}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          aria-invalid={!!errors.email}
                          onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                          placeholder="alex@example.com"
                          className={`w-full rounded-xl border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 ${errors.email ? "border-[#c0564f] focus:ring-[#c0564f]/30" : "border-border focus:ring-accent/30"}`}
                        />
                        {errors.email && <p className="mt-1 text-[12.5px]" style={{ color: "#c0564f" }}>{errors.email}</p>}
                      </div>
                      <PhoneField
                        label="Phone Number"
                        required
                        labelClass="block text-[12.5px] uppercase tracking-[0.12em] text-faint"
                        country={phoneCountry}
                        onCountryChange={setPhoneCountry}
                        value={phone}
                        onChange={(v) => { setPhone(v); clearError("phone"); }}
                        error={errors.phone}
                      />
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

                {/* Step 3: Technical Skills */}
                {step === 3 && (
                  <div className="space-y-3">
                    <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                      Technical Skills <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[13px] text-muted">
                      List your key technical skills, separated by commas (e.g. Python, PyTorch, LangChain, AWS, Docker, SQL).
                    </p>
                    <textarea
                      rows={4}
                      value={technicalSkills}
                      onChange={(e) => setTechnicalSkills(e.target.value)}
                      placeholder="Python, PyTorch, LangChain, AWS, Docker, Kubernetes, SQL…"
                      className="w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                    />
                    {technicalSkills.trim() && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {technicalSkills.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
                          <span key={i} className="rounded-full bg-panel px-2.5 py-1 text-[12px] text-foreground">{s}</span>
                        ))}
                      </div>
                    )}
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
                      onClick={() => (step === 1 ? goToScreening() : setStep((s) => (s + 1) as 1 | 2 | 3))}
                      className="btn-pill btn-primary text-[14px] disabled:opacity-50"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !technicalSkills.trim()}
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
