import { ENV } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { redisClient } from "../lib/redis.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth-middleware.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
// import AsyncHandler from "../utils/async-handler.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { baseOptions, refreshTokenOptions } from "../utils/constants.js";
import { AsyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

/**
 * @route POST /auth/register
 * @desc Register user controller
 * @access public
 */
export const registerUser = AsyncHandler(async (req: any, res: any) => {
  return res.status(200).send("hello");
});

/**
 * @route POST /auth/login
 * @desc Login user controller
 * @access public
 */
export const loginUser = AsyncHandler(async (req: any, res: any) => {
  return res.status(200).send("hello");
});

/**
 * @route GET /auth/verify-email
 * @desc Verify email controller
 * @access public
 */
export const verifyEmail = AsyncHandler(async (req: any, res: any) => {
  return res.status(200).send("hello");
});

/**
 * @route POST /auth/logout
 * @desc logout user controller
 * @access private
 */
export const logoutUser = AsyncHandler(async (req: any, res: any) => {
  return res.status(200).send("hello");
});

/**
 * @route POST /auth/forgot-password
 * @desc forgot password controller
 * @access public
 */
export const forgotPassword = AsyncHandler(async (req: any, res: any) => {
  return res.status(200).send("hello");
});

/**
 * @route POST /auth/reset-password
 * @desc reset password controller
 * @access public
 */
export const resetPassword = AsyncHandler(async (req: any, res: any) => {
  return res.status(200).send("hello");
});

/**
 * @route POST /auth/refresh-token
 * @desc Refresh access token controller
 * @access public
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const authorization = req?.headers?.authorization;
    const refreshToken =
      req?.cookies?.refreshToken || authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    interface IPayload {
      id: string;
      email: string;
      role: string;
    }
    const decoded = jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN_SECRET
    ) as IPayload;
    const { id, email } = decoded;

    const storedRefreshToken = await redisClient.get(`refresh-token:${id}`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Session expired. Please login again."));
    }

    const accessToken = jwt.sign({ id, email }, ENV.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, baseOptions);

    return res.status(200).json(
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken,
      })
    );
  } catch (error: any) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiError(401, "Session expired, Please login again"));
    }
    return res.status(401).json(new ApiError(401, "Invalid Token"));
  }
};
