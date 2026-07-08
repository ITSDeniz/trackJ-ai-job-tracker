import { JobApplicationRepository } from "../ports/JobApplicationRepository.js";
import { NotFoundError } from "../../domain/shared/errors.js";

export class DeleteJobApplication {
  constructor(private jobApplicationRepository: JobApplicationRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const app = await this.jobApplicationRepository.findById(id);
    if (!app || app.userId !== userId) {
      throw new NotFoundError("JobApplication", id);
    }
    await this.jobApplicationRepository.delete(id);
  }
}
