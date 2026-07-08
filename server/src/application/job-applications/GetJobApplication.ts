import { JobApplication } from "../../domain/job-applications/JobApplication.js";
import { JobApplicationRepository } from "../ports/JobApplicationRepository.js";
import { NotFoundError } from "../../domain/shared/errors.js";

export class GetJobApplication {
  constructor(private jobApplicationRepository: JobApplicationRepository) {}

  async execute(id: string, userId: string): Promise<JobApplication> {
    const app = await this.jobApplicationRepository.findById(id);
    if (!app || app.userId !== userId) {
      throw new NotFoundError("JobApplication", id);
    }
    return app;
  }
}
