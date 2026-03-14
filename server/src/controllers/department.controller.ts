import { prisma } from "../lib/prisma.js";
import ApiResponse from "../utils/api-response.js";
import { AsyncHandler } from "../utils/async-handler.js";

export const createDepartment = AsyncHandler(async (req: any, res: any) => {
  const { name } = req.body;

  const newDepartment = await prisma.department.create({
    data: {
      name,
    },
  });

  console.log(newDepartment);

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Department created successfully...", newDepartment)
    );
});
