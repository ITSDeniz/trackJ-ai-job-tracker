import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  CheckSquare,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Inbox,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { apiClient } from "@/lib/api/apiClient";

interface JobApplicationData {
  id: string;
  title: string;
  companyName: string;
  status: string;
  priority: string;
  appliedAt: string | null;
  createdAt: string;
  location: string | null;
}

interface ApiListResponse {
  data: JobApplicationData[];
  pagination: {
    total: number;
  };
}

export function HomePage() {
  const [view, setView] = useState<"overview" | "analytics">("overview");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch all applications for calculating stats & showing recent entries
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-applications"],
    queryFn: async () => {
      return apiClient.get<ApiListResponse>("/job-applications?pageSize=100");
    },
  });

  const applications = data?.data || [];
  const totalCount = data?.pagination?.total || 0;

  // Calculate rate calculations for funnel charts
  const appliedCount = applications.filter((app) => app.status !== "saved").length;

  const respondedCount = applications.filter(
    (app) =>
      app.status === "screening" ||
      app.status === "interviewing" ||
      app.status === "offer" ||
      app.status === "rejected"
  ).length;
  const responseRate = appliedCount > 0 ? Math.round((respondedCount / appliedCount) * 100) : 0;

  const interviewStatusCount = applications.filter(
    (app) => app.status === "interviewing" || app.status === "offer"
  ).length;
  const interviewRate = appliedCount > 0 ? Math.round((interviewStatusCount / appliedCount) * 100) : 0;

  const offerStatusCount = applications.filter((app) => app.status === "offer").length;
  const offerRate = appliedCount > 0 ? Math.round((offerStatusCount / appliedCount) * 100) : 0;

  const rejectedStatusCount = applications.filter((app) => app.status === "rejected").length;
  const rejectionRate = appliedCount > 0 ? Math.round((rejectedStatusCount / appliedCount) * 100) : 0;

  // Group applications by month for the timeline bar chart (last 6 months)
  const getLast6Months = () => {
    const months = [];
    const date = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        count: 0,
      });
    }
    return months;
  };

  const monthlyData = getLast6Months();
  applications.forEach((app) => {
    const dateStr = app.appliedAt || app.createdAt;
    if (dateStr) {
      const date = new Date(dateStr);
      const appMonth = date.getMonth();
      const appYear = date.getFullYear();

      const found = monthlyData.find(
        (m) => m.monthIndex === appMonth && m.year === appYear
      );
      if (found) {
        found.count += 1;
      }
    }
  });

  const maxTimelineCount = Math.max(...monthlyData.map((d) => d.count), 4);

  // Calculate stats dynamically from real database data
  const interviewsCount = applications.filter((app) => app.status === "interviewing").length;
  const offersCount = applications.filter((app) => app.status === "offer").length;
  const pendingCount = applications.filter(
    (app) => app.status === "screening" || app.status === "applied"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: totalCount,
      change: "Active in pipeline",
      icon: FileText,
      color: "text-status-applied",
    },
    {
      label: "Active Interviews",
      value: interviewsCount,
      change: "Keep preparing",
      icon: Calendar,
      color: "text-status-interviewing",
    },
    {
      label: "Offers Received",
      value: offersCount,
      change: "Review details",
      icon: TrendingUp,
      color: "text-status-offer",
    },
    {
      label: "Pending Feedback",
      value: pendingCount,
      change: "Awaiting response",
      icon: Clock,
      color: "text-status-screening",
    },
  ];

  // Show top 4 most recent applications
  const recentApplications = applications.slice(0, 4);

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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Greeting Header */}
      <motion.section
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-foreground tracking-tight sm:text-3xl">
          Welcome back, {user?.name || user?.email?.split("@")[0] || "Candidate"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here is the live status of your job search pipeline.
        </p>
      </motion.section>

      {/* Stats Cards Row */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: idx * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {isLoading ? "..." : stat.value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* View Toggle Tabs */}
      <div className="flex border-b border-border mb-8 pb-px">
        <button
          onClick={() => setView("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            view === "overview"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setView("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            view === "analytics"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </button>
      </div>

      {view === "overview" && (
        /* Main Layout Grid */
        <div className="grid gap-8 lg:grid-cols-3 animate-fade-in">
          {/* Left Column: Recent Applications */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                Recent Applications
              </h2>
              <Link
                to="/job-applications"
                className="text-xs font-medium text-primary hover:text-primary/95 flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 border border-border bg-card rounded-xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
                <p className="text-xs text-muted-foreground font-medium">Loading applications...</p>
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border bg-card rounded-xl">
                <Inbox className="h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="text-sm font-semibold text-foreground">No applications tracked yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                  Start adding roles to see them here on your dashboard pipeline.
                </p>
                <Button onClick={() => navigate("/job-applications")} className="mt-4 shrink-0" size="sm">
                  Add your first application
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Company</th>
                        <th className="px-5 py-3.5">Applied Date</th>
                        <th className="px-5 py-3.5">Priority</th>
                        <th className="px-5 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {recentApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-5 py-4 font-medium text-foreground">{app.title}</td>
                          <td className="px-5 py-4 text-muted-foreground">{app.companyName}</td>
                          <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                            {formatDate(app.appliedAt)}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground capitalize">
                            <span
                              className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${
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
                              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize tracking-tight ${getStatusStyles(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Quick Actions & Co-pilot Updates */}
          <section className="space-y-6">
            {/* Quick Actions Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </h2>
              <div className="grid gap-2">
                <Button
                  onClick={() => navigate("/job-applications")}
                  className="w-full flex items-center justify-start gap-2.5 py-2.5"
                >
                  <Plus className="h-4 w-4" /> Add Application
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2.5 py-2.5 text-muted-foreground hover:text-foreground cursor-not-allowed"
                  disabled
                >
                  <Calendar className="h-4 w-4" /> Schedule Interview
                </Button>
                <Button
                  onClick={() => navigate("/tasks", { state: { openCreateModal: true } })}
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2.5 py-2.5 text-muted-foreground hover:text-foreground"
                >
                  <CheckSquare className="h-4 w-4" /> Create Task
                </Button>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="rounded-xl border border-ai/10 bg-ai/5 p-5 shadow-sm border-l-4 border-l-ai">
              <div className="flex items-center gap-2 text-ai">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider">
                  AI Co-Pilot Suggestions
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-normal">
                {totalCount === 0
                  ? "Start tracking job applications to receive tailored suggestions and next actions from the AI Co-pilot."
                  : "Active applications detected. We are compiling tailored requirements analyses and interview preparation notes."}
              </p>
            </div>
          </section>
        </div>
      )}

      {view === "analytics" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid gap-6 lg:grid-cols-12"
        >
          {/* Left: Monthly Timeline Bar Chart */}
          <div className="lg:col-span-8 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground tracking-tight">
                Applications Timeline
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Number of job applications submitted over the last 6 months.
              </p>
            </div>
            {/* Custom SVG Bar Chart */}
            <div className="w-full pt-4">
              <svg viewBox="0 0 600 240" className="w-full overflow-visible">
                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = 30 + ratio * 150;
                  const labelValue = Math.round(maxTimelineCount * (1 - ratio));
                  return (
                    <g key={ratio} className="opacity-40">
                      <line
                        x1="45"
                        y1={y}
                        x2="580"
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border"
                        strokeDasharray="4,4"
                      />
                      <text
                        x="15"
                        y={y + 4}
                        textAnchor="start"
                        className="fill-muted-foreground text-[10px] font-medium"
                      >
                        {labelValue}
                      </text>
                    </g>
                  );
                })}

                {/* Bars & Labels */}
                {monthlyData.map((data, index) => {
                  const usableHeight = 150;
                  const barWidth = 36;
                  const x = 70 + index * 85;
                  const height = maxTimelineCount > 0 ? (data.count / maxTimelineCount) * usableHeight : 0;
                  const y = 180 - height;

                  return (
                    <g key={data.name + data.year} className="group">
                      {/* Interactive hover background region */}
                      <rect
                        x={x - 6}
                        y="30"
                        width={barWidth + 12}
                        height="160"
                        fill="transparent"
                        className="cursor-pointer"
                      />

                      {/* Actual visual bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(height, 2)}
                        rx="4"
                        className="fill-primary/80 group-hover:fill-primary transition-all duration-200 cursor-pointer origin-bottom"
                      />

                      {/* Bar Value Tooltip */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        className="fill-foreground text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      >
                        {data.count}
                      </text>

                      {/* X-Axis Month Code */}
                      <text
                        x={x + barWidth / 2}
                        y={210}
                        textAnchor="middle"
                        className="fill-muted-foreground text-xs font-semibold"
                      >
                        {data.name}
                      </text>
                    </g>
                  );
                })}
                {/* Floor Line */}
                <line x1="45" y1="180" x2="580" y2="180" stroke="currentColor" strokeWidth="1.5" className="text-border" />
              </svg>
            </div>
          </div>

          {/* Right: Funnel Donut Rates */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                  Funnel Performance
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pipeline conversion rates from total applied roles.
                </p>
              </div>

              {/* Rates Indicators Circle Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Response", value: responseRate, color: "stroke-status-screening text-status-screening", count: respondedCount, desc: "of applied apps" },
                  { label: "Interview", value: interviewRate, color: "stroke-status-interviewing text-status-interviewing", count: interviewStatusCount, desc: "reached stages" },
                  { label: "Offer", value: offerRate, color: "stroke-status-offer text-status-offer", count: offerStatusCount, desc: "offers secured" },
                  { label: "Rejection", value: rejectionRate, color: "stroke-status-rejected text-status-rejected", count: rejectedStatusCount, desc: "closed applications" },
                ].map((rate) => {
                  const radius = 28;
                  const circ = 2 * Math.PI * radius;
                  const offset = circ - (rate.value / 100) * circ;

                  return (
                    <div
                      key={rate.label}
                      className="flex flex-col items-center justify-center p-4 border border-border bg-muted/20 rounded-xl text-center space-y-2 group hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {rate.label}
                      </span>

                      {/* Animated SVG Donut */}
                      <div className="relative h-16 w-16 flex items-center justify-center">
                        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            className="stroke-muted fill-none"
                            strokeWidth="4"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            className={`fill-none transition-all duration-500 ease-out ${rate.color.split(" ")[0]}`}
                            strokeWidth="4.5"
                            strokeDasharray={circ}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className={`text-sm font-bold ${rate.color.split(" ")[1]}`}>
                          {rate.value}%
                        </span>
                      </div>

                      {/* Caption stats details */}
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-foreground">
                          {rate.count} {rate.count === 1 ? "app" : "apps"}
                        </p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-tight">
                          {rate.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
