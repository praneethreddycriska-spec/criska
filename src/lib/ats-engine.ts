import { AtsAnalysis, JobPosting } from "@/types/ats";

/**
 * ============================================================
 * CRISKA ATS ENGINE — transparent, deterministic candidate scoring.
 *
 * Overall score (0–100) = the sum of four components:
 *   • Skills match .......... up to 60  (how many of the JOB's required
 *                                        skills the candidate's technical
 *                                        skills / answers actually cover)
 *   • Experience ............ up to 25  (years of relevant experience)
 *   • Screening & notice .... up to 10  (answered required Qs + availability)
 *   • Profile signals ....... up to  5  (LinkedIn / portfolio present)
 *
 * Recommendation tiers:
 *   ≥ 80  High Priority Shortlist
 *   ≥ 65  Strong Match
 *   ≥ 45  Potential Match
 *   <45   Does Not Meet Requirements
 * ============================================================
 */

const STOP_WORDS = new Set([
  "with", "from", "that", "this", "have", "more", "than", "years", "year", "and",
  "or", "for", "the", "in", "of", "to", "a", "an", "is", "are", "be", "must",
  "preferred", "experience", "deep", "hands", "on", "building", "design", "manage",
  "enforce", "using", "strong", "good", "plus", "etc", "knowledge", "understanding",
  "ability", "work", "team", "role", "you", "your", "our", "we", "will",
]);

/** Split text into a set of meaningful, comparable tokens. */
function tokenSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .split(/\s+/)
      .map((w) => w.replace(/^\.+|\.+$/g, ""))
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w)),
  );
}

/** Significant keywords from a single requirement phrase. */
function keywords(req: string): string[] {
  return [...tokenSet(req)];
}

/** Best-effort parse of years of experience from an explicit field or numeric answers. */
function parseYears(explicit: string | undefined, answers: Record<string, string>): number | null {
  const tryNum = (s: string) => {
    const m = String(s).match(/(\d+(?:\.\d+)?)/);
    if (!m) return null;
    const n = parseFloat(m[1]);
    return n >= 0 && n <= 50 ? n : null;
  };
  if (explicit) {
    const n = tryNum(explicit);
    if (n !== null) return n;
  }
  for (const [, v] of Object.entries(answers)) {
    const n = tryNum(v);
    if (n !== null) return n;
  }
  return null;
}

