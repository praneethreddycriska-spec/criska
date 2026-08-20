import { JobApplication, ScreeningQuestion } from "@/types/ats";

/**
 * Export Candidate Applications List to CSV / Excel
 */
export function exportApplicationsToCSV(applications: JobApplication[]): void {
  if (!applications || applications.length === 0) return;

  const headers = [
    "Application ID",
    "Candidate Name",
    "Email",
    "Phone",
    "Position Applied",
    "ATS Match Score (%)",
    "Recommendation",
    "Pipeline Status",
    "Applied Date",
    "Matched Skills",
    "LinkedIn URL",
    "Admin Notes",
  ];

  const rows = applications.map((app) => [
    `"${app.id}"`,
    `"${app.fullName.replace(/"/g, '""')}"`,
    `"${app.email}"`,
    `"${app.phone}"`,
    `"${(app.jobTitle || "").replace(/"/g, '""')}"`,
    app.atsScore,
    `"${app.atsAnalysis?.recommendation || ""}"`,
    `"${app.status}"`,
    `"${new Date(app.createdAt).toLocaleDateString()}"`,
    `"${(app.atsAnalysis?.skillsMatched || []).join("; ").replace(/"/g, '""')}"`,
    `"${app.linkedinUrl || ""}"`,
    `"${(app.adminNotes || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Criska_ATS_Applicants_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate Printable Candidate Dossier HTML / PDF View
 */
export function printCandidateDossier(app: JobApplication, questions: ScreeningQuestion[] = []): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Screening answers are keyed by question id — resolve to the real question text.
  const questionText = (id: string) => questions.find((q) => q.id === id)?.question ?? id;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Candidate Dossier — ${app.fullName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #171717; }
          .header { border-bottom: 2px solid #171717; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 28px; font-weight: bold; margin: 0; }
          .sub { font-size: 16px; color: #6f6f6f; margin-top: 5px; }
          .score-box { background: #f1f0ec; border: 1px solid #d7d7d7; padding: 15px; border-radius: 12px; display: inline-block; margin: 15px 0; }
          .score { font-size: 32px; font-weight: bold; color: #171717; }
          .section { margin-top: 25px; }
          .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #979797; margin-bottom: 8px; font-weight: 600; }
          .tag { display: inline-block; background: #e8e8e8; padding: 4px 10px; border-radius: 20px; font-size: 13px; margin: 2px; }
          .tag-green { background: #d1fae5; color: #065f46; }
          .tag-amber { background: #fef3c7; color: #92400e; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { border: 1px solid #e8e8e8; padding: 10px; text-align: left; font-size: 14px; }
          th { background: #f7f6f3; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size: 12px; uppercase; tracking: 2px; color: #8b93c4;">CRISKA BUSINESS CONSULTING · ATS REPORT</div>
          <h1 class="title">${app.fullName}</h1>
          <div class="sub">Position: ${app.jobTitle} · Applied: ${new Date(app.createdAt).toLocaleDateString()}</div>
        </div>

        <div class="score-box">
          <div style="font-size: 11px; text-transform: uppercase;">Automated ATS Match Score</div>
          <div class="score">${app.atsScore}%</div>
          <div style="font-size: 13px; font-weight: 500;">Recommendation: ${app.atsAnalysis?.recommendation || "Evaluated"}</div>
        </div>

        <div class="section">
          <div class="section-title">Contact & Profiles</div>
          <p><strong>Email:</strong> ${app.email} | <strong>Phone:</strong> ${app.phone}</p>
          ${app.linkedinUrl ? `<p><strong>LinkedIn:</strong> ${app.linkedinUrl}</p>` : ""}
          ${app.portfolioUrl ? `<p><strong>Portfolio:</strong> ${app.portfolioUrl}</p>` : ""}
        </div>

        <div class="section">
          <div class="section-title">ATS Skills Match Analysis</div>
          <p><strong>Matched Requirements:</strong></p>
          <div>${(app.atsAnalysis?.skillsMatched || []).map(s => `<span class="tag tag-green">✓ ${s}</span>`).join("") || "None"}</div>
          ${app.atsAnalysis?.skillsMissing?.length ? `
            <p style="margin-top: 15px;"><strong>Unmatched / Missing Requirements:</strong></p>
            <div>${app.atsAnalysis.skillsMissing.map(s => `<span class="tag tag-amber">! ${s}</span>`).join("")}</div>
          ` : ""}
        </div>

        <div class="section">
          <div class="section-title">Screening Q&A Responses</div>
          <table>
            <thead>
              <tr><th>Question</th><th>Candidate Answer</th></tr>
            </thead>
            <tbody>
              ${Object.entries(app.screeningAnswers || {}).map(([q, a]) => `<tr><td><strong>${questionText(q)}</strong></td><td>${a}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>

        ${app.adminNotes ? `
          <div class="section">
            <div class="section-title">Internal Admin Notes</div>
            <div style="background: #f7f6f3; padding: 12px; border-radius: 8px; font-size: 14px;">${app.adminNotes}</div>
          </div>
        ` : ""}

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
