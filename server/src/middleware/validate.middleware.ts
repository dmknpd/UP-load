import { Request, Response, NextFunction } from "express";
import { ZodType, flattenError } from "zod";

export const validate =
  (schema: ZodType<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        errors: flattenError(result.error).fieldErrors,
      });
      return;
    }

    next();
  };
