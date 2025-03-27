import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";

dotenv.config();

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create text index for product search
  const collections = await mongoose.connection.db!.collections();
  const productsCollection = collections.find(
    (c) => c.collectionName === "products"
  );
  if (productsCollection) {
    await productsCollection.createIndex({ name: "text", description: "text" });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
