import { z } from "zod";

export const UpdateProfileSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .optional(),
    name: z
      .string()
      .trim()
      .max(100, "Name must be under 100 characters.")
      .nullable()
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .optional(),
  }),
});
