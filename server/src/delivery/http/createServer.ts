import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/healthRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { jobApplicationRouter } from "./routes/jobApplicationRouter.js";
import { companyRouter } from "./routes/companyRouter.js";
import { aiRouter } from "./routes/aiRouter.js";
import { taskRouter } from "./routes/taskRouter.js";
import { feedbackRouter } from "./routes/feedbackRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { loadConfig } from "../../config/loadConfig.js";

export function createServer() {
  const app = express();
  const config = loadConfig();

  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://track-j-ai-job-tracker-client.vercel.app",
        "http://localhost:5173",
        "http://localhost:4173",
      ];
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,
  }));
  app.use(express.json({ limit: "1mb" }));

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
  app.use("/api/v1/feedbacks", authMiddleware, feedbackRouter);

  app.use(errorHandler);

  return app;
}
