import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/apiClient";
import {
  ApplicationDialog,
  JobApplicationData,
} from "../features/applications/components/ApplicationDialog";
import { DeleteConfirmDialog } from "../features/applications/components/DeleteConfirmDialog";

interface ApiListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export function ApplicationsPage() {
  const queryClient = useQueryClient();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals Control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<JobApplicationData | null>(null);

  // Fetch list query
  const { data, isLoading, error } = useQuery({
    queryKey: ["applications", statusFilter, priorityFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("pageSize", "100"); // Show all for easy MVP tracking

      const res = await apiClient.get<ApiListResponse<JobApplicationData>>(
        `/job-applications?${params.toString()}`
      );
      return res;
    },
  });

  // Mutate create
  const createMutation = useMutation({
    mutationFn: (newApp: Partial<JobApplicationData>) =>
      apiClient.post("/job-applications", newApp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  // Mutate update
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<JobApplicationData>;
    }) => apiClient.patch(`/job-applications/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  // Mutate delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/job-applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const handleOpenAdd = () => {
    setActiveApp(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (app: JobApplicationData) => {
    setActiveApp(app);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (app: JobApplicationData) => {
    setActiveApp(app);
    setIsDeleteOpen(true);
  };

  const handleSave = async (formData: Partial<JobApplicationData>) => {
    if (activeApp?.id) {
      await updateMutation.mutateAsync({ id: activeApp.id, updates: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (activeApp?.id) {
      await deleteMutation.mutateAsync(activeApp.id);
      setIsDeleteOpen(false);
      setActiveApp(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "saved":
        return "text-status-saved bg-status-saved/10 border-status-saved/20";
      case "applied":
        return "text-status-applied bg-status-applied/10 border-status-applied/20";
      case "screening":
        return "text-status-screening bg-status-screening/10 border-status-screening/20";
      case "interviewing":
        return "text-status-interviewing bg-status-interviewing/10 border-status-interviewing/20";
      case "offer":
        return "text-status-offer bg-status-offer/10 border-status-offer/20";
      case "rejected":
        return "text-status-rejected bg-status-rejected/10 border-status-rejected/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight sm:text-3xl">
            Job Applications
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track and manage your active roles and interview pipeline.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add Application
        </Button>
      </div>

      {/* Tabs Filter Row */}
      <div className="border-b border-border">
        <nav className="flex gap-6 -mb-px overflow-x-auto whitespace-nowrap">
          {[
            { value: "all", label: "All Applications" },
            { value: "saved", label: "Saved" },
            { value: "applied", label: "Applied" },
            { value: "screening", label: "Screening" },
            { value: "interviewing", label: "Interviewing" },
            { value: "offer", label: "Offers" },
            { value: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none ${
                statusFilter === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters & Search Control Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by role or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="block w-full sm:w-40 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Table view / Loading / Error states */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-border bg-card rounded-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
          <p className="text-xs text-muted-foreground font-medium">
            Loading job applications...
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
          An error occurred while fetching your applications. Please refresh the page.
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border bg-card rounded-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">No applications found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Get started by adding your first job application. You can track status, salary, priority and notes.
          </p>
          <div className="mt-6">
            <Button onClick={handleOpenAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Application
            </Button>
          </div>
        </div>
      ) : (
        /* Applications Table List */
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Salary Range</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {data.data.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{app.title}</div>
                      {app.jobPostingUrl && (
                        <a
                          href={app.jobPostingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline mt-0.5 inline-block"
                        >
                          View Listing
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {app.companyName}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground capitalize">
                      {app.location || "—"}{" "}
                      {app.workMode && app.workMode !== "unknown" && (
                        <span className="text-xs text-muted-foreground/60 lowercase">
                          ({app.workMode})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {app.salaryMin || app.salaryMax ? (
                        <>
                          {app.salaryMin
                            ? formatCurrency(app.salaryMin, app.salaryCurrency || "USD")
                            : "—"}{" "}
                          to{" "}
                          {app.salaryMax
                            ? formatCurrency(app.salaryMax, app.salaryCurrency || "USD")
                            : "—"}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground capitalize">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          app.priority === "high"
                            ? "text-destructive bg-destructive/10"
                            : app.priority === "medium"
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground bg-muted"
                        }`}
                      >
                        {app.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize tracking-tight ${getStatusStyles(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(app)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleOpenDelete(app)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Dialog Box */}
      <ApplicationDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        application={activeApp}
      />

      {/* Delete Confirmation Box */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
        title={`${activeApp?.title} at ${activeApp?.companyName}`}
      />
    </main>
  );
}
