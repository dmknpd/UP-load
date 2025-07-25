import { Router } from "express";

import {
  getFileDetailsById,
  getUserFilesDetails,
  serveFileByName,
  updateFileDetails,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateTokenMiddleware, getUserFilesDetails);
router.get("/:id", authenticateTokenMiddleware, getFileDetailsById);
router.get("/download/:id", authenticateTokenMiddleware, serveFileByName);
router.patch("/update/:id", authenticateTokenMiddleware, updateFileDetails);

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
