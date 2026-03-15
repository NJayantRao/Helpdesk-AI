import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { changePasswordValidation } from "../middlewares/validator.js";
import { getAdminProfile } from "../controllers/admin.controller.js";
import { changePassword } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile", authMiddleware, getAdminProfile);
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  changePassword
);

export { router as adminRouter };
