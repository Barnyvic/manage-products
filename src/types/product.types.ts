import mongoose from "mongoose";

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdBy: string | mongoose.Types.ObjectId;
};
