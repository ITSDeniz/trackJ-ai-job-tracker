import { z } from "zod";

export const CreateFeedbackSchema = z.object({
  body: z.object({
    message: z
      .string()
      .trim()
      .min(1, "Feedback message cannot be empty.")
      .max(2000, "Feedback message must be under 2000 characters."),
    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1.")
      .max(5, "Rating cannot be more than 5.")
      .nullable()
      .optional(),
  }),
});
