import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Loader2,
  Lock,
  ThumbsUp,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/apiClient";

interface ResumeReviewResult {
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState<"review" | "analyzer" | "match" | "cover" | "interview">("review");
  const [resumeText, setResumeText] = useState("");
  const [targetJobDescription, setTargetJobDescription] = useState("");

  const reviewMutation = useMutation({
    mutationFn: async (payload: { resumeText: string; targetJobDescription?: string }) => {
      return apiClient.post<ResumeReviewResult>("/ai/review-resume", payload);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    reviewMutation.mutate({
      resumeText,
      targetJobDescription: targetJobDescription.trim() || undefined,
    });
  };

  const handleReset = () => {
    reviewMutation.reset();
    setResumeText("");
    setTargetJobDescription("");
  };

  const tabs = [
    { id: "review", label: "Resume Review", icon: FileText, disabled: false },
    { id: "analyzer", label: "Job Analyzer", icon: Sparkles, disabled: true },
    { id: "match", label: "Match Score", icon: TrendingUp, disabled: true },
    { id: "cover", label: "Cover Letter Gen", icon: Sparkles, disabled: true },
    { id: "interview", label: "Interview Prep", icon: Sparkles, disabled: true },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-ai" />
          AI Copilot Assistant
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Boost your application pipeline with structured Gemini LLM feedback.
        </p>
      </div>

      {/* Feature Tabs Nav */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id as "review" | "analyzer" | "match" | "cover" | "interview")}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : tab.disabled
                    ? "border-transparent text-muted-foreground/45 cursor-not-allowed"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
              {tab.disabled && (
                <Lock className="h-3 w-3 text-muted-foreground/30 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "review" && (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Input Form Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-base font-semibold text-foreground tracking-tight">
                Submit Resume Details
              </h2>
              <p className="text-xs text-muted-foreground leading-normal">
                Paste your raw resume text below. Include job experience, skills, and projects for analysis.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="resume" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Resume Text *
                  </label>
                  <textarea
                    id="resume"
                    required
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={reviewMutation.isPending}
                    rows={10}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                    placeholder="John Doe&#10;Software Engineer&#10;Experience: Worked on..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="jobDesc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Target Job Description (Optional)
                  </label>
                  <textarea
                    id="jobDesc"
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    disabled={reviewMutation.isPending}
                    rows={4}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                    placeholder="We are looking for a Software Engineer with 3+ years of React..."
                  />
                </div>

                {reviewMutation.isError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{reviewMutation.error?.message || "An unexpected error occurred."}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={reviewMutation.isPending || !resumeText.trim()}
                  >
                    {reviewMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Run AI Review
                      </>
                    )}
                  </Button>
                  {reviewMutation.isSuccess && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      title="Clear Analysis"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7">
            {reviewMutation.isIdle && (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No analysis yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-normal">
                  Provide your resume details on the left side and press "Run AI Review" to query the Gemini assistant.
                </p>
              </div>
            )}

            {reviewMutation.isPending && (
              <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Reviewing with Gemini AI</h3>
                <p className="text-xs text-muted-foreground max-w-sm leading-normal">
                  Reading structure, assessing metric impact, and drafting concrete recommendations...
                </p>
              </div>
            )}

            {reviewMutation.isSuccess && reviewMutation.data && (
              <div className="space-y-6">
                {/* Score & General Critique Box */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground tracking-tight">
                        Resume Assessment Report
                      </h2>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mt-0.5">
                        Generated by Gemini LLM
                      </span>
                    </div>
                    {/* Score Bubble */}
                    {(() => {
                      const score = reviewMutation.data.overallScore;
                      let colorClass = "text-primary bg-primary/10 border-primary/20";
                      if (score < 50) {
                        colorClass = "text-destructive bg-destructive/10 border-destructive/20";
                      } else if (score <= 70) {
                        colorClass = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                      } else if (score <= 85) {
                        colorClass = "text-primary bg-primary/10 border-primary/20";
                      } else {
                        colorClass = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <div className={`flex flex-col items-center justify-center border rounded-lg p-3 min-w-[70px] text-center ${colorClass}`}>
                            <span className="text-2xl font-bold">
                              {score}
                            </span>
                            <span className="text-[8px] uppercase tracking-wider font-semibold -mt-1 opacity-80">
                              Score
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Feedback description block */}
                  <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {reviewMutation.data.overallFeedback}
                  </div>
                </div>

                {/* Key lists columns grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Strengths */}
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border pb-2.5">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {reviewMutation.data.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                      {reviewMutation.data.strengths.length === 0 && (
                        <li className="text-xs text-muted-foreground italic">None noted.</li>
                      )}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border pb-2.5">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Areas of Improvement
                    </h3>
                    <ul className="space-y-2">
                      {reviewMutation.data.improvements.map((imp, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                      {reviewMutation.data.improvements.length === 0 && (
                        <li className="text-xs text-muted-foreground italic">None noted.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Detailed Actionable Recommendations */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border pb-2.5">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                    Actionable Recommendations
                  </h3>
                  <ol className="space-y-3">
                    {reviewMutation.data.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-3 leading-relaxed">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5">{rec}</span>
                      </li>
                    ))}
                    {reviewMutation.data.recommendations.length === 0 && (
                      <li className="text-xs text-muted-foreground italic">None noted.</li>
                    )}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
