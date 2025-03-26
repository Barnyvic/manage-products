import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import mongoose from "mongoose";

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdBy: mongoose.Types.ObjectId;
};

describe("Product Service", () => {
  const userId = new mongoose.Types.ObjectId();

  const mockProduct: CreateProductInput = {
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    category: "Test Category",
    createdBy: userId,
    stock: 10,
  };

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const result = await createProduct(mockProduct);
      expect(result).toHaveProperty("name", mockProduct.name);
      expect(result).toHaveProperty("price", mockProduct.price);
      expect(result.createdBy.toString()).toBe(userId.toString());
    });

    it("should throw error if required fields are missing", async () => {
      const invalidProduct = { ...mockProduct } as any;
      delete invalidProduct.name;
      await expect(createProduct(invalidProduct)).rejects.toThrow();
    });
  });

  describe("getProducts", () => {
    beforeEach(async () => {
      await createProduct(mockProduct);
    });

    it("should get all products", async () => {
      const result = await getProducts({});
      expect(result.products).toBeInstanceOf(Array);
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products[0]).toHaveProperty("name", mockProduct.name);
      expect(result.pagination).toBeDefined();
    });

    it("should filter products by category", async () => {
      const result = await getProducts({ category: mockProduct.category });
      expect(result.products[0]).toHaveProperty(
        "category",
        mockProduct.category
      );
    });
  });

  describe("getProductById", () => {
    let productId: string;

    beforeEach(async () => {
      const product = await createProduct(mockProduct);
      productId = product._id?.toString() || "";
    });

    it("should get product by id", async () => {
      const product = await getProductById(productId);
      expect(product).toHaveProperty("name", mockProduct.name);
      expect(product?._id?.toString()).toBe(productId);
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await getProductById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe("updateProduct", () => {
    let productId: string;

    beforeEach(async () => {
      const product = await createProduct(mockProduct);
      productId = product._id?.toString() || "";
    });

    it("should update product successfully", async () => {
      const updateData = {
        name: "Updated Product",
        price: 199.99,
      };
      const updated = await updateProduct(productId, updateData);
      expect(updated).toHaveProperty("name", updateData.name);
      expect(updated).toHaveProperty("price", updateData.price);
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await updateProduct(nonExistentId, { name: "Test" });
      expect(result).toBeNull();
    });
  });

  describe("deleteProduct", () => {
    let productId: string;

    beforeEach(async () => {
      const product = await createProduct(mockProduct);
      productId = product._id?.toString() || "";
    });

    it("should delete product successfully", async () => {
      await deleteProduct(productId);
      const deleted = await getProductById(productId);
      expect(deleted).toBeNull();
    });

    it("should return null for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await deleteProduct(nonExistentId);
      expect(result).toBeNull();
    });
  });
});
