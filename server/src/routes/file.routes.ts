import { Router } from "express";

import {
  deleteFileById,
  getFileDetailsById,
  getPublicFilesDetails,
  getUserFilesDetails,
  serveFileByName,
  updateFileDetails,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getPublicFilesDetails);

router.get("/private", authenticateTokenMiddleware, getUserFilesDetails);
router.get("/:id", authenticateTokenMiddleware, getFileDetailsById);
router.get("/download/:id", serveFileByName);
router.patch("/update/:id", authenticateTokenMiddleware, updateFileDetails);
router.delete("/delete/:id", authenticateTokenMiddleware, deleteFileById);

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
