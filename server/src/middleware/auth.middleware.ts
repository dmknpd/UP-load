import { Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/tokenUtils";
import { RequestWithUserId } from "../types/req";

export const authenticateTokenMiddleware = (
  req: RequestWithUserId,
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
      req.userId = user.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: "Please log in to continue" });
    }
  }
};
