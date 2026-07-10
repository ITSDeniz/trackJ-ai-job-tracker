import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/healthRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { jobApplicationRouter } from "./routes/jobApplicationRouter.js";
import { companyRouter } from "./routes/companyRouter.js";
import { aiRouter } from "./routes/aiRouter.js";
import { taskRouter } from "./routes/taskRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { loadConfig } from "../../config/loadConfig.js";

export function createServer() {
  const app = express();
  const config = loadConfig();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  if (config.nodeEnv !== "production") {
    app.use((req, res, next) => {
      const bodyCopy = req.body ? { ...req.body } : null;
      if (bodyCopy && typeof bodyCopy === "object") {
        if ("password" in bodyCopy) {
          bodyCopy.password = "[REDACTED]";
        }
      }
      console.log(`[HTTP] ${req.method} ${req.url} - body:`, bodyCopy);
      next();
    });
  }

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/job-applications", authMiddleware, jobApplicationRouter);
  app.use("/api/v1/companies", authMiddleware, companyRouter);
  app.use("/api/v1/tasks", authMiddleware, taskRouter);
  app.use("/api/v1/ai", authMiddleware, aiRouter);

  app.use(errorHandler);

  return app;
}
