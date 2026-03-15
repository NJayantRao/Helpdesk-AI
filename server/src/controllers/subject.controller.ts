import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";

/**
 * @route POST /subject/
 * @description create subject controller
 * @access private
 */
export const createSubject = AsyncHandler(async (req: any, res: any) => {
  //validator checks these things
  const { subjectName, subjectCode, credits, departmentId } = req.body;
  if (!subjectName || !subjectCode || !credits || !departmentId) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }
  const credit = parseInt(credits);
  const existingSubject = await prisma.subject.findUnique({
    where: {
      subjectCode,
    },
  });
  if (existingSubject) {
    return res.status(409).json(new ApiResponse(409, "Subject already exists"));
  }
  const newSubject = await prisma.subject.create({
    data: {
      subjectName,
      subjectCode,
      credits: credit,
      departmentId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Subject created successfully", newSubject));
});

/**
 * @route GET /subject/
 * @description get all subjects controller
 * @access private
 */
export const getAllSubjects = AsyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalSubjects = await prisma.subject.count();

  const subjects = await prisma.subject.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Subjects retrieved successfully", {
      subjects,
      totalSubjects,
    })
  );
});

/**
 * @route GET /subject/:subjectId
 * @description get subject by id controller
 * @access private
 */
export const getSubjectById = AsyncHandler(async (req: any, res: any) => {
  const { subjectId } = req.params;

  if (!subjectId) {
    return res.status(400).json(new ApiError(400, "Subject ID is required"));
  }
  console.log(subjectId);

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      id: true,
      subjectName: true,
      subjectCode: true,
      credits: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }
  console.log(subject);
  return res
    .status(200)
    .json(new ApiResponse(200, "Subject fetched successfully", subject));
});

/**
 * @route PATCH /subject/:subjectId
 * @description update subject by id controller
 * @access private
 */

export const updateSubjectById = AsyncHandler(async (req: any, res: any) => {
  const data = req.body;
  const { subjectId } = req.params;
  if (!subjectId) {
    return res.status(400).json(new ApiError(400, "Subject ID is required"));
  }
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }

  const updatedSubject = await prisma.subject.update({
    where: { id: subjectId },
    data: data,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Subject updated successfully", updatedSubject));
});

/**
 * @route DELETE /subject/:subjectId
 * @description delete subject by id controller
 * @access private
 */
export const deleteSubjectById = AsyncHandler(async (req: any, res: any) => {
  const { subjectId } = req.params;

  if (!subjectId) {
    return res.status(400).json(new ApiError(400, "Subject ID is required"));
  }

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }

  const deletedSubject = await prisma.subject.delete({
    where: { id: subjectId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Subject deleted successfully", deletedSubject));
});
