import { prisma } from "../lib/prisma.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

export const getAdminProfile = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      avatarUrl: true,
      gender: true,
      departmentId: true,
      createdAt: true,
      updatedAt: true,
      admin: {
        select: {
          branch: true,
          designation: true,
        },
      },
    },
  });

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, "Admin not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Admin profile fetched successfully", admin));
});
