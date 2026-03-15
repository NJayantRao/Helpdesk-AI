import express from "express";
import { createDepartment } from "../controllers/department.controller.js";
import {
  authMiddleware,
  authorizeSystemUser,
} from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeSystemUser, createDepartment);

export { router as departmentRouter };
