import { JobApplication } from "../../domain/job-applications/JobApplication.js";
import {
  JobApplicationRepository,
  JobApplicationFilters,
  JobApplicationSort,
  JobApplicationPagination,
} from "../ports/JobApplicationRepository.js";

export interface GetJobApplicationsQuery {
  userId: string;
  filters: JobApplicationFilters;
  sort: JobApplicationSort;
  pagination: JobApplicationPagination;
}

export class GetJobApplications {
  constructor(private jobApplicationRepository: JobApplicationRepository) {}

  async execute(
    query: GetJobApplicationsQuery
  ): Promise<{ data: JobApplication[]; total: number }> {
    return this.jobApplicationRepository.findByUser(
      query.userId,
      query.filters,
      query.sort,
      query.pagination
    );
  }
}
