import { Router } from "express";

import {
  getFileById,
  getUserFiles,
  serveFileByName,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateTokenMiddleware, getUserFiles);
router.get("/:id", authenticateTokenMiddleware, getFileById);
router.get("/download/:filename", authenticateTokenMiddleware, serveFileByName);
router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
