import { Request, Response } from "express";

import User from "../models/user.model";

import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";

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
      const accessToken = generateAccessToken(user._id, user.email);
      const refreshToken = generateRefreshToken(user._id, user.email);

      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Login error" });
  }
};
