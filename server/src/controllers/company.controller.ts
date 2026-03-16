import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";

/**
 * @route POST /company/
 * @description Create a new company
 * @access private (admin only)
 */
export const createCompany = AsyncHandler(async (req: any, res: any) => {
  const { companyName, avgPackage, eligibilityCgpa, jobRole, visitDate } =
    req.body;

  if (
    !companyName ||
    !avgPackage ||
    !eligibilityCgpa ||
    !jobRole ||
    !visitDate
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existingCompany = await prisma.company.findFirst({
    where: {
      companyName,
      visitDate: new Date(visitDate), // same company can visit multiple times
    }, // so duplicate = same name + same date
  });

  if (existingCompany) {
    return res
      .status(409)
      .json(new ApiError(409, "Company with this visit date already exists"));
  }

  const newCompany = await prisma.company.create({
    data: {
      companyName,
      avgPackage: parseFloat(avgPackage),
      eligibilityCgpa: parseFloat(eligibilityCgpa),
      jobRole,
      visitDate: new Date(visitDate),
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Company created successfully", newCompany));
});

/**
 * @route GET /company/
 * @description Get all companies with pagination
 * @access private (admin only)
 */
export const getAllCompanies = AsyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalCompanies = await prisma.company.count();

  const companies = await prisma.company.findMany({
    skip,
    take: limit,
    orderBy: { visitDate: "desc" }, // most recent visit first
  });

  return res.status(200).json(
    new ApiResponse(200, "Companies fetched successfully", {
      companies,
      totalCompanies,
      page,
      totalPages: Math.ceil(totalCompanies / limit),
    })
  );
});

/**
 * @route GET /company/:companyId
 * @description Get a single company by ID
 * @access private (admin only)
 */
export const getCompanyById = AsyncHandler(async (req: any, res: any) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(400).json(new ApiError(400, "Company ID is required"));
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).json(new ApiError(404, "Company not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Company fetched successfully", company));
});

/**
 * @route PATCH /company/:companyId
 * @description Update a company
 * @access private (admin only)
 */
export const updateCompanyById = AsyncHandler(async (req: any, res: any) => {
  const { companyId } = req.params;
  const data = req.body;

  if (!companyId) {
    return res.status(400).json(new ApiError(400, "Company ID is required"));
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).json(new ApiError(404, "Company not found"));
  }

  // Parse numeric fields if present in update body
  if (data.avgPackage) data.avgPackage = parseFloat(data.avgPackage);
  if (data.eligibilityCgpa)
    data.eligibilityCgpa = parseFloat(data.eligibilityCgpa);
  if (data.visitDate) data.visitDate = new Date(data.visitDate);

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Company updated successfully", updatedCompany));
});

/**
 * @route DELETE /company/:companyId
 * @description Delete a company
 * @access private (admin only)
 */
export const deleteCompanyById = AsyncHandler(async (req: any, res: any) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(400).json(new ApiError(400, "Company ID is required"));
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).json(new ApiError(404, "Company not found"));
  }

  await prisma.company.delete({ where: { id: companyId } });

  return res
    .status(200)
    .json(new ApiResponse(200, "Company deleted successfully"));
});
