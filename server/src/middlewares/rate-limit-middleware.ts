import { redisClient } from "../lib/redis.js";
import ApiError from "../utils/api-error.js";

const rateLimiter = async (req: any, res: any, next: any) => {
  try {
    const ip = req.ip;
    const email = req.email;
    const rateLimitKey = `rate-limit:${ip}-${email}`;
    const requests = await redisClient.incr(rateLimitKey);

    if (requests === 1) {
      await redisClient.expire(rateLimitKey, 60);
    }
    if (requests > 5) {
      return res
        .status(429)
        .json(new ApiError(429, "Too many requests. Please try again later."));
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, "Internal server error."));
  }
};

export { rateLimiter };
