import { rateLimit } from "express-rate-limit";

// Rate limiter for login & registration requests
// Limit to 5 attempts per 15 minutes per IP to prevent brute-force attacks.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: {
      code: "too_many_requests",
      message: "Too many authentication attempts. Please try again after 15 minutes.",
    },
  },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable older X-RateLimit-* headers
});

// Rate limiter for AI review queries
// Limit to 5 requests per hour per user account to protect Gemini API key limits
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: {
      code: "too_many_requests",
      message: "You have exceeded your free limit of 5 AI resume reviews per hour. Please try again later.",
    },
  },
  keyGenerator: (req) => {
    // Scope rate limiting by authenticated user ID if available, fallback to IP
    return (req as any).user?.id || req.ip || "";
  },
  standardHeaders: true,
  legacyHeaders: false,
});

