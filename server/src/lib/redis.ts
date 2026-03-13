import { createClient } from "redis";
import { ENV } from "./env.js";

if (!ENV.UPSTASH_REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}
const client = createClient({ url: ENV.UPSTASH_REDIS_URL });

if (!client) {
  throw new Error("Failed to create Redis client");
}

client.on("connect", () => {
  console.log("✅✅ Redis connected successfully...");
});

client.on("error", (err: any) => {
  console.error("❌❌ Redis connection error: ", err);
});
await client.connect();

export { client };
