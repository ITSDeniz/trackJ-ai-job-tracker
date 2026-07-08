import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const pathKey = err.path.slice(1).join(".");
          if (pathKey) {
            if (!fields[pathKey]) {
              fields[pathKey] = [];
            }
            fields[pathKey].push(err.message);
          }
        });

        res.status(422).json({
          error: {
            code: "validation_error",
            message: "The request contains invalid fields.",
            fields,
          },
        });
        return;
      }
      next(error);
    }
  };
};
