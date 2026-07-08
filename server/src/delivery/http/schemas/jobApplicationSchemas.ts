import { z } from "zod";

const StatusEnum = z.enum([
  "saved",
  "applied",
  "screening",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
  "archived",
]);

const PriorityEnum = z.enum(["low", "medium", "high"]);

const WorkModeEnum = z.enum(["remote", "hybrid", "onsite", "unknown"]);

const EmploymentTypeEnum = z.enum([
  "full_time",
  "part_time",
  "contract",
  "internship",
  "unknown",
]);

export const CreateJobApplicationSchema = z.object({
  body: z.object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company name must be at least 1 character."),
    title: z.string().trim().min(1, "Role title must be at least 1 character."),
    status: StatusEnum.default("saved"),
    priority: PriorityEnum.default("medium"),
    source: z.string().trim().nullable().optional(),
    jobPostingUrl: z.string().trim().url().nullable().optional().or(z.literal("")),
    location: z.string().trim().nullable().optional(),
    workMode: WorkModeEnum.default("unknown"),
    employmentType: EmploymentTypeEnum.default("unknown"),
    salaryMin: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(2147483647, "Salary must be less than 2,147,483,648")
      .nullable()
      .optional(),
    salaryMax: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(2147483647, "Salary must be less than 2,147,483,648")
      .nullable()
      .optional(),
    salaryCurrency: z.string().trim().max(10).nullable().optional(),
    appliedAt: z
      .string()
      .datetime({ precision: 3 })
      .transform((val) => new Date(val))
      .nullable()
      .optional(),
    nextActionAt: z
      .string()
      .datetime({ precision: 3 })
      .transform((val) => new Date(val))
      .nullable()
      .optional(),
    description: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
  }),
});

export const UpdateJobApplicationSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company name cannot be empty.")
      .optional(),
    title: z.string().trim().min(1, "Role title cannot be empty.").optional(),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    source: z.string().trim().nullable().optional(),
    jobPostingUrl: z.string().trim().url().nullable().optional().or(z.literal("")),
    location: z.string().trim().nullable().optional(),
    workMode: WorkModeEnum.optional(),
    employmentType: EmploymentTypeEnum.optional(),
    salaryMin: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(2147483647, "Salary must be less than 2,147,483,648")
      .nullable()
      .optional(),
    salaryMax: z.coerce
      .number()
      .int()
      .nonnegative()
      .max(2147483647, "Salary must be less than 2,147,483,648")
      .nullable()
      .optional(),
    salaryCurrency: z.string().trim().max(10).nullable().optional(),
    appliedAt: z
      .string()
      .datetime({ precision: 3 })
      .transform((val) => new Date(val))
      .nullable()
      .optional()
      .or(z.literal("")),
    nextActionAt: z
      .string()
      .datetime({ precision: 3 })
      .transform((val) => new Date(val))
      .nullable()
      .optional()
      .or(z.literal("")),
    closedAt: z
      .string()
      .datetime({ precision: 3 })
      .transform((val) => new Date(val))
      .nullable()
      .optional()
      .or(z.literal("")),
    description: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
  }),
});

export const GetJobApplicationsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(25),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    companyId: z.string().trim().optional(),
    location: z.string().trim().optional(),
    search: z.string().trim().optional(),
    nextActionBefore: z
      .string()
      .datetime({ precision: 3 })
      .transform((val) => new Date(val))
      .optional(),
    sort: z.string().trim().default("-createdAt"),
  }),
});
