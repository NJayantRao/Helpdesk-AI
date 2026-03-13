import type { Request, Response, NextFunction } from "express";
import ApiError from "./api-error.js";

const AsyncHandler = async (fn: any) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (error: any) {
      console.log(error);
      if (error.code === "P2002") {
        return res
          .status(400)
          .json(new ApiError(400, "Unique constraint failed"));
      }
      return res
        .status(500)
        .json(new ApiError(500, "Internal Server Error..."));
    }
  };
};

export { AsyncHandler };
