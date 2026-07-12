import { useState } from "react";
import { apiClient } from "@/lib/api/apiClient";
import { ApiError } from "@/lib/api/apiClient";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please enter a feedback message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await apiClient.post("/feedbacks", {
        message: message.trim(),
        rating: rating,
      });

      setSuccessMessage("Thank you for your feedback! It helps improve TrackJ.");
      setMessage("");
      setRating(null);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
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
                <MessageSquare className="h-5 w-5 text-primary" />
                Send Feedback
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

            {/* Description */}
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Have suggestions, found a bug, or just want to tell us what you think? Drop your feedback below!
            </p>

            {/* Alerts */}
            {successMessage && (
              <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 leading-normal">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive leading-normal">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  How would you rate your experience? (Optional)
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled =
                      (hoverRating !== null ? star <= hoverRating : rating !== null && star <= rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/35 hover:text-muted-foreground"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="feedback-message"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Your Comments / Suggestions *
                </label>
                <textarea
                  id="feedback-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none disabled:opacity-50"
                  placeholder="Tell us what we can improve, or features you'd like to see..."
                />
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
                <Button type="submit" disabled={isSubmitting || !message.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit Feedback"
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
