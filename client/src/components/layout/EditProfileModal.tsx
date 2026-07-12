import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { ApiError } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";
import { X, User, Mail, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Preset inputs when modal opens or user context changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPassword("");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      await updateProfile({
        name: name.trim() || null,
        email: email.trim(),
        password: password.trim() || undefined,
      });

      setSuccessMessage("Profile updated successfully!");
      setPassword(""); // Reset password input
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        if (err.fields) {
          setFieldErrors(err.fields);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-6 shadow-lg text-card-foreground"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Edit Profile Settings
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Alerts */}
            {successMessage && (
              <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-name"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                    placeholder="Enter your name"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[10px] text-destructive mt-0.5">{fieldErrors.name[0]}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-email"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[10px] text-destructive mt-0.5">{fieldErrors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-password"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  New Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="profile-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                    placeholder="Enter at least 6 characters"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                  Leave empty if you don't want to change your password.
                </p>
                {fieldErrors.password && (
                  <p className="text-[10px] text-destructive mt-0.5">{fieldErrors.password[0]}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 justify-end border-t border-border pt-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
