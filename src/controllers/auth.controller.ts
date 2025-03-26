import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { validate } from "../utils/validate";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { AppError } from "../interfaces/error.interface";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = await validate(registerSchema, req);
      if (!validation.success) {
        errorResponse(res, "Validation failed", 400);
        return;
      }

      const result = await this.authService.register(req.body);
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

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = await validate(loginSchema, req);
      if (!validation.success) {
        errorResponse(res, "Validation failed", 400);
        return;
      }

      const result = await this.authService.login(req.body);
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
}
