import type { Metadata } from "next";
import { fetchApplications } from "@/lib/supabase";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Shared Candidate Profile — Criska ATS",
  description: "Secure view-only candidate dossier for client review.",
};

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const applications = await fetchApplications();
  const application = applications.find((a) => a.id === token || a.shareToken === token);

  if (!application) {
    return (
      <>
        <Nav />
        <main className="flex-1 py-24 text-center">
          <h1 className="font-display text-[32px]">Candidate Dossier Not Found</h1>
          <p className="mt-2 text-muted">This share link may have expired or is invalid.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-20 md:py-28">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-xl space-y-6">
            <div className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow">Criska Client Review Dossier</span>
                <h1 className="font-display text-[34px] leading-tight text-foreground">{application.fullName}</h1>
                <p className="text-[15px] text-muted mt-1">Position Applied: {application.jobTitle}</p>
              </div>

              <div className="text-right">
                <span className="text-[12px] uppercase text-faint block">ATS Match Score</span>
                <div className="font-display text-[42px] leading-none text-foreground tabular-nums">{application.atsScore}%</div>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent inline-block mt-1">
                  {application.atsAnalysis?.recommendation}
                </span>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="space-y-3">
              <h3 className="text-[12.5px] uppercase tracking-[0.12em] text-faint font-semibold">Verified Technical Skill Matches</h3>
              <div className="flex flex-wrap gap-1.5">
                {application.atsAnalysis?.skillsMatched?.map((s) => (
                  <span key={s} className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1 text-[13px]">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Summary */}
            <div className="rounded-xl border border-border bg-panel p-4 text-[15px] leading-relaxed text-muted">
              {application.atsAnalysis?.matchSummary}
            </div>

            {/* Screening Answers */}
            <div className="space-y-3">
              <h3 className="text-[12.5px] uppercase tracking-[0.12em] text-faint font-semibold">Screening Question Responses</h3>
              <div className="space-y-2 border border-border rounded-xl p-4 bg-paper">
                {Object.entries(application.screeningAnswers || {}).map(([q, a]) => (
                  <div key={q} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="text-[13px] font-medium text-foreground block">{q}</span>
                    <span className="text-[14px] text-muted block">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            {application.technicalSkills && application.technicalSkills.length > 0 && (
              <div className="pt-4 border-t border-border">
                <span className="text-[13px] text-muted block mb-2">Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {application.technicalSkills.map((s, i) => (
                    <span key={i} className="rounded-full bg-panel px-2.5 py-1 text-[12px] text-foreground">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
