import { ENV } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { redisClient } from "../lib/redis.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth-middleware.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import {
  baseOptions,
  IPayload,
  refreshTokenOptions,
} from "../utils/constants.js";
import { AsyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { uploadFileToCloudinary } from "../lib/cloudinary.js";
import { generateRollno } from "../utils/generate-rollno.js";

/**
 * @route POST /auth/student/register
 * @desc Register student controller
 * @access private
 */
export const registerStudent = AsyncHandler(async (req: any, res: any) => {
  const { fullName, email, password, gender, branch, isHostel, departmentId } =
    req.body;
  let attachment = null;

  //check user exists or not
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User already exists"));
  }

  const hashedPassword = await hashPassword(password);

  //attach profile image
  if (req?.file) {
    const cloudinaryResult: any = await uploadFileToCloudinary(
      req?.file.buffer,
      "Helpdesk_AI"
    );
    attachment = cloudinaryResult.secure_url;
  }

  const isHostelite = isHostel === "true" ? true : false;
  //create new user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      avatarUrl: attachment,
      gender,
      departmentId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      gender: true,
      departmentId: true,
      role: true,
    },
  });

  const rollno = await generateRollno(gender);

  //create student
  const newStudent = await prisma.student.create({
    data: {
      userId: user.id,
      rollNumber: rollno,
      branch,
      semester: 3,
      admissionYear: new Date().getFullYear(),
      isHostelite,
    },
  });

  //create payload
  const payload = {
    id: user.id,
    email,
    role: user.role,
  };

  //generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  //add to redis
  await redisClient.set(`refresh-token:${user.id}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  //add to cookies
  res.cookie("accessToken", accessToken, baseOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  //send email
  // email will be sent

  // return
  return res.status(201).json(
    new ApiResponse(201, "Student registered successfully", {
      accessToken,
      refreshToken,
    })
  );
});

/**
 * @route POST /auth/admin/register
 * @desc Register user controller
 * @access private
 */
export const registerAdmin = AsyncHandler(async (req: any, res: any) => {
  const {
    fullName,
    email,
    password,
    gender,
    branch,
    designation,
    departmentId,
  } = req.body;
  let attachment = null;

  //check user exists or not
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User already exists"));
  }

  const hashedPassword = await hashPassword(password);

  //attach profile image
  if (req?.file) {
    const cloudinaryResult: any = await uploadFileToCloudinary(
      req?.file.buffer,
      "Helpdesk_AI"
    );
    attachment = cloudinaryResult.secure_url;
  }

  //create new user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      avatarUrl: attachment,
      role: "ADMIN",
      gender,
      departmentId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      gender: true,
      departmentId: true,
      role: true,
    },
  });

  //create student
  const newAdmin = await prisma.admin.create({
    data: {
      userId: user.id,
      branch,
      designation,
    },
  });

  //crate payload
  const payload = {
    id: user.id,
    email,
    role: user.role,
  };

  //generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  //add to redis
  await redisClient.set(`refresh-token:${user.id}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  //add to cookies
  res.cookie("accessToken", accessToken, baseOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  //send email
  // email will be sent

  // return
  return res.status(201).json(
    new ApiResponse(201, "Admin registered successfully", {
      accessToken,
      refreshToken,
    })
  );
});

/**
 * @route POST /auth/login
 * @desc Login user controller
 * @access public
 */
export const loginUser = AsyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  //access & refresh token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("accessToken", accessToken, baseOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  await redisClient.set(`refresh-token:${user.id}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });
  console.log("user logged in:", email);

  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully...", {
      accessToken,
      refreshToken,
    })
  );
});

// /**
//  * @route GET /auth/verify-email
//  * @desc Verify email controller
//  * @access public
//  */
// export const verifyEmail = AsyncHandler(async (req: any, res: any) => {
//   return res.status(200).send("hello");
// });

/**
 * @route POST /auth/logout
 * @desc logout user controller
 * @access private
 */
export const logoutUser = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }

  await redisClient.set(`blackList-token:${refreshToken}`, "BLOCKED", {
    EX: 7 * 24 * 60 * 60,
  });

  res.clearCookie("accessToken", baseOptions);
  res.clearCookie("refreshToken", refreshTokenOptions);
  await redisClient.del(`refresh-token:${userId}`);

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

/**
 * @route POST /auth/forgot-password
 * @desc forgot password controller
 * @access public
 */
export const forgotPassword = AsyncHandler(async (req: any, res: any) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  await redisClient.set(`verify-otp:${user.email}`, otp, { EX: 10 * 60 });
  // await sendResetPasswordMail(user.email, user.username, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, "OTP sent to email successfully"));
});

/**
 * @route POST /auth/reset-password
 * @desc reset password controller
 * @access public
 */
export const resetPassword = AsyncHandler(async (req: any, res: any) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const storedOtp = await redisClient.get(`verify-otp:${email}`);

  if (!storedOtp || otp.toString() !== storedOtp) {
    return res.status(400).json(new ApiError(400, "Invalid  OTP"));
  }

  const hashedPassword = await hashPassword(newPassword);

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: { password: hashedPassword },
  });

  await redisClient.del(`verify-otp:${email}`);

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
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
    const blacklisted = await redisClient.get(
      `blackList-token:${refreshToken}`
    );
    if (blacklisted === "BLOCKED") {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    const decoded = jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN_SECRET
    ) as IPayload;
    const { id, email, role } = decoded;

    const storedRefreshToken = await redisClient.get(`refresh-token:${id}`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Session expired. Please login again."));
    }

    const accessToken = generateAccessToken({ id, email, role });

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
