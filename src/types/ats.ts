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

export interface ParsedResumeData {
  extractedSkills: string[];
  yearsExperienceEstimate: number;
  educationLevel: string;
  previousCompanies: string[];
  summaryHeadline: string;
}

export interface ScheduledInterview {
  id: string;
  interviewType: 'Technical Round' | 'HR Round' | 'System Design' | 'Executive Interview';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  interviewerName: string;
  interviewerEmail: string;
  meetingUrl: string;
  notes: string;
  createdAt: string;
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
  parsedResume?: ParsedResumeData;
  scheduledInterviews?: ScheduledInterview[];
  status: ApplicationStatus;
  adminNotes: string;
  shareToken?: string;
  createdAt: string;
  updatedAt?: string;
}
