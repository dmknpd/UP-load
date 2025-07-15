import { Router } from "express";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";
import { upload, uploadFile } from "../controllers/upload.controller";

const router = Router();

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
