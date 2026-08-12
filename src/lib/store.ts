import { JobPosting, JobApplication } from "@/types/ats";
import { evaluateApplication } from "./ats-engine";

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job-ai-ml-01",
    title: "AI / Machine Learning Engineer",
    department: "Artificial Intelligence",
    type: "Full-time",
    location: "Hyderabad / Remote",
    description:
      "Design and deploy production-grade Generative AI, LLM pipelines, and conversational AI agents for enterprise clients across finance and healthcare.",
    requirements: [
      "Python, PyTorch / TensorFlow & LangChain / LlamaIndex",
      "LLM fine-tuning, RAG architecture, and Vector DBs (Pinecone, Qdrant)",
      "REST & GraphQL API design for AI models",
      "3+ years experience building AI/ML applications",
    ],
    screeningQuestions: [
      {
        id: "q-exp",
        question: "Years of professional experience with AI/ML & LLMs?",
        type: "number",
        required: true,
      },
      {
        id: "q-notice",
        question: "What is your notice period / availability?",
        type: "select",
        options: ["Immediate", "15 Days", "30 Days", "60+ Days"],
        required: true,
      },
      {
        id: "q-project",
        question: "Briefly describe an AI or LLM application you brought to production.",
        type: "text",
        required: true,
      },
    ],
    status: "published",
    createdAt: "2026-07-15T09:00:00.000Z",
    updatedAt: "2026-07-15T09:00:00.000Z",
    applicationsCount: 3,
  },
  {
    id: "job-cloud-devops-02",
    title: "Cloud & DevOps Engineer",
    department: "Cloud Infrastructure",
    type: "Full-time",
    location: "Hyderabad / Remote",
    description:
      "Manage multi-cloud infrastructure (AWS, Azure, GCP), automate CI/CD pipelines with GitHub Actions, and enforce Terraform Infrastructure-as-Code.",
    requirements: [
      "AWS / Azure certification & deep hands-on expertise",
      "Docker, Kubernetes (EKS/AKS) & Terraform IaC",
      "CI/CD pipeline automation & monitoring (Prometheus, Datadog)",
      "Cybersecurity-first infrastructure hardening",
    ],
    screeningQuestions: [
      {
        id: "q-cloud-exp",
        question: "Years of experience with Kubernetes and Terraform?",
        type: "number",
        required: true,
      },
      {
        id: "q-certs",
        question: "List any cloud certifications you hold (AWS, Azure, GCP).",
        type: "text",
        required: false,
      },
    ],
    status: "published",
    createdAt: "2026-07-18T10:30:00.000Z",
    updatedAt: "2026-07-18T10:30:00.000Z",
    applicationsCount: 2,
  },
  {
    id: "job-cybersec-03",
    title: "Cybersecurity Analyst",
    department: "Cybersecurity",
    type: "Full-time",
    location: "Hyderabad",
    description:
      "Perform vulnerability management, penetration testing, SOC monitoring, and security compliance aligned to ISO 27001, SOC 2, and GDPR.",
    requirements: [
      "SIEM tools, Wireshark, Burp Suite & Nessus",
      "ISO 27001, SOC 2, and HIPAA compliance framework knowledge",
      "Incident response & threat hunting experience",
      "CEH, CISSP, or CompTIA Security+ certified preferred",
    ],
    screeningQuestions: [
      {
        id: "q-sec-cert",
        question: "Do you hold CEH, CISSP, or equivalent security certifications?",
        type: "select",
        options: ["Yes", "In Progress", "No"],
        required: true,
      },
    ],
    status: "published",
    createdAt: "2026-07-20T14:15:00.000Z",
    updatedAt: "2026-07-20T14:15:00.000Z",
    applicationsCount: 1,
  },
  {
    id: "job-fullstack-04",
    title: "Full-Stack Software Engineer",
    department: "Software Engineering",
    type: "Full-time",
    location: "Hyderabad / Remote",
    description:
      "Develop resilient web applications using Next.js, React 19, TypeScript, Node.js, and PostgreSQL with sleek UI/UX aesthetics.",
    requirements: [
      "Next.js App Router, React 19, TypeScript & Tailwind CSS",
      "Node.js / Express backend development & RESTful APIs",
      "PostgreSQL / Prisma / Supabase ORM experience",
      "Clean architecture & automated testing (Vitest, Playwright)",
    ],
    screeningQuestions: [
      {
        id: "q-stack",
        question: "Rate your expertise with Next.js 15+ and TypeScript.",
        type: "select",
        options: ["Expert (4+ yrs)", "Intermediate (2-4 yrs)", "Beginner (<2 yrs)"],
        required: true,
      },
    ],
    status: "published",
    createdAt: "2026-07-22T11:00:00.000Z",
    updatedAt: "2026-07-22T11:00:00.000Z",
    applicationsCount: 2,
  },
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-101",
    jobId: "job-ai-ml-01",
    jobTitle: "AI / Machine Learning Engineer",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    linkedinUrl: "https://linkedin.com/in/aarav-sharma-ai",
    portfolioUrl: "https://github.com/aarav-ai",
    technicalSkills: ["Python", "PyTorch", "LangChain", "LlamaIndex", "Pinecone", "RAG"],
    screeningAnswers: {
      "q-exp": "4.5",
      "q-notice": "Immediate",
      "q-project":
        "Architected an enterprise RAG system with LlamaIndex and Pinecone vector database serving 50k daily active queries.",
    },
    atsScore: 94,
    atsAnalysis: {
      overallScore: 94,
      skillsMatched: [
        "Python, PyTorch / TensorFlow & LangChain / LlamaIndex",
        "LLM fine-tuning, RAG architecture, and Vector DBs (Pinecone, Qdrant)",
        "REST & GraphQL API design for AI models",
        "3+ years experience building AI/ML applications",
      ],
      skillsMissing: [],
      experienceEvaluation: "Exceeds required qualifications with 4.5 years of production AI experience.",
      matchSummary: "Aarav Sharma achieved a 94% ATS match. Outstanding AI/ML background with proven RAG deployment.",
      recommendation: "High Priority Shortlist",
      strengths: [
        "4.5 years hands-on AI/LLM experience",
        "Immediate notice period",
        "Production experience with Pinecone and LlamaIndex",
      ],
      redFlags: [],
    },
    status: "shortlisted",
    adminNotes: "Excellent profile. Schedule technical round with Lead AI Architect.",
    createdAt: "2026-07-25T14:30:00.000Z",
  },
  {
    id: "app-102",
    jobId: "job-fullstack-04",
    jobTitle: "Full-Stack Software Engineer",
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 91234 56789",
    linkedinUrl: "https://linkedin.com/in/priya-patel-dev",
    portfolioUrl: "https://priyapatel.dev",
    technicalSkills: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Supabase"],
    screeningAnswers: {
      "q-stack": "Expert (4+ yrs)",
    },
    atsScore: 88,
    atsAnalysis: {
      overallScore: 88,
      skillsMatched: [
        "Next.js App Router, React 19, TypeScript & Tailwind CSS",
        "Node.js / Express backend development & RESTful APIs",
        "PostgreSQL / Prisma / Supabase ORM experience",
      ],
      skillsMissing: ["Clean architecture & automated testing (Vitest, Playwright)"],
      experienceEvaluation: "Strong frontend & backend skillset aligned to Next.js + Supabase stack.",
      matchSummary: "Priya Patel achieved an 88% ATS match score with expert Next.js and TypeScript background.",
      recommendation: "Strong Match",
      strengths: ["4+ years Next.js expertise", "Clean portfolio website", "Supabase & PostgreSQL proficiency"],
      redFlags: [],
    },
    status: "interviewing",
    adminNotes: "First round cleared. System design interview scheduled for Tuesday.",
    createdAt: "2026-07-26T10:15:00.000Z",
  },
  {
    id: "app-103",
    jobId: "job-cloud-devops-02",
    jobTitle: "Cloud & DevOps Engineer",
    fullName: "David Miller",
    email: "david.miller@example.com",
    phone: "+44 7911 123456",
    linkedinUrl: "https://linkedin.com/in/davidmiller-cloud",
    portfolioUrl: "",
    technicalSkills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    screeningAnswers: {
      "q-cloud-exp": "5",
      "q-certs": "AWS Solutions Architect Professional, CKA (Certified Kubernetes Administrator)",
    },
    atsScore: 78,
    atsAnalysis: {
      overallScore: 78,
      skillsMatched: [
        "AWS / Azure certification & deep hands-on expertise",
        "Docker, Kubernetes (EKS/AKS) & Terraform IaC",
      ],
      skillsMissing: ["Cybersecurity-first infrastructure hardening"],
      experienceEvaluation: "Certified DevOps engineer with 5 years Kubernetes and Terraform experience.",
      matchSummary: "David Miller scored 78% ATS match with AWS Solutions Architect and CKA credentials.",
      recommendation: "Strong Match",
      strengths: ["5 years Kubernetes & Terraform experience", "AWS & CKA certified"],
      redFlags: [],
    },
    status: "under_review",
    adminNotes: "Reviewing UK time zone availability.",
    createdAt: "2026-07-27T16:00:00.000Z",
  },
  {
    id: "app-104",
    jobId: "job-cybersec-03",
    jobTitle: "Cybersecurity Analyst",
    fullName: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 415 555 0199",
    linkedinUrl: "https://linkedin.com/in/sarah-jenkins-sec",
    portfolioUrl: "",
    technicalSkills: ["ISO 27001", "SOC 2", "SIEM", "Incident Response", "CISSP"],
    screeningAnswers: {
      "q-sec-cert": "Yes",
    },
    atsScore: 91,
    atsAnalysis: {
      overallScore: 91,
      skillsMatched: [
        "SIEM tools, Wireshark, Burp Suite & Nessus",
        "ISO 27001, SOC 2, and HIPAA compliance framework knowledge",
        "Incident response & threat hunting experience",
        "CEH, CISSP, or CompTIA Security+ certified preferred",
      ],
      skillsMissing: [],
      experienceEvaluation: "CISSP certified with extensive ISO 27001 and SOC 2 security compliance background.",
      matchSummary: "Sarah Jenkins achieved 91% ATS match score. CISSP certified security analyst.",
      recommendation: "High Priority Shortlist",
      strengths: ["CISSP Certification", "Comprehensive ISO 27001 & SOC 2 experience"],
      redFlags: [],
    },
    status: "shortlisted",
    adminNotes: "Shortlisted for Head of Security review.",
    createdAt: "2026-07-28T09:20:00.000Z",
  },
  {
    id: "app-105",
    jobId: "job-ai-ml-01",
    jobTitle: "AI / Machine Learning Engineer",
    fullName: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    phone: "+91 99887 76655",
    linkedinUrl: "",
    portfolioUrl: "",
    technicalSkills: ["Python"],
    screeningAnswers: {
      "q-exp": "0.5",
      "q-notice": "60+ Days",
      "q-project": "Completed online python tutorial.",
    },
    atsScore: 42,
    atsAnalysis: {
      overallScore: 42,
      skillsMatched: [],
      skillsMissing: [
        "Python, PyTorch / TensorFlow & LangChain / LlamaIndex",
        "LLM fine-tuning, RAG architecture, and Vector DBs (Pinecone, Qdrant)",
        "3+ years experience building AI/ML applications",
      ],
      experienceEvaluation: "Does not meet minimum 3 years production AI requirement.",
      matchSummary: "Vikram Reddy achieved 42% ATS match. Below required technical experience threshold.",
      recommendation: "Does Not Meet Requirements",
      strengths: [],
      redFlags: ["Less than 1 year experience", "60+ days notice period"],
    },
    status: "rejected",
    adminNotes: "Automated rejection sent due to experience mismatch.",
    createdAt: "2026-07-29T11:45:00.000Z",
  },
];

