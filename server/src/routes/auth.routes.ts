import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerAdmin,
  registerStudent,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  resetPasswordValidation,
  userLoginValidation,
  userRegistrationValidation,
} from "../middlewares/validator.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.post(
  "student/register",
  upload.single("profile-image"),
  userRegistrationValidation,
  authMiddleware,
  registerStudent
);
router.post(
  "admin/register",
  upload.single("profile-image"),
  userRegistrationValidation,
  authMiddleware,
  registerAdmin
);
router.post("/login", userLoginValidation, loginUser);
router.get("/refresh-token", refreshAccessToken);

// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPasswordValidation, resetPassword);
router.get("/logout", authMiddleware, logoutUser);

export { router as authRouter };
