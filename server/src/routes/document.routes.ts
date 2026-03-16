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
import { chatController, uploadPdfController } from "../services/queue.js";
import { uploadPdf } from "../middlewares/upload-pdf.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeAdmin,
  upload.single("document"),
  uploadDocument
);
router.delete("/:documentId", authMiddleware, authorizeAdmin, deleteDocument);
router.post("/upload/pdf", uploadPdf.single("rag-pdf"), uploadPdfController);
router.get("/chat", chatController);

export { router as documentRouter };
