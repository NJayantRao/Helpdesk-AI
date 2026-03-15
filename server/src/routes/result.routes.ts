import express from "express";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";
import {
  deleteResultById,
  getResultsByStudentId,
  updateResultById,
  uploadResultsFromFile,
} from "../controllers/result.controller.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  authorizeAdmin,
  upload.single("results-file"),
  uploadResultsFromFile
);
router.get("/student/:studentId", authMiddleware, getResultsByStudentId);
router.patch("/:resultId", authMiddleware, authorizeAdmin, updateResultById);
router.delete("/:resultId", authMiddleware, authorizeAdmin, deleteResultById);

export { router as resultRouter };
