import { Router } from "express";
import { JobApplicationController } from "../controllers/JobApplicationController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  CreateJobApplicationSchema,
  UpdateJobApplicationSchema,
  GetJobApplicationsQuerySchema,
} from "../schemas/jobApplicationSchemas.js";

export const jobApplicationRouter = Router();
const controller = new JobApplicationController();

jobApplicationRouter.get(
  "/",
  validateRequest(GetJobApplicationsQuerySchema),
  (req, res, next) => controller.getAll(req, res, next)
);

jobApplicationRouter.post(
  "/",
  validateRequest(CreateJobApplicationSchema),
  (req, res, next) => controller.create(req, res, next)
);

jobApplicationRouter.get("/:id", (req, res, next) =>
  controller.getOne(req, res, next)
);

jobApplicationRouter.patch(
  "/:id",
  validateRequest(UpdateJobApplicationSchema),
  (req, res, next) => controller.update(req, res, next)
);

jobApplicationRouter.delete("/:id", (req, res, next) =>
  controller.delete(req, res, next)
);
