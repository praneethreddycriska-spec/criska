export type ScreeningQuestionType = 'text' | 'number' | 'select';

export interface ScreeningQuestion {
  id: string;
  question: string;
  type: ScreeningQuestionType;
  options?: string[];
  required: boolean;
  idealAnswer?: string;
}

export type JobStatus = 'draft' | 'published' | 'closed';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  screeningQuestions: ScreeningQuestion[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

export type ApplicationStatus =
  | 'new'
  | 'under_review'
  | 'shortlisted'
  | 'interviewing'
  | 'hired'
  | 'rejected';

export interface AtsAnalysis {
  overallScore: number; // 0 - 100
  skillsMatched: string[];
  skillsMissing: string[];
  experienceEvaluation: string;
  matchSummary: string;
  recommendation: 'High Priority Shortlist' | 'Strong Match' | 'Potential Match' | 'Does Not Meet Requirements';
  strengths: string[];
  redFlags: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  resumeUrl: string;
  resumeFilename: string;
  screeningAnswers: Record<string, string>;
  atsScore: number;
  atsAnalysis: AtsAnalysis;
  status: ApplicationStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt?: string;
}
