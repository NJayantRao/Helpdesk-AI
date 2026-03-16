import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";

/**
 * @route POST /subject/
 * @description Create a subject
 * @access private (admin only)
 */
export const createSubject = AsyncHandler(async (req: any, res: any) => {
  const { subjectName, subjectCode, credits, departmentId, semester } =
    req.body;

  if (!subjectName || !subjectCode || !credits || !departmentId || !semester) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existingSubject = await prisma.subject.findUnique({
    where: { subjectCode },
  });

  if (existingSubject) {
    return res.status(409).json(new ApiError(409, "Subject already exists"));
  }

  const newSubject = await prisma.subject.create({
    data: {
      subjectName,
      subjectCode,
      credits: parseInt(credits),
      departmentId,
      semester: parseInt(semester),
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Subject created successfully", newSubject));
});

/**
 * @route GET /subject/
 * @description Get all subjects with pagination
 * @access private (admin only)
 */
export const getAllSubjects = AsyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalSubjects = await prisma.subject.count();

  const subjects = await prisma.subject.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      subjectName: true,
      subjectCode: true,
      credits: true,
      semester: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Subjects fetched successfully", {
      subjects,
      totalSubjects,
      page,
      totalPages: Math.ceil(totalSubjects / limit),
    })
  );
});

/**
 * @route GET /subject/:subjectId
 * @description Get subject by ID
 * @access private (admin only)
 */
export const getSubjectById = AsyncHandler(async (req: any, res: any) => {
  const { subjectId } = req.params;

  if (!subjectId) {
    return res.status(400).json(new ApiError(400, "Subject ID is required"));
  }

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: {
      id: true,
      subjectName: true,
      subjectCode: true,
      credits: true,
      semester: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subject fetched successfully", subject));
});

/**
 * @route PATCH /subject/:subjectId
 * @description Update subject by ID
 * @access private (admin only)
 */
export const updateSubjectById = AsyncHandler(async (req: any, res: any) => {
  const { subjectId } = req.params;
  const data = req.body;

  if (!subjectId) {
    return res.status(400).json(new ApiError(400, "Subject ID is required"));
  }

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }

  // Parse numeric fields if present in update body
  if (data.credits) data.credits = parseInt(data.credits);
  if (data.semester) data.semester = parseInt(data.semester);

  const updatedSubject = await prisma.subject.update({
    where: { id: subjectId },
    data,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Subject updated successfully", updatedSubject));
});

/**
 * @route DELETE /subject/:subjectId
 * @description Delete subject by ID
 * @access private (admin only)
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

  await prisma.subject.delete({ where: { id: subjectId } });

  return res
    .status(200)
    .json(new ApiResponse(200, "Subject deleted successfully"));
});

/**
 * @route POST /subject/:subjectId/enroll/bulk
 * @description Auto-enroll all students of a semester + department
 * @access private (admin only)
 */
export const bulkEnrollBySemester = AsyncHandler(async (req: any, res: any) => {
  const { subjectId } = req.params;
  const { semester, departmentId } = req.body;

  if (!subjectId || !semester || !departmentId) {
    return res
      .status(400)
      .json(
        new ApiError(400, "subjectId, semester and departmentId are required")
      );
  }

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: {
      id: true,
      subjectName: true,
      subjectCode: true,
      departmentId: true,
    },
  });

  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }

  if (subject.departmentId !== departmentId) {
    return res
      .status(400)
      .json(new ApiError(400, "Subject does not belong to this department"));
  }

  const eligibleStudents = await prisma.student.findMany({
    where: {
      semester: parseInt(semester),
      user: { departmentId },
    },
    select: {
      id: true,
      subjects: {
        where: { id: subjectId },
        select: { id: true },
      },
    },
  });

  if (eligibleStudents.length === 0) {
    return res
      .status(404)
      .json(
        new ApiError(404, "No students found for this semester and department")
      );
  }

  const alreadyEnrolledIds = eligibleStudents
    .filter((s) => s.subjects.length > 0)
    .map((s) => s.id);

  const newStudentIds = eligibleStudents
    .filter((s) => s.subjects.length === 0)
    .map((s) => s.id);

  if (newStudentIds.length === 0) {
    return res
      .status(409)
      .json(
        new ApiError(409, "All students are already enrolled in this subject")
      );
  }

  await prisma.$transaction([
    prisma.subject.update({
      where: { id: subjectId },
      data: {
        student: {
          connect: newStudentIds.map((id) => ({ id })),
        },
      },
    }),
    prisma.attendance.createMany({
      data: newStudentIds.map((studentId) => ({
        studentId,
        subjectId,
        percentage: 0,
      })),
      skipDuplicates: true,
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Bulk enrollment successful", {
      subject: {
        id: subject.id,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
      },
      semester,
      departmentId,
      totalEligible: eligibleStudents.length,
      enrolled: newStudentIds.length,
      skipped: alreadyEnrolledIds.length,
    })
  );
});

/**
 * @route DELETE /subject/:subjectId/enroll/:studentId
 * @description Remove a student from a subject
 * @access private (admin only)
 */
export const unenrollStudent = AsyncHandler(async (req: any, res: any) => {
  const { subjectId, studentId } = req.params;

  if (!subjectId || !studentId) {
    return res
      .status(400)
      .json(new ApiError(400, "Subject ID and Student ID are required"));
  }

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true, subjectName: true },
  });

  if (!subject) {
    return res.status(404).json(new ApiError(404, "Subject not found"));
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true, rollNumber: true },
  });

  if (!student) {
    return res.status(404).json(new ApiError(404, "Student not found"));
  }

  const isEnrolled = await prisma.student.findFirst({
    where: {
      id: studentId,
      subjects: { some: { id: subjectId } },
    },
  });

  if (!isEnrolled) {
    return res
      .status(400)
      .json(new ApiError(400, "Student is not enrolled in this subject"));
  }

  // Unenroll + delete attendance atomically
  await prisma.$transaction([
    prisma.subject.update({
      where: { id: subjectId },
      data: {
        student: { disconnect: { id: studentId } },
      },
    }),
    prisma.attendance.deleteMany({
      where: { studentId, subjectId },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Student unenrolled successfully", {
      subject: { id: subject.id, subjectName: subject.subjectName },
      student: { id: student.id, rollNumber: student.rollNumber },
    })
  );
});
