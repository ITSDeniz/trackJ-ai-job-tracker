import { Response, NextFunction, Request } from "express";
import { UnauthorizedError } from "../../../domain/shared/errors.js";
import { loadConfig } from "../../../config/loadConfig.js";
import { JwtTokenService } from "../../../infrastructure/security/JwtTokenService.js";

const config = loadConfig();
const tokenService = new JwtTokenService(config.jwtSecret);

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication token is required.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Authentication token is malformed.");
    }

    const decoded = tokenService.verifyToken(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch {
    next(new UnauthorizedError("Authentication token is invalid or expired."));
  }
}
