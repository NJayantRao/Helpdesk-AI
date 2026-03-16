import express from "express";
import {
  createNotification,
  getAllNotifications,
  deleteNotification,
  getStudentNotifications,
  getUnreadCount,
  markOneAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// ADMIN — create, list, delete
// ─────────────────────────────────────────────
router.post("/", authMiddleware, authorizeAdmin, createNotification);
router.get("/", authMiddleware, authorizeAdmin, getAllNotifications);
router.delete(
  "/:notificationId",
  authMiddleware,
  authorizeAdmin,
  deleteNotification
);

export { router as notificationRouter };
