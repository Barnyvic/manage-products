import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    category: z.string().min(2, "Category must be at least 2 characters"),
    stock: z.number().min(0, "Stock must be greater than or equal to 0"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    price: z
      .number()
      .min(0, "Price must be greater than or equal to 0")
      .optional(),
    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .optional(),
    stock: z
      .number()
      .min(0, "Stock must be greater than or equal to 0")
      .optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    sortBy: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});
