import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { validate } from "../utils/validate";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validations/product.validation";
import { AppError } from "../interfaces/error.interface";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await validate(createProductSchema, req);
    if (!validation.success) {
      errorResponse(res, "Validation failed", 400, validation.error);
      return;
    }

    const productData = {
      ...req.body,
      createdBy: req.user?.id,
    };

    const product = await productService.createProduct(productData);
    successResponse(res, "Product created successfully", product);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, "Failed to create product", 400);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await validate(productQuerySchema, req);
    if (!validation.success) {
      errorResponse(res, "Validation failed", 400, validation.error);
      return;
    }

    const result = await productService.getProducts(req.query);
    successResponse(res, "Products retrieved successfully", result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      errorResponse(res, "Product not found", 404);
      return;
    }
    successResponse(res, "Product retrieved successfully", product);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, "Failed to retrieve product", 400);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await validate(updateProductSchema, req);
    if (!validation.success) {
      errorResponse(res, "Validation failed", 400, validation.error);
      return;
    }

    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user?.id || ""
    );
    if (!product) {
      errorResponse(res, "Product not found", 404);
      return;
    }
    successResponse(res, "Product updated successfully", product);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productService.deleteProduct(
      req.params.id,
      req.user?.id || ""
    );
    if (!product) {
      errorResponse(res, "Product not found", 404);
      return;
    }
    successResponse(res, "Product deleted successfully");
  } catch (error: unknown) {
    if (error instanceof AppError) {
      errorResponse(res, error.message, error.statusCode);
      return;
    }
    if (error instanceof Error) {
      errorResponse(res, error.message, 400);
      return;
    }
    errorResponse(res, "An unknown error occurred", 500);
  }
};
