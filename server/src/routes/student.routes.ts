import express from "express";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";
import {
  getStudentProfile,
  getMyResults,
  getMySubjects,
  getMyAttendance,
  getEligiblePlacements,
  getStudentDashboard,
} from "../controllers/student.controller.js";
import { changePasswordValidation } from "../middlewares/validator.js";
import { changePassword } from "../controllers/user.controller.js";
import { getStudentDocuments } from "../controllers/document.controller.js";
import {
  getStudentNotifications,
  getUnreadCount,
  markAllAsRead,
  markOneAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getStudentDashboard);
router.get("/profile", authMiddleware, getStudentProfile);
router.get("/results", authMiddleware, getMyResults);
router.get("/subjects", authMiddleware, getMySubjects);
router.get("/attendance", authMiddleware, getMyAttendance);
router.get("/placements", authMiddleware, getEligiblePlacements);
router.get("/documents", authMiddleware, getStudentDocuments);
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  changePassword
);
// specific routes BEFORE param routes
router.get("/notifications/unread-count", authMiddleware, getUnreadCount);
router.patch("/notifications/mark-all-read", authMiddleware, markAllAsRead);
router.get("/notifications", authMiddleware, getStudentNotifications);
router.patch(
  "/notifications/:notificationId/read",
  authMiddleware,
  markOneAsRead
);

export { router as studentRouter };
