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

export const changePassword = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!student) {
    return res.status(404).json(new ApiResponse(404, "Student not found"));
  }

  const isMatched = await comparePassword(oldPassword, student?.password);
  if (!isMatched) {
    return res.status(400).json(new ApiResponse(400, "Invalid Password"));
  }
  const hashedPassword = await hashPassword(newPassword);
  const updatedStudent = await prisma.user.update({
    where: {
      id: userId,
    },
    data: { password: hashedPassword },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});
