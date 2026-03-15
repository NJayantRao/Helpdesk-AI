import express from "express";
import {
  updateAttendance,
  getAttendanceBySubject,
} from "../controllers/attendance.controller.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get(
  "/subject/:subjectId",
  authMiddleware,
  authorizeAdmin,
  getAttendanceBySubject
);
router.patch(
  "/:studentId/:subjectId",
  authMiddleware,
  authorizeAdmin,
  updateAttendance
);

export { router as attendanceRouter };
