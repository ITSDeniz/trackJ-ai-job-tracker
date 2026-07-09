import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Clock,
  Briefcase,
  Trash2,
  AlertCircle,
  X,
  CheckCircle,
  Search,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";

interface JobApplicationBrief {
  id: string;
  title: string;
  companyName: string; // wait, in client, job list response maps companyName string!
}

interface ApiListResponse {
  data: JobApplicationBrief[];
}

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  dueAt: string;
  completedAt: string | null;
  jobApplicationId: string | null;
  createdAt: string;
  jobApplication?: {
    id: string;
    title: string;
    company: {
      name: string;
    };
  } | null;
}

interface TaskResponse {
  data: TaskData[];
}

export function TasksPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [jobApplicationId, setJobApplicationId] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch Tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      return apiClient.get<TaskResponse>("/tasks");
    },
  });

  // Fetch Job Applications (for linking)
  const { data: appsData } = useQuery({
    queryKey: ["task-applications-lookup"],
    queryFn: async () => {
      return apiClient.get<ApiListResponse>("/job-applications?pageSize=100");
    },
  });

  const tasks = tasksData?.data || [];
  const applications = appsData?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (newTask: any) => {
      return apiClient.post<any>("/tasks", newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSuccessMessage("Task created successfully.");
      setIsModalOpen(false);
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to create task.");
      setTimeout(() => setErrorMessage(null), 4000);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiClient.put<any>(`/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to toggle task.");
      setTimeout(() => setErrorMessage(null), 4000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete<any>(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSuccessMessage("Task deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to delete task.");
      setTimeout(() => setErrorMessage(null), 4000);
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueAt("");
    setJobApplicationId("");
    setErrorMessage(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Task title is required.");
      return;
    }
    if (!dueAt) {
      setErrorMessage("Due date and time is required.");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || null,
      dueAt: new Date(dueAt).toISOString(),
      jobApplicationId: jobApplicationId || null,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter & split
  const filteredTasks = tasks.filter((t) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = t.title.toLowerCase().includes(term);
    const descMatch = t.description?.toLowerCase().includes(term) || false;
    const jobMatch =
      t.jobApplication?.title.toLowerCase().includes(term) ||
      t.jobApplication?.company.name.toLowerCase().includes(term) ||
      false;
    return titleMatch || descMatch || jobMatch;
  });

  const pendingTasks = filteredTasks.filter((t) => !t.completedAt);
  const completedTasks = filteredTasks.filter((t) => t.completedAt);

  const activeTasksList = activeTab === "pending" ? pendingTasks : completedTasks;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight sm:text-3xl">
            Tasks Checklist
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Schedule recruiter follow-ups, interview preparations, or networking check-ins.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 self-start sm:self-auto font-semibold"
        >
          <Plus className="h-4.5 w-4.5" /> Add Task
        </Button>
      </section>

      {/* Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
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
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs & Search Panel */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tab Buttons */}
        <div className="flex border-b border-border pb-px self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "pending"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending ({tasks.filter((t) => !t.completedAt).length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "completed"
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed ({tasks.filter((t) => t.completedAt).length})
          </button>
        </div>

        {/* Local Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search checklists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Tasks List */}
      {tasksLoading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-border bg-card rounded-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
          <p className="text-xs text-muted-foreground font-medium">Loading checklists...</p>
        </div>
      ) : activeTasksList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border bg-card rounded-xl">
          <CheckSquare className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-sm font-semibold text-foreground">
            {searchTerm ? "No matching tasks found" : `No ${activeTab} tasks`}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            {searchTerm
              ? "Refine your keyword search terms to locate matching entries."
              : activeTab === "pending"
              ? "Create checklists to track custom follow-up milestones."
              : "Completed checklist records will reside here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeTasksList.map((task) => {
            const overdue = !task.completedAt && isOverdue(task.dueAt);
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-xl border border-border bg-card p-4 shadow-sm flex items-start justify-between gap-4 transition-colors hover:border-muted-foreground/20 group`}
              >
                {/* Left side: checkbox & text details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Custom Completion toggle checkbox button */}
                  <button
                    onClick={() =>
                      toggleMutation.mutate({
                        id: task.id,
                        completed: !task.completedAt,
                      })
                    }
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    aria-label={task.completedAt ? "Mark pending" : "Mark completed"}
                  >
                    {task.completedAt ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h3
                      className={`font-semibold text-sm leading-snug tracking-tight text-foreground truncate ${
                        task.completedAt ? "line-through text-muted-foreground font-normal" : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p
                        className={`text-xs text-muted-foreground leading-relaxed break-words whitespace-pre-wrap ${
                          task.completedAt ? "opacity-50" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Meta info block */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-semibold text-muted-foreground">
                      {/* Due date tag */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                          overdue
                            ? "text-destructive bg-destructive/10 border border-destructive/20"
                            : "bg-muted"
                        }`}
                      >
                        {overdue ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <Calendar className="h-3 w-3" />
                        )}
                        <span>
                          {overdue ? "Overdue: " : ""}
                          {formatDate(task.dueAt)}
                        </span>
                      </div>

                      {/* Linked application indicator */}
                      {task.jobApplication && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                          <Briefcase className="h-3 w-3" />
                          <span>
                            {task.jobApplication.title} @ {task.jobApplication.company.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: actions */}
                <Button
                  onClick={() => handleDelete(task.id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Delete Task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Creation Modal Form popup */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 m-auto z-50 h-fit w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4.5 w-4.5 text-primary" />
                  <h2 className="font-semibold text-foreground text-sm tracking-tight">
                    Add Checklist Task
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form content */}
              <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-semibold text-foreground">
                <div className="space-y-1.5">
                  <label htmlFor="task-title" className="text-muted-foreground uppercase tracking-wider">
                    Task Title *
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    placeholder="e.g. Schedule call, Prep coding questions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="task-desc" className="text-muted-foreground uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    id="task-desc"
                    rows={3}
                    placeholder="Include questions to ask, requirements to note, or documents to bring..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="task-due" className="text-muted-foreground uppercase tracking-wider">
                    Due Date & Time *
                  </label>
                  <input
                    id="task-due"
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal"
                    required
                  />
                </div>

                {/* Optional linked job application */}
                <div className="space-y-1.5">
                  <label htmlFor="task-job" className="text-muted-foreground uppercase tracking-wider">
                    Link to Job Application (Optional)
                  </label>
                  <select
                    id="task-job"
                    value={jobApplicationId}
                    onChange={(e) => setJobApplicationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm font-normal capitalize"
                  >
                    <option value="">No application link</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.title} — {app.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 pt-3">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 font-semibold"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
