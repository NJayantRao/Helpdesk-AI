import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.js";
import { ENV } from "../lib/env.js";

const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authorization = req.headers.authorization;

    const token = req?.cookies?.accessToken || authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json(new ApiError(403, "Token expired"));
    }
    return res.status(401).json(new ApiError(401, "Invalid Token"));
  }
};

interface IPayload {
  id: string;
  email: string;
  role: string;
}

const generateAccessToken = (userData: IPayload) => {
  const token = jwt.sign(userData, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

const generateRefreshToken = (userData: IPayload) => {
  const token = jwt.sign(userData, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export { generateAccessToken, generateRefreshToken, authMiddleware };
