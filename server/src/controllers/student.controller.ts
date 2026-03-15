import { prisma } from "../lib/prisma.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

export const getStudentProfile = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      avatarUrl: true,
      gender: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
      student: {
        select: {
          rollNumber: true,
          branch: true,
          semester: true,
          admissionYear: true,
          isHostelite: true,
          cgpa: true,
        },
      },
    },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Student profile fetched successfully", student)
    );
});

export const getStudentSubjects = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, student: true },
  });
  if (!user?.student) {
    return res.status(404).json({ message: "Student subjects not found" });
  }

  const subjects = await prisma.student.findUnique({
    where: { id: userId },
    select: { subjects: true },
  });

  console.log(subjects);

  return res
    .status(200)
    .json(new ApiResponse(200, "Subjects fetched successfully"));
});
