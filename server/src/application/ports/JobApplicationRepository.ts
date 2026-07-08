import { JobApplication } from "../../domain/job-applications/JobApplication.js";

export interface JobApplicationFilters {
  status?: string;
  priority?: string;
  companyId?: string;
  search?: string;
  nextActionBefore?: Date;
}

export interface JobApplicationSort {
  field: string;
  direction: "asc" | "desc";
}

export interface JobApplicationPagination {
  page: number;
  pageSize: number;
}

export interface CreateJobApplicationData {
  userId: string;
  companyId: string;
  title: string;
  status: string;
  priority: string;
  source?: string | null;
  jobPostingUrl?: string | null;
  location?: string | null;
  workMode?: string | null;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  appliedAt?: Date | null;
  nextActionAt?: Date | null;
  description?: string | null;
  notes?: string | null;
}

export interface JobApplicationRepository {
  create(data: CreateJobApplicationData): Promise<JobApplication>;
  findById(id: string): Promise<JobApplication | null>;
  findByUser(
    userId: string,
    filters: JobApplicationFilters,
    sort: JobApplicationSort,
    pagination: JobApplicationPagination
  ): Promise<{ data: JobApplication[]; total: number }>;
  update(id: string, updates: Partial<JobApplication>): Promise<JobApplication>;
  delete(id: string): Promise<void>;
}
