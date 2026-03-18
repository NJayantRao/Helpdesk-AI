import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { uploadPdfToCloudinary } from "../lib/cloudinary.js";

/**
 * @route POST /document/
 * @description Upload a document (admin only)
 * @access private (admin only)
 */
export const uploadDocument = AsyncHandler(async (req: any, res: any) => {
  const { title, category, departmentId } = req.body;
  const adminUserId = req.user.id;

  if (!title || !category || !departmentId) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  if (!req.file) {
    return res.status(400).json(new ApiError(400, "No file uploaded"));
  }

  const admin = await prisma.admin.findUnique({
    where: { userId: adminUserId },
    select: { id: true },
  });

  if (!admin) {
    return res.status(404).json(new ApiError(404, "Admin not found"));
  }

  const cloudinaryResult = (await uploadPdfToCloudinary(
    req.file.buffer,
    "ERP_Documents",
    req.file.originalname
  )) as any;

  const document = await prisma.document.create({
    data: {
      title,
      category,
      departmentId,
      uploadedById: admin.id,
      fileUrl: cloudinaryResult.secure_url,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Document uploaded successfully", document));
});

/**
 * @route GET /student/documents
 * @description Get documents for student's department
 * @access private (student only)
 */
export const getStudentDocuments = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { category, search } = req.query;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { departmentId: true },
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const documents = await prisma.document.findMany({
    where: {
      departmentId: user.departmentId,
      ...(category && { category }),
      ...(search && {
        title: { contains: search as string, mode: "insensitive" },
      }),
    },
    select: {
      id: true,
      title: true,
      category: true,
      fileUrl: true,
      createdAt: true,
      uploadedBy: {
        select: {
          user: { select: { fullName: true } },
          designation: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(
    new ApiResponse(200, "Documents fetched successfully", {
      documents,
      total: documents.length,
    })
  );
});

/**
 * @route DELETE /document/:documentId
 * @description Delete a document
 * @access private (admin only)
 */
export const deleteDocument = AsyncHandler(async (req: any, res: any) => {
  const { documentId } = req.params;

  if (!documentId) {
    return res.status(400).json(new ApiError(400, "Document ID is required"));
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    return res.status(404).json(new ApiError(404, "Document not found"));
  }

  await prisma.document.delete({ where: { id: documentId } });

  return res
    .status(200)
    .json(new ApiResponse(200, "Document deleted successfully"));
});
