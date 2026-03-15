import express from "express";
import {
  createSubject,
  deleteSubjectById,
  getAllSubjects,
  getSubjectById,
  updateSubjectById,
} from "../controllers/subject.controller.js";
import {
  authMiddleware,
  authorizeSystemUser,
} from "../middlewares/auth-middleware.js";
import { subjectValidation } from "../middlewares/subject-validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeSystemUser,
  subjectValidation,
  createSubject
);
router.get("/", authMiddleware, getAllSubjects);
router.get("/:subjectId", authMiddleware, getSubjectById);
router.patch(
  "/:subjectId",
  authMiddleware,
  authorizeSystemUser,
  subjectValidation,
  updateSubjectById
);
router.delete(
  "/:subjectId",
  authMiddleware,
  authorizeSystemUser,
  deleteSubjectById
);

export { router as subjectRouter };
