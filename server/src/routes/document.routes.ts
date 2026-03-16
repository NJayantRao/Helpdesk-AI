import express from "express";
import {
  uploadDocument,
  deleteDocument,
} from "../controllers/document.controller.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeAdmin,
  upload.single("document"),
  uploadDocument
);
router.delete("/:documentId", authMiddleware, authorizeAdmin, deleteDocument);

export { router as documentRouter };
