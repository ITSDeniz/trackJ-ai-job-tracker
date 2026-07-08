import { JobApplication } from "../../domain/job-applications/JobApplication.js";
import { JobApplicationRepository } from "../ports/JobApplicationRepository.js";
import { CompanyRepository } from "../ports/CompanyRepository.js";

export interface CreateJobApplicationCommand {
  userId: string;
  companyName: string;
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

export class CreateJobApplication {
  constructor(
    private jobApplicationRepository: JobApplicationRepository,
    private companyRepository: CompanyRepository
  ) {}

  async execute(command: CreateJobApplicationCommand): Promise<JobApplication> {
    const trimmedCompanyName = command.companyName.trim();
    if (!trimmedCompanyName) {
      throw new Error("Company name cannot be empty.");
    }

    let company = await this.companyRepository.findByName(trimmedCompanyName, command.userId);
    if (!company) {
      company = await this.companyRepository.create(trimmedCompanyName, command.userId);
    }

    return this.jobApplicationRepository.create({
      userId: command.userId,
      companyId: company.id,
      title: command.title.trim(),
      status: command.status,
      priority: command.priority,
      source: command.source || null,
      jobPostingUrl: command.jobPostingUrl || null,
      location: command.location || null,
      workMode: command.workMode || null,
      employmentType: command.employmentType || null,
      salaryMin: command.salaryMin || null,
      salaryMax: command.salaryMax || null,
      salaryCurrency: command.salaryCurrency || null,
      appliedAt: command.appliedAt || null,
      nextActionAt: command.nextActionAt || null,
      description: command.description || null,
      notes: command.notes || null,
    });
  }
}
