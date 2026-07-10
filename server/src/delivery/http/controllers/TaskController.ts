import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { prisma } from "../../../infrastructure/database/prismaClient.js";
import { CreateTaskSchema, UpdateTaskSchema } from "../schemas/taskSchemas.js";

export class TaskController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const tasks = await prisma.task.findMany({
        where: { userId },
        include: {
          jobApplication: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { dueAt: "asc" },
      });

      res.status(200).json({
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const result = CreateTaskSchema.safeParse(req.body);
      if (!result.success) {
        res.status(422).json({
          error: {
            code: "validation_error",
            message: "Validation failed",
            fields: result.error.flatten().fieldErrors,
          },
        });
        return;
      }

      const body = result.data;

      // Verify job application belongs to the user if linked
      if (body.jobApplicationId) {
        const app = await prisma.jobApplication.findFirst({
          where: { id: body.jobApplicationId, userId },
        });
        if (!app) {
          res.status(400).json({
            error: {
              code: "not_found",
              message: "Linked job application not found.",
            },
          });
          return;
        }
      }

      const task = await prisma.task.create({
        data: {
          userId,
          title: body.title,
          description: body.description || null,
          dueAt: new Date(body.dueAt),
          jobApplicationId: body.jobApplicationId || null,
          source: "user",
        },
        include: {
          jobApplication: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: "Task ID is required" });
        return;
      }

      const existing = await prisma.task.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      const result = UpdateTaskSchema.safeParse(req.body);
      if (!result.success) {
        res.status(422).json({
          error: {
            code: "validation_error",
            message: "Validation failed",
            fields: result.error.flatten().fieldErrors,
          },
        });
        return;
      }

      const body = result.data;

      // Verify job application belongs to user if linked
      if (body.jobApplicationId) {
        const app = await prisma.jobApplication.findFirst({
          where: { id: body.jobApplicationId, userId },
        });
        if (!app) {
          res.status(400).json({
            error: {
              code: "not_found",
              message: "Linked job application not found.",
            },
          });
          return;
        }
      }

      // Calculate completedAt
      let completedAt = existing.completedAt;
      if (body.completed !== undefined) {
        completedAt = body.completed ? new Date() : null;
      }

      const updated = await prisma.task.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
          jobApplicationId: body.jobApplicationId,
          completedAt,
        },
        include: {
          jobApplication: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: "Task ID is required" });
        return;
      }

      const existing = await prisma.task.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      await prisma.task.delete({
        where: { id },
      });

      res.status(200).json({
        message: "Task deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}
