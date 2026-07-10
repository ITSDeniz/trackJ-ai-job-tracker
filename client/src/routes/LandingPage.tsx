import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  BarChart3,
  ArrowRight,
  Sun,
  Moon,
  Github,
  CheckCircle,
  Clock,
  Layers,
  Search,
} from "lucide-react";
import { useTheme } from "@/features/theme/ThemeContext";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const features = [
    {
      title: "Structured Job Pipeline",
      desc: "Organize applications from saved to applied, interviewing, and offers. Keep dates, locations, and compensation clean.",
      icon: Briefcase,
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "Gemini AI Co-Pilot",
      desc: "Instantly critique resumes with specific formatting, metric impact improvements, and STAR method suggestions.",
      icon: Sparkles,
      color: "bg-ai/10 text-ai border-ai/20",
    },
    {
      title: "Visual Timeline Analytics",
      desc: "Scan application monthly timeline bars and conversion funnel rates (response, interview, and offers) automatically.",
      icon: BarChart3,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden flex flex-col font-sans">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Light Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-ai/5 blur-[150px] pointer-events-none" />

      {/* Landing Navigation Header */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-border bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="TrackJ Logo" className="h-8 w-8 rounded-lg object-cover" />
          <div>
            <span className="font-semibold text-foreground tracking-tight block">
              TrackJ
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium -mt-0.5">
              AI Job Tracker
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" className="flex items-center gap-1.5 font-medium">
                Go to Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-medium">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* AI badge annotation */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 border border-primary/20 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Now powered by Gemini 2.5 Flash
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl"
            >
              Supercharge Your Job Search with{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-ai bg-clip-text text-transparent">
                TrackJ
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              TrackJ combines a structured pipeline workspace with selective AI assistance
              to simplify the application cycle, critique resume metrics, and analyze stages conversion.
            </motion.p>

            {/* Primary Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="flex items-center gap-2 font-semibold shadow-md">
                    Open Dashboard Command Center
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="flex items-center gap-2 font-semibold shadow-md">
                      Start Tracking Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="font-semibold">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Interactive Mockup Dashboard Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-2xl p-6 relative overflow-hidden"
          >
            {/* Window controls header decoration */}
            <div className="flex items-center gap-1.5 border-b border-border pb-4 mb-6">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-amber-500/60" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs text-muted-foreground font-semibold ml-2">
                trackj-dashboard-preview.app
              </span>
            </div>

            {/* Mock Dashboard Layout */}
            <div className="grid gap-6 md:grid-cols-12 text-left">
              {/* Stats column grid */}
              <div className="md:col-span-4 space-y-4">
                <div className="border border-border bg-background p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Response Rate Funnel
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-status-screening">68%</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[68%] bg-status-screening rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="border border-border bg-background p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    AI Resume Critique
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-ai">84</span>
                    <span className="text-xs text-muted-foreground">Quantified impact: Excellent</span>
                  </div>
                </div>
              </div>

              {/* Graphical Timeline Mockup column */}
              <div className="md:col-span-8 border border-border bg-background p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">Timeline Analytics</span>
                  <span className="text-[10px] text-muted-foreground">Applications per Month</span>
                </div>
                <div className="flex items-end justify-between pt-4 h-[90px] px-4">
                  {[2, 4, 3, 7, 5, 8].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className="w-8 rounded bg-primary/75 hover:bg-primary transition-colors origin-bottom"
                        style={{ height: `${val * 8}px` }}
                      />
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Detail Grid Section */}
      <section className="relative z-10 border-t border-border bg-card/30 backdrop-blur-md py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Everything you need in one command center
            </h2>
            <p className="text-sm text-muted-foreground leading-normal">
              Manage your career pipeline with precision details, automated resume assessments, and funnel ratios.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-4 hover:border-muted-foreground/30 transition-all duration-300"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${feature.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">TrackJ</span>
            <span>&copy; {new Date().getFullYear()}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github className="h-4 w-4" />
              Github Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
