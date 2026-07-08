import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/healthRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { jobApplicationRouter } from "./routes/jobApplicationRouter.js";
import { companyRouter } from "./routes/companyRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url} - body:`, req.body);
    next();
  });

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/job-applications", authMiddleware, jobApplicationRouter);
  app.use("/api/v1/companies", authMiddleware, companyRouter);

  app.use(errorHandler);

  return app;
}
