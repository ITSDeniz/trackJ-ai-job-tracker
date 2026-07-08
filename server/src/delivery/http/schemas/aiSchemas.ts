import { z } from "zod";

export const ReviewResumeSchema = z.object({
  body: z.object({
    resumeText: z.string().trim().min(1, "Resume text cannot be empty."),
    targetJobDescription: z.string().trim().optional(),
  }),
});
