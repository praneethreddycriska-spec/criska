"use client";

import { useEffect, useState, useMemo } from "react";
import { JobPosting, JobApplication, ApplicationStatus, ScheduledInterview } from "@/types/ats";
import {
  fetchJobs,
  fetchApplications,
  updateApplicationRecord,
  saveJobPosting,
  deleteJobPosting,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { exportApplicationsToCSV, printCandidateDossier } from "@/lib/export-utils";
import { CandidateDrawer } from "./candidate-drawer";
import { JobModal } from "./job-modal";
import { ComparisonModal } from "./comparison-modal";
import { InterviewScheduler } from "./interview-scheduler";
import { EmailWorkflowModal } from "./email-workflow-modal";
import { ShareLinkModal } from "./share-link-modal";
import { ThemeToggle } from "../theme-toggle";
import { VisitorStats } from "./visitor-stats";
import { InquiriesPanel } from "./inquiries-panel";

export function AdminDashboard() {
  // Authentication is handled entirely server-side (signed session cookie +
  // middleware + email allowlist). Reaching this component means the admin is
  // already signed in — there is no client-side passcode gate.

  // Navigation & Data state
  const [activeTab, setActiveTab] = useState<"applicants" | "overview" | "jobs" | "inquiries">("applicants");
  const [viewMode, setViewMode] = useState<"grouped" | "table">("grouped");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Candidate Selection for Comparison Matrix
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  // Feature Modals triggered from table rows
  const [scheduleTargetApp, setScheduleTargetApp] = useState<JobApplication | null>(null);
  const [emailTargetApp, setEmailTargetApp] = useState<JobApplication | null>(null);
  const [shareTargetApp, setShareTargetApp] = useState<JobApplication | null>(null);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedScoreTier, setSelectedScoreTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"ats_desc" | "ats_asc" | "date_desc" | "name_asc">("ats_desc");

  // Drawer & Modals
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);

  // Real logout — clears the server session cookie, then returns to the login page.
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    window.location.href = "/admin/login";
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedJobs, fetchedApps] = await Promise.all([
        fetchJobs(),
        fetchApplications(),
      ]);
      setJobs(fetchedJobs);
      setApplications(fetchedApps);
    } catch (err) {
      console.error("Error loading ATS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = app.fullName.toLowerCase().includes(q);
          const matchEmail = app.email.toLowerCase().includes(q);
          const matchJob = (app.jobTitle || "").toLowerCase().includes(q);
          const matchSkills = (app.atsAnalysis?.skillsMatched || []).some((s) =>
            s.toLowerCase().includes(q)
          );
          if (!matchName && !matchEmail && !matchJob && !matchSkills) return false;
        }

        if (selectedJobId !== "all" && app.jobId !== selectedJobId) return false;
        if (selectedStatus !== "all" && app.status !== selectedStatus) return false;
        if (selectedScoreTier === "top" && app.atsScore < 80) return false;
        if (selectedScoreTier === "moderate" && (app.atsScore < 50 || app.atsScore >= 80)) return false;
        if (selectedScoreTier === "low" && app.atsScore >= 50) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "ats_desc") return b.atsScore - a.atsScore;
        if (sortBy === "ats_asc") return a.atsScore - b.atsScore;
        if (sortBy === "date_desc")
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "name_asc") return a.fullName.localeCompare(b.fullName);
        return 0;
      });
  }, [applications, searchQuery, selectedJobId, selectedStatus, selectedScoreTier, sortBy]);

  // Group applications by Job Posting
  const groupedByRole = useMemo(() => {
    const map = new Map<string, { job: JobPosting; apps: JobApplication[] }>();

    jobs.forEach((j) => {
      map.set(j.id, { job: j, apps: [] });
    });

    filteredApplications.forEach((app) => {
      if (map.has(app.jobId)) {
        map.get(app.jobId)!.apps.push(app);
      } else {
        const dummyJob: JobPosting = {
          id: app.jobId,
          title: app.jobTitle || "Other Position",
          department: "General",
          type: "Full-time",
          location: "Hyderabad",
          description: "",
          requirements: [],
          screeningQuestions: [],
          status: "published",
          createdAt: "",
          updatedAt: "",
        };
        map.set(app.jobId, { job: dummyJob, apps: [app] });
      }
    });

    const result: Array<{ job: JobPosting; apps: JobApplication[] }> = [];
    map.forEach((value) => {
      value.apps.sort((a, b) => b.atsScore - a.atsScore);
      result.push(value);
    });

    return result;
  }, [jobs, filteredApplications]);

  const selectedCandidates = useMemo(() => {
    return applications.filter((a) => selectedCandidateIds.includes(a.id));
  }, [applications, selectedCandidateIds]);

  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Analytics Metrics
  const totalAppsCount = applications.length;
  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted" || a.status === "interviewing"
  ).length;
  const avgAtsScore =
    totalAppsCount > 0
      ? Math.round(
          applications.reduce((acc, a) => acc + a.atsScore, 0) / totalAppsCount
        )
      : 0;

  const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus) => {
    await updateApplicationRecord(id, { status: newStatus });
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    await updateApplicationRecord(id, { adminNotes: notes });
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, adminNotes: notes } : a))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, adminNotes: notes } : null));
    }
  };

  const handleScheduleSuccess = (interview: ScheduledInterview) => {
    if (scheduleTargetApp) {
      handleUpdateStatus(scheduleTargetApp.id, "interviewing");
    }
  };

  const handleSaveJob = async (job: JobPosting) => {
    const newJob: JobPosting = {
      ...job,
      id: job.id || `job-custom-${Date.now()}`,
      createdAt: job.createdAt || new Date().toISOString(),
      applicationsCount: job.applicationsCount || 0,
    };
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === newJob.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newJob;
        return copy;
      }
      return [newJob, ...prev];
    });
    await saveJobPosting(newJob);
    await loadData();
  };

  const handleDeleteJob = async (job: JobPosting) => {
    if (!confirm(`Remove the "${job.title || "Untitled"}" position? This cannot be undone.`)) return;
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
    await deleteJobPosting(job.id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-paper text-foreground">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="font-semibold tracking-[0.2em] text-foreground text-[18px]">
              CRISKA <span className="text-accent text-[12px] font-normal tracking-normal uppercase">ADMIN PORTAL</span>
            </a>
            <span
              className={`rounded-full px-3 py-1 text-[11.5px] font-medium border ${
                isSupabaseConfigured
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {isSupabaseConfigured ? "🟢 Supabase Connected" : "⚡ Local Store Ready"}
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 rounded-full border border-border bg-panel p-1">
            <button
              type="button"
              onClick={() => setActiveTab("applicants")}
              className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium transition ${
                activeTab === "applicants"
                  ? "bg-ink text-on-ink shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Applicants ATS ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium transition ${
                activeTab === "overview"
                  ? "bg-ink text-on-ink shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("jobs")}
              className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium transition ${
                activeTab === "jobs"
                  ? "bg-ink text-on-ink shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Job Postings ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("inquiries")}
              className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium transition ${
                activeTab === "inquiries"
                  ? "bg-ink text-on-ink shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              📥 Inquiries
            </button>
            <a
              href="/admin/content"
              className="rounded-full px-4 py-1.5 text-[13.5px] font-medium text-muted hover:text-foreground transition flex items-center gap-1.5"
            >
              🖼️ Edit Site Photos & Content
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="btn-pill btn-ghost !px-3 !py-1.5 text-[12.5px]"
            >
              Log out 🔒
            </button>
            <a href="/careers" className="btn-pill btn-primary !px-4 !py-1.5 text-[13px]">
              View Careers Page ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {loading ? (
          <div className="py-20 text-center text-muted">Loading ATS candidates & job matrix…</div>
        ) : (
          <>
            {/* TAB 1: APPLICANTS ATS TABLE & GROUPED BOXES VIEW */}
            {activeTab === "applicants" && (
              <div className="space-y-6">
                {/* Search & Filter Control Bar — STRICTLY ONE LINE LAYOUT */}
                <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs overflow-x-auto">
                  <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 min-w-[950px]">
                    {/* View Mode Toggle: Split by Job Role vs Single List */}
                    <div className="flex items-center gap-1 rounded-full border border-border bg-panel p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewMode("grouped")}
                        className={`rounded-full px-3.5 py-1 text-[13px] font-medium transition whitespace-nowrap ${
                          viewMode === "grouped"
                            ? "bg-ink text-on-ink shadow-xs"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        📦 Split by Job Role
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`rounded-full px-3.5 py-1 text-[13px] font-medium transition whitespace-nowrap ${
                          viewMode === "table"
                            ? "bg-ink text-on-ink shadow-xs"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        📋 Single Table List
                      </button>
                    </div>

                    {/* Action Bar: Compare & Export */}
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedCandidateIds.length >= 2 && (
                        <button
                          type="button"
                          onClick={() => setComparisonModalOpen(true)}
                          className="btn-pill btn-primary !px-3.5 !py-1 text-[13px] whitespace-nowrap"
                        >
                          📊 Compare ({selectedCandidateIds.length}) Side-by-Side
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => exportApplicationsToCSV(filteredApplications)}
                        className="btn-pill btn-ghost !px-3.5 !py-1 text-[13px] whitespace-nowrap"
                      >
                        📥 Export CSV / Excel
                      </button>
                    </div>

                    {/* Filter Selectors — EVERYTHING IN ONE SINGLE ROW (Search -> All Roles -> All Statuses -> All ATS Scores) */}
                    <div className="flex items-center gap-2 shrink-0 flex-1 justify-end">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, email, skills…"
                        className="rounded-xl border border-border bg-paper px-3 py-1.5 text-[13.5px] text-foreground outline-none focus:ring-2 focus:ring-accent/30 w-48 shrink-0"
                      />

                      <select
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="rounded-xl border border-border bg-paper px-3 py-1.5 text-[13.5px] text-foreground outline-none shrink-0"
                      >
                        <option value="all">All Roles</option>
                        {jobs.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.title}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-xl border border-border bg-paper px-3 py-1.5 text-[13.5px] text-foreground outline-none shrink-0"
                      >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      {/* All ATS Scores placed directly beside All Statuses in same line */}
                      <select
                        value={selectedScoreTier}
                        onChange={(e) => setSelectedScoreTier(e.target.value)}
                        className="rounded-xl border border-border bg-paper px-3 py-1.5 text-[13.5px] text-foreground outline-none shrink-0"
                      >
                        <option value="all">All ATS Scores</option>
                        <option value="top">Top Match (≥80%)</option>
                        <option value="moderate">Moderate Match (50-79%)</option>
                        <option value="low">Low Match (&lt;50%)</option>
                      </select>

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="rounded-xl border border-border bg-paper px-3 py-1.5 text-[13.5px] text-foreground font-medium outline-none shrink-0"
                      >
                        <option value="ats_desc">Sort: ATS Score (High to Low)</option>
                        <option value="ats_asc">Sort: ATS Score (Low to High)</option>
                        <option value="date_desc">Sort: Date Applied (Newest)</option>
                        <option value="name_asc">Sort: Name (A-Z)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[12.5px] text-faint border-t border-border pt-2.5 mt-2">
                    <span>
                      Showing <strong>{filteredApplications.length}</strong> total candidate profile matches
                    </span>
                    {(searchQuery ||
                      selectedJobId !== "all" ||
                      selectedStatus !== "all" ||
                      selectedScoreTier !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedJobId("all");
                          setSelectedStatus("all");
                          setSelectedScoreTier("all");
                        }}
                        className="text-accent hover:underline font-medium"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* VIEW 1: GROUPED BY JOB ROLE BOXES */}
                {viewMode === "grouped" ? (
                  <div className="space-y-8">
                    {groupedByRole.map(({ job, apps }) => (
                      <div
                        key={job.id}
                        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs"
                      >
                        {/* Box Header for this Job Role */}
                        <div className="flex flex-col gap-2 border-b border-border bg-panel px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display text-[22px] leading-tight text-foreground">
                                {job.title}
                              </span>
                              <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11.5px] border border-border text-muted font-medium">
                                {job.department}
                              </span>
                            </div>
                            <div className="text-[13px] text-muted mt-1">
                              Location: {job.location} · {job.type}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent">
                              {apps.length} Candidate{apps.length === 1 ? "" : "s"}
                            </span>
                            {apps.length > 0 && (
                              <span className="text-[12.5px] text-faint font-mono">
                                Top ATS: {apps[0].atsScore}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Candidates Table inside this Role Box */}
                        {apps.length === 0 ? (
                          <div className="p-8 text-center text-muted italic text-[14px]">
                            No applicants received for this job role matching your active filters.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[14px]">
                              <thead className="border-b border-border bg-paper/50 text-[11.5px] uppercase tracking-[0.12em] text-faint">
                                <tr>
                                  <th className="px-4 py-3 w-10 text-center">Compare</th>
                                  <th className="px-6 py-3">Candidate</th>
                                  <th className="px-6 py-3">ATS Match Score</th>
                                  <th className="px-6 py-3">Recommendation</th>
                                  <th className="px-6 py-3">Pipeline Status</th>
                                  <th className="px-6 py-3">Applied Date</th>
                                  <th className="px-6 py-3 text-right">Actions & Feature Tools</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {apps.map((app) => (
                                  <tr
                                    key={app.id}
                                    className="transition hover:bg-panel/60 cursor-pointer"
                                    onClick={() => {
                                      setSelectedApp(app);
                                      setDrawerOpen(true);
                                    }}
                                  >
                                    <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        checked={selectedCandidateIds.includes(app.id)}
                                        onChange={() => toggleSelectCandidate(app.id)}
                                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="font-medium text-foreground">{app.fullName}</div>
                                      <div className="text-[12.5px] text-muted">{app.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div
                                        className={`inline-flex items-center justify-center font-display text-[16px] tabular-nums rounded-lg px-2.5 py-1 font-semibold border ${
                                          app.atsScore >= 80
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                            : app.atsScore >= 60
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                        }`}
                                      >
                                        {app.atsScore}%
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="inline-flex items-center whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-medium leading-none text-accent">
                                        {app.atsAnalysis?.recommendation || "Evaluated"}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                      <select
                                        value={app.status}
                                        onChange={(e) =>
                                          handleUpdateStatus(
                                            app.id,
                                            e.target.value as ApplicationStatus
                                          )
                                        }
                                        className="rounded-lg border border-border bg-paper px-2.5 py-1 text-[13px] font-medium outline-none"
                                      >
                                        <option value="new">New</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="interviewing">Interviewing</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-muted">
                                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          title="Schedule Interview (.ics)"
                                          onClick={() => setScheduleTargetApp(app)}
                                          className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                        >
                                          📅
                                        </button>
                                        <button
                                          type="button"
                                          title="Email Workflows & Offer Letter"
                                          onClick={() => setEmailTargetApp(app)}
                                          className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                        >
                                          ✉️
                                        </button>
                                        <button
                                          type="button"
                                          title="Generate Client Share Link"
                                          onClick={() => setShareTargetApp(app)}
                                          className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                        >
                                          🔗
                                        </button>
                                        <button
                                          type="button"
                                          title="Print Candidate PDF Dossier"
                                          onClick={() => printCandidateDossier(app)}
                                          className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                        >
                                          🖨️
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedApp(app);
                                            setDrawerOpen(true);
                                          }}
                                          className="btn-pill btn-ghost !px-2.5 !py-1 text-[12px]"
                                        >
                                          Profile →
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* VIEW 2: SINGLE CONSOLIDATED TABLE LIST */
                  <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
                    {filteredApplications.length === 0 ? (
                      <div className="p-12 text-center text-muted">
                        No candidate applications match your current filters or search criteria.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[14px]">
                          <thead className="border-b border-border bg-panel text-[12px] uppercase tracking-[0.12em] text-faint">
                            <tr>
                              <th className="px-4 py-4 w-10 text-center">Compare</th>
                              <th className="px-6 py-4">Candidate</th>
                              <th className="px-6 py-4">Position</th>
                              <th className="px-6 py-4">ATS Match Score</th>
                              <th className="px-6 py-4">Recommendation</th>
                              <th className="px-6 py-4">Pipeline Status</th>
                              <th className="px-6 py-4">Applied Date</th>
                              <th className="px-6 py-4 text-right">Actions & Feature Tools</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredApplications.map((app) => (
                              <tr
                                key={app.id}
                                className="transition hover:bg-panel/60 cursor-pointer"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setDrawerOpen(true);
                                }}
                              >
                                <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={selectedCandidateIds.includes(app.id)}
                                    onChange={() => toggleSelectCandidate(app.id)}
                                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-medium text-foreground">{app.fullName}</div>
                                  <div className="text-[12.5px] text-muted">{app.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-medium text-foreground">{app.jobTitle}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div
                                    className={`inline-flex items-center justify-center font-display text-[16px] tabular-nums rounded-lg px-2.5 py-1 font-semibold border ${
                                      app.atsScore >= 80
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : app.atsScore >= 60
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                    }`}
                                  >
                                    {app.atsScore}%
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-medium leading-none text-accent">
                                    {app.atsAnalysis?.recommendation || "Evaluated"}
                                  </span>
                                </td>
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={app.status}
                                    onChange={(e) =>
                                      handleUpdateStatus(
                                        app.id,
                                        e.target.value as ApplicationStatus
                                      )
                                    }
                                    className="rounded-lg border border-border bg-paper px-2.5 py-1 text-[13px] font-medium outline-none"
                                  >
                                    <option value="new">New</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="interviewing">Interviewing</option>
                                    <option value="hired">Hired</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-[13px] text-muted">
                                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      title="Schedule Interview (.ics)"
                                      onClick={() => setScheduleTargetApp(app)}
                                      className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                    >
                                      📅
                                    </button>
                                    <button
                                      type="button"
                                      title="Email Workflows & Offer Letter"
                                      onClick={() => setEmailTargetApp(app)}
                                      className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                    >
                                      ✉️
                                    </button>
                                    <button
                                      type="button"
                                      title="Generate Client Share Link"
                                      onClick={() => setShareTargetApp(app)}
                                      className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                    >
                                      🔗
                                    </button>
                                    <button
                                      type="button"
                                      title="Print Candidate PDF Dossier"
                                      onClick={() => printCandidateDossier(app)}
                                      className="p-1.5 rounded-lg border border-border bg-paper hover:bg-panel text-[13px]"
                                    >
                                      🖨️
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedApp(app);
                                        setDrawerOpen(true);
                                      }}
                                      className="btn-pill btn-ghost !px-2.5 !py-1 text-[12px]"
                                    >
                                      Profile →
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ANALYTICS OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <VisitorStats />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <span className="text-[12px] uppercase tracking-[0.14em] text-faint">
                      Total Applications
                    </span>
                    <div className="font-display mt-2 text-[38px] leading-none text-foreground tabular-nums">
                      {totalAppsCount}
                    </div>
                    <span className="text-[13px] text-muted mt-2 block">Across active postings</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <span className="text-[12px] uppercase tracking-[0.14em] text-faint">
                      Top Shortlisted
                    </span>
                    <div className="font-display mt-2 text-[38px] leading-none text-emerald-500 tabular-nums">
                      {shortlistedCount}
                    </div>
                    <span className="text-[13px] text-muted mt-2 block">High-priority candidates</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <span className="text-[12px] uppercase tracking-[0.14em] text-faint">
                      Average ATS Match Score
                    </span>
                    <div className="font-display mt-2 text-[38px] leading-none text-accent tabular-nums">
                      {avgAtsScore}%
                    </div>
                    <span className="text-[13px] text-muted mt-2 block">Applicant match index</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <span className="text-[12px] uppercase tracking-[0.14em] text-faint">
                      Active Job Openings
                    </span>
                    <div className="font-display mt-2 text-[38px] leading-none text-foreground tabular-nums">
                      {jobs.filter((j) => j.status === "published").length}
                    </div>
                    <span className="text-[13px] text-muted mt-2 block">Accepting candidate submissions</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="font-display text-[22px] text-foreground mb-4">
                    Recruitment Pipeline Funnel
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 text-center">
                    {[
                      {
                        label: "New",
                        count: applications.filter((a) => a.status === "new").length,
                        color: "text-blue-500",
                      },
                      {
                        label: "Under Review",
                        count: applications.filter((a) => a.status === "under_review").length,
                        color: "text-amber-500",
                      },
                      {
                        label: "Shortlisted",
                        count: applications.filter((a) => a.status === "shortlisted").length,
                        color: "text-emerald-500",
                      },
                      {
                        label: "Interviewing",
                        count: applications.filter((a) => a.status === "interviewing").length,
                        color: "text-purple-500",
                      },
                      {
                        label: "Hired",
                        count: applications.filter((a) => a.status === "hired").length,
                        color: "text-green-600",
                      },
                      {
                        label: "Rejected",
                        count: applications.filter((a) => a.status === "rejected").length,
                        color: "text-red-500",
                      },
                    ].map((step) => (
                      <div key={step.label} className="rounded-xl border border-border bg-panel p-4">
                        <span className="text-[12px] text-faint block">{step.label}</span>
                        <span className={`font-display text-[32px] block mt-1 ${step.color}`}>
                          {step.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: JOB POSTINGS MANAGEMENT */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-[26px]">Job Openings Management</h2>
                    <p className="text-[14.5px] text-muted">Create, edit, publish, or close company positions.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJob(null);
                      setJobModalOpen(true);
                    }}
                    className="btn-pill btn-primary"
                  >
                    + Post New Job
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((j) => (
                    <div
                      key={j.id}
                      className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-panel px-3 py-1 text-[12px] border border-border text-muted">
                            {j.department}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${
                              j.status === "published"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-panel text-faint border border-border"
                            }`}
                          >
                            {j.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-display mt-4 text-[22px] leading-tight text-foreground">
                          {j.title}
                        </h3>
                        <p className="mt-2 text-[13.5px] text-muted line-clamp-3">{j.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[13px]">
                        <span className="text-muted">
                          <strong>{j.applicationsCount || 0}</strong> Applicants
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingJob(j);
                              setJobModalOpen(true);
                            }}
                            className="btn-pill btn-ghost !px-3 !py-1 text-[13px]"
                          >
                            Edit ⚙️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(j)}
                            className="rounded-full border border-border px-3 py-1 text-[13px] text-[#c0564f] hover:bg-red-500/10"
                          >
                            Remove 🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: WEBSITE INQUIRIES INBOX */}
            {activeTab === "inquiries" && <InquiriesPanel />}
          </>
        )}
      </main>

      {/* Candidate Profile Drawer */}
      <CandidateDrawer
        application={selectedApp}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateNotes={handleUpdateNotes}
      />

      {/* Job Management Modal */}
      <JobModal
        job={editingJob}
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        onSave={handleSaveJob}
      />

      {/* Side-by-Side Candidate Comparison Modal */}
      <ComparisonModal
        candidates={selectedCandidates}
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
      />

      {/* Direct Row Feature Tool Modals */}
      <InterviewScheduler
        application={scheduleTargetApp}
        isOpen={Boolean(scheduleTargetApp)}
        onClose={() => setScheduleTargetApp(null)}
        onScheduleSuccess={handleScheduleSuccess}
      />

      <EmailWorkflowModal
        application={emailTargetApp}
        isOpen={Boolean(emailTargetApp)}
        onClose={() => setEmailTargetApp(null)}
      />

      <ShareLinkModal
        application={shareTargetApp}
        isOpen={Boolean(shareTargetApp)}
        onClose={() => setShareTargetApp(null)}
      />
    </div>
  );
}
