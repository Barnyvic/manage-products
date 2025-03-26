import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { logger } from "../utils/logger";
import { errorResponse } from "../utils/apiResponse";

export const errorMiddleware: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    errorResponse(res, error.message, 400);
    return;
  }

  if (error.name === "UnauthorizedError") {
    errorResponse(res, "Unauthorized access", 401);
    return;
  }

  if (error.name === "ForbiddenError") {
    errorResponse(res, "Forbidden access", 403);
    return;
  }

  if (error.name === "NotFoundError") {
    errorResponse(res, "Resource not found", 404);
    return;
  }

  errorResponse(res, "Internal server error", 500);
};
