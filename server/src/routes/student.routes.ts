import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  getStudentProfile,
  getStudentSubjects,
} from "../controllers/student.controller.js";
import { changePasswordValidation } from "../middlewares/validator.js";
import { changePassword } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile", authMiddleware, getStudentProfile);
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  changePassword
);
router.get("/subjects", authMiddleware, getStudentSubjects);

export { router as studentRouter };
