import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { ReviewResume } from "../../../application/ai/ReviewResume.js";
import { GeminiAiService } from "../../../infrastructure/ai/GeminiAiService.js";
import { prisma } from "../../../infrastructure/database/prismaClient.js";

const aiService = new GeminiAiService();
const reviewResumeUseCase = new ReviewResume(aiService);

export class AiController {
  async reviewResume(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user!.id;
    try {
      const { resumeText, targetJobDescription } = req.body;
      const result = await reviewResumeUseCase.execute({
        resumeText,
        targetJobDescription,
      });

      // Log successful AI operation to database
      await prisma.aIOperation.create({
        data: {
          userId,
          operationType: "resume_review",
          provider: "gemini",
          model: "gemini-1.5-flash",
          status: "success",
          completedAt: new Date(),
        },
      });

      res.status(200).json({
        data: result,
      });
    } catch (error: any) {
      // Log failed AI operation to database
      try {
        await prisma.aIOperation.create({
          data: {
            userId,
            operationType: "resume_review",
            provider: "gemini",
            model: "gemini-1.5-flash",
            status: "error",
            errorCode: error.message || "unknown_error",
          },
        });
      } catch (logDbError) {
        console.error("Failed to log AIOperation to database:", logDbError);
      }
      next(error);
    }
  }
}