// Local Storage Keys
// v2: invalidates older caches that may contain seeded demo data.
const STORE_JOBS_KEY = "criska_ats_jobs_v2";
const STORE_APPS_KEY = "criska_ats_apps_v2";

/**
 * Get all job postings from the local cache. This is only a fallback used when
 * Supabase is unreachable — it must NEVER seed demo/sample data on a live site.
 */
export function getStoredJobs(): JobPosting[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save jobs list
 */
export function saveStoredJobs(jobs: JobPosting[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_JOBS_KEY, JSON.stringify(jobs));
}

/**
 * Get all applications from the local cache. Fallback only — never seeds the
 * fictional demo applicants into a real admin view.
 */
export function getStoredApplications(): JobApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save applications list
 */
export function saveStoredApplications(apps: JobApplication[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_APPS_KEY, JSON.stringify(apps));
}

/**
 * Submit a new candidate application: calculates ATS score and stores record
 */
export function submitNewApplication(
  job: JobPosting,
  candidateData: {
    fullName: string;
    email: string;
    phone: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    technicalSkills?: string[];
    screeningAnswers: Record<string, string>;
  }
): JobApplication {
  const atsAnalysis = evaluateApplication(job, candidateData);

  const newApp: JobApplication = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    fullName: candidateData.fullName,
    email: candidateData.email,
    phone: candidateData.phone,
    portfolioUrl: candidateData.portfolioUrl,
    linkedinUrl: candidateData.linkedinUrl,
    technicalSkills: candidateData.technicalSkills,
    screeningAnswers: candidateData.screeningAnswers,
    atsScore: atsAnalysis.overallScore,
    atsAnalysis,
    status: "new",
    adminNotes: "",
    createdAt: new Date().toISOString(),
  };

  const apps = getStoredApplications();
  const updatedApps = [newApp, ...apps];
  saveStoredApplications(updatedApps);

  // Update job application count
  const jobs = getStoredJobs();
  const updatedJobs = jobs.map((j) =>
    j.id === job.id ? { ...j, applicationsCount: (j.applicationsCount || 0) + 1 } : j
  );
  saveStoredJobs(updatedJobs);

  return newApp;
}
