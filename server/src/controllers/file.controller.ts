import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

import File from "../models/file.model";

import { RequestWithUserId } from "../types/req";

const storage = multer.diskStorage({
  destination: (req: RequestWithUserId, res, cb) => {
    const userId = req.userId;
    const uploadPath = path.join("uploads", `user_${userId}`);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Wrong file extension"));
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export const uploadFile = async (req: RequestWithUserId, res: Response) => {
  const userId = req.userId;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  } else {
    try {
      const originalnameUtf8 = Buffer.from(
        req.file.originalname,
        "latin1"
      ).toString("utf8");

      const fileDoc = new File({
        user: userId,
        filename: req.file.filename,
        originalname: originalnameUtf8,
        path: `/uploads/user_${userId}/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      await fileDoc.save();

      res.status(200).json({
        message: "File uploaded successfully",
        file: fileDoc,
      });
      return;
    } catch (error: any) {
      await fs.promises.unlink(req.file.path);
      console.error(error);
      res.status(500).json({ message: "Error saving file" });
      return;
    }
  }
};

export const getFile = async (req: RequestWithUserId, res: Response) => {
  const { filename } = req.params;
  const userId = req.userId;

  try {
    const file = await File.findOne({ filename });

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    if (!file.isPublic && file.user.toString() !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const filePath = path.resolve("uploads", `user_${file.user}`, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "File does not exist" });
      return;
    }

    res.sendFile(filePath);
    return;
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getUserFiles = async (req: RequestWithUserId, res: Response) => {
  const userId = req.userId;

  try {
    const files = await File.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-user -__v");

    res.status(200).json({ files });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error receiving  file" });
    return;
  }
};
