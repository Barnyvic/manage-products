import { Product } from "../models/product.model";
import { IProduct, ProductQuery } from "../interfaces/product.interface";
import { CreateProductInput } from "../types/product.types";
import { AppError } from "../interfaces/error.interface";
import { FilterQuery } from "mongoose";

/**
 * Creates a new product in the system
 * @param productData - The product data containing name, description, price, category, stock, and createdBy
 * @returns Promise containing the created product
 * @throws Error if required fields are missing or validation fails
 */
export const createProduct = async (
  productData: CreateProductInput
): Promise<IProduct> => {
  return Product.create(productData);
};

/**
 * Retrieves products with pagination and filtering options
 * @param query - Query parameters for filtering and pagination
 * @param query.page - Page number (default: 1)
 * @param query.limit - Number of items per page (default: 10)
 * @param query.search - Search term for product name and description
 * @param query.category - Filter by category
 * @param query.sortBy - Field to sort by (default: createdAt)
 * @param query.order - Sort order: 'asc' or 'desc' (default: desc)
 * @returns Promise containing products and pagination info
 */
export const getProducts = async (query: ProductQuery) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter: FilterQuery<IProduct> = {};
  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ [sortBy]: order === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("createdBy", "name email");

  return {
    products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Retrieves a single product by its ID
 * @param id - The ID of the product to retrieve
 * @returns Promise containing the product or null if not found
 */
export const getProductById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id).populate("createdBy", "name email");
};

/**
 * Updates a product by its ID
 * @param id - The ID of the product to update
 * @param updateData - Partial product data to update
 * @param userId - The ID of the user making the request
 * @returns Promise containing the updated product or null if not found
 * @throws AppError if user is not authorized to update the product
 */
export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>,
  userId: string
): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  if (!product) {
    return null;
  }

  if (product.createdBy.toString() !== userId) {
    throw new AppError("You are not authorized to update this product", 403);
  }

  return Product.findByIdAndUpdate(id, updateData, { new: true }).populate(
    "createdBy",
    "name email"
  );
};

/**
 * Deletes a product by its ID
 * @param id - The ID of the product to delete
 * @param userId - The ID of the user making the request
 * @returns Promise containing the deleted product or null if not found
 * @throws AppError if user is not authorized to delete the product
 */
export const deleteProduct = async (
  id: string,
  userId: string
): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  if (!product) {
    return null;
  }

  if (product.createdBy.toString() !== userId) {
    throw new AppError("You are not authorized to delete this product", 403);
  }

  return Product.findByIdAndDelete(id);
};
