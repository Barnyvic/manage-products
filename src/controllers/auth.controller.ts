import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { validate } from "../utils/validate";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { AppError } from "../interfaces/error.interface";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await validate(registerSchema, req);
    if (!validation.success) {
      errorResponse(res, "Validation failed", 400);
      return;
    }

    const result = await authService.register(req.body);
    successResponse(res, "User registered successfully", result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, "Registration failed", 400);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await validate(loginSchema, req);
    if (!validation.success) {
      errorResponse(res, "Validation failed", 400);
      return;
    }

    const result = await authService.login(req.body);
    successResponse(res, "Login successful", result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, "Login failed", 401);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};
