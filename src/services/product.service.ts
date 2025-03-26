import { Product } from "../models/product.model";
import { IProduct, ProductQuery } from "../interfaces/product.interface";
import mongoose from "mongoose";

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdBy: string | mongoose.Types.ObjectId;
};

export const createProduct = async (
  productData: CreateProductInput
): Promise<IProduct> => {
  return Product.create(productData);
};

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

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id).populate("createdBy", "name email");
};

export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, updateData, { new: true }).populate(
    "createdBy",
    "name email"
  );
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};
