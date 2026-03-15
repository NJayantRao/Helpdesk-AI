import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
} from "../controllers/company.controller.js";
import {
  authMiddleware,
  authorizeAdmin,
} from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeAdmin, createCompany);
router.get("/", authMiddleware, authorizeAdmin, getAllCompanies);
router.get("/:companyId", authMiddleware, authorizeAdmin, getCompanyById);
router.patch("/:companyId", authMiddleware, authorizeAdmin, updateCompanyById);
router.delete("/:companyId", authMiddleware, authorizeAdmin, deleteCompanyById);

export { router as companyRouter };
