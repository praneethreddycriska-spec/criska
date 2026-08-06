import { AtsAnalysis, JobPosting } from "@/types/ats";

// Common stop words to exclude during keyword extraction
const STOP_WORDS = new Set([
  "with", "from", "that", "this", "have", "more", "than", "years", "year", "and", "or",
  "for", "the", "in", "of", "to", "a", "an", "is", "are", "be", "must", "preferred",
  "experience", "deep", "hands", "on", "building", "design", "manage", "enforce"
]);

/**
 * Automated ATS (Applicant Tracking System) Engine
 * Accurately evaluates candidate application profiles against job requirements,
 * technical skill tags, experience levels, and screening answers.
 */
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
  }
): AtsAnalysis {
  const requirements = job.requirements || [];
  const answers = candidate.screeningAnswers || {};

  // Normalize candidate text profile
  const rawSkills = Array.isArray(candidate.technicalSkills)
    ? candidate.technicalSkills.join(" ")
    : String(candidate.technicalSkills || "");

  const candidateText = [
    candidate.fullName,
    rawSkills,
    candidate.linkedinUrl || "",
    candidate.portfolioUrl || "",
    candidate.currentCompany || "",
    candidate.experienceYears || "",
    candidate.projectSummary || "",
    ...Object.values(answers),
  ]
    .join(" ")
    .toLowerCase();

  // Tokenize candidate text for fast lookup
  const candidateWords = new Set(
    candidateText
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );

  // 1. Skill & Keyword Requirement Matching (Max 55 Points)
  const skillsMatched: string[] = [];
  const skillsMissing: string[] = [];

  requirements.forEach((req) => {
    // Tokenize requirement string into meaningful tech keywords
    const keywords = req
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

    if (keywords.length === 0) {
      skillsMatched.push(req);
      return;
    }

    // Check if candidate profile matches keywords in requirement
    const isMatched = keywords.some((kw) => {
      if (candidateWords.has(kw)) return true;
      if (candidateText.includes(kw)) return true;
      return false;
    });

    if (isMatched) {
      skillsMatched.push(req);
    } else {
      skillsMissing.push(req);
    }
  });

  const skillMatchRatio = requirements.length > 0 ? skillsMatched.length / requirements.length : 0.8;
  const skillScore = Math.round(skillMatchRatio * 55);

  // 2. Screening Questions & Experience Evaluation (Max 30 Points)
  let screeningScore = 20; // Default baseline out of 30
  const strengths: string[] = [];
  const redFlags: string[] = [];

  job.screeningQuestions.forEach((q) => {
    const answer = (answers[q.id] || answers[q.question] || "").toString().trim();
    if (!answer) {
      if (q.required) {
        screeningScore -= 6;
        redFlags.push(`Missing response for required question: "${q.question}"`);
      }
      return;
    }

    // Parse numeric experience answers
    const num = parseFloat(answer.replace(/[^\d.]/g, ""));
    if (!isNaN(num)) {
      if (num >= 4) {
        screeningScore += 5;
        strengths.push(`Senior experience level indicated (${num}+ years)`);
      } else if (num >= 2) {
        screeningScore += 3;
        strengths.push(`${num} years of relevant experience`);
      } else if (num < 1) {
        screeningScore -= 4;
        redFlags.push(`Junior experience reported (${num} years)`);
      }
    }

    const lowerAns = answer.toLowerCase();
    if (lowerAns.includes("immediate") || lowerAns.includes("15 days") || lowerAns.includes("ready")) {
      screeningScore += 2;
      strengths.push("Quick availability / Immediate notice period");
    }
  });

  screeningScore = Math.max(0, Math.min(30, screeningScore));

  // 3. Profile & Portfolio Bonus (Max 15 Points)
  let bonusScore = 0;
  if (candidate.technicalSkills && candidate.technicalSkills.length > 0) bonusScore += 7;
  if (candidate.linkedinUrl && candidate.linkedinUrl.includes("linkedin")) bonusScore += 4;
  if (candidate.portfolioUrl && candidate.portfolioUrl.length > 5) bonusScore += 4;

  // Calculate Overall ATS Score (0 - 100)
  const overallScore = Math.min(100, Math.max(20, Math.round(skillScore + screeningScore + bonusScore)));

  // Generate Recommendation Tier
  let recommendation: AtsAnalysis["recommendation"];
  if (overallScore >= 85) {
    recommendation = "High Priority Shortlist";
  } else if (overallScore >= 70) {
    recommendation = "Strong Match";
  } else if (overallScore >= 50) {
    recommendation = "Potential Match";
  } else {
    recommendation = "Does Not Meet Requirements";
  }

  if (strengths.length === 0) {
    strengths.push("Candidate profile submitted with verified contact details");
  }
  if (skillsMatched.length > 0) {
    strengths.push(`Matches ${skillsMatched.length} of ${requirements.length || 1} target role requirements`);
  }

  const matchSummary = `${candidate.fullName} scored ${overallScore}% ATS match. Matches ${skillsMatched.length}/${requirements.length || 1} key skill requirements for ${job.title}. Recommended for ${recommendation.toLowerCase()}.`;

  const experienceEvaluation =
    overallScore >= 80
      ? "Strong technical alignment with role requirements and tech stack."
      : overallScore >= 60
      ? "Demonstrates core technical background; suitable for interview evaluation."
      : "Below primary technical threshold; additional manual resume review recommended.";

  return {
    overallScore,
    skillsMatched,
    skillsMissing,
    experienceEvaluation,
    matchSummary,
    recommendation,
    strengths,
    redFlags,
  };
}
