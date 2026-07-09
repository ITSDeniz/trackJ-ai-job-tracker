import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Globe,
  MapPin,
  Briefcase,
  Trash2,
  Edit3,
  X,
  Plus,
  AlertTriangle,
  Info,
} from "lucide-react";
import { apiClient } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";

interface CompanyData {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  _count?: {
    jobApplications: number;
  };
}

interface CompanyResponse {
  data: CompanyData[];
}

export function CompaniesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch Companies
  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      return apiClient.get<CompanyResponse>("/companies");
    },
  });

  const companies = data?.data || [];

  // Filtered list
  const filteredCompanies = companies.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.location && c.location.toLowerCase().includes(term)) ||
      (c.industry && c.industry.toLowerCase().includes(term))
    );
  });

  // Mutate Edit
  const editMutation = useMutation({
    mutationFn: async (updated: Partial<CompanyData>) => {
      return apiClient.put<any>(`/companies/${selectedCompany?.id}`, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setSuccessMessage("Company details updated successfully.");
      setIsEditing(false);
      // Update selected company view
      const updated = companies.find((c) => c.id === selectedCompany?.id);
      if (updated) {
        setSelectedCompany({
          ...selectedCompany!,
          website: website || null,
          location: location || null,
          industry: industry || null,
          size: size || null,
          notes: notes || null,
        });
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to update details.");
      setTimeout(() => setErrorMessage(null), 4000);
    },
  });

  // Mutate Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete<any>(`/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setSelectedCompany(null);
      setSuccessMessage("Company deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to delete company.");
      setTimeout(() => setErrorMessage(null), 5000);
    },
  });

  const handleOpenDetails = (company: CompanyData) => {
    setSelectedCompany(company);
    setWebsite(company.website || "");
    setLocation(company.location || "");
    setIndustry(company.industry || "");
    setSize(company.size || "");
    setNotes(company.notes || "");
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate website format if entered
    if (website && !website.startsWith("http://") && !website.startsWith("https://")) {
      setErrorMessage("Website URL must start with http:// or https://");
      return;
    }

    editMutation.mutate({
      website: website || null,
      location: location || null,
      industry: industry || null,
      size: size || null,
      notes: notes || null,
    });
  };

  const handleDelete = (id: string, name: string, appCount: number) => {
    if (appCount > 0) {
      setErrorMessage(`Cannot delete "${name}" because it has ${appCount} active job application(s).`);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Stats */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight sm:text-3xl">
            Target Companies
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            View details, websites, locations, and active applications for each employer.
          </p>
        </div>
      </section>

      {/* Alert Notices */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Header panel */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by company name, location, or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 border border-border bg-card rounded-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
          <p className="text-xs text-muted-foreground font-medium">Loading companies index...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border bg-card rounded-xl">
          <Building2 className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-sm font-semibold text-foreground">No companies found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Companies are automatically created when you add job applications, or when they match search criteria.
          </p>
        </div>
      ) : (
        /* Companies Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const appCount = company._count?.jobApplications || 0;
            return (
              <motion.div
                key={company.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between hover:border-muted-foreground/30 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm tracking-tight leading-none">
                        {company.name}
                      </h3>
                    </div>

                    {/* App count badge */}
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary">
                      <Briefcase className="h-3 w-3" />
                      {appCount} {appCount === 1 ? "Job" : "Jobs"}
                    </span>
                  </div>

                  {/* Attributes Badges */}
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    {company.industry && (
                      <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-tight">
                        {company.industry}
                      </span>
                    )}
                    {company.size && (
                      <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-medium">
                        {company.size} employees
                      </span>
                    )}
                  </div>

                  {/* Location & website links */}
                  <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                    {company.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary hover:text-primary/90 font-medium break-all"
                        >
                          {company.website.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-border mt-4 pt-3.5">
                  <Button
                    onClick={() => handleOpenDetails(company)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 h-8 text-xs font-semibold"
                  >
                    <Info className="h-3.5 w-3.5" /> Details
                  </Button>
                  <Button
                    onClick={() => handleDelete(company.id, company.name, appCount)}
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 text-muted-foreground hover:text-destructive ${
                      appCount > 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title={appCount > 0 ? "Cannot delete company with active applications" : "Delete Company"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Slide-over Details / Edit Side Panel overlay */}
      <AnimatePresence>
        {selectedCompany && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground text-base tracking-tight">
                      {selectedCompany.name} Details
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCompany(null)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isEditing ? (
                  /* Edit Form */
                  <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-foreground">
                    <div className="space-y-1.5">
                      <label htmlFor="website" className="text-muted-foreground uppercase tracking-wider">
                        Website URL
                      </label>
                      <input
                        id="website"
                        type="text"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="location" className="text-muted-foreground uppercase tracking-wider">
                        Office Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        placeholder="e.g. Wroclaw, Poland"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="industry" className="text-muted-foreground uppercase tracking-wider">
                          Industry
                        </label>
                        <input
                          id="industry"
                          type="text"
                          placeholder="e.g. Technology"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="size" className="text-muted-foreground uppercase tracking-wider">
                          Company Size
                        </label>
                        <input
                          id="size"
                          type="text"
                          placeholder="e.g. 50-100"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="notes" className="text-muted-foreground uppercase tracking-wider">
                        Internal Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={5}
                        placeholder="Add recruitment contact information, company mission, or salary benefits details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal resize-none leading-relaxed"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 pt-4">
                      <Button
                        type="submit"
                        disabled={editMutation.isPending}
                        className="flex-1 font-semibold"
                      >
                        {editMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="font-semibold"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* Display View */
                  <div className="space-y-5">
                    {/* Notes Callout */}
                    <div className="space-y-2 border border-border bg-muted/20 p-4 rounded-xl">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Internal Notes
                      </h4>
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedCompany.notes || (
                          <span className="italic text-muted-foreground">No custom notes recorded yet. Click Edit below to write details.</span>
                        )}
                      </p>
                    </div>

                    {/* Metadata Table details */}
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground font-semibold">Website</span>
                        {selectedCompany.website ? (
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-bold flex items-center gap-1"
                          >
                            <Globe className="h-3.5 w-3.5" /> Link
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic">Not set</span>
                        )}
                      </div>

                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground font-semibold">Location</span>
                        <span className="text-foreground font-bold">{selectedCompany.location || "Not set"}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground font-semibold">Industry</span>
                        <span className="text-foreground font-bold">{selectedCompany.industry || "Not set"}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground font-semibold">Company Size</span>
                        <span className="text-foreground font-bold">
                          {selectedCompany.size ? `${selectedCompany.size} employees` : "Not set"}
                        </span>
                      </div>
                    </div>

                    {/* Edit Trigger */}
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 font-semibold"
                    >
                      <Edit3 className="h-4 w-4" /> Edit Details
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

// Simple Helper Icon
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
