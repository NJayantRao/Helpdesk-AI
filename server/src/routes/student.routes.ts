import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  changePassword,
  getStudentProfile,
} from "../controllers/student.controller.js";
import { changePasswordValidation } from "../middlewares/validator.js";
const router = express.Router();

router.get("/profile", authMiddleware, getStudentProfile);
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  changePassword
);

export { router as studentRouter };
