import { Request, Response } from "express";
import { checkHealth } from "../services/health.service";
import { successResponse } from "../utils/apiResponse";

export const getHealth = async (req: Request, res: Response) => {
  try {
    const healthStatus = await checkHealth();
    return successResponse(res, "Health check completed", healthStatus);
  } catch (error) {
    return successResponse(res, "Health check completed with issues", {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
};
