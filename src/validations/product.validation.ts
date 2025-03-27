import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be positive"),
    category: z.string().min(1, "Category is required"),
    stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    price: z.number().positive("Price must be positive").optional(),
    category: z.string().min(1, "Category is required").optional(),
    stock: z
      .number()
      .int()
      .min(0, "Stock must be a non-negative integer")
      .optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().min(1, "Page must be at least 1"))
      .optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().min(1, "Limit must be at least 1"))
      .optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    sortBy: z
      .enum(["name", "price", "category", "createdAt", "updatedAt"], {
        errorMap: () => ({ message: "Invalid sort field" }),
      })
      .optional(),
    order: z
      .enum(["asc", "desc"], {
        errorMap: () => ({ message: "Sort order must be 'asc' or 'desc'" }),
      })
      .optional(),
  }),
});
