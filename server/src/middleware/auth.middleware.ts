import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/tokenUtils";

export const authenticateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Please log in to continue" });
    return;
  } else {
    try {
      const user = verifyAccessToken(token);
      next();
    } catch (error) {
      res.status(403).json({ message: "Access denied" });
    }
  }
};
