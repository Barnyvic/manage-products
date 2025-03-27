import { Types, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ProductResponse {
  products: IProduct[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