export function evaluateApplication(
  job: JobPosting,
  candidate: {
    fullName: string;
    technicalSkills?: string[];
    screeningAnswers: Record<string, string>;
    linkedinUrl?: string;
    portfolioUrl?: string;
    currentCompany?: string;
    experienceYears?: string;
    projectSummary?: string;
  },
): AtsAnalysis {
  const requirements = (job.requirements || []).filter(Boolean);
  const answers = candidate.screeningAnswers || {};
  const skills = (candidate.technicalSkills || []).map((s) => s.trim()).filter(Boolean);

  // ---------- INSUFFICIENT DATA GUARD ----------
  // If the candidate has effectively nothing to score against — no technical
  // skills, no (non-blank) screening answers, no experience, no project summary —
  // we must NOT fabricate a match percentage.
  const hasAnswers = Object.values(answers).some((v) => String(v ?? "").trim() !== "");
  const hasExperience = String(candidate.experienceYears ?? "").trim() !== "";
  const hasProject = String(candidate.projectSummary ?? "").trim() !== "";
  const insufficientData = skills.length === 0 && !hasAnswers && !hasExperience && !hasProject;

  if (insufficientData) {
    return {
      overallScore: 0,
      skillsMatched: [],
      skillsMissing: [],
      experienceEvaluation: "Not enough candidate information to evaluate this application.",
      matchSummary: `Insufficient data to score ${candidate.fullName} — no skills, screening answers, experience, or project details were provided.`,
      recommendation: "Insufficient Data",
      strengths: [],
      redFlags: ["No evaluable candidate data provided"],
      insufficientData: true,
    };
  }

  // Candidate text corpus (skills + answers + project + company) as a token set.
  const candidateCorpus = [
    skills.join(", "),
    candidate.projectSummary || "",
    candidate.currentCompany || "",
    ...Object.values(answers),
  ]
    .join(" ")
    .toLowerCase();
  const candidateTokens = tokenSet(candidateCorpus);

  const strengths: string[] = [];
  const redFlags: string[] = [];

  // ---------- 1. SKILLS MATCH (0–60) ----------
  const skillsMatched: string[] = [];
  const skillsMissing: string[] = [];
  let evaluable = 0;

  requirements.forEach((req) => {
    const kws = keywords(req);
    if (kws.length === 0) {
      skillsMatched.push(req); // no keywords to test → don't penalise
      return;
    }
    evaluable += 1;
    const hit = kws.some((kw) => candidateTokens.has(kw) || candidateCorpus.includes(kw));
    if (hit) skillsMatched.push(req);
    else skillsMissing.push(req);
  });

  let coverage: number;
  if (evaluable > 0) {
    const matchedEvaluable = evaluable - skillsMissing.length;
    coverage = matchedEvaluable / evaluable;
  } else {
    // No usable requirements on the job — grade on how substantial the skill list is.
    coverage = Math.min(1, skills.length / 5);
  }
  const skillScore = Math.round(coverage * 60);

  if (skillsMatched.length) strengths.push(`Matches ${skillsMatched.length} of ${requirements.length || 1} required skills`);
  if (evaluable > 0 && skillsMissing.length >= Math.ceil(evaluable / 2)) redFlags.push(`Missing ${skillsMissing.length} key requirement(s)`);
  if (skills.length === 0) redFlags.push("No technical skills provided");

  // ---------- 2. EXPERIENCE (0–25) ----------
  const years = parseYears(candidate.experienceYears, answers);
  let expScore: number;
  if (years === null) {
    expScore = 10; // unknown → neutral
  } else {
    expScore = Math.round(Math.min(1, years / 6) * 25);
    if (years >= 5) strengths.push(`${years}+ years of experience`);
    else if (years < 1) redFlags.push(`Very limited experience (${years} yr)`);
  }

  // ---------- 3. SCREENING & AVAILABILITY (0–10) ----------
  const requiredQs = (job.screeningQuestions || []).filter((q) => q.required);
  let answered = 0;
  requiredQs.forEach((q) => {
    const a = (answers[q.id] || answers[q.question] || "").toString().trim();
    if (a) answered += 1;
    else redFlags.push(`No answer for: "${q.question}"`);
  });
  const answeredRatio = requiredQs.length ? answered / requiredQs.length : 1;
  let screeningScore = answeredRatio * 6;

  const noticeText = Object.values(answers).join(" ").toLowerCase();
  if (/immediate|ready|15 ?day/.test(noticeText)) {
    screeningScore += 4;
    strengths.push("Immediate / short notice period");
  } else if (/30 ?day/.test(noticeText)) {
    screeningScore += 2;
  }
  screeningScore = Math.max(0, Math.min(10, Math.round(screeningScore)));

  // ---------- 4. PROFILE SIGNALS (0–5) ----------
  let profileScore = 0;
  if (candidate.linkedinUrl && candidate.linkedinUrl.toLowerCase().includes("linkedin")) {
    profileScore += 3;
    strengths.push("LinkedIn profile provided");
  }
  if (candidate.portfolioUrl && candidate.portfolioUrl.length > 5) profileScore += 2;

  // ---------- TOTAL ----------
  const overallScore = Math.max(0, Math.min(100, skillScore + expScore + screeningScore + profileScore));

  let recommendation: AtsAnalysis["recommendation"];
  if (overallScore >= 80) recommendation = "High Priority Shortlist";
  else if (overallScore >= 65) recommendation = "Strong Match";
  else if (overallScore >= 45) recommendation = "Potential Match";
  else recommendation = "Does Not Meet Requirements";

  if (strengths.length === 0) strengths.push("Application submitted with valid contact details");

  const matchSummary =
    `${candidate.fullName} scored ${overallScore}% — skills ${skillScore}/60, ` +
    `experience ${expScore}/25, screening ${screeningScore}/10, profile ${profileScore}/5. ` +
    `Matched ${skillsMatched.length}/${requirements.length || 1} required skills for ${job.title}.`;

  const experienceEvaluation =
    overallScore >= 80
      ? "Strong alignment with the role's required skills and experience."
      : overallScore >= 55
      ? "Meets core requirements; recommended for interview screening."
      : "Below the primary threshold for this role's requirements.";

  return {
    overallScore,
    skillsMatched,
    skillsMissing,
    experienceEvaluation,
    matchSummary,
    recommendation,
    strengths,
    redFlags,
    insufficientData: false,
  };
}
