import { Router } from "express";

import {
  deleteFileById,
  getFileDetailsById,
  getPublicFilesDetails,
  getUserFilesDetails,
  serveFileById,
  servePublicFileById,
  updateFileDetails,
  upload,
  uploadFile,
} from "../controllers/file.controller";
import { authenticateTokenMiddleware } from "../middleware/auth.middleware";

const router = Router();

//public
router.get("/public", getPublicFilesDetails);
router.get("/public/download/:id", servePublicFileById);

//private
router.get("/user", authenticateTokenMiddleware, getUserFilesDetails);
router.get("/:id", authenticateTokenMiddleware, getFileDetailsById);
router.get("/download/:id", authenticateTokenMiddleware, serveFileById);

router.patch("/update/:id", authenticateTokenMiddleware, updateFileDetails);
router.delete("/delete/:id", authenticateTokenMiddleware, deleteFileById);

router.post(
  "/upload",
  authenticateTokenMiddleware,
  upload.single("file"),
  uploadFile
);

export default router;
