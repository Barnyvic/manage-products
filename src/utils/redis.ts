import Redis from "ioredis";
import { logger } from "./logger";

const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redisClient.on("error", (error) => {
  logger.error("Redis connection error:", error);
});

redisClient.on("connect", () => {
  logger.info("Successfully connected to Redis");
});

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error("Error getting cached data:", error);
    return null;
  }
};

export const setCachedData = async (
  key: string,
  data: any,
  expireSeconds: number = 3600
): Promise<void> => {
  try {
    await redisClient.setex(key, expireSeconds, JSON.stringify(data));
  } catch (error) {
    logger.error("Error setting cached data:", error);
  }
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      logger.info(`Invalidated cache for pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error("Error invalidating cache:", error);
  }
};

export default redisClient;
