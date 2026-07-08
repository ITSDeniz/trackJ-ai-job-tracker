import { JobApplication } from "../../domain/job-applications/JobApplication.js";
import { JobApplicationRepository } from "../ports/JobApplicationRepository.js";
import { CompanyRepository } from "../ports/CompanyRepository.js";
import { NotFoundError } from "../../domain/shared/errors.js";

export interface UpdateJobApplicationCommand {
  id: string;
  userId: string;
  companyName?: string;
  title?: string;
  status?: string;
  priority?: string;
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
  closedAt?: Date | null;
  description?: string | null;
  notes?: string | null;
}

export class UpdateJobApplication {
  constructor(
    private jobApplicationRepository: JobApplicationRepository,
    private companyRepository: CompanyRepository
  ) {}

  async execute(command: UpdateJobApplicationCommand): Promise<JobApplication> {
    const app = await this.jobApplicationRepository.findById(command.id);
    if (!app || app.userId !== command.userId) {
      throw new NotFoundError("JobApplication", command.id);
    }

    const updates: Partial<JobApplication> = {};

    if (command.companyName !== undefined) {
      const trimmedCompany = command.companyName.trim();
      if (!trimmedCompany) {
        throw new Error("Company name cannot be empty.");
      }
      let company = await this.companyRepository.findByName(trimmedCompany, command.userId);
      if (!company) {
        company = await this.companyRepository.create(trimmedCompany, command.userId);
      }
      updates.companyId = company.id;
    }

    if (command.title !== undefined) updates.title = command.title.trim();
    if (command.status !== undefined) updates.status = command.status;
    if (command.priority !== undefined) updates.priority = command.priority;
    if (command.source !== undefined) updates.source = command.source;
    if (command.jobPostingUrl !== undefined)
      updates.jobPostingUrl = command.jobPostingUrl;
    if (command.location !== undefined) updates.location = command.location;
    if (command.workMode !== undefined) updates.workMode = command.workMode;
    if (command.employmentType !== undefined)
      updates.employmentType = command.employmentType;
    if (command.salaryMin !== undefined) updates.salaryMin = command.salaryMin;
    if (command.salaryMax !== undefined) updates.salaryMax = command.salaryMax;
    if (command.salaryCurrency !== undefined)
      updates.salaryCurrency = command.salaryCurrency;
    if (command.appliedAt !== undefined) updates.appliedAt = command.appliedAt;
    if (command.nextActionAt !== undefined)
      updates.nextActionAt = command.nextActionAt;
    if (command.closedAt !== undefined) updates.closedAt = command.closedAt;
    if (command.description !== undefined)
      updates.description = command.description;
    if (command.notes !== undefined) updates.notes = command.notes;

    return this.jobApplicationRepository.update(command.id, updates);
  }
}
