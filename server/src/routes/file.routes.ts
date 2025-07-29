import { Router } from "express";

import {
  deleteFileById,
  getFileById,
  getPublicFileById,
  getPublicFileList,
  getUserFileList,
  serveFileById,
  servePublicFileById,
  updateFileById,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

//public
router.get("/public", getPublicFileList);
router.get("/public/:id", getPublicFileById);
router.get("/public/download/:id", servePublicFileById);

//private
router.get("/user", authenticateTokenMiddleware, getUserFileList);
router.get("/:id", authenticateTokenMiddleware, getFileById);
router.get("/download/:id", authenticateTokenMiddleware, serveFileById);

router.patch("/update/:id", authenticateTokenMiddleware, updateFileById);
router.delete("/delete/:id", authenticateTokenMiddleware, deleteFileById);

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
