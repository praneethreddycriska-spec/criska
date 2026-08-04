"use client";

import { JobApplication } from "@/types/ats";

export function ComparisonModal({
  candidates,
  isOpen,
  onClose,
}: {
  candidates: JobApplication[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="fixed inset-0 bg-black/65 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <span className="eyebrow">Side-by-Side Candidate Comparison</span>
            <h2 className="font-display text-[22px] leading-tight text-foreground">
              Comparing {candidates.length} Shortlisted Candidates
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

        {/* Comparison Grid */}
        <div className="p-6 overflow-x-auto flex-1">
          <div className="min-w-[700px]">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-border bg-panel">
                  <th className="p-4 text-[12px] uppercase text-faint w-48">Evaluation Metric</th>
                  {candidates.map((cand) => (
                    <th key={cand.id} className="p-4 font-display text-[18px] text-foreground border-l border-border">
                      {cand.fullName}
                      <span className="block text-[12.5px] font-sans text-muted font-normal mt-0.5">
                        {cand.jobTitle}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* ATS Match Score */}
                <tr>
                  <td className="p-4 font-medium text-foreground bg-panel/30">ATS Match Score</td>
                  {candidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-border">
                      <span
                        className={`inline-flex items-center justify-center font-display text-[22px] rounded-lg px-3 py-1 font-semibold border ${
                          cand.atsScore >= 80
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : cand.atsScore >= 60
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        }`}
                      >
                        {cand.atsScore}%
                      </span>
                      <span className="block text-[12px] text-muted mt-1">
                        {cand.atsAnalysis?.recommendation}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Status */}
                <tr>
                  <td className="p-4 font-medium text-foreground bg-panel/30">Pipeline Status</td>
                  {candidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-border uppercase text-[12.5px] font-medium text-accent">
                      {cand.status.replace("_", " ")}
                    </td>
                  ))}
                </tr>

                {/* Matched Skills */}
                <tr>
                  <td className="p-4 font-medium text-foreground bg-panel/30">Matched Core Skills</td>
                  {candidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-border">
                      <div className="flex flex-wrap gap-1">
                        {cand.atsAnalysis?.skillsMatched?.map((s) => (
                          <span key={s} className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-2.5 py-0.5 text-[11.5px] border border-emerald-500/20">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Missing Skills */}
                <tr>
                  <td className="p-4 font-medium text-foreground bg-panel/30">Unmatched / Missing</td>
                  {candidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-border">
                      <div className="flex flex-wrap gap-1">
                        {cand.atsAnalysis?.skillsMissing?.length ? (
                          cand.atsAnalysis.skillsMissing.map((s) => (
                            <span key={s} className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 px-2.5 py-0.5 text-[11.5px] border border-amber-500/20">
                              ! {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[12px] text-emerald-500">None missing</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Experience & Summary */}
                <tr>
                  <td className="p-4 font-medium text-foreground bg-panel/30">Evaluation Summary</td>
                  {candidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-border text-[13px] text-muted leading-relaxed">
                      {cand.atsAnalysis?.matchSummary}
                    </td>
                  ))}
                </tr>

                {/* Contact & Links */}
                <tr>
                  <td className="p-4 font-medium text-foreground bg-panel/30">Actions & Links</td>
                  {candidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-border">
                      <a
                        href={cand.resumeUrl}
                        download={cand.resumeFilename}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill btn-ghost !px-3 !py-1 text-[12px] block text-center"
                      >
                        📄 Download Resume
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex justify-end">
          <button type="button" onClick={onClose} className="btn-pill btn-primary text-[14px]">
            Close Comparison Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
