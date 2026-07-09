import { Router } from "express";
import { TaskController } from "../controllers/TaskController.js";

export const taskRouter = Router();
const controller = new TaskController();

taskRouter.get("/", (req, res, next) => controller.getAll(req, res, next));
taskRouter.post("/", (req, res, next) => controller.create(req, res, next));
taskRouter.put("/:id", (req, res, next) => controller.update(req, res, next));
taskRouter.delete("/:id", (req, res, next) => controller.delete(req, res, next));
