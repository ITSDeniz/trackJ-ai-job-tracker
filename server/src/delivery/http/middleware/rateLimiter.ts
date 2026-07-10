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
