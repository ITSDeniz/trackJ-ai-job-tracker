import { describe, it, expect, vi } from "vitest";
import { ReviewResume } from "./ReviewResume.js";
import { AiService, ResumeReviewResult } from "../ports/AiService.js";

describe("ReviewResume Use Case", () => {
  const mockResult: ResumeReviewResult = {
    overallScore: 85,
    overallFeedback: "Good resume structure.",
    strengths: ["Clear achievements"],
    improvements: ["Add metrics"],
    recommendations: ["Use action verbs"],
  };

  const mockAiService: AiService = {
    reviewResume: vi.fn().mockResolvedValue(mockResult),
  };

  it("should throw an error if resumeText is empty", async () => {
    const useCase = new ReviewResume(mockAiService);
    await expect(useCase.execute({ resumeText: "" })).rejects.toThrow(
      "Resume text is required and cannot be empty.",
    );
  });

  it("should execute correctly with valid input", async () => {
    const useCase = new ReviewResume(mockAiService);
    const result = await useCase.execute({
      resumeText: "John Doe - Software Engineer",
      targetJobDescription: "Senior React Developer",
    });

    expect(mockAiService.reviewResume).toHaveBeenCalledWith(
      "John Doe - Software Engineer",
      "Senior React Developer",
    );
    expect(result).toEqual(mockResult);
  });
});
