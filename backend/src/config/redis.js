import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL?.replace(/^"(.*)"$/, "$1");

const redis = new Redis(redisUrl);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.log("Redis error:", err));

export default redis;
