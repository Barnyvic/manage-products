import mongoose from "mongoose";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import {
  createTestUser,
  createTestProduct,
  setupTestData,
  TestData,
} from "./helpers";
import { IProduct } from "../interfaces/product.interface";

describe("Product Service", () => {
  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const user = await createTestUser();
      const productData = await createTestProduct(user.id);
      const result = await createProduct(productData);

      expect(result).toHaveProperty("name", productData.name);
      expect(result).toHaveProperty("price", productData.price);
      expect(result.createdBy.toString()).toBe(user.id);
    });

    it("should throw error if required fields are missing", async () => {
      const user = await createTestUser();
      const productData = await createTestProduct(user.id);
      delete (productData as any).name;
      await expect(createProduct(productData)).rejects.toThrow();
    });
  });

  describe("getProducts", () => {
    beforeEach(async () => {
      await setupTestData();
    });

    it("should get all products", async () => {
      const result = await getProducts({});
      expect(result.products).toBeInstanceOf(Array);
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products[0]).toHaveProperty("name", "Test Product");
      expect(result.pagination).toBeDefined();
    });

    it("should filter products by category", async () => {
      const result = await getProducts({ category: "Test Category" });
      expect(result.products[0]).toHaveProperty("category", "Test Category");
    });

    it("should handle pagination", async () => {
      const user = await createTestUser("pagination-test@example.com");
      // Create 15 products
      for (let i = 0; i < 15; i++) {
        const productData = await createTestProduct(user.id);
        productData.name = `Test Product ${i}`;
        await createProduct(productData);
      }

      const result = await getProducts({ page: 2, limit: 10 });
      expect(result.products.length).toBeLessThanOrEqual(10);
      expect(result.pagination.page).toBe(2);
    });
  });

  describe("getProductById", () => {
    let productId: string;

    beforeEach(async () => {
      const { product } = await setupTestData();
      productId = (product as any)._id.toString();
    });

    it("should get product by id", async () => {
      const product = await getProductById(productId);
      expect(product).toHaveProperty("name", "Test Product");
      expect((product as any)?._id.toString()).toBe(productId);
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await getProductById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe("updateProduct", () => {
    let productId: string;
    let userId: string;

    beforeEach(async () => {
      const { product, user } = await setupTestData();
      productId = (product as any)._id.toString();
      userId = user.id;
    });

    it("should update product successfully", async () => {
      const updateData = {
        name: "Updated Product",
        price: 199.99,
      };
      const updated = await updateProduct(productId, updateData, userId);
      expect(updated).toHaveProperty("name", updateData.name);
      expect(updated).toHaveProperty("price", updateData.price);
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await updateProduct(
        nonExistentId,
        { name: "Test" },
        userId
      );
      expect(result).toBeNull();
    });

    it("should throw error if user is not the creator", async () => {
      const otherUser = await createTestUser("other@example.com");
      const updateData = { name: "Updated Product" };
      await expect(
        updateProduct(productId, updateData, otherUser.id)
      ).rejects.toThrow("You are not authorized to update this product");
    });
  });

  describe("deleteProduct", () => {
    let productId: string;
    let userId: string;

    beforeEach(async () => {
      const { product, user } = await setupTestData();
      productId = (product as any)._id.toString();
      userId = user.id;
    });

    it("should delete product successfully", async () => {
      await deleteProduct(productId, userId);
      const deleted = await getProductById(productId);
      expect(deleted).toBeNull();
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await deleteProduct(nonExistentId, userId);
      expect(result).toBeNull();
    });

    it("should throw error if user is not the creator", async () => {
      const otherUser = await createTestUser("other@example.com");
      await expect(deleteProduct(productId, otherUser.id)).rejects.toThrow(
        "You are not authorized to delete this product"
      );
    });
  });
});
