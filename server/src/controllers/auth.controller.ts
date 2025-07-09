import { Request, Response } from "express";

import User from "../models/user.model";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Email already used" });
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Registration error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ message: "User doesn't exist or wrong password" });
    } else {
      const refreshToken = generateRefreshToken(user._id, user.email);
      const accessToken = generateAccessToken(user._id, user.email);

      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      });

      res.status(200).json({ accessToken });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Login error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided." });
  }

  const refreshTokenFromCookie = cookies.jwt;

  try {
    const decoded = verifyRefreshToken(refreshTokenFromCookie);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(403).json({ message: "Forbidden: User not found." });
    } else if (!user?.refreshTokens.includes(refreshTokenFromCookie)) {
      user.refreshTokens = [];
      await user.save();
      res
        .status(403)
        .json({ message: "Forbidden: Refresh token revoked or invalid." });
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
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      });

      res.status(200).json({ newAccessToken });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(403).json({ message: "Refresh Token Error: " });
  }
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.sendStatus(204);
  }

  const refreshTokenFromCookie = cookies.jwt;

  try {
    const decoded = verifyRefreshToken(refreshTokenFromCookie);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
      });
      res.sendStatus(204);
    } else {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token != refreshTokenFromCookie
      );

      await user.save();

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
      });
      res.sendStatus(204);
    }
  } catch (error: any) {
    console.error(error.message);
    res.sendStatus(500).json({ message: "Logout error: " });
  }
};
