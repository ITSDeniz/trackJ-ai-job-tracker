import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "../../../domain/shared/errors.js";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // Log unexpected errors
  if (!(
    error instanceof NotFoundError ||
    error instanceof ValidationError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof ConflictError
  )) {
    console.error(`[Unexpected Error]:`, error);
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      error: {
        code: "not_found",
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(422).json({
      error: {
        code: "validation_error",
        message: error.message,
        fields: error.fields,
      },
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({
      error: {
        code: "unauthorized",
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof ForbiddenError) {
    res.status(403).json({
      error: {
        code: "forbidden",
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({
      error: {
        code: "conflict",
        message: error.message,
      },
    });
    return;
  }

  // Fallback
  res.status(500).json({
    error: {
      code: "internal_server_error",
      message: "An unexpected error occurred. Please try again later.",
    },
  });
}
