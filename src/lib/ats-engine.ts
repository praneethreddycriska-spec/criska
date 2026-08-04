import { AtsAnalysis, JobPosting } from "@/types/ats";

/**
 * Automated ATS (Applicant Tracking System) Engine
 * Scans candidate application data, resume metadata/text, and screening answers
 * against job requirements to calculate match score, skills matrix, and evaluation summary.
 */
export function evaluateApplication(
  job: JobPosting,
  candidate: {
    fullName: string;
    technicalSkills?: string[];
    screeningAnswers: Record<string, string>;
    linkedinUrl?: string;
    portfolioUrl?: string;
  }
): AtsAnalysis {
  const requirements = job.requirements || [];
  const answers = candidate.screeningAnswers || {};

  // Extract all text content from candidate response and resume filename
  const combinedCandidateText = [
    candidate.fullName,
    (candidate.technicalSkills || []).join(" "),
    candidate.linkedinUrl || "",
    candidate.portfolioUrl || "",
    ...Object.values(answers),
  ]
    .join(" ")
    .toLowerCase();

  // 1. Skill & Keyword Matching
  const skillsMatched: string[] = [];
  const skillsMissing: string[] = [];

  requirements.forEach((req) => {
    // Extract key words from requirement string
    const keywords = req
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const isMatched = keywords.some((kw) => combinedCandidateText.includes(kw));

    if (isMatched || keywords.length === 0) {
      skillsMatched.push(req);
    } else {
      skillsMissing.push(req);
    }
  });

  const skillScoreRatio =
    requirements.length > 0 ? skillsMatched.length / requirements.length : 0.8;
  const skillScore = Math.round(skillScoreRatio * 45); // Max 45 points

  // 2. Screening Questions Evaluation
  let screeningScore = 35; // Default baseline out of 35
  const strengths: string[] = [];
  const redFlags: string[] = [];

  job.screeningQuestions.forEach((q) => {
    const answer = (answers[q.id] || answers[q.question] || "").toString().trim();
    if (!answer) {
      if (q.required) {
        screeningScore -= 8;
        redFlags.push(`Missing answer for required question: "${q.question}"`);
      }
      return;
    }

    // Check experience or numeric questions
    const numericVal = parseFloat(answer.replace(/[^\d.]/g, ""));
    if (!isNaN(numericVal)) {
      if (numericVal >= 3) {
        screeningScore += 3;
        strengths.push(`${numericVal}+ years relevant experience specified in screening`);
      } else if (numericVal < 1) {
        screeningScore -= 5;
        redFlags.push(`Low experience indicated: ${numericVal} years`);
      }
    } else if (answer.toLowerCase().includes("immediate") || answer.toLowerCase().includes("15 days")) {
      strengths.push("Immediate or quick notice period");
    }
  });

  screeningScore = Math.max(0, Math.min(35, screeningScore));

  // 3. Profile Completeness & Artifact Checks
  let bonusScore = 0;
  if (candidate.technicalSkills && candidate.technicalSkills.length > 0) bonusScore += 10;
  if (candidate.linkedinUrl && candidate.linkedinUrl.includes("linkedin.com")) bonusScore += 5;
  if (candidate.portfolioUrl && candidate.portfolioUrl.length > 5) bonusScore += 5;

  // Calculate Overall ATS Score (0 - 100)
  const overallScore = Math.min(100, Math.max(15, Math.round(skillScore + screeningScore + bonusScore)));

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
    strengths.push("Solid foundational background submitted");
  }
  if (skillsMatched.length > 0) {
    strengths.push(`Matches ${skillsMatched.length} of ${requirements.length || 1} core job requirements`);
  }

  const matchSummary = `${candidate.fullName} achieved an ATS match score of ${overallScore}%. Key strength in ${
    skillsMatched[0] || job.title
  }. Recommended for ${recommendation.toLowerCase()}.`;

  const experienceEvaluation =
    overallScore > 75
      ? "Demonstrates strong alignment with target role requirements and core tech stack."
      : "Meets basic criteria; recommended for further technical assessment.";

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
