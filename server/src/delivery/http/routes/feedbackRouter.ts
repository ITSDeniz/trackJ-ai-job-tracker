import { Router } from "express";
import { FeedbackController } from "../controllers/FeedbackController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { CreateFeedbackSchema } from "../schemas/feedbackSchemas.js";
import { feedbackRateLimiter } from "../middleware/rateLimiter.js";

export const feedbackRouter = Router();
const controller = new FeedbackController();

feedbackRouter.post(
  "/",
  feedbackRateLimiter,
  validateRequest(CreateFeedbackSchema),
  (req, res, next) => controller.create(req, res, next),
);
