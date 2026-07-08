export interface ResumeReviewResult {
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface AiService {
  reviewResume(
    resumeText: string,
    targetJobDescription?: string,
  ): Promise<ResumeReviewResult>;
}
