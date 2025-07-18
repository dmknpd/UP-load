import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import multer from "multer";

export const multerErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ errors: { file: ["File is too large"] } });
      return;
    }

    res.status(400).json({ errors: { file: [error.message] } });
    return;
  }

  next(error);
};
