import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { IProduct } from "../interfaces/product.interface";
import redisClient from "../utils/redis";

export interface TestData {
  user: mongoose.Document;
  product: IProduct & { _id: mongoose.Types.ObjectId };
}

export const createTestUser = async (email: string = "test@example.com") => {
  const user = await User.create({
    name: "Test User",
    email,
    password: "password123",
  });
  return user;
};

export const createTestProduct = async (userId: string) => {
  return {
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    category: "Test Category",
    stock: 10,
    createdBy: new mongoose.Types.ObjectId(userId),
  };
};

export const setupTestData = async (): Promise<TestData> => {
  const user = await createTestUser();
  const productData = await createTestProduct(user.id);
  const product = await Product.create(productData);
  return {
    user,
    product: product as IProduct & { _id: mongoose.Types.ObjectId },
  };
};

// Clean up Redis cache after tests
export const clearRedisCache = async () => {
  await redisClient.flushall();
};
