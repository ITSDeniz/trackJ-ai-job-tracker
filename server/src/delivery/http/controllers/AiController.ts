import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { ReviewResume } from "../../../application/ai/ReviewResume.js";
import { GeminiAiService } from "../../../infrastructure/ai/GeminiAiService.js";

const aiService = new GeminiAiService();
const reviewResumeUseCase = new ReviewResume(aiService);

export class AiController {
  async reviewResume(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { resumeText, targetJobDescription } = req.body;
      const result = await reviewResumeUseCase.execute({
        resumeText,
        targetJobDescription,
      });

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
