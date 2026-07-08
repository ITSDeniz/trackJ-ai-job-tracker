import { Router } from "express";
import { AiController } from "../controllers/AiController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { ReviewResumeSchema } from "../schemas/aiSchemas.js";

export const aiRouter = Router();
const controller = new AiController();

aiRouter.post(
  "/review-resume",
  validateRequest(ReviewResumeSchema),
  (req, res, next) => controller.reviewResume(req, res, next),
);
