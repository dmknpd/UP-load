import { Router } from "express";

import {
  getUserFiles,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);
router.get("/", authenticateTokenMiddleware, getUserFiles);

export default router;
