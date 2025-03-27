import mongoose from "mongoose";
import redisClient from "../utils/redis";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    mongodb: {
      status: "up" | "down";
      latency?: number;
    };
    redis: {
      status: "up" | "down";
      latency?: number;
    };
  };
  uptime: number;
}

export const checkHealth = async (): Promise<HealthStatus> => {
  const healthStatus: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      mongodb: { status: "down" },
      redis: { status: "down" },
    },
    uptime: process.uptime(),
  };

  try {
    // Check MongoDB connection
    const mongoStartTime = Date.now();
    const mongoState = mongoose.connection.readyState;
    healthStatus.services.mongodb = {
      status: mongoState === 1 ? "up" : "down",
      latency: Date.now() - mongoStartTime,
    };

    // Check Redis connection
    const redisStartTime = Date.now();
    await redisClient.ping();
    healthStatus.services.redis = {
      status: "up",
      latency: Date.now() - redisStartTime,
    };

    // Update overall status
    healthStatus.status =
      healthStatus.services.mongodb.status === "up" &&
      healthStatus.services.redis.status === "up"
        ? "healthy"
        : "unhealthy";

    return healthStatus;
  } catch (error) {
    healthStatus.status = "unhealthy";
    return healthStatus;
  }
};
