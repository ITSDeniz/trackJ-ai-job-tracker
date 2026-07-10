import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center">
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-md space-y-6 relative">
        {/* Glow Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

        {/* Header Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
          <AlertCircle className="h-7 w-7" />
        </div>

        {/* Titles */}
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter text-foreground bg-gradient-to-b from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground font-medium px-4">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Buttons Action Group */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-xs transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>

          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-xs shadow-md shadow-primary/10 transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Return to {isAuthenticated ? "Dashboard" : "Home"}</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
