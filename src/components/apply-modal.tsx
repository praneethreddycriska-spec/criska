"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export type ApplyJob = { id: string; title: string };

const NOTICE = ["Immediate", "15 Days", "30 Days", "60 Days", "90+ Days"];
const STEPS = ["Contact Info", "Screening Qs", "Technical Skills"];

const HR_EMAIL = "hr@criskasecurity.com";

export function ApplyModal({ job, onClose }: { job: ApplyJob; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    current_company: "",
    linkedin: "",
    experience_years: "",
    notice_period: "",
    project_summary: "",
    technical_skills: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const step1Valid = form.full_name.trim() && /\S+@\S+\.\S+/.test(form.email);
  const step2Valid = form.experience_years.trim() && form.notice_period && form.project_summary.trim();
  const step3Valid = form.technical_skills.trim();

  async function submit() {
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id.length > 20 ? job.id : null,
          job_title: job.title,
          ...form,
          technical_skills: form.technical_skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (json.fallback) {
        // DB not set up — fall back to email
        window.location.href = mailtoFallback(job.title, form);
        return;
      }
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setDone(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[20px] border border-border bg-surface p-7 shadow-2xl md:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 grid h-8 w-8 place-items-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {done ? (
          <div className="py-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 className="font-display mt-5 text-[28px]">Application received!</h3>
            <p className="mt-2 text-[15px] text-muted">
              Thanks, {form.full_name.split(" ")[0] || "there"} — the Criska talent team will review your application and get back to you.
            </p>
            <button onClick={onClose} className="btn-pill btn-primary mt-7">Done</button>
          </div>
        ) : (
          <>
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-faint">Apply for position</div>
            <h2 className="font-display mt-1 text-[26px] leading-tight">{job.title}</h2>

            {/* Step pills */}
            <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-6">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                    i === step
                      ? "bg-ink text-on-ink"
                      : i < step
                      ? "bg-panel text-foreground"
                      : "bg-panel text-faint"
                  }`}
                >
                  {i + 1}. {s}
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="mt-7 space-y-5"
              >
                {step === 0 && (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full Name" req value={form.full_name} onChange={(v) => set("full_name", v)} />
                      <Field label="Email Address" req type="email" value={form.email} onChange={(v) => set("email", v)} />
                      <Field label="Phone Number" type="tel" value={form.phone} onChange={(v) => set("phone", v)} />
                      <Field label="Current Company" value={form.current_company} onChange={(v) => set("current_company", v)} />
                    </div>
                    <Field label="LinkedIn / Portfolio URL" value={form.linkedin} onChange={(v) => set("linkedin", v)} />
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field
                      label="Years of relevant professional experience?"
                      req
                      type="number"
                      value={form.experience_years}
                      onChange={(v) => set("experience_years", v)}
                    />
                    <div>
                      <Lbl req>What is your notice period / availability?</Lbl>
                      <select
                        value={form.notice_period}
                        onChange={(e) => set("notice_period", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:border-foreground"
                      >
                        <option value="" disabled>Select…</option>
                        {NOTICE.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <Lbl req>Briefly describe a relevant project you brought to production.</Lbl>
                      <textarea
                        rows={3}
                        value={form.project_summary}
                        onChange={(e) => set("project_summary", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:border-foreground"
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div>
                    <Lbl req>Technical skills</Lbl>
                    <p className="mt-1 text-[13px] text-muted">Separate each skill with a comma (e.g. Python, PyTorch, AWS, Docker, SQL).</p>
                    <textarea
                      rows={4}
                      value={form.technical_skills}
                      onChange={(e) => set("technical_skills", e.target.value)}
                      placeholder="Python, PyTorch, LangChain, AWS, Docker, Kubernetes, SQL…"
                      className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:border-foreground"
                    />
                    {form.technical_skills.trim() && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {form.technical_skills.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
                          <span key={i} className="rounded-full bg-panel px-2.5 py-1 text-[12px] text-foreground">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {err && <p className="mt-4 text-[14px]" style={{ color: "#c0564f" }}>{err}</p>}

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <button
                onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
                className="btn-pill btn-ghost"
              >
                {step === 0 ? "Cancel" : "Back"}
              </button>
              {step < 2 ? (
                <button
                  disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
                  onClick={() => setStep(step + 1)}
                  className="btn-pill btn-primary disabled:opacity-40"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  disabled={!step3Valid || sending}
                  onClick={submit}
                  className="btn-pill btn-primary disabled:opacity-40"
                >
                  {sending ? "Submitting…" : "Submit Application"}
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function mailtoFallback(title: string, f: Record<string, string>) {
  const body = `Position: ${title}%0D%0AName: ${f.full_name}%0D%0AEmail: ${f.email}%0D%0APhone: ${f.phone}%0D%0ACurrent Company: ${f.current_company}%0D%0ALinkedIn: ${f.linkedin}%0D%0AExperience: ${f.experience_years}%0D%0ANotice: ${f.notice_period}%0D%0AProject: ${f.project_summary}%0D%0ASkills: ${f.technical_skills}`;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${HR_EMAIL}&su=${encodeURIComponent("Application: " + title)}&body=${body}`;
}

function Lbl({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="text-[13px] font-medium text-foreground">
      {children} {req && <span style={{ color: "#c0564f" }}>*</span>}
    </label>
  );
}

function Field({
  label, value, onChange, type = "text", req = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; req?: boolean;
}) {
  return (
    <div>
      <Lbl req={req}>{label}</Lbl>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-paper px-4 py-3 text-[15px] text-foreground outline-none focus:border-foreground"
      />
    </div>
  );
}
