import { Product } from "../models/product.model";
import { IProduct, ProductQuery } from "../interfaces/product.interface";
import { CreateProductInput } from "../types/product.types";

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

  const filter: any = {};
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
 * @returns Promise containing the updated product or null if not found
 */
export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, updateData, { new: true }).populate(
    "createdBy",
    "name email"
  );
};

/**
 * Deletes a product by its ID
 * @param id - The ID of the product to delete
 * @returns Promise containing the deleted product or null if not found
 */
export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};
