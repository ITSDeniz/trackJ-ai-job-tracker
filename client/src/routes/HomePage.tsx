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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  // Mocked statistic figures
  const stats = [
    {
      label: "Total Applications",
      value: 12,
      change: "+3 this week",
      icon: FileText,
      color: "text-status-applied",
    },
    {
      label: "Active Interviews",
      value: 2,
      change: "Next: tomorrow",
      icon: Calendar,
      color: "text-status-interviewing",
    },
    {
      label: "Offers Received",
      value: 1,
      change: "Reviewing details",
      icon: TrendingUp,
      color: "text-status-offer",
    },
    {
      label: "Pending Actions",
      value: 3,
      change: "1 due today",
      icon: Clock,
      color: "text-status-screening",
    },
  ];

  // Mocked recent applications list
  const recentApplications = [
    {
      id: "1",
      role: "Senior Frontend Engineer",
      company: "Stripe",
      appliedDate: "July 06, 2026",
      priority: "high",
      status: "interviewing",
    },
    {
      id: "2",
      role: "Product Designer",
      company: "Linear",
      appliedDate: "July 04, 2026",
      priority: "medium",
      status: "offer",
    },
    {
      id: "3",
      role: "Software Developer",
      company: "Vercel",
      appliedDate: "June 28, 2026",
      priority: "high",
      status: "applied",
    },
    {
      id: "4",
      role: "Backend Engineer",
      company: "Supabase",
      appliedDate: "June 25, 2026",
      priority: "low",
      status: "saved",
    },
  ];

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
          Welcome back,{" "}
          {user?.name || user?.email?.split("@")[0] || "Candidate"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here is an overview of your active search. You have 3 actions that
          require attention.
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
                {stat.value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Applications */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Recent Applications
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-primary hover:text-primary/95 flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

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
                    <tr
                      key={app.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-foreground">
                        {app.role}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {app.company}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        {app.appliedDate}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground capitalize">
                        {app.priority}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize tracking-tight ${getStatusStyles(app.status)}`}
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
        </section>

        {/* Right Column: Quick Actions & Co-pilot Updates */}
        <section className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h2>
            <div className="grid gap-2">
              <Button className="w-full flex items-center justify-start gap-2.5 py-2.5">
                <Plus className="h-4 w-4" /> Add Application
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-start gap-2.5 py-2.5 text-muted-foreground hover:text-foreground"
              >
                <Calendar className="h-4 w-4" /> Schedule Interview
              </Button>
              <Button
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
              Based on your Stripe application status, you should expect an
              initial screening interview soon.
            </p>
            <div className="mt-4 pt-3 border-t border-ai/10">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-ai hover:underline flex items-center gap-1 font-semibold"
              >
                Prepare for screening <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
