import { Router } from "express";

import {
  getUserFiles,
  getFile,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/:filename", authenticateTokenMiddleware, getFile);
router.get("/", authenticateTokenMiddleware, getUserFiles);
router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
