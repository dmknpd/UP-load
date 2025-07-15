import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

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

export const upload = multer({ storage, fileFilter });

export const uploadFile = async (req: RequestWithUserId, res: Response) => {
  const userId = req.userId;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  } else {
    try {
      const fileDoc = new File({
        user: userId,
        filename: req.file.filename,
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
