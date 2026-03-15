import { prisma } from "../lib/prisma.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

export const changePassword = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "Admin not found"));
  }

  const isMatched = await comparePassword(oldPassword, user?.password);
  if (!isMatched) {
    return res.status(400).json(new ApiResponse(400, "Invalid Password"));
  }
  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: { password: hashedPassword },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});
