import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/healthRouter.js";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/health", healthRouter);

  return app;
}
