import { prisma } from "./prismaClient.js";
import {
  Prisma,
  JobApplicationStatus,
  JobApplicationPriority,
  WorkMode,
  EmploymentType,
} from "@prisma/client";
import { JobApplication } from "../../domain/job-applications/JobApplication.js";
import {
  JobApplicationRepository,
  JobApplicationFilters,
  JobApplicationSort,
  JobApplicationPagination,
  CreateJobApplicationData,
} from "../../application/ports/JobApplicationRepository.js";

type PrismaAppResult = {
  id: string;
  userId: string;
  companyId: string;
  title: string;
  status: JobApplicationStatus;
  priority: JobApplicationPriority;
  source: string | null;
  jobPostingUrl: string | null;
  location: string | null;
  workMode: WorkMode;
  employmentType: EmploymentType;
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
  company: {
    name: string;
  };
};

export class PrismaJobApplicationRepository
  implements JobApplicationRepository
{
  private mapToDomain(dbApp: PrismaAppResult): JobApplication {
    return {
      id: dbApp.id,
      userId: dbApp.userId,
      companyId: dbApp.companyId,
      companyName: dbApp.company.name,
      title: dbApp.title,
      status: dbApp.status,
      priority: dbApp.priority,
      source: dbApp.source,
      jobPostingUrl: dbApp.jobPostingUrl,
      location: dbApp.location,
      workMode: dbApp.workMode,
      employmentType: dbApp.employmentType,
      salaryMin: dbApp.salaryMin,
      salaryMax: dbApp.salaryMax,
      salaryCurrency: dbApp.salaryCurrency,
      appliedAt: dbApp.appliedAt,
      nextActionAt: dbApp.nextActionAt,
      closedAt: dbApp.closedAt,
      description: dbApp.description,
      notes: dbApp.notes,
      createdAt: dbApp.createdAt,
      updatedAt: dbApp.updatedAt,
    };
  }

  async create(data: CreateJobApplicationData): Promise<JobApplication> {
    const created = await prisma.jobApplication.create({
      data: {
        userId: data.userId,
        companyId: data.companyId,
        title: data.title,
        status: data.status as JobApplicationStatus,
        priority: data.priority as JobApplicationPriority,
        source: data.source,
        jobPostingUrl: data.jobPostingUrl,
        location: data.location,
        workMode: (data.workMode || "unknown") as WorkMode,
        employmentType: (data.employmentType || "unknown") as EmploymentType,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        appliedAt: data.appliedAt,
        nextActionAt: data.nextActionAt,
        description: data.description,
        notes: data.notes,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<JobApplication | null> {
    const dbApp = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!dbApp) return null;
    return this.mapToDomain(dbApp as PrismaAppResult);
  }

  async findByUser(
    userId: string,
    filters: JobApplicationFilters,
    sort: JobApplicationSort,
    pagination: JobApplicationPagination
  ): Promise<{ data: JobApplication[]; total: number }> {
    const where: Prisma.JobApplicationWhereInput = { userId };

    if (filters.status) {
      where.status = filters.status as JobApplicationStatus;
    }
    if (filters.priority) {
      where.priority = filters.priority as JobApplicationPriority;
    }
    if (filters.companyId) {
      where.companyId = filters.companyId;
    }
    if (filters.nextActionBefore) {
      where.nextActionAt = {
        lte: filters.nextActionBefore,
      };
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        {
          company: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    const skip = (pagination.page - 1) * pagination.pageSize;
    const take = pagination.pageSize;

    const [dbApps, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: {
          [sort.field]: sort.direction,
        },
        skip,
        take,
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return {
      data: dbApps.map((app) => this.mapToDomain(app as PrismaAppResult)),
      total,
    };
  }

  async update(
    id: string,
    updates: Partial<JobApplication>
  ): Promise<JobApplication> {
    const updated = await prisma.jobApplication.update({
      where: { id },
      data: {
        companyId: updates.companyId,
        title: updates.title,
        status: updates.status as JobApplicationStatus,
        priority: updates.priority as JobApplicationPriority,
        source: updates.source,
        jobPostingUrl: updates.jobPostingUrl,
        location: updates.location,
        workMode: updates.workMode as WorkMode,
        employmentType: updates.employmentType as EmploymentType,
        salaryMin: updates.salaryMin,
        salaryMax: updates.salaryMax,
        salaryCurrency: updates.salaryCurrency,
        appliedAt: updates.appliedAt,
        nextActionAt: updates.nextActionAt,
        closedAt: updates.closedAt,
        description: updates.description,
        notes: updates.notes,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.jobApplication.delete({
      where: { id },
    });
  }
}
