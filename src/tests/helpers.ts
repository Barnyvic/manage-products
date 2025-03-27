import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { CreateProductInput } from "../types/product.types";
import { IProduct } from "../interfaces/product.interface";

export interface TestData {
  user: mongoose.Document;
  product: mongoose.Document & IProduct;
}

export const createTestUser = async (email?: string) => {
  return User.create({
    name: "Test User",
    email: email || "test@example.com",
    password: "password123",
  });
};

export const createTestProduct = async (
  userId: string
): Promise<CreateProductInput> => {
  return {
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    category: "Test Category",
    stock: 10,
    createdBy: new mongoose.Types.ObjectId(userId),
  };
};

export const setupTestData = async () => {
  const user = await createTestUser();
  const productData = await createTestProduct(user.id);
  const product = await Product.create(productData);
  return {
    user,
    product: product as mongoose.Document & IProduct,
  };
};
