import { Router } from "express";

import { upload, uploadFile } from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
