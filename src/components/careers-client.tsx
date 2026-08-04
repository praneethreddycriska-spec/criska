"use client";

import { useEffect, useState } from "react";
import { JobPosting } from "@/types/ats";
import { fetchJobs } from "@/lib/supabase";
import { ApplyModal } from "./apply-modal";

export function CareersClient() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs().then((data) => setJobs(data.filter((j) => j.status === "published")));
  }, []);

  const handleApplyClick = (job: JobPosting) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-border">
        {jobs.length === 0 ? (
          <div className="bg-surface p-8 text-center text-muted">
            Loading active career opportunities…
          </div>
        ) : (
          jobs.map((r, i) => (
            <div
              key={r.id}
              className={`group flex flex-col gap-4 bg-surface px-7 py-6 transition-all duration-200 hover:bg-panel sm:flex-row sm:items-center sm:justify-between ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3">
                  <span className="font-display text-[22px] leading-tight text-foreground group-hover:text-foreground">
                    {r.title}
                  </span>
                  <span className="rounded-full bg-panel px-2.5 py-0.5 text-[11.5px] border border-border text-muted font-medium">
                    {r.department}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-[13px] text-muted">
                  <span>{r.type}</span>
                  <span>·</span>
                  <span>{r.location}</span>
                </div>
                <p className="mt-2 max-w-2xl text-[14.5px] text-muted line-clamp-2 leading-relaxed">
                  {r.description}
                </p>
              </div>

              {/* Apply → Button attached matching design */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleApplyClick(r)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-2.5 text-[14.5px] font-medium text-foreground transition-all duration-200 hover:bg-panel hover:border-foreground/40 hover:shadow-xs"
                >
                  <span>Apply</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5 text-foreground"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJob}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
