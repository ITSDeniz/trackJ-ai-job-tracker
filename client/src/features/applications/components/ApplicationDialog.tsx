import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/apiClient";

export interface JobApplicationData {
  id?: string;
  title: string;
  companyName: string;
  status: string;
  priority: string;
  source: string | null;
  jobPostingUrl: string | null;
  location: string | null;
  workMode: string | null;
  employmentType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  description: string | null;
  notes: string | null;
}

interface ApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<JobApplicationData>) => Promise<void>;
  application?: JobApplicationData | null;
}

export function ApplicationDialog({
  isOpen,
  onClose,
  onSave,
  application,
}: ApplicationDialogProps) {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("saved");
  const [priority, setPriority] = useState("medium");
  const [source, setSource] = useState("");
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("unknown");
  const [employmentType, setEmploymentType] = useState("unknown");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (application) {
      setTitle(application.title || "");
      setCompanyName(application.companyName || "");
      setStatus(application.status || "saved");
      setPriority(application.priority || "medium");
      setSource(application.source || "");
      setJobPostingUrl(application.jobPostingUrl || "");
      setLocation(application.location || "");
      setWorkMode(application.workMode || "unknown");
      setEmploymentType(application.employmentType || "unknown");
      setSalaryMin(application.salaryMin !== null ? String(application.salaryMin) : "");
      setSalaryMax(application.salaryMax !== null ? String(application.salaryMax) : "");
      setSalaryCurrency(application.salaryCurrency || "USD");
      setDescription(application.description || "");
      setNotes(application.notes || "");
    } else {
      setTitle("");
      setCompanyName("");
      setStatus("saved");
      setPriority("medium");
      setSource("");
      setJobPostingUrl("");
      setLocation("");
      setWorkMode("unknown");
      setEmploymentType("unknown");
      setSalaryMin("");
      setSalaryMax("");
      setSalaryCurrency("USD");
      setDescription("");
      setNotes("");
    }
    setErrorMsg(null);
    setFieldErrors({});
  }, [application, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setFieldErrors({});

    const data: Partial<JobApplicationData> = {
      title,
      companyName,
      status,
      priority,
      source: source || null,
      jobPostingUrl: jobPostingUrl || null,
      location: location || null,
      workMode: workMode || null,
      employmentType: employmentType || null,
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      salaryCurrency: salaryMin || salaryMax ? salaryCurrency : null,
      description: description || null,
      notes: notes || null,
    };

    try {
      await onSave(data);
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
        if (err.fields) {
          setFieldErrors(err.fields);
        }
      } else {
        setErrorMsg("An unexpected error occurred. Please verify your fields.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-lg flex flex-col" style={{ maxHeight: 'min(90vh, 700px)' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">
            {application ? "Edit Application" : "Add Job Application"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
            type="button"
          >
            Close
          </button>
        </div>

        {/* Content Form — body scrolls, footer is outside and always visible */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Role Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Role Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Software Engineer"
                />
                {fieldErrors.title && (
                  <p className="text-xs text-destructive">{fieldErrors.title[0]}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label htmlFor="company" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Company Name *
                </label>
                <input
                  id="company"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Stripe"
                />
                {fieldErrors.companyName && (
                  <p className="text-xs text-destructive">{fieldErrors.companyName[0]}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label htmlFor="status" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Pipeline Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label htmlFor="priority" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Location (City, Country)
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Remote, NY, London"
                />
              </div>

              {/* Work Mode */}
              <div className="space-y-1.5">
                <label htmlFor="work-mode" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Work Mode
                </label>
                <select
                  id="work-mode"
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="unknown">Select Mode</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label htmlFor="employment-type" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Employment Type
                </label>
                <select
                  id="employment-type"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="unknown">Select Type</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Source */}
              <div className="space-y-1.5">
                <label htmlFor="source" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Source / Channel
                </label>
                <input
                  id="source"
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="LinkedIn, Referral, Careers page"
                />
              </div>

              {/* Posting URL */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="posting-url" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Job Posting URL
                </label>
                <input
                  id="posting-url"
                  type="url"
                  value={jobPostingUrl}
                  onChange={(e) => setJobPostingUrl(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="https://company.com/jobs/123"
                />
                {fieldErrors.jobPostingUrl && (
                  <p className="text-xs text-destructive">{fieldErrors.jobPostingUrl[0]}</p>
                )}
              </div>

              {/* Salary Fields */}
              <div className="space-y-1.5">
                <label htmlFor="salary-min" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Min Salary
                </label>
                <input
                  id="salary-min"
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="90000"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label htmlFor="salary-max" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Max Salary
                  </label>
                  <input
                    id="salary-max"
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="120000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="salary-currency" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Currency
                  </label>
                  <input
                    id="salary-currency"
                    type="text"
                    value={salaryCurrency}
                    onChange={(e) => setSalaryCurrency(e.target.value)}
                    className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="USD"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="description" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Job Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                  placeholder="Paste roles details or responsibilities..."
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="notes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Personal Notes / Follow-ups
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                  placeholder="Questions to ask, recruiters, referrers..."
                />
              </div>
            </div>
          </div>

          {/* Footer Actions — always anchored at bottom, outside scroll area */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-card">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} id="submit-application-btn">
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : application ? (
                "Save Changes"
              ) : (
                "Create Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
