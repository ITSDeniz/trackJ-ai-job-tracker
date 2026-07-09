import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title must be at least 1 character.")
    .max(200, "Task title must be under 200 characters."),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be under 2000 characters.")
    .nullable()
    .optional(),
  dueAt: z
    .string()
    .datetime({ message: "Due date must be a valid ISO 8601 datetime string." }),
  jobApplicationId: z
    .string()
    .trim()
    .nullable()
    .optional(),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title must be at least 1 character.")
    .max(200, "Task title must be under 200 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be under 2000 characters.")
    .nullable()
    .optional(),
  dueAt: z
    .string()
    .datetime({ message: "Due date must be a valid ISO 8601 datetime string." })
    .optional(),
  jobApplicationId: z
    .string()
    .trim()
    .nullable()
    .optional(),
  completed: z
    .boolean()
    .optional(),
});
