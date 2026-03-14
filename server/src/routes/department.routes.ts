import express from "express";
import { createDepartment } from "../controllers/department.controller.js";

const router = express.Router();

router.post("/", createDepartment);

export { router as departmentRouter };
