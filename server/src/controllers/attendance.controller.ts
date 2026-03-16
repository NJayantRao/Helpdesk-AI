import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";

/**
 * @route PATCH /attendance/:studentId/:subjectId
 * @description Update attendance percentage for a student in a subject
 * @access private (admin only)
 */
export const updateAttendance = AsyncHandler(async (req: any, res: any) => {
  const { studentId, subjectId } = req.params;
  const { percentage } = req.body;

  if (!studentId || !subjectId) {
    return res
      .status(400)
      .json(new ApiError(400, "Student ID and Subject ID are required"));
  }

  if (percentage === undefined || percentage < 0 || percentage > 100) {
    return res
      .status(400)
      .json(new ApiError(400, "Percentage must be between 0 and 100"));
  }

  const attendance = await prisma.attendance.findUnique({
    where: { studentId_subjectId: { studentId, subjectId } },
  });

  if (!attendance) {
    return res
      .status(404)
      .json(
        new ApiError(404, "Attendance record not found. Is student enrolled?")
      );
  }

  const updated = await prisma.attendance.update({
    where: { studentId_subjectId: { studentId, subjectId } },
    data: { percentage: parseFloat(percentage) },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance updated successfully", updated));
});

/**
 * @route GET /attendance/subject/:subjectId
 * @description Get attendance of all students in a subject
 * @access private (admin only)
 */
export const getAttendanceBySubject = AsyncHandler(
  async (req: any, res: any) => {
    const { subjectId } = req.params;

    if (!subjectId) {
      return res.status(400).json(new ApiError(400, "Subject ID is required"));
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { subjectName: true, subjectCode: true },
    });

    if (!subject) {
      return res.status(404).json(new ApiError(404, "Subject not found"));
    }

    const attendance = await prisma.attendance.findMany({
      where: { subjectId },
      select: {
        percentage: true,
        student: {
          select: {
            rollNumber: true,
            user: { select: { fullName: true } },
          },
        },
      },
      orderBy: { student: { rollNumber: "asc" } },
    });

    return res.status(200).json(
      new ApiResponse(200, "Attendance fetched successfully", {
        subject,
        totalStudents: attendance.length,
        attendance: attendance.map((a) => ({
          rollNumber: a.student.rollNumber,
          fullName: a.student.user.fullName,
          percentage: a.percentage,
        })),
      })
    );
  }
);
