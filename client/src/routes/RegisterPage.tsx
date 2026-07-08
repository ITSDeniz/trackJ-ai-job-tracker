import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { ApiError } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      await register(email, password, name || undefined);
      navigate("/", { replace: true });
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
        if (err.fields) {
          setFieldErrors(err.fields);
        }
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
            TP
          </div>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        {errorMsg && (
          <div
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
            role="alert"
          >
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="name"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5"
              >
                Full Name (Optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 focus:outline-none"
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email-address"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 focus:outline-none"
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 focus:outline-none"
                placeholder="Min. 6 characters"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                "Get started"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
