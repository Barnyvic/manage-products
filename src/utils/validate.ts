import { Request } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = async (schema: AnyZodObject, req: Request) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }
    return { success: false, error: "Validation failed" };
  }
};
