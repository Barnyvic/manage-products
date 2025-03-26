import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { validate } from "../utils/validate";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validations/product.validation";
import { AppError } from "../interfaces/error.interface";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = await validate(createProductSchema, req);
      if (!validation.success) {
        errorResponse(res, "Validation failed", 400);
        return;
      }

      const productData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const product = await this.productService.createProduct(productData);
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

  getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = await validate(productQuerySchema, req);
      if (!validation.success) {
        errorResponse(res, "Validation failed", 400);
        return;
      }

      const result = await this.productService.getProducts(req.query);
      successResponse(res, "Products retrieved successfully", result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        errorResponse(res, error.message, error.statusCode);
        return;
      }
      if (error instanceof Error) {
        errorResponse(res, "Failed to retrieve products", 400);
        return;
      }
      errorResponse(res, "An unknown error occurred", 500);
    }
  };

  getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
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

  updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = await validate(updateProductSchema, req);
      if (!validation.success) {
        errorResponse(res, "Validation failed", 400);
        return;
      }

      const product = await this.productService.updateProduct(
        req.params.id,
        req.body
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
        errorResponse(res, "Failed to update product", 400);
        return;
      }
      errorResponse(res, "An unknown error occurred", 500);
    }
  };

  deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await this.productService.deleteProduct(req.params.id);
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
        errorResponse(res, "Failed to delete product", 400);
        return;
      }
      errorResponse(res, "An unknown error occurred", 500);
    }
  };
}
