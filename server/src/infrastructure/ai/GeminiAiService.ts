import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  AiService,
  ResumeReviewResult,
} from "../../application/ports/AiService.js";

export class GeminiAiService implements AiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn(
        "WARNING: GEMINI_API_KEY environment variable is not defined.",
      );
    }
  }

  async reviewResume(
    resumeText: string,
    targetJobDescription?: string,
  ): Promise<ResumeReviewResult> {
    if (!this.genAI) {
      throw new Error(
        "AI service is currently unavailable. Please configure GEMINI_API_KEY on the server.",
      );
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              overallScore: {
                type: SchemaType.INTEGER,
                description:
                  "Overall resume score from 0 to 100 based on formatting, action verbs, clear impact, and style.",
              },
              overallFeedback: {
                type: SchemaType.STRING,
                description:
                  "Detailed multi-paragraph overview feedback critique of the resume.",
              },
              strengths: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description:
                  "Key strengths observed in the resume content or layout descriptions.",
              },
              improvements: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description:
                  "Specific formatting, content structure, or phrasing parts to improve.",
              },
              recommendations: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description:
                  "Actionable concrete tips or rewrites using impact-focused metrics.",
              },
            },
            required: [
              "overallScore",
              "overallFeedback",
              "strengths",
              "improvements",
              "recommendations",
            ],
          },
        },
      });

      const prompt = `
        You are an expert technical recruiter and resume consultant. Review the candidate resume below.
        Provide constructive, high-impact critiques focusing on professional impact, results, layout structure, and language.
        
        Evaluate the resume objectively according to this scoring rubric, adjusted for the applicant's career level (e.g. student vs. experienced professional):
        - 0 to 30: Non-resume inputs, extremely short/low-effort text (less than 100 words), or placeholders.
        - 31 to 50: Poorly written or severely incomplete resume with major grammatical/formatting flaws, or lacking any real details.
        - 51 to 70: A solid entry-level, student, or average professional resume. Has good structure and relevant skills, but has room to grow in terms of impact metrics and active language.
        - 71 to 85: A strong professional resume with clear achievements, good formatting, and relevant experience.
        - 86 to 100: An outstanding, world-class resume with extensive quantified metrics (%, $, time saved) for nearly all roles and perfect formatting.
        
        Evaluate the resume realistically based on its context. If it's a student or junior resume, do not penalize them for not having 10 years of experience, but check if their internships, projects, and skills are well-presented.
        
        ${targetJobDescription
          ? `Compare and tailor the suggestions against this Target Job Description:\n${targetJobDescription}\n`
          : ""
        }
        
        Resume text:
        ---
        ${resumeText}
        ---
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const parsed = JSON.parse(text) as ResumeReviewResult;
      return parsed;
    } catch (err: any) {
      console.error("Gemini API call failed:", err);
      throw new Error(
        "Failed to generate resume review. Gemini API error: " +
        (err.message || err),
      );
    }
  }
}
