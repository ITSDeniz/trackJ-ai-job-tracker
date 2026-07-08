export interface JobApplication {
  id: string;
  userId: string;
  companyId: string;
  companyName?: string; // Populated dynamically or via join queries
  title: string;
  status: string;
  priority: string;
  source: string | null;
  jobPostingUrl: string | null;
  location: string | null;
  workMode: string | null;
  employmentType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  appliedAt: Date | null;
  nextActionAt: Date | null;
  closedAt: Date | null;
  description: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
