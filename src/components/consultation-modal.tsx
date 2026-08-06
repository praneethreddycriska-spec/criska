"use client";

import { useState } from "react";

export function ConsultationModal({
  isOpen,
  onClose,
  initialService = "AI & ML Solutions",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState(initialService);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          company,
          service_interest: service,
          preferred_date: date,
          message,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok && !json.ok) {
        throw new Error(json.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to schedule consultation");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-panel px-6 py-4">
          <div>
            <span className="eyebrow">Strategic Tech Advisory</span>
            <h3 className="font-display text-[22px] leading-tight text-foreground">
              Schedule Consultation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted hover:bg-surface hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h4 className="font-display mt-5 text-[24px]">Consultation Scheduled</h4>
              <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-muted">
                Thank you, <strong className="text-foreground">{fullName}</strong>. Our enterprise solutions architect team will review your inquiry and reach out to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="btn-pill btn-primary mt-8"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vivek Shaganti"
                    className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vivek@company.com"
                    className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Criska Enterprises"
                    className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Service / Interest Area
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cybersecurity & SOC">Cybersecurity & SOC</option>
                    <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                    <option value="Full-Stack Software Engineering">Full-Stack Software Engineering</option>
                    <option value="Data Engineering & Analytics">Data Engineering & Analytics</option>
                    <option value="IT Staffing & Talent Outsourcing">IT Staffing & Talent Outsourcing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium uppercase tracking-[0.12em] text-faint">
                  Project Brief / Details
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a brief overview of your business goals, timeline, or requirements..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-paper p-3.5 text-[14px] text-foreground outline-none focus:border-foreground"
                />
              </div>

              {errorMsg && <p className="text-[13px] text-red-500">{errorMsg}</p>}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-pill btn-ghost text-[13.5px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pill btn-primary text-[14px] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Confirm Schedule →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
