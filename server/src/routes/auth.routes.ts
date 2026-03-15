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
import {
  authMiddleware,
  authorizeSystemUser,
} from "../middlewares/auth-middleware.js";
import {
  adminRegistrationValidation,
  resetPasswordValidation,
  studentRegistrationValidation,
  userLoginValidation,
} from "../middlewares/validator.js";
import { upload } from "../lib/multer.js";
import { log } from "console";

const router = express.Router();

router.post(
  "/student/register",
  authMiddleware,
  authorizeSystemUser,
  upload.single("profile-image"),
  studentRegistrationValidation,
  registerStudent
);
router.post(
  "/admin/register",
  authMiddleware,
  authorizeSystemUser,
  upload.single("profile-image"),
  adminRegistrationValidation,
  registerAdmin
);
router.post("/login", userLoginValidation, loginUser);
router.get("/refresh-token", refreshAccessToken);

// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPasswordValidation, resetPassword);
router.post("/logout", authMiddleware, logoutUser);

export { router as authRouter };
