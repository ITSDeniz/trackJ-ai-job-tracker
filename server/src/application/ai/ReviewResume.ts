import { AiService, ResumeReviewResult } from "../ports/AiService.js";

interface ReviewResumeInput {
  resumeText: string;
  targetJobDescription?: string;
}

export class ReviewResume {
  constructor(private aiService: AiService) {}

  async execute(input: ReviewResumeInput): Promise<ResumeReviewResult> {
    const resumeText = input.resumeText?.trim();
    if (!resumeText) {
      throw new Error("Resume text is required and cannot be empty.");
    }

    const targetJobDescription = input.targetJobDescription?.trim();

    return this.aiService.reviewResume(resumeText, targetJobDescription);
  }
}
