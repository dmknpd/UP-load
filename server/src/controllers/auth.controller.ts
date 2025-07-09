import { Request, Response } from "express";

import User from "../models/user.model";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils";

import { NODE_ENV } from "../config/config";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Email already used" });
      return;
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Registration error" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ message: "User doesn't exist or wrong password" });
      return;
    } else {
      const refreshToken = generateRefreshToken(user._id, user.email);
      const accessToken = generateAccessToken(user._id, user.email);

      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      });

      res.status(200).json({ accessToken });
      return;
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Login error" });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401).json({ message: "Please log in to continue" });
    return;
  }

  const refreshTokenFromCookie = cookies.jwt;

  try {
    const decoded = verifyRefreshToken(refreshTokenFromCookie);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(403).json({ message: "Forbidden: User not found." });
      return;
    } else if (!user?.refreshTokens.includes(refreshTokenFromCookie)) {
      user.refreshTokens = [];
      await user.save();
      res.status(403).json({ message: "Access denied" });
      return;
    } else {
      const newRefreshToken = generateRefreshToken(user._id, user.email);
      const newAccessToken = generateAccessToken(user._id, user.email);

      user.refreshTokens = user.refreshTokens.filter(
        (token) => token != refreshTokenFromCookie
      );

      user.refreshTokens.push(newRefreshToken);

      await user.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      });

      res.status(200).json({ newAccessToken });
      return;
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(403).json({ message: "Access denied" });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.sendStatus(204);
    return;
  }

  const refreshTokenFromCookie = cookies.jwt;

  try {
    const decoded = verifyRefreshToken(refreshTokenFromCookie);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
      });
      res.sendStatus(204);
      return;
    } else {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token != refreshTokenFromCookie
      );

      await user.save();

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
      });
      res.sendStatus(204);
      return;
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Logout error: " });
    return;
  }
};
