import { ENV } from "../lib/env.js";

const baseOptions = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: ENV.NODE_ENV === "PRODUCTION",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenOptions = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: ENV.NODE_ENV === "PRODUCTION",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export { baseOptions, refreshTokenOptions };
