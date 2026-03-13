import dotenv from "dotenv";

dotenv.config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
};

export { ENV };
