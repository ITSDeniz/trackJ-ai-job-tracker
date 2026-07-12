import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { prisma } from "../../../infrastructure/database/prismaClient.js";

export class FeedbackController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { message, rating } = req.body;

      const feedback = await prisma.feedback.create({
        data: {
          userId,
          message,
          rating: rating || null,
        },
      });

      res.status(201).json({
        data: feedback,
      });
    } catch (error) {
      next(error);
    }
  }
}
