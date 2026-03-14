import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  resetPasswordValidation,
  userLoginValidation,
  userRegistrationValidation,
} from "../middlewares/validator.js";

const router = express.Router();

router.post("/register", userRegistrationValidation, registerUser);
router.post("/login", userLoginValidation, loginUser);
router.get("/refresh-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.get("/logout", authMiddleware, logoutUser);

export { router as authRouter };
