import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/AuthController.js";
import { validateRequest } from "../middleware/validateRequest.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

export const authRouter = Router();
const controller = new AuthController();

const RegisterSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    name: z.string().trim().optional(),
  }),
});

const LoginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
  }),
});

authRouter.post(
  "/register",
  validateRequest(RegisterSchema),
  (req, res, next) => controller.register(req, res, next),
);

authRouter.post("/login", validateRequest(LoginSchema), (req, res, next) =>
  controller.login(req, res, next),
);

authRouter.get("/me", authMiddleware, (req, res, next) =>
  controller.me(req, res, next),
);
