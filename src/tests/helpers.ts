import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { CreateProductInput } from "../types/product.types";
import { IProduct } from "../interfaces/product.interface";

export interface TestData {
  user: mongoose.Document;
  product: mongoose.Document & IProduct;
}

export const createTestUser = async () => {
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
  });
  return user;
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
