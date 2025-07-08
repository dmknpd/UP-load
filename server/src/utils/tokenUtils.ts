import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/config";

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
