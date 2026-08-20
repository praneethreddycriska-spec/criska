"use client";

import { useState, useEffect } from "react";
import { JobPosting, ScreeningQuestion } from "@/types/ats";
import { cleanText, isBlank } from "@/lib/validation";

export function JobModal({
  job,
  isOpen,
  onClose,
  onSave,
}: {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobPosting) => void;
}) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [type, setType] = useState("Full-time");
  const [location, setLocation] = useState("Hyderabad / Remote");
  const [description, setDescription] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [status, setStatus] = useState<"draft" | "published" | "closed">("published");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearErr = (k: string) => setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDepartment(job.department);
      setType(job.type);
      setLocation(job.location);
      setDescription(job.description);
      setRequirementsInput((job.requirements || []).join("\n"));
      setScreeningQuestions(job.screeningQuestions || []);
      setStatus(job.status);
    } else {
      setTitle("");
      setDepartment("Engineering");
      setType("Full-time");
      setLocation("Hyderabad / Remote");
      setDescription("");
      setRequirementsInput("");
      setScreeningQuestions([
        {
          id: `q-${Date.now()}-1`,
          question: "Years of professional experience in this role?",
          type: "number",
          required: true,
        },
      ]);
      setStatus("published");
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    const newQ: ScreeningQuestion = {
      id: `q-${Date.now()}`,
      question: "",
      type: "text",
      required: true,
    };
    setScreeningQuestions((prev) => [...prev, newQ]);
  };

  const handleQuestionChange = (id: string, field: keyof ScreeningQuestion, value: unknown) => {
    setScreeningQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const next = { ...q, [field]: value };
        // When the question TYPE changes, reset type-specific fields so stale
        // "select" options can't reappear (or get saved) after toggling type.
        if (field === "type") {
          if (value === "select") next.options = q.options ?? [];
          else delete next.options;
        }
        return next;
      })
    );
  };

  const handleRemoveQuestion = (id: string) => {
    setScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validation: no whitespace-only required fields ---
    const errs: Record<string, string> = {};
    if (isBlank(title)) errs.title = "Job title is required.";
    if (isBlank(department)) errs.department = "Department is required.";
    if (isBlank(description)) errs.description = "Role description is required.";
    // Every screening question that was added must have text.
    if (screeningQuestions.some((q) => isBlank(q.question))) {
      errs.questions = "Remove or fill in the empty screening question(s).";
    }
    // At least one real screening question is required per posting.
    if (screeningQuestions.filter((q) => !isBlank(q.question)).length === 0) {
      errs.questions = "Add at least one screening question.";
    }
    // Select-type questions need at least two options.
    if (screeningQuestions.some((q) => q.type === "select" && (q.options || []).filter((o) => cleanText(o)).length < 2)) {
      errs.questions = "Select questions need at least two options (comma separated).";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const requirements = requirementsInput
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    // Clean questions: drop blanks, trim text/options.
    const cleanedQuestions = screeningQuestions
      .filter((q) => !isBlank(q.question))
      .map((q) => ({
        ...q,
        question: cleanText(q.question),
        options: q.type === "select" ? (q.options || []).map((o) => cleanText(o)).filter(Boolean) : undefined,
      }));

    const savedJob: JobPosting = {
      id: job?.id || `job-${Date.now()}`,
      title: cleanText(title),
      department: cleanText(department),
      type,
      location: cleanText(location),
      description: cleanText(description),
      requirements,
      screeningQuestions: cleanedQuestions,
      status,
      createdAt: job?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: job?.applicationsCount || 0,
    };

    onSave(savedJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/65 backdrop-blur-xs" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <span className="eyebrow">{job ? "Edit Posting" : "Create New Position"}</span>
            <h2 className="font-display text-[22px] leading-tight text-foreground">
              {job ? job.title : "New Career Opportunity"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:bg-panel hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form noValidate onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); clearErr("title"); }}
                placeholder="e.g. Senior AI Systems Engineer"
                className={`w-full rounded-xl border bg-paper px-4 py-2.5 text-[15px] text-foreground outline-none focus:ring-2 ${errors.title ? "border-[#c0564f] focus:ring-[#c0564f]/30" : "border-border focus:ring-accent/30"}`}
              />
              {errors.title && <p className="mt-1 text-[12px]" style={{ color: "#c0564f" }}>{errors.title}</p>}
            </div>
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => { setDepartment(e.target.value); clearErr("department"); }}
                placeholder="e.g. Artificial Intelligence"
                className={`w-full rounded-xl border bg-paper px-4 py-2.5 text-[15px] text-foreground outline-none focus:ring-2 ${errors.department ? "border-[#c0564f] focus:ring-[#c0564f]/30" : "border-border focus:ring-accent/30"}`}
              />
              {errors.department && <p className="mt-1 text-[12px]" style={{ color: "#c0564f" }}>{errors.department}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hyderabad / Remote"
                className="w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "closed")}
                className="w-full rounded-xl border border-border bg-paper px-3 py-2.5 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="published">🟢 Published (Live)</option>
                <option value="draft">🟡 Draft</option>
                <option value="closed">🔴 Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
              Role Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => { setDescription(e.target.value); clearErr("description"); }}
              placeholder="Overview of role objectives, team context, and key responsibilities…"
              className={`w-full rounded-xl border bg-paper p-3 text-[14px] text-foreground outline-none focus:ring-2 ${errors.description ? "border-[#c0564f] focus:ring-[#c0564f]/30" : "border-border focus:ring-accent/30"}`}
            />
            {errors.description && <p className="mt-1 text-[12px]" style={{ color: "#c0564f" }}>{errors.description}</p>}
          </div>

          <div>
            <label className="block text-[12.5px] uppercase tracking-[0.12em] text-faint mb-1">
              Key Requirements & Tech Stack (One requirement per line)
            </label>
            <textarea
              rows={3}
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="Python, PyTorch, LangChain&#10;LLM fine-tuning & RAG architecture&#10;3+ years production AI experience"
              className="w-full rounded-xl border border-border bg-paper p-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-accent/30 font-mono text-[13px]"
            />
          </div>

          {/* Screening Question Builder */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12.5px] uppercase tracking-[0.12em] text-faint font-medium">
                Application Screening Questions
              </span>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-[13px] text-accent hover:underline font-medium"
              >
                + Add Screening Question
              </button>
            </div>

            <div className="space-y-3">
              {screeningQuestions.length === 0 ? (
                <p className="text-[13px] text-muted italic">No custom questions added yet.</p>
              ) : (
                screeningQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-panel p-3 rounded-xl border border-border">
                    <div className="flex gap-2 items-center">
                      <span className="text-[12px] text-faint font-mono">{idx + 1}.</span>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => { handleQuestionChange(q.id, "question", e.target.value); clearErr("questions"); }}
                        placeholder="e.g. Years of experience with Next.js?"
                        className="flex-1 rounded-lg border border-border bg-paper px-3 py-1.5 text-[13.5px] text-foreground outline-none"
                      />
                      <select
                        value={q.type}
                        onChange={(e) => { handleQuestionChange(q.id, "type", e.target.value); clearErr("questions"); }}
                        className="rounded-lg border border-border bg-paper px-2 py-1.5 text-[13px] text-foreground outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 px-2 text-[14px]"
                      >
                        🗑️
                      </button>
                    </div>
                    {q.type === "select" && (
                      <input
                        type="text"
                        value={(q.options || []).join(", ")}
                        onChange={(e) => { handleQuestionChange(q.id, "options", e.target.value.split(",").map((o) => o.trimStart())); clearErr("questions"); }}
                        placeholder="Options, comma separated — e.g. Immediate, 30 days, 60 days"
                        className="mt-2 ml-5 w-[calc(100%-1.25rem)] rounded-lg border border-border bg-paper px-3 py-1.5 text-[13px] text-foreground outline-none"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
            {errors.questions && <p className="mt-2 text-[12px]" style={{ color: "#c0564f" }}>{errors.questions}</p>}
          </div>

          {/* Submit */}
          <div className="border-t border-border pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-pill btn-ghost text-[14px]">
              Cancel
            </button>
            <button type="submit" className="btn-pill btn-primary text-[14px]">
              Save Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
