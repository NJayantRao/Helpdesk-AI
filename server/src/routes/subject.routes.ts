import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubjectById,
  deleteSubjectById,
  bulkEnrollBySemester,
  unenrollStudent,
} from "../controllers/subject.controller.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// SUBJECT CRUD
// ─────────────────────────────────────────────
router.post("/", authMiddleware, authorizeAdmin, createSubject);
router.get("/", authMiddleware, authorizeAdmin, getAllSubjects);
router.get("/:subjectId", authMiddleware, authorizeAdmin, getSubjectById);
router.patch("/:subjectId", authMiddleware, authorizeAdmin, updateSubjectById);
router.delete("/:subjectId", authMiddleware, authorizeAdmin, deleteSubjectById);

// ─────────────────────────────────────────────
// ENROLLMENT — specific routes before param routes
// ─────────────────────────────────────────────
router.post(
  "/:subjectId/enroll/bulk",
  authMiddleware,
  authorizeAdmin,
  bulkEnrollBySemester
);
router.delete(
  "/:subjectId/enroll/:studentId",
  authMiddleware,
  authorizeAdmin,
  unenrollStudent
);

export { router as subjectRouter };
